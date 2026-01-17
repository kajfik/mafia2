import type { CardId, GameLog, Language, LogMessageFragment, LogParamMap, LogParamValue, Player } from './types';
import { formatCardLabel } from './cardLabels';
import { getCardName, getTranslationTemplate, t } from './translations';

export type LogDisplaySegment =
  | { kind: 'text'; text: string }
  | { kind: 'cardLabel'; cardId: CardId; instance?: number; label: string };

const PARAM_TOKEN_PATTERN = /{([^}]+)}/g;

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

interface ParsedCardToken {
  endIndex: number;
  cardId: CardId;
  rawLabel?: string;
}

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

function resolveCardTokenLabel(
  cardId: CardId,
  rawLabel: string | undefined,
  params: LogParamMap | undefined,
  players: Player[],
  lang: Language
): string {
  const fallbackLabel = getCardName(cardId, lang);
  if (!rawLabel) {
    return fallbackLabel;
  }
  const template = rawLabel.trim();
  if (!template) {
    return fallbackLabel;
  }

  return template.replace(PARAM_TOKEN_PATTERN, (_, key: string) => {
    if (!params || !(key in params)) {
      return `{${key}}`;
    }
    const resolved = resolveLogParam(params[key], players, lang);
    return resolved !== undefined ? String(resolved) : '';
  });
}

function parseCardToken(source: string, startIndex: number): ParsedCardToken | null {
  const prefix = '{{card:';
  if (!source.startsWith(prefix, startIndex)) {
    return null;
  }

  const length = source.length;
  let cursor = startIndex + prefix.length;

  // Read card id until label divider or closing braces.
  while (cursor < length) {
    const char = source[cursor];
    if (char === '|' || (char === '}' && source[cursor + 1] === '}')) {
      break;
    }
    cursor += 1;
  }

  if (cursor >= length) {
    return null;
  }

  const cardId = source.slice(startIndex + prefix.length, cursor).trim() as CardId;
  if (!cardId) {
    return null;
  }

  // Card token without custom label.
  if (source[cursor] === '}' && source[cursor + 1] === '}') {
    return { endIndex: cursor + 2, cardId };
  }

  if (source[cursor] !== '|') {
    return null;
  }

  const labelStart = cursor + 1;
  let idx = labelStart;
  let braceDepth = 0;
  while (idx < length) {
    const char = source[idx];
    if (char === '{') {
      braceDepth += 1;
    } else if (char === '}') {
      if (braceDepth > 0) {
        braceDepth -= 1;
      } else if (source[idx + 1] === '}') {
        const rawLabel = source.slice(labelStart, idx);
        return { endIndex: idx + 2, cardId, rawLabel };
      }
    }
    idx += 1;
  }

  return null;
}

function buildSegmentsFromTemplate(
  template: string,
  params: LogParamMap | undefined,
  players: Player[],
  lang: Language
): LogDisplaySegment[] {
  const segments: LogDisplaySegment[] = [];
  const source = template ?? '';
  let textBuffer = '';

  const flushText = () => {
    if (textBuffer) {
      segments.push({ kind: 'text', text: textBuffer });
      textBuffer = '';
    }
  };

  let index = 0;
  while (index < source.length) {
    if (source.startsWith('{{card:', index)) {
      const parsed = parseCardToken(source, index);
      if (parsed) {
        flushText();
        segments.push({
          kind: 'cardLabel',
          cardId: parsed.cardId,
          label: resolveCardTokenLabel(parsed.cardId, parsed.rawLabel, params, players, lang)
        });
        index = parsed.endIndex;
        continue;
      }
    }

    if (source[index] === '{') {
      const closing = source.indexOf('}', index + 1);
      if (closing !== -1) {
        const key = source.slice(index + 1, closing);
        if (!params || !(key in params)) {
          textBuffer += source.slice(index, closing + 1);
        } else {
          const resolved = resolveLogParamRich(params[key], players, lang);
          flushText();
          if (typeof resolved === 'object' && resolved && resolved.kind === 'cardLabel') {
            segments.push({ kind: 'cardLabel', cardId: resolved.cardId, instance: resolved.instance, label: resolved.label });
          } else {
            segments.push({ kind: 'text', text: resolved !== undefined ? String(resolved) : '' });
          }
        }
        index = closing + 1;
        continue;
      }
    }

    textBuffer += source[index];
    index += 1;
  }

  flushText();

  if (segments.length === 0) {
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
