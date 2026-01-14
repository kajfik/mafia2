import type { Player, Language, CardId, PlayerCard } from './types';
import { getCardName } from './translations';

function getAllPlayerCards(player: Player): PlayerCard[] {
  return [...player.cards, ...(player.inactiveCards || [])];
}

// Build labels for each card instance per player using globally unique instances.
export function computeCardLabels(players: Player[], lang: Language): Record<string, string[]> {
  const result: Record<string, string[]> = {};
  const totals: Record<string, number> = {};
  players.forEach(player => getAllPlayerCards(player).forEach(card => {
    totals[card.cardId] = (totals[card.cardId] || 0) + 1;
  }));

  players.forEach(player => {
    result[player.id] = player.cards.map(card => {
      const base = getCardName(card.cardId, lang);
      return (totals[card.cardId] > 1) ? `${base} ${card.instance}` : base;
    });
  });

  return result;
}

export function formatCardLabel(
  players: Player[],
  lang: Language,
  cardId: CardId,
  instance?: number
): string {
  const base = getCardName(cardId, lang);
  const totalCopies = players.reduce((acc, player) => (
    acc + getAllPlayerCards(player).filter(card => card.cardId === cardId).length
  ), 0);
  if (totalCopies <= 1) {
    return base;
  }

  let resolvedInstance = instance;
  if (resolvedInstance === undefined) {
    const ownerCard = players
      .flatMap(player => getAllPlayerCards(player))
      .find(card => card.cardId === cardId);
    resolvedInstance = ownerCard?.instance;
  }

  return resolvedInstance ? `${base} ${resolvedInstance}` : base;
}
