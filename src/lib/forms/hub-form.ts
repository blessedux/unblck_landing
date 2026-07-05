import type { FormStep, SuccessScreen } from "./types";

export type HubAccessPayload = {
  full_name: string;
  email: string;
  project_name: string;
  location: string;
  passport_username: string;
  terms_accepted: string;
};

export const hubAccessFormSteps: FormStep<HubAccessPayload>[] = [
  {
    id: "intro",
    type: "intro",
    question: "Request access to Tellus Hub in Santiago de Chile",
    hint: "Quick application for workspace access. Takes 2 minutes.",
  },
  {
    id: "full_name",
    type: "text",
    question: "What's your name?",
    placeholder: "Jane Doe",
    required: true,
  },
  {
    id: "email",
    type: "email",
    question: "What's your email?",
    placeholder: "you@company.com",
    required: true,
  },
  {
    id: "project_name",
    type: "text",
    question: "What are you working on?",
    placeholder: "Brief description of your project",
    required: true,
  },
  {
    id: "location",
    type: "choice",
    question: "Where are you based?",
    required: true,
    choices: [
      "Santiago",
      "Relocating to Santiago",
      "Remote — not based in Chile",
    ],
  },
  {
    id: "passport_username",
    type: "text",
    question: "What's your Stellar Passport username?",
    hint: "We use this for identity verification. Don't have one yet?",
    placeholder: "@yourname or your GitHub username",
    required: true,
    linkText: "Create Passport",
    linkUrl: "https://demo.stellarpassport.xyz/",
  },
  {
    id: "terms_accepted",
    type: "checkbox",
    question: "Terms & Conditions",
    hint: "I agree to the",
    linkText: "Terms & Conditions",
    linkUrl: "/terms",
    required: true,
  },
];

export const emptyHubAccessApplication = (): HubAccessPayload => ({
  full_name: "",
  email: "",
  project_name: "",
  location: "",
  passport_username: "",
  terms_accepted: "false",
});

export const hubAccessSuccessScreen: SuccessScreen = {
  label: "Application received",
  title: "Check your email for a magic link",
  description:
    "We've sent you a secure login link. Click it to activate your account and access the hub.",
  extra:
    "Come to StellarBarrio at Tellus Blockchain Hub STGO — our monthly builder event.",
};
