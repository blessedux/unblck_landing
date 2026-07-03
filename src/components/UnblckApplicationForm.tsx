"use client";

import { MultiStepForm } from "@/components/MultiStepForm";
import {
  emptyUnblckApplication,
  unblckFormSteps,
  unblckSuccessScreen,
} from "@/lib/forms/unblck-form";

export function UnblckApplicationForm() {
  return (
    <MultiStepForm
      formSteps={unblckFormSteps}
      emptyValues={emptyUnblckApplication}
      apiEndpoint="/api/apply"
      successScreen={unblckSuccessScreen}
    />
  );
}
