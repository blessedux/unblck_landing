"use client";

import { useEffect, useMemo } from "react";
import { MultiStepForm } from "@/components/MultiStepForm";
import { useLocale } from "@/contexts/LocaleContext";
import {
  emptyAcceleratorApplication,
  getAcceleratorFormSteps,
  getAcceleratorSuccessScreen,
} from "@/lib/forms/accelerator-form";

export function AcceleratorApplicationForm() {
  const { locale, t } = useLocale();

  const formSteps = useMemo(
    () => getAcceleratorFormSteps(t.acceleratorApply),
    [locale, t.acceleratorApply],
  );

  const successScreen = useMemo(
    () => getAcceleratorSuccessScreen(t.acceleratorApply.success),
    [locale, t.acceleratorApply.success],
  );

  useEffect(() => {
    document.title = t.acceleratorApply.pageTitle;
  }, [t.acceleratorApply.pageTitle]);

  return (
    <MultiStepForm
      formSteps={formSteps}
      emptyValues={emptyAcceleratorApplication}
      apiEndpoint="/api/apply/accelerator"
      successScreen={successScreen}
    />
  );
}
