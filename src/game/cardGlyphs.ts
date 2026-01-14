import type { ComponentType } from 'react';
import {
  Alien,
  Binoculars,
  Bomb,
  Browsers,
  Cloud,
  CrownSimple,
  CrosshairSimple,
  Detective,
  DropHalfBottom,
  Ghost,
  Hammer,
  Handshake,
  Horse,
  HourglassLow,
  Knife,
  LockSimple,
  Magnet,
  MagicWand,
  MoonStars,
  PawPrint,
  PersonSimpleWalk,
  Prohibit,
  Question,
  Scroll,
  Scales,
  ShieldCheck,
  ShieldStar,
  Shovel,
  Skull,
  Snowflake,
  Sock,
  SquaresFour,
  Stethoscope,
  Syringe,
  Target,
  Timer,
  UsersFour,
  WarningOctagon
} from '@phosphor-icons/react';
import type { IconProps } from '@phosphor-icons/react';
import type { CardId } from './types';

export type CardGlyph = ComponentType<IconProps>;

const FALLBACK_ICON = Question;

const CARD_GLYPHS: Partial<Record<CardId, CardGlyph>> = {
  CloudWalker: Cloud,
  Immunity: ShieldCheck,
  RopeWalker: PersonSimpleWalk,
  KevlarVest: ShieldStar,
  Matrix: SquaresFour,
  Jailer: LockSimple,
  Gravedigger: Shovel,
  Mage: MagicWand,
  Slime: DropHalfBottom,
  Leech: Syringe,
  Sand: HourglassLow,
  Cobra: PawPrint,
  Magnet: Magnet,
  GhostBobo: Ghost,
  Doctor: Stethoscope,
  SwampMonster: Alien,
  Mafia: UsersFour,
  MadGunman: Target,
  Sniper: CrosshairSimple,
  Sock: Sock,
  Judge: Scales,
  BlindExecutioner: Knife,
  Spyglass: Binoculars,
  Mirror: Browsers,
  Terrorist: Bomb,
  Astronomer: MoonStars,
  Meciar: CrownSimple,
  Kovac: Hammer,
  AlCapone: Detective,
  Gandalf: Scroll,
  HorsePiece: Horse,
  Atheist: Prohibit,
  Anarchist: WarningOctagon,
  Glazier: Snowflake,
  MassMurderer: Skull,
  Communist: Handshake,
  TimeLord: Timer
};

export function getCardGlyph(cardId: CardId): CardGlyph {
  return CARD_GLYPHS[cardId] ?? FALLBACK_ICON;
}
