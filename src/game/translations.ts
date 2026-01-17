import type { Language, CardId } from './types';
import type { RuleSection } from './translations/types';
import { RULES_CONTENT_PL, TRANSLATIONS_PL } from './translations/pl';
import { RULES_CONTENT_CZ, TRANSLATIONS_CZ } from './translations/cz';
import { RULES_CONTENT_EN, TRANSLATIONS_EN } from './translations/en';
import { RULES_CONTENT_PO_NASZYMU, TRANSLATIONS_PO_NASZYMU } from './translations/poNaszymu';

export type { RuleContentBlock, RuleSection } from './translations/types';

type TranslationDictionary = Record<string, string>;

interface LanguageConfigEntry {
  label: string;
  locale: string;
  rules: RuleSection[];
  dictionary: TranslationDictionary;
  fallback?: Language;
}

const LANGUAGE_CONFIG: Record<Language, LanguageConfigEntry> = {
  en: {
    label: 'English',
    locale: 'en',
    rules: RULES_CONTENT_EN,
    dictionary: TRANSLATIONS_EN,
  },
  pl: {
    label: 'Polski',
    locale: 'pl',
    rules: RULES_CONTENT_PL,
    dictionary: TRANSLATIONS_PL,
  },
  cz: {
    label: 'Čeština',
    locale: 'cs',
    rules: RULES_CONTENT_CZ,
    dictionary: TRANSLATIONS_CZ,
  },
  pl_pn: {
    label: 'Po naszymu',
    locale: 'pl',
    rules: RULES_CONTENT_PO_NASZYMU,
    dictionary: TRANSLATIONS_PO_NASZYMU,
    fallback: 'pl',
  },
};

export const AVAILABLE_LANGUAGES = Object.keys(LANGUAGE_CONFIG) as Language[];

export const LANGUAGE_OPTIONS = AVAILABLE_LANGUAGES.map(code => ({
  code,
  label: LANGUAGE_CONFIG[code].label,
}));

export const RULES_CONTENT = AVAILABLE_LANGUAGES.reduce((acc, code) => {
  acc[code] = LANGUAGE_CONFIG[code].rules;
  return acc;
}, {} as Record<Language, RuleSection[]>);

export const TRANSLATIONS = AVAILABLE_LANGUAGES.reduce((acc, code) => {
  acc[code] = LANGUAGE_CONFIG[code].dictionary;
  return acc;
}, {} as Record<Language, TranslationDictionary>);

function resolveTranslation(key: string, lang: Language): string | undefined {
  const visited = new Set<Language>();
  let current: Language | undefined = lang;
  while (current && !visited.has(current)) {
    visited.add(current);
    const dictionary = LANGUAGE_CONFIG[current]?.dictionary;
    if (dictionary && dictionary[key] !== undefined) {
      return dictionary[key];
    }
    current = LANGUAGE_CONFIG[current]?.fallback;
  }
  return undefined;
}

export function getTranslationTemplate(key: string, lang: Language): string {
  return resolveTranslation(key, lang) ?? key;
}

export function t(key: string, lang: Language, params?: Record<string, string | number>): string {
  let text = getTranslationTemplate(key, lang);

  if (params) {
    Object.entries(params).forEach(([k, v]) => {
      text = text.replace(`{${k}}`, String(v));
    });
  }
  return text;
}

export function getCardName(card: CardId, lang: Language): string {
  return t(`role_${card}`, lang);
}

export function getCardDescription(card: CardId, lang: Language): string | undefined {
  return resolveTranslation(`card_description_${card}`, lang);
}

export function getLanguageLocale(lang: Language): string {
  return LANGUAGE_CONFIG[lang]?.locale ?? 'en';
}

export function getLanguageLabel(lang: Language): string {
  return LANGUAGE_CONFIG[lang]?.label ?? lang;
}
