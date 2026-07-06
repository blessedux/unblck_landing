"use client";

import Link from "next/link";
import { useEffect, useMemo, useState, type FormEvent, type KeyboardEvent } from "react";
import { useLocale } from "@/contexts/LocaleContext";
import type { ChoiceOption, FormStep, SuccessScreen } from "@/lib/forms/types";

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

function normalizeChoices(
  choices?: string[] | ChoiceOption[],
): ChoiceOption[] {
  if (!choices) return [];
  return choices.map((choice) =>
    typeof choice === "string" ? { value: choice, label: choice } : choice,
  );
}

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
  if (step.type === "checkbox") return value === "true";
  return value.trim().length > 0;
}

export function MultiStepForm<T extends Record<string, string>>({
  formSteps,
  emptyValues,
  apiEndpoint,
  successScreen,
  onValidateStep,
}: MultiStepFormProps<T>) {
  const { t } = useLocale();
  const answerableSteps = useMemo(
    () => getAnswerableSteps(formSteps),
    [formSteps],
  );
  const [stepIndex, setStepIndex] = useState(0);
  const [values, setValues] = useState<T>(emptyValues);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resending, setResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);
  const [allowAutoFocus, setAllowAutoFocus] = useState(false);

  useEffect(() => {
    setAllowAutoFocus(!window.matchMedia("(pointer: coarse)").matches);
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [stepIndex]);

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
    if (submitting) return;

    if (!canAdvance(currentStep, values)) {
      setError(t.form.validationRequired);
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
      if (document.activeElement instanceof HTMLElement) {
        document.activeElement.blur();
      }
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
          : t.form.submissionFailed,
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

  const resendEmail = async () => {
    setResending(true);
    setResendSuccess(false);
    
    try {
      const emailValue = values["email" as keyof T] || "";
      const response = await fetch("/api/resend-magic-link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: emailValue }),
      });

      if (!response.ok) {
        throw new Error("Failed to resend email");
      }

      setResendSuccess(true);
      setTimeout(() => setResendSuccess(false), 3000);
    } catch (err) {
      console.error("Resend error:", err);
    } finally {
      setResending(false);
    }
  };

  const handleFormSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    void goNext();
  };

  const onKeyDown = (event: KeyboardEvent) => {
    if (
      event.key === "Enter" &&
      !event.shiftKey &&
      currentStep.type !== "textarea" &&
      currentStep.type !== "choice" &&
      currentStep.type !== "checkbox"
    ) {
      event.preventDefault();
      void goNext();
    }
  };

  if (submitted) {
    return (
      <div className="flex min-h-dvh flex-col">
        <header className="px-6 py-5">
          <Link
            href="/"
            className="text-sm font-medium tracking-[0.15em] text-muted transition hover:text-foreground"
          >
            UNBLCK
          </Link>
        </header>
        <div className="flex flex-1 items-start px-6 pb-24 pt-8 sm:items-center">
          <div className="mx-auto w-full max-w-2xl">
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
            
            <div className="mt-8 flex items-center gap-3">
              <Link
                href="/"
                className="inline-block border border-border px-5 py-2.5 text-sm text-muted transition hover:border-foreground hover:text-foreground"
              >
                {t.form.backToHome}
              </Link>

              <button
                onClick={resendEmail}
                disabled={resending}
                className="inline-block border border-border px-5 py-2.5 text-sm text-muted transition hover:border-foreground hover:text-foreground disabled:opacity-50"
              >
                {resending ? t.form.resending : t.form.resendEmail}
              </button>
            </div>

            {resendSuccess && (
              <p className="mt-4 text-sm text-green-500">{t.form.emailSent}</p>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <form
      className="relative z-10 flex min-h-dvh flex-col touch-manipulation"
      onSubmit={handleFormSubmit}
      noValidate
    >
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

      <div className="flex flex-1 items-start px-6 pb-24 pt-8 sm:items-center sm:pt-0">
        <div className="mx-auto w-full max-w-2xl">
          <div>
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
                  {t.form.stepProgress
                    .replace(
                      "{current}",
                      String(
                        answerableSteps.findIndex(
                          (s) => s.id === currentStep.id,
                        ) + 1,
                      ),
                    )
                    .replace("{total}", String(answerableSteps.length))}
                </p>
                <h1 className="mt-3 text-xl font-medium sm:text-2xl">
                  {currentStep.question}
                </h1>
                {currentStep.hint && (
                  <div className="mt-2 text-sm text-muted">
                    {currentStep.hint}{" "}
                    {currentStep.linkText && currentStep.linkUrl && currentStep.type !== "checkbox" && (
                      <a
                        href={currentStep.linkUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block mt-2 bg-foreground px-3 py-1.5 text-xs font-medium text-background transition hover:bg-accent-soft"
                      >
                        {currentStep.linkText}
                      </a>
                    )}
                  </div>
                )}

                <div className="mt-6">
                  {currentStep.type === "choice" ? (
                    <div className="grid gap-2">
                      {normalizeChoices(currentStep.choices).map((choice) => {
                        const selected = values[fieldKey] === choice.value;
                        return (
                          <button
                            key={choice.value}
                            type="button"
                            onClick={() => updateValue(fieldKey, choice.value)}
                            className={`min-h-12 touch-manipulation border px-4 py-3 text-left text-base transition ${
                              selected
                                ? "border-foreground bg-foreground text-background"
                                : "border-border text-muted hover:border-foreground hover:text-foreground"
                            }`}
                          >
                            {choice.label}
                          </button>
                        );
                      })}
                    </div>
                  ) : currentStep.type === "checkbox" ? (
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={values[fieldKey] === "true"}
                        onChange={(event) =>
                          updateValue(fieldKey, event.target.checked ? "true" : "false")
                        }
                        className="mt-1 h-5 w-5 cursor-pointer"
                      />
                      <span className="text-base text-muted">
                        {currentStep.hint}{" "}
                        {currentStep.linkText && currentStep.linkUrl && (
                          <a
                            href={currentStep.linkUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-white hover:underline"
                          >
                            {currentStep.linkText}
                          </a>
                        )}
                      </span>
                    </label>
                  ) : currentStep.type === "textarea" ? (
                    <textarea
                      autoFocus={allowAutoFocus}
                      rows={5}
                      value={values[fieldKey]}
                      onChange={(event) =>
                        updateValue(fieldKey, event.target.value)
                      }
                      placeholder={currentStep.placeholder}
                      className="w-full resize-none border border-border bg-surface px-4 py-3 text-base outline-none focus:border-foreground touch-manipulation"
                    />
                  ) : (
                    <input
                      autoFocus={allowAutoFocus}
                      type={currentStep.type === "email" ? "email" : "text"}
                      value={values[fieldKey]}
                      onChange={(event) =>
                        updateValue(fieldKey, event.target.value)
                      }
                      onKeyDown={onKeyDown}
                      placeholder={currentStep.placeholder}
                      className="w-full touch-manipulation border-b border-border bg-transparent py-3 text-xl outline-none placeholder:text-muted/50 focus:border-foreground"
                    />
                  )}
                </div>
              </div>
            )}

            {error && <p className="mt-4 text-sm text-muted">{error}</p>}

            <div className="mt-8 flex flex-wrap items-center gap-3">
              {stepIndex > 0 && (
                <button
                  type="button"
                  onClick={goBack}
                  className="min-h-12 touch-manipulation border border-border px-4 py-2 text-sm text-muted transition hover:border-foreground hover:text-foreground"
                >
                  {t.form.back}
                </button>
              )}
              <button
                type="submit"
                disabled={submitting}
                className="min-h-12 min-w-[8rem] touch-manipulation bg-foreground px-6 py-3 text-sm font-medium text-background transition hover:bg-accent-soft disabled:opacity-50"
              >
                {stepIndex === formSteps.length - 1
                  ? submitting
                    ? t.form.submitting
                    : t.form.submit
                  : t.form.continue}
              </button>
              {currentStep.type !== "intro" &&
                currentStep.type !== "textarea" &&
                currentStep.type !== "choice" &&
                currentStep.type !== "checkbox" && (
                  <span className="text-xs text-muted">{t.form.enterHint}</span>
                )}
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
