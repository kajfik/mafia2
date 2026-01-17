import type { ComponentType } from 'react';
import {
  AlienIcon,
  BinocularsIcon,
  BombIcon,
  BrowsersIcon,
  CigaretteIcon,
  CloudIcon,
  CodeIcon,
  CrownSimpleIcon,
  CrosshairSimpleIcon,
  DetectiveIcon,
  DropHalfBottomIcon,
  GhostIcon,
  HammerIcon,
  HandshakeIcon,
  HorseIcon,
  HourglassLowIcon,
  KnifeIcon,
  LockSimpleIcon,
  MagnetIcon,
  MagicWandIcon,
  MoonStarsIcon,
  PawPrintIcon,
  PersonSimpleWalkIcon,
  ProhibitIcon,
  QuestionIcon,
  RabbitIcon,
  ScrollIcon,
  ScalesIcon,
  ShieldCheckIcon,
  ShieldStarIcon,
  ShovelIcon,
  SkullIcon,
  SnowflakeIcon,
  SockIcon,
  SquaresFourIcon,
  StethoscopeIcon,
  SyringeIcon,
  TargetIcon,
  TimerIcon,
  UsersFourIcon,
  WarningOctagonIcon
} from '@phosphor-icons/react';
import type { IconProps } from '@phosphor-icons/react';
import type { CardId } from './types';

export type CardGlyph = ComponentType<IconProps>;

const FALLBACK_ICON = QuestionIcon;

const CARD_GLYPHS: Partial<Record<CardId, CardGlyph>> = {
  CloudWalker: CloudIcon,
  Immunity: ShieldCheckIcon,
  RopeWalker: PersonSimpleWalkIcon,
  KevlarVest: ShieldStarIcon,
  Matrix: RabbitIcon,
  Jailer: LockSimpleIcon,
  Gravedigger: ShovelIcon,
  Mage: MagicWandIcon,
  Slime: DropHalfBottomIcon,
  Leech: SyringeIcon,
  Sand: HourglassLowIcon,
  Cobra: PawPrintIcon,
  Magnet: MagnetIcon,
  GhostBobo: GhostIcon,
  Doctor: StethoscopeIcon,
  SwampMonster: AlienIcon,
  Mafia: DetectiveIcon,
  MadGunman: TargetIcon,
  Sniper: CrosshairSimpleIcon,
  Sock: SockIcon,
  Judge: ScalesIcon,
  BlindExecutioner: KnifeIcon,
  Spyglass: BinocularsIcon,
  Mirror: BrowsersIcon,
  Terrorist: BombIcon,
  Astronomer: MoonStarsIcon,
  Meciar: CrownSimpleIcon,
  Kovac: HammerIcon,
  AlCapone: CigaretteIcon,
  Gandalf: ScrollIcon,
  HorsePiece: HorseIcon,
  Atheist: ProhibitIcon,
  Anarchist: WarningOctagonIcon,
  Glazier: SnowflakeIcon,
  MassMurderer: SkullIcon,
  Communist: HandshakeIcon,
  TimeLord: TimerIcon
};

export function getCardGlyph(cardId: CardId): CardGlyph {
  return CARD_GLYPHS[cardId] ?? FALLBACK_ICON;
}
