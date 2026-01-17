import React, { useMemo, useState } from 'react';
import type { CardId, Language } from '../game/types';
import { CARDS_CONFIG } from '../game/gameConfig';
import { getCardName, getCardDescription, t } from '../game/translations';
import { getCardIcon } from '../game/cardIcons';
import { getCardGlyph } from '../game/cardGlyphs';
import { isNightCard, isDayCard, givesGasMask } from '../game/cardIndicators';
import { CardDisplay } from './CardDisplay';
import type { CardIndicator } from './CardDisplay';

interface CardsTabProps {
  language: Language;
  className?: string;
  playerCards?: { cardId: CardId; instance: number }[];
  playerLabels?: string[];
  artMode?: 'icon' | 'image';
  onArtModeChange?: (mode: 'icon' | 'image') => void;
}

interface CardEntry {
  cardId: CardId;
  instance: number;
  label: string;
  imageSrc: string | null;
  glyph: ReturnType<typeof getCardGlyph>;
  indicators: CardIndicator[];
  description?: string;
}

export const CardsTab: React.FC<CardsTabProps> = ({ language, className, playerCards, playerLabels, artMode, onArtModeChange }) => {
  const [localArtMode, setLocalArtMode] = useState<'icon' | 'image'>('icon');
  const resolvedArtMode = artMode ?? localArtMode;
  const handleArtModeChange = onArtModeChange ?? ((mode: 'icon' | 'image') => setLocalArtMode(mode));
  const cardEntries = useMemo<CardEntry[]>(() => {
    const locale = language === 'pl_pn' ? 'pl' : language;
    const collator = new Intl.Collator(locale, { sensitivity: 'base' });

    if (playerCards && playerCards.length > 0) {
      const entries = playerCards.map((card, idx) => {
        const indicators: CardIndicator[] = [];
        if (isNightCard(card.cardId)) indicators.push('night');
        if (isDayCard(card.cardId)) indicators.push('day');
        if (givesGasMask(card.cardId, card.instance)) indicators.push('gas');

        const baseName = getCardName(card.cardId, language);
        const customLabel = playerLabels?.[idx]?.trim();
        const label = customLabel?.length ? customLabel : `${baseName} ${card.instance}`;

        return {
          cardId: card.cardId,
          instance: card.instance,
          imageSrc: getCardIcon(card.cardId, card.instance),
          glyph: getCardGlyph(card.cardId),
          label,
          indicators,
          description: getCardDescription(card.cardId, language)
        };
      });

      return entries.sort((a, b) => collator.compare(a.label, b.label));
    }

    const entries = Object.values(CARDS_CONFIG).map(config => {
      const baseName = getCardName(config.id, language);
      const indicators: CardIndicator[] = [];
      if (isNightCard(config.id)) indicators.push('night');
      if (isDayCard(config.id)) indicators.push('day');
      const hasGasMask = Array.from({ length: Math.max(1, config.defaultAmount) }, (_, idx) => givesGasMask(config.id, idx + 1)).some(Boolean);
      if (hasGasMask) indicators.push('gas');

      return {
        cardId: config.id,
        instance: 1,
        imageSrc: getCardIcon(config.id, 1),
        glyph: getCardGlyph(config.id),
        label: baseName,
        indicators,
        description: getCardDescription(config.id, language)
      };
    });

    return entries.sort((a, b) => collator.compare(a.label, b.label));
  }, [language, playerCards, playerLabels]);

  const placeholderDescription = t('cards_placeholder_description', language);
  const baseWrapper = 'h-full overflow-y-auto text-white px-3 pt-5 pb-24 sm:px-4 sm:pt-7';
  const wrapperClass = className ? `${baseWrapper} ${className}` : baseWrapper;
  const toggleOptionBase = 'px-4 py-1.5 text-sm font-semibold rounded-xl transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-brass)]';
  const artModeToggleOptions: Array<{ value: 'icon' | 'image'; label: string }> = [
    { value: 'icon', label: t('cards_toggle_icons', language) },
    { value: 'image', label: t('cards_toggle_images', language) }
  ];

  return (
    <div className={wrapperClass}>
      <div className="space-y-6">
        <header className="space-y-3">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-2xl font-bold mafia-title text-[var(--color-brass)]">
              {t('cards_collection_title', language)}
            </h2>
            <div className="inline-flex items-center gap-1 rounded-2xl border border-[rgba(242,200,121,0.3)] bg-[rgba(16,14,20,0.85)] p-1 self-center sm:self-auto">
              {artModeToggleOptions.map(option => {
                const isActive = resolvedArtMode === option.value;
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => handleArtModeChange(option.value)}
                    aria-pressed={isActive}
                    className={`${toggleOptionBase} ${isActive ? 'bg-[var(--color-brass)] text-[rgba(20,14,10,0.9)] shadow-[0_10px_25px_rgba(0,0,0,0.35)]' : 'text-white/70 hover:text-white'}`}
                  >
                    {option.label}
                  </button>
                );
              })}
            </div>
          </div>
        </header>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
          {cardEntries.map(card => (
            <CardDisplay
              key={`${card.cardId}-${card.instance}`}
              label={card.label}
              glyph={card.glyph}
              imageSrc={card.imageSrc}
              artMode={resolvedArtMode}
              indicators={card.indicators}
              description={card.description ?? placeholderDescription}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
