import type { Translations } from "@/lib/i18n";
import type { FormStep, SuccessScreen } from "./types";
import { HUB_LOCATION_VALUES } from "./hub-form";

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

/** Canonical values stored in the database — always English. */
export const ACCELERATOR_STAGE_VALUES = {
  idea: "Idea",
  prototype: "Prototype/MVP",
  live: "Live product",
  scaling: "Growing/Scaling",
} as const;

export const ACCELERATOR_TEAM_SIZE_VALUES = {
  solo: "Solo founder",
  small: "2-3 people",
  medium: "4-6 people",
  large: "7+ people",
} as const;

export const ACCELERATOR_FUNDING_VALUES = {
  preSeed: "Pre-seed / Bootstrapped",
  grants: "Received grants",
  angel: "Angel funding",
  seed: "Seed funded",
  seriesA: "Series A+",
} as const;

export function getAcceleratorFormSteps(
  copy: Translations["acceleratorApply"],
): FormStep<AcceleratorPayload>[] {
  return [
    {
      id: "intro",
      type: "intro",
      question: copy.intro.question,
      hint: copy.intro.hint,
    },
    {
      id: "full_name",
      type: "text",
      question: copy.fields.fullName.question,
      placeholder: copy.fields.fullName.placeholder,
      required: true,
    },
    {
      id: "email",
      type: "email",
      question: copy.fields.email.question,
      placeholder: copy.fields.email.placeholder,
      required: true,
    },
    {
      id: "project_name",
      type: "text",
      question: copy.fields.projectName.question,
      placeholder: copy.fields.projectName.placeholder,
      required: true,
    },
    {
      id: "project_link",
      type: "url",
      question: copy.fields.projectLink.question,
      placeholder: copy.fields.projectLink.placeholder,
      required: false,
    },
    {
      id: "build_description",
      type: "textarea",
      question: copy.fields.buildDescription.question,
      placeholder: copy.fields.buildDescription.placeholder,
      required: true,
    },
    {
      id: "location",
      type: "choice",
      question: copy.fields.location.question,
      required: true,
      choices: [
        {
          value: HUB_LOCATION_VALUES.santiago,
          label: copy.fields.location.choices.santiago,
        },
        {
          value: HUB_LOCATION_VALUES.relocating,
          label: copy.fields.location.choices.relocating,
        },
        {
          value: HUB_LOCATION_VALUES.remote,
          label: copy.fields.location.choices.remote,
        },
      ],
    },
    {
      id: "stage",
      type: "choice",
      question: copy.fields.stage.question,
      required: true,
      choices: [
        { value: ACCELERATOR_STAGE_VALUES.idea, label: copy.fields.stage.choices.idea },
        {
          value: ACCELERATOR_STAGE_VALUES.prototype,
          label: copy.fields.stage.choices.prototype,
        },
        { value: ACCELERATOR_STAGE_VALUES.live, label: copy.fields.stage.choices.live },
        {
          value: ACCELERATOR_STAGE_VALUES.scaling,
          label: copy.fields.stage.choices.scaling,
        },
      ],
    },
    {
      id: "team_size",
      type: "choice",
      question: copy.fields.teamSize.question,
      required: true,
      choices: [
        {
          value: ACCELERATOR_TEAM_SIZE_VALUES.solo,
          label: copy.fields.teamSize.choices.solo,
        },
        {
          value: ACCELERATOR_TEAM_SIZE_VALUES.small,
          label: copy.fields.teamSize.choices.small,
        },
        {
          value: ACCELERATOR_TEAM_SIZE_VALUES.medium,
          label: copy.fields.teamSize.choices.medium,
        },
        {
          value: ACCELERATOR_TEAM_SIZE_VALUES.large,
          label: copy.fields.teamSize.choices.large,
        },
      ],
    },
    {
      id: "funding_status",
      type: "choice",
      question: copy.fields.fundingStatus.question,
      required: true,
      choices: [
        {
          value: ACCELERATOR_FUNDING_VALUES.preSeed,
          label: copy.fields.fundingStatus.choices.preSeed,
        },
        {
          value: ACCELERATOR_FUNDING_VALUES.grants,
          label: copy.fields.fundingStatus.choices.grants,
        },
        {
          value: ACCELERATOR_FUNDING_VALUES.angel,
          label: copy.fields.fundingStatus.choices.angel,
        },
        {
          value: ACCELERATOR_FUNDING_VALUES.seed,
          label: copy.fields.fundingStatus.choices.seed,
        },
        {
          value: ACCELERATOR_FUNDING_VALUES.seriesA,
          label: copy.fields.fundingStatus.choices.seriesA,
        },
      ],
    },
    {
      id: "motivation",
      type: "textarea",
      question: copy.fields.motivation.question,
      placeholder: copy.fields.motivation.placeholder,
      required: true,
    },
    {
      id: "passport_username",
      type: "text",
      question: copy.fields.passport.question,
      hint: copy.fields.passport.hint,
      placeholder: copy.fields.passport.placeholder,
      required: true,
      linkText: copy.fields.passport.linkText,
      linkUrl: "https://demo.stellarpassport.xyz/",
    },
    {
      id: "terms_accepted",
      type: "checkbox",
      question: copy.fields.terms.question,
      hint: copy.fields.terms.hint,
      linkText: copy.fields.terms.linkText,
      linkUrl: "/terms",
      required: true,
    },
  ];
}

export function getAcceleratorSuccessScreen(
  copy: Translations["acceleratorApply"]["success"],
): SuccessScreen {
  return {
    label: copy.label,
    title: copy.title,
    description: copy.description,
    extra: copy.extra,
  };
}

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
