export type ChoiceOption = {
  value: string;
  label: string;
};

export type ChoiceGate = {
  blockWhenValue: string;
  message: string;
  linkText: string;
  linkUrl: string;
};

export type TermsHighlight = {
  icon: string;
  text: string;
};

export type FormStep<T extends Record<string, string>> = {
  id: keyof T | "intro";
  type: "intro" | "text" | "email" | "url" | "textarea" | "choice" | "checkbox";
  question: string;
  hint?: string;
  placeholder?: string;
  required?: boolean;
  choices?: string[] | ChoiceOption[];
  linkText?: string;
  linkUrl?: string;
  fullTermsLink?: string;
  highlights?: TermsHighlight[];
  /** Blocks continue when a choice value is selected; shows external CTA instead */
  gate?: ChoiceGate;
};

export type SuccessScreen = {
  label: string;
  title: string;
  description: string;
  /** @deprecated Prefer extraSegments for linked copy */
  extra?: string;
  extraSegments?: Array<{ text: string; href?: string }>;
  primaryCta?: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
};
