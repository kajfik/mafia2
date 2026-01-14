import React from 'react';
import type { CardId } from '../game/types';
import { getCardGlyph } from '../game/cardGlyphs';

interface CardLabelBadgeProps {
  cardId: CardId;
  label: string;
  size?: 'xs' | 'sm' | 'md';
  className?: string;
  labelClassName?: string;
}

const SIZE_ICON_CLASS: Record<NonNullable<CardLabelBadgeProps['size']>, string> = {
  xs: 'h-3.5 w-3.5',
  sm: 'h-4 w-4',
  md: 'h-5 w-5'
};

const SIZE_GLYPH_CLASS: Record<NonNullable<CardLabelBadgeProps['size']>, string> = {
  xs: 'h-2.5 w-2.5',
  sm: 'h-3 w-3',
  md: 'h-3.5 w-3.5'
};

export const CardLabelBadge: React.FC<CardLabelBadgeProps> = ({
  cardId,
  label,
  size = 'sm',
  className = '',
  labelClassName = ''
}) => {
  const glyphComponent = getCardGlyph(cardId);
  const iconClass = SIZE_ICON_CLASS[size];
  const glyphClass = SIZE_GLYPH_CLASS[size];
  const sharedBubbleClass = `${iconClass} inline-flex items-center justify-center rounded-full border border-[rgba(242,200,121,0.35)] bg-[rgba(15,12,20,0.65)] text-[var(--color-brass)]`;

  return (
    <span className={`inline-flex items-center gap-1 align-middle leading-tight ${className}`} title={label}>
      {glyphComponent ? (
        <span className={sharedBubbleClass} aria-hidden>
          {React.createElement(glyphComponent, { className: glyphClass, weight: 'duotone' })}
        </span>
      ) : (
        <span className={`${sharedBubbleClass} text-[0.65rem]`} aria-hidden>
          ?
        </span>
      )}
      <span className={labelClassName}>{label}</span>
    </span>
  );
};
