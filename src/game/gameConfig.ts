import type { CardId } from './types';

interface CardConfig {
  id: CardId;
  defaultAmount: number;
  nightOrder: number; // -1 = Does not wake up
}

export const CARDS_CONFIG: Record<CardId, CardConfig> = {
  CloudWalker: { id: 'CloudWalker', defaultAmount: 7, nightOrder: -1 },
  Immunity: { id: 'Immunity', defaultAmount: 2, nightOrder: -1 },
  RopeWalker: { id: 'RopeWalker', defaultAmount: 3, nightOrder: -1 },
  KevlarVest: { id: 'KevlarVest', defaultAmount: 2, nightOrder: -1 },
  Matrix: { id: 'Matrix', defaultAmount: 1, nightOrder: 2 },
  Jailer: { id: 'Jailer', defaultAmount: 1, nightOrder: 0 },
  Gravedigger: { id: 'Gravedigger', defaultAmount: 1, nightOrder: 1 },
  Mage: { id: 'Mage', defaultAmount: 3, nightOrder: 3 },
  Slime: { id: 'Slime', defaultAmount: 2, nightOrder: 6 },
  Leech: { id: 'Leech', defaultAmount: 1, nightOrder: 8 },
  Sand: { id: 'Sand', defaultAmount: 1, nightOrder: 9 },
  Cobra: { id: 'Cobra', defaultAmount: 1, nightOrder: 10 },
  Magnet: { id: 'Magnet', defaultAmount: 1, nightOrder: 11 },
  GhostBobo: { id: 'GhostBobo', defaultAmount: 1, nightOrder: 12 },
  Doctor: { id: 'Doctor', defaultAmount: 1, nightOrder: 13 },
  SwampMonster: { id: 'SwampMonster', defaultAmount: 1, nightOrder: 14 },
  Mafia: { id: 'Mafia', defaultAmount: 3, nightOrder: 15 },
  MadGunman: { id: 'MadGunman', defaultAmount: 2, nightOrder: 18 },
  Sniper: { id: 'Sniper', defaultAmount: 1, nightOrder: 20 },
  Sock: { id: 'Sock', defaultAmount: 1, nightOrder: 21 },
  Judge: { id: 'Judge', defaultAmount: 1, nightOrder: 22 },
  BlindExecutioner: { id: 'BlindExecutioner', defaultAmount: 1, nightOrder: 23 },
  Spyglass: { id: 'Spyglass', defaultAmount: 1, nightOrder: 24 },
  
  // Passives
  Mirror: { id: 'Mirror', defaultAmount: 5, nightOrder: -1 },
  Terrorist: { id: 'Terrorist', defaultAmount: 1, nightOrder: -1 },
  Astronomer: { id: 'Astronomer', defaultAmount: 1, nightOrder: -1 },
  Meciar: { id: 'Meciar', defaultAmount: 1, nightOrder: -1 },
  Kovac: { id: 'Kovac', defaultAmount: 1, nightOrder: -1 },
  AlCapone: { id: 'AlCapone', defaultAmount: 1, nightOrder: -1 },
  Gandalf: { id: 'Gandalf', defaultAmount: 1, nightOrder: -1 },
  HorsePiece: { id: 'HorsePiece', defaultAmount: 1, nightOrder: -1 },
  Atheist: { id: 'Atheist', defaultAmount: 1, nightOrder: -1 },
  Anarchist: { id: 'Anarchist', defaultAmount: 1, nightOrder: -1 },
  Glazier: { id: 'Glazier', defaultAmount: 1, nightOrder: -1 },
  MassMurderer: { id: 'MassMurderer', defaultAmount: 1, nightOrder: -1 },
  Communist: { id: 'Communist', defaultAmount: 1, nightOrder: -1 },
  TimeLord: { id: 'TimeLord', defaultAmount: 1, nightOrder: -1 },
};

