import type { Translations } from "@/lib/i18n";
import type { FormStep, SuccessScreen } from "./types";

export type HubAccessPayload = {
  full_name: string;
  email: string;
  project_name: string;
  location: string;
  passport_username: string;
  terms_accepted: string;
};

/** Canonical values stored in the database — always English. */
export const HUB_LOCATION_VALUES = {
  santiago: "Santiago",
  relocating: "Relocating to Santiago",
  remote: "Remote — not based in Chile",
} as const;

export function getHubAccessFormSteps(
  copy: Translations["hubApply"],
): FormStep<HubAccessPayload>[] {
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

export function getHubAccessSuccessScreen(
  copy: Translations["hubApply"]["success"],
): SuccessScreen {
  return {
    label: copy.label,
    title: copy.title,
    description: copy.description,
    extra: copy.extra,
  };
}

export const emptyHubAccessApplication = (): HubAccessPayload => ({
  full_name: "",
  email: "",
  project_name: "",
  location: "",
  passport_username: "",
  terms_accepted: "false",
});
