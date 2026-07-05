import type { FormStep, SuccessScreen } from "./types";

export type UnblckPayload = {
  full_name: string;
  email: string;
  project_name: string;
  project_link: string;
  build_description: string;
  location: string;
  stage: string;
  motivation: string;
  passport_username: string;
  terms_accepted: string;
};

export const unblckFormSteps: FormStep<UnblckPayload>[] = [
  {
    id: "intro",
    type: "intro",
    question: "Request access to Tellus Hub in Santiago de Chile",
    hint: "A few questions — takes about 3 minutes. We'll review your application and get back to you.",
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
    question: "What's your project or company called?",
    placeholder: "Acme Labs",
    required: true,
  },
  {
    id: "project_link",
    type: "url",
    question: "Got a link? (optional)",
    placeholder: "https://",
    required: false,
  },
  {
    id: "build_description",
    type: "textarea",
    question: "What are you building?",
    placeholder:
      "Tell us about your product — blockchain, AI, or both. Who's it for?",
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
    id: "stage",
    type: "choice",
    question: "Where are you today?",
    required: true,
    choices: ["Idea", "Prototype", "Live product", "Scaling"],
  },
  {
    id: "motivation",
    type: "textarea",
    question: "Why UNBLCK?",
    placeholder:
      "What would joining the hub help you achieve in the next 90 days?",
    required: true,
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

export const emptyUnblckApplication = (): UnblckPayload => ({
  full_name: "",
  email: "",
  project_name: "",
  project_link: "",
  build_description: "",
  location: "",
  stage: "",
  motivation: "",
  passport_username: "",
  terms_accepted: "false",
});

export const unblckSuccessScreen: SuccessScreen = {
  label: "Application received",
  title: "Check your email for a magic link",
  description:
    "We've sent you a secure login link. Click it to activate your account and check your application status.",
  extra:
    "Come to StellarBarrio at Tellus Blockchain Hub STGO — our monthly builder event and the gateway to Insta Awards.",
};
