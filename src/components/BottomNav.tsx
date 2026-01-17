import React from 'react';
import {
  BookOpenTextIcon,
  CardsIcon,
  GameControllerIcon,
  GearSixIcon,
  PokerChipIcon,
  ScrollIcon,
  UsersThreeIcon,
} from '@phosphor-icons/react';
import type { IconWeight } from '@phosphor-icons/react';
import type { Language } from '../game/types';
import { t } from '../game/translations';

type Tab = 'GAME' | 'PLAYERS' | 'LOGS' | 'CARDS' | 'SETTINGS' | 'RULES';

interface BottomNavProps {
  activeTab: Tab;
  setTab: (t: Tab) => void;
  isGm: boolean;
  language: Language;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, setTab, isGm, language }) => {
  const btnClass = (tab: Tab) =>
    `flex-1 flex flex-col items-center justify-center gap-1 py-2 px-1 transition-colors ${
      activeTab === tab ? 'text-[var(--color-brass)]' : 'text-slate-400 hover:text-white/90'
    }`;
  const navHeight = 'calc(4rem + var(--safe-area-bottom, env(safe-area-inset-bottom, 0px)))';
  const baseLabelClass = 'tracking-[0.18em] uppercase';
  const gmTextClass = `text-[0.6rem] ${baseLabelClass}`;
  const playerTextClass = `text-[0.55rem] ${baseLabelClass}`;
  const iconClass = 'transition-transform duration-200 drop-shadow-[0_3px_8px_rgba(0,0,0,0.45)]';
  const iconProps = (tab: Tab) => {
    const weight: IconWeight = activeTab === tab ? 'fill' : 'regular';
    return {
      size: 22,
      weight,
      className: iconClass,
    };
  };
  
  return (
    <div
      className="mafia-nav fixed inset-x-0 bottom-0 w-full flex z-50 text-white"
      style={{ height: navHeight, paddingBottom: 'var(--safe-area-bottom, env(safe-area-inset-bottom, 0px))' }}
    >
      {isGm ? (
        <>
          <button onClick={() => setTab('GAME')} className={btnClass('GAME')} data-active={activeTab === 'GAME'}>
            <GameControllerIcon {...iconProps('GAME')} aria-hidden />
            <span className={gmTextClass}>{t('nav_game', language)}</span>
          </button>
          <button onClick={() => setTab('PLAYERS')} className={btnClass('PLAYERS')} data-active={activeTab === 'PLAYERS'}>
            <UsersThreeIcon {...iconProps('PLAYERS')} aria-hidden />
            <span className={gmTextClass}>{t('nav_players', language)}</span>
          </button>
          <button onClick={() => setTab('LOGS')} className={btnClass('LOGS')} data-active={activeTab === 'LOGS'}>
            <ScrollIcon {...iconProps('LOGS')} aria-hidden />
            <span className={gmTextClass}>{t('nav_logs', language)}</span>
          </button>
          <button onClick={() => setTab('RULES')} className={btnClass('RULES')} data-active={activeTab === 'RULES'}>
            <BookOpenTextIcon {...iconProps('RULES')} aria-hidden />
            <span className={gmTextClass}>{t('nav_rules', language)}</span>
          </button>
          <button onClick={() => setTab('CARDS')} className={btnClass('CARDS')} data-active={activeTab === 'CARDS'}>
            <CardsIcon {...iconProps('CARDS')} aria-hidden />
            <span className={gmTextClass}>{t('nav_cards', language)}</span>
          </button>
          <button onClick={() => setTab('SETTINGS')} className={btnClass('SETTINGS')} data-active={activeTab === 'SETTINGS'}>
            <GearSixIcon {...iconProps('SETTINGS')} aria-hidden />
            <span className={gmTextClass}>{t('nav_settings', language)}</span>
          </button>
          
        </>
      ) : (
        <>
          <button onClick={() => setTab('GAME')} className={btnClass('GAME')} data-active={activeTab === 'GAME'}>
            <PokerChipIcon {...iconProps('GAME')} aria-hidden />
            <span className={playerTextClass}>{t('nav_my_cards', language)}</span>
          </button>
          <button onClick={() => setTab('CARDS')} className={btnClass('CARDS')} data-active={activeTab === 'CARDS'}>
            <CardsIcon {...iconProps('CARDS')} aria-hidden />
            <span className={playerTextClass}>{t('nav_all_cards', language)}</span>
          </button>
          <button onClick={() => setTab('RULES')} className={btnClass('RULES')} data-active={activeTab === 'RULES'}>
            <BookOpenTextIcon {...iconProps('RULES')} aria-hidden />
            <span className={playerTextClass}>{t('nav_rules', language)}</span>
          </button>
          <button onClick={() => setTab('SETTINGS')} className={btnClass('SETTINGS')} data-active={activeTab === 'SETTINGS'}>
            <GearSixIcon {...iconProps('SETTINGS')} aria-hidden />
            <span className={playerTextClass}>{t('nav_settings', language)}</span>
          </button>
        </>
      )}
    </div>
  );
};