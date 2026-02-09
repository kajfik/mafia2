import React, { useState } from 'react';
import { t, getCardName } from '../game/translations';
import { CARDS_CONFIG } from '../game/gameConfig';
import type { Language, CardId } from '../game/types';
import type { Action } from '../game/gameReducer';

const MIN_PLAYER_COUNT = 2;
const MAX_PLAYER_COUNT = 20;

function clampMafiaCount(value: number, players: number): number {
  if (Number.isNaN(value)) {
    return 1;
  }
  const rounded = Math.round(value);
  const max = Math.max(1, players - 1);
  return Math.min(Math.max(1, rounded), max);
}

function getDefaultMafiaCount(players: number): number {
  if (players <= 0) {
    return 1;
  }
  let recommended = 1;
  let maxPlayersForTier = 4;
  let increment = 2;

  while (players > maxPlayersForTier) {
    recommended += 1;
    maxPlayersForTier += increment;
    increment += 1;
  }

  const max = Math.max(1, players - 1);
  return Math.min(Math.max(recommended, 1), max);
}

interface SetupWizardProps {
  dispatch: React.Dispatch<Action>;
  language: Language;
}

export const SetupWizard: React.FC<SetupWizardProps> = ({ dispatch, language }) => {
  const [step, setStep] = useState(1);
  const [playerCount, setPlayerCount] = useState(7);
  const [playerCountInput, setPlayerCountInput] = useState('7');
  const [mafiaCount, setMafiaCount] = useState(() => getDefaultMafiaCount(7));
  const [names, setNames] = useState<string[]>([]);
  
  // For Step 4 (Card Removal)
  // We keep a local count of every card available
  const [deckConfig, setDeckConfig] = useState<Record<CardId, number>>(() => {
    const initial = {} as Record<CardId, number>;
    Object.values(CARDS_CONFIG).forEach(r => initial[r.id] = r.defaultAmount);
    return initial;
  });

  const nextButtonClass = 'mafia-button mafia-button--jade font-bold tracking-[0.3em] uppercase py-3 px-8 rounded-2xl text-lg';

  // Language is selected in the App; SetupWizard no longer shows a language step.

  // --- STEP 1: Player Count ---
  if (step === 1) {
    const parsedPlayerCount = Number(playerCountInput);
    const hasPlayerCount = Number.isFinite(parsedPlayerCount);
    const roundedPlayerCount = hasPlayerCount ? Math.round(parsedPlayerCount) : playerCount;
    const isPlayerCountValid = hasPlayerCount
      && roundedPlayerCount >= MIN_PLAYER_COUNT
      && roundedPlayerCount <= MAX_PLAYER_COUNT;

    return (
      <div className="w-full max-w-md mx-auto">
        <div className="setup-panel text-white items-center text-center">
          <h2 className="text-2xl font-bold">
            {t('setup_step_count', language)} ({MIN_PLAYER_COUNT}-{MAX_PLAYER_COUNT})
          </h2>
          <input 
            type="number" 
            value={playerCountInput}
            onChange={(e) => {
              const rawValue = e.target.value;
              setPlayerCountInput(rawValue);
              if (rawValue.trim() === '') {
                return;
              }
              const numericValue = Number(rawValue);
              if (!Number.isFinite(numericValue)) {
                return;
              }
              const nextCount = Math.round(numericValue);
              if (nextCount < MIN_PLAYER_COUNT || nextCount > MAX_PLAYER_COUNT) {
                return;
              }
              setPlayerCount(nextCount);
              setMafiaCount(getDefaultMafiaCount(nextCount));
            }}
            className="mafia-input text-3xl text-center w-32 font-bold tracking-[0.2em]"
          />
          <button 
            onClick={() => {
              if (!isPlayerCountValid) {
                return;
              }
              setPlayerCount(roundedPlayerCount);
              setMafiaCount(getDefaultMafiaCount(roundedPlayerCount));
              setStep(2);
            }}
            className={`${nextButtonClass} ${!isPlayerCountValid ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={!isPlayerCountValid}
          >
            {t('setup_next', language)} &rarr;
          </button>
        </div>
      </div>
    );
  }

  // --- STEP 2: Mafia Count ---
  if (step === 2) {
    const minMafia = 1;
    const maxMafia = Math.max(1, playerCount - 1);
    const recommendedMafia = getDefaultMafiaCount(playerCount);

    const handleMafiaChange = (rawValue: number) => {
      setMafiaCount(clampMafiaCount(rawValue, playerCount));
    };

    return (
      <div className="w-full max-w-xl mx-auto">
        <div className="setup-panel text-white">
          <h2 className="text-2xl font-bold">{t('setup_step_mafia', language)}</h2>
          <p className="text-center text-[rgba(255,255,255,0.75)]">
            {t('setup_mafia_description', language, { min: minMafia, max: maxMafia })}
          </p>
          <div className="rounded-2xl border border-[rgba(242,200,121,0.25)] bg-[rgba(4,4,8,0.88)] p-5 flex flex-col gap-4 shadow-[inset_0_0_30px_rgba(0,0,0,0.35)]">
            <div className="flex items-center justify-between text-lg font-semibold">
              <span>{t('setup_mafia_label', language)}</span>
              <span className="text-4xl font-bold text-[var(--color-brass)]">{mafiaCount}</span>
            </div>
            <input
              type="range"
              min={minMafia}
              max={maxMafia}
              value={mafiaCount}
              onChange={(e) => handleMafiaChange(Number(e.target.value))}
              className="w-full accent-[var(--color-brass)]"
            />
            <p className="text-sm text-slate-300 text-center">
              {t('setup_mafia_recommended', language, { players: playerCount, count: recommendedMafia })}
            </p>
          </div>
          <button 
            onClick={() => {
              setNames(Array(playerCount).fill(''));
              setStep(3);
            }}
            className={nextButtonClass}
          >
            {t('setup_next', language)} &rarr;
          </button>
        </div>
      </div>
    );
  }

  // --- STEP 3: Player Names ---
  if (step === 3) {
    return (
      <div className="w-full max-w-md mx-auto">
        <div className="setup-panel text-white">
          <h2 className="text-2xl font-bold">{t('setup_step_names', language)}</h2>
          <div className="flex flex-col gap-2 max-h-[60vh] w-full overflow-y-auto pr-1">
            {names.map((name, i) => (
              <div key={i} className="flex gap-2 items-center">
                <span className="w-8 text-right font-mono text-[rgba(255,255,255,0.55)]">{i + 1}.</span>
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => {
                    const newNames = [...names];
                    newNames[i] = e.target.value;
                    setNames(newNames);
                  }}
                  className="mafia-input flex-1 text-base"
                />
              </div>
            ))}
          </div>
          <button 
            onClick={() => {
              setDeckConfig(prev => ({ ...prev, Mafia: mafiaCount }));
              setStep(4);
            }}
            className={nextButtonClass}
          >
            {t('setup_next', language)} &rarr;
          </button>
        </div>
      </div>
    );
  }

  // --- STEP 4: Balance Cards ---
  // Math Logic
  const currentTotalCards = Object.values(deckConfig).reduce((a, b) => a + b, 0);
  const remainder = currentTotalCards % playerCount;
  const missingForFullHands = Math.max(0, playerCount - currentTotalCards);
  const cardsToRemove = remainder === 0 ? 0 : remainder;
  const cardsToAdd = remainder === 0 ? missingForFullHands : playerCount - remainder;
  const hasEnoughCards = missingForFullHands === 0;
  const canStartGame = remainder === 0 && hasEnoughCards;
  const startButtonClasses = canStartGame
    ? 'mafia-button mafia-button--jade text-xs sm:text-sm font-black tracking-[0.25em] uppercase px-5 py-3 rounded-xl shadow-lg'
    : 'px-5 py-3 rounded-xl font-black text-xs sm:text-sm tracking-[0.25em] uppercase bg-[rgba(18,16,26,0.85)] text-slate-500 border border-[rgba(255,255,255,0.08)] cursor-not-allowed shadow-lg';
  
  const handleRemoveCard = (cardId: CardId) => {
    const minimum = cardId === 'Mafia' ? 1 : 0;
    setDeckConfig(prev => {
      const current = prev[cardId] ?? 0;
      if (current <= minimum) {
        return prev;
      }
      return { ...prev, [cardId]: current - 1 };
    });
  };

  const handleAddCard = (cardId: CardId) => {
    setDeckConfig(prev => {
      const current = prev[cardId] ?? 0;
      return { ...prev, [cardId]: current + 1 };
    });
  };

  const handleStartGame = () => {
    // Convert counts back to a flat array (The Custom Deck)
    const flatDeck: CardId[] = [];
    Object.entries(deckConfig).forEach(([id, count]) => {
      for(let i=0; i<count; i++) flatDeck.push(id as CardId);
    });

    dispatch({ 
      type: 'START_GAME', 
      payload: { 
        names: names, 
        customDeck: flatDeck, 
        language: language 
      } 
    });
  };

  return (
    <div className="flex flex-col gap-4 sm:gap-6 text-white w-full max-w-5xl mx-auto h-full min-h-0">
      <h2 className="text-2xl font-bold text-center">{t('setup_step_balance', language)}</h2>
      <div className="setup-balance-shell">
        <div className="setup-balance-toolbar">
          <div className="setup-panel__metrics" role="group" aria-label={t('setup_step_balance', language)}>
            <div className={`setup-metric-card ${cardsToRemove === 0 ? 'setup-metric-card--ok' : 'setup-metric-card--warn'}`}>
              <div className="setup-metric-card__value">{cardsToRemove}</div>
              <div>{t('setup_cards_remaining', language)}</div>
            </div>
            <div className={`setup-metric-card ${cardsToAdd === 0 ? 'setup-metric-card--ok' : 'setup-metric-card--pending'}`}>
              <div className="setup-metric-card__value">{cardsToAdd}</div>
              <div>{t('setup_cards_missing', language)}</div>
            </div>
          </div>
          <button 
            onClick={() => {
              if (!canStartGame) {
                return;
              }
              handleStartGame();
            }}
            disabled={!canStartGame}
            className={`${startButtonClasses} setup-balance-toolbar__button transition-colors duration-150`}
          >
            {t('setup_start_game', language)}
          </button>
        </div>

        <div className="setup-balance-content">
          <div className="setup-panel text-center text-white">
            <p className="text-lg text-[rgba(242,200,121,0.9)]">
               {t('setup_balance_instruction', language, { remove: cardsToRemove, add: cardsToAdd })}
            </p>
            <div className="text-sm text-slate-300">
              {t('setup_cards_total', language, { count: currentTotalCards, players: playerCount })}
            </div>
            {!hasEnoughCards && (
              <div className="text-sm text-yellow-300">
                {t('setup_cards_minimum', language, { missing: missingForFullHands })}
              </div>
            )}
          </div>

          {/* Card Grid */}
          <div className="setup-card-grid w-full p-1 sm:p-2">
            {Object.values(CARDS_CONFIG).map(card => {
              const id = card.id;
              const count = deckConfig[id] ?? 0;
              const minimum = id === 'Mafia' ? 1 : 0;
              const canDecrease = count > minimum;
              return (
                <div
                  key={id}
                  className="setup-card-tile"
                >
                  <span className="setup-card-title">{getCardName(id, language)}</span>
                  <div className="setup-card-actions">
                    <button
                      type="button"
                      onClick={() => handleRemoveCard(id)}
                      className={`setup-adjust setup-adjust--remove ${!canDecrease ? 'setup-adjust--disabled' : ''}`}
                      disabled={!canDecrease}
                      aria-label={`${getCardName(id, language)} -`}
                    >
                      -
                    </button>
                    <span className="setup-card-count">
                      {count}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleAddCard(id)}
                      className="setup-adjust setup-adjust--add"
                      aria-label={`${getCardName(id, language)} +`}
                    >
                      +
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};