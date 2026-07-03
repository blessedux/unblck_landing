export type FormStep<T extends Record<string, string>> = {
  id: keyof T | "intro";
  type: "intro" | "text" | "email" | "url" | "textarea" | "choice";
  question: string;
  hint?: string;
  placeholder?: string;
  required?: boolean;
  choices?: string[];
};

export type SuccessScreen = {
  label: string;
  title: string;
  description: string;
  extra?: string;
};
