import type { FormStep, SuccessScreen } from "./types";

export type AcceleratorPayload = {
  full_name: string;
  email: string;
  project_name: string;
  project_link: string;
  build_description: string;
  location: string;
  stage: string;
  team_size: string;
  funding_status: string;
  motivation: string;
  passport_username: string;
  terms_accepted: string;
};

export const acceleratorFormSteps: FormStep<AcceleratorPayload>[] = [
  {
    id: "intro",
    type: "intro",
    question: "Apply to UNBLCK Accelerator",
    hint: "A comprehensive application for our full accelerator program. Takes about 5 minutes.",
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
    question: "Project link (website, deck, or demo)",
    placeholder: "https://",
    required: false,
  },
  {
    id: "build_description",
    type: "textarea",
    question: "What are you building?",
    placeholder:
      "Tell us about your product — blockchain, AI, or both. Who's it for? What problem does it solve?",
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
    question: "What stage is your project?",
    required: true,
    choices: ["Idea", "Prototype/MVP", "Live product", "Growing/Scaling"],
  },
  {
    id: "team_size",
    type: "choice",
    question: "How big is your team?",
    required: true,
    choices: ["Solo founder", "2-3 people", "4-6 people", "7+ people"],
  },
  {
    id: "funding_status",
    type: "choice",
    question: "What's your funding status?",
    required: true,
    choices: [
      "Pre-seed / Bootstrapped",
      "Received grants",
      "Angel funding",
      "Seed funded",
      "Series A+",
    ],
  },
  {
    id: "motivation",
    type: "textarea",
    question: "Why UNBLCK?",
    placeholder:
      "What would joining the accelerator help you achieve? What are your goals for the next 90 days?",
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

export const emptyAcceleratorApplication = (): AcceleratorPayload => ({
  full_name: "",
  email: "",
  project_name: "",
  project_link: "",
  build_description: "",
  location: "",
  stage: "",
  team_size: "",
  funding_status: "",
  motivation: "",
  passport_username: "",
  terms_accepted: "false",
});

export const acceleratorSuccessScreen: SuccessScreen = {
  label: "Application received",
  title: "Check your email for a magic link",
  description:
    "We've sent you a secure login link. Click it to activate your account and check your application status.",
  extra:
    "Come to StellarBarrio at Tellus Blockchain Hub STGO — our monthly builder event and the gateway to Insta Awards.",
};
