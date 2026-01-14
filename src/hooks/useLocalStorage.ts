import { useState, useCallback } from 'react';
import type { UndoWrapper } from '../game/types';

const STORAGE_KEY = 'mafia_manager_state';

export function useGameStorage() {
  const [savedState, setSavedState] = useState<UndoWrapper | null>(() => {
    try {
      const item = localStorage.getItem(STORAGE_KEY);
      return item ? JSON.parse(item) : null;
    } catch (e) {
      console.error("Failed to load save", e);
      return null;
    }
  });

  const saveGame = useCallback((wrapper: UndoWrapper) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(wrapper));
      setSavedState(wrapper);
    } catch (e) {
      console.error("Failed to save game", e);
    }
  }, []);

  const clearSave = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setSavedState(null);
  }, []);

  return { savedState, saveGame, clearSave };
}