import React, { useLayoutEffect, useMemo, useRef, useState } from 'react';
import type { Player, GamePhase, Tunnel, BulletAnimationEntry } from '../game/types';
import { PlayerNode } from './PlayerNode';
import { TunnelLayer } from './TunnelLayer';
import { BulletLayer } from './BulletLayer';

const parseCssSize = (value?: string | null) => {
  if (!value) {
    return 0;
  }
  const parsed = parseFloat(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

const getPanelVerticalInset = (panel: HTMLElement | null) => {
  if (!panel || typeof window === 'undefined') {
    return 0;
  }
  const styles = window.getComputedStyle(panel);
  return (
    parseCssSize(styles.paddingTop) +
    parseCssSize(styles.paddingBottom) +
    parseCssSize(styles.borderTopWidth) +
    parseCssSize(styles.borderBottomWidth)
  );
};

interface Props {
  players: Player[];
  phase: GamePhase;
  selectedId: string | null;
  onSelect: (id: string) => void;
  tunnels: Tunnel[];
  disabledPlayerIds?: Set<string>;
  playerNodeScale: number;
  onTableSizeChange?: (size: number) => void;
  highlightedPlayerIds?: Set<string>;
  communistSuppressionActive?: boolean;
  bulletAnimations?: BulletAnimationEntry[];
  bulletSpeed?: number;
  bulletReplayNonce?: number;
  matrixTrapPlayerId?: string | null;
}

export const GameTable: React.FC<Props> = ({ players, phase, selectedId, onSelect, tunnels, disabledPlayerIds, playerNodeScale, onTableSizeChange, highlightedPlayerIds, communistSuppressionActive = false, bulletAnimations, bulletSpeed, bulletReplayNonce, matrixTrapPlayerId = null }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [tableSize, setTableSize] = useState(0);
  const panelHeightRef = useRef<number | null>(null);

  // Keep the circular table constrained to the available viewport space.
  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const measureAndSync = () => {
      const rect = container.getBoundingClientRect();
      const nextSize = Math.min(rect.width, rect.height);
      const panelInset = getPanelVerticalInset(container.parentElement as HTMLElement | null);
      const totalPanelHeight = rect.height + panelInset;

      if (panelHeightRef.current !== totalPanelHeight) {
        panelHeightRef.current = totalPanelHeight;
        onTableSizeChange?.(totalPanelHeight);
      }

      setTableSize(prev => (prev === nextSize ? prev : nextSize));
    };

    measureAndSync();

    if (typeof ResizeObserver === 'undefined') {
      if (typeof window !== 'undefined') {
        window.addEventListener('resize', measureAndSync);
        return () => window.removeEventListener('resize', measureAndSync);
      }
      return;
    }

    const observer = new ResizeObserver(entries => {
      const entry = entries[0];
      if (!entry) return;
      const { width, height } = entry.contentRect;
      const nextSize = Math.min(width, height);
      const panelInset = getPanelVerticalInset(container.parentElement as HTMLElement | null);
      const totalPanelHeight = height + panelInset;

      if (panelHeightRef.current !== totalPanelHeight) {
        panelHeightRef.current = totalPanelHeight;
        onTableSizeChange?.(totalPanelHeight);
      }

      setTableSize(prev => (prev === nextSize ? prev : nextSize));
    });

    observer.observe(container);
    return () => observer.disconnect();
  }, [onTableSizeChange]);
  const circleRadiusPercent = useMemo(() => {
    const BASE_RADIUS = 38;
    const MIN_RADIUS = 33;
    const MAX_RADIUS = 41;
    const outwardBias = 1.25; // keeps some buffer from the center label
    const sizeAdjustment = (() => {
      if (!tableSize) {
        return 0;
      }
      const minSize = 280;
      const maxSize = 560;
      const clamped = Math.max(minSize, Math.min(maxSize, tableSize));
      const ratio = (maxSize - clamped) / (maxSize - minSize);
      return ratio * 3; // reduce the inward pull on very small tables
    })();
    const scaleAdjustment = Math.max(0, playerNodeScale - 1) * 1.5;
    const desired = BASE_RADIUS - sizeAdjustment - scaleAdjustment + outwardBias;
    return Math.min(MAX_RADIUS, Math.max(MIN_RADIUS, desired));
  }, [tableSize, playerNodeScale]);

  const effectivePlayerNodeScale = useMemo(() => {
    if (!tableSize || players.length < 2) {
      return playerNodeScale;
    }

    const rootFontSize = typeof window !== 'undefined'
      ? parseCssSize(window.getComputedStyle(document.documentElement).fontSize) || 16
      : 16;
    const radiusPx = (circleRadiusPercent / 100) * tableSize;
    const circumference = 2 * Math.PI * radiusPx;
    const spacing = circumference / players.length;
    const maxDiameterPx = spacing * 0.9;
    const baseDiameterPx = playerNodeScale * 4 * rootFontSize;

    if (!Number.isFinite(maxDiameterPx) || maxDiameterPx <= 0 || baseDiameterPx <= 0) {
      return playerNodeScale;
    }

    const scaleToFit = maxDiameterPx / (4 * rootFontSize);
    return Math.min(playerNodeScale, scaleToFit);
  }, [circleRadiusPercent, players.length, playerNodeScale, tableSize]);

  const centerLabelScale = useMemo(() => {
    if (!tableSize) {
      return 1;
    }
    const minSize = 260;
    const maxSize = 560;
    if (tableSize >= maxSize) {
      return 1;
    }
    const minScale = 0.78;
    const ratio = (maxSize - tableSize) / (maxSize - minSize);
    return 1 - ratio * (1 - minScale);
  }, [tableSize]);

  const positioned = useMemo(() => {
    return players.map((p, i) => {
      const ang = (i / players.length) * 2 * Math.PI - Math.PI / 2;
      return { ...p, x: 50 + circleRadiusPercent * Math.cos(ang), y: 50 + circleRadiusPercent * Math.sin(ang) };
    });
  }, [players, circleRadiusPercent]);
  const isDayPhase = phase === 'DAY_ANNOUNCEMENT' || phase === 'DAY_MAIN';
  const shouldAnimateBullets = phase === 'NIGHT_REPLAY' && Boolean(bulletAnimations?.length);
  const resolvedAnimations = shouldAnimateBullets ? bulletAnimations ?? [] : [];
  const resolvedBulletSpeed = bulletSpeed ?? 500;
  const replayKey = bulletReplayNonce ?? 0;

  return (
    <div ref={containerRef} className="relative w-full h-full flex items-center justify-center">
      <div
        className="relative max-w-full max-h-full aspect-square mafia-table rounded-full"
        style={tableSize ? { width: tableSize, height: tableSize } : { width: 'min(80vw, 520px)', height: 'min(80vw, 520px)' }}
      >
        {!isDayPhase && (
          <TunnelLayer
            tunnels={tunnels}
            positions={positioned}
            playerNodeScale={effectivePlayerNodeScale}
            tableSizePx={tableSize}
          />
        )}
        {shouldAnimateBullets && (
          <BulletLayer
            key={replayKey}
            animations={resolvedAnimations}
            positions={positioned}
            bulletSpeed={resolvedBulletSpeed}
          />
        )}
        {positioned.map(p => (
          <PlayerNode
            key={p.id}
            player={p}
            x={p.x}
            y={p.y}
            phase={phase}
            isActive={selectedId === p.id}
            onClick={onSelect}
            disabled={disabledPlayerIds?.has(p.id) ?? false}
            size={effectivePlayerNodeScale}
            isHighlighted={Boolean(highlightedPlayerIds?.has(p.id))}
            communistSuppressionActive={communistSuppressionActive}
            showMatrixIcon={matrixTrapPlayerId === p.id}
          />
        ))}
        <div
          className="mafia-table__center-badge absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-2xl"
          style={{ fontSize: `${1.5 * centerLabelScale}rem` }}
        >
          MAFIA²
        </div>
      </div>
    </div>
  );
};