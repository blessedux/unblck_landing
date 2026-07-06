import { en, type Locale, type Translations } from "./locales/en";
import { es } from "./locales/es";

export type { Locale, Translations };

const dictionaries: Record<Locale, Translations> = { en, es };

export function getTranslations(locale: Locale): Translations {
  return dictionaries[locale];
}

export const defaultLocale: Locale = "en";
