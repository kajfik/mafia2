import type { CardId } from './types';

const NIGHT_CARD_IDS = new Set<CardId>([
  'CloudWalker',
  'KevlarVest',
  'Mafia',
  'Jailer',
  'Sock',
  'Mage',
  'Matrix',
  'Cobra',
  'Gravedigger',
  'Spyglass',
  'TimeLord',
  'Slime',
  'Sniper',
  'Mirror',
  'MadGunman',
  'SwampMonster',
  'Atheist',
  'Sand',
  'GhostBobo',
  'Leech',
  'Glazier',
  'Magnet',
  'Judge',
  'AlCapone',
  'Doctor',
  'HorsePiece',
  'Gandalf'
]);

const DAY_CARD_IDS = new Set<CardId>([
  'CloudWalker',
  'KevlarVest',
  'BlindExecutioner',
  'TimeLord',
  'Astronomer',
  'RopeWalker',
  'Communist',
  'Immunity',
  'MassMurderer',
  'HorsePiece',
  'Gandalf',
  'Anarchist',
  'Meciar',
  'Kovac',
  'Terrorist'
]);

const PASSIVE_CARD_IDS = new Set<CardId>([
  'AlCapone',
  'Atheist',
  'CloudWalker',
  'Gandalf',
  'Glazier',
  'HorsePiece',
  'Immunity',
  'KevlarVest',
  'Kovac',
  'MassMurderer',
  'Meciar',
  'Mirror',
  'RopeWalker'
]);

export function isNightCard(cardId: CardId): boolean {
  return NIGHT_CARD_IDS.has(cardId);
}

export function isDayCard(cardId: CardId): boolean {
  return DAY_CARD_IDS.has(cardId);
}

export function isPassiveCard(cardId: CardId): boolean {
  return PASSIVE_CARD_IDS.has(cardId);
}

export function givesGasMask(cardId: CardId, instance: number): boolean {
  return (
    (cardId === 'Mage' && instance === 2) ||
    (cardId === 'MadGunman' && instance === 2) ||
    cardId === 'GhostBobo'
  );
}
