"use client";

import { useEffect, useMemo } from "react";
import { MultiStepForm } from "@/components/MultiStepForm";
import { useLocale } from "@/contexts/LocaleContext";
import {
  emptyHubAccessApplication,
  getHubAccessFormSteps,
  getHubAccessSuccessScreen,
} from "@/lib/forms/hub-form";

export function HubAccessApplicationForm() {
  const { locale, t } = useLocale();

  const formSteps = useMemo(
    () => getHubAccessFormSteps(t.hubApply),
    [locale, t.hubApply],
  );

  const successScreen = useMemo(
    () => getHubAccessSuccessScreen(t.hubApply.success),
    [locale, t.hubApply.success],
  );

  useEffect(() => {
    document.title = t.hubApply.pageTitle;
    document.body.style.overflow = "auto";
    document.body.style.touchAction = "auto";
  }, [t.hubApply.pageTitle]);

  return (
    <MultiStepForm
      formSteps={formSteps}
      emptyValues={emptyHubAccessApplication}
      apiEndpoint="/api/apply/hub"
      successScreen={successScreen}
    />
  );
}
