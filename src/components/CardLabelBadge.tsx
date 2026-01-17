import React from 'react';
import type { CardId } from '../game/types';
import { getCardGlyph } from '../game/cardGlyphs';

interface CardLabelBadgeProps {
  cardId: CardId;
  label: string;
  size?: 'xs' | 'sm' | 'md';
  variant?: CardLabelBadgeVariant;
  className?: string;
  labelClassName?: string;
  inlineAlign?: 'baseline' | 'middle';
}

type CardLabelBadgeVariant = 'default' | 'gmActive' | 'gmInactive' | 'logSegment' | 'inline';

const BASE_BADGE_CLASS = 'inline-flex items-center gap-1 leading-tight rounded-full border';

const VARIANT_CLASS: Record<CardLabelBadgeVariant, string> = {
  default: 'px-2 py-0.5 text-[var(--color-brass)] border-[rgba(242,200,121,0.25)] bg-[rgba(242,200,121,0.08)]',
  gmActive: 'px-2 py-0.2 text-slate-50 border-[rgba(242,200,121,0.28)] bg-[rgba(242,200,121,0.12)] shadow-[0_4px_15px_rgba(0,0,0,0.25)]',
  gmInactive: 'px-2 py-0.5 text-[rgba(255,255,255,0.4)] border-[rgba(197,83,61,0.35)] bg-[rgba(197,83,61,0.18)]',
  logSegment: 'px-1 py-0.5 border-[rgba(242,200,121,0.25)] bg-[rgba(242,200,121,0.06)] text-[0.85rem] font-medium relative top-[1.5px]',
  inline: 'px-2 py-0.5 border-[rgba(242,200,121,0.2)] bg-[rgba(242,200,121,0.04)] text-current',
};

const SIZE_ICON_CLASS: Record<NonNullable<CardLabelBadgeProps['size']>, string> = {
  xs: 'h-5 w-5',
  sm: 'h-6 w-6',
  md: 'h-7 w-7'
};

const SIZE_GLYPH_CLASS: Record<NonNullable<CardLabelBadgeProps['size']>, string> = {
  xs: 'h-3 w-3',
  sm: 'h-4 w-4',
  md: 'h-5 w-5'
};

export const CardLabelBadge: React.FC<CardLabelBadgeProps> = ({
  cardId,
  label,
  size = 'sm',
  variant = 'default',
  className = '',
  labelClassName = '',
  inlineAlign
}) => {
  const glyphComponent = getCardGlyph(cardId);
  const iconClass = SIZE_ICON_CLASS[size];
  const glyphClass = SIZE_GLYPH_CLASS[size];
  const sharedBubbleClass = `${iconClass} inline-flex self-center shrink-0 items-center justify-center rounded-full border border-[rgba(242,200,121,0.35)] bg-[rgba(15,12,20,0.65)] text-[var(--color-brass)]`;
  const resolvedInlineAlign = inlineAlign ?? (variant === 'logSegment' ? 'baseline' : 'middle');
  const verticalAlignClass = resolvedInlineAlign === 'baseline' ? 'align-baseline' : 'align-middle';
  const rootClass = `${BASE_BADGE_CLASS} ${verticalAlignClass} ${VARIANT_CLASS[variant]} ${className}`.trim();

  return (
    <span className={rootClass} title={label}>
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
