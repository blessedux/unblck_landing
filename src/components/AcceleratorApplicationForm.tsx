"use client";

import { MultiStepForm } from "@/components/MultiStepForm";
import {
  emptyAcceleratorApplication,
  acceleratorFormSteps,
  acceleratorSuccessScreen,
} from "@/lib/forms/accelerator-form";

export function AcceleratorApplicationForm() {
  return (
    <MultiStepForm
      formSteps={acceleratorFormSteps}
      emptyValues={emptyAcceleratorApplication}
      apiEndpoint="/api/apply/accelerator"
      successScreen={acceleratorSuccessScreen}
    />
  );
}
