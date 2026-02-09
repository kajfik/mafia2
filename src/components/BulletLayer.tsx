import React, { useEffect, useMemo, useState } from 'react';
import type { BulletAnimationEntry } from '../game/types';

interface BulletLayerProps {
  animations: BulletAnimationEntry[];
  positions: { id: string; x: number; y: number }[];
  bulletSpeed: number;
}

interface BulletDot {
  id: string;
  x: number;
  y: number;
  duration: number;
}

type ShotEdge = {
  fromId: string | null;
  toId: string;
  children: ShotEdge[];
};

type ShotTree = {
  shotId: string;
  sourceId: string | null;
  roots: ShotEdge[];
};

function resolveEntrySource(entry: BulletAnimationEntry, fallback: string | null): string | null {
  const segmentSource = entry.segments.find(segment => segment.fromId)?.fromId ?? null;
  return entry.sourceId ?? segmentSource ?? fallback;
}

function resolveGroupSource(entries: BulletAnimationEntry[]): string | null {
  for (const entry of entries) {
    if (entry.sourceId) {
      return entry.sourceId;
    }
  }
  for (const entry of entries) {
    const segmentSource = entry.segments.find(segment => segment.fromId)?.fromId ?? null;
    if (segmentSource) {
      return segmentSource;
    }
  }
  return null;
}

function normalizeRootSources(roots: ShotEdge[], treeSourceId: string | null) {
  if (!roots.length) return;
  const targetToSource = new Map<string, string>();
  roots.forEach(root => {
    if (root.fromId) {
      targetToSource.set(root.toId, root.fromId);
    }
  });
  roots.forEach(root => {
    if (!root.fromId) {
      root.fromId = targetToSource.get(root.toId) ?? treeSourceId ?? null;
    }
  });
}

function buildShotTrees(entries: BulletAnimationEntry[]): ShotTree[] {
  const grouped = new Map<string, BulletAnimationEntry[]>();
  entries.forEach(entry => {
    if (!entry.segments.length) return;
    if (!grouped.has(entry.shotId)) {
      grouped.set(entry.shotId, []);
    }
    grouped.get(entry.shotId)!.push(entry);
  });

  const trees: ShotTree[] = [];
  grouped.forEach((groupEntries, shotId) => {
    const treeSourceId = resolveGroupSource(groupEntries);
    const roots: ShotEdge[] = [];
    groupEntries.forEach(entry => {
      let branch = roots;
      const entrySourceId = resolveEntrySource(entry, treeSourceId);
      const normalizedSegments = entry.segments.length ? entry.segments.map(segment => ({ ...segment })) : [];
      if (normalizedSegments.length) {
        const initialSourceId = entrySourceId ?? treeSourceId;
        if (!normalizedSegments[0].fromId && initialSourceId) {
          normalizedSegments[0].fromId = initialSourceId;
        }
      } else {
        const fallbackSource = entrySourceId ?? treeSourceId;
        if (fallbackSource) {
          normalizedSegments.push({ fromId: fallbackSource, toId: fallbackSource });
        }
      }
      normalizedSegments.forEach(segment => {
        if (!segment.toId) return;
        const fromId = segment.fromId ?? entrySourceId ?? null;
        let edge = branch.find(item => item.fromId === fromId && item.toId === segment.toId);
        if (!edge) {
          edge = { fromId, toId: segment.toId, children: [] };
          branch.push(edge);
        }
        branch = edge.children;
      });
    });
    if (roots.length) {
      normalizeRootSources(roots, treeSourceId);
      trees.push({ shotId, sourceId: treeSourceId, roots });
    }
  });
  return trees;
}

export const BulletLayer: React.FC<BulletLayerProps> = ({ animations, positions, bulletSpeed }) => {
  const [dots, setDots] = useState<BulletDot[]>([]);
  const positionMap = useMemo(() => {
    const map = new Map<string, { x: number; y: number }>();
    positions.forEach(pos => {
      map.set(pos.id, { x: pos.x, y: pos.y });
    });
    return map;
  }, [positions]);
  const shotTrees = useMemo(() => buildShotTrees(animations), [animations]);

  useEffect(() => {
    if (!shotTrees.length) {
      setDots([]);
      return;
    }

    let cancelled = false;
    const timeouts: number[] = [];
    const rafs: number[] = [];
    const duration = Math.max(200, bulletSpeed);
    const pause = Math.max(60, Math.round(duration * 0.1));

    const getPoint = (id: string | null) => (id ? positionMap.get(id) : null);
    const ensureDot = (dotId: string, point: { x: number; y: number }) => {
      setDots(prev => {
        const existing = prev.find(dot => dot.id === dotId);
        if (existing) {
          return prev.map(dot => (dot.id === dotId ? { ...dot, x: point.x, y: point.y, duration } : dot));
        }
        return [...prev, { id: dotId, x: point.x, y: point.y, duration }];
      });
    };
    const removeDot = (dotId: string) => {
      setDots(prev => prev.filter(dot => dot.id !== dotId));
    };
    const wait = (ms: number) => new Promise<void>(resolve => {
      const timeout = window.setTimeout(resolve, ms);
      timeouts.push(timeout);
    });

    const animateMove = (dotId: string, from: { x: number; y: number }, to: { x: number; y: number }) => new Promise<void>(resolve => {
      ensureDot(dotId, from);
      // Defer to a macrotask so the origin position can commit before the move.
      const timeout = window.setTimeout(() => {
        // Use a double rAF to guarantee the browser paints the starting point before moving the dot.
        const rafStart = window.requestAnimationFrame(() => {
          const rafMove = window.requestAnimationFrame(() => {
            setDots(prev => prev.map(dot => (dot.id === dotId ? { ...dot, x: to.x, y: to.y, duration } : dot)));
            const timer = window.setTimeout(() => resolve(), duration);
            timeouts.push(timer);
          });
          rafs.push(rafMove);
        });
        rafs.push(rafStart);
      }, 0);
      timeouts.push(timeout);
    });

    let branchCounter = 0;

    const traverseEdge = async (edge: ShotEdge, dotId: string, fallbackSourceId: string | null) => {
      if (cancelled) return;
      const toPoint = getPoint(edge.toId);
      if (!toPoint) {
        removeDot(dotId);
        return;
      }
      const fromPoint = getPoint(edge.fromId ?? fallbackSourceId) ?? toPoint;
      await animateMove(dotId, fromPoint, toPoint);
      if (cancelled) return;
      if (!edge.children.length) {
        await wait(pause);
        removeDot(dotId);
        return;
      }
      await wait(pause);
      const [first, ...rest] = edge.children;
      const nextFallback = edge.toId;
      const tasks: Promise<void>[] = [traverseEdge(first, dotId, nextFallback)];
      rest.forEach(child => {
        const newDotId = `${dotId}-branch-${branchCounter++}`;
        ensureDot(newDotId, toPoint);
        tasks.push(traverseEdge(child, newDotId, nextFallback));
      });
      await Promise.all(tasks);
    };

    const playShot = async (tree: ShotTree) => {
      const sequences = tree.roots.map((edge, idx) => {
        const originId = edge.fromId ?? tree.sourceId;
        const originPoint = getPoint(originId);
        const targetPoint = getPoint(edge.toId);
        const startPoint = originPoint ?? targetPoint;
        if (!startPoint) {
          return Promise.resolve();
        }
        const dotId = `${tree.shotId}-root-${idx}`;
        ensureDot(dotId, startPoint);
        return traverseEdge(edge, dotId, originId ?? edge.toId ?? null);
      });
      await Promise.all(sequences);
      await wait(pause * 2);
    };

    const play = async () => {
      for (const tree of shotTrees) {
        if (cancelled) break;
        await playShot(tree);
      }
      setDots([]);
    };

    play();

    return () => {
      cancelled = true;
      timeouts.forEach(clearTimeout);
      rafs.forEach(cancelAnimationFrame);
      setDots([]);
    };
  }, [shotTrees, bulletSpeed, positionMap]);

  if (!shotTrees.length) {
    return null;
  }

  return (
    <div className="absolute inset-0 pointer-events-none z-20">
      {dots.map(dot => (
        <div
          key={dot.id}
          className="absolute mafia-bullet"
          style={{
            left: `${dot.x}%`,
            top: `${dot.y}%`,
            transition: `left ${dot.duration}ms linear, top ${dot.duration}ms linear`
          }}
        />
      ))}
    </div>
  );
};
