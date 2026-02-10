import React from 'react';
import type { CardGlyph } from '../game/cardGlyphs';

export type CardIndicator = 'night' | 'day' | 'gas';

const MoonGlyph: React.FC = () => (
  <svg viewBox="0 0 24 24" className="h-5 w-5" role="presentation" aria-hidden="true" fill="currentColor">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </svg>
);

const SunGlyph: React.FC = () => (
  <svg viewBox="0 0 24 24" className="h-5 w-5" role="presentation" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.75">
    <circle cx="12" cy="12" r="4" />
    <path d="M12 3v2m0 14v2m9-9h-2M5 12H3m15.364-6.364-1.414 1.414M7.05 16.95 5.636 18.364m12.728 0-1.414-1.414M7.05 7.05 5.636 5.636" />
  </svg>
);

export const GasMaskGlyph: React.FC<React.SVGProps<SVGSVGElement>> = ({ className, ...rest }) => (
  <svg
    viewBox="0 0 24 24"
    className={className ?? 'h-5 w-5'}
    role="presentation"
    aria-hidden="true"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...rest}
  >
    <path d="M8 15v3.5a4 4 0 0 0 8 0V15" />
    <path d="M7 9a5 5 0 0 1 10 0v3.5A2.5 2.5 0 0 1 14.5 15h-5A2.5 2.5 0 0 1 7 12.5V9Z" />
    <circle cx="9" cy="9.5" r="1.3" />
    <circle cx="15" cy="9.5" r="1.3" />
    <path d="M9 18.5a3 3 0 0 0 6 0" />
  </svg>
);

interface IndicatorMeta {
  label: string;
  className: string;
  Glyph: React.FC;
}

const INDICATOR_META: Record<CardIndicator, IndicatorMeta> = {
  night: {
    label: 'Night action',
    className: 'text-[var(--color-brass)] border-[rgba(242,200,121,0.4)] bg-[rgba(242,200,121,0.08)]',
    Glyph: MoonGlyph
  },
  day: {
    label: 'Day action',
    className: 'text-[rgba(255,188,150,0.95)] border-[rgba(197,83,61,0.45)] bg-[rgba(197,83,61,0.08)]',
    Glyph: SunGlyph
  },
  gas: {
    label: 'Provides gas mask',
    className: 'text-[#a9f5d0] border-[rgba(132,201,178,0.4)] bg-[rgba(132,201,178,0.08)]',
    Glyph: GasMaskGlyph
  }
};

const IconBadge: React.FC<{ label: string; className: string; children: React.ReactNode }> = ({ label, className, children }) => (
  <span
    className={`inline-flex h-9 w-9 min-h-[2.25rem] min-w-[2.25rem] items-center justify-center rounded-full border text-base shadow-[0_8px_20px_rgba(0,0,0,0.35)] ${className}`}
    title={label}
    aria-label={label}
  >
    {children}
  </span>
);

export interface CardDisplayProps {
  label: string;
  glyph: CardGlyph | null;
  imageSrc: string | null;
  artMode: 'icon' | 'image';
  indicators?: CardIndicator[];
  description?: string;
  className?: string;
  actionButton?: React.ReactNode;
  isDisabled?: boolean;
}

const CARD_BASE_CLASS = 'flex flex-col overflow-hidden rounded-2xl border border-[rgba(242,200,121,0.18)] bg-[rgba(14,12,18,0.9)]';
const FALLBACK_DESCRIPTION = 'Description coming soon.';

export const CardDisplay: React.FC<CardDisplayProps> = ({
  label,
  glyph,
  imageSrc,
  artMode,
  indicators = [],
  description,
  className,
  actionButton,
  isDisabled
}) => {
  const Glyph = glyph;
  const showIcon = artMode === 'icon';
  const sizeClass = showIcon ? '' : 'min-h-[450px]';
  const disabledClass = isDisabled ? 'opacity-60 grayscale' : '';
  const composedClass = className
    ? `${CARD_BASE_CLASS} ${sizeClass} ${disabledClass} ${className}`
    : `${CARD_BASE_CLASS} ${sizeClass} ${disabledClass}`;

  const renderImageFallback = () => (
    <div className="flex items-center justify-center w-full h-full text-[rgba(242,200,121,0.5)] text-sm font-semibold tracking-[0.4em] uppercase">
      No art yet
    </div>
  );

  const mediaWrapperBase = 'relative flex items-center justify-center flex-1 basis-0 min-h-0 max-h-[65%] p-4 border-b border-[rgba(242,200,121,0.15)]';
  const mediaBackground = 'bg-white';

  const renderHeader = () => (
    <div className="flex flex-col gap-2">
      <div className="flex items-start gap-3">
        {showIcon && (
          <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-xl border border-[rgba(242,200,121,0.25)] bg-[radial-gradient(circle_at_top,rgba(242,200,121,0.2),rgba(14,12,18,0.95))] shadow-[0_12px_25px_rgba(0,0,0,0.35)]">
            {Glyph ? (
              <Glyph className="h-9 w-9 text-[var(--color-brass)]" weight="duotone" aria-hidden="true" />
            ) : (
              <span className="text-[rgba(242,200,121,0.6)] text-[0.6rem] font-semibold tracking-[0.3em] uppercase">
                No icon
              </span>
            )}
          </div>
        )}
        <h3 className="text-lg font-bold text-[var(--color-brass)] leading-snug">
          {label}
        </h3>
      </div>
      {(indicators.length > 0 || actionButton) && (
        <div className="flex items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-2 text-white/80 flex-1">
            {indicators.map(indicator => {
              const meta = INDICATOR_META[indicator];
              if (!meta) return null;
              return (
                <IconBadge key={`${label}-${indicator}`} label={meta.label} className={meta.className}>
                  <meta.Glyph />
                </IconBadge>
              );
            })}
          </div>
          {actionButton && <div className="flex-shrink-0">{actionButton}</div>}
        </div>
      )}
    </div>
  );

  if (showIcon) {
    return (
      <article className={composedClass}>
        <div className="flex flex-col gap-3 p-4 shrink-0">
          {renderHeader()}
          <p className="text-sm text-slate-100/80 leading-relaxed py-1">{description ?? FALLBACK_DESCRIPTION}</p>
        </div>
      </article>
    );
  }

  return (
    <article className={composedClass}>
      <div className={`${mediaWrapperBase} ${mediaBackground}`}>
        {imageSrc ? (
          <img src={imageSrc} alt={label} className="object-contain h-full w-full" loading="lazy" />
        ) : (
          renderImageFallback()
        )}
      </div>
      <div className="flex flex-col gap-3 p-4 shrink-0">
        {renderHeader()}
        <p className="text-sm text-slate-100/80 flex-1 leading-relaxed py-1">{description ?? FALLBACK_DESCRIPTION}</p>
      </div>
    </article>
  );
};
