import type { Player, CardId } from './types';
import { CARDS_CONFIG } from './gameConfig';
import { givesGasMask } from './cardIndicators';

function shuffle<T>(array: T[]): T[] {
  let currentIndex = array.length, randomIndex;
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
  }
  return array;
}

type Card = { cardId: CardId; instance: number };

type DealStats = {
  mafia: number;
  madGunman: number;
  slime: number;
  rope: number;
  cloudwalker: number;
  limitLivesToOne: boolean;
  gasMaskSources: number;
  hasDoctor: boolean;
  hasSpyglass: boolean;
  hasAtheist: boolean;
  hasMatrix: boolean;
  hasLeech: boolean;
  hasCobra: boolean;
  hasGandalf: boolean;
  hasHorsePiece: boolean;
  hasGravedigger: boolean;
  hasAlCapone: boolean;
};

const LIFE_LIMITER_CARDS = new Set<CardId>(['Gravedigger', 'Leech', 'AlCapone', 'Gandalf', 'HorsePiece']);

const MAX_ASSIGNMENT_ATTEMPTS = 10000;

function getEffectiveDefaultAmount(cardId: CardId, baseAmount: number, playerCount: number): number {
  if (cardId !== 'Mafia') {
    return baseAmount;
  }
  if (playerCount <= 0) {
    return baseAmount;
  }
  const computed = Math.round(playerCount / 3);
  return Math.max(1, computed);
}

export function dealCards(players: Player[], customDeck?: CardId[]): Player[] {
  if (!players.length) return [];

  const playerCount = players.length;
  const deck: Card[] = [];
  if (customDeck) {
    const counts: Record<string, number> = {};
    customDeck.forEach(rid => {
      const idx = (counts[rid] || 0) + 1;
      counts[rid] = idx;
      deck.push({ cardId: rid, instance: idx });
    });
  } else {
    Object.values(CARDS_CONFIG).forEach(card => {
      const defaultAmount = getEffectiveDefaultAmount(card.id, card.defaultAmount, playerCount);
      for (let i = 1; i <= defaultAmount; i++) {
        deck.push({ cardId: card.id, instance: i });
      }
    });
  }

  let cardsPerPlayer = Math.floor(deck.length / players.length);
  const initialCardsPerPlayer = cardsPerPlayer;

  while (cardsPerPlayer >= 0) {
    const dealt = tryDealWithCardCount(deck, players, cardsPerPlayer);
    if (dealt) {
      finalizePlayers(dealt);
      if (cardsPerPlayer < initialCardsPerPlayer) {
        console.warn(`Reduced cards per player from ${initialCardsPerPlayer} to ${cardsPerPlayer} to satisfy manipulation rules.`);
      }
      return dealt;
    }
    cardsPerPlayer--;
  }

  const fallback = players.map(p => freshPlayerState(p));
  finalizePlayers(fallback);
  return fallback;
}

function tryDealWithCardCount(deck: Card[], basePlayers: Player[], cardsPerPlayer: number): Player[] | null {
  const totalNeeded = cardsPerPlayer * basePlayers.length;
  if (totalNeeded === 0) {
    return basePlayers.map(p => freshPlayerState(p));
  }

  for (let attempt = 0; attempt < MAX_ASSIGNMENT_ATTEMPTS; attempt++) {
    const attemptDeck = shuffle([...deck]).slice(0, totalNeeded);
    const dealt = assignDeckToPlayers(attemptDeck, basePlayers, cardsPerPlayer);
    if (dealt) return dealt;
  }

  return null;
}

function assignDeckToPlayers(deckSegment: Card[], basePlayers: Player[], cardsPerPlayer: number): Player[] | null {
  const playerStates = basePlayers.map(p => ({
    player: freshPlayerState(p),
    stats: createDealStats(),
    slotsRemaining: cardsPerPlayer
  }));

  for (const card of deckSegment) {
    const candidates: number[] = [];
    let maxSlots = 0;

    playerStates.forEach((state, idx) => {
      if (state.slotsRemaining <= 0) return;
      if (!canReceiveCard(state.stats, card)) return;
      if (state.slotsRemaining > maxSlots) {
        maxSlots = state.slotsRemaining;
        candidates.length = 0;
      }
      if (state.slotsRemaining === maxSlots) {
        candidates.push(idx);
      }
    });

    if (!candidates.length) {
      return null;
    }

    const recipientIndex = candidates[Math.floor(Math.random() * candidates.length)];
    const recipient = playerStates[recipientIndex];
    recipient.player.cards.push({ cardId: card.cardId, instance: card.instance });
    applyCard(recipient.stats, card);
    recipient.slotsRemaining--;
  }

  return playerStates.map(state => state.player);
}

function freshPlayerState(player: Player): Player {
  return {
    ...player,
    cards: [],
    inactiveCards: [],
    hasGasMask: false,
    status: { ...player.status, mudCount: 0, swampChargesLeft: 0 }
  };
}

function createDealStats(): DealStats {
  return {
    mafia: 0,
    madGunman: 0,
    slime: 0,
    rope: 0,
    cloudwalker: 0,
    limitLivesToOne: false,
    gasMaskSources: 0,
    hasDoctor: false,
    hasSpyglass: false,
    hasAtheist: false,
    hasMatrix: false,
    hasLeech: false,
    hasCobra: false,
    hasGandalf: false,
    hasHorsePiece: false,
    hasGravedigger: false,
    hasAlCapone: false
  };
}

function canReceiveCard(stats: DealStats, card: Card): boolean {
  if (givesGasMask(card.cardId, card.instance) && stats.gasMaskSources >= 1) {
    return false;
  }

  switch (card.cardId) {
    case 'Mafia':
      return stats.mafia === 0 && !stats.hasDoctor && !stats.hasSpyglass;
    case 'Doctor':
      return !stats.hasDoctor && stats.mafia === 0;
    case 'Spyglass':
      return !stats.hasSpyglass && stats.mafia === 0;
    case 'MadGunman':
      return stats.madGunman === 0;
    case 'Slime':
      return stats.slime === 0;
    case 'RopeWalker':
      return stats.rope < 2;
    case 'CloudWalker':
      if (stats.cloudwalker >= 2) return false;
      if (stats.limitLivesToOne && stats.cloudwalker >= 1) return false;
      return true;
    case 'Atheist':
      return !stats.hasAtheist && !stats.hasMatrix;
    case 'Matrix':
      return !stats.hasMatrix && !stats.hasAtheist;
    case 'Leech':
      if (stats.hasLeech || stats.hasCobra) return false;
      return stats.cloudwalker <= 1;
    case 'Cobra':
      return !stats.hasCobra && !stats.hasLeech;
    case 'Gandalf':
      if (stats.hasGandalf || stats.hasHorsePiece) return false;
      return stats.cloudwalker <= 1;
    case 'HorsePiece':
      if (stats.hasHorsePiece || stats.hasGandalf) return false;
      return stats.cloudwalker <= 1;
    case 'Gravedigger':
      if (stats.hasGravedigger) return false;
      return stats.cloudwalker <= 1;
    case 'AlCapone':
      if (stats.hasAlCapone) return false;
      return stats.cloudwalker <= 1;
    default:
      return true;
  }
}

function applyCard(stats: DealStats, card: Card): void {
  if (givesGasMask(card.cardId, card.instance)) {
    stats.gasMaskSources++;
  }

  switch (card.cardId) {
    case 'CloudWalker':
      stats.cloudwalker++;
      break;
    case 'RopeWalker':
      stats.rope++;
      break;
    case 'Mafia':
      stats.mafia++;
      break;
    case 'MadGunman':
      stats.madGunman++;
      break;
    case 'Slime':
      stats.slime++;
      break;
    case 'Doctor':
      stats.hasDoctor = true;
      break;
    case 'Spyglass':
      stats.hasSpyglass = true;
      break;
    case 'Atheist':
      stats.hasAtheist = true;
      break;
    case 'Matrix':
      stats.hasMatrix = true;
      break;
    case 'Leech':
      stats.hasLeech = true;
      break;
    case 'Cobra':
      stats.hasCobra = true;
      break;
    case 'Gandalf':
      stats.hasGandalf = true;
      break;
    case 'HorsePiece':
      stats.hasHorsePiece = true;
      break;
    case 'Gravedigger':
      stats.hasGravedigger = true;
      break;
    case 'AlCapone':
      stats.hasAlCapone = true;
      break;
  }

  if (LIFE_LIMITER_CARDS.has(card.cardId)) {
    stats.limitLivesToOne = true;
  }
}

function finalizePlayers(players: Player[]): void {
  players.forEach(p => {
    p.hasGasMask = p.cards.some(rr => givesGasMask(rr.cardId, rr.instance));

    if (p.cards.some(rr => rr.cardId === 'SwampMonster')) {
      const isNerfed = p.cards.some(rr => ['Mafia', 'MadGunman', 'Sniper'].includes(rr.cardId));
      p.status.swampChargesLeft = isNerfed ? 2 : 3;
    } else {
      p.status.swampChargesLeft = 0;
    }
  });
}