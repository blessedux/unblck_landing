"use client";

import { MultiStepForm } from "@/components/MultiStepForm";
import {
  emptyInstaAwardsApplication,
  instaAwardsFormSteps,
  instaAwardsSuccessScreen,
  type InstaAwardsPayload,
} from "@/lib/forms/insta-awards-form";
import type { FormStep } from "@/lib/forms/types";

async function validateReferralStep(
  step: FormStep<InstaAwardsPayload>,
  values: InstaAwardsPayload,
): Promise<string | null> {
  if (step.id !== "referral_code") return null;

  const response = await fetch("/api/referral-codes/validate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ code: values.referral_code }),
  });

  const data = (await response.json()) as {
    valid?: boolean;
    code?: string;
    error?: string;
  };

  if (!response.ok || !data.valid) {
    return data.error ?? "Invalid referral code.";
  }

  return null;
}

export function InstaAwardsApplicationForm() {
  return (
    <MultiStepForm
      formSteps={instaAwardsFormSteps}
      emptyValues={emptyInstaAwardsApplication}
      apiEndpoint="/api/insta-awards/apply"
      successScreen={instaAwardsSuccessScreen}
      onValidateStep={validateReferralStep}
    />
  );
}
