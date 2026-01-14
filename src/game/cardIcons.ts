import type { CardId } from './types';

type IconVariantMap = Record<string, string[]>;

const iconModules = import.meta.glob('../../icons/cards/*.{png,jpg,jpeg,jfif,gif}', {
  eager: true,
  import: 'default'
}) as Record<string, string>;

const rawVariantMap: IconVariantMap = {};

Object.entries(iconModules).forEach(([path, src]) => {
  const fileName = path.split('/').pop() ?? '';
  const match = fileName.match(/^([a-z0-9]+?)(\d+)?\.(png|jpe?g|jfif|gif)$/i);
  if (!match) return;
  const [, baseRaw, indexRaw] = match;
  const base = baseRaw.toLowerCase();
  if (!rawVariantMap[base]) {
    rawVariantMap[base] = [];
  }
  if (indexRaw) {
    const idx = Math.max(0, Number(indexRaw) - 1);
    rawVariantMap[base][idx] = src;
  } else {
    rawVariantMap[base].push(src);
  }
});

function normalizeVariants(values: string[] | undefined): string[] {
  if (!values) return [];
  return values.filter(Boolean);
}

function resolveKey(cardId: CardId): string {
  return cardId.toLowerCase();
}

export function getCardIcon(cardId: CardId, instance = 1): string | null {
  const key = resolveKey(cardId);
  const variants = normalizeVariants(rawVariantMap[key]);
  if (!variants.length || instance < 1) {
    return variants[0] ?? null;
  }
  const idx = (instance - 1) % variants.length;
  return variants[idx] ?? variants[0] ?? null;
}

export function getCardIconVariantCount(cardId: CardId): number {
  return normalizeVariants(rawVariantMap[resolveKey(cardId)]).length;
}
