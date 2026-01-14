import type { GameState } from './types';

type DoctorRulesState = GameState['doctorRules'];

export function createDoctorRules(): DoctorRulesState {
  return { selfHealOffset: Math.random() < 0.5 ? 1 : 2 };
}

function getDoctorSelfHealOffset(state: GameState): 1 | 2 {
  return state.doctorRules?.selfHealOffset ?? 1;
}

export function canDoctorSelfHealThisNight(state: GameState): boolean {
  if (state.currentRound <= 0) return false;
  const offset = getDoctorSelfHealOffset(state);
  if (state.currentRound < offset) return false;
  return ((state.currentRound - offset) % 3) === 0;
}
