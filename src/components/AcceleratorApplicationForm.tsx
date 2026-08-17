"use client";

import { useEffect } from "react";
import { AcceleratorApplyForm } from "@/components/AcceleratorApplyForm";
import { ApplyAuthGate } from "@/components/ApplyAuthGate";
import { useLocale } from "@/contexts/LocaleContext";

export function AcceleratorApplicationForm() {
  const { t } = useLocale();

  useEffect(() => {
    document.title = t.acceleratorApply.pageTitle;
  }, [t.acceleratorApply.pageTitle]);

  return (
    <ApplyAuthGate nextPath="/accelerator/apply">
      {({ email }) => <AcceleratorApplyForm email={email} />}
    </ApplyAuthGate>
  );
}
