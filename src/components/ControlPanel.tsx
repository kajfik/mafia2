import React, { useMemo } from 'react';
import type { GameState, PublicReportEntry, Player, CardId } from '../game/types';
import type { Action } from '../game/gameReducer';
import { t, getCardName } from '../game/translations';
import { computeCardLabels } from '../game/cardLabels';
import { translateTemplateSegments, type LogDisplaySegment } from '../game/logging';
import { CardLabelBadge } from './CardLabelBadge';

interface ControlPanelProps {
  state: GameState;
  dispatch: React.Dispatch<Action>;
  fullHeight?: boolean;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({ state, dispatch, fullHeight = false }) => {
  const lang = state.settings.language;
  const labelsMap = useMemo(() => computeCardLabels(state.players, lang), [state.players, lang]);
  const isFirstNightBriefing = state.phase === 'NIGHT_ANNOUNCEMENT' && state.currentRound === 1 && !state.firstNightBriefingDone;
  const pendingDayReport = state.uiState.pendingDayReport;
  const hasPendingDayReport = Boolean(pendingDayReport?.length);
  const showPublicReport = state.phase === 'DAY_ANNOUNCEMENT' || state.phase === 'GAME_OVER' || hasPendingDayReport;
  const isDayAnnouncement = state.phase === 'DAY_ANNOUNCEMENT';
  const isDayMain = state.phase === 'DAY_MAIN';
  const hideWakeMessageOnMobileDay = isDayAnnouncement || isDayMain;
  const canReplayBullets = state.phase === 'NIGHT_REPLAY' && Boolean(state.nightCache.bulletAnimations?.length);
  const alivePlayers = useMemo(() => state.players.filter(player => player.status.isAlive), [state.players]);
  const specialRolesInfo = useMemo(() => {
    const noOwnerText = t('ui_special_no_owner', lang);
    const formatOwnerLabel = (player: Player, cardId: CardId) => {
      const cardIndex = player.cards.findIndex(card => card.cardId === cardId);
      return (cardIndex >= 0 ? labelsMap[player.id]?.[cardIndex] : undefined) || getCardName(cardId, lang);
    };
    const buildInfo = (cardId: CardId, readinessCheck: (player: Player) => boolean) => {
      const ownerInfos = alivePlayers
        .filter(player => player.cards.some(card => card.cardId === cardId))
        .map(player => ({
          player,
          label: formatOwnerLabel(player, cardId)
        }));
      const readyOwners = ownerInfos.filter(info => readinessCheck(info.player));
      const displayOwners = readyOwners.length ? readyOwners : ownerInfos;
      const text = displayOwners.length
        ? displayOwners.map(info => `${info.label} (${info.player.name})`).join(', ')
        : noOwnerText;
      return {
        ready: readyOwners.length > 0,
        text
      };
    };
    return {
      anarchist: buildInfo('Anarchist', player => !player.status.anarchistShotUsed),
      terrorist: buildInfo('Terrorist', player => !player.status.terroristBombUsed),
      astronomer: buildInfo('Astronomer', player => !player.status.astronomerNightUsed),
      communist: buildInfo('Communist', player => !player.status.communistEqualityUsed)
    };
  }, [alivePlayers, labelsMap, lang]);
  const hasReadyTimeLord = useMemo(
    () =>
      state.players.some(
        player =>
          player.status.isAlive &&
          !player.status.timeLordSkipUsed &&
          player.cards.some(card => card.cardId === 'TimeLord')
      ),
    [state.players]
  );
  const timeLordCardLabel = useMemo(() => {
    const defaultLabel = getCardName('TimeLord', lang);
    const owner = state.players.find(
      player =>
        player.status.isAlive &&
        !player.status.timeLordSkipUsed &&
        player.cards.some(card => card.cardId === 'TimeLord')
    );
    if (!owner) {
      return defaultLabel;
    }
    const cardIndex = owner.cards.findIndex(card => card.cardId === 'TimeLord');
    if (cardIndex < 0) {
      return defaultLabel;
    }
    const instance = owner.cards[cardIndex].instance;
    const fallbackLabel = instance != null ? `${defaultLabel} ${instance}` : defaultLabel;
    return labelsMap[owner.id]?.[cardIndex] ?? fallbackLabel;
  }, [state.players, labelsMap, lang]);
  const canUseAnarchistShot = specialRolesInfo.anarchist.ready;
  const canTriggerBomb = specialRolesInfo.terrorist.ready;
  const canCallAstronomer = specialRolesInfo.astronomer.ready;
  const canUseCommunist = specialRolesInfo.communist.ready;
  const canSkipNight = hasReadyTimeLord && state.phase === 'NIGHT_ANNOUNCEMENT' && !isFirstNightBriefing;
  const canSkipDay = hasReadyTimeLord && isDayAnnouncement;
  const dayActionLocked = Boolean(state.uiState.dayAction) || hasPendingDayReport;
  const voteInProgress = state.uiState.dayAction?.kind === 'HANG';
  const astronomerDisabled =
    !canCallAstronomer ||
    hasPendingDayReport ||
    (!!state.uiState.dayAction && !voteInProgress);
  const isSpyglassStage = state.activeCard?.cardId === 'Spyglass';
  const timeLordButtonBase =
    'mafia-button font-bold text-center w-full h-full flex items-center justify-center tracking-[0.2em] uppercase shadow-[0_12px_25px_rgba(0,0,0,0.55)] rounded-xl overflow-hidden min-h-[3rem] sm:min-h-[3.5rem] px-4 py-3';
  const timeLordDayButtonClass = `${timeLordButtonBase} mafia-button--chronos-day`;
  const timeLordNightButtonClass = `${timeLordButtonBase} mafia-button--chronos-night`;
  const emberActionButtonClass = 'mafia-button mafia-button--ember font-bold tracking-[0.2em] uppercase';
  const decisionButtonClass = 'flex-1 mafia-button rounded-xl font-bold tracking-[0.2em] uppercase shadow-[0_12px_20px_rgba(0,0,0,0.45)] w-full min-h-[3.25rem] sm:min-h-[4rem] px-4 py-3';

  const activeCardInfo = state.activeCard ? (() => {
    for (const player of state.players) {
      const idx = player.cards.findIndex(r => r.cardId === state.activeCard!.cardId && r.instance === state.activeCard!.instance);
      if (idx >= 0) {
        const label = labelsMap[player.id]?.[idx] ?? `${getCardName(player.cards[idx].cardId, lang)} ${player.cards[idx].instance}`;
        return { label, playerName: player.name, playerId: player.id };
      }
    }
    return null;
  })() : null;
  const activePlayerIsJailed = activeCardInfo
    ? state.players.some(player => player.id === activeCardInfo.playerId && player.status.isJailed)
    : false;

  const currentPromptKey = state.uiState.pendingPrompts[0];
  const activeRoleLabel = activeCardInfo?.label || (state.activeCard ? t(`role_${state.activeCard.cardId}`, lang) : undefined);
  const roleParams = activeRoleLabel ? { role: activeRoleLabel } : undefined;
  const promptParams = currentPromptKey && state.activeCard ? roleParams : undefined;
  const matrixShotParams = state.activeCard?.mode === 'MATRIX_SHOT'
    ? (() => {
        const remaining = state.nightCache.matrixStoredBullets;
        const recorded = state.nightCache.reportData?.matrixBulletsCaught ?? 0;
        const total = Math.max(1, Math.max(remaining, recorded));
        const current = Math.min(total, Math.max(1, total - remaining + 1));
        return { current, total };
      })()
    : undefined;
  const defaultIdleMessage = state.phase === 'NIGHT_REPLAY'
    ? t('ui_bullet_replay', lang)
    : isDayMain
    ? t('day_idle_message', lang)
    : t('start_night_intro', lang);
  const wakeMessage = isFirstNightBriefing
    ? `${defaultIdleMessage}\n${t('first_night_message', lang)}`
    : state.activeCard
      ? isSpyglassStage
        ? t('wake_up_spyglass', lang)
        : state.activeCard.mode === 'MATRIX_SHOT'
        ? t('wake_matrix_shot', lang, matrixShotParams ?? { current: 1, total: 1 })
        : currentPromptKey
          ? t(currentPromptKey, lang, promptParams)
          : t('wake_up', lang, roleParams)
      : currentPromptKey
        ? t(currentPromptKey, lang)
        : defaultIdleMessage;

  const spyglassRevealText = useMemo(() => {
    if (!isSpyglassStage) return null;
    const ownerId = activeCardInfo?.playerId ?? null;
    const ids = (state.nightCache.spyglassRevealIds ?? []).filter(id => id !== ownerId);
    const names = ids
      .map(id => state.players.find(player => player.id === id)?.name)
      .filter((name): name is string => Boolean(name));
    if (!names.length) {
      return t('spyglass_reveal_none', lang);
    }
    return t('spyglass_reveal_intro', lang, { names: names.join(', ') });
  }, [isSpyglassStage, state.nightCache.spyglassRevealIds, activeCardInfo?.playerId, state.players, lang]);

  const reportLines = hasPendingDayReport
    ? pendingDayReport || []
    : state.phase === 'DAY_ANNOUNCEMENT' || state.phase === 'GAME_OVER'
    ? state.publicReport
    : [];

  const buildReportSegments = (entry: PublicReportEntry): LogDisplaySegment[] => {
    const fragments = entry.fragments?.length ? entry.fragments : [entry];
    return fragments.flatMap(fragment =>
      translateTemplateSegments(fragment.key, fragment.params, state.players, lang)
    );
  };

  const renderSegmentNodes = (segments: LogDisplaySegment[], keyPrefix: string) =>
    segments.map((segment, idx) =>
      segment.kind === 'cardLabel' ? (
        <CardLabelBadge
          key={`${keyPrefix}-card-${idx}`}
          cardId={segment.cardId}
          label={segment.label}
          size="xs"
          variant="logSegment"
          className="mx-0.5"
        />
      ) : (
        <React.Fragment key={`${keyPrefix}-text-${idx}`}>
          {segment.text}
        </React.Fragment>
      )
    );

  let actionControls: React.ReactNode = null;
  if (state.phase === 'GAME_OVER') {
    actionControls = null;
  } else if (state.uiState.waitingFor === 'USE_DECISION') {
    actionControls = (
      <div className="flex gap-2 h-full">
        <button onClick={() => dispatch({ type: 'GM_USE_DECISION', payload: true })} className={`${decisionButtonClass} mafia-button--jade`}>
          {t('ui_confirm', lang)}
        </button>
        {!isSpyglassStage && (
          <button onClick={() => dispatch({ type: 'GM_USE_DECISION', payload: false })} className={`${decisionButtonClass} mafia-button--crimson`}>
            {t('ui_deny', lang)}
          </button>
        )}
      </div>
    );
  } else if (isFirstNightBriefing) {
    actionControls = (
      <button onClick={() => dispatch({ type: 'NEXT_PHASE' })} className={`${emberActionButtonClass} w-full p-3 rounded-xl`}>
        {t('ui_first_night_done', lang)}
      </button>
    );
  } else if (isDayAnnouncement) {
    const startDayButton = (
      <button onClick={() => dispatch({ type: 'NEXT_PHASE' })} className={`${emberActionButtonClass} w-full p-3 rounded-xl`}>
        {t('start_day', lang)}
      </button>
    );
    if (canSkipDay) {
      actionControls = (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {startDayButton}
          <button
            onClick={() => dispatch({ type: 'TRIGGER_TIMELORD_SKIP', payload: { targetPhase: 'DAY' } })}
            className={timeLordDayButtonClass}
          >
            {t('ui_timelord_skip_day', lang, { cardLabel: timeLordCardLabel })}
          </button>
        </div>
      );
    } else {
      actionControls = startDayButton;
    }
  } else if (isDayMain) {
    if (hasPendingDayReport) {
      actionControls = (
        <button onClick={() => dispatch({ type: 'CONFIRM_DAY_REPORT' })} className={`${emberActionButtonClass} p-3 rounded-xl`}>
          {t('day_report_confirm', lang)}
        </button>
      );
    } else if (state.uiState.dayAction?.kind === 'MASS_MURDERER_RETALIATION') {
      const ownerId = state.uiState.dayAction.massMurderer?.ownerId;
      const owner = ownerId ? state.players.find(player => player.id === ownerId) : null;
      const selectedCount = state.uiState.dayAction.massMurderer?.selectedIds.length ?? 0;
      actionControls = (
        <div className="flex flex-col gap-3">
          <div className="bg-[rgba(4,4,8,0.85)] border border-[rgba(242,200,121,0.25)] p-3 rounded-2xl text-center text-sm shadow-inner">
            <div className="font-semibold">{t(state.uiState.dayAction.promptKey, lang)}</div>
            {owner && (
              <div className="text-xs text-slate-200 mt-1">{t('ui_mass_murderer_target', lang, { name: owner.name })}</div>
            )}
            <div className="text-xs text-slate-200 mt-1">{t('ui_mass_murderer_selected', lang, { count: selectedCount })}</div>
          </div>
          <button
            onClick={() => dispatch({ type: 'CONFIRM_MASS_MURDERER' })}
            className="w-full p-3 rounded-xl font-bold bg-[#c1121f] uppercase tracking-[0.2em] shadow-[0_15px_30px_rgba(0,0,0,0.55)]"
          >
            {t('ui_mass_murderer_confirm', lang)}
          </button>
        </div>
      );
    } else {
      const dayActionButtonClass =
        'w-full h-full p-3 rounded-xl font-semibold tracking-[0.2em] uppercase disabled:opacity-40 disabled:cursor-not-allowed flex flex-col items-center justify-center text-center break-words hyphens-auto gap-1 text-xs shadow-[0_12px_25px_rgba(0,0,0,0.35)] overflow-hidden';
      actionControls = (
        <div className="grid grid-cols-3 grid-rows-2 gap-2 auto-rows-fr">
          <button
            onClick={() => dispatch({ type: 'NEXT_PHASE' })}
            disabled={dayActionLocked}
            className={`${emberActionButtonClass} ${dayActionButtonClass}`}
          >
            {t('ui_start_night', lang)}
          </button>
          <button
            onClick={() => dispatch({ type: 'TRIGGER_BOMB' })}
            disabled={dayActionLocked || !canTriggerBomb}
            className={`${dayActionButtonClass} mafia-button mafia-button--bomb`}
          >
            <span>{t('ui_bomb', lang)}</span>
            <span className="text-[0.55rem] text-white/80 leading-tight normal-case tracking-normal">{specialRolesInfo.terrorist.text}</span>
          </button>
          <button
            onClick={() => dispatch({ type: 'TRIGGER_ANARCHIST' })}
            disabled={dayActionLocked || !canUseAnarchistShot}
            className={`${dayActionButtonClass} mafia-button mafia-button--anarchist`}
          >
            <span>{t('ui_anarchist_baby', lang)}</span>
            <span className="text-[0.55rem] text-slate-100 leading-tight normal-case tracking-normal">{specialRolesInfo.anarchist.text}</span>
          </button>
          <button
            onClick={() => dispatch({ type: 'TRIGGER_VOTE' })}
            disabled={dayActionLocked}
            className={`${dayActionButtonClass} mafia-button mafia-button--vote`}
          >
            {t('day_action_vote', lang)}
          </button>
          <button
            onClick={() => dispatch({ type: 'TRIGGER_ASTRONOMER' })}
            disabled={astronomerDisabled}
            className={`${dayActionButtonClass} mafia-button mafia-button--astronomer`}
          >
            <span>{t('ui_astronomer_night', lang)}</span>
            <span className="text-[0.55rem] text-slate-100 leading-tight normal-case tracking-normal">{specialRolesInfo.astronomer.text}</span>
          </button>
          <button
            onClick={() => dispatch({ type: 'TRIGGER_COMMUNIST' })}
            disabled={!canUseCommunist || dayActionLocked}
            className={`${dayActionButtonClass} mafia-button mafia-button--communist`}
          >
            <span>{t('ui_communist_equal', lang)}</span>
            <span className="text-[0.55rem] text-slate-100 leading-tight normal-case tracking-normal">{specialRolesInfo.communist.text}</span>
          </button>
        </div>
      );
    }
  } else if (state.phase !== 'NIGHT_ACTIVE') {
    const nextPhaseButton = (
      <button
        onClick={() => dispatch({ type: 'NEXT_PHASE' })}
        className="bg-[#1f1e27] border border-[rgba(242,200,121,0.2)] rounded-xl font-bold tracking-[0.2em] uppercase self-start flex items-center justify-center leading-tight w-full h-full min-h-[2.75rem] sm:min-h-[3rem] px-3 py-2 text-xs sm:text-sm"
      >
        {t('ui_next_phase', lang)} &rarr;
      </button>
    );
    if (canReplayBullets) {
      actionControls = (
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => dispatch({ type: 'REPLAY_BULLETS' })}
            className="mafia-button mafia-button--bullet-replay p-3 rounded-xl font-bold tracking-[0.2em] uppercase overflow-hidden"
          >
            {t('ui_replay_bullets', lang)}
          </button>
          {nextPhaseButton}
        </div>
      );
    } else if (canSkipNight) {
      actionControls = (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 items-start">
          {nextPhaseButton}
          <button
            onClick={() => dispatch({ type: 'TRIGGER_TIMELORD_SKIP', payload: { targetPhase: 'NIGHT' } })}
            className={`${timeLordNightButtonClass} h-full min-h-[2.75rem] sm:min-h-[3rem] px-3 py-2 self-start leading-tight text-xs sm:text-sm`}
          >
            {t('ui_timelord_skip_night', lang, { cardLabel: timeLordCardLabel })}
          </button>
        </div>
      );
    } else {
      actionControls = nextPhaseButton;
    }
  }
  
  const baseContainerClass = 'mafia-panel text-white p-4 shadow-2xl flex flex-col md:flex-row gap-4 border border-[rgba(242,200,121,0.12)] backdrop-blur';
  const containerClass = fullHeight
    ? `${baseContainerClass} flex-1 min-h-0 h-full overflow-y-auto md:justify-end md:items-end pb-[calc(4rem+var(--safe-area-bottom))] md:pb-4`
    : `${baseContainerClass} flex-shrink-0`;
  const reportColumnClass = `flex flex-col w-full md:flex-1 ${!showPublicReport && hideWakeMessageOnMobileDay ? 'hidden sm:flex' : ''}`;
  const reportPanelClass = `bg-[rgba(4,4,8,0.92)] p-4 rounded-2xl text-lg border-l-4 border-[var(--color-bullet)] shadow-inner flex flex-col ${fullHeight ? 'overflow-visible' : 'overflow-y-auto md:flex-1'}`;

  const actionPanelClass = fullHeight ? 'min-h-0' : 'flex-1 min-h-0 [&>*]:h-full';

  return (
    <div className={containerClass}>
      <div className={reportColumnClass}>
        <div className={reportPanelClass}>
           {showPublicReport ? (
             <div className="space-y-2 flex-1">
               {(!hasPendingDayReport && reportLines.length === 0) && <div className="font-bold">{t('public_report_default', lang)}</div>}
               {reportLines.map((entry, idx) => {
                 const segments = buildReportSegments(entry);
                 return (
                   <div key={`${entry.key}-${idx}`} className="text-base">
                     {renderSegmentNodes(segments, `control-report-${idx}`)}
                   </div>
                 );
               })}
             </div>
           ) : state.activeCard ? (
             <div className="flex flex-col flex-1">
               <div
                 className={`font-bold flex-1 ${isSpyglassStage ? '' : 'min-h-[3.5rem]'} ${activePlayerIsJailed ? 'text-red-400' : ''}`}
               >
                 {wakeMessage}
               </div>
               {activeCardInfo?.playerName && (
                 activePlayerIsJailed ? (
                   <div className="text-sm text-red-300 mt-1">
                     {t('ui_player_jailed_notice', lang, { name: activeCardInfo.playerName })}
                   </div>
                 ) : (
                   <div className="text-sm text-slate-200 mt-1">
                     {t('ui_player_label', lang, { name: activeCardInfo.playerName })}
                   </div>
                 )
               )}
               {isSpyglassStage && spyglassRevealText && (
                 <div className="text-sm text-slate-200 mt-1">{spyglassRevealText}</div>
               )}
             </div>
           ) : (
             <div className="flex flex-col flex-1">
               <div className="min-h-[3.5rem] flex-1">{wakeMessage}</div>
             </div>
           )}
        </div>
      </div>
      <div className="flex flex-col gap-1 w-full md:w-[30rem] min-h-[5.75rem] sm:min-h-[7.0rem] flex-shrink-0">
        <div className={actionPanelClass}>
          {actionControls}
        </div>
        <div className="flex gap-1 mt-auto pt-1">
          <button onClick={() => dispatch({ type: 'UNDO' })} className="flex-1 bg-[#2f2c3b] text-xs py-2 rounded-xl tracking-[0.3em] uppercase text-slate-100">{t('ui_undo', lang)}</button>
        </div>
      </div>
    </div>
  );
};