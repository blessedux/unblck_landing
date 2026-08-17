import type { Translations } from "@/lib/i18n";
import { TELLUS_HUB_MAPS_URL } from "@/lib/i18n/locales/en";
import type { SuccessScreen } from "./types";

export type AcceleratorPayload = {
  full_name: string;
  email: string;
  project_name: string;
  project_link: string;
  build_description: string;
  location: string;
  location_detail: string;
  stage: string;
  team_size: string;
  funding_status: string;
  motivation: string;
  passport_username: string;
  terms_accepted: string;
};

/** Canonical values stored in the database — always English. */
export const ACCELERATOR_LOCATION_VALUES = {
  santiago: "Santiago",
  otherRegion: "Other region",
  outsideChile: "Outside Chile",
} as const;

export const ACCELERATOR_STAGE_VALUES = {
  idea: "Idea",
  prototype: "Prototype/MVP",
  live: "Live product",
  scaling: "Growing/Scaling",
} as const;

export const ACCELERATOR_TEAM_SIZE_VALUES = {
  solo: "solo founder",
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

export const STELLAR_BARRIO_HUB_URL = "https://telluscoop.org/hub";

export function formatAcceleratorLocation(
  location: string,
  detail: string,
): string {
  const trimmedDetail = detail.trim();
  if (
    location === ACCELERATOR_LOCATION_VALUES.otherRegion &&
    trimmedDetail
  ) {
    return `${ACCELERATOR_LOCATION_VALUES.otherRegion} — ${trimmedDetail}`;
  }
  return location.trim();
}

export function getAcceleratorSuccessScreen(
  copy: Translations["acceleratorApply"]["success"],
): SuccessScreen {
  return {
    label: copy.label,
    title: copy.title,
    description: copy.description,
    extraSegments: [
      { text: copy.extraBefore },
      { text: "StellarBarrio", href: STELLAR_BARRIO_HUB_URL },
      { text: copy.extraMiddle },
      { text: "Tellus Blockchain Hub STGO", href: TELLUS_HUB_MAPS_URL },
      { text: copy.extraAfter },
    ],
    primaryCta: {
      label: copy.ctaSubmissions,
      href: "/submissions",
    },
    secondaryCta: {
      label: copy.ctaFounders,
      href: "/founders",
    },
  };
}

export const emptyAcceleratorApplication = (): AcceleratorPayload => ({
  full_name: "",
  email: "",
  project_name: "",
  project_link: "",
  build_description: "",
  location: "",
  location_detail: "",
  stage: "",
  team_size: "",
  funding_status: "",
  motivation: "",
  passport_username: "",
  terms_accepted: "false",
});
