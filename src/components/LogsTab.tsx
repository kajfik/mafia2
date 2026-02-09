import React, { useEffect, useRef, useState } from 'react';
import type { GameState, PublicReportEntry } from '../game/types';
import { t } from '../game/translations';
import { translateTemplateSegments, type LogDisplaySegment } from '../game/logging';
import { GameLogPanel } from './GameLogPanel';
import { CardLabelBadge } from './CardLabelBadge';

interface LogsTabProps {
  state: GameState;
  selectedRound: number;
  onSelectRound: (round: number) => void;
}

export const LogsTab: React.FC<LogsTabProps> = ({ state, selectedRound, onSelectRound }) => {
  const [mobileLogView, setMobileLogView] = useState<'logs' | 'public'>('logs');
  const hasAutoSelectedRound = useRef(false);
  const lang = state.settings.language;
  const totalRounds = Math.max(1, state.currentRound || 1);
  const activeRound = Math.min(Math.max(1, selectedRound), totalRounds);
  const roundOptions = Array.from({ length: totalRounds }, (_, idx) => idx + 1);
  const heading = t('logs_heading', lang);
  const subheading = t('logs_subheading', lang, { round: activeRound });
  const roundLabel = t('logs_round_label', lang);
  const viewLabel = t('logs_view_label', lang);
  const publicReportTitle = t('logs_public_report_title', lang);
  const publicReportPlaceholder = t('logs_public_report_placeholder', lang);
  const roundLogTitle = t('logs_round_title', lang);
  const roundEmptyMessage = t('logs_round_empty', lang);

  useEffect(() => {
    if (hasAutoSelectedRound.current) {
      return;
    }

    hasAutoSelectedRound.current = true;

    if (selectedRound !== totalRounds) {
      onSelectRound(totalRounds);
    }
  }, [selectedRound, totalRounds, onSelectRound]);

  const filteredLogs = state.logs.filter(log => log.round === activeRound);
  const reportEntries = state.publicReportsByRound?.[activeRound] ?? [];

  const buildReportSegments = (entry: PublicReportEntry): LogDisplaySegment[] => {
    const fragments = entry.fragments?.length ? entry.fragments : [entry];
    return fragments.flatMap(fragment =>
      translateTemplateSegments(fragment.key, fragment.params, state.players, lang)
    );
  };

  const renderSegmentNodes = (segments: LogDisplaySegment[], keyPrefix: string) =>
    segments.map((segment, idx) =>
      segment.kind === 'cardLabel' ? (
        <CardLabelBadge
          key={`${keyPrefix}-card-${idx}`}
          cardId={segment.cardId}
          label={segment.label}
          size="xs"
          variant="logSegment"
          className="mx-0.5"
        />
      ) : (
        <React.Fragment key={`${keyPrefix}-text-${idx}`}>
          {segment.text}
        </React.Fragment>
      )
    );

  return (
    <div className="h-full min-h-0 flex flex-col gap-4 overflow-hidden text-white px-3 pt-6 pb-6 sm:px-4 sm:pt-8">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold mafia-title text-[var(--color-brass)] tracking-[0.3em] uppercase">{heading}</h2>
          <p className="text-xs text-[rgba(242,200,121,0.6)]">{subheading}</p>
        </div>
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 text-xs uppercase tracking-[0.35em] text-[rgba(242,200,121,0.7)]">
            {roundLabel}
            <select
              value={activeRound}
              onChange={event => onSelectRound(Number(event.target.value))}
              className="bg-[rgba(15,12,20,0.85)] text-white px-3 py-1 rounded border border-[rgba(242,200,121,0.2)]"
            >
              {roundOptions.map(round => (
                <option key={round} value={round}>{round}</option>
              ))}
            </select>
          </label>
          <label className="flex items-center gap-2 text-xs uppercase tracking-[0.35em] text-[rgba(242,200,121,0.7)] lg:hidden">
            {viewLabel}
            <select
              value={mobileLogView}
              onChange={event => setMobileLogView(event.target.value as 'logs' | 'public')}
              className="bg-[rgba(15,12,20,0.85)] text-white px-3 py-1 rounded border border-[rgba(242,200,121,0.2)] tracking-normal"
            >
              <option value="logs">{roundLogTitle}</option>
              <option value="public">{publicReportTitle}</option>
            </select>
          </label>
        </div>
      </div>

      <div className="flex-1 min-h-0 flex flex-col lg:flex-row gap-4">
        <div className={`flex-1 min-h-0 ${mobileLogView === 'public' ? '' : 'hidden'} lg:block`}>
          <div className="h-full flex flex-col rounded-2xl bg-[rgba(14,12,18,0.85)] border border-[rgba(242,200,121,0.18)] shadow-[inset_0_0_30px_rgba(0,0,0,0.45)]">
            <div className="px-4 py-3 border-b border-[rgba(242,200,121,0.15)] text-[0.65rem] font-semibold uppercase tracking-[0.4em] text-[var(--color-brass)]/85">
              {publicReportTitle}
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-3 text-sm text-slate-100/90">
              {reportEntries.length === 0 && (
                <div className="text-[rgba(242,200,121,0.55)]">{publicReportPlaceholder}</div>
              )}
              {reportEntries.map((entry, idx) => (
                <div key={`${entry.key}-${idx}`} className="text-slate-50">
                  {renderSegmentNodes(buildReportSegments(entry), `logs-report-${idx}`)}
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className={`flex-1 min-h-0 ${mobileLogView === 'logs' ? '' : 'hidden'} lg:block`}>
          <GameLogPanel
            logs={filteredLogs}
            players={state.players}
            language={lang}
            title={roundLogTitle}
            emptyMessage={roundEmptyMessage}
            className="h-full"
          />
        </div>
      </div>
    </div>
  );
};
