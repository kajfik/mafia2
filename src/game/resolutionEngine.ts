import type {
  GameState,
  Player,
  GameLog,
  ShooterQueuedShot,
  CardId,
  PublicReportSockOutcome,
  PublicReportFragment,
  BulletAnimationSegment,
  VictorySide,
  VictoryCause,
  LogMessageFragment,
  LogParamMap,
  LogParamValue
} from './types';
import { t } from './translations';
import { countCards, consumeAllCards, consumeCardWithInstance, grantCardInstance } from './cardUtils';
import { createCardLabelParam, resolveLogParams, renderLogFragments } from './logging';

function log(state: GameState, key: string, params: LogParamMap = {}, type: GameLog['type'] = 'ACTION') {
  const resolvedParams = resolveLogParams(params, state.players, state.settings.language);
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

function markLeechLinkTriggered(state: GameState, targetId: string) {
  if (state.phase !== 'NIGHT_ACTIVE' && state.phase !== 'NIGHT_ANNOUNCEMENT') {
    return;
  }
  const links = state.nightCache.leechLinks;
  if (!links?.length) {
    return;
  }
  links.forEach(link => {
    if (link.targetId === targetId) {
      link.triggered = true;
    }
  });
}

  function registerCloudwalkerLoss(state: GameState, count = 1) {
    const active = state.nightCache.gravediggerActive;
    if (!active?.length || count <= 0) return;
    active.forEach(({ playerId }) => {
      if (!state.nightCache.gravediggerBonus[playerId]) {
        state.nightCache.gravediggerBonus[playerId] = 0;
      }
      state.nightCache.gravediggerBonus[playerId] += count;
    });
  }

function registerGlazierMirrorBreak(state: GameState, brokenPlayerId: string) {
  if (!state.nightCache.glazierPendingRewards) {
    state.nightCache.glazierPendingRewards = [];
  }
  state.players.forEach(player => {
    if (!player.status.isAlive) return;
    if (player.id === brokenPlayerId) return;
    if (!player.cards.some(rr => rr.cardId === 'Glazier')) return;
    if (player.cards.some(rr => rr.cardId === 'Mirror')) return;
    if (state.nightCache.glazierPendingRewards.includes(player.id)) return;
    state.nightCache.glazierPendingRewards.push(player.id);
  });
}

function getNeighbors(players: Player[], targetId: string) {
  const alive = players.filter(p => p.status.isAlive);
  const idx = alive.findIndex(p => p.id === targetId);
  if (idx === -1) return { left: null, right: null };
  return {
    left: alive[(idx - 1 + alive.length) % alive.length],
    right: alive[(idx + 1) % alive.length]
  };
}

type BulletSource = 'MAFIA' | 'MAD_GUNMAN' | 'SNIPER' | 'MATRIX';

type BulletFragment = PublicReportFragment;
type BulletLogFragment = LogMessageFragment;

type ShotContext = {
  shooterLabel: LogParamValue;
  shooterName: string;
  initialTargetName: string;
};

type BulletQueueEntry = {
  targetId: string;
  previousTargetId: string | null;
  visitedTunnels: Set<string>;
  magnetAttractors: Set<string>;
  isRedirected: boolean;
  fragments: BulletFragment[];
  logFragments: BulletLogFragment[];
  segments: BulletAnimationSegment[];
  shotId: string;
  sourceId: string | null;
};

function createShotId(): string {
  return `shot-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function consumeDoctorProtection(state: GameState, targetId: string): boolean {
  if (!state.nightCache.doctorProtections) {
    state.nightCache.doctorProtections = [];
  }
  const idx = state.nightCache.doctorProtections.findIndex(entry => entry.targetId === targetId);
  if (idx >= 0) {
    state.nightCache.doctorProtections.splice(idx, 1);
    return true;
  }
  return false;
}

export type DayDamageResult =
  | { type: 'ROPEWALKER'; playerId: string; playerName: string; instance: number }
  | { type: 'IMMUNITY'; playerId: string; playerName: string; instance: number }
  | { type: 'KEVLAR'; playerId: string; playerName: string; instance: number }
  | { type: 'CLOUDWALKER'; playerId: string; playerName: string; instance: number }
  | { type: 'DEATH'; playerId: string; playerName: string };

function applyBlindExecutionerRedirect(state: GameState, targetId: string): string {
  const pairs = state.nightCache.executionerPairs;
  if (!pairs?.length) {
    return targetId;
  }
  const idx = pairs.findIndex(pair => pair.savedId === targetId);
  if (idx === -1) {
    return targetId;
  }
  const [pair] = pairs.splice(idx, 1);
  const savedPlayer = state.players.find(p => p.id === pair.savedId);
  if (savedPlayer) {
    savedPlayer.status.executionerStatus = 'NONE';
  }
  const victimPlayer = state.players.find(p => p.id === pair.victimId);
  if (victimPlayer) {
    victimPlayer.status.executionerStatus = 'NONE';
    if (victimPlayer.status.isAlive) {
      return victimPlayer.id;
    }
  }
  return targetId;
}

export function resolveDayDamage(state: GameState, targetId: string, type: 'HANG' | 'SHOOT'): DayDamageResult | null {
  if (type === 'HANG') {
    const redirectedId = applyBlindExecutionerRedirect(state, targetId);
    if (redirectedId !== targetId) {
      return resolveDayDamage(state, redirectedId, 'HANG');
    }
    targetId = redirectedId;
  }

  const player = state.players.find(x => x.id === targetId);
  if (!player || !player.status.isAlive) {
    return null;
  }

  if (type === 'HANG') {
    const ropewalkerInstance = consumeCardWithInstance(player, 'RopeWalker');
    if (ropewalkerInstance !== null) {
      log(state, 'report_ropewalker_lost', { target: player.name, num: ropewalkerInstance });
      return { type: 'ROPEWALKER', playerId: player.id, playerName: player.name, instance: ropewalkerInstance };
    }
  }

  const immunityInstance = consumeCardWithInstance(player, 'Immunity');
  if (immunityInstance !== null) {
    log(state, 'report_immunity_lost', { target: player.name, num: immunityInstance });
    return { type: 'IMMUNITY', playerId: player.id, playerName: player.name, instance: immunityInstance };
  }

  if (type === 'SHOOT') {
    const vestInstance = consumeCardWithInstance(player, 'KevlarVest');
    if (vestInstance !== null) {
      log(state, 'report_vest_hit', { target: player.name, num: vestInstance });
      return { type: 'KEVLAR', playerId: player.id, playerName: player.name, instance: vestInstance };
    }
  }

  const cloudwalkerInstance = consumeCardWithInstance(player, 'CloudWalker');
  if (cloudwalkerInstance !== null) {
    log(state, 'report_life_lost', { target: player.name, num: cloudwalkerInstance });
    checkLifeLossSideEffects(state, player, { lossType: 'CLOUDWALKER' });
    return { type: 'CLOUDWALKER', playerId: player.id, playerName: player.name, instance: cloudwalkerInstance };
  }

  player.status.isAlive = false;
  log(state, 'report_death', { target: player.name }, 'DEATH');
  checkLifeLossSideEffects(state, player, { lossType: 'DEATH' });
  declareVictory(state, 'DAY');
  return { type: 'DEATH', playerId: player.id, playerName: player.name };
}

const LOG_FRAGMENT_MAP: Record<string, string> = {
  night_report_bullet_dead_target: 'night_log_bullet_dead_target',
  night_report_bullet_matrix_catch: 'night_log_bullet_matrix_catch',
  night_report_bullet_magnet: 'night_log_bullet_magnet',
  night_report_bullet_magnet_dead: 'night_log_bullet_magnet_dead',
  night_report_bullet_split: 'night_log_bullet_split',
  night_report_bullet_tunnel_single: 'night_log_bullet_tunnel_single',
  night_report_bullet_tunnel_segment: 'night_log_bullet_tunnel_segment',
  night_report_bullet_slime: 'night_log_bullet_slime',
  night_report_bullet_al_capone: 'night_log_bullet_al_capone',
  night_report_bullet_doctor: 'night_log_bullet_doctor',
  night_report_bullet_mirror_break: 'night_log_bullet_mirror_break',
  night_report_bullet_return: 'night_log_bullet_return',
  night_report_bullet_vest_loss: 'night_log_bullet_vest_loss',
  night_report_bullet_cloudwalker_loss: 'night_log_bullet_cloudwalker_loss',
  night_report_bullet_death: 'night_log_bullet_death'
};

const LOG_FRAGMENT_FIRST_MAP: Record<string, string> = {
  night_log_bullet_tunnel_single: 'night_log_bullet_tunnel_initial',
  night_log_bullet_magnet: 'night_log_bullet_magnet_initial',
  night_log_bullet_mirror_break: 'night_log_bullet_mirror_break_initial',
  night_log_bullet_slime: 'night_log_bullet_slime_initial',
  night_log_bullet_al_capone: 'night_log_bullet_al_capone_initial',
  night_log_bullet_doctor: 'night_log_bullet_doctor_initial',
  night_log_bullet_vest_loss: 'night_log_bullet_vest_loss_initial',
  night_log_bullet_cloudwalker_loss: 'night_log_bullet_cloudwalker_loss_initial',
  night_log_bullet_death: 'night_log_bullet_death_initial'
};

export function resolveNightShot(
  state: GameState,
  targetId: string,
  sourceType: BulletSource,
  shooterId: string | null = null,
  context?: ShotContext
) {
  const shotId = createShotId();
  const targetName = state.players.find(p => p.id === targetId)?.name || '?';
  const initialPublicFragment: BulletFragment = { key: 'night_report_bullet_start' };
  const initialLogFragment: BulletLogFragment = context
    ? { key: 'night_log_bullet_start', params: { cardLabel: context.shooterLabel, shooter: context.shooterName, target: context.initialTargetName } }
    : { key: 'night_log_bullet_start_generic', params: { target: targetName } };
  const queue: BulletQueueEntry[] = [
    {
      targetId,
      previousTargetId: shooterId,
      visitedTunnels: new Set(),
      magnetAttractors: new Set(),
      isRedirected: false,
      fragments: [initialPublicFragment],
      logFragments: [initialLogFragment],
      segments: [],
      shotId,
      sourceId: shooterId
    }
  ];
  let processed = 0;
  const maxPaths = 50;

  while (queue.length && processed < maxPaths) {
    const ctx = queue.shift()!;
    processed++;
    runBulletPath(
      state,
      queue,
      ctx.targetId,
      ctx.previousTargetId,
      sourceType,
      ctx.visitedTunnels,
      ctx.magnetAttractors,
      ctx.isRedirected,
      ctx.fragments,
      ctx.logFragments,
      ctx.segments,
      ctx.shotId,
      ctx.sourceId
    );
  }

  finalizeBulletShot(state, shotId);
}

function runBulletPath(
  state: GameState,
  queue: BulletQueueEntry[],
  startTargetId: string,
  startPreviousTargetId: string | null,
  sourceType: BulletSource,
  visitedTunnels: Set<string>,
  magnetAttractors: Set<string>,
  wasRedirected: boolean,
  fragments: BulletFragment[],
  logFragments: BulletLogFragment[],
  segments: BulletAnimationSegment[],
  shotId: string,
  sourceId: string | null
) {
  let previousTargetId = startPreviousTargetId;
  let currentTargetId = startTargetId;
  let bounces = 0;
  let pathVisited = new Set(visitedTunnels);
  const magnetHistory = new Set(magnetAttractors);
  let redirected = wasRedirected;
  let currentFragments = fragments;
  let currentLogFragments = logFragments;
  let currentSegments = segments;
  let pendingMagnetDeadTarget: string | null = null;
  const isMafia = sourceType === 'MAFIA';
  const isSniper = sourceType === 'SNIPER';
  const isMatrix = sourceType === 'MATRIX';
  const isMadGunman = sourceType === 'MAD_GUNMAN';
  const slimeCanStopBullet = isMafia || isMadGunman || isSniper;

  const pushSharedFragment = (fragment: BulletFragment) => {
    currentFragments.push(fragment);
    const baseLogKey = LOG_FRAGMENT_MAP[fragment.key] ?? fragment.key;
    const useInitialKey = currentLogFragments.length === 1;
    const logKey = useInitialKey ? (LOG_FRAGMENT_FIRST_MAP[baseLogKey] ?? baseLogKey) : baseLogKey;
    currentLogFragments.push({
      key: logKey,
      params: fragment.params ? { ...fragment.params } : undefined
    });
  };

  const pushLogFragment = (fragment: BulletLogFragment) => {
    currentLogFragments.push(fragment);
  };

  while (bounces < 25) {
    bounces++;
    const cameFromId = previousTargetId;
    addTravelSegment(currentSegments, cameFromId, currentTargetId);
    const target = state.players.find(p => p.id === currentTargetId);
    const targetName = target?.name || '?';
    if (!target || !target.status.isAlive) {
      pushSharedFragment({ key: 'night_report_bullet_dead_target', params: { target: targetName } });
      if (pendingMagnetDeadTarget) {
        pushSharedFragment({ key: 'night_report_bullet_magnet_dead', params: { target: pendingMagnetDeadTarget } });
      }
      recordBulletReport(state, currentFragments, currentLogFragments, currentSegments, shotId, sourceId);
      return;
    }
    pendingMagnetDeadTarget = null;

    const matrixTrap = state.nightCache.matrixTrap;
    const matrixActive = matrixTrap && matrixTrap.playerId === target.id && target.cards.some(rr => rr.cardId === 'Matrix');
    if (matrixActive) {
      state.nightCache.matrixStoredBullets++;
      state.nightCache.reportData.matrixBulletsCaught++;
      pushSharedFragment({ key: 'night_report_bullet_matrix_catch', params: { target: targetName } });
      recordBulletReport(state, currentFragments, currentLogFragments, currentSegments, shotId, sourceId);
      return;
    }

    if (!isMatrix) {
      const neighbors = getNeighbors(state.players, currentTargetId);
      const tryMagnet = (magnetTarget: Player | null) => {
        if (!magnetTarget || !magnetTarget.status.isMagnetized || magnetHistory.has(magnetTarget.id)) {
          return false;
        }
        pushSharedFragment({ key: 'night_report_bullet_magnet', params: { target: magnetTarget.name } });
        magnetHistory.add(magnetTarget.id);
        previousTargetId = target.id;
        currentTargetId = magnetTarget.id;
        redirected = true;
        pendingMagnetDeadTarget = magnetTarget.name;
        return true;
      };

      if (tryMagnet(neighbors.left)) {
        continue;
      }
      if (tryMagnet(neighbors.right)) {
        continue;
      }

      const outgoing = state.globalTunnels
        .filter(t => t.sourceId === target.id && !pathVisited.has(t.id))
        .sort((a, b) => a.createdAt - b.createdAt);

      if (outgoing.length) {
        if (outgoing.length > 1) {
          pushSharedFragment({ key: 'night_report_bullet_split', params: { count: outgoing.length } });
        }
        const baseFragments = cloneFragments(currentFragments);
        const baseLogFragments = cloneFragments(currentLogFragments);
        const baseSegments = cloneSegments(currentSegments);
        const baseMagnetHistory = new Set(magnetHistory);
        const baseVisited = new Set(pathVisited);
        outgoing.forEach((tunnel, idx) => {
          const destination = state.players.find(p => p.id === tunnel.targetId);
          const updatedVisited = idx === 0 ? pathVisited : new Set(baseVisited);
          updatedVisited.add(tunnel.id);
          const branchFragments = idx === 0 ? currentFragments : cloneFragments(baseFragments);
          const branchLogFragments = idx === 0 ? currentLogFragments : cloneFragments(baseLogFragments);
          const branchSegments = idx === 0 ? currentSegments : cloneSegments(baseSegments);
          const branchMagnetHistory = idx === 0 ? magnetHistory : new Set(baseMagnetHistory);
          const tunnelIndex = state.globalTunnels.indexOf(tunnel);
          const tunnelNumber = typeof tunnel.tunnelNumber === 'number'
            ? tunnel.tunnelNumber
            : (tunnelIndex >= 0 ? tunnelIndex + 1 : idx + 1);
          const fragmentKey = outgoing.length > 1 ? 'night_report_bullet_tunnel_segment' : 'night_report_bullet_tunnel_single';
          const fragmentParams: Record<string, string | number> = {
            num: tunnelNumber,
            src: targetName,
            target: destination?.name || '?'
          };
          if (outgoing.length > 1) {
            fragmentParams.index = idx + 1;
          }
          branchFragments.push({ key: fragmentKey, params: fragmentParams });
          const baseLogKey = LOG_FRAGMENT_MAP[fragmentKey] ?? fragmentKey;
          const useInitialKeyForBranch = branchLogFragments.length === 1;
          const branchLogKey = useInitialKeyForBranch ? (LOG_FRAGMENT_FIRST_MAP[baseLogKey] ?? baseLogKey) : baseLogKey;
          branchLogFragments.push({ key: branchLogKey, params: fragmentParams });
          if (idx === 0) {
            pathVisited = updatedVisited;
            currentTargetId = tunnel.targetId;
            previousTargetId = target.id;
            redirected = true;
            currentFragments = branchFragments;
            currentLogFragments = branchLogFragments;
            currentSegments = branchSegments;
          } else {
            queue.push({
              targetId: tunnel.targetId,
              previousTargetId: target.id,
              visitedTunnels: updatedVisited,
              magnetAttractors: branchMagnetHistory,
              isRedirected: true,
              fragments: branchFragments,
              logFragments: branchLogFragments,
              segments: branchSegments,
              shotId,
              sourceId
            });
          }
        });
        continue;
      }
    }

    const mirrorCount = countCards(target, 'Mirror');
    const mirrorIntact = mirrorCount > 0;
    if (mirrorIntact) {
      const hadMud = target.status.mudCount > 0;
      if (hadMud) {
        target.status.mudCount = Math.max(0, target.status.mudCount - 1);
      }

      const mirrorInstance = consumeCardWithInstance(target, 'Mirror');
      registerGlazierMirrorBreak(state, target.id);
      const mirrorLabel = mirrorInstance ?? mirrorCount;
      pushSharedFragment({ key: 'night_report_bullet_mirror_break', params: { target: targetName, num: mirrorLabel } });

      if (!isSniper && !isMatrix && !hadMud) {
        const returnTargetId = cameFromId;
        const returnName = returnTargetId ? state.players.find(p => p.id === returnTargetId)?.name || '?' : targetName;
        pushSharedFragment({ key: 'night_report_bullet_return', params: { target: returnName } });
        if (!returnTargetId || returnTargetId === target.id) {
          recordBulletReport(state, currentFragments, currentLogFragments, currentSegments, shotId, sourceId);
          return;
        }
        currentTargetId = returnTargetId;
        previousTargetId = target.id;
        redirected = true;
        continue;
      }

      pushSharedFragment({ key: 'night_report_bullet_continue' });
      if (currentLogFragments.length) {
        currentLogFragments.pop();
      }
      const continueReasonKey = hadMud
        ? 'night_log_bullet_continue_mud'
        : isSniper
          ? 'night_log_bullet_continue_sniper'
          : 'night_log_bullet_continue_matrix';
      pushLogFragment({ key: continueReasonKey, params: { target: targetName } });
    }

    if (
      !isMatrix &&
      slimeCanStopBullet &&
      target.status.isSlimed &&
      !target.status.isSanded &&
      !state.nightCache.slimeUsedOnPlayers.includes(target.id)
    ) {
      state.nightCache.slimeUsedOnPlayers.push(target.id);
      target.status.isSlimed = false;
      pushSharedFragment({ key: 'night_report_bullet_slime', params: { target: targetName } });
      recordBulletReport(state, currentFragments, currentLogFragments, currentSegments, shotId, sourceId);
      return;
    }

    if (isMafia && !redirected && target.cards.some(rr => rr.cardId === 'AlCapone')) {
      pushSharedFragment({ key: 'night_report_bullet_al_capone', params: { target: targetName } });
      recordBulletReport(state, currentFragments, currentLogFragments, currentSegments, shotId, sourceId);
      return;
    }

    if (!isMatrix && consumeDoctorProtection(state, target.id)) {
      pushSharedFragment({ key: 'night_report_bullet_doctor', params: { target: targetName } });
      recordBulletReport(state, currentFragments, currentLogFragments, currentSegments, shotId, sourceId);
      return;
    }

    const kevlarInstance = consumeCardWithInstance(target, 'KevlarVest');
    if (kevlarInstance !== null) {
      pushSharedFragment({ key: 'night_report_bullet_vest_loss', params: { target: targetName, num: kevlarInstance } });
      recordBulletReport(state, currentFragments, currentLogFragments, currentSegments, shotId, sourceId);
      return;
    }

    const cloudwalkerInstance = consumeCardWithInstance(target, 'CloudWalker');
    if (cloudwalkerInstance !== null) {
      registerCloudwalkerLoss(state);
      pushSharedFragment({ key: 'night_report_bullet_cloudwalker_loss', params: { target: targetName, num: cloudwalkerInstance } });
      checkLifeLossSideEffects(state, target, {
        lossType: 'CLOUDWALKER',
        lostInstance: cloudwalkerInstance,
        logAppender: fragment => pushLogFragment(fragment)
      });
      recordBulletReport(state, currentFragments, currentLogFragments, currentSegments, shotId, sourceId);
      return;
    }

    target.status.isAlive = false;
    checkLifeLossSideEffects(state, target, {
      lossType: 'DEATH',
      logAppender: fragment => pushLogFragment(fragment)
    });
    pushSharedFragment({ key: 'night_report_bullet_death', params: { name: targetName } });
    declareVictory(state, 'NIGHT');
    recordBulletReport(state, currentFragments, currentLogFragments, currentSegments, shotId, sourceId);
    return;
  }
}

function isPlayerMafianLocal(player: Player): boolean {
  return player.cards.some(card => card.cardId === 'Mafia');
}

function determineVictorySide(state: GameState): VictorySide | null {
  const alive = state.players.filter(p => p.status.isAlive);
  if (!alive.length) {
    return null;
  }
  const mafiaAlive = alive.filter(isPlayerMafianLocal).length;
  if (mafiaAlive === 0) {
    return 'INNOCENT';
  }
  if (mafiaAlive === alive.length) {
    return 'MAFIA';
  }
  return null;
}

function declareVictory(state: GameState, cause: VictoryCause): VictorySide | null {
  if (state.victory) {
    return state.victory.side;
  }
  const side = determineVictorySide(state);
  if (!side) {
    return null;
  }
  const key = side === 'MAFIA' ? 'win_mafia' : 'win_innocent';
  state.victory = { side, cause, announced: false };
  if (cause === 'NIGHT') {
    state.nightCache.reportData.victoryKey = key;
  } else {
    state.uiState.pendingVictoryKey = key;
  }
  return side;
}

function findHighestAliveCardInstance(players: Player[], cardId: CardId): { player: Player; instance: number } | null {
  let best: { player: Player; instance: number } | null = null;
  players.forEach(player => {
    if (!player.status.isAlive) return;
    player.cards.forEach(card => {
      if (card.cardId !== cardId) return;
      if (!best || card.instance > best.instance) {
        best = { player, instance: card.instance };
      }
    });
  });
  return best;
}

function resolveShooterEntries(state: GameState, entries: ShooterQueuedShot[], sourceType: 'MAD_GUNMAN' | 'SNIPER') {
  const sorted = [...entries].sort((a, b) => a.instance - b.instance);
  sorted.forEach(entry => {
    const shooter = state.players.find(p => p.id === entry.shooterId);
    if (!shooter || shooter.status.isJailed) {
      return;
    }
    const targetName = state.players.find(p => p.id === entry.targetId)?.name || 'Unknown';
    const cardId: CardId = sourceType === 'SNIPER' ? 'Sniper' : 'MadGunman';
    const shooterLabel = createCardLabelParam(cardId, entry.instance);
    resolveNightShot(state, entry.targetId, sourceType, shooter.id, {
      shooterLabel,
      shooterName: shooter.name,
      initialTargetName: targetName
    });
  });
}

export function processNightShotQueue(state: GameState) {
  const queue = state.nightCache.pendingShots;
  if (queue.mafiaVotes?.length) {
    const aliveMafia = state.players.filter(player =>
      player.status.isAlive && player.cards.some(card => card.cardId === 'Mafia')
    );
    const aliveIds = aliveMafia.map(p => p.id);
    const relevantVotes = queue.mafiaVotes.filter(entry => aliveIds.includes(entry.shooterId));
    const everyoneVoted = aliveIds.every(id => relevantVotes.some(entry => entry.shooterId === id));
    const uniqueTargets = new Set(relevantVotes.map(entry => entry.targetId));
    const consensusTargetId = aliveMafia.length > 0 && everyoneVoted && uniqueTargets.size === 1
      ? relevantVotes[0]?.targetId ?? null
      : null;

    if (consensusTargetId) {
      const shooterInfo = findHighestAliveCardInstance(state.players, 'Mafia');
      if (shooterInfo) {
        const { player, instance } = shooterInfo;
        if (player.status.isJailed) {
          log(state, 'log_mafia_jailed', {
            cardLabel: createCardLabelParam('Mafia', instance),
            player: player.name
          });
        } else {
          const targetName = state.players.find(p => p.id === consensusTargetId)?.name || 'Unknown';
          const cardLabel = createCardLabelParam('Mafia', instance);
          resolveNightShot(state, consensusTargetId, 'MAFIA', player.id, {
            shooterLabel: cardLabel,
            shooterName: player.name,
            initialTargetName: targetName
          });
        }
      }
    } else if (aliveMafia.length > 0) {
      const jailedMafia = aliveMafia.filter(player => player.status.isJailed);
      if (jailedMafia.length > 0) {
        const highest = findHighestAliveCardInstance(jailedMafia, 'Mafia');
        if (highest) {
          const { player, instance } = highest;
          log(state, 'log_mafia_jailed', {
            cardLabel: createCardLabelParam('Mafia', instance),
            player: player.name
          });
        }
      } else {
        log(state, 'log_mafia_no_consensus');
      }
    }

    queue.mafiaVotes = [];
  }

  if (queue.madGunman.length > 0) {
    resolveShooterEntries(state, queue.madGunman, 'MAD_GUNMAN');
    queue.madGunman = [];
  }
  if (queue.sniper.length > 0) {
    resolveShooterEntries(state, queue.sniper, 'SNIPER');
    queue.sniper = [];
  }
}

function applyToxicEffect(state: GameState, victim: Player | null): PublicReportSockOutcome {
  if (!victim || !victim.status.isAlive) return 'ALREADY_DEAD';
  if (victim.hasGasMask) {
    return 'GAS_MASK';
  }
  if (consumeDoctorProtection(state, victim.id)) {
    return 'DOCTOR';
  }
  const cloudwalkerInstance = consumeCardWithInstance(victim, 'CloudWalker');
  if (cloudwalkerInstance !== null) {
    registerCloudwalkerLoss(state);
    checkLifeLossSideEffects(state, victim, { lossType: 'CLOUDWALKER' });
    return 'CLOUDWALKER';
  }
  consumeAllCards(victim, 'CloudWalker');
  victim.status.isAlive = false;
  checkLifeLossSideEffects(state, victim, { lossType: 'DEATH' });
  declareVictory(state, 'NIGHT');
  return 'DEATH';
}

export function processSockToxicity(state: GameState) {
  if (!state.nightCache.pendingToxicSocks.length) return;
  const reportData = state.nightCache.reportData;
  state.nightCache.pendingToxicSocks.forEach(entry => {
    const sockPlayer = state.players.find(p => p.id === entry.sockId);
    if (!sockPlayer || !sockPlayer.status.isAlive) return;
    reportData.sock.usedBy = entry.sockId;
    const firstTarget = state.players.find(p => p.id === entry.firstTargetId) || null;
    const secondTarget = state.players.find(p => p.id === entry.secondTargetId) || null;
    const firstResult = applyToxicEffect(state, firstTarget);
    const secondResult = applyToxicEffect(state, secondTarget);
    reportData.sock.first = { targetId: firstTarget?.id, result: firstResult };
    reportData.sock.second = { targetId: secondTarget?.id, result: secondResult };
    const fragments = buildSockLogFragments(sockPlayer, firstTarget, secondTarget, firstResult, secondResult);
    if (fragments.length) {
      const text = renderLogFragments(fragments, state.players, state.settings.language);
      const type: GameLog['type'] = firstResult === 'DEATH' || secondResult === 'DEATH' ? 'DEATH' : 'ACTION';
      state.logs.push({
        id: Math.random().toString(),
        timestamp: Date.now(),
        phase: state.phase,
        round: state.currentRound,
        text,
        translationFragments: fragments,
        type
      });
    }
  });
  state.nightCache.pendingToxicSocks = [];
}

const SOCK_LOG_RESULT_MAP: Record<PublicReportSockOutcome, string> = {
  GAS_MASK: 'log_sock_result_gasmask',
  ALREADY_DEAD: 'log_sock_result_dead',
  DOCTOR: 'log_sock_result_doctor',
  CLOUDWALKER: 'log_sock_result_cloudwalker',
  DEATH: 'log_sock_result_death'
};

function buildSockLogFragments(
  sockPlayer: Player,
  firstTarget: Player | null,
  secondTarget: Player | null,
  firstResult: PublicReportSockOutcome,
  secondResult: PublicReportSockOutcome
): LogMessageFragment[] {
  const fragments: LogMessageFragment[] = [];
  const sockInstance = sockPlayer.cards.find(card => card.cardId === 'Sock')?.instance;
  fragments.push({
    key: 'log_sock_throw_intro',
    params: {
      cardLabel: createCardLabelParam('Sock', sockInstance),
      player: sockPlayer.name,
      first: firstTarget?.name || '?',
      second: secondTarget?.name || '?'
    }
  });
  const firstFragment = buildSockLogResultFragment(firstResult, firstTarget);
  if (firstFragment) {
    fragments.push(firstFragment);
  }
  const secondFragment = buildSockLogResultFragment(secondResult, secondTarget);
  if (secondFragment) {
    fragments.push(secondFragment);
  }
  return fragments;
}

function buildSockLogResultFragment(
  result: PublicReportSockOutcome,
  target: Player | null
): LogMessageFragment | null {
  const key = SOCK_LOG_RESULT_MAP[result];
  if (!key) return null;
  return {
    key,
    params: { name: target?.name || '?' }
  };
}

type LifeLossContext = {
  lossType?: 'CLOUDWALKER' | 'DEATH';
  logAppender?: (fragment: BulletFragment) => void;
  lostInstance?: number;
};

function checkLifeLossSideEffects(state: GameState, victim: Player, context: LifeLossContext = {}) {
  const { lossType = 'DEATH', logAppender, lostInstance } = context;
  markLeechLinkTriggered(state, victim.id);
  const isCloudwalkerLoss = lossType === 'CLOUDWALKER';

  if (isCloudwalkerLoss && victim.cards.some(rr => rr.cardId === 'Gandalf') && !state.nightCache.kuskonaTriggered) {
    const k = state.players.find(p => p.cards.some(rr => rr.cardId === 'HorsePiece'));
    if (k && k.status.isAlive) {
      const instance = grantCardInstance(state.players, k, 'CloudWalker');
      state.nightCache.reportData.cloudwalkers.horsepiece.push(instance);
      const horseInstance = k.cards.find(card => card.cardId === 'HorsePiece')?.instance;
      if (!logAppender) {
        log(state, 'night_log_horsepiece_cloudwalker', {
          cardLabel: createCardLabelParam('HorsePiece', horseInstance),
          player: k.name,
          num: instance
        });
      }
      if (logAppender) {
        logAppender({
          key: 'night_log_bullet_horsepiece_from_gandalf',
          params: {
            horse: k.name,
            num: instance,
            gandalf: victim.name,
            lost: lostInstance ?? '?'
          }
        });
      }
      state.nightCache.kuskonaTriggered = true;
    }
  }
  if (isCloudwalkerLoss && victim.cards.some(rr => rr.cardId === 'HorsePiece') && !state.nightCache.gandalfTriggered) {
    const g = state.players.find(p => p.cards.some(rr => rr.cardId === 'Gandalf'));
    if (g && g.status.isAlive) {
      const instance = grantCardInstance(state.players, g, 'CloudWalker');
      state.nightCache.reportData.cloudwalkers.gandalf.push(instance);
      const gandalfInstance = g.cards.find(card => card.cardId === 'Gandalf')?.instance;
      if (!logAppender) {
        log(state, 'night_log_gandalf_cloudwalker', {
          cardLabel: createCardLabelParam('Gandalf', gandalfInstance),
          player: g.name,
          num: instance
        });
      }
      if (logAppender) {
        logAppender({
          key: 'night_log_bullet_gandalf_from_horse',
          params: {
            gandalf: g.name,
            num: instance,
            horse: victim.name,
            lost: lostInstance ?? '?'
          }
        });
      }
      state.nightCache.gandalfTriggered = true;
    }
  }
}

type FragmentParams = Record<string, unknown>;

function cloneFragments<T extends { key: string; params?: FragmentParams }>(fragments: T[]): T[] {
  return fragments.map(fragment => {
    if (!fragment.params) {
      return { ...fragment } as T;
    }
    const clonedParams: FragmentParams = {};
    Object.entries(fragment.params).forEach(([key, value]) => {
      if (value && typeof value === 'object' && !Array.isArray(value)) {
        clonedParams[key] = { ...(value as FragmentParams) };
      } else if (Array.isArray(value)) {
        clonedParams[key] = [...value];
      } else {
        clonedParams[key] = value;
      }
    });
    return { ...fragment, params: clonedParams } as T;
  });
}

function cloneSegments(segments: BulletAnimationSegment[]): BulletAnimationSegment[] {
  return segments.map(segment => ({
    fromId: segment.fromId,
    toId: segment.toId
  }));
}

function addTravelSegment(segments: BulletAnimationSegment[], fromId: string | null, toId: string | null) {
  if (!toId) return;
  if (fromId && fromId === toId) return;
  segments.push({ fromId: fromId ?? null, toId });
}

function fragmentParamEqual(valueA: unknown, valueB: unknown): boolean {
  if (valueA === valueB) {
    return true;
  }
  if (typeof valueA !== typeof valueB || valueA === null || valueB === null) {
    return false;
  }
  if (Array.isArray(valueA) && Array.isArray(valueB)) {
    if (valueA.length !== valueB.length) {
      return false;
    }
    return valueA.every((entry, idx) => fragmentParamEqual(entry, valueB[idx]));
  }
  if (typeof valueA === 'object' && typeof valueB === 'object') {
    const objA = valueA as Record<string, unknown>;
    const objB = valueB as Record<string, unknown>;
    const keysA = Object.keys(objA);
    const keysB = Object.keys(objB);
    if (keysA.length !== keysB.length) {
      return false;
    }
    return keysA.every(key => fragmentParamEqual(objA[key], objB[key]));
  }
  return false;
}

function fragmentsEqual(a: { key: string; params?: FragmentParams }, b: { key: string; params?: FragmentParams }): boolean {
  if (a.key !== b.key) return false;
  const paramsA = a.params ?? {};
  const paramsB = b.params ?? {};
  const keysA = Object.keys(paramsA);
  const keysB = Object.keys(paramsB);
  if (keysA.length !== keysB.length) return false;
  return keysA.every(key => fragmentParamEqual(paramsA[key], paramsB[key]));
}

function mergeFragmentSequences<T extends { key: string; params?: FragmentParams }>(existing: T[], addition: T[]): T[] {
  let prefix = 0;
  while (
    prefix < existing.length &&
    prefix < addition.length &&
    fragmentsEqual(existing[prefix], addition[prefix])
  ) {
    prefix++;
  }
  if (prefix >= addition.length) {
    return existing;
  }
  return [...existing, ...addition.slice(prefix)];
}

function composeBulletText(state: GameState, fragments: BulletLogFragment[]): string {
  return renderLogFragments(fragments, state.players, state.settings.language);
}

function recordBulletReport(
  state: GameState,
  fragments: BulletFragment[],
  logFragments: BulletLogFragment[],
  segments: BulletAnimationSegment[],
  shotId: string,
  sourceId: string | null
) {
  if (!fragments.length) return;
  const publicClone = cloneFragments(fragments);
  const logClone = cloneFragments(logFragments);
  const lookup = state.nightCache.bulletReportLookup ?? (state.nightCache.bulletReportLookup = {});
  const existingEntry = lookup[shotId];
  if (existingEntry) {
    existingEntry.publicEntry.fragments = mergeFragmentSequences(existingEntry.publicEntry.fragments ?? [], publicClone);
    existingEntry.logFragments = mergeFragmentSequences(existingEntry.logFragments, logClone);
  } else {
    const entry = {
      key: 'night_report_bullet_compound',
      fragments: publicClone
    };
    state.nightCache.reportData.bullets.push(entry);
    lookup[shotId] = {
      publicEntry: entry,
      logFragments: logClone
    };
  }
  if (!segments.length) {
    return;
  }
  const entrySegments = cloneSegments(segments);
  if (!state.nightCache.bulletAnimations) {
    state.nightCache.bulletAnimations = [];
  }
  state.nightCache.bulletAnimations.push({
    id: `bullet-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    shotId,
    sourceId,
    segments: entrySegments
  });
}

function finalizeBulletShot(state: GameState, shotId: string) {
  if (!state.nightCache.bulletReportLookup) {
    state.nightCache.bulletReportLookup = {};
  }
  const entry = state.nightCache.bulletReportLookup[shotId];
  if (!entry || !entry.logFragments.length) {
    delete state.nightCache.bulletReportLookup[shotId];
    return;
  }
  const clonedFragments = cloneFragments(entry.logFragments);
  const text = composeBulletText(state, clonedFragments);
  const hasDeath = entry.logFragments.some(fragment => fragment.key === 'night_report_bullet_death');
  state.logs.push({
    id: Math.random().toString(),
    timestamp: Date.now(),
    phase: state.phase,
    round: state.currentRound,
    text,
    translationFragments: clonedFragments,
    type: hasDeath ? 'DEATH' : 'ACTION'
  });
  delete state.nightCache.bulletReportLookup[shotId];
}