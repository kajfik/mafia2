import type { GameState, CardId, ActiveCardInstance, NightCardMode } from './types';

type NightScheduleEntry = {
  cardId: CardId;
  mode?: NightCardMode;
};

const EVEN_NIGHT_SCHEDULE: NightScheduleEntry[] = [
  { cardId: 'Jailer' },
  { cardId: 'Gravedigger' },
  { cardId: 'Matrix' },
  { cardId: 'Mage' },
  { cardId: 'Slime' },
  { cardId: 'Leech' },
  { cardId: 'Sand' },
  { cardId: 'Cobra' },
  { cardId: 'Magnet' },
  { cardId: 'GhostBobo' },
  { cardId: 'Doctor' },
  { cardId: 'SwampMonster' },
  { cardId: 'Mafia' },
  { cardId: 'MadGunman' },
  { cardId: 'Sniper' },
  { cardId: 'Sock' },
  { cardId: 'Judge' },
  { cardId: 'BlindExecutioner' },
  { cardId: 'Matrix', mode: 'MATRIX_SHOT' }
];

const ODD_NIGHT_SCHEDULE: NightScheduleEntry[] = [
  { cardId: 'Gravedigger' },
  { cardId: 'Matrix' },
  { cardId: 'Mage' },
  { cardId: 'Slime' },
  { cardId: 'Leech' },
  { cardId: 'Sand' },
  { cardId: 'Doctor' },
  { cardId: 'SwampMonster' },
  { cardId: 'Mafia' },
  { cardId: 'Sniper' },
  { cardId: 'Sock' },
  { cardId: 'BlindExecutioner' },
  { cardId: 'Matrix', mode: 'MATRIX_SHOT' }
];

function shouldWakeSpyglass(round: number): boolean {
  if (round < 2) return false;
  return (round - 2) % 3 === 0;
}

function collectInstances(state: GameState, cardId: CardId, mode?: NightCardMode): ActiveCardInstance[] {
  const alivePlayers = state.players.filter(p => p.status.isAlive);
  return alivePlayers
    .flatMap(p =>
      p.cards
        .filter(r => r.cardId === cardId)
        .map(r => ({ cardId, instance: r.instance, mode }))
    )
    .sort((a, b) => a.instance - b.instance);
}

function collectGravediggerActivations(state: GameState): ActiveCardInstance[] {
  const alivePlayers = state.players.filter(p => p.status.isAlive && !p.status.gravediggerUsed);
  return alivePlayers
    .flatMap(p =>
      p.cards
        .filter(r => r.cardId === 'Gravedigger')
        .map(r => ({ cardId: 'Gravedigger', instance: r.instance }) as ActiveCardInstance)
    )
    .sort((a, b) => a.instance - b.instance);
}

function collectMatrixActivations(state: GameState): ActiveCardInstance[] {
  const alivePlayers = state.players.filter(p => p.status.isAlive && !p.status.matrixAbilityUsed);
  return alivePlayers
    .flatMap(p =>
      p.cards
        .filter(r => r.cardId === 'Matrix')
        .map<ActiveCardInstance>(r => ({ cardId: 'Matrix', instance: r.instance }))
    )
    .sort((a, b) => a.instance - b.instance);
}

function collectMatrixShotInstance(state: GameState): ActiveCardInstance[] {
  if (state.nightCache.matrixStoredBullets <= 0) {
    return [];
  }
  const trap = state.nightCache.matrixTrap;
  if (!trap) return [];
  const owner = state.players.find(p => p.id === trap.playerId && p.status.isAlive);
  if (!owner) return [];
  const hasCard = owner.cards.some(r => r.cardId === 'Matrix' && r.instance === trap.instance);
  if (!hasCard) return [];
  const shot: ActiveCardInstance = { cardId: 'Matrix', instance: trap.instance, mode: 'MATRIX_SHOT' };
  return [shot];
}

export function buildNightCardInstanceOrder(state: GameState): ActiveCardInstance[] {
  const schedule = (state.currentRound % 2 === 0) ? EVEN_NIGHT_SCHEDULE : ODD_NIGHT_SCHEDULE;
  const result: ActiveCardInstance[] = [];

  schedule.forEach(entry => {
    if (entry.cardId === 'Matrix' && entry.mode !== 'MATRIX_SHOT') {
      result.push(...collectMatrixActivations(state));
      return;
    }
    if (entry.mode === 'MATRIX_SHOT') {
      result.push(...collectMatrixShotInstance(state));
      return;
    }
    if (entry.cardId === 'Gravedigger') {
      result.push(...collectGravediggerActivations(state));
      return;
    }
    result.push(...collectInstances(state, entry.cardId, entry.mode));
  });

  if (shouldWakeSpyglass(state.currentRound)) {
    result.push(...collectInstances(state, 'Spyglass'));
  }

  return result;
}
