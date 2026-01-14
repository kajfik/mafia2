import React, { useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import * as QRCode from 'qrcode';
import type { GameState, Player } from '../game/types';
import { computeCardLabels, formatCardLabel } from '../game/cardLabels';
import { encodePlayerLinkData } from '../utils/playerLinkEncoding';
import { getLanguageLocale, t } from '../game/translations';
import { CardLabelBadge } from './CardLabelBadge';

type LabeledCard = { card: Player['cards'][number]; label: string; isInactive: boolean };
type PlayerCardCollections = { active: LabeledCard[]; combined: LabeledCard[] };
type QrModalState = { playerName: string; url: string; dataUrl: string | null; isLoading: boolean };
type ManualCopyState = { playerName: string; url: string; reason?: string };
type ShareSupport = { available: true } | { available: false; reason: 'insecure-context' | 'unsupported' };

export const GMPlayerList: React.FC<{ state: GameState }> = ({ state }) => {
  const lang = state.settings.language;
  const labelsMap = useMemo(() => computeCardLabels(state.players, lang), [state.players, lang]);
  const locale = getLanguageLocale(lang);
  const portalTarget = typeof document !== 'undefined' ? document.body : null;
  const labeledCardsByPlayer = useMemo<Record<string, PlayerCardCollections>>(() => {
    return state.players.reduce((acc, player) => {
      const labels = labelsMap[player.id] || [];
      const active = player.cards.map((card, idx) => ({
        card,
        label: labels[idx] ?? formatCardLabel(state.players, lang, card.cardId, card.instance),
        isInactive: false
      }));
      const inactiveSource = player.inactiveCards || [];
      const inactive = inactiveSource.map(card => ({
        card,
        label: formatCardLabel(state.players, lang, card.cardId, card.instance),
        isInactive: true
      }));
      const combined = [...active, ...inactive].sort((a, b) => {
        if (a.isInactive !== b.isInactive) {
          return a.isInactive ? 1 : -1;
        }
        return a.label.localeCompare(b.label, locale, { sensitivity: 'base' });
      });
      acc[player.id] = { active, combined };
      return acc;
    }, {} as Record<string, PlayerCardCollections>);
  }, [labelsMap, locale, state.players, lang]);
  const [qrModal, setQrModal] = useState<QrModalState | null>(null);
  const [manualCopy, setManualCopy] = useState<ManualCopyState | null>(null);
  const actionButtonBase = 'w-full min-w-[8rem] inline-flex items-center justify-center gap-2 rounded text-sm font-semibold px-3 py-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-0 focus-visible:ring-[rgba(242,200,121,0.35)] shadow-[0_12px_30px_rgba(0,0,0,0.35)]';
  const playerCardBase = 'p-4 rounded-2xl border flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between transition-colors backdrop-blur';

  const shareText = (playerName: string) => t('gm_players_share_text', lang, { player: playerName });

  const getShareSupport = (): ShareSupport => {
    if (typeof window === 'undefined') return { available: false, reason: 'unsupported' };
    const isSecure = window.isSecureContext || window.location.hostname === 'localhost';
    if (!isSecure) {
      return { available: false, reason: 'insecure-context' };
    }
    if (typeof navigator === 'undefined' || typeof navigator.share !== 'function') {
      return { available: false, reason: 'unsupported' };
    }
    return { available: true };
  };

  const buildPlayerLink = (player: Player, labeledCards: LabeledCard[]) => {
    if (typeof window === 'undefined') return '';
    const payload = {
      name: player.name,
      cards: labeledCards.map(entry => entry.card),
      lang,
      labels: labeledCards.map(entry => entry.label)
    };
    const code = encodePlayerLinkData(payload);
    const { origin, pathname } = window.location;
    return `${origin}${pathname}?data=${code}`;
  };

  const shareDataForLink = (playerName: string, url: string): ShareData => {
    const base: ShareData = {
      title: t('gm_players_share_title', lang, { player: playerName }),
      text: shareText(playerName)
    };
    if (typeof window !== 'undefined') {
      const isHttps = url.startsWith('https://');
      const isLocalhost = /^https?:\/\/(localhost|127\.0\.0\.1)(:\\d+)?/i.test(url);
      if (isHttps || isLocalhost) {
        base.url = url;
        return base;
      }
    }
    base.text = `${base.text} ${url}`;
    return base;
  };

  const attemptClipboardCopy = async (url: string) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
      try {
        await navigator.clipboard.writeText(url);
        return true;
      } catch (error) {
        console.error('Clipboard API write failed', error);
      }
    }

    if (typeof document !== 'undefined') {
      const hiddenInput = document.createElement('input');
      hiddenInput.value = url;
      hiddenInput.setAttribute('readonly', '');
      hiddenInput.style.position = 'absolute';
      hiddenInput.style.left = '-9999px';
      hiddenInput.style.fontSize = '16px';
      document.body.appendChild(hiddenInput);
      hiddenInput.select();
      hiddenInput.setSelectionRange(0, url.length);
      try {
        const succeeded = document.execCommand('copy');
        document.body.removeChild(hiddenInput);
        return succeeded;
      } catch (error) {
        document.body.removeChild(hiddenInput);
        console.error('execCommand copy failed', error);
      }
    }

    return false;
  };

  const copyLinkToClipboard = async (url: string, playerName: string, reason?: ManualCopyState['reason']) => {
    const copied = await attemptClipboardCopy(url);
    if (copied) {
      alert(t('gm_players_copy_success', lang, { player: playerName }));
      return true;
    }

    setManualCopy({ playerName, url, reason });
    return false;
  };

  const handleShareClick = async (player: Player, labeledCards: LabeledCard[]) => {
    const url = buildPlayerLink(player, labeledCards);
    if (!url) return;

    const shareSupport = getShareSupport();
    if (shareSupport.available) {
      const shareData = shareDataForLink(player.name, url);
      try {
        await navigator.share(shareData);
        return;
      } catch (error) {
        const domError = error as DOMException;
        if (domError?.name === 'AbortError') {
          return;
        }
        console.error('Web Share API failed', error);
        setManualCopy({ playerName: player.name, url, reason: t('gm_players_share_failure_reason', lang) });
        return;
      }
    }

    const reason = shareSupport.reason === 'insecure-context'
      ? t('gm_players_share_insecure', lang)
      : t('gm_players_share_unsupported', lang);
    await copyLinkToClipboard(url, player.name, reason);
  };

  const handleQrClick = async (player: Player, labeledCards: LabeledCard[]) => {
    const url = buildPlayerLink(player, labeledCards);
    if (!url) return;

    setQrModal({ playerName: player.name, url, dataUrl: null, isLoading: true });
    try {
      const dataUrl = await QRCode.toDataURL(url, { width: 256, margin: 1 });
      setQrModal(prev => (prev && prev.url === url ? { ...prev, dataUrl, isLoading: false } : prev));
    } catch (error) {
      console.error('QR code generation failed', error);
      alert(t('gm_players_qr_error', lang));
      await copyLinkToClipboard(url, player.name);
      setQrModal(null);
    }
  };

  const closeQrModal = () => setQrModal(null);
  const closeManualCopy = () => setManualCopy(null);

  const handleManualCopyButton = async () => {
    if (!manualCopy) return;
    const copied = await attemptClipboardCopy(manualCopy.url);
    if (copied) {
      alert(t('gm_players_copy_success', lang, { player: manualCopy.playerName }));
      setManualCopy(null);
    }
  };

  return (
    <div className="h-full overflow-y-auto text-white px-3 pt-6 pb-24 sm:px-4 sm:pt-8 space-y-6">
      <h2 className="text-2xl font-bold mb-4 mafia-title text-[var(--color-brass)]">
        {t('gm_players_title', lang, { count: state.players.length })}
      </h2>
      <div className="grid gap-3">
        {state.players.map(p => {
          const cardCollections = labeledCardsByPlayer[p.id] || { active: [], combined: [] };
          const { active, combined } = cardCollections;
          const activeCardInstances = active.map(entry => entry.card);
          return (
            <div
              key={p.id}
              className={`${playerCardBase} ${p.status.isAlive
                ? 'bg-[rgba(15,12,20,0.82)] border-[rgba(242,200,121,0.18)]'
                : 'bg-[rgba(50,12,12,0.7)] border-[rgba(197,83,61,0.4)] text-slate-400'} ${p.status.isAlive ? '' : 'grayscale'}`}
            >
              <div className="flex-1">
                <div className="font-bold text-lg text-[var(--color-brass)]">{p.name}</div>
                <div className="text-sm text-slate-200/85 flex flex-wrap gap-1.5">
                  {combined.length ? combined.map((entry, idx) => (
                    <CardLabelBadge
                      key={`${entry.card.cardId}-${entry.card.instance}-${idx}`}
                      cardId={entry.card.cardId}
                      label={entry.label}
                      size="sm"
                      className={`${entry.isInactive
                        ? 'text-[rgba(255,255,255,0.4)] bg-[rgba(197,83,61,0.18)] border border-[rgba(197,83,61,0.35)]'
                        : 'text-slate-50 bg-[rgba(242,200,121,0.12)] border border-[rgba(242,200,121,0.28)]' } px-2 py-0.5 rounded-full`}
                      labelClassName={entry.isInactive ? 'line-through decoration-[rgba(197,83,61,0.65)] decoration-2' : ''}
                    />
                  )) : (
                    <span className="text-[rgba(242,200,121,0.55)] italic">{t('gm_players_no_cards', lang)}</span>
                  )}
                </div>
                <div className="text-xs text-[rgba(242,200,121,0.7)] mt-2 flex gap-4">
                  <span>❤️ {activeCardInstances.filter(card => card.cardId === 'CloudWalker').length}</span>
                  <span>🛡️ {activeCardInstances.some(card => card.cardId === 'KevlarVest') ? t('ui_yes', lang) : t('ui_no', lang)}</span>
                </div>
              </div>
              <div className="flex flex-col gap-2 w-full sm:w-48 sm:flex-none">
                <button
                  type="button"
                  onClick={() => handleShareClick(p, active)}
                  className={`${actionButtonBase} mafia-button mafia-button--ember`}
                >
                  <span aria-hidden>🔗</span>
                  {t('gm_players_share_button', lang)}
                </button>
                <button
                  type="button"
                  onClick={() => handleQrClick(p, active)}
                  className={`${actionButtonBase} border border-[rgba(242,200,121,0.35)] text-[var(--color-brass)] bg-[rgba(242,200,121,0.08)] hover:bg-[rgba(242,200,121,0.15)]`}
                >
                  <span aria-hidden>📱</span>
                  {t('gm_players_qr_button', lang)}
                </button>
              </div>
            </div>
          );
        })}
      </div>
      {portalTarget && qrModal && createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="relative max-w-sm w-full rounded-2xl border border-[rgba(242,200,121,0.25)] bg-[rgba(12,10,16,0.95)] p-6 text-center shadow-[0_25px_55px_rgba(0,0,0,0.7)]">
            <button
              type="button"
              aria-label={t('gm_players_modal_close_qr_aria', lang)}
              className="absolute right-3 top-3 rounded-full p-1 text-slate-400 transition hover:text-white"
              onClick={closeQrModal}
            >
              ✖
            </button>
            <h3 className="text-xl font-semibold mb-1 text-[var(--color-brass)]">{qrModal.playerName}</h3>
            <p className="text-sm text-[rgba(242,200,121,0.75)] mb-4">{t('gm_players_qr_instruction', lang)}</p>
            {qrModal.isLoading || !qrModal.dataUrl ? (
              <div className="text-[rgba(242,200,121,0.7)] text-sm">{t('gm_players_qr_generating', lang)}</div>
            ) : (
              <img
                src={qrModal.dataUrl}
                alt={`QR code for ${qrModal.playerName}`}
                className="mx-auto h-56 w-56 rounded bg-[rgba(242,200,121,0.08)] p-2 border border-[rgba(242,200,121,0.25)]"
              />
            )}
            <button
              type="button"
              className="mt-4 text-sm font-semibold text-[var(--color-brass)] underline"
              onClick={() => copyLinkToClipboard(qrModal.url, qrModal.playerName)}
            >
              {t('gm_players_copy_link_instead', lang)}
            </button>
          </div>
        </div>,
        portalTarget
      )}
      {portalTarget && manualCopy && createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="relative max-w-lg w-full rounded-2xl border border-[rgba(242,200,121,0.25)] bg-[rgba(12,10,16,0.95)] p-6 text-left shadow-[0_25px_55px_rgba(0,0,0,0.7)]">
            <button
              type="button"
              aria-label={t('gm_players_modal_close_manual_aria', lang)}
              className="absolute right-3 top-3 rounded-full p-1 text-slate-400 transition hover:text-white"
              onClick={closeManualCopy}
            >
              ✖
            </button>
            <h3 className="text-xl font-semibold mb-2 text-[var(--color-brass)]">{t('gm_players_manual_copy_title', lang)}</h3>
            <p className="text-sm text-[rgba(242,200,121,0.75)] mb-4">
              {manualCopy.reason ?? t('gm_players_manual_copy_fallback', lang, { name: manualCopy.playerName })}
            </p>
            <label className="text-xs uppercase tracking-[0.4em] text-[rgba(242,200,121,0.6)] mb-1 block">
              {t('gm_players_manual_copy_label', lang)}
            </label>
            <textarea
              readOnly
              value={manualCopy.url}
              className="w-full rounded-xl border border-[rgba(242,200,121,0.25)] bg-[rgba(15,12,20,0.85)] p-3 text-sm text-white focus:outline-none"
              rows={3}
            />
            <div className="flex flex-col sm:flex-row gap-2 mt-4">
              <button
                type="button"
                onClick={handleManualCopyButton}
                className="flex-1 rounded mafia-button mafia-button--ember px-4 py-2 text-sm font-semibold"
              >
                {t('gm_players_manual_copy_copy', lang)}
              </button>
              <button
                type="button"
                onClick={closeManualCopy}
                className="flex-1 rounded border border-[rgba(242,200,121,0.25)] px-4 py-2 text-sm font-semibold text-[var(--color-brass)] hover:bg-[rgba(242,200,121,0.08)]"
              >
                {t('gm_players_manual_copy_close', lang)}
              </button>
            </div>
          </div>
        </div>,
        portalTarget
      )}
    </div>
  );
};