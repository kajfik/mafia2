import React, { useMemo } from 'react';
import type { CardId } from '../game/types';
import { t, getCardName, getLanguageLocale } from '../game/translations';
import { getCardIcon } from '../game/cardIcons';
import { getCardGlyph } from '../game/cardGlyphs';
import { isNightCard, isDayCard, givesGasMask } from '../game/cardIndicators';
import { CardDisplay } from './CardDisplay';
import type { CardIndicator } from './CardDisplay';
import { usePlayerLinkData } from '../hooks/usePlayerLinkData';

type PlayerCardPayload = { cardId: CardId; instance: number };
type LabeledCard = {
  card: PlayerCardPayload;
  label: string;
  icon: string | null;
  glyph: ReturnType<typeof getCardGlyph>;
  indicators: CardIndicator[];
};

export const PlayerView: React.FC = () => {
  const playerData = usePlayerLinkData();
  const invalidMessage = t('player_link_invalid', playerData?.lang ?? 'pl');

  const sortedCards = useMemo<LabeledCard[]>(() => {
    if (!playerData) return [];
    const { cards, labels = [], lang } = playerData;
    const locale = getLanguageLocale(lang);
    const labeledCards = cards.map((card, idx) => {
      const label = labels[idx] ?? `${getCardName(card.cardId, lang)} ${card.instance}`;
      const indicators: CardIndicator[] = [];
      if (isNightCard(card.cardId)) indicators.push('night');
      if (isDayCard(card.cardId)) indicators.push('day');
      if (givesGasMask(card.cardId, card.instance)) indicators.push('gas');

      return {
        card,
        label,
        icon: getCardIcon(card.cardId, card.instance),
        glyph: getCardGlyph(card.cardId),
        indicators,
      };
    });
    return [...labeledCards].sort((a, b) => a.label.localeCompare(b.label, locale, { sensitivity: 'base' }));
  }, [playerData]);

  if (!playerData) {
    return <div className="p-8 text-white">{invalidMessage}</div>;
  }

  const { name, lang } = playerData;

  return (
    <div className="flex flex-col items-center p-6 text-white h-full bg-slate-800 overflow-y-auto pb-24">
      <h1 className="text-3xl font-bold mb-8 text-yellow-400">{name}</h1>

      <div className="w-full max-w-6xl grid gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 auto-rows-fr">
        {sortedCards.map(({ card, label, icon, glyph, indicators }, idx) => (
          <CardDisplay
            key={`${card.cardId}-${card.instance}-${idx}`}
            label={label}
            glyph={glyph}
            imageSrc={icon}
            artMode="icon"
            indicators={indicators}
            description={t(`role_${card.cardId}`, lang)}
            className="h-[420px]"
          />
        ))}
      </div>
    </div>
  );
};