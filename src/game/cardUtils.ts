import type { CardId, Player, PlayerCard } from './types';

function archiveCard(player: Player, card: PlayerCard | undefined) {
  if (!card) return;
  if (!Array.isArray(player.inactiveCards)) {
    player.inactiveCards = [];
  }
  player.inactiveCards.push(card);
}

export function countCards(player: Player, cardId: CardId): number {
  return player.cards.filter(card => card.cardId === cardId).length;
}

export function hasCard(player: Player, cardId: CardId): boolean {
  return player.cards.some(card => card.cardId === cardId);
}

export function consumeCard(player: Player, cardId: CardId): boolean {
  for (let i = player.cards.length - 1; i >= 0; i--) {
    if (player.cards[i].cardId === cardId) {
      const [removed] = player.cards.splice(i, 1);
      archiveCard(player, removed);
      return true;
    }
  }
  return false;
}

export function consumeCardInstance(player: Player, cardId: CardId, instance: number): boolean {
  const idx = player.cards.findIndex(card => card.cardId === cardId && card.instance === instance);
  if (idx === -1) {
    return false;
  }
  const [removed] = player.cards.splice(idx, 1);
  archiveCard(player, removed);
  return true;
}

export function consumeCardWithInstance(player: Player, cardId: CardId): number | null {
  for (let i = player.cards.length - 1; i >= 0; i--) {
    if (player.cards[i].cardId === cardId) {
      const instance = player.cards[i].instance;
      const [removed] = player.cards.splice(i, 1);
      archiveCard(player, removed);
      return typeof instance === 'number' ? instance : null;
    }
  }
  return null;
}

export function consumeAllCards(player: Player, cardId: CardId): number {
  let removed = 0;
  for (let i = player.cards.length - 1; i >= 0; i--) {
    if (player.cards[i].cardId === cardId) {
      const [card] = player.cards.splice(i, 1);
      archiveCard(player, card);
      removed++;
    }
  }
  return removed;
}

export function getNextCardInstance(players: Player[], cardId: CardId): number {
  let maxInstance = 0;
  players.forEach(player => {
    const allCards = [...player.cards, ...(player.inactiveCards || [])];
    allCards.forEach(card => {
      if (card.cardId === cardId && card.instance > maxInstance) {
        maxInstance = card.instance;
      }
    });
  });
  return maxInstance + 1;
}

export function grantCardInstance(players: Player[], player: Player, cardId: CardId): number {
  const instance = getNextCardInstance(players, cardId);
  player.cards.push({ cardId, instance });
  return instance;
}
