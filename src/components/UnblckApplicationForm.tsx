"use client";

import { ApplyAuthGate } from "@/components/ApplyAuthGate";
import { MultiStepForm } from "@/components/MultiStepForm";
import {
  emptyUnblckApplication,
  unblckFormSteps,
  unblckSuccessScreen,
} from "@/lib/forms/unblck-form";

export function UnblckApplicationForm() {
  return (
    <ApplyAuthGate nextPath="/apply">
      {({ email }) => (
        <MultiStepForm
          formSteps={unblckFormSteps}
          emptyValues={emptyUnblckApplication}
          apiEndpoint="/api/apply"
          successScreen={unblckSuccessScreen}
          authenticatedEmail={email}
        />
      )}
    </ApplyAuthGate>
  );
}
