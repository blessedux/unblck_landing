"use client";

import { MultiStepForm } from "@/components/MultiStepForm";
import {
  emptyHubAccessApplication,
  hubAccessFormSteps,
  hubAccessSuccessScreen,
} from "@/lib/forms/hub-form";

export function HubAccessApplicationForm() {
  return (
    <MultiStepForm
      formSteps={hubAccessFormSteps}
      emptyValues={emptyHubAccessApplication}
      apiEndpoint="/api/apply/hub"
      successScreen={hubAccessSuccessScreen}
    />
  );
}
