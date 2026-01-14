import type { CardId, GameLog, Language, LogMessageFragment, LogParamMap, LogParamValue, Player } from './types';
import { formatCardLabel } from './cardLabels';
import { getTranslationTemplate, t } from './translations';

export type LogDisplaySegment =
  | { kind: 'text'; text: string }
  | { kind: 'cardLabel'; cardId: CardId; instance?: number; label: string };

export function createCardLabelParam(cardId: CardId, instance?: number): LogParamValue {
  return { kind: 'cardLabel', cardId, instance };
}

export function resolveLogParam(value: LogParamValue, players: Player[], lang: Language): string | number {
  if (typeof value === 'string' || typeof value === 'number') {
    return value;
  }
  if (!value) {
    return '';
  }
  switch (value.kind) {
    case 'cardLabel':
      return formatCardLabel(players, lang, value.cardId, value.instance);
    default:
      return '';
  }
}

export function resolveLogParams(
  params: LogParamMap | undefined,
  players: Player[],
  lang: Language
): Record<string, string | number> | undefined {
  if (!params) {
    return undefined;
  }
  const resolved: Record<string, string | number> = {};
  Object.entries(params).forEach(([key, value]) => {
    resolved[key] = resolveLogParam(value, players, lang);
  });
  return resolved;
}

type RichParamValue =
  | string
  | number
  | { kind: 'cardLabel'; cardId: CardId; instance?: number; label: string };

function resolveLogParamRich(value: LogParamValue, players: Player[], lang: Language): RichParamValue {
  if (typeof value === 'string' || typeof value === 'number') {
    return value;
  }
  if (!value) {
    return '';
  }
  if (value.kind === 'cardLabel') {
    return {
      kind: 'cardLabel',
      cardId: value.cardId,
      instance: value.instance,
      label: formatCardLabel(players, lang, value.cardId, value.instance),
    };
  }
  return '';
}

function buildSegmentsFromTemplate(
  template: string,
  params: LogParamMap | undefined,
  players: Player[],
  lang: Language
): LogDisplaySegment[] {
  const segments: LogDisplaySegment[] = [];
  const source = template ?? '';
  const pattern = /{([^}]+)}/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = pattern.exec(source)) !== null) {
    if (match.index > lastIndex) {
      segments.push({ kind: 'text', text: source.slice(lastIndex, match.index) });
    }
    const key = match[1];
    if (!params || !(key in params)) {
      segments.push({ kind: 'text', text: match[0] });
    } else {
      const resolved = resolveLogParamRich(params[key], players, lang);
      if (typeof resolved === 'object' && resolved && resolved.kind === 'cardLabel') {
        segments.push({ kind: 'cardLabel', cardId: resolved.cardId, instance: resolved.instance, label: resolved.label });
      } else {
        segments.push({ kind: 'text', text: resolved !== undefined ? String(resolved) : '' });
      }
    }
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < source.length) {
    segments.push({ kind: 'text', text: source.slice(lastIndex) });
  } else if (segments.length === 0) {
    segments.push({ kind: 'text', text: source });
  }

  return segments;
}

function translateFragmentSegments(
  fragment: LogMessageFragment,
  players: Player[],
  lang: Language
): LogDisplaySegment[] {
  const template = getTranslationTemplate(fragment.key, lang);
  return buildSegmentsFromTemplate(template, fragment.params, players, lang);
}

export function renderLogFragments(
  fragments: LogMessageFragment[],
  players: Player[],
  lang: Language
): string {
  return fragments
    .map(fragment => t(fragment.key, lang, resolveLogParams(fragment.params, players, lang)))
    .join('');
}

export function translateLogEntry(entry: GameLog, players: Player[], lang: Language): string {
  if (entry.translationFragments?.length) {
    return renderLogFragments(entry.translationFragments, players, lang);
  }
  if (entry.translationKey) {
    return t(entry.translationKey, lang, resolveLogParams(entry.translationParams, players, lang));
  }
  return entry.text ?? '';
}

export function translateLogEntrySegments(
  entry: GameLog,
  players: Player[],
  lang: Language
): LogDisplaySegment[] {
  if (entry.translationFragments?.length) {
    return entry.translationFragments.flatMap(fragment => translateFragmentSegments(fragment, players, lang));
  }
  if (entry.translationKey) {
    const template = getTranslationTemplate(entry.translationKey, lang);
    return buildSegmentsFromTemplate(template, entry.translationParams, players, lang);
  }
  if (entry.text) {
    return [{ kind: 'text', text: entry.text }];
  }
  return [];
}
