import type { GameState, UndoWrapper, DoctorHealMode, DayActionContext, PublicReportEntry } from './types';
import { resolveDayDamage, resolveNightShot, processNightShotQueue, processSockToxicity } from './resolutionEngine';
import type { DayDamageResult } from './resolutionEngine';
import { grantCardInstance, consumeCard, consumeCardInstance } from './cardUtils';
import { dealCards } from './cardDealer';
import { buildNightCardInstanceOrder } from './nightSchedule';
import { t } from './translations';
import type { Player, Language, CardId, ActiveCardInstance, GameLog, LogParamMap } from './types';
import { buildPublicReportEntries, createPublicReportData } from './publicReport';
import { createDoctorRules, canDoctorSelfHealThisNight } from './doctorRules';
import { createCardLabelParam, resolveLogParams } from './logging';

export const PLAYER_NODE_SCALE_MIN = 0.75;
export const PLAYER_NODE_SCALE_MAX = 3;
export const DEFAULT_PLAYER_NODE_SCALE = 1.5;
const MIN_PLAYER_NODE_SCALE = PLAYER_NODE_SCALE_MIN;
const MAX_PLAYER_NODE_SCALE = PLAYER_NODE_SCALE_MAX;
const DEFAULT_SETTINGS: GameState['settings'] = {
  language: 'pl',
  bulletSpeed: 500,
  playerNodeScale: DEFAULT_PLAYER_NODE_SCALE
};

function clampPlayerNodeScale(value: number): number {
  if (Number.isNaN(value)) {
    return DEFAULT_PLAYER_NODE_SCALE;
  }
  return Math.min(MAX_PLAYER_NODE_SCALE, Math.max(MIN_PLAYER_NODE_SCALE, value));
}

function normalizeSettings(settings?: Partial<GameState['settings']>): GameState['settings'] {
  const rawScale = typeof settings?.playerNodeScale === 'number'
    ? settings.playerNodeScale
    : DEFAULT_PLAYER_NODE_SCALE;

  return {
    language: settings?.language ?? DEFAULT_SETTINGS.language,
    bulletSpeed: settings?.bulletSpeed ?? DEFAULT_SETTINGS.bulletSpeed,
    playerNodeScale: clampPlayerNodeScale(rawScale)
  };
}

function normalizeTunnelNumbers(tunnels?: GameState['globalTunnels']): GameState['globalTunnels'] {
  if (!tunnels) {
    return [];
  }
  let mutated = false;
  const normalized = tunnels.map((tunnel, idx) => {
    if (typeof tunnel.tunnelNumber === 'number') {
      return tunnel;
    }
    mutated = true;
    return { ...tunnel, tunnelNumber: idx + 1 };
  });
  return mutated ? normalized : tunnels;
}

function ensureInactiveCards(players: Player[]): { normalized: Player[]; changed: boolean } {
  if (!players?.length) {
    return { normalized: players, changed: false };
  }
  let changed = false;
  const normalized = players.map(player => {
    let updated = player;
    let mutated = false;

    if (!Array.isArray(player.inactiveCards)) {
      updated = {
        ...updated,
        inactiveCards: player.inactiveCards ? [...player.inactiveCards] : []
      };
      mutated = true;
    }

    if (typeof updated.status.timeLordSkipUsed === 'undefined') {
      updated = {
        ...updated,
        status: {
          ...updated.status,
          timeLordSkipUsed: false
        }
      };
      mutated = true;
    }

    if (typeof updated.status.jailerAbilityUsed === 'undefined') {
      updated = {
        ...updated,
        status: {
          ...updated.status,
          jailerAbilityUsed: false
        }
      };
      mutated = true;
    }

    if (mutated) {
      changed = true;
      return updated;
    }
    return player;
  });
  return { normalized: changed ? normalized : players, changed };
}

// Action Definition
export type Action = 
  | { type: 'START_GAME'; payload: { names: string[]; customDeck: CardId[]; language: Language } }
  | { type: 'LOAD_GAME'; payload: UndoWrapper }
  | { type: 'UNDO' }
  | { type: 'NEXT_PHASE' }
  | { type: 'CONFIRM_DAY_REPORT' }
  | { type: 'GM_CLICK_PLAYER'; payload: string }
  | { type: 'GM_USE_DECISION'; payload: boolean }
  | { type: 'TRIGGER_VOTE' }
  | { type: 'CONFIRM_MASS_MURDERER' }
  | { type: 'TRIGGER_ANARCHIST' }
  | { type: 'TRIGGER_BOMB' }
  | { type: 'TRIGGER_ASTRONOMER' }
  | { type: 'TRIGGER_COMMUNIST' }
  | { type: 'TRIGGER_TIMELORD_SKIP'; payload: { targetPhase: 'DAY' | 'NIGHT' } }
  | { type: 'ADD_TUNNEL'; payload: { source: string; target: string } }
  | { type: 'UPDATE_SETTINGS'; payload: Partial<GameState['settings']> }
  | { type: 'REPLAY_BULLETS' };

const OPTIONAL_USAGE_CARDS = new Set<CardId>([
  'Jailer',
  'Gravedigger',
  'Matrix',
  'SwampMonster',
  'Sniper',
  'Sock',
  'BlindExecutioner'
]);

const OPTIONAL_SELECTION_CARDS = new Set<CardId>([
  'Jailer',
  'SwampMonster',
  'Sniper',
  'Sock',
  'BlindExecutioner'
]);

function hydrateState(state: GameState): GameState {
  const { normalized: normalizedPlayers, changed: playersChanged } = ensureInactiveCards(state.players || []);
  const normalizedSettings = normalizeSettings(state.settings);
  const settingsChanged = (
    !state.settings ||
    state.settings.language !== normalizedSettings.language ||
    state.settings.bulletSpeed !== normalizedSettings.bulletSpeed ||
    state.settings.playerNodeScale !== normalizedSettings.playerNodeScale
  );

  const normalizedTunnels = normalizeTunnelNumbers(state.globalTunnels);
  const tunnelsChanged = normalizedTunnels !== state.globalTunnels;

  const legacyPublicReport = Array.isArray(state.publicReport) ? state.publicReport : [];
  const normalizedPublicReports = state.publicReportsByRound ?? (legacyPublicReport.length
    ? { [state.currentRound]: legacyPublicReport }
    : {});
  const publicReportsChanged = normalizedPublicReports !== state.publicReportsByRound;

  const existingNightCache = state.nightCache ?? createNightCache();
  if (!existingNightCache.pendingShots) {
    existingNightCache.pendingShots = { mafiaVotes: [], madGunman: [], sniper: [] };
  } else {
    existingNightCache.pendingShots.mafiaVotes = existingNightCache.pendingShots.mafiaVotes ?? [];
    existingNightCache.pendingShots.madGunman = existingNightCache.pendingShots.madGunman ?? [];
    existingNightCache.pendingShots.sniper = existingNightCache.pendingShots.sniper ?? [];
  }
  const needsNightCacheHydration =
    !existingNightCache.leechLinks ||
    !existingNightCache.cobraTargets ||
    !existingNightCache.glazierPendingRewards ||
    !Array.isArray(existingNightCache.wokenPlayerIds) ||
    typeof existingNightCache.spyglassRevealIds === 'undefined' ||
    !Array.isArray(existingNightCache.bulletAnimations) ||
    !Array.isArray(existingNightCache.jailerUsedIds) ||
    !Array.isArray(existingNightCache.blockedCardInstanceKeys) ||
    !Array.isArray(existingNightCache.nightCardOrder) ||
    typeof existingNightCache.nightCardCursor !== 'number';
  const hydratedNightCache = needsNightCacheHydration
    ? {
        ...existingNightCache,
        leechLinks: existingNightCache.leechLinks ?? [],
        cobraTargets: existingNightCache.cobraTargets ?? [],
        glazierPendingRewards: existingNightCache.glazierPendingRewards ?? [],
        wokenPlayerIds: existingNightCache.wokenPlayerIds ?? [],
        spyglassRevealIds: existingNightCache.spyglassRevealIds ?? null,
        bulletAnimations: existingNightCache.bulletAnimations ?? [],
        jailerUsedIds: existingNightCache.jailerUsedIds ?? [],
        blockedCardInstanceKeys: existingNightCache.blockedCardInstanceKeys ?? [],
        nightCardOrder: existingNightCache.nightCardOrder ?? [],
        nightCardCursor: typeof existingNightCache.nightCardCursor === 'number' ? existingNightCache.nightCardCursor : 0
      }
    : existingNightCache;
  const nightCacheChanged = hydratedNightCache !== state.nightCache;

  const defaultUiState = {
    waitingFor: 'NONE' as const,
    pendingPrompts: [] as string[],
    selectionContext: null as GameState['uiState']['selectionContext'],
    dayAction: null as GameState['uiState']['dayAction'],
    pendingDayReport: null as GameState['uiState']['pendingDayReport'],
    communistSuppressionActive: false,
    bulletReplayNonce: 0,
    pendingVictoryKey: null as string | null
  };
  const needsUiStateHydration =
    !state.uiState ||
    typeof state.uiState.pendingDayReport === 'undefined' ||
    typeof state.uiState.communistSuppressionActive === 'undefined' ||
    typeof state.uiState.bulletReplayNonce === 'undefined' ||
    typeof state.uiState.pendingVictoryKey === 'undefined';
  const rawUiState = state.uiState || {};
  const hydratedUiState = needsUiStateHydration
    ? {
        ...defaultUiState,
        ...rawUiState,
        pendingDayReport: rawUiState.pendingDayReport ?? null,
        communistSuppressionActive: rawUiState.communistSuppressionActive ?? false,
        bulletReplayNonce: rawUiState.bulletReplayNonce ?? 0,
        pendingVictoryKey: rawUiState.pendingVictoryKey ?? null
      }
    : state.uiState;
  const uiStateChanged = hydratedUiState !== state.uiState;

  const normalizedVictory = typeof state.victory === 'undefined' ? null : state.victory;
  const victoryChanged = state.victory !== normalizedVictory;

  if (!settingsChanged && !tunnelsChanged && !nightCacheChanged && !publicReportsChanged && !playersChanged && !uiStateChanged && !victoryChanged) {
    return state;
  }

  return {
    ...state,
    players: playersChanged ? normalizedPlayers : state.players,
    settings: settingsChanged ? normalizedSettings : state.settings,
    globalTunnels: tunnelsChanged ? normalizedTunnels : state.globalTunnels,
    nightCache: nightCacheChanged ? hydratedNightCache : state.nightCache,
    publicReportsByRound: publicReportsChanged ? normalizedPublicReports : state.publicReportsByRound,
    uiState: uiStateChanged ? hydratedUiState : state.uiState,
    victory: victoryChanged ? normalizedVictory : state.victory
  };
}

function hydrateWrapper(wrapper: UndoWrapper): UndoWrapper {
  return {
    past: wrapper.past.map(hydrateState),
    present: hydrateState(wrapper.present),
    future: wrapper.future.map(hydrateState)
  };
}

function createNightCache(): GameState['nightCache'] {
  return {
    kuskonaTriggered: false,
    gandalfTriggered: false,
    leechLinks: [],
    cobraTargets: [],
    gravediggerActive: [],
    gravediggerBonus: {},
    slimeUsedOnPlayers: [],
    matrixStoredBullets: 0,
    matrixTrap: null,
    glazierPendingRewards: [],
    pendingShots: { mafiaVotes: [], madGunman: [], sniper: [] },
    pendingToxicSocks: [],
    doctorProtections: [],
    executionerPairs: [],
    reportData: createPublicReportData(),
    bulletReportLookup: {},
    spyglassRevealIds: null,
    wokenPlayerIds: [],
    bulletAnimations: [],
    jailerUsedIds: [],
    blockedCardInstanceKeys: [],
    nightCardOrder: [],
    nightCardCursor: 0
  };
}

type DoctorContext = {
  healer: Player | null;
  canSelf: boolean;
  hasTargets: boolean;
  isDeactivated: boolean;
};

function getDoctorContext(state: GameState, card: ActiveCardInstance): DoctorContext {
  const healer = findPlayerWithCardInstance(state.players, card);
  if (!healer || !healer.status.isAlive) {
    return { healer: null, canSelf: false, hasTargets: false, isDeactivated: true };
  }
  const canSelf = canDoctorSelfHealThisNight(state);
  const isDeactivated = isDoctorDeactivated(state, healer, canSelf);
  const healableTargetsExist = state.players.some(p => {
    if (!p.status.isAlive) return false;
    if (p.id === healer.id && !canSelf) return false;
    return true;
  });
  const hasTargets = healableTargetsExist || isDeactivated;
  return { healer, canSelf, hasTargets, isDeactivated };
}

function isPlayerMafian(player: Player): boolean {
  return player.cards.some(card => card.cardId === 'Mafia');
}

function isDoctorDeactivated(state: GameState, healer: Player | null, canSelf: boolean): boolean {
  if (!healer || !healer.status.isAlive) return true;
  if (canSelf) return false;
  const alivePlayers = state.players.filter(p => p.status.isAlive);
  const mafiaAliveCount = alivePlayers.filter(isPlayerMafian).length;
  if (mafiaAliveCount === 0) return false;
  const nonMafiaAlive = alivePlayers.length - mafiaAliveCount;
  if (nonMafiaAlive !== 1) return false;
  return !isPlayerMafian(healer);
}

function recordDoctorProtection(
  state: GameState,
  healerId: string,
  targetId: string,
  card: ActiveCardInstance,
  mode: DoctorHealMode
) {
  if (!state.nightCache.doctorProtections) {
    state.nightCache.doctorProtections = [];
  }
  state.nightCache.doctorProtections.push({
    healerId,
    targetId,
    instance: card.instance,
    mode
  });
}

function shuffleIds(ids: string[]): string[] {
  const copy = [...ids];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function recordPlayerWake(state: GameState, card: ActiveCardInstance | null) {
  if (!card) return;
  if (!state.nightCache.wokenPlayerIds) {
    state.nightCache.wokenPlayerIds = [];
  }
  const owner = findPlayerWithCardInstance(state.players, card);
  if (!owner) return;
  if (!state.nightCache.wokenPlayerIds.includes(owner.id)) {
    state.nightCache.wokenPlayerIds.push(owner.id);
  }
  if (card.cardId === 'Spyglass' && !state.nightCache.spyglassRevealIds) {
    const uniqueIds = Array.from(new Set(state.nightCache.wokenPlayerIds));
    state.nightCache.spyglassRevealIds = shuffleIds(uniqueIds);
  }
}

function hasJailerActedThisNight(state: GameState, ownerId: string | null | undefined): boolean {
  if (!ownerId) return false;
  return state.nightCache.jailerUsedIds?.includes(ownerId) ?? false;
}

function markJailerUsedThisNight(state: GameState, ownerId: string | null | undefined) {
  if (!ownerId) return;
  if (!state.nightCache.jailerUsedIds) {
    state.nightCache.jailerUsedIds = [];
  }
  if (!state.nightCache.jailerUsedIds.includes(ownerId)) {
    state.nightCache.jailerUsedIds.push(ownerId);
  }
}

function getCardInstanceBlockKey(card: ActiveCardInstance | null, ownerId: string | null | undefined): string | null {
  if (!card) return null;
  const ownerPart = ownerId ?? 'unknown';
  const instancePart = typeof card.instance === 'number' ? card.instance : '0';
  const modePart = card.mode ?? 'DEFAULT';
  return `${ownerPart}:${card.cardId}:${instancePart}:${modePart}`;
}

function markCardInstanceBlockedThisNight(state: GameState, card: ActiveCardInstance | null, ownerId: string | null | undefined) {
  const key = getCardInstanceBlockKey(card, ownerId);
  if (!key) return;
  if (!state.nightCache.blockedCardInstanceKeys) {
    state.nightCache.blockedCardInstanceKeys = [];
  }
  if (!state.nightCache.blockedCardInstanceKeys.includes(key)) {
    state.nightCache.blockedCardInstanceKeys.push(key);
  }
}

function isCardInstanceBlockedThisNight(state: GameState, card: ActiveCardInstance | null, ownerId: string | null | undefined): boolean {
  const key = getCardInstanceBlockKey(card, ownerId);
  if (!key) return false;
  return state.nightCache.blockedCardInstanceKeys?.includes(key) ?? false;
}

function shouldSkipNightCard(state: GameState, card: ActiveCardInstance | null): boolean {
  if (!card) return false;
  const owner = findPlayerWithCardInstance(state.players, card);
  if (isCardInstanceBlockedThisNight(state, card, owner?.id)) {
    return true;
  }
  if (card.cardId === 'Jailer') {
    if (!owner || !owner.status.isAlive) {
      return true;
    }
    if (owner.status.jailerAbilityUsed) {
      return true;
    }
    return hasJailerActedThisNight(state, owner.id);
  }
  return false;
}

type NightCardSelection = {
  card: ActiveCardInstance | null;
  order: ActiveCardInstance[];
  nextCursor: number;
};

function resolveNightOrder(state: GameState, forceRebuild = false): { order: ActiveCardInstance[]; cursor: number } {
  const existing = state.nightCache.nightCardOrder;
  const hasExisting = !forceRebuild && Array.isArray(existing) && existing.length > 0;
  if (hasExisting) {
    const cursor = typeof state.nightCache.nightCardCursor === 'number' ? state.nightCache.nightCardCursor : 0;
    return { order: existing, cursor };
  }
  const order = buildNightCardInstanceOrder(state);
  let cursor = 0;
  if (!forceRebuild && state.activeCard) {
    const idx = order.findIndex(
      it => it.cardId === state.activeCard?.cardId && it.instance === state.activeCard?.instance && it.mode === state.activeCard?.mode
    );
    cursor = idx >= 0 ? idx + 1 : 0;
  }
  return { order, cursor };
}

function pullNextNightCard(state: GameState, options?: { forceRebuild?: boolean }): NightCardSelection {
  const { order, cursor: startingCursor } = resolveNightOrder(state, options?.forceRebuild ?? false);
  let cursor = startingCursor;
  let card: ActiveCardInstance | null = null;
  while (cursor < order.length) {
    const candidate = order[cursor];
    cursor += 1;
    if (!shouldSkipNightCard(state, candidate)) {
      card = candidate;
      break;
    }
  }
  return { card, order, nextCursor: cursor };
}

function applyLeechRewards(state: GameState) {
  const links = state.nightCache.leechLinks || [];
  if (!links.length) {
    state.nightCache.leechLinks = [];
    return;
  }
  links.forEach(link => {
    if (!link.triggered) return;
    const leechPlayer = state.players.find(p => p.id === link.leechId && p.status.isAlive);
    if (!leechPlayer) return;
    const instance = grantCardInstance(state.players, leechPlayer, 'CloudWalker');
    state.nightCache.reportData.cloudwalkers.leech.push(instance);
    pushNightLogEntry(state, 'Leech', link.instance, leechPlayer.name, 'log_night_leech_cloudwalker', { num: instance });
  });
  state.nightCache.leechLinks = [];
}

function resolveCobraTargets(state: GameState) {
  const hunts = state.nightCache.cobraTargets || [];
  if (!hunts.length) {
    state.nightCache.cobraTargets = [];
    return;
  }
  hunts.forEach(entry => {
    const cobraPlayer = state.players.find(p => p.id === entry.cobraId && p.status.isAlive);
    if (!cobraPlayer) return;
    const targetPlayer = state.players.find(p => p.id === entry.targetId && p.status.isAlive);
    if (!targetPlayer) return;
    const ateLeech = consumeCard(targetPlayer, 'Leech');
    if (!ateLeech) return;
    const instance = grantCardInstance(state.players, cobraPlayer, 'CloudWalker');
    state.nightCache.reportData.cloudwalkers.cobra.push(instance);
    pushNightLogEntry(state, 'Cobra', entry.instance, cobraPlayer.name, 'log_night_cobra_cloudwalker', { num: instance });
  });
  state.nightCache.cobraTargets = [];
}

function applyGravediggerRewards(state: GameState) {
  const active = state.nightCache.gravediggerActive;
  if (!active?.length) return;
  active.forEach(({ playerId, instance: gravediggerInstance }) => {
    const bonus = state.nightCache.gravediggerBonus[playerId] || 0;
    if (bonus <= 0) return;
    const player = state.players.find(p => p.id === playerId);
    if (!player || !player.status.isAlive) return;
    for (let i = 0; i < bonus; i++) {
      const instance = grantCardInstance(state.players, player, 'CloudWalker');
      state.nightCache.reportData.cloudwalkers.gravedigger.push({
        num: instance,
        cardInstance: gravediggerInstance
      });
      pushNightLogEntry(state, 'Gravedigger', gravediggerInstance, player.name, 'log_night_cloudwalker_gain', { num: instance });
    }
  });
  state.nightCache.gravediggerActive = [];
  state.nightCache.gravediggerBonus = {};
}

function applyGlazierRewards(state: GameState) {
  const pending = state.nightCache.glazierPendingRewards;
  if (!pending?.length) return;
  pending.forEach(playerId => {
    const glazier = state.players.find(p => p.id === playerId && p.status.isAlive);
    if (!glazier) return;
    const mirrorInstance = grantCardInstance(state.players, glazier, 'Mirror');
    state.nightCache.reportData.cloudwalkers.glazier.push(mirrorInstance);
    const glazierCardInstance = glazier.cards.find(card => card.cardId === 'Glazier')?.instance;
    pushNightLogEntry(state, 'Glazier', glazierCardInstance, glazier.name, 'log_night_glazier_mirror', { num: mirrorInstance });
  });
  state.nightCache.glazierPendingRewards = [];
}

function releaseJailedPlayers(state: GameState) {
  state.players.forEach(player => {
    if (player.status.isJailed) {
      player.status.isJailed = false;
    }
  });
}

function moveToDayAnnouncement(state: GameState): GameState {
  applyLeechRewards(state);
  resolveCobraTargets(state);
  applyGravediggerRewards(state);
  applyGlazierRewards(state);
  releaseJailedPlayers(state);
  pushPhaseDividerLog(state, 'NIGHT_END', state.currentRound);
  const report = buildPublicReportEntries(state);
  const history = state.publicReportsByRound || {};
  const updatedHistory = { ...history, [state.currentRound]: report };
  const clearedNightCache = {
    ...state.nightCache,
    bulletAnimations: [],
    jailerUsedIds: [],
    blockedCardInstanceKeys: [],
    nightCardOrder: [],
    nightCardCursor: 0
  };
  const dayState = applyActiveCardState({
    ...state,
    phase: 'DAY_ANNOUNCEMENT',
    publicReport: report,
    publicReportsByRound: updatedHistory,
    nightCache: clearedNightCache
  }, null);
  pushPhaseDividerLog(dayState, 'DAY_START', dayState.currentRound);
  return dayState;
}

function moveToBulletReplayOrDay(state: GameState): GameState {
  const animations = state.nightCache.bulletAnimations || [];
  if (animations.length > 0) {
    return {
      ...state,
      phase: 'NIGHT_REPLAY',
      activeCard: null,
      uiState: {
        ...state.uiState,
        waitingFor: 'NONE',
        pendingPrompts: [],
        selectionContext: null,
        dayAction: null,
        bulletReplayNonce: 0
      }
    };
  }
  return moveToDayAnnouncement(state);
}

function advanceDayToNight(state: GameState): GameState {
  pushPhaseDividerLog(state, 'DAY_END', state.currentRound);
  const resetPlayers = state.players.map<Player>(p => ({
    ...p,
    status: {
      ...p.status,
      isJailed: false,
      isSlimed: false,
      isSanded: false,
      isMagnetized: false,
      isSilenced: false,
      isCantVote: false,
      executionerStatus: 'NONE' as const
    }
  }));
  const nightState: GameState = {
    ...state,
    players: resetPlayers,
    phase: 'NIGHT_ANNOUNCEMENT',
    currentRound: state.currentRound + 1,
    globalTunnels: [],
    publicReport: [],
    nightCache: createNightCache(),
    activeCard: null,
    uiState: {
      waitingFor: 'NONE',
      pendingPrompts: [],
      selectionContext: null,
      dayAction: null,
      pendingDayReport: null,
      communistSuppressionActive: false,
      bulletReplayNonce: 0,
      pendingVictoryKey: null
    }
  };
  pushPhaseDividerLog(nightState, 'NIGHT_START', nightState.currentRound);
  return nightState;
}

function addUniqueTarget(list: string[], playerId: string) {
  if (!list.includes(playerId)) {
    list.push(playerId);
  }
}

function pushGeneralLog(
  state: GameState,
  key: string,
  params?: LogParamMap,
  type: GameLog['type'] = 'ACTION'
) {
  const resolvedParams = resolveLogParams(params ?? {}, state.players, state.settings.language);
  const fallback = t(key, state.settings.language, resolvedParams);
  state.logs.push({
    id: Math.random().toString(),
    timestamp: Date.now(),
    phase: state.phase,
    round: state.currentRound,
    text: fallback,
    translationKey: key,
    translationParams: params,
    type
  });
}

type PhaseDividerKind = 'NIGHT_START' | 'NIGHT_END' | 'DAY_START' | 'DAY_END';

const PHASE_DIVIDER_KEYS: Record<PhaseDividerKind, string> = {
  NIGHT_START: 'log_divider_night_start',
  NIGHT_END: 'log_divider_night_end',
  DAY_START: 'log_divider_day_start',
  DAY_END: 'log_divider_day_end'
};

function pushPhaseDividerLog(state: GameState, kind: PhaseDividerKind, round: number | null | undefined) {
  const params: LogParamMap | undefined = typeof round === 'number' ? { round } : undefined;
  const logs = state.logs || (state.logs = []);
  const existing = [...logs]
    .reverse()
    .find(entry => entry.translationKey === PHASE_DIVIDER_KEYS[kind]);
  if (existing) {
    const existingRound = typeof existing.translationParams?.round === 'number'
      ? existing.translationParams.round
      : existing.round;
    const targetRound = typeof round === 'number' ? round : state.currentRound;
    if (existingRound === targetRound) {
      return;
    }
  }
  pushGeneralLog(state, PHASE_DIVIDER_KEYS[kind], params, 'SYSTEM');
}

function getAliveRoleOwners(state: GameState, cardId: CardId): Player[] {
  return state.players.filter(player => 
    player.status.isAlive && player.cards.some(card => card.cardId === cardId)
  );
}

function findReadyAnarchist(state: GameState): Player | null {
  return getAliveRoleOwners(state, 'Anarchist').find(player => !player.status.anarchistShotUsed) || null;
}

function findReadyTerrorist(state: GameState): Player | null {
  return getAliveRoleOwners(state, 'Terrorist').find(player => !player.status.terroristBombUsed) || null;
}

function findReadyAstronomer(state: GameState): Player | null {
  return getAliveRoleOwners(state, 'Astronomer').find(player => !player.status.astronomerNightUsed) || null;
}

function findReadyCommunist(state: GameState): Player | null {
  return getAliveRoleOwners(state, 'Communist').find(player => !player.status.communistEqualityUsed) || null;
}

function findReadyTimeLord(state: GameState): Player | null {
  return getAliveRoleOwners(state, 'TimeLord').find(player => !player.status.timeLordSkipUsed) || null;
}

function setDayActionPrompt(state: GameState, context: DayActionContext | null) {
  state.uiState = {
    ...state.uiState,
    waitingFor: 'NONE',
    pendingPrompts: context ? [context.promptKey] : [],
    selectionContext: null,
    dayAction: context
  };
}

function dayResultToEntry(result: DayDamageResult | null): PublicReportEntry | null {
  if (!result) return null;
  switch (result.type) {
    case 'ROPEWALKER':
      return { key: 'public_report_day_ropewalker_lost', params: { num: result.instance } };
    case 'IMMUNITY':
      return { key: 'public_report_day_immunity_lost', params: { num: result.instance } };
    case 'KEVLAR':
      return { key: 'public_report_day_kevlar_lost', params: { num: result.instance } };
    case 'CLOUDWALKER':
      return { key: 'public_report_day_cloudwalker_lost', params: { num: result.instance } };
    case 'DEATH':
      return { key: 'public_report_day_player_left', params: { name: result.playerName } };
    default:
      return null;
  }
}

function setPendingDayReport(state: GameState, results: Array<DayDamageResult | null>) {
  const entries = results
    .map(dayResultToEntry)
    .filter((entry): entry is PublicReportEntry => Boolean(entry));
  if (state.uiState.pendingVictoryKey) {
    entries.push({ key: state.uiState.pendingVictoryKey });
    state.uiState = { ...state.uiState, pendingVictoryKey: null };
  }
  if (!entries.length) {
    return;
  }
  state.uiState = { ...state.uiState, pendingDayReport: entries };
}

function cloneState(state: GameState): GameState {
  return JSON.parse(JSON.stringify(state));
}

function finalizeVictoryState(state: GameState): GameState {
  if (!state.victory) {
    return state;
  }
  if (state.phase === 'GAME_OVER') {
    return state;
  }
  const victoryKey = state.victory.side === 'MAFIA' ? 'victory_mafia' : 'victory_innocent';
  if (!state.victory.announced) {
    pushGeneralLog(state, victoryKey, {}, 'SYSTEM');
    state.victory = { ...state.victory, announced: true };
  }
  if (state.victory.cause === 'NIGHT') {
    const withReport = moveToDayAnnouncement(state);
    return {
      ...withReport,
      phase: 'GAME_OVER',
      activeCard: null,
      uiState: {
        ...withReport.uiState,
        waitingFor: 'NONE',
        pendingPrompts: [],
        selectionContext: null,
        dayAction: null
      }
    };
  }
  return {
    ...state,
    phase: 'GAME_OVER',
    activeCard: null,
    uiState: {
      ...state.uiState,
      waitingFor: 'NONE',
      pendingPrompts: [],
      selectionContext: null,
      dayAction: null
    }
  };
}

function isPassiveAutoCard(card: ActiveCardInstance | null): boolean {
  if (!card) return false;
  if (card.cardId === 'Matrix') {
    return false;
  }
  return card.cardId === 'Gravedigger';
}

const CARD_PROMPTS: Partial<Record<CardId, string[]>> = {
  Jailer: ['wake_up_jailer'],
  Mage: ['wake_up_mage_from', 'wake_up_mage_to'],
  Slime: ['wake_up_slime'],
  Leech: ['wake_up_leech'],
  Sand: ['wake_up_sand'],
  Cobra: ['wake_up_cobra'],
  Magnet: ['wake_up_magnet'],
  GhostBobo: ['wake_up_ghost'],
  Doctor: ['wake_up_doctor_heal_self', 'wake_up_doctor_heal_other'],
  Mafia: ['wake_up_shooter'],
  MadGunman: ['wake_up_shooter'],
  Sniper: ['wake_up_shooter'],
  BlindExecutioner: ['wake_up_executioner_save', 'wake_up_executioner_victim'],
  Judge: ['wake_up_judge'],
  Sock: ['wake_up_sock_first', 'wake_up_sock_second'],
  SwampMonster: ['wake_up_swamp_monster']
};

function needsUsageDecision(state: GameState, card: ActiveCardInstance | null): boolean {
  if (!card) return false;
  if (card.cardId === 'Spyglass') {
    return true;
  }
  if (card.mode === 'MATRIX_SHOT') return false;
  if (card.cardId === 'Matrix') {
    const owner = findPlayerWithCardInstance(state.players, card);
    if (!owner || owner.status.matrixAbilityUsed) {
      return false;
    }
  }
  if (card.cardId === 'BlindExecutioner') {
    return canBlindExecutionerAct(state, card);
  }
  if (card.cardId === 'SwampMonster') {
    const owner = findPlayerWithCardInstance(state.players, card);
    if (!owner || !owner.status.isAlive || owner.status.swampChargesLeft <= 0) {
      return false;
    }
  }
  if (card.cardId === 'Jailer') {
    const owner = findPlayerWithCardInstance(state.players, card);
    if (!owner || !owner.status.isAlive) {
      return false;
    }
    if (owner.status.jailerAbilityUsed) {
      return false;
    }
    if (hasJailerActedThisNight(state, owner.id)) {
      return false;
    }
  }
  return OPTIONAL_USAGE_CARDS.has(card.cardId);
}

function getCardPrompts(state: GameState, card: ActiveCardInstance | null): string[] {
  if (!card) return [];
  if (card.cardId === 'Doctor') {
    const ctx = getDoctorContext(state, card);
    if (!ctx.hasTargets) return [];
    return [ctx.canSelf ? 'wake_up_doctor_heal_self' : 'wake_up_doctor_heal_other'];
  }
  if (card.cardId === 'BlindExecutioner' && !canBlindExecutionerAct(state, card)) {
    return [];
  }
  if (card.cardId === 'SwampMonster') {
    const owner = findPlayerWithCardInstance(state.players, card);
    if (!owner || !owner.status.isAlive || owner.status.swampChargesLeft <= 0) {
      return [];
    }
  }
  return CARD_PROMPTS[card.cardId] ? [...CARD_PROMPTS[card.cardId]!] : [];
}

function addTunnelEntry(state: GameState, sourceId: string, targetId: string): GameState['globalTunnels'][number] {
  const now = Date.now();
  const tunnelNumber = state.globalTunnels.length + 1;
  const tunnel = {
    id: `tunnel-${now}-${Math.random().toString(36).slice(2, 8)}`,
    sourceId,
    targetId,
    createdAt: now,
    tunnelNumber
  };
  state.globalTunnels.push(tunnel);
  return tunnel;
}

function findPlayerWithCardInstance(players: Player[], card: ActiveCardInstance | null): Player | null {
  if (!card) return null;
  return players.find(p => p.cards.some(r => r.cardId === card.cardId && r.instance === card.instance)) || null;
}

function canBlindExecutionerAct(state: GameState, card: ActiveCardInstance | null): boolean {
  if (!card || card.cardId !== 'BlindExecutioner') return false;
  const owner = findPlayerWithCardInstance(state.players, card);
  if (!owner || !owner.status.isAlive) return false;
  if (owner.status.executionerUses >= 2) return false;
  const alivePlayers = state.players.filter(p => p.status.isAlive);
  return alivePlayers.length >= 2;
}

function pushNightLogEntry(
  state: GameState,
  cardId: CardId,
  instance: number | undefined,
  playerName: string,
  key: string,
  params: LogParamMap = {}
) {
  const translationParams: LogParamMap = {
    player: playerName,
    ...params,
    cardLabel: createCardLabelParam(cardId, instance)
  };
  const language = state.settings.language;
  const fallback = t(key, language, resolveLogParams(translationParams, state.players, language));
  state.logs.push({
    id: Math.random().toString(),
    timestamp: Date.now(),
    phase: state.phase,
    round: state.currentRound,
    text: fallback,
    translationKey: key,
    translationParams,
    type: 'ACTION'
  });
}

function getAliveNeighbors(players: Player[], targetId: string): Player[] {
  const alive = players.filter(p => p.status.isAlive);
  if (alive.length <= 1) return [];
  const idx = alive.findIndex(p => p.id === targetId);
  if (idx === -1) return [];
  const left = alive[(idx - 1 + alive.length) % alive.length];
  const right = alive[(idx + 1) % alive.length];
  if (left.id === right.id) {
    return [left];
  }
  return [left, right];
}

function queueNightShot(state: GameState, card: ActiveCardInstance, targetId: string) {
  const shooter = findPlayerWithCardInstance(state.players, card);
  if (!shooter) return;

  if (card.cardId === 'Mafia') {
    const pending = state.nightCache.pendingShots;
    const votes = pending.mafiaVotes || (pending.mafiaVotes = []);
    const payload = { shooterId: shooter.id, targetId };
    const idx = votes.findIndex(entry => entry.shooterId === shooter.id);
    if (idx >= 0) {
      votes[idx] = payload;
    } else {
      votes.push(payload);
    }
    return;
  }

  const bucket = card.cardId === 'Sniper'
    ? state.nightCache.pendingShots.sniper
    : state.nightCache.pendingShots.madGunman;

  const payload = { shooterId: shooter.id, instance: card.instance, targetId };
  const idx = bucket.findIndex(entry => entry.shooterId === shooter.id && entry.instance === card.instance);
  if (idx >= 0) bucket[idx] = payload; else bucket.push(payload);
}

function hasPendingShots(state: GameState): boolean {
  const shots = state.nightCache.pendingShots;
  return Boolean(shots.mafiaVotes.length || shots.madGunman.length || shots.sniper.length);
}

function hasPendingSockToxicity(state: GameState): boolean {
  return state.nightCache.pendingToxicSocks.length > 0;
}

function getMatrixShotCardInstance(state: GameState): ActiveCardInstance | null {
  const trap = state.nightCache.matrixTrap;
  if (!trap) return null;
  const owner = state.players.find(p => p.id === trap.playerId && p.status.isAlive);
  if (!owner) return null;
  const hasCard = owner.cards.some(r => r.cardId === 'Matrix' && r.instance === trap.instance);
  if (!hasCard) return null;
  return { cardId: 'Matrix', instance: trap.instance, mode: 'MATRIX_SHOT' };
}

function handleMageSelection(state: GameState, targetId: string, logFn: (key: string, params?: Record<string, string | number>) => void): GameState {
  const promptKey = state.uiState.pendingPrompts[0];

  const completeStep = () => {
    const remaining = state.uiState.pendingPrompts.slice(1);
    state.uiState = {
      ...state.uiState,
      waitingFor: 'NONE',
      pendingPrompts: remaining,
      selectionContext: null
    };
    return remaining.length === 0 ? advanceNight(state) : state;
  };

  if (!promptKey || promptKey === 'wake_up_mage_from') {
    const remaining = state.uiState.pendingPrompts.slice(1);
    state.uiState = {
      ...state.uiState,
      waitingFor: 'NONE',
      pendingPrompts: remaining.length ? remaining : ['wake_up_mage_to'],
      selectionContext: { cardId: 'Mage', data: { sourceId: targetId } }
    };
    return state;
  }

  if (promptKey === 'wake_up_mage_to') {
    const sourceId = state.uiState.selectionContext?.data?.sourceId;
    if (!sourceId) {
      state.uiState.selectionContext = { cardId: 'Mage', data: { sourceId: targetId } };
      return state;
    }

    if (sourceId === targetId) {
      logFn('log_tunnel_same_player');
      return state;
    }

    const sourceName = state.players.find(p => p.id === sourceId)?.name || '?';
    const targetPlayer = state.players.find(p => p.id === targetId);
    const targetName = targetPlayer?.name || '?';

    if (state.globalTunnels.some(t => t.sourceId === sourceId && t.targetId === targetId)) {
      logFn('log_tunnel_duplicate', { source: sourceName, target: targetName });
      return completeStep();
    }

    if (targetPlayer && targetPlayer.cards.some(rr => rr.cardId === 'Atheist')) {
      logFn('log_tunnel_atheist', { source: sourceName, target: targetPlayer.name });
      return completeStep();
    }

    const tunnel = addTunnelEntry(state, sourceId, targetId);
    logFn('log_tunnel_created', { source: sourceName, target: targetName, tunnelNumber: tunnel.tunnelNumber });
    return completeStep();
  }

  return state;
}

function handleBlindExecutionerSelection(state: GameState, targetId: string, logFn: (key: string, params?: Record<string, string | number>) => void): GameState {
  const card = state.activeCard;
  if (!card) return state;
  const owner = findPlayerWithCardInstance(state.players, card);
  if (!owner) return state;

  const targetPlayer = state.players.find(p => p.id === targetId && p.status.isAlive);
  if (!targetPlayer) {
    return state;
  }

  const prompts = state.uiState.pendingPrompts || [];
  const savedId = state.uiState.selectionContext?.data?.savedId;

  if (!savedId) {
    state.uiState = {
      ...state.uiState,
      waitingFor: 'NONE',
      pendingPrompts: prompts.slice(1),
      selectionContext: { cardId: 'BlindExecutioner', data: { savedId: targetId } }
    };
    return state;
  }

  if (savedId === targetId) {
    return state;
  }

  const savedPlayer = state.players.find(p => p.id === savedId && p.status.isAlive);
  if (!savedPlayer) {
    state.uiState = {
      ...state.uiState,
      waitingFor: 'NONE',
      pendingPrompts: prompts.slice(1),
      selectionContext: null
    };
    return state.uiState.pendingPrompts.length === 0 ? advanceNight(state) : state;
  }

  if (!state.nightCache.executionerPairs) {
    state.nightCache.executionerPairs = [];
  }
  state.nightCache.executionerPairs.push({ savedId, victimId: targetId });

  savedPlayer.status.executionerStatus = 'SAVED';
  targetPlayer.status.executionerStatus = 'VICTIM';

  owner.status.executionerUses = Math.min(2, owner.status.executionerUses + 1);

  logFn('log_night_executioner_save', { saved: savedPlayer.name, victim: targetPlayer.name });

  const remainingPrompts = prompts.slice(1);
  state.uiState = {
    ...state.uiState,
    waitingFor: 'NONE',
    pendingPrompts: remainingPrompts,
    selectionContext: null
  };

  return remainingPrompts.length === 0 ? advanceNight(state) : state;
}

function handleSockSelection(state: GameState, targetId: string, logFn: (key: string, params?: Record<string, string | number>) => void): GameState {
  if (!state.activeCard) return state;
  const targetPlayer = state.players.find(p => p.id === targetId && p.status.isAlive);
  if (!targetPlayer) {
    return state;
  }

  const firstTargetId = state.uiState.selectionContext?.cardId === 'Sock'
    ? state.uiState.selectionContext?.data?.firstTargetId
    : undefined;

  if (!firstTargetId) {
    const remainingPrompts = state.uiState.pendingPrompts.slice(1);
    state.uiState = {
      ...state.uiState,
      waitingFor: 'NONE',
      pendingPrompts: remainingPrompts.length ? remainingPrompts : ['wake_up_sock_second'],
      selectionContext: { cardId: 'Sock', data: { firstTargetId: targetId } }
    };
    return state;
  }

  if (firstTargetId === targetId) {
    return state;
  }

  const neighborIds = getAliveNeighbors(state.players, firstTargetId).map(p => p.id);
  if (!neighborIds.includes(targetId)) {
    return state;
  }

  const owner = findPlayerWithCardInstance(state.players, state.activeCard);
  if (!owner) return state;

  state.nightCache.pendingToxicSocks.push({
    sockId: owner.id,
    firstTargetId,
    secondTargetId: targetId
  });

  consumeCardInstance(owner, 'Sock', state.activeCard.instance);

  const firstPlayer = state.players.find(p => p.id === firstTargetId);
  logFn('log_action_sock_throw', { first: firstPlayer?.name || '?', second: targetPlayer.name });

  const remainingPrompts = state.uiState.pendingPrompts.slice(1);
  state.uiState = {
    ...state.uiState,
    waitingFor: 'NONE',
    pendingPrompts: remainingPrompts,
    selectionContext: null
  };
  return remainingPrompts.length === 0 ? advanceNight(state) : state;
}

function handleSwampSelection(
  state: GameState,
  targetId: string,
  logFn: (key: string, params?: Record<string, string | number>) => void
): GameState {
  if (!state.activeCard) return state;
  const owner = findPlayerWithCardInstance(state.players, state.activeCard);
  if (!owner || !owner.status.isAlive || owner.status.swampChargesLeft <= 0) {
    return state;
  }

  const targetPlayer = state.players.find(p => p.id === targetId && p.status.isAlive);
  if (!targetPlayer) {
    return state;
  }

  targetPlayer.status.mudCount = (targetPlayer.status.mudCount || 0) + 1;
  owner.status.swampChargesLeft = Math.max(0, owner.status.swampChargesLeft - 1);

  logFn('log_night_swamp_attack', { target: targetPlayer.name });

  const remainingPrompts = (state.uiState.pendingPrompts || []).slice(1);

  if (owner.status.swampChargesLeft > 0) {
    state.uiState = {
      ...state.uiState,
      waitingFor: 'USE_DECISION',
      pendingPrompts: ['wake_up_use_again'],
      selectionContext: null
    };
    return state;
  }

  state.uiState = {
    ...state.uiState,
    waitingFor: 'NONE',
    pendingPrompts: remainingPrompts,
    selectionContext: null
  };

  return remainingPrompts.length === 0 ? advanceNight(state) : state;
}

function applyActiveCardState(state: GameState, card: ActiveCardInstance | null): GameState {
  const requiresDecision = needsUsageDecision(state, card);
  const waitingFor: GameState['uiState']['waitingFor'] = requiresDecision ? 'USE_DECISION' : 'NONE';
  const prompts = card && !requiresDecision ? getCardPrompts(state, card) : [];
  const nextState = {
    ...state,
    activeCard: card,
    uiState: {
      ...state.uiState,
      waitingFor,
      pendingPrompts: prompts,
      selectionContext: null,
      dayAction: null
    }
  };
  recordPlayerWake(nextState, card);
  if (card?.cardId === 'Doctor' && !requiresDecision && prompts.length === 0) {
    return advanceNight(nextState);
  }
  if (card?.cardId === 'BlindExecutioner' && !requiresDecision && prompts.length === 0) {
    return advanceNight(nextState);
  }
  return nextState;
}

function finishNight(state: GameState): GameState {
  const needsProcessing = hasPendingShots(state) || state.nightCache.matrixStoredBullets > 0 || hasPendingSockToxicity(state);
  if (!needsProcessing) {
    return moveToBulletReplayOrDay(state);
  }

  const mutated = cloneState(state);

  if (hasPendingShots(mutated)) {
    processNightShotQueue(mutated);
  }

  const matrixPending = mutated.nightCache.matrixStoredBullets > 0;

  if (hasPendingSockToxicity(mutated)) {
    processSockToxicity(mutated);
  }

  if (matrixPending) {
    const matrixCard = getMatrixShotCardInstance(mutated);
    if (matrixCard) {
      const matrixPlayer = findPlayerWithCardInstance(mutated.players, matrixCard);
      if (matrixPlayer) {
        pushNightLogEntry(mutated, 'Matrix', matrixCard.instance, matrixPlayer.name, 'log_night_matrix_bullet_summary', {
          count: mutated.nightCache.matrixStoredBullets
        });
      }
      return applyActiveCardState({ ...mutated, phase: 'NIGHT_ACTIVE' }, matrixCard);
    }
    mutated.nightCache.matrixStoredBullets = 0;
    mutated.nightCache.matrixTrap = null;
  }

  if (!matrixPending) {
    mutated.nightCache.matrixTrap = null;
  }

  return moveToBulletReplayOrDay(mutated);
}

function advanceNight(state: GameState): GameState {
  const isMatrixShotStage = state.activeCard?.cardId === 'Matrix' && state.activeCard.mode === 'MATRIX_SHOT';
  if (isMatrixShotStage) {
    if (state.nightCache.matrixStoredBullets > 0) {
      return applyActiveCardState(state, state.activeCard);
    }
    const cleared = {
      ...state,
      nightCache: { ...state.nightCache, matrixTrap: null }
    };
    return moveToBulletReplayOrDay(cleared);
  }

  const selection = pullNextNightCard(state);
  const baseState = {
    ...state,
    nightCache: {
      ...state.nightCache,
      nightCardOrder: selection.order,
      nightCardCursor: selection.nextCursor
    }
  };
  if (selection.card) {
    return applyActiveCardState(baseState, selection.card);
  }
  return finishNight(baseState);
}

const emptyState: GameState = {
  players: [],
  phase: 'SETUP',
  currentRound: 0,
  firstNightBriefingDone: false,
  publicReport: [],
  publicReportsByRound: {},
  doctorRules: { selfHealOffset: 1 },
  activeCard: null,
  globalTunnels: [],
  nightCache: createNightCache(),
  uiState: {
    waitingFor: 'NONE',
    pendingPrompts: [],
    selectionContext: null,
    dayAction: null,
    pendingDayReport: null,
    communistSuppressionActive: false,
    bulletReplayNonce: 0,
    pendingVictoryKey: null
  },
  logs: [],
  settings: normalizeSettings(DEFAULT_SETTINGS),
  victory: null
};

export const initialWrapper: UndoWrapper = { past: [], present: emptyState, future: [] };

function internalReducer(state: GameState, action: Action): GameState {
  switch (action.type) {
    case 'START_GAME': {
      const { names, customDeck, language } = action.payload;
      const players: Player[] = names.map((name, i) => ({
        id: `p${i}`, name, cards: [], inactiveCards: [], hasGasMask: false,
        status: {
          isAlive: true,
          isJailed: false,
          isSilenced: false,
          isCantVote: false,
          isSlimed: false,
          isSanded: false,
          isMagnetized: false,
          mudCount: 0,
          swampChargesLeft: 0,
          matrixAbilityUsed: false,
          gravediggerUsed: false,
          massMurdererUsed: false,
          jailerAbilityUsed: false,
          executionerStatus: 'NONE',
          executionerUses: 0,
          anarchistShotUsed: false,
          terroristBombUsed: false,
          astronomerNightUsed: false,
          communistEqualityUsed: false,
          timeLordSkipUsed: false
        }
      }));
      const dealt = dealCards(players, customDeck);
      const startedState: GameState = { 
        ...state, 
        players: dealt, 
        phase: 'NIGHT_ANNOUNCEMENT', 
        currentRound: 1, 
        firstNightBriefingDone: false,
        publicReport: [],
        publicReportsByRound: {},
        doctorRules: createDoctorRules(),
        activeCard: null,
        nightCache: createNightCache(),
        uiState: {
          waitingFor: 'NONE',
          pendingPrompts: [],
          selectionContext: null,
          dayAction: null,
          pendingDayReport: null,
          communistSuppressionActive: false,
          bulletReplayNonce: 0,
          pendingVictoryKey: null
        },
        settings: normalizeSettings({ ...state.settings, language }),
        logs: [{ 
          id: '0', 
          timestamp: Date.now(), 
          round: 0, 
          phase: 'SETUP', 
          text: t('log_start_game', language), 
          translationKey: 'log_start_game',
          translationParams: {},
          type: 'SYSTEM' 
        }],
        victory: null 
      };
      pushPhaseDividerLog(startedState, 'NIGHT_START', startedState.currentRound);
      return startedState;
    }

    case 'NEXT_PHASE': {
        if (state.phase === 'NIGHT_ANNOUNCEMENT') {
          const baseState = (state.currentRound === 1 && !state.firstNightBriefingDone)
            ? { ...state, firstNightBriefingDone: true }
            : state;
          const prepared = {
            ...baseState,
            nightCache: {
              ...baseState.nightCache,
              nightCardOrder: [],
              nightCardCursor: 0
            }
          };
          const selection = pullNextNightCard(prepared, { forceRebuild: true });
          const withOrder = {
            ...prepared,
            nightCache: {
              ...prepared.nightCache,
              nightCardOrder: selection.order,
              nightCardCursor: selection.nextCursor
            }
          };
          if (!selection.card) {
            return moveToDayAnnouncement(withOrder);
          }
          return applyActiveCardState({ ...withOrder, phase: 'NIGHT_ACTIVE' }, selection.card);
        }
        if (state.phase === 'NIGHT_ACTIVE') {
          return advanceNight(state);
      }
      if (state.phase === 'NIGHT_REPLAY') {
        return moveToDayAnnouncement(state);
      }
      if (state.phase === 'DAY_ANNOUNCEMENT') {
        return {
          ...state,
          phase: 'DAY_MAIN',
          uiState: { ...state.uiState, waitingFor: 'NONE', pendingPrompts: [], selectionContext: null, dayAction: null }
        };
      }
      if (state.phase === 'DAY_MAIN') {
        return advanceDayToNight(state);
      }
      return state;
    }

    case 'REPLAY_BULLETS': {
      if (state.phase !== 'NIGHT_REPLAY') {
        return state;
      }
      if (!state.nightCache.bulletAnimations?.length) {
        return state;
      }
      const newState = cloneState(state);
      newState.uiState = {
        ...newState.uiState,
        bulletReplayNonce: newState.uiState.bulletReplayNonce + 1
      };
      return newState;
    }

    case 'CONFIRM_DAY_REPORT': {
      const pending = state.uiState.pendingDayReport;
      if (!pending?.length) {
        return state;
      }
      const newState = cloneState(state);
      const existingHistory = newState.publicReportsByRound || {};
      const roundEntries = existingHistory[newState.currentRound] ?? [];
      newState.publicReport = [...(newState.publicReport || []), ...pending];
      newState.publicReportsByRound = {
        ...existingHistory,
        [newState.currentRound]: [...roundEntries, ...pending]
      };
      newState.uiState = { ...newState.uiState, pendingDayReport: null };
      return newState;
    }

    case 'TRIGGER_VOTE': {
      if (state.phase !== 'DAY_MAIN' || state.uiState.waitingFor === 'USE_DECISION') {
        return state;
      }
      const newState = cloneState(state);
      setDayActionPrompt(newState, { kind: 'HANG', promptKey: 'day_prompt_vote' });
      return newState;
    }

    case 'CONFIRM_MASS_MURDERER': {
      if (state.phase !== 'DAY_MAIN') {
        return state;
      }
      const context = state.uiState.dayAction;
      if (!context || context.kind !== 'MASS_MURDERER_RETALIATION') {
        return state;
      }
      const newState = cloneState(state);
      const massCtx = newState.uiState.dayAction?.massMurderer;
      if (!massCtx) {
        setDayActionPrompt(newState, null);
        return newState;
      }
      const owner = newState.players.find(p => p.id === massCtx.ownerId) || null;
      const uniqueSelection = Array.from(new Set(massCtx.selectedIds || []));
      const dayResults: Array<DayDamageResult | null> = [];
      if (owner) {
        uniqueSelection.forEach(voterId => {
          if (voterId === owner.id) {
            return;
          }
          const voter = newState.players.find(p => p.id === voterId);
          if (!voter || !voter.status.isAlive) {
            return;
          }
          pushGeneralLog(newState, 'log_day_mass_murderer_shot', { player: owner.name, target: voter.name });
          dayResults.push(resolveDayDamage(newState, voter.id, 'SHOOT'));
        });
        owner.status.massMurdererUsed = true;
        consumeCard(owner, 'MassMurderer');
      }
      const hangTargetId = context.targetId ?? owner?.id ?? null;
      if (hangTargetId) {
        const hangTarget = newState.players.find(p => p.id === hangTargetId);
        const hangTargetName = hangTarget?.name || '?';
        pushGeneralLog(newState, 'log_day_vote', { target: hangTargetName });
        dayResults.push(resolveDayDamage(newState, hangTargetId, 'HANG'));
      }
      setPendingDayReport(newState, dayResults);
      setDayActionPrompt(newState, null);
      return newState;
    }

    case 'TRIGGER_ANARCHIST': {
      if (state.phase !== 'DAY_MAIN' || state.uiState.waitingFor === 'USE_DECISION') {
        return state;
      }
      const actor = findReadyAnarchist(state);
      if (!actor) {
        const newState = cloneState(state);
        pushGeneralLog(newState, 'warn_anarchist_unavailable', {}, 'SYSTEM');
        return newState;
      }
      const newState = cloneState(state);
      setDayActionPrompt(newState, {
        kind: 'ANARCHIST_SHOT',
        promptKey: 'day_prompt_shot',
        actorId: actor.id,
        consumeAnarchistCharge: true,
        source: 'ANARCHIST'
      });
      return newState;
    }

    case 'GM_CLICK_PLAYER': {
      if (state.uiState.waitingFor === 'USE_DECISION') return state;
      if (!action.payload) return state;

      if (state.phase === 'NIGHT_ACTIVE' && state.activeCard) {
        const newState = cloneState(state);
        const card = newState.activeCard;
        if (!card) {
          return state;
        }
        const owner = findPlayerWithCardInstance(newState.players, card);
        const ownerName = owner?.name || '?';
        const pushActionLog = (key: string, params: Record<string, string | number> = {}) => {
          pushNightLogEntry(newState, card.cardId, card.instance, ownerName, key, params);
        };
        const advanceAfterSelection = (clearSelection = false) => {
          const remainingPrompts = (newState.uiState.pendingPrompts || []).slice(1);
          const shouldAdvance = remainingPrompts.length === 0;
          newState.uiState = {
            ...newState.uiState,
            waitingFor: 'NONE',
            pendingPrompts: remainingPrompts,
            selectionContext: clearSelection || shouldAdvance ? null : newState.uiState.selectionContext
          };
          return shouldAdvance ? advanceNight(newState) : newState;
        };
        const targetId = action.payload;

        if (owner?.status.isJailed) {
          markCardInstanceBlockedThisNight(newState, card, owner.id);
          pushActionLog('log_action_blocked_jailed', { player: ownerName });
          return advanceAfterSelection(true);
        }

        if (card.cardId === 'Mage') {
          return handleMageSelection(newState, targetId, pushActionLog);
        }

        if (card.cardId === 'BlindExecutioner') {
          return handleBlindExecutionerSelection(newState, targetId, pushActionLog);
        }

        if (card.cardId === 'Sock') {
          return handleSockSelection(newState, targetId, pushActionLog);
        }

        const targetPlayer = newState.players.find(p => p.id === targetId);

        if (card.cardId === 'Jailer') {
          if (!targetPlayer || !targetPlayer.status.isAlive) {
            return state;
          }
          targetPlayer.status.isJailed = true;
          if (owner) {
            owner.status.jailerAbilityUsed = true;
            markJailerUsedThisNight(newState, owner.id);
          }
          pushActionLog('log_jailer_imprison', { target: targetPlayer.name });
        } else if (card.cardId === 'Mafia' || card.cardId === 'MadGunman' || card.cardId === 'Sniper') {
          queueNightShot(newState, card, targetId);
          pushActionLog('log_shooter_aim', { target: targetPlayer?.name || '?' });
          if (card.cardId === 'Sniper' && owner) {
            consumeCardInstance(owner, 'Sniper', card.instance);
          }
        } else if (card.cardId === 'Doctor') {
          const ctx = getDoctorContext(newState, card);
          const healer = ctx.healer;
          if (!healer || !targetPlayer || !targetPlayer.status.isAlive) {
            return state;
          }
          if (!ctx.hasTargets) {
            return state;
          }
          if (ctx.isDeactivated) {
            pushActionLog('log_doctor_fail', { target: targetPlayer.name });
            return advanceAfterSelection(true);
          }
          if (targetPlayer.id === healer.id && !ctx.canSelf) {
            pushActionLog('log_doctor_self_locked');
            return newState;
          }
          const mode: DoctorHealMode = targetPlayer.id === healer.id ? 'SELF' : 'OTHER';
          recordDoctorProtection(newState, healer.id, targetPlayer.id, card, mode);
          pushActionLog('log_doctor_success', { target: targetPlayer.name });
        } else if (card.cardId === 'Matrix' && card.mode === 'MATRIX_SHOT') {
          if (newState.nightCache.matrixStoredBullets > 0) {
            const targetName = targetPlayer?.name || '?';
            newState.nightCache.matrixStoredBullets -= 1;
            const matrixShooter = findPlayerWithCardInstance(newState.players, card);
            resolveNightShot(
              newState,
              targetId,
              'MATRIX',
              matrixShooter?.id || null,
              matrixShooter
                ? {
                    shooterLabel: createCardLabelParam('Matrix', card.instance),
                    shooterName: matrixShooter.name,
                    initialTargetName: targetName
                  }
                : undefined
            );
          }
        } else {
          const p = targetPlayer;
          if (p && p.status.isAlive) {
            const reportData = newState.nightCache.reportData;
            switch(card.cardId) {
              case 'Leech': {
                if (!owner || !owner.status.isAlive) break;
                if (!newState.nightCache.leechLinks) {
                  newState.nightCache.leechLinks = [];
                }
                const leechLinks = newState.nightCache.leechLinks;
                const payload = {
                  leechId: owner.id,
                  instance: card.instance,
                  targetId: p.id,
                  triggered: false
                };
                const existingIdx = leechLinks.findIndex(link => link.leechId === owner.id && link.instance === card.instance);
                if (existingIdx >= 0) {
                  leechLinks[existingIdx] = payload;
                } else {
                  leechLinks.push(payload);
                }
                pushActionLog('log_action_leech', { target: p.name });
                break;
              }
              case 'Cobra': {
                if (!owner || !owner.status.isAlive) break;
                if (!newState.nightCache.cobraTargets) {
                  newState.nightCache.cobraTargets = [];
                }
                newState.nightCache.cobraTargets.push({
                  cobraId: owner.id,
                  instance: card.instance,
                  targetId: p.id
                });
                pushActionLog('log_action_cobra', { name: p.name });
                break;
              }
              case 'Magnet': {
                if (!owner || !owner.status.isAlive) break;
                p.status.isMagnetized = true;
                pushActionLog('log_action_magnet', { name: p.name });
                break;
              }
              case 'Slime':
                p.status.isSlimed = true;
                reportData.slimedTargets.push(p.id);
                pushActionLog('log_action_slime', { target: p.name });
                break;
              case 'Sand':
                if (p.hasGasMask) {
                  reportData.sandProtectedTargets.push(p.id);
                  pushActionLog('log_action_sand_fail', { target: p.name });
                } else {
                  p.status.isSanded = true;
                  p.status.isSlimed = false;
                  addUniqueTarget(reportData.sandedTargets, p.id);
                  pushActionLog('log_action_sand', { target: p.name });
                }
                break;
              case 'GhostBobo':
                p.status.isSilenced = true;
                addUniqueTarget(reportData.ghostTargets, p.id);
                pushActionLog('log_action_ghost', { target: p.name });
                break;
              case 'Judge':
                p.status.isCantVote = true;
                addUniqueTarget(reportData.judgeTargets, p.id);
                pushActionLog('log_action_judge', { target: p.name });
                break;
              case 'SwampMonster':
                return handleSwampSelection(newState, targetId, pushActionLog);
              // ... add others using keys from translations
            }
          }
        }

        return advanceAfterSelection();
      }

      if (state.phase === 'DAY_MAIN') {
        const context = state.uiState.dayAction;
        if (!context) {
          return state;
        }
        const newState = cloneState(state);
        const targetId = action.payload;
        const targetPlayer = newState.players.find(p => p.id === targetId);
        const targetName = targetPlayer?.name || '?';

        if (context.kind === 'MASS_MURDERER_RETALIATION') {
          const massCtx = newState.uiState.dayAction?.massMurderer;
          if (!massCtx) {
            setDayActionPrompt(newState, null);
            return newState;
          }
          if (targetId === massCtx.ownerId) {
            return state;
          }
          if (!targetPlayer || !targetPlayer.status.isAlive) {
            return state;
          }
          const selected = massCtx.selectedIds || (massCtx.selectedIds = []);
          const idx = selected.indexOf(targetId);
          if (idx >= 0) {
            selected.splice(idx, 1);
          } else {
            selected.push(targetId);
          }
          return newState;
        }

        if (context.kind === 'HANG') {
          if (
            targetPlayer &&
            targetPlayer.status.isAlive &&
            targetPlayer.cards.some(card => card.cardId === 'MassMurderer') &&
            !targetPlayer.status.massMurdererUsed
          ) {
            const retaliationContext: DayActionContext = {
              kind: 'MASS_MURDERER_RETALIATION',
              promptKey: 'day_prompt_mass_murderer_select',
              source: 'MASS_MURDERER',
              targetId: targetPlayer.id,
              massMurderer: {
                ownerId: targetPlayer.id,
                selectedIds: []
              }
            };
            pushGeneralLog(newState, 'log_day_mass_murderer_trigger', { target: targetPlayer.name });
            setDayActionPrompt(newState, retaliationContext);
            return newState;
          }
          pushGeneralLog(newState, 'log_day_vote', { target: targetName });
          const result = resolveDayDamage(newState, targetId, 'HANG');
          setPendingDayReport(newState, [result]);
        } else if (context.kind === 'ANARCHIST_SHOT') {
          const result = resolveDayDamage(newState, targetId, 'SHOOT');
          const actor = context.actorId ? newState.players.find(p => p.id === context.actorId) : null;
          if (context.consumeAnarchistCharge && actor) {
            actor.status.anarchistShotUsed = true;
          }
          pushGeneralLog(newState, 'log_day_shot', {
            target: targetName,
            actor: actor?.name || t('role_Anarchist', newState.settings.language)
          });
          setPendingDayReport(newState, [result]);
        }
        setDayActionPrompt(newState, null);
        return newState;
      }

      return state;
    }

    case 'GM_USE_DECISION': {
      if (state.phase !== 'NIGHT_ACTIVE' || state.uiState.waitingFor !== 'USE_DECISION' || !state.activeCard) {
        return state;
      }
      const activeCard = state.activeCard;
      if (!action.payload) {
        const skipped = {
          ...state,
          uiState: { ...state.uiState, waitingFor: 'NONE' as const, pendingPrompts: [] as string[], selectionContext: null, dayAction: null }
        };
        return advanceNight(skipped);
      }
      const owner = findPlayerWithCardInstance(state.players, activeCard);
      if (
        activeCard.cardId === 'Jailer' &&
        owner &&
        (owner.status.jailerAbilityUsed || hasJailerActedThisNight(state, owner.id))
      ) {
        const skipped = {
          ...state,
          uiState: { ...state.uiState, waitingFor: 'NONE' as const, pendingPrompts: [] as string[], selectionContext: null, dayAction: null }
        };
        return advanceNight(skipped);
      }
      if (owner?.status.isJailed && !OPTIONAL_SELECTION_CARDS.has(activeCard.cardId)) {
        const newState = cloneState(state);
        const clonedOwner = findPlayerWithCardInstance(newState.players, activeCard);
        const ownerName = clonedOwner?.name || owner.name || '?';
        markCardInstanceBlockedThisNight(newState, activeCard, clonedOwner?.id ?? owner.id);
        pushNightLogEntry(newState, activeCard.cardId, activeCard.instance, ownerName, 'log_action_blocked_jailed', { player: ownerName });
        newState.uiState = { ...newState.uiState, waitingFor: 'NONE', pendingPrompts: [], selectionContext: null, dayAction: null };
        return advanceNight(newState);
      }
      if (activeCard.cardId === 'Matrix' && activeCard.mode !== 'MATRIX_SHOT') {
        const newState = cloneState(state);
        const matrixPlayer = findPlayerWithCardInstance(newState.players, activeCard);
        if (matrixPlayer && !matrixPlayer.status.matrixAbilityUsed) {
          matrixPlayer.status.matrixAbilityUsed = true;
          newState.nightCache.matrixTrap = {
            playerId: matrixPlayer.id,
            instance: activeCard.instance
          };
          pushNightLogEntry(newState, 'Matrix', activeCard.instance, matrixPlayer.name, 'log_night_matrix_activate');
        }
        newState.uiState = { ...newState.uiState, waitingFor: 'NONE', pendingPrompts: [], selectionContext: null, dayAction: null };
        return advanceNight(newState);
      }
      if (activeCard.cardId === 'Gravedigger') {
        const newState = cloneState(state);
        const gravedigger = findPlayerWithCardInstance(newState.players, activeCard);
        if (gravedigger && gravedigger.status.isAlive && !gravedigger.status.gravediggerUsed) {
          gravedigger.status.gravediggerUsed = true;
          newState.nightCache.gravediggerActive.push({ playerId: gravedigger.id, instance: activeCard.instance });
          if (!newState.nightCache.gravediggerBonus[gravedigger.id]) {
            newState.nightCache.gravediggerBonus[gravedigger.id] = 0;
          }
          pushNightLogEntry(newState, 'Gravedigger', activeCard.instance, gravedigger.name, 'log_player_activate');
        }
        newState.uiState = { ...newState.uiState, waitingFor: 'NONE', pendingPrompts: [], selectionContext: null, dayAction: null };
        return advanceNight(newState);
      }
      if (activeCard.cardId === 'Spyglass') {
        const acknowledged = {
          ...state,
          uiState: { ...state.uiState, waitingFor: 'NONE' as const, pendingPrompts: [] as string[], selectionContext: null, dayAction: null }
        };
        return advanceNight(acknowledged);
      }
      if (isPassiveAutoCard(activeCard)) {
        const resolved = {
          ...state,
          uiState: { ...state.uiState, waitingFor: 'NONE' as const, pendingPrompts: [] as string[], selectionContext: null, dayAction: null }
        };
        return advanceNight(resolved);
      }
      const prompts = getCardPrompts(state, activeCard);
      const resumed = {
        ...state,
        uiState: { ...state.uiState, waitingFor: 'NONE' as const, pendingPrompts: prompts, selectionContext: null, dayAction: null }
      };
      if (activeCard.cardId === 'BlindExecutioner' && prompts.length === 0) {
        return advanceNight(resumed);
      }
      return resumed;
    }

    case 'UPDATE_SETTINGS': {
      const merged = normalizeSettings({ ...state.settings, ...action.payload });
      if (
        state.settings.language === merged.language &&
        state.settings.bulletSpeed === merged.bulletSpeed &&
        state.settings.playerNodeScale === merged.playerNodeScale
      ) {
        return state;
      }
      return { ...state, settings: merged };
    }

    case 'TRIGGER_ASTRONOMER': {
      if (state.phase !== 'DAY_MAIN') {
        const newState = cloneState(state);
        pushGeneralLog(newState, 'warn_astronomer_day_only', {}, 'SYSTEM');
        return newState;
      }
      const astronomer = findReadyAstronomer(state);
      if (!astronomer) {
        const newState = cloneState(state);
        pushGeneralLog(newState, 'warn_astronomer_unavailable', {}, 'SYSTEM');
        return newState;
      }
      const newState = cloneState(state);
      const actingAstronomer = newState.players.find(p => p.id === astronomer.id);
      if (!actingAstronomer) {
        return state;
      }
      actingAstronomer.status.astronomerNightUsed = true;
      pushGeneralLog(newState, 'log_day_astronomer', { player: actingAstronomer.name });
      return advanceDayToNight(newState);
    }

    case 'TRIGGER_COMMUNIST': {
      if (state.phase !== 'DAY_MAIN') {
        const newState = cloneState(state);
        pushGeneralLog(newState, 'warn_communist_day_only', {}, 'SYSTEM');
        return newState;
      }
      const communist = findReadyCommunist(state);
      if (!communist) {
        const newState = cloneState(state);
        pushGeneralLog(newState, 'warn_communist_unavailable', {}, 'SYSTEM');
        return newState;
      }
      const newState = cloneState(state);
      const actingCommunist = newState.players.find(p => p.id === communist.id);
      if (!actingCommunist) {
        return state;
      }
      actingCommunist.status.communistEqualityUsed = true;
      newState.players = newState.players.map(player => ({
        ...player,
        status: {
          ...player.status,
          isSilenced: false,
          isCantVote: false
        }
      }));
      newState.uiState = {
        ...newState.uiState,
        communistSuppressionActive: true
      };
      pushGeneralLog(newState, 'log_day_communist', { player: actingCommunist.name });
      return newState;
    }

    case 'TRIGGER_TIMELORD_SKIP': {
      const requiredPhase = action.payload.targetPhase === 'NIGHT' ? 'NIGHT_ANNOUNCEMENT' : 'DAY_ANNOUNCEMENT';
      if (state.phase !== requiredPhase) {
        return state;
      }
      const timeLord = findReadyTimeLord(state);
      if (!timeLord) {
        return state;
      }
      const newState = cloneState(state);
      const actingTimeLord = newState.players.find(p => p.id === timeLord.id);
      if (!actingTimeLord) {
        return state;
      }
      actingTimeLord.status.timeLordSkipUsed = true;
      const logKey = action.payload.targetPhase === 'NIGHT' ? 'log_timelord_skip_night' : 'log_timelord_skip_day';
      pushGeneralLog(newState, logKey, {
        player: actingTimeLord.name,
        cardLabel: createCardLabelParam('TimeLord')
      });
      if (action.payload.targetPhase === 'NIGHT') {
        const workingState =
          newState.currentRound === 1 && !newState.firstNightBriefingDone
            ? { ...newState, firstNightBriefingDone: true }
            : newState;
        return moveToDayAnnouncement(workingState);
      }
      return advanceDayToNight(newState);
    }

    case 'TRIGGER_BOMB': {
      if (state.phase !== 'DAY_MAIN') {
        const newState = cloneState(state);
        pushGeneralLog(newState, 'warn_bomb_day_only', {}, 'SYSTEM');
        return newState;
      }
      const terrorist = findReadyTerrorist(state);
      if (!terrorist) {
        const newState = cloneState(state);
        pushGeneralLog(newState, 'warn_terrorist_unavailable', {}, 'SYSTEM');
        return newState;
      }
      const newState = cloneState(state);
      const actingTerrorist = newState.players.find(p => p.id === terrorist.id);
      if (!actingTerrorist) {
        return state;
      }
      actingTerrorist.status.terroristBombUsed = true;
      pushGeneralLog(newState, 'log_day_bomb', { player: actingTerrorist.name });
      const aliveTargets = newState.players.filter(p => p.status.isAlive).map(p => p.id);
      const dayResults: Array<DayDamageResult | null> = [];
      aliveTargets.forEach(targetId => {
        dayResults.push(resolveDayDamage(newState, targetId, 'SHOOT'));
      });
      setDayActionPrompt(newState, null);
      setPendingDayReport(newState, dayResults);
      return newState;
    }
  }
  return state;
}

export function gameReducerWrapper(wrapper: UndoWrapper, action: Action): UndoWrapper {
  if (wrapper.present.phase === 'GAME_OVER' && action.type !== 'UNDO') {
    return wrapper;
  }
  if (action.type === 'LOAD_GAME') {
    return hydrateWrapper(action.payload); // Completely replace state with saved state
  }
  if (action.type === 'UNDO') {
    if (wrapper.past.length === 0) return wrapper;
    const prev = wrapper.past[wrapper.past.length - 1];
    const hydratedPrev = hydrateState(prev);
    const preservedSettings = wrapper.present.settings;
    const mergedPrev = {
      ...hydratedPrev,
      settings: { ...preservedSettings }
    };
    return { past: wrapper.past.slice(0, -1), present: mergedPrev, future: [] };
  }
  const reduced = internalReducer(wrapper.present, action);
  const hydrated = hydrateState(reduced);
  const finalized = finalizeVictoryState(hydrated);
  if (wrapper.present === finalized) return wrapper;
  if (action.type === 'UPDATE_SETTINGS') {
    return { ...wrapper, present: finalized, future: [] };
  }
  if (action.type === 'REPLAY_BULLETS') {
    return { ...wrapper, present: finalized, future: [] };
  }
  return { past: [...wrapper.past, wrapper.present].slice(-50), present: finalized, future: [] };
}

