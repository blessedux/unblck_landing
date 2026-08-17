"use client";

import Link from "next/link";
import { useEffect, useMemo, useState, type FormEvent, type KeyboardEvent } from "react";
import { useRouter } from "next/navigation";
import { GoogleAvatar } from "@/components/GoogleAvatar";
import { LogoutButton } from "@/components/LogoutButton";
import { AcceleratorApplyChrome } from "@/components/AcceleratorProfileHandoff";
import {
  PROFILE_UPDATED_EVENT,
  readPendingGoogleProfile,
} from "@/lib/auth/google-profile";
import { useLocale } from "@/contexts/LocaleContext";
import {
  ACCELERATOR_FUNDING_VALUES,
  ACCELERATOR_LOCATION_VALUES,
  ACCELERATOR_STAGE_VALUES,
  ACCELERATOR_TEAM_SIZE_VALUES,
  emptyAcceleratorApplication,
  formatAcceleratorLocation,
  getAcceleratorSuccessScreen,
  type AcceleratorPayload,
} from "@/lib/forms/accelerator-form";
import { ACCELERATOR_COUNTRIES } from "@/lib/forms/countries";


type ProfilePayload = {
  email: string;
  displayName: string | null;
  avatarUrl: string | null;
};

type StepId =
  | "profile"
  | "project"
  | "build_description"
  | "location"
  | "stage"
  | "team_size"
  | "funding_status"
  | "motivation"
  | "passport_username"
  | "terms_accepted";

const STEPS: StepId[] = [
  "profile",
  "project",
  "build_description",
  "location",
  "stage",
  "team_size",
  "funding_status",
  "motivation",
  "passport_username",
  "terms_accepted",
];

function isValidUsername(username: string) {
  return /^@?[a-zA-Z0-9]([a-zA-Z0-9_-]{0,37}[a-zA-Z0-9])?$/.test(username);
}

type AcceleratorApplyFormProps = {
  email: string;
};

export function AcceleratorApplyForm({ email }: AcceleratorApplyFormProps) {
  const router = useRouter();
  const { t } = useLocale();
  const copy = t.acceleratorApply;
  const successScreen = useMemo(
    () => getAcceleratorSuccessScreen(copy.success),
    [copy.success],
  );

  const [stepIndex, setStepIndex] = useState(0);
  const [values, setValues] = useState<AcceleratorPayload>(() => {
    const pending =
      typeof window !== "undefined" ? readPendingGoogleProfile() : null;
    return {
      ...emptyAcceleratorApplication(),
      email,
      full_name: pending?.name?.trim() || "",
    };
  });
  const [avatarUrl, setAvatarUrl] = useState<string | null>(() => {
    if (typeof window === "undefined") return null;
    return readPendingGoogleProfile()?.picture ?? null;
  });
  const [profileLoading, setProfileLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [allowAutoFocus, setAllowAutoFocus] = useState(false);

  const currentStep = STEPS[stepIndex]!;
  const progress = Math.round((stepIndex / (STEPS.length - 1)) * 100);

  useEffect(() => {
    setAllowAutoFocus(!window.matchMedia("(pointer: coarse)").matches);
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [stepIndex]);

  useEffect(() => {
    const onEscape = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") router.push("/");
    };
    window.addEventListener("keydown", onEscape);
    return () => window.removeEventListener("keydown", onEscape);
  }, [router]);

  useEffect(() => {
    let cancelled = false;
    let tries = 0;
    let timer: number | undefined;

    const loadProfile = async () => {
      const res = await fetch("/api/profile");
      if (!res.ok) {
        if (!cancelled) setProfileLoading(false);
        return;
      }
      const data = (await res.json()) as ProfilePayload;
      if (cancelled) return;
      setValues((prev) => ({
        ...prev,
        full_name:
          data.displayName?.trim() ||
          prev.full_name ||
          email.split("@")[0] ||
          "",
        email: data.email || email,
      }));
      setAvatarUrl(data.avatarUrl);
      setProfileLoading(false);
      if (!data.avatarUrl && tries < 16) {
        tries += 1;
        timer = window.setTimeout(() => {
          void loadProfile();
        }, 700);
      }
    };

    const onUpdated = (event: Event) => {
      const detail = (event as CustomEvent<Partial<ProfilePayload>>).detail;
      if (detail?.avatarUrl) {
        setAvatarUrl(detail.avatarUrl);
        tries = 99;
        if (timer) window.clearTimeout(timer);
      }
      if (detail?.displayName?.trim()) {
        setValues((prev) => ({
          ...prev,
          full_name: detail.displayName!.trim(),
        }));
      }
    };

    void loadProfile();
    window.addEventListener(PROFILE_UPDATED_EVENT, onUpdated);
    return () => {
      cancelled = true;
      if (timer) window.clearTimeout(timer);
      window.removeEventListener(PROFILE_UPDATED_EVENT, onUpdated);
    };
  }, [email]);

  const update = (patch: Partial<AcceleratorPayload>) => {
    setValues((prev) => ({ ...prev, ...patch }));
    setError(null);
  };

  const validateCurrent = (): string | null => {
    switch (currentStep) {
      case "profile":
        if (!values.full_name.trim()) return t.form.validationRequired;
        return null;
      case "project":
        if (!values.project_name.trim()) return t.form.validationRequired;
        return null;
      case "build_description":
        if (!values.build_description.trim()) return t.form.validationRequired;
        return null;
      case "location":
        if (!values.location) return t.form.validationRequired;
        if (
          values.location === ACCELERATOR_LOCATION_VALUES.otherRegion &&
          !values.location_detail.trim()
        ) {
          return t.form.validationRequired;
        }
        return null;
      case "stage":
      case "team_size":
      case "funding_status":
        if (!values[currentStep]) return t.form.validationRequired;
        return null;
      case "motivation":
        if (!values.motivation.trim()) return t.form.validationRequired;
        return null;
      case "passport_username":
        if (!values.passport_username.trim()) return t.form.validationRequired;
        if (!isValidUsername(values.passport_username.trim())) {
          return t.form.validationRequired;
        }
        return null;
      case "terms_accepted":
        if (values.terms_accepted !== "true") return t.form.validationRequired;
        return null;
      default:
        return null;
    }
  };

  const goBack = () => {
    setError(null);
    setStepIndex((i) => Math.max(0, i - 1));
  };

  const persistProfileName = async () => {
    const name = values.full_name.trim();
    if (!name) return;
    await fetch("/api/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ displayName: name }),
    });
  };

  const goNext = async () => {
    const validationError = validateCurrent();
    if (validationError) {
      setError(validationError);
      return;
    }

    if (currentStep === "profile") {
      setSubmitting(true);
      setError(null);
      try {
        await persistProfileName();

        const subsRes = await fetch("/api/submissions");
        if (subsRes.ok) {
          const json = (await subsRes.json()) as {
            submissions?: Array<{ application_type: string }>;
          };
          const alreadyApplied = (json.submissions ?? []).some(
            (row) => row.application_type === "accelerator",
          );
          if (alreadyApplied) {
            router.push("/submissions");
            return;
          }
        }
      } catch (err) {
        console.error("Profile continue error:", err);
      } finally {
        setSubmitting(false);
      }
    }

    if (stepIndex >= STEPS.length - 1) {
      await submit();
      return;
    }

    setStepIndex((i) => i + 1);
  };

  const submit = async () => {
    setSubmitting(true);
    setError(null);
    try {
      const payload: AcceleratorPayload = {
        ...values,
        location: formatAcceleratorLocation(
          values.location,
          values.location_detail,
        ),
      };
      const res = await fetch("/api/apply/accelerator", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = (await res.json()) as { error?: string };
      if (!res.ok) {
        throw new Error(json.error || t.form.submissionFailed);
      }
      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : t.form.submissionFailed);
    } finally {
      setSubmitting(false);
    }
  };

  const onKeyDown = (event: KeyboardEvent<HTMLFormElement>) => {
    if (event.key !== "Enter") return;
    if (currentStep === "build_description" || currentStep === "motivation") {
      return;
    }
    if (
      event.target instanceof HTMLTextAreaElement ||
      event.target instanceof HTMLButtonElement
    ) {
      return;
    }
    event.preventDefault();
    void goNext();
  };

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    void goNext();
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
            {successScreen.extraSegments && (
              <p className="mt-4 text-sm text-muted">
                {successScreen.extraSegments.map((segment, index) =>
                  segment.href ? (
                    <a
                      key={`${segment.text}-${index}`}
                      href={segment.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline decoration-white/30 underline-offset-2 transition hover:text-foreground hover:decoration-foreground"
                    >
                      {segment.text}
                    </a>
                  ) : (
                    <span key={`${segment.text}-${index}`}>{segment.text}</span>
                  ),
                )}
              </p>
            )}
            <div className="mt-8 flex flex-wrap items-center gap-3">
              {successScreen.primaryCta && (
                <Link
                  href={successScreen.primaryCta.href}
                  className="inline-block rounded-full bg-foreground px-5 py-2.5 text-sm font-medium text-background transition hover:bg-accent-soft"
                >
                  {successScreen.primaryCta.label}
                </Link>
              )}
              {successScreen.secondaryCta && (
                <Link
                  href={successScreen.secondaryCta.href}
                  className="inline-block rounded-full border border-border px-5 py-2.5 text-sm text-muted transition hover:border-foreground hover:text-foreground"
                >
                  {successScreen.secondaryCta.label}
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <form
      className="contents"
      onSubmit={onSubmit}
      onKeyDown={onKeyDown}
      noValidate
    >
      <AcceleratorApplyChrome
        progress={progress}
        footer={
          <div className="fixed inset-x-0 bottom-0 z-20 border-t border-border/60 bg-black/80 px-6 py-4 backdrop-blur-md">
            <div className="mx-auto flex max-w-2xl items-center justify-between gap-3">
              <button
                type="button"
                onClick={goBack}
                disabled={stepIndex === 0 || submitting || profileLoading}
                className="rounded-full border border-border px-5 py-2.5 text-sm text-muted transition hover:border-foreground hover:text-foreground disabled:opacity-40"
              >
                {t.form.back}
              </button>
              <button
                type="submit"
                disabled={submitting || profileLoading}
                className="rounded-full bg-foreground px-6 py-2.5 text-sm font-medium text-background transition hover:bg-accent-soft disabled:opacity-50"
              >
                {submitting
                  ? t.form.submitting
                  : stepIndex === STEPS.length - 1
                    ? t.form.submit
                    : currentStep === "profile"
                      ? copy.fields.profile.continue
                      : t.form.continue}
              </button>
            </div>
          </div>
        }
      >
          {currentStep !== "profile" && (
            <p className="text-xs text-muted">
              {t.form.stepProgress
                .replace("{current}", String(stepIndex + 1))
                .replace("{total}", String(STEPS.length))}
            </p>
          )}

          {currentStep === "profile" ? (
            <div className="mx-auto w-full max-w-md rounded-3xl border border-white/15 bg-white p-6 text-gray-900 shadow-2xl sm:p-8">
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-gray-400">
                UNBLCK
              </p>
              <h1 className="mt-3 text-2xl font-semibold">
                {copy.fields.profile.title}
              </h1>
              <p className="mt-2 text-sm text-gray-500">
                {copy.fields.profile.subtitle}
              </p>

              <div className="mt-8 flex items-center gap-4">
                <div className="relative h-16 w-16 overflow-hidden rounded-full bg-gray-100">
                  {avatarUrl ? (
                    <GoogleAvatar src={avatarUrl} />
                  ) : profileLoading ? (
                    <div className="h-full w-full animate-pulse bg-gray-200" />
                  ) : (
                    <span className="flex h-full w-full items-center justify-center text-lg font-semibold text-gray-500">
                      {(values.full_name || email).slice(0, 1).toUpperCase()}
                    </span>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  {profileLoading && !values.full_name ? (
                    <div className="space-y-2">
                      <div className="h-4 w-32 animate-pulse rounded bg-gray-200" />
                      <div className="h-3 w-44 animate-pulse rounded bg-gray-200" />
                    </div>
                  ) : (
                    <>
                      <p className="truncate text-sm font-medium">
                        {values.full_name || copy.fields.profile.displayNameLabel}
                      </p>
                      <p className="truncate text-xs text-gray-500">{email}</p>
                    </>
                  )}
                </div>
              </div>

              <div className="mt-6 space-y-5">
                <div>
                  <label
                    htmlFor="accelerator-name"
                    className="mb-2 block text-sm font-medium text-gray-700"
                  >
                    {copy.fields.profile.displayNameLabel}
                  </label>
                  {profileLoading && !values.full_name ? (
                    <div className="h-12 w-full animate-pulse rounded-xl bg-gray-100" />
                  ) : (
                    <input
                      id="accelerator-name"
                      value={values.full_name}
                      onChange={(e) => update({ full_name: e.target.value })}
                      autoFocus={allowAutoFocus}
                      className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:ring-2 focus:ring-black/20"
                      required
                    />
                  )}
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    {copy.fields.profile.emailLabel}
                  </label>
                  {profileLoading && !email ? (
                    <div className="h-12 w-full animate-pulse rounded-xl bg-gray-100" />
                  ) : (
                    <input
                      value={email}
                      disabled
                      className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-500"
                    />
                  )}
                  <p className="mt-2 text-xs text-gray-400">
                    {copy.fields.profile.emailHint}
                  </p>
                </div>

                <div className="border-t border-gray-200 pt-5">
                  <LogoutButton redirectTo="/accelerator/apply" />
                  <p className="mt-2 text-xs text-gray-400">
                    {t.profile.useAnotherAccount}
                  </p>
                </div>
              </div>
            </div>
          ) : currentStep === "project" ? (
            <div className="mx-auto w-full max-w-md rounded-3xl border border-white/15 bg-white p-6 text-gray-900 shadow-2xl sm:p-8">
              <h1 className="text-2xl font-semibold">
                {copy.fields.project.question}
              </h1>
              <div className="mt-6 space-y-5">
                <div>
                  <label
                    htmlFor="project-name"
                    className="mb-2 block text-sm font-medium text-gray-700"
                  >
                    {copy.fields.project.nameLabel}
                  </label>
                  <input
                    id="project-name"
                    value={values.project_name}
                    onChange={(e) => update({ project_name: e.target.value })}
                    placeholder={copy.fields.project.namePlaceholder}
                    autoFocus={allowAutoFocus}
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:ring-2 focus:ring-black/20"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="project-link"
                    className="mb-2 block text-sm font-medium text-gray-700"
                  >
                    {copy.fields.project.linkLabel}
                  </label>
                  <input
                    id="project-link"
                    type="url"
                    value={values.project_link}
                    onChange={(e) => update({ project_link: e.target.value })}
                    placeholder={copy.fields.project.linkPlaceholder}
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:ring-2 focus:ring-black/20"
                  />
                </div>
              </div>
            </div>
          ) : (
            <div>
              <h1 className="mt-3 text-xl font-medium sm:text-2xl">
                {currentStep === "build_description" &&
                  copy.fields.buildDescription.question}
                {currentStep === "location" && copy.fields.location.question}
                {currentStep === "stage" && copy.fields.stage.question}
                {currentStep === "team_size" && copy.fields.teamSize.question}
                {currentStep === "funding_status" &&
                  copy.fields.fundingStatus.question}
                {currentStep === "motivation" && copy.fields.motivation.question}
                {currentStep === "passport_username" &&
                  copy.fields.passport.question}
                {currentStep === "terms_accepted" && copy.fields.terms.question}
              </h1>

              {currentStep === "passport_username" && (
                <div className="mt-2 text-sm text-muted">
                  {copy.fields.passport.hint}{" "}
                  <a
                    href="https://demo.stellarpassport.xyz/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-block rounded-full bg-foreground px-4 py-2 text-xs font-medium text-background"
                  >
                    {copy.fields.passport.linkText}
                  </a>
                </div>
              )}

              <div className="mt-6">
                {currentStep === "build_description" && (
                  <textarea
                    value={values.build_description}
                    onChange={(e) =>
                      update({ build_description: e.target.value })
                    }
                    placeholder={copy.fields.buildDescription.placeholder}
                    rows={5}
                    autoFocus={allowAutoFocus}
                    className="w-full rounded-2xl border border-border bg-transparent px-4 py-3 text-base outline-none focus:border-foreground"
                  />
                )}

                {currentStep === "location" && (
                  <div className="space-y-3">
                    {(
                      [
                        [
                          ACCELERATOR_LOCATION_VALUES.santiago,
                          copy.fields.location.choices.santiago,
                        ],
                        [
                          ACCELERATOR_LOCATION_VALUES.otherRegion,
                          copy.fields.location.choices.otherRegion,
                        ],
                        [
                          ACCELERATOR_LOCATION_VALUES.outsideChile,
                          copy.fields.location.choices.outsideChile,
                        ],
                      ] as const
                    ).map(([value, label]) => (
                      <button
                        key={value}
                        type="button"
                        onClick={() =>
                          update({
                            location: value,
                            location_detail:
                              value === ACCELERATOR_LOCATION_VALUES.otherRegion
                                ? values.location_detail
                                : "",
                          })
                        }
                        className={`min-h-12 w-full touch-manipulation rounded-full border px-4 py-3 text-left text-base transition ${
                          values.location === value
                            ? "border-foreground bg-foreground text-background"
                            : "border-border text-muted hover:border-foreground hover:text-foreground"
                        }`}
                      >
                        {label}
                      </button>
                    ))}
                    {values.location ===
                      ACCELERATOR_LOCATION_VALUES.otherRegion && (
                      <div className="pt-2">
                        <label
                          htmlFor="location-country"
                          className="mb-2 block text-sm text-muted"
                        >
                          {copy.fields.location.countryLabel}
                        </label>
                        <select
                          id="location-country"
                          value={values.location_detail}
                          onChange={(e) =>
                            update({ location_detail: e.target.value })
                          }
                          className="w-full rounded-full border border-border bg-transparent px-4 py-3 text-base outline-none focus:border-foreground"
                        >
                          <option value="">
                            {copy.fields.location.countryPlaceholder}
                          </option>
                          {ACCELERATOR_COUNTRIES.map((country) => (
                            <option key={country} value={country}>
                              {country}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}
                  </div>
                )}

                {currentStep === "stage" && (
                  <ChoiceGrid
                    options={[
                      [
                        ACCELERATOR_STAGE_VALUES.idea,
                        copy.fields.stage.choices.idea,
                      ],
                      [
                        ACCELERATOR_STAGE_VALUES.prototype,
                        copy.fields.stage.choices.prototype,
                      ],
                      [
                        ACCELERATOR_STAGE_VALUES.live,
                        copy.fields.stage.choices.live,
                      ],
                      [
                        ACCELERATOR_STAGE_VALUES.scaling,
                        copy.fields.stage.choices.scaling,
                      ],
                    ]}
                    value={values.stage}
                    onChange={(stage) => update({ stage })}
                  />
                )}

                {currentStep === "team_size" && (
                  <ChoiceGrid
                    options={[
                      [
                        ACCELERATOR_TEAM_SIZE_VALUES.solo,
                        copy.fields.teamSize.choices.solo,
                      ],
                      [
                        ACCELERATOR_TEAM_SIZE_VALUES.small,
                        copy.fields.teamSize.choices.small,
                      ],
                      [
                        ACCELERATOR_TEAM_SIZE_VALUES.medium,
                        copy.fields.teamSize.choices.medium,
                      ],
                      [
                        ACCELERATOR_TEAM_SIZE_VALUES.large,
                        copy.fields.teamSize.choices.large,
                      ],
                    ]}
                    value={values.team_size}
                    onChange={(team_size) => update({ team_size })}
                  />
                )}

                {currentStep === "funding_status" && (
                  <ChoiceGrid
                    options={[
                      [
                        ACCELERATOR_FUNDING_VALUES.preSeed,
                        copy.fields.fundingStatus.choices.preSeed,
                      ],
                      [
                        ACCELERATOR_FUNDING_VALUES.grants,
                        copy.fields.fundingStatus.choices.grants,
                      ],
                      [
                        ACCELERATOR_FUNDING_VALUES.angel,
                        copy.fields.fundingStatus.choices.angel,
                      ],
                      [
                        ACCELERATOR_FUNDING_VALUES.seed,
                        copy.fields.fundingStatus.choices.seed,
                      ],
                      [
                        ACCELERATOR_FUNDING_VALUES.seriesA,
                        copy.fields.fundingStatus.choices.seriesA,
                      ],
                    ]}
                    value={values.funding_status}
                    onChange={(funding_status) => update({ funding_status })}
                  />
                )}

                {currentStep === "motivation" && (
                  <textarea
                    value={values.motivation}
                    onChange={(e) => update({ motivation: e.target.value })}
                    placeholder={copy.fields.motivation.placeholder}
                    rows={5}
                    autoFocus={allowAutoFocus}
                    className="w-full rounded-2xl border border-border bg-transparent px-4 py-3 text-base outline-none focus:border-foreground"
                  />
                )}

                {currentStep === "passport_username" && (
                  <input
                    value={values.passport_username}
                    onChange={(e) =>
                      update({ passport_username: e.target.value })
                    }
                    placeholder={copy.fields.passport.placeholder}
                    autoFocus={allowAutoFocus}
                    className="w-full rounded-2xl border border-border bg-transparent px-4 py-3 text-base outline-none focus:border-foreground"
                  />
                )}

                {currentStep === "terms_accepted" && (
                  <label className="flex cursor-pointer items-start gap-3">
                    <input
                      type="checkbox"
                      checked={values.terms_accepted === "true"}
                      onChange={(e) =>
                        update({
                          terms_accepted: e.target.checked ? "true" : "false",
                        })
                      }
                      className="mt-1 h-5 w-5 rounded border-border"
                    />
                    <span className="text-sm text-muted">
                      {copy.fields.terms.hint}{" "}
                      <a
                        href="/terms"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-foreground underline"
                      >
                        {copy.fields.terms.linkText}
                      </a>
                    </span>
                  </label>
                )}
              </div>
            </div>
          )}

          {error && <p className="mt-4 text-sm text-red-400">{error}</p>}
      </AcceleratorApplyChrome>
    </form>
  );
}

function ChoiceGrid({
  options,
  value,
  onChange,
}: {
  options: ReadonlyArray<readonly [string, string]>;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="grid gap-2">
      {options.map(([optionValue, label]) => {
        const selected = value === optionValue;
        return (
          <button
            key={optionValue}
            type="button"
            onClick={() => onChange(optionValue)}
            className={`min-h-12 touch-manipulation rounded-full border px-4 py-3 text-left text-base transition ${
              selected
                ? "border-foreground bg-foreground text-background"
                : "border-border text-muted hover:border-foreground hover:text-foreground"
            }`}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
