import React, { useLayoutEffect, useRef } from 'react';
import type { Player, GamePhase } from '../game/types';
import { PLAYER_NODE_SCALE_MIN, PLAYER_NODE_SCALE_MAX } from '../game/gameReducer';
import matrixIcon from '../../icons/matrix.jpg';
import slimeIcon from '../../icons/slime.png';
import sandIcon from '../../icons/sand.png';
import magnetIcon from '../../icons/magnet.png';
import meciarIcon from '../../icons/meciar.png';
import kovacIcon from '../../icons/kovac.png';
import cantVoteIcon from '../../icons/cant_vote.png';
import silencedIcon from '../../icons/silenced.png';

interface Props {
  player: Player;
  x: number; y: number;
  phase: GamePhase;
  isActive: boolean;
  onClick: (id: string) => void;
  disabled?: boolean;
  size?: number;
  isHighlighted?: boolean;
  communistSuppressionActive?: boolean;
  showMatrixIcon?: boolean;
}

export const PlayerNode: React.FC<Props> = ({ player, x, y, phase, isActive, onClick, disabled = false, size = 1, isHighlighted = false, communistSuppressionActive = false, showMatrixIcon = false }) => {
  const isNight = phase.includes('NIGHT');
  const isDead = !player.status.isAlive;
  const opacity = disabled ? 0.4 : (isDead ? 0.5 : 1);
  const cursorClass = disabled ? 'cursor-not-allowed' : 'cursor-pointer';
  const clampedSize = Math.min(PLAYER_NODE_SCALE_MAX, Math.max(PLAYER_NODE_SCALE_MIN, size));
  const nodeSize = 4 * clampedSize; // rem approx
  const innerSize = 3 * clampedSize;
  const iconSize = 1.5 * clampedSize;
  const matrixIconSize = iconSize * 1.25;
  const nameFontSize = Math.min(0.95, Math.max(0.6, 0.68 + (clampedSize - 1) * 0.25));
  const nameRef = useRef<HTMLSpanElement>(null);
  const circleBorderClass = isActive ? 'border-[rgba(242,200,121,0.85)]' : 'border-[rgba(242,200,121,0.35)]';
  const circleShadowClass = isActive ? 'shadow-[0_22px_42px_rgba(0,0,0,0.75)]' : 'shadow-[0_12px_28px_rgba(0,0,0,0.55)]';
  const highlightClass = isHighlighted ? 'ring-4 ring-[rgba(242,200,121,0.6)] ring-offset-2 ring-offset-[rgba(8,6,12,0.85)] animate-pulse' : '';

  useLayoutEffect(() => {
    const label = nameRef.current;
    if (!label) return;
    const wrapper = label.parentElement;
    if (!wrapper) return;

    let currentSize = nameFontSize;
    const minSize = Math.max(0.3, nameFontSize * 0.45);
    label.style.fontSize = `${currentSize}rem`;

    for (let i = 0; i < 20; i++) {
      const widthOverflow = label.scrollWidth > wrapper.clientWidth - 4;
      const heightOverflow = label.scrollHeight > wrapper.clientHeight - 4;
      if (!widthOverflow && !heightOverflow) {
        break;
      }
      if (currentSize <= minSize) {
        break;
      }
      currentSize = Math.max(minSize, currentSize - 0.05);
      label.style.fontSize = `${currentSize}rem`;
    }
  }, [player.name, nameFontSize, clampedSize]);

  const matrixBadgeActive = showMatrixIcon && isNight && player.status.isAlive;

  return (
    <div 
      className={`absolute flex flex-col items-center justify-center transition ${cursorClass} ${isActive?'scale-110 z-20':'z-10'}`}
      style={{
        left: `${x}%`,
        top: `${y}%`,
        width: `${nodeSize}rem`,
        height: `${nodeSize}rem`,
        transform: 'translate(-50%, -50%)',
        opacity,
        filter: isDead ? 'grayscale(100%)' : 'none',
        pointerEvents: disabled ? 'none' : undefined
      }}
      onClick={disabled ? undefined : () => onClick(player.id)}
      aria-disabled={disabled}
    >
      <div
        className={`rounded-full border-2 flex items-center justify-center transition-colors transition-shadow duration-200 ${circleBorderClass} ${circleShadowClass} ${highlightClass}`}
        style={{
          width: `${innerSize}rem`,
          height: `${innerSize}rem`,
          background: 'radial-gradient(circle at 35% 25%, rgba(242, 200, 121, 0.15), rgba(8, 6, 12, 0.92))'
        }}
      >
        <span
          ref={nameRef}
          className="text-xs font-bold max-w-full px-1 text-center leading-tight text-[rgba(255,255,255,0.95)]"
          style={{ fontSize: `${nameFontSize}rem`, whiteSpace: 'nowrap' }}
        >
          {player.name}
        </span>
      </div>
      {/* Icons */}
      {isNight && player.status.isAlive && (
        <>
          {matrixBadgeActive && (
            <img
              src={matrixIcon}
              className="absolute -bottom-2 -left-2"
              style={{ height: `${matrixIconSize}rem`, width: 'auto', maxWidth: `${matrixIconSize * 1.4}rem`, objectFit: 'contain' }}
              alt="Matrix activated"
            />
          )}
          {player.status.isSlimed && <img src={slimeIcon} className="absolute -top-2 -right-2" style={{ width: `${iconSize}rem`, height: `${iconSize}rem` }} />}
          {player.status.isSanded && <img src={sandIcon} className="absolute -top-2 -right-2" style={{ width: `${iconSize}rem`, height: `${iconSize}rem` }} />}
          {player.status.isMagnetized && <img src={magnetIcon} className="absolute -bottom-2 -right-2" style={{ width: `${iconSize}rem`, height: `${iconSize}rem` }} />}
        </>
      )}
      {!isNight && player.status.isAlive && !communistSuppressionActive && (
        <>
         {player.cards.some(rr => rr.cardId === 'Meciar') && <img src={meciarIcon} className="absolute -top-2 -right-2" style={{ width: `${iconSize}rem`, height: `${iconSize}rem` }} />}
         {player.cards.some(rr => rr.cardId === 'Kovac') && <img src={kovacIcon} className="absolute -top-2 -left-2" style={{ width: `${iconSize}rem`, height: `${iconSize}rem` }} />}
        </>
      )}
      {!isNight && player.status.isAlive && (
        <>
          {player.status.isCantVote && (
            <img
              src={cantVoteIcon}
              className="absolute -bottom-2 -left-2"
              style={{ width: `${iconSize}rem`, height: `${iconSize}rem` }}
            />
          )}
          {player.status.isSilenced && (
            <img
              src={silencedIcon}
              className="absolute -bottom-2 left-1/2 -translate-x-1/2"
              style={{ width: `${iconSize}rem`, height: `${iconSize}rem` }}
            />
          )}
        </>
      )}
    </div>
  );
};