export type Language = 'pl' | 'pl_pn' | 'cz' | 'en';

export type VictorySide = 'MAFIA' | 'INNOCENT';
export type VictoryCause = 'NIGHT' | 'DAY';

// English Card Names for Code Clarity
export type CardId = 
  | 'CloudWalker'     // mrakoszlap
  | 'Immunity'        // imunita
  | 'RopeWalker'      // prowazochodec
  | 'KevlarVest'      // neprustrzelnoWesta
  | 'Matrix'
  | 'Jailer'
  | 'Mage'            // mag
  | 'Slime'           // slina
  | 'Leech'           // pijavica
  | 'Sand'            // piosek
  | 'Cobra'
  | 'Magnet'
  | 'Sock'            // fusekla
  | 'GhostBobo'       // duchBobo
  | 'Mafia'
  | 'MadGunman'       // szilenyStrzelec
  | 'Sniper'
  | 'Mirror'          // zwierciadlo
  | 'Terrorist'
  | 'Astronomer'
  | 'Meciar'
  | 'Kovac'
  | 'AlCapone'
  | 'Gandalf'
  | 'HorsePiece'      // kusKona
  | 'Atheist'
  | 'Anarchist'
  | 'Glazier'         // szklorz
  | 'MassMurderer'    // masowyZabijak
  | 'Judge'           // soudce
  | 'BlindExecutioner'// slepyKat
  | 'Communist'
  | 'Spyglass'        // luneta
  | 'Gravedigger'     // grabarz
  | 'TimeLord'        // panCzasu
  | 'Doctor'
  | 'SwampMonster';   // jozinZBazin

export const CARD_IDS: CardId[] = [
  'CloudWalker',
  'Immunity',
  'RopeWalker',
  'KevlarVest',
  'Matrix',
  'Jailer',
  'Mage',
  'Slime',
  'Leech',
  'Sand',
  'Cobra',
  'Magnet',
  'Sock',
  'GhostBobo',
  'Mafia',
  'MadGunman',
  'Sniper',
  'Mirror',
  'Terrorist',
  'Astronomer',
  'Meciar',
  'Kovac',
  'AlCapone',
  'Gandalf',
  'HorsePiece',
  'Atheist',
  'Anarchist',
  'Glazier',
  'MassMurderer',
  'Judge',
  'BlindExecutioner',
  'Communist',
  'Spyglass',
  'Gravedigger',
  'TimeLord',
  'Doctor',
  'SwampMonster'
];

export type GamePhase = 'SETUP' | 'NIGHT_ANNOUNCEMENT' | 'NIGHT_ACTIVE' | 'NIGHT_REPLAY' | 'DAY_ANNOUNCEMENT' | 'DAY_MAIN' | 'GAME_OVER';

export type NightCardMode = 'DEFAULT' | 'MATRIX_SHOT';

export type DoctorHealMode = 'SELF' | 'OTHER';

export type DoctorRules = {
  selfHealOffset: 1 | 2;
};

export interface PlayerCard {
  cardId: CardId;
  instance: number;
}

export interface PlayerStatus {
  isAlive: boolean;
  isJailed: boolean;
  isSilenced: boolean;     // Zakaz mowienia
  isCantVote: boolean;     // Zakaz glosowania
  isSlimed: boolean;
  isSanded: boolean;
  isMagnetized: boolean;
  mudCount: number;        // muddy mirrors pending on this player
  swampChargesLeft: number; // Jożin z Bażin charges remaining
  matrixAbilityUsed: boolean;
  gravediggerUsed: boolean;
  massMurdererUsed: boolean;
  jailerAbilityUsed: boolean;
  
  // Slepy Kat Logic
  executionerStatus: 'NONE' | 'SAVED' | 'VICTIM';
  executionerUses: number;
  anarchistShotUsed: boolean;
  terroristBombUsed: boolean;
  astronomerNightUsed: boolean;
  communistEqualityUsed: boolean;
  timeLordSkipUsed: boolean;
}

export interface Tunnel {
  id: string;
  sourceId: string;
  targetId: string;
  createdAt: number;
  tunnelNumber: number;
}

export interface Player {
  id: string;
  name: string;
  // Each player gets concrete card instances assigned before dealing.
  // `instance` is the per-card copy number (1..N) assigned globally before shuffle.
  cards: PlayerCard[];
  inactiveCards: PlayerCard[];
  hasGasMask: boolean;
  status: PlayerStatus;
}

export interface ActiveCardInstance {
  cardId: CardId;
  instance: number;
  mode?: NightCardMode;
}

export interface ShooterQueuedShot {
  shooterId: string;
  instance: number;
  targetId: string;
}

export interface PendingSockThrow {
  sockId: string;
  firstTargetId: string;
  secondTargetId: string;
}

export type LogParamValue =
  | string
  | number
  | { kind: 'cardLabel'; cardId: CardId; instance?: number };

export type LogParamMap = Record<string, LogParamValue>;

export interface LogMessageFragment {
  key: string;
  params?: LogParamMap;
}

export interface GameLog {
  id: string;
  timestamp: number;
  phase: GamePhase;
  round: number;
  type: 'INFO' | 'ACTION' | 'SYSTEM' | 'DEATH';
  text?: string;
  translationKey?: string;
  translationParams?: LogParamMap;
  translationFragments?: LogMessageFragment[];
}

export type PublicReportSockOutcome = 'GAS_MASK' | 'ALREADY_DEAD' | 'DOCTOR' | 'CLOUDWALKER' | 'DEATH';

export interface PublicReportFragment {
  key: string;
  params?: LogParamMap;
}

export interface PublicReportEntry extends PublicReportFragment {
  fragments?: PublicReportFragment[];
}

export interface SockReportOutcome {
  targetId?: string;
  result: PublicReportSockOutcome;
  cloudwalkerInstance?: number;
}

export interface CloudwalkerReward {
  num: number;
  cardInstance?: number;
}

export interface BulletReportLookupEntry {
  publicEntry: PublicReportEntry;
  logFragments: LogMessageFragment[];
}

export interface PublicReportData {
  ghostTargets: string[];
  judgeTargets: string[];
  slimedTargets: string[];
  sandedTargets: string[];
  sandProtectedTargets: string[];
  matrixBulletsCaught: number;
  sock: {
    usedBy: string | null;
    first?: SockReportOutcome;
    second?: SockReportOutcome;
  };
  cloudwalkers: {
    leech: number[];
    cobra: number[];
    gravedigger: CloudwalkerReward[];
    glazier: number[];
    gandalf: CloudwalkerReward[];
    horsepiece: CloudwalkerReward[];
  };
  bullets: PublicReportEntry[];
  victoryKey?: string | null;
}

export interface BulletAnimationSegment {
  fromId: string | null;
  toId: string;
}

export interface BulletAnimationEntry {
  id: string;
  shotId: string;
  sourceId: string | null;
  segments: BulletAnimationSegment[];
}

export type DayActionKind = 'HANG' | 'ANARCHIST_SHOT' | 'MASS_MURDERER_RETALIATION';

export interface DayActionContext {
  kind: DayActionKind;
  promptKey: string;
  actorId?: string;
  consumeAnarchistCharge?: boolean;
  source?: 'ANARCHIST' | 'TERRORIST' | 'MASS_MURDERER';
  targetId?: string;
  massMurderer?: {
    ownerId: string;
    selectedIds: string[];
  };
}

export interface GameState {
  players: Player[];
  phase: GamePhase;
  currentRound: number;
  firstNightBriefingDone: boolean;
  publicReport: PublicReportEntry[];
  publicReportsByRound: Record<number, PublicReportEntry[]>;
  doctorRules: DoctorRules;
  
  // Logic
  // Active card instance during NIGHT_ACTIVE
  activeCard: ActiveCardInstance | null;
  globalTunnels: Tunnel[];
  
  // Side Effect Trackers (Reset every night)
  nightCache: {
    kuskonaTriggered: boolean;
    gandalfTriggered: boolean;
    leechLinks: {
      leechId: string;
      instance: number;
      targetId: string;
      triggered: boolean;
    }[];
    cobraTargets: {
      cobraId: string;
      instance: number;
      targetId: string;
    }[];
    gravediggerActive: { playerId: string; instance: number }[];
    gravediggerBonus: Record<string, number>;
    slimeUsedOnPlayers: string[];
    matrixStoredBullets: number;
    matrixTrap: { playerId: string; instance: number } | null;
    glazierPendingRewards: string[];
    pendingShots: {
      mafiaVotes: { shooterId: string; targetId: string }[];
      madGunman: ShooterQueuedShot[];
      sniper: ShooterQueuedShot[];
    };
    pendingToxicSocks: PendingSockThrow[];
    doctorProtections: {
      healerId: string;
      targetId: string;
      instance: number;
      mode: DoctorHealMode;
    }[];
    executionerPairs: { savedId: string; victimId: string }[];
    reportData: PublicReportData;
    bulletReportLookup: Record<string, BulletReportLookupEntry>;
    spyglassRevealIds: string[] | null;
    wokenPlayerIds: string[];
    bulletAnimations: BulletAnimationEntry[];
    jailerUsedIds: string[];
    blockedCardInstanceKeys: string[];
    nightCardOrder: ActiveCardInstance[];
    nightCardCursor: number;
  };

  uiState: {
    waitingFor: 'NONE' | 'USE_DECISION';
    pendingPrompts: string[];
    selectionContext: null | { cardId: CardId; data: Record<string, string> };
    dayAction: DayActionContext | null;
    pendingDayReport: PublicReportEntry[] | null;
    communistSuppressionActive: boolean;
    bulletReplayNonce: number;
    pendingVictoryKey: string | null;
  };

  logs: GameLog[];
  settings: {
    language: Language;
    bulletSpeed: number;
    playerNodeScale: number;
  };
  victory: { side: VictorySide; cause: VictoryCause; announced?: boolean } | null;
}

export interface UndoWrapper {
  past: GameState[];
  present: GameState;
  future: GameState[];
}