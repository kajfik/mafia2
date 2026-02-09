import type {
  CloudwalkerReward,
  GameState,
  PublicReportEntry,
  PublicReportData,
  PublicReportFragment,
  PublicReportSockOutcome,
  SockReportOutcome,
  LogParamMap
} from './types';
import { createCardLabelParam } from './logging';

export function createPublicReportData(): PublicReportData {
  return {
    ghostTargets: [],
    judgeTargets: [],
    slimedTargets: [],
    sandedTargets: [],
    sandProtectedTargets: [],
    matrixBulletsCaught: 0,
    sock: { usedBy: null },
    cloudwalkers: {
      leech: [],
      cobra: [],
      gravedigger: [],
      glazier: [],
      gandalf: [],
      horsepiece: []
    },
    bullets: [],
    victoryKey: null
  };
}

const SOCK_FIRST_MAP: Record<PublicReportSockOutcome, string> = {
  GAS_MASK: 'public_report_sock_first_gasmask',
  ALREADY_DEAD: 'public_report_sock_first_dead',
  DOCTOR: 'public_report_sock_first_doctor',
  CLOUDWALKER: 'public_report_sock_first_cloudwalker',
  DEATH: 'public_report_sock_first_death'
};

const SOCK_SECOND_MAP: Record<PublicReportSockOutcome, string> = {
  GAS_MASK: 'public_report_sock_second_gasmask',
  ALREADY_DEAD: 'public_report_sock_second_dead',
  DOCTOR: 'public_report_sock_second_doctor',
  CLOUDWALKER: 'public_report_sock_second_cloudwalker',
  DEATH: 'public_report_sock_second_death'
};

export function buildPublicReportEntries(state: GameState): PublicReportEntry[] {
  const entries: PublicReportEntry[] = [];
  if (!state.nightCache.reportData) {
    state.nightCache.reportData = createPublicReportData();
  }
  const data = state.nightCache.reportData;
  const nameOf = (id?: string) => id ? state.players.find(p => p.id === id)?.name : undefined;
  const uniqueIds = (ids: string[]) => Array.from(new Set(ids));
  const uniqueNums = (values: number[]) => Array.from(new Set(values));
  const uniqueRewards = (rewards: CloudwalkerReward[]) => {
    const seen = new Set<number>();
    return rewards.filter(reward => {
      if (seen.has(reward.num)) {
        return false;
      }
      seen.add(reward.num);
      return true;
    });
  };
  const countOccurrences = (values: string[]) => {
    return values.reduce<Record<string, number>>((acc, value) => {
      acc[value] = (acc[value] ?? 0) + 1;
      return acc;
    }, {});
  };

  entries.push({ key: 'public_report_default' });

  uniqueIds(data.ghostTargets).forEach(id => {
    const name = nameOf(id);
    if (name) entries.push({ key: 'public_report_ghost_bobo', params: { name } });
  });

  uniqueIds(data.judgeTargets).forEach(id => {
    const name = nameOf(id);
    if (name) entries.push({ key: 'public_report_judge', params: { name } });
  });

  const slimeCounts = countOccurrences(data.slimedTargets);
  Object.entries(slimeCounts).forEach(([id, count]) => {
    const name = nameOf(id);
    if (!name) return;
    if (count === 1) {
      entries.push({ key: 'public_report_slime', params: { name } });
    } else {
      entries.push({ key: 'public_report_slime_multi', params: { name, count } });
    }
  });

  uniqueIds(data.sandedTargets).forEach(id => {
    const name = nameOf(id);
    if (name) entries.push({ key: 'public_report_sand', params: { name } });
  });

  if (data.sandProtectedTargets.length) {
    data.sandProtectedTargets.forEach(() => entries.push({ key: 'public_report_sand_saved' }));
  }

  if (data.matrixBulletsCaught > 0) {
    entries.push({ key: 'public_report_matrix', params: { count: data.matrixBulletsCaught } });
  }

  if (data.bullets.length) {
    const matrixBullets = data.bullets.filter(entry => entry.isMatrixShot);
    const normalBullets = data.bullets.filter(entry => !entry.isMatrixShot);
    entries.push(...shuffleEntries(normalBullets), ...matrixBullets);
  }

  if (data.sock.usedBy) {
    const fragments: PublicReportFragment[] = [{ key: 'public_report_sock_used' }];
    const firstFragment = buildSockFragment('first', data.sock.first, nameOf);
    const secondFragment = buildSockFragment('second', data.sock.second, nameOf);
    if (firstFragment) {
      fragments.push(firstFragment);
      if (secondFragment) {
        fragments.push(secondFragment);
      } else {
        fragments.push({ key: 'public_report_sock_first_only_suffix' });
      }
    }
    entries.push({ key: 'public_report_sock_used', fragments });
  }

  uniqueNums(data.cloudwalkers.leech).forEach(num => {
    entries.push({ key: 'public_report_leech_cloudwalker', params: { num } });
  });

  uniqueNums(data.cloudwalkers.cobra).forEach(num => {
    entries.push({ key: 'public_report_cobra_cloudwalker', params: { num } });
  });

  uniqueRewards(data.cloudwalkers.gravedigger).forEach(({ num, cardInstance }) => {
    entries.push({
      key: 'public_report_cloudwalker_gain',
      params: { num, cardLabel: createCardLabelParam('Gravedigger', cardInstance) }
    });
  });

  uniqueNums(data.cloudwalkers.glazier).forEach(num => {
    entries.push({ key: 'public_report_glazier_mirror', params: { num } });
  });

  uniqueRewards(data.cloudwalkers.gandalf).forEach(({ num, cardInstance }) => {
    entries.push({
      key: 'public_report_cloudwalker_gain',
      params: { num, cardLabel: createCardLabelParam('Gandalf', cardInstance) }
    });
  });

  uniqueRewards(data.cloudwalkers.horsepiece).forEach(({ num, cardInstance }) => {
    entries.push({
      key: 'public_report_cloudwalker_gain',
      params: { num, cardLabel: createCardLabelParam('HorsePiece', cardInstance) }
    });
  });

  if (data.victoryKey) {
    entries.push({ key: data.victoryKey });
  }

  return entries;
}

function buildSockFragment(
  position: 'first' | 'second',
  outcome: SockReportOutcome | undefined,
  nameOf: (id?: string) => string | undefined
): PublicReportFragment | null {
  if (!outcome) return null;
  const map = position === 'first' ? SOCK_FIRST_MAP : SOCK_SECOND_MAP;
  const key = map[outcome.result];
  if (!key) return null;
  const needsName = outcome.result === 'DEATH' || outcome.result === 'CLOUDWALKER';
  if (!needsName) {
    return { key };
  }
  const name = nameOf(outcome.targetId) || '?';
  const params: LogParamMap = { name };
  if (outcome.result === 'CLOUDWALKER') {
    params.num = outcome.cloudwalkerInstance ?? '?';
  }
  return { key, params };
}

function shuffleEntries<T>(list: T[]): T[] {
  const copy = [...list];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}
