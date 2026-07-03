"use client";

import Link from "next/link";
import { useMemo, useState, type KeyboardEvent } from "react";
import type { FormStep, SuccessScreen } from "@/lib/forms/types";

type MultiStepFormProps<T extends Record<string, string>> = {
  formSteps: FormStep<T>[];
  emptyValues: () => T;
  apiEndpoint: string;
  successScreen: SuccessScreen;
  onValidateStep?: (
    step: FormStep<T>,
    values: T,
  ) => Promise<string | null>;
};

function getAnswerableSteps<T extends Record<string, string>>(
  steps: FormStep<T>[],
) {
  return steps.filter((step) => step.id !== "intro");
}

function canAdvance<T extends Record<string, string>>(
  step: FormStep<T>,
  values: T,
) {
  if (step.id === "intro") return true;
  if (!step.required) return true;

  const value = values[step.id as keyof T] ?? "";
  return value.trim().length > 0;
}

export function MultiStepForm<T extends Record<string, string>>({
  formSteps,
  emptyValues,
  apiEndpoint,
  successScreen,
  onValidateStep,
}: MultiStepFormProps<T>) {
  const answerableSteps = useMemo(
    () => getAnswerableSteps(formSteps),
    [formSteps],
  );
  const [stepIndex, setStepIndex] = useState(0);
  const [values, setValues] = useState<T>(emptyValues);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const currentStep = formSteps[stepIndex];
  const progress =
    stepIndex === 0
      ? 0
      : Math.round((stepIndex / (formSteps.length - 1)) * 100);

  const fieldKey = currentStep.id as keyof T;

  const updateValue = (key: keyof T, value: string) => {
    setValues((prev) => ({ ...prev, [key]: value }));
    setError(null);
  };

  const goNext = async () => {
    if (!canAdvance(currentStep, values)) {
      setError("Please complete this question to continue.");
      return;
    }

    if (onValidateStep) {
      const validationError = await onValidateStep(currentStep, values);
      if (validationError) {
        setError(validationError);
        return;
      }
    }

    if (stepIndex < formSteps.length - 1) {
      setStepIndex((prev) => prev + 1);
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const response = await fetch(apiEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const data = (await response.json()) as { error?: string };

      if (!response.ok) {
        throw new Error(data.error ?? "Submission failed");
      }

      setSubmitted(true);
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Something went wrong",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const goBack = () => {
    if (stepIndex > 0) {
      setStepIndex((prev) => prev - 1);
      setError(null);
    }
  };

  const onKeyDown = (event: KeyboardEvent) => {
    if (
      event.key === "Enter" &&
      !event.shiftKey &&
      currentStep.type !== "textarea" &&
      currentStep.type !== "choice"
    ) {
      event.preventDefault();
      void goNext();
    }
  };

  if (submitted) {
    return (
      <div className="flex min-h-screen flex-col">
        <header className="px-6 py-5">
          <Link
            href="/"
            className="text-sm font-medium tracking-[0.15em] text-muted transition hover:text-foreground"
          >
            UNBLCK
          </Link>
        </header>
        <div className="flex flex-1 items-center px-6 pb-24">
          <div className="mx-auto w-full max-w-2xl animate-fade-up">
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted">
              {successScreen.label}
            </p>
            <h1 className="mt-4 text-2xl font-medium sm:text-3xl">
              {successScreen.title}
            </h1>
            <p className="mt-3 text-muted">{successScreen.description}</p>
            {successScreen.extra && (
              <p className="mt-4 text-sm text-muted">{successScreen.extra}</p>
            )}
            <Link
              href="/"
              className="mt-8 inline-block border border-border px-5 py-2.5 text-sm text-muted transition hover:border-foreground hover:text-foreground"
            >
              Back to home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <div className="h-px w-full bg-border">
        <div
          className="h-full bg-foreground transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      <header className="px-6 py-5">
        <Link
          href="/"
          className="text-sm font-medium tracking-[0.15em] text-muted transition hover:text-foreground"
        >
          UNBLCK
        </Link>
      </header>

      <div className="flex flex-1 items-center px-6 pb-24">
        <div className="mx-auto w-full max-w-2xl">
          <div key={stepIndex} className="animate-fade-up">
            {currentStep.type === "intro" ? (
              <div>
                <h1 className="text-2xl font-medium sm:text-3xl">
                  {currentStep.question}
                </h1>
                {currentStep.hint && (
                  <p className="mt-3 text-muted">{currentStep.hint}</p>
                )}
              </div>
            ) : (
              <div>
                <p className="text-xs text-muted">
                  {answerableSteps.findIndex((s) => s.id === currentStep.id) + 1}{" "}
                  of {answerableSteps.length}
                </p>
                <h1 className="mt-3 text-xl font-medium sm:text-2xl">
                  {currentStep.question}
                </h1>
                {currentStep.hint && (
                  <p className="mt-2 text-sm text-muted">{currentStep.hint}</p>
                )}

                <div className="mt-6">
                  {currentStep.type === "choice" ? (
                    <div className="grid gap-2">
                      {currentStep.choices?.map((choice) => {
                        const selected = values[fieldKey] === choice;
                        return (
                          <button
                            key={choice}
                            type="button"
                            onClick={() => updateValue(fieldKey, choice)}
                            className={`border px-4 py-3 text-left text-sm transition ${
                              selected
                                ? "border-foreground bg-foreground text-background"
                                : "border-border text-muted hover:border-foreground hover:text-foreground"
                            }`}
                          >
                            {choice}
                          </button>
                        );
                      })}
                    </div>
                  ) : currentStep.type === "textarea" ? (
                    <textarea
                      autoFocus
                      rows={5}
                      value={values[fieldKey]}
                      onChange={(event) =>
                        updateValue(fieldKey, event.target.value)
                      }
                      placeholder={currentStep.placeholder}
                      className="w-full resize-none border border-border bg-surface px-4 py-3 text-base outline-none focus:border-foreground"
                    />
                  ) : (
                    <input
                      autoFocus
                      type={currentStep.type === "email" ? "email" : "text"}
                      value={values[fieldKey]}
                      onChange={(event) =>
                        updateValue(fieldKey, event.target.value)
                      }
                      onKeyDown={onKeyDown}
                      placeholder={currentStep.placeholder}
                      className="w-full border-b border-border bg-transparent py-3 text-xl outline-none placeholder:text-muted/50 focus:border-foreground"
                    />
                  )}
                </div>
              </div>
            )}

            {error && <p className="mt-4 text-sm text-muted">{error}</p>}

            <div className="mt-8 flex items-center gap-3">
              {stepIndex > 0 && (
                <button
                  type="button"
                  onClick={goBack}
                  className="border border-border px-4 py-2 text-sm text-muted transition hover:border-foreground hover:text-foreground"
                >
                  Back
                </button>
              )}
              <button
                type="button"
                onClick={() => void goNext()}
                disabled={submitting}
                className="bg-foreground px-5 py-2 text-sm font-medium text-background transition hover:bg-accent-soft disabled:opacity-50"
              >
                {stepIndex === formSteps.length - 1
                  ? submitting
                    ? "Submitting..."
                    : "Submit"
                  : "Continue"}
              </button>
              {currentStep.type !== "intro" &&
                currentStep.type !== "textarea" &&
                currentStep.type !== "choice" && (
                  <span className="text-xs text-muted">Enter ↵</span>
                )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
