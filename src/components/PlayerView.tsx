import React, { useMemo, useState } from 'react';
import type { CardId, Language } from '../game/types';
import { t, getCardName, getLanguageLocale, getCardDescription } from '../game/translations';
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
  description: string;
};

interface PlayerViewProps {
  className?: string;
  artMode?: 'icon' | 'image';
  onArtModeChange?: (mode: 'icon' | 'image') => void;
  language?: Language;
}

export const PlayerView: React.FC<PlayerViewProps> = ({ className, artMode: artModeProp, onArtModeChange, language }) => {
  const playerData = usePlayerLinkData();
  const resolvedLanguage = language ?? playerData?.lang ?? 'pl';
  const invalidMessage = t('player_link_invalid', resolvedLanguage);
  const baseWrapperClass = 'h-full overflow-y-auto text-white px-3 pt-5 pb-24 sm:px-4 sm:pt-7';
  const wrapperClass = className ? `${baseWrapperClass} ${className}` : baseWrapperClass;
  const [localArtMode, setLocalArtMode] = useState<'icon' | 'image'>('icon');
  const resolvedArtMode = artModeProp ?? localArtMode;
  const handleArtModeChange = onArtModeChange ?? ((mode: 'icon' | 'image') => setLocalArtMode(mode));
  const toggleOptionBase = 'px-4 py-1.5 text-sm font-semibold rounded-xl transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-brass)]';
  const artModeToggleOptions: Array<{ value: 'icon' | 'image'; label: string }> = [
    { value: 'icon', label: t('cards_toggle_icons', resolvedLanguage) },
    { value: 'image', label: t('cards_toggle_images', resolvedLanguage) }
  ];

  const sortedCards = useMemo<LabeledCard[]>(() => {
    if (!playerData) return [];
    const { cards, labels = [] } = playerData;
    const locale = getLanguageLocale(resolvedLanguage);
    const placeholderDescription = t('cards_placeholder_description', resolvedLanguage);
    const labeledCards = cards.map((card, idx) => {
      const label = labels[idx] ?? `${getCardName(card.cardId, resolvedLanguage)} ${card.instance}`;
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
        description: getCardDescription(card.cardId, resolvedLanguage) ?? placeholderDescription,
      };
    });
    return [...labeledCards].sort((a, b) => a.label.localeCompare(b.label, locale, { sensitivity: 'base' }));
  }, [playerData, resolvedLanguage]);

  if (!playerData) {
    return (
      <div className={`${wrapperClass} flex flex-col items-center justify-center text-center`}>
        <p className="text-white/80 text-sm">{invalidMessage}</p>
      </div>
    );
  }

  const { name } = playerData;

  return (
    <div className={wrapperClass}>
      <div className="space-y-6">
        <header className="space-y-3">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap items-baseline gap-3">
              <h1 className="text-2xl font-bold mafia-title text-[var(--color-brass)]">{t('nav_my_cards', resolvedLanguage)}</h1>
              <p className="text-xs uppercase tracking-[0.35em] text-white/60">{name}</p>
            </div>
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
          {sortedCards.map(({ card, label, icon, glyph, indicators, description }, idx) => (
            <CardDisplay
              key={`${card.cardId}-${card.instance}-${idx}`}
              label={label}
              glyph={glyph}
              imageSrc={icon}
              artMode={resolvedArtMode}
              indicators={indicators}
              description={description}
            />
          ))}
        </div>
      </div>
    </div>
  );
};