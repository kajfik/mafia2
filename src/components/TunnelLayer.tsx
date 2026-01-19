import React, { useEffect, useId, useMemo, useRef, useState } from 'react';
import type { Tunnel } from '../game/types';
import { PLAYER_NODE_SCALE_MIN, PLAYER_NODE_SCALE_MAX } from '../game/gameReducer';

const tunnelThemes = [
  {
    beam: 'rgba(197, 83, 61, 0.8)',
    highlight: 'rgba(242, 200, 121, 0.95)',
    capFill: 'rgba(36, 18, 14, 0.9)',
    capStroke: 'rgba(242, 200, 121, 0.55)'
  },
  {
    beam: 'rgba(123, 198, 140, 0.85)',
    highlight: 'rgba(222, 255, 235, 0.95)',
    capFill: 'rgba(9, 24, 19, 0.92)',
    capStroke: 'rgba(137, 227, 179, 0.65)'
  },
  {
    beam: 'rgba(124, 134, 182, 0.85)',
    highlight: 'rgba(227, 233, 255, 0.95)',
    capFill: 'rgba(18, 21, 34, 0.92)',
    capStroke: 'rgba(139, 148, 190, 0.6)'
  }
] as const;

const formatPercent = (value: number) => `${value}%`;
const ROOT_FONT_FALLBACK = 16;

const readRootFontSize = () => {
  if (typeof window === 'undefined') {
    return ROOT_FONT_FALLBACK;
  }
  const value = parseFloat(window.getComputedStyle(document.documentElement).fontSize);
  return Number.isFinite(value) ? value : ROOT_FONT_FALLBACK;
};

interface TunnelLayerProps {
  tunnels: Tunnel[];
  positions: { id: string; x: number; y: number }[];
  playerNodeScale: number;
  tableSizePx: number;
}

type TunnelCssVars = React.CSSProperties & {
  '--tunnel-speed'?: string;
  '--tunnel-highlight-speed'?: string;
};

export const TunnelLayer: React.FC<TunnelLayerProps> = ({ tunnels, positions, playerNodeScale, tableSizePx }) => {
  const layerRef = useRef<SVGSVGElement | null>(null);
  const uniqueId = useId();
  const glowFilterId = `tunnel-glow-${uniqueId}`;
  const [rootFontSize, setRootFontSize] = useState(() => readRootFontSize());

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const handleResize = () => setRootFontSize(readRootFontSize());
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const svg = layerRef.current;
    if (!svg) return;
    let rafId: number;
    let flowOffset = 0;
    const step = () => {
      flowOffset -= 0.4;
      svg.style.setProperty('--tunnel-flow-offset', flowOffset.toString());
      svg.style.setProperty('--tunnel-highlight-offset', (flowOffset * 1.4).toString());
      rafId = window.requestAnimationFrame(step);
    };
    rafId = window.requestAnimationFrame(step);
    return () => window.cancelAnimationFrame(rafId);
  }, []);

  const getPos = (id: string) => positions.find(p => p.id === id);

  const clampedScale = useMemo(
    () => Math.min(PLAYER_NODE_SCALE_MAX, Math.max(PLAYER_NODE_SCALE_MIN, playerNodeScale)),
    [playerNodeScale]
  );

  const circleRadiusPercent = useMemo(() => {
    if (!tableSizePx) {
      return null;
    }
    const circleDiameterRem = 3 * clampedScale; // matches PlayerNode inner circle sizing
    const radiusPx = (circleDiameterRem * rootFontSize) / 2;
    return (radiusPx / tableSizePx) * 100;
  }, [clampedScale, rootFontSize, tableSizePx]);

  const sourceTrim = circleRadiusPercent ?? 5;
  const targetTrim = circleRadiusPercent ?? 5;

  const trimLine = (source: { x: number; y: number }, target: { x: number; y: number }) => {
    const dx = target.x - source.x;
    const dy = target.y - source.y;
    const dist = Math.hypot(dx, dy) || 1;
    const safeStartTrim = Math.min(sourceTrim, dist / 2);
    const safeEndTrim = Math.min(targetTrim, dist / 2);
    const startX = source.x + (dx * safeStartTrim) / dist;
    const startY = source.y + (dy * safeStartTrim) / dist;
    const endX = target.x - (dx * safeEndTrim) / dist;
    const endY = target.y - (dy * safeEndTrim) / dist;
    return { startX, startY, endX, endY };
  };

  return (
    <svg ref={layerRef} className="tunnel-layer absolute inset-0 w-full h-full pointer-events-none z-0">
      <defs>
        <filter id={glowFilterId} x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="2.1" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {tunnels.map((tunnel, tunnelIdx) => {
        const source = getPos(tunnel.sourceId);
        const target = getPos(tunnel.targetId);

        if (!source || !target) return null;

        const theme = tunnelThemes[tunnelIdx % tunnelThemes.length];
        const { startX, startY, endX, endY } = trimLine(source, target);
        const speedBase = 0.85 + (tunnelIdx % 4) * 0.18;
        const beamStyle: TunnelCssVars = { '--tunnel-speed': speedBase.toFixed(2) };
        const highlightStyle: TunnelCssVars = { '--tunnel-highlight-speed': (speedBase * 1.35).toFixed(2) };

        return (
          <g key={tunnel.id} className="tunnel-layer__tunnel" filter={`url(#${glowFilterId})`}>
            <line
              className="tunnel-layer__beam"
              x1={formatPercent(startX)}
              y1={formatPercent(startY)}
              x2={formatPercent(endX)}
              y2={formatPercent(endY)}
              stroke={theme.beam}
              strokeWidth={3.2}
              style={beamStyle}
            />
            <line
              className="tunnel-layer__beam tunnel-layer__beam--highlight"
              x1={formatPercent(startX)}
              y1={formatPercent(startY)}
              x2={formatPercent(endX)}
              y2={formatPercent(endY)}
              stroke={theme.highlight}
              strokeWidth={1.8}
              style={highlightStyle}
            />
            <circle
              className="tunnel-layer__cap"
              cx={formatPercent(startX)}
              cy={formatPercent(startY)}
              r="1.5"
              fill={theme.capFill}
              stroke={theme.capStroke}
              strokeWidth={1.2}
            />
            <circle
              className="tunnel-layer__cap tunnel-layer__cap--target"
              cx={formatPercent(endX)}
              cy={formatPercent(endY)}
              r="1.8"
              fill={theme.capFill}
              stroke={theme.highlight}
              strokeWidth={1.4}
            />
          </g>
        );
      })}
    </svg>
  );
};