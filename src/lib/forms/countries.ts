/** Curated countries for accelerator location detail. */
export const ACCELERATOR_COUNTRIES = [
  "Argentina",
  "Bolivia",
  "Brazil",
  "Canada",
  "Chile",
  "Colombia",
  "Costa Rica",
  "Ecuador",
  "El Salvador",
  "Germany",
  "Guatemala",
  "Mexico",
  "Panama",
  "Paraguay",
  "Peru",
  "Spain",
  "United Kingdom",
  "United States",
  "Uruguay",
  "Venezuela",
  "Other",
] as const;

export type AcceleratorCountry = (typeof ACCELERATOR_COUNTRIES)[number];
