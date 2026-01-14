import { useMemo } from 'react';
import { decodePlayerLinkData, type PlayerLinkData } from '../utils/playerLinkEncoding';

export function usePlayerLinkData(): PlayerLinkData | null {
  return useMemo(() => {
    if (typeof window === 'undefined') return null;
    const params = new URLSearchParams(window.location.search);
    const data = params.get('data');
    if (!data) return null;
    return decodePlayerLinkData(data);
  }, []);
}
