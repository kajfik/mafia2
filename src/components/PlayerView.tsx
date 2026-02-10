import React, { useMemo, useState } from 'react';
import { MinusIcon, PlusIcon } from '@phosphor-icons/react';
import type { CardId, Language } from '../game/types';
import { t, getCardName, getLanguageLocale, getCardDescription } from '../game/translations';
import { getCardIcon } from '../game/cardIcons';
import { getCardGlyph } from '../game/cardGlyphs';
import { isNightCard, isDayCard, givesGasMask, isPassiveCard } from '../game/cardIndicators';
import { CARDS_CONFIG } from '../game/gameConfig';
import { CardDisplay } from './CardDisplay';
import type { CardIndicator } from './CardDisplay';
import { usePlayerLinkData } from '../hooks/usePlayerLinkData';

type PlayerCardPayload = { cardId: CardId; instance: number };
type LabeledCard = {
  card: PlayerCardPayload;
  key: string;
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
  const [disabledCardKeys, setDisabledCardKeys] = useState<string[]>([]);
  const [addedCards, setAddedCards] = useState<PlayerCardPayload[]>([]);
  const [showAddCard, setShowAddCard] = useState(false);
  const getDefaultInstance = (cardId: CardId) => (CARDS_CONFIG[cardId]?.defaultAmount ?? 1) + 1;
  const getSuggestedInstance = (cardId: CardId) => {
    const defaultInstance = getDefaultInstance(cardId);
    const combined = [...(playerData?.cards ?? []), ...addedCards];
    const maxExisting = combined.reduce((max, card) => {
      if (card.cardId !== cardId) return max;
      return card.instance > max ? card.instance : max;
    }, 0);
    return Math.max(defaultInstance, maxExisting + 1);
  };
  const [pendingCardId, setPendingCardId] = useState<CardId>('CloudWalker');
  const [pendingInstance, setPendingInstance] = useState<string>(() => String(getDefaultInstance('CloudWalker')));
  const resolvedArtMode = artModeProp ?? localArtMode;
  const handleArtModeChange = onArtModeChange ?? ((mode: 'icon' | 'image') => setLocalArtMode(mode));
  const toggleOptionBase = 'px-4 py-1.5 text-sm font-semibold rounded-xl transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-brass)]';
  const artModeToggleOptions: Array<{ value: 'icon' | 'image'; label: string }> = [
    { value: 'icon', label: t('cards_toggle_icons', resolvedLanguage) },
    { value: 'image', label: t('cards_toggle_images', resolvedLanguage) }
  ];
  const disabledCardSet = useMemo(() => new Set(disabledCardKeys), [disabledCardKeys]);
  const addableCardIds = useMemo<CardId[]>(() => ['CloudWalker', 'Mirror'], []);

  const buildCardKey = (card: PlayerCardPayload) => `${card.cardId}-${card.instance}`;

  const sortedCards = useMemo<LabeledCard[]>(() => {
    if (!playerData) return [];
    const { cards, labels = [] } = playerData;
    const locale = getLanguageLocale(resolvedLanguage);
    const placeholderDescription = t('cards_placeholder_description', resolvedLanguage);
    const combinedCards = [
      ...cards.map((card, idx) => ({ card, label: labels[idx] })),
      ...addedCards.map(card => ({ card, label: undefined }))
    ];
    const labeledCards = combinedCards.map(({ card, label }) => {
      const resolvedLabel = label ?? `${getCardName(card.cardId, resolvedLanguage)} ${card.instance}`;
      const key = buildCardKey(card);
      const indicators: CardIndicator[] = [];
      if (isNightCard(card.cardId)) indicators.push('night');
      if (isDayCard(card.cardId)) indicators.push('day');
      if (givesGasMask(card.cardId, card.instance)) indicators.push('gas');

      return {
        card,
        key,
        label: resolvedLabel,
        icon: getCardIcon(card.cardId, card.instance),
        glyph: getCardGlyph(card.cardId),
        indicators,
        description: getCardDescription(card.cardId, resolvedLanguage) ?? placeholderDescription,
      };
    });
    return [...labeledCards].sort((a, b) => {
      const aDisabled = disabledCardSet.has(a.key);
      const bDisabled = disabledCardSet.has(b.key);
      if (aDisabled !== bDisabled) return aDisabled ? 1 : -1;
      return a.label.localeCompare(b.label, locale, { sensitivity: 'base' });
    });
  }, [playerData, resolvedLanguage, disabledCardSet, addedCards]);

  const existingCardKeys = useMemo(() => {
    if (!playerData) return new Set<string>();
    const base = playerData.cards.map(buildCardKey);
    const extra = addedCards.map(buildCardKey);
    return new Set([...base, ...extra]);
  }, [playerData, addedCards]);

  const [passiveCards, activeCards] = useMemo(() => {
    const passive: LabeledCard[] = [];
    const active: LabeledCard[] = [];
    sortedCards.forEach(card => {
      if (isPassiveCard(card.card.cardId)) {
        passive.push(card);
      } else {
        active.push(card);
      }
    });
    return [passive, active];
  }, [sortedCards]);

  const parsedInstance = Number(pendingInstance);
  const isInstanceValid = Number.isInteger(parsedInstance) && parsedInstance >= 1;
  const isDuplicate = isInstanceValid && existingCardKeys.has(buildCardKey({ cardId: pendingCardId, instance: parsedInstance }));
  const canAddCard = isInstanceValid && !isDuplicate;

  const adjustPendingInstance = (delta: number) => {
    const current = Number(pendingInstance);
    const safeCurrent = Number.isFinite(current) && Number.isInteger(current) ? current : 1;
    const next = Math.max(1, safeCurrent + delta);
    setPendingInstance(String(next));
  };

  const handleAddCard = () => {
    if (!canAddCard) return;
    setAddedCards(prev => [...prev, { cardId: pendingCardId, instance: parsedInstance }]);
    setPendingInstance(String(parsedInstance + 1));
  };

  const toggleCardDisabled = (cardKey: string) => {
    setDisabledCardKeys(prev => {
      const next = new Set(prev);
      if (next.has(cardKey)) {
        next.delete(cardKey);
      } else {
        next.add(cardKey);
      }
      return Array.from(next);
    });
  };

  if (!playerData) {
    return (
      <div className={`${wrapperClass} flex flex-col items-center justify-center text-center`}>
        <p className="text-white/80 text-sm">{invalidMessage}</p>
      </div>
    );
  }

  const { name } = playerData;
  const sectionTitleClass = 'text-xs uppercase tracking-[0.35em] text-white/60';
  const gridClass = 'grid gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4';

  return (
    <div className={wrapperClass}>
      <div className="space-y-6">
        <header className="space-y-3">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap items-baseline gap-3">
              <h1 className="text-2xl font-bold mafia-title text-[var(--color-brass)]">{t('nav_my_cards', resolvedLanguage)}</h1>
              <p className="text-xs uppercase tracking-[0.35em] text-white/60">{name}</p>
            </div>
            <div className="inline-flex items-center gap-2 self-center sm:self-auto">
                <button
                type="button"
                  onClick={() =>
                    setShowAddCard(prev => {
                      const next = !prev;
                      if (next) {
                        setPendingInstance(String(getSuggestedInstance(pendingCardId)));
                      }
                      return next;
                    })
                  }
                aria-expanded={showAddCard}
                className={`inline-flex items-center justify-center ${toggleOptionBase} rounded-2xl border border-[rgba(242,200,121,0.3)] bg-[rgba(16,14,20,0.85)] uppercase tracking-[0.25em] ${
                  showAddCard
                    ? 'bg-[var(--color-brass)] text-[rgba(20,14,10,0.9)] shadow-[0_10px_25px_rgba(0,0,0,0.35)]'
                    : 'text-white/70 hover:text-white'
                }`}
              >
                {t('player_add_card_button', resolvedLanguage)}
              </button>
              <div className="inline-flex items-center gap-1 rounded-2xl border border-[rgba(242,200,121,0.3)] bg-[rgba(16,14,20,0.85)] p-1">
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
          </div>
        </header>

        {showAddCard && (
          <section className="rounded-2xl border border-[rgba(242,200,121,0.25)] bg-[rgba(16,14,20,0.85)] p-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div className="space-y-2">
                {/* <p className="text-xs uppercase tracking-[0.35em] text-white/60">{t('player_add_card_title', resolvedLanguage)}</p> */}
                <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
                  <label className="flex flex-col gap-1 text-xs uppercase tracking-[0.3em] text-white/60">
                    {t('player_add_card_type_label', resolvedLanguage)}
                    <select
                      value={pendingCardId}
                      onChange={event => {
                        const nextCardId = event.target.value as CardId;
                        setPendingCardId(nextCardId);
                        setPendingInstance(String(getSuggestedInstance(nextCardId)));
                      }}
                      className="rounded-xl border border-[rgba(242,200,121,0.25)] bg-[rgba(10,8,13,0.85)] px-3 py-2 text-sm font-semibold text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-brass)]"
                    >
                      {addableCardIds.map(cardId => (
                        <option
                          key={cardId}
                          value={cardId}
                          className="bg-[rgba(10,8,13,0.95)] text-white"
                        >
                          {getCardName(cardId, resolvedLanguage)}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="flex flex-col gap-1 text-xs uppercase tracking-[0.3em] text-white/60">
                    {t('player_add_card_instance_label', resolvedLanguage)}
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min={1}
                        value={pendingInstance}
                        onChange={event => setPendingInstance(event.target.value)}
                        className="min-w-[5rem] flex-1 h-10 rounded-xl border border-[rgba(242,200,121,0.25)] bg-[rgba(10,8,13,0.85)] px-3 py-2 text-sm font-semibold text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-brass)]"
                      />
                      <div className="flex h-10 overflow-hidden rounded-xl border border-[rgba(242,200,121,0.25)] bg-[rgba(10,8,13,0.85)]">
                        <button
                          type="button"
                          onClick={() => adjustPendingInstance(1)}
                          aria-label="Increase instance number"
                          className="flex h-full w-10 items-center justify-center text-center text-xl font-semibold leading-none text-white/80 transition hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-brass)]"
                        >
                          <PlusIcon size={18} weight="bold" />
                        </button>
                        <span className="w-px bg-[rgba(242,200,121,0.25)]" />
                        <button
                          type="button"
                          onClick={() => adjustPendingInstance(-1)}
                          aria-label="Decrease instance number"
                          className="flex h-full w-10 items-center justify-center text-center text-xl font-semibold leading-none text-white/80 transition hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-brass)]"
                        >
                          <MinusIcon size={18} weight="bold" />
                        </button>
                      </div>
                    </div>
                  </label>
                </div>
              </div>
              <div className="flex flex-col gap-2 sm:items-end">
                {isDuplicate && (
                  <p className="text-xs text-white/50">{t('player_add_card_duplicate', resolvedLanguage)}</p>
                )}
                <button
                  type="button"
                  onClick={handleAddCard}
                  disabled={!canAddCard}
                  className={`inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-brass)] ${
                    canAddCard
                      ? 'bg-[var(--color-brass)] text-[rgba(20,14,10,0.9)] shadow-[0_10px_25px_rgba(0,0,0,0.35)]'
                      : 'cursor-not-allowed border border-[rgba(242,200,121,0.2)] bg-[rgba(242,200,121,0.08)] text-white/50'
                  }`}
                >
                  {t('player_add_card_submit', resolvedLanguage)}
                </button>
              </div>
            </div>
          </section>
        )}

        {activeCards.length > 0 && (
          <section className="space-y-3">
            <h3 className={sectionTitleClass}>{t('cards_section_active', resolvedLanguage)}</h3>
            <div className={gridClass}>
              {activeCards.map(({ card, key, label, icon, glyph, indicators, description }, idx) => {
                const isDisabled = disabledCardSet.has(key);
                const actionButtonLabel = isDisabled ? 'Re-enable card' : 'Disable card';
                const actionButton = (
                  <button
                    type="button"
                    onClick={() => toggleCardDisabled(key)}
                    aria-pressed={isDisabled}
                    aria-label={actionButtonLabel}
                    title={actionButtonLabel}
                    className={`inline-flex h-9 w-9 items-center justify-center rounded-full border text-base font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-brass)] ${
                      isDisabled
                        ? 'border-[rgba(120,227,195,0.5)] bg-[rgba(120,227,195,0.1)] text-[#a9f5d0] hover:bg-[rgba(120,227,195,0.18)]'
                        : 'border-[rgba(245,132,132,0.5)] bg-[rgba(245,132,132,0.1)] text-[rgba(255,180,180,0.95)] hover:bg-[rgba(245,132,132,0.2)]'
                    }`}
                  >
                    {isDisabled ? '↺' : '×'}
                  </button>
                );

                return (
                  <CardDisplay
                    key={`${key}-${idx}`}
                    label={label}
                    glyph={glyph}
                    imageSrc={icon}
                    artMode={resolvedArtMode}
                    indicators={indicators}
                    description={description}
                    actionButton={actionButton}
                    isDisabled={isDisabled}
                    className={isPassiveCard(card.cardId) ? 'card-passive' : undefined}
                  />
                );
              })}
            </div>
          </section>
        )}
        {passiveCards.length > 0 && (
          <section className="space-y-3">
            <h3 className={sectionTitleClass}>{t('cards_section_passive', resolvedLanguage)}</h3>
            <div className={gridClass}>
              {passiveCards.map(({ card, key, label, icon, glyph, indicators, description }, idx) => {
                const isDisabled = disabledCardSet.has(key);
                const actionButtonLabel = isDisabled ? 'Re-enable card' : 'Disable card';
                const actionButton = (
                  <button
                    type="button"
                    onClick={() => toggleCardDisabled(key)}
                    aria-pressed={isDisabled}
                    aria-label={actionButtonLabel}
                    title={actionButtonLabel}
                    className={`inline-flex h-9 w-9 items-center justify-center rounded-full border text-base font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-brass)] ${
                      isDisabled
                        ? 'border-[rgba(120,227,195,0.5)] bg-[rgba(120,227,195,0.1)] text-[#a9f5d0] hover:bg-[rgba(120,227,195,0.18)]'
                        : 'border-[rgba(245,132,132,0.5)] bg-[rgba(245,132,132,0.1)] text-[rgba(255,180,180,0.95)] hover:bg-[rgba(245,132,132,0.2)]'
                    }`}
                  >
                    {isDisabled ? '↺' : '×'}
                  </button>
                );

                return (
                  <CardDisplay
                    key={`${key}-${idx}`}
                    label={label}
                    glyph={glyph}
                    imageSrc={icon}
                    artMode={resolvedArtMode}
                    indicators={indicators}
                    description={description}
                    actionButton={actionButton}
                    isDisabled={isDisabled}
                    className={isPassiveCard(card.cardId) ? 'card-passive' : undefined}
                  />
                );
              })}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};