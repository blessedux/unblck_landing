export type ChoiceOption = {
  value: string;
  label: string;
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
};

export type SuccessScreen = {
  label: string;
  title: string;
  description: string;
  extra?: string;
};
