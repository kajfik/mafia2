import { useReducer, useState, useEffect, useMemo, useCallback } from 'react';
import type { CSSProperties } from 'react';
import { gameReducerWrapper, initialWrapper, DEFAULT_PLAYER_NODE_SCALE, PLAYER_NODE_SCALE_MIN, PLAYER_NODE_SCALE_MAX } from './game/gameReducer';
import { canDoctorSelfHealThisNight } from './game/doctorRules';
import type { Language, GameState, UndoWrapper } from './game/types';
import { LANGUAGE_OPTIONS, t, getLanguageLocale } from './game/translations';

// Views
import { SetupWizard } from './components/SetupWizard';
import { GameTable } from './components/GameTable';
import { ControlPanel } from './components/ControlPanel';
import { GameLogPanel } from './components/GameLogPanel';
import { BottomNav } from './components/BottomNav';
import { PlayerView } from './components/PlayerView';
import { GMPlayerList } from './components/GMPlayerList';
import { RulesView } from './components/RulesView';
import { LogsTab } from './components/LogsTab';
import { CardsTab } from './components/CardsTab';
import { usePlayerLinkData } from './hooks/usePlayerLinkData';

// Hooks
import { useGameStorage } from './hooks/useLocalStorage';

type AppMode = 'LANG_SELECT' | 'GM_SETUP' | 'GM_GAME' | 'PLAYER_GAME';
type Tab = 'GAME' | 'PLAYERS' | 'LOGS' | 'RULES' | 'CARDS' | 'SETTINGS';

function App() {
  const { savedState, saveGame, clearSave } = useGameStorage();
  
  const [wrapper, dispatch] = useReducer(gameReducerWrapper, initialWrapper);
  
  const [mode, setMode] = useState<AppMode>(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('data')) {
      return 'PLAYER_GAME';
    }
    return 'LANG_SELECT';
  });

  const [activeTab, setActiveTab] = useState<Tab>('GAME');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selectedLang, setSelectedLang] = useState<Language>('pl');
  const [tableViewportSize, setTableViewportSize] = useState<number | null>(null);
  const [manualLogRound, setManualLogRound] = useState<number | null>(null);
  const state = wrapper.present;
  const gmLang = state.settings.language;
  const playerLinkData = usePlayerLinkData();
  const playerLanguage = playerLinkData?.lang ?? 'pl';

  const persistSavedLanguage = useCallback((language: Language) => {
    if (!savedState) {
      return;
    }
    const updatedWrapper = updateWrapperLanguage(savedState, language);
    saveGame(updatedWrapper);
  }, [savedState, saveGame]);

  useEffect(() => {
    const setViewportHeight = () => {
      if (typeof window === 'undefined') return;
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--app-vh', `${vh}px`);
    };
    setViewportHeight();
    window.addEventListener('resize', setViewportHeight);
    window.addEventListener('orientationchange', setViewportHeight);
    return () => {
      window.removeEventListener('resize', setViewportHeight);
      window.removeEventListener('orientationchange', setViewportHeight);
    };
  }, []);

  useEffect(() => {
    if (typeof document === 'undefined') return;
    document.documentElement.lang = getLanguageLocale(gmLang);
  }, [gmLang]);

  const viewportHeightStyle: CSSProperties = { minHeight: 'calc(var(--app-vh, 1vh) * 100)' };
  const navSpacerStyle: CSSProperties = { height: 'calc(4rem + var(--safe-area-bottom, env(safe-area-inset-bottom, 0px)))' };
  const hasPendingDayReport = Boolean(state.uiState.pendingDayReport?.length);
  const hideGameTabTable = state.phase === 'DAY_ANNOUNCEMENT' || hasPendingDayReport;
  const latestLogRound = Math.max(1, state.currentRound || 1);
  const activeLogRound = Math.min(manualLogRound ?? latestLogRound, latestLogRound);
  const disabledPlayerIds = useMemo(() => computeDisabledPlayerIds(state), [state]);
  const activeCardOwnerId = useMemo(() => {
    if (!state.activeCard) return null;
    const owner = state.players.find(player =>
      player.cards.some(card => card.cardId === state.activeCard!.cardId && card.instance === state.activeCard!.instance)
    );
    return owner?.id ?? null;
  }, [state.players, state.activeCard]);
  const spyglassHighlightIds = useMemo(() => {
    if (state.phase !== 'NIGHT_ACTIVE' || state.activeCard?.cardId !== 'Spyglass') {
      return null;
    }
    const revealIds = state.nightCache.spyglassRevealIds ?? [];
    const filtered = revealIds.filter(id => id !== activeCardOwnerId);
    return new Set(filtered);
  }, [state.phase, state.activeCard, state.nightCache.spyglassRevealIds, activeCardOwnerId]);
  const massMurdererSelectionIds = useMemo(() => {
    if (state.phase !== 'DAY_MAIN') {
      return null;
    }
    const dayAction = state.uiState.dayAction;
    if (dayAction?.kind !== 'MASS_MURDERER_RETALIATION') {
      return null;
    }
    const ids = dayAction.massMurderer?.selectedIds ?? [];
    return new Set(ids);
  }, [state.phase, state.uiState.dayAction]);
  const highlightedPlayerIds = useMemo(() => {
    if (!spyglassHighlightIds && !massMurdererSelectionIds) {
      return undefined;
    }
    const combined = new Set<string>();
    spyglassHighlightIds?.forEach(id => combined.add(id));
    massMurdererSelectionIds?.forEach(id => combined.add(id));
    return combined;
  }, [spyglassHighlightIds, massMurdererSelectionIds]);
  const sliderMinPercent = Math.round((PLAYER_NODE_SCALE_MIN / DEFAULT_PLAYER_NODE_SCALE) * 100);
  const sliderMaxPercent = Math.round((PLAYER_NODE_SCALE_MAX / DEFAULT_PLAYER_NODE_SCALE) * 100);
  const rawScalePercent = Math.round((state.settings.playerNodeScale / DEFAULT_PLAYER_NODE_SCALE) * 100);
  const playerScalePercent = Math.min(sliderMaxPercent, Math.max(sliderMinPercent, rawScalePercent));
  const bulletSpeedMin = 150;
  const bulletSpeedMax = 1500;
  const bulletSpeed = Math.min(bulletSpeedMax, Math.max(bulletSpeedMin, state.settings.bulletSpeed));
  const languageOptionBaseClasses = 'rounded-2xl border border-[rgba(242,200,121,0.3)] bg-[rgba(255,255,255,0.02)] p-4 text-left transition shadow-[0_10px_25px_rgba(0,0,0,0.45)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--color-brass)] disabled:cursor-default backdrop-blur';

  const handleLogRoundChange = (round: number) => {
    const maxRound = latestLogRound;
    const nextRound = Math.min(Math.max(1, round), maxRound);
    setManualLogRound(nextRound === latestLogRound ? null : nextRound);
  };

  const handlePlayerSelect = (id: string) => {
    if (disabledPlayerIds.has(id)) return;
    setSelectedId(id);
    dispatch({ type: 'GM_CLICK_PLAYER', payload: id });
  };

  const handleLanguageChange = (code: Language) => {
    if (code === gmLang) {
      return;
    }
    dispatch({ type: 'UPDATE_SETTINGS', payload: { language: code } });
  };

  // Auto-Save when state changes (Only for GM)
  useEffect(() => {
    if (mode === 'GM_GAME' && state.phase !== 'SETUP') {
      saveGame(wrapper);
    }
  }, [wrapper, mode, saveGame, state.phase]);

  // --- RENDERERS ---

  // 1. Language Selection
  if (mode === 'LANG_SELECT') {
    return (
      <div className="mafia-app flex items-center justify-center px-6" style={viewportHeightStyle}>
        <div className="mafia-screen flex flex-col items-center gap-8 rounded-[2.5rem] p-8 text-center w-full max-w-2xl">
          <span className="mafia-badge">Town of Palermo</span>
          <h1 className="mafia-title text-4xl">{t('app_title', selectedLang)}</h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
            {LANGUAGE_OPTIONS.map(option => (
              <button
                key={option.code}
                onClick={() => {
                  setSelectedLang(option.code);
                  dispatch({ type: 'UPDATE_SETTINGS', payload: { language: option.code } });
                  persistSavedLanguage(option.code);
                  setMode('GM_SETUP');
                }}
                className="mafia-button mafia-button--ember py-4 px-8 rounded-2xl font-bold tracking-[0.3em] uppercase"
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // 3. GM Setup (New vs Continue)
  if (mode === 'GM_SETUP') {
    const continueLang = savedState?.present.settings.language ?? selectedLang;
    return (
      <div className="mafia-app flex items-center justify-center px-6" style={viewportHeightStyle}>
        <div className="mafia-screen flex flex-col items-center gap-6 rounded-[2.5rem] p-8 text-center w-full max-w-xl">
          {savedState && (
            <button
              onClick={() => {
                dispatch({ type: 'LOAD_GAME', payload: savedState });
                setMode('GM_GAME');
              }}
              className="w-full mafia-button mafia-button--brass py-4 rounded-2xl font-bold text-base tracking-[0.3em] uppercase"
            >
              {t('app_continue_game', continueLang)}
              <br />
              <span className="text-xs font-normal tracking-[0.2em]">{t('app_continue_round', continueLang, { round: savedState.present.currentRound })}</span>
            </button>
          )}

          <button
            onClick={() => { clearSave(); setMode('GM_GAME'); }}
            className="w-full border border-[rgba(242,200,121,0.35)] text-white py-4 rounded-2xl font-bold text-base tracking-[0.3em] uppercase hover:bg-white/5 transition"
          >
            {t('app_new_game', selectedLang)}
          </button>
        </div>
      </div>
    );
  }

  // 4. GM Game Loop
  if (mode === 'GM_GAME') {
    if (state.phase === 'SETUP') {
      return (
        <div className="mafia-app p-4" style={viewportHeightStyle}>
          <div className="mafia-screen rounded-[2rem] p-4 md:p-8 w-full h-full overflow-hidden">
            <SetupWizard dispatch={dispatch} language={selectedLang} />
          </div>
        </div>
      );
    }

    return (
      <>
        <div className="mafia-app flex flex-col overflow-hidden" style={viewportHeightStyle}>
          <div className="flex-1 relative overflow-hidden mafia-screen flex flex-col min-h-0 rounded-t-[2rem] border border-[rgba(242,200,121,0.12)] p-3 sm:p-6">
          
          {activeTab === 'GAME' && (
            <div className="h-full flex flex-1 flex-col min-h-0 gap-4">
              {!hideGameTabTable && (
                <div className="flex-1 min-h-0 overflow-hidden">
                  <div className="h-full min-h-0 flex flex-col gap-4 lg:flex-row lg:items-start">
                    <div
                      className="mafia-panel flex-1 min-h-0 p-4 lg:flex-1 lg:basis-1/2"
                      style={tableViewportSize ? { height: tableViewportSize, maxHeight: tableViewportSize } : undefined}
                    >
                      <GameTable
                        players={state.players}
                        phase={state.phase}
                        selectedId={selectedId}
                        onSelect={handlePlayerSelect}
                        tunnels={state.globalTunnels}
                        disabledPlayerIds={disabledPlayerIds}
                        playerNodeScale={state.settings.playerNodeScale}
                        onTableSizeChange={setTableViewportSize}
                        highlightedPlayerIds={highlightedPlayerIds}
                        communistSuppressionActive={state.uiState.communistSuppressionActive}
                        bulletAnimations={state.nightCache.bulletAnimations}
                        bulletSpeed={state.settings.bulletSpeed}
                        bulletReplayNonce={state.uiState.bulletReplayNonce}
                        matrixTrapPlayerId={state.nightCache.matrixTrap?.playerId ?? null}
                      />
                    </div>
                    <div
                      className="hidden lg:flex lg:flex-col lg:flex-1 lg:basis-1/2 min-h-0 mafia-panel p-4"
                      style={tableViewportSize ? { height: tableViewportSize, maxHeight: tableViewportSize } : undefined}
                    >
                      <GameLogPanel
                        logs={state.logs}
                        players={state.players}
                        language={gmLang}
                        className="w-full h-full"
                        title={t('logs_panel_title', gmLang)}
                        emptyMessage={t('logs_panel_empty', gmLang)}
                      />
                    </div>
                  </div>
                </div>
              )}
              <div className={hideGameTabTable ? 'flex-1 min-h-0' : 'mt-2 sm:mt-4'}>
                <ControlPanel state={state} dispatch={dispatch} fullHeight={hideGameTabTable} />
              </div>
            </div>
          )}

          {activeTab === 'PLAYERS' && (
            <div className="h-full overflow-hidden">
              <div className="mafia-panel h-full overflow-hidden">
                <GMPlayerList state={state} />
              </div>
            </div>
          )}
          
          {activeTab === 'LOGS' && (
            <div className="h-full overflow-hidden">
              <div className="mafia-panel h-full overflow-hidden">
                <LogsTab
                  state={state}
                  selectedRound={activeLogRound}
                  onSelectRound={handleLogRoundChange}
                />
              </div>
            </div>
          )}

          {activeTab === 'RULES' && (
            <div className="h-full overflow-hidden">
                <div className="mafia-panel h-full overflow-hidden">
                <RulesView language={state.settings.language} />
              </div>
            </div>
          )}

          {activeTab === 'CARDS' && (
            <div className="h-full overflow-hidden">
              <div className="mafia-panel h-full overflow-hidden">
                <CardsTab language={state.settings.language} />
              </div>
            </div>
          )}

           {activeTab === 'SETTINGS' && (
             <div className="h-full overflow-hidden">
              <div className="mafia-panel h-full overflow-hidden">
                <div className="h-full overflow-y-auto text-white px-3 pt-6 pb-24 sm:px-4 sm:pt-8 space-y-6">
                  <div className="mafia-panel p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold mafia-title text-[var(--color-brass)]">{t('settings_title', gmLang)}</h2>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">{t('settings_language_title', gmLang)}</h3>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {LANGUAGE_OPTIONS.map(option => {
                      const isActive = option.code === gmLang;
                      const optionClasses = isActive
                        ? 'border-[rgba(242,200,121,0.7)] bg-[rgba(242,200,121,0.1)] text-white'
                        : 'border-[rgba(242,200,121,0.2)] bg-[rgba(8,8,12,0.6)] text-slate-200 hover:border-[rgba(242,200,121,0.35)]';
                      return (
                        <button
                          key={option.code}
                          onClick={() => handleLanguageChange(option.code)}
                          aria-pressed={isActive}
                          disabled={isActive}
                          className={`${languageOptionBaseClasses} ${optionClasses}`}
                        >
                          <div className="text-base font-semibold">{option.label}</div>
                          <div className="text-xs uppercase tracking-[0.4em] text-slate-300">
                            {getLanguageLocale(option.code)}
                          </div>
                          {isActive && (
                            <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-white/10 px-2 py-0.5 text-[0.65rem] font-semibold text-white">
                              {t('settings_language_active', gmLang)}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                  </div>
                  <div className="mafia-panel p-4 space-y-4">
                  <div>
                    <div className="flex items-center justify-between text-sm uppercase tracking-[0.4em] text-slate-300">
                      <span>{t('settings_player_node_size', gmLang)}</span>
                      <span className="font-mono text-slate-50">{playerScalePercent}%</span>
                    </div>
                    <input
                      type="range"
                      min={sliderMinPercent}
                      max={sliderMaxPercent}
                      step={10}
                      value={playerScalePercent}
                      onChange={e => dispatch({
                        type: 'UPDATE_SETTINGS',
                        payload: { playerNodeScale: (Number(e.target.value) / 100) * DEFAULT_PLAYER_NODE_SCALE }
                      })}
                      className="w-full mt-3 touch-slider"
                    />
                    <button
                      onClick={() => dispatch({ type: 'UPDATE_SETTINGS', payload: { playerNodeScale: DEFAULT_PLAYER_NODE_SCALE } })}
                      className="text-xs text-[var(--color-brass)] underline mt-2"
                    >
                      {t('settings_reset_player_size', gmLang)}
                    </button>
                    <p className="text-xs text-slate-300 mt-1">{t('settings_player_node_hint', gmLang)}</p>
                  </div>
                  <div>
                    <div className="flex items-center justify-between text-sm uppercase tracking-[0.4em] text-slate-300">
                      <span>{t('settings_bullet_speed', gmLang)}</span>
                      <span className="font-mono text-slate-50">{bulletSpeed} ms</span>
                    </div>
                    <input
                      type="range"
                      min={bulletSpeedMin}
                      max={bulletSpeedMax}
                      step={50}
                      value={bulletSpeed}
                      onChange={e => dispatch({ type: 'UPDATE_SETTINGS', payload: { bulletSpeed: Number(e.target.value) } })}
                      className="w-full mt-3 touch-slider"
                    />
                    <div className="flex justify-between text-xs text-slate-400 mt-1">
                      <span>{t('settings_bullet_speed_fast', gmLang)}</span>
                      <span>{t('settings_bullet_speed_slow', gmLang)}</span>
                    </div>
                    <p className="text-xs text-slate-300 mt-1">{t('settings_bullet_speed_hint', gmLang)}</p>
                  </div>
                  </div>
                  <div className="mafia-panel p-4 space-y-3">
                  <h3 className="text-lg font-semibold">{t('settings_storage_title', gmLang)}</h3>
                  <p className="text-sm text-slate-200">{t('settings_storage_description', gmLang)}</p>
                  <button onClick={() => { clearSave(); window.location.reload(); }} className="mt-3 mafia-button mafia-button--ember p-3 rounded font-semibold uppercase tracking-[0.3em]">
                    {t('settings_reset_data_button', gmLang)}
                  </button>
                </div>
                </div>
              </div>
             </div>
          )}
          
          </div>
          <div className="shrink-0" aria-hidden style={navSpacerStyle} />
        </div>
        <BottomNav activeTab={activeTab} setTab={setActiveTab} isGm={true} language={gmLang} />
      </>
    );
  }

  // 5. Player View
  if (mode === 'PLAYER_GAME') {
    return (
      <>
        <div className="mafia-app flex flex-col" style={viewportHeightStyle}>
          <div className="flex-1 overflow-hidden mafia-screen rounded-t-[2rem] border border-[rgba(242,200,121,0.12)] p-3 sm:p-6">
           {activeTab === 'GAME' && <PlayerView />}
           {activeTab === 'CARDS' && (
             playerLinkData ? (
               <CardsTab
                 language={playerLanguage}
                 playerCards={playerLinkData.cards}
                 playerLabels={playerLinkData.labels}
               />
             ) : (
               <div className="p-8 text-white">{t('player_link_invalid', playerLanguage)}</div>
             )
           )}
           {activeTab === 'RULES' && <RulesView language={playerLanguage} />}
          </div>
          <div className="shrink-0" aria-hidden style={navSpacerStyle} />
        </div>
        <BottomNav activeTab={activeTab} setTab={setActiveTab} isGm={false} language={playerLanguage} />
      </>
    );
  }

  return null;
}

function updateWrapperLanguage(wrapper: UndoWrapper, language: Language): UndoWrapper {
  let changed = false;
  const applyLanguage = (gameState: GameState): GameState => {
    if (gameState.settings.language === language) {
      return gameState;
    }
    changed = true;
    return {
      ...gameState,
      settings: {
        ...gameState.settings,
        language
      }
    };
  };

  const past = wrapper.past.map(applyLanguage);
  const present = applyLanguage(wrapper.present);
  const future = wrapper.future.map(applyLanguage);

  if (!changed) {
    return wrapper;
  }

  return { past, present, future };
}

function computeDisabledPlayerIds(state: GameState): Set<string> {
  if (state.phase === 'NIGHT_REPLAY') {
    return new Set(state.players.map(player => player.id));
  }
  const disabled = new Set<string>();
  if (state.phase !== 'NIGHT_ACTIVE' || !state.activeCard) {
    return disabled;
  }

  const currentPrompt = state.uiState.pendingPrompts[0];
  const selectionContext = state.uiState.selectionContext;

  if (state.activeCard.cardId === 'Mage' && currentPrompt === 'wake_up_mage_to') {
    const sourceId = selectionContext?.cardId === 'Mage' ? selectionContext.data?.['sourceId'] : undefined;
    if (sourceId) {
      disabled.add(sourceId);
    }
  }

  if (state.activeCard.cardId === 'BlindExecutioner' && currentPrompt === 'action_executioner_victim') {
    const savedId = selectionContext?.cardId === 'BlindExecutioner' ? selectionContext.data?.['savedId'] : undefined;
    if (savedId) {
      disabled.add(savedId);
    }
  }

  if (state.activeCard.cardId === 'Doctor') {
    const healer = state.players.find(player =>
      player.cards.some(card => card.cardId === 'Doctor' && card.instance === state.activeCard!.instance)
    );
    if (healer && !canDoctorSelfHealThisNight(state)) {
      disabled.add(healer.id);
    }
  }

  if (state.activeCard.cardId === 'Sock' && currentPrompt === 'wake_up_sock_second') {
    const firstTargetId = selectionContext?.cardId === 'Sock' ? selectionContext.data?.['firstTargetId'] : undefined;
    if (firstTargetId) {
      const alivePlayers = state.players.filter(player => player.status.isAlive);
      const idx = alivePlayers.findIndex(player => player.id === firstTargetId);
      if (idx !== -1) {
        const neighborIds = new Set<string>();
        if (alivePlayers.length > 1) {
          const left = alivePlayers[(idx - 1 + alivePlayers.length) % alivePlayers.length];
          neighborIds.add(left.id);
          const right = alivePlayers[(idx + 1) % alivePlayers.length];
          neighborIds.add(right.id);
        }
        alivePlayers.forEach(player => {
          if (player.id === firstTargetId || !neighborIds.has(player.id)) {
            disabled.add(player.id);
          }
        });
      }
    }
  }

  return disabled;
}

export default App;