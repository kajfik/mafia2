import React, { useEffect, useRef } from 'react';
import type { GameState, Player, Language, GamePhase } from '../game/types';
import { translateLogEntry, translateLogEntrySegments } from '../game/logging';
import { t } from '../game/translations';
import { CardLabelBadge } from './CardLabelBadge';

type DividerVariant = 'NIGHT_START' | 'NIGHT_END' | 'DAY_START' | 'DAY_END';

const DIVIDER_CLASSES: Record<DividerVariant, string> = {
  NIGHT_START: 'border-[rgba(242,200,121,0.45)] text-[var(--color-brass)] bg-[rgba(242,200,121,0.08)]',
  NIGHT_END: 'border-[rgba(242,200,121,0.2)] text-[rgba(242,200,121,0.75)] bg-[rgba(242,200,121,0.04)]',
  DAY_START: 'border-[rgba(197,83,61,0.45)] text-[rgba(255,202,170,0.9)] bg-[rgba(197,83,61,0.08)]',
  DAY_END: 'border-[rgba(197,83,61,0.18)] text-[rgba(255,202,170,0.75)] bg-[rgba(197,83,61,0.04)]',
};

const DIVIDER_KEY_TO_VARIANT: Record<string, DividerVariant> = {
  log_divider_night_start: 'NIGHT_START',
  log_divider_night_end: 'NIGHT_END',
  log_divider_day_start: 'DAY_START',
  log_divider_day_end: 'DAY_END',
};

const DIVIDER_VARIANT_TO_KEY: Record<DividerVariant, string> = {
  NIGHT_START: 'log_divider_night_start',
  NIGHT_END: 'log_divider_night_end',
  DAY_START: 'log_divider_day_start',
  DAY_END: 'log_divider_day_end',
};

const NIGHT_PHASES: GamePhase[] = ['NIGHT_ANNOUNCEMENT', 'NIGHT_ACTIVE', 'NIGHT_REPLAY'];
const DAY_PHASES: GamePhase[] = ['DAY_ANNOUNCEMENT', 'DAY_MAIN'];

type PhaseGroup = 'NIGHT' | 'DAY' | 'OTHER';

const getPhaseGroup = (phase: GamePhase): PhaseGroup => {
  if (NIGHT_PHASES.includes(phase)) {
    return 'NIGHT';
  }
  if (DAY_PHASES.includes(phase)) {
    return 'DAY';
  }
  return 'OTHER';
};

interface DividerItem {
  kind: 'divider';
  variant: DividerVariant;
  text: string;
  key: string;
}

interface LogItem {
  kind: 'log';
  entry: GameState['logs'][number];
}

type DecoratedItem = DividerItem | LogItem;

const createDividerItem = (
  variant: DividerVariant,
  language: Language,
  round: number | null,
  key: string
): DividerItem => ({
  kind: 'divider',
  variant,
  text: t(DIVIDER_VARIANT_TO_KEY[variant], language, round != null ? { round } : undefined),
  key,
});

interface GameLogPanelProps {
  logs: GameState['logs'];
  players: Player[];
  language: Language;
  className?: string;
  title?: string;
  emptyMessage?: string;
}

export const GameLogPanel: React.FC<GameLogPanelProps> = ({ logs, players, language, className, title = '', emptyMessage = '' }) => {
  const items = logs.slice();
  const baseClass = 'h-full flex flex-col rounded-2xl bg-[rgba(14,12,18,0.85)] border border-[rgba(242,200,121,0.18)] shadow-[inset_0_0_30px_rgba(0,0,0,0.45)]';
  const mergedClass = className ? `${baseClass} ${className}` : baseClass;
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const shouldDisplayVariant = (variant: DividerVariant) => variant === 'NIGHT_START' || variant === 'DAY_START';
  const hasExplicitDividers = items.some(entry => {
    const variant = entry.translationKey ? DIVIDER_KEY_TO_VARIANT[entry.translationKey] : undefined;
    return variant ? shouldDisplayVariant(variant) : false;
  });

  const renderDividerNode = (key: string, variant: DividerVariant, text: string) => (
    <div key={key} className="text-[0.58rem] uppercase tracking-[0.45em] text-[rgba(242,200,121,0.65)] flex items-center gap-2">
      <span className="h-px flex-1 bg-[rgba(242,200,121,0.2)]" aria-hidden="true" />
      <span className={`px-3 py-1 rounded-full border ${DIVIDER_CLASSES[variant]}`}>{text}</span>
      <span className="h-px flex-1 bg-[rgba(242,200,121,0.2)]" aria-hidden="true" />
    </div>
  );

  const renderLogNode = (entry: GameState['logs'][number]) => {
    const segments = translateLogEntrySegments(entry, players, language);
    const textClass = entry.type === 'DEATH' ? 'text-[rgba(197,83,61,0.9)]' : 'text-slate-100';
    return (
      <div key={entry.id} className={textClass}>
        {segments.length
          ? segments.map((segment, idx) => (
              segment.kind === 'cardLabel'
                ? (
                  <CardLabelBadge
                    key={`${entry.id}-segment-${idx}`}
                    cardId={segment.cardId}
                    label={segment.label}
                    size="xs"
                    variant="logSegment"
                    className="mx-0.5"
                  />
                )
                : (
                  <React.Fragment key={`${entry.id}-segment-${idx}`}>
                    {segment.text}
                  </React.Fragment>
                )
            ))
          : translateLogEntry(entry, players, language)}
      </div>
    );
  };

  const decoratedItems: DecoratedItem[] = [];
  if (!hasExplicitDividers) {
    let activeGroup: PhaseGroup | null = null;
    let activeRound: number | null = null;

    items.forEach(entry => {
      const nextGroup = getPhaseGroup(entry.phase);
      if (nextGroup !== activeGroup) {
        if (activeGroup === 'NIGHT' && activeRound != null) {
          decoratedItems.push(createDividerItem('NIGHT_END', language, activeRound, `${entry.id}-night-end`));
        } else if (activeGroup === 'DAY' && activeRound != null) {
          decoratedItems.push(createDividerItem('DAY_END', language, activeRound, `${entry.id}-day-end`));
        }

        if (nextGroup === 'NIGHT') {
          decoratedItems.push(createDividerItem('NIGHT_START', language, entry.round, `${entry.id}-night-start`));
          activeRound = entry.round;
        } else if (nextGroup === 'DAY') {
          decoratedItems.push(createDividerItem('DAY_START', language, entry.round, `${entry.id}-day-start`));
          activeRound = entry.round;
        } else {
          activeRound = null;
        }

        activeGroup = nextGroup;
      }

      decoratedItems.push({ kind: 'log', entry });
    });

    if (activeGroup === 'NIGHT' && activeRound != null) {
      decoratedItems.push(createDividerItem('NIGHT_END', language, activeRound, `fallback-night-end-${activeRound}`));
    } else if (activeGroup === 'DAY' && activeRound != null) {
      decoratedItems.push(createDividerItem('DAY_END', language, activeRound, `fallback-day-end-${activeRound}`));
    }
  }

  const contentNodes = hasExplicitDividers
    ? items.map(entry => {
        const variant = entry.translationKey ? DIVIDER_KEY_TO_VARIANT[entry.translationKey] : undefined;
        if (variant) {
          return renderDividerNode(entry.id, variant, translateLogEntry(entry, players, language));
        }
        return renderLogNode(entry);
      })
    : decoratedItems.map(item =>
        item.kind === 'divider'
          ? renderDividerNode(item.key, item.variant, item.text)
          : renderLogNode(item.entry)
      );

  useEffect(() => {
    const container = scrollRef.current;
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  }, [items.length]);

  return (
    <div className={mergedClass}>
      <div className="px-4 py-3 border-b border-[rgba(242,200,121,0.15)] text-[0.65rem] font-semibold uppercase tracking-[0.4em] text-[var(--color-brass)]/85">
        {title}
      </div>
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3 text-sm text-slate-100/90">
        {items.length === 0 && <div className="text-[rgba(242,200,121,0.55)]">{emptyMessage}</div>}
        {contentNodes}
      </div>
    </div>
  );
};
