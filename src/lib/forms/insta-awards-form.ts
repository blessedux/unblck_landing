import type { FormStep, SuccessScreen } from "./types";

export type InstaAwardsPayload = {
  referral_code: string;
  full_name: string;
  email: string;
  project_name: string;
  project_link: string;
  stellar_build: string;
  stellar_use_case: string;
  stage: string;
  is_unblck_member: string;
  grant_motivation: string;
};

export const instaAwardsFormSteps: FormStep<InstaAwardsPayload>[] = [
  {
    id: "intro",
    type: "intro",
    question: "Apply to Insta Awards",
    hint: "A $5,000 non-dilutive grant for Stellar builders. You'll need a referral code from a StellarBarrio event at UNBLCK STGO.",
  },
  {
    id: "referral_code",
    type: "text",
    question: "What's your referral code?",
    placeholder: "STELLARBARRIO-MAR26",
    hint: "Exclusive codes are shared at StellarBarrio events. No code? Come to the next event at UNBLCK STGO.",
    required: true,
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
    placeholder: "Acme Payments",
    required: true,
  },
  {
    id: "project_link",
    type: "url",
    question: "Share a link to your project",
    placeholder: "https:// — demo, repo, or deck",
    required: true,
  },
  {
    id: "stellar_build",
    type: "textarea",
    question: "What are you building on Stellar?",
    placeholder: "Tell us about the product and who it's for...",
    required: true,
  },
  {
    id: "stellar_use_case",
    type: "textarea",
    question: "What's your on-chain use case?",
    placeholder:
      "How is Stellar core to your product? Payments, assets, anchors, etc.",
    required: true,
  },
  {
    id: "stage",
    type: "choice",
    question: "Where are you today?",
    required: true,
    choices: [
      "Idea",
      "Prototype",
      "Live on Stellar testnet",
      "Live on Stellar mainnet",
    ],
  },
  {
    id: "is_unblck_member",
    type: "choice",
    question: "Are you currently a UNBLCK member?",
    required: true,
    choices: ["Yes", "No"],
  },
  {
    id: "grant_motivation",
    type: "textarea",
    question: "What would the $5,000 grant help you achieve in the next 90 days?",
    placeholder: "Be specific — milestones, launches, users...",
    required: true,
  },
];

export const emptyInstaAwardsApplication = (): InstaAwardsPayload => ({
  referral_code: "",
  full_name: "",
  email: "",
  project_name: "",
  project_link: "",
  stellar_build: "",
  stellar_use_case: "",
  stage: "",
  is_unblck_member: "",
  grant_motivation: "",
});

export const instaAwardsSuccessScreen: SuccessScreen = {
  label: "You're in the pipeline",
  title: "Application received.",
  description:
    "Your referral code has been verified. We're reviewing your project for the $5,000 Insta Awards grant. We'll be in touch soon.",
};
