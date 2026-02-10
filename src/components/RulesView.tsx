import React, { useMemo } from 'react';
import type { CardId, Language } from '../game/types';
import { CARD_IDS } from '../game/types';
import type { RuleSection, RuleContentBlock } from '../game/translations';
import { RULES_CONTENT, getCardName, t } from '../game/translations';
import { LineSegmentIcon } from '@phosphor-icons/react';
import { CardLabelBadge } from './CardLabelBadge';
import { GasMaskGlyph } from './CardDisplay';

interface RulesViewProps {
  language?: Language;
}

type CardLabelLookup = Record<CardId, string>;

const TOKEN_PATTERN = /\{\{(card:([A-Za-z0-9]+)(?:\|([^}]+))?|gasMask(?:\|([^}]+))?|tunnel(?:\|([^}]+))?)\}\}/g;

const GasMaskBadge: React.FC<{ label: string }> = ({ label }) => (
  <span
    className="inline-flex items-center gap-1 leading-tight rounded-full border align-baseline px-2 py-0.5 border-[rgba(132,201,178,0.4)] bg-[rgba(132,201,178,0.08)] text-[#a9f5d0] mx-0.5"
    title={label}
  >
    <span
      className="h-5 w-5 inline-flex self-center shrink-0 items-center justify-center rounded-full border border-[rgba(132,201,178,0.4)] bg-[rgba(132,201,178,0.08)] text-[#a9f5d0]"
      aria-hidden
    >
      <GasMaskGlyph className="h-3 w-3" />
    </span>
    <span>{label}</span>
  </span>
);

const TunnelBadge: React.FC<{ label: string }> = ({ label }) => (
  <span
    className="inline-flex items-center gap-1 leading-tight rounded-full border align-baseline px-2 py-0.5 border-[rgba(197,83,61,0.45)] bg-[rgba(197,83,61,0.12)] text-[rgba(255,188,150,0.95)] mx-0.5"
    title={label}
  >
    <span
      className="h-5 w-5 inline-flex self-center shrink-0 items-center justify-center rounded-full border border-[rgba(197,83,61,0.45)] bg-[rgba(197,83,61,0.12)] text-[rgba(255,188,150,0.95)]"
      aria-hidden
    >
      <LineSegmentIcon className="h-3 w-3" weight="bold" />
    </span>
    <span>{label}</span>
  </span>
);

const renderRichText = (text: string, key: string, cardLabels: CardLabelLookup) => {
  const nodes: React.ReactNode[] = [];
  const regex = new RegExp(TOKEN_PATTERN);
  let lastIndex = 0;
  let cardIndex = 0;
  let gasMaskIndex = 0;
  let tunnelIndex = 0;
  let textIndex = 0;

  const pushText = (value: string) => {
    if (!value) return;
    nodes.push(
      <React.Fragment key={`${key}-text-${textIndex++}`}>
        {value}
      </React.Fragment>
    );
  };

  let match: RegExpExecArray | null;
  while ((match = regex.exec(text)) !== null) {
    const [fullMatch, rawToken, rawCardId, rawLabel, rawGasMaskLabel, rawTunnelLabel] = match;
    pushText(text.slice(lastIndex, match.index));
    if (rawToken.startsWith('card:')) {
      const cardId = rawCardId as CardId;
      const label = (rawLabel ?? '').trim() || cardLabels[cardId];
      if (!cardLabels[cardId]) {
        pushText(fullMatch);
      } else {
        nodes.push(
          <CardLabelBadge
            key={`${key}-card-${cardIndex++}`}
            cardId={cardId}
            label={label}
            size="xs"
            variant="inline"
            className="mx-0.5 align-baseline"
          />
        );
      }
    } else if (rawToken.startsWith('gasMask')) {
      const label = (rawGasMaskLabel ?? '').trim() || 'Gas Mask';
      nodes.push(
        <GasMaskBadge key={`${key}-gas-${gasMaskIndex++}`} label={label} />
      );
    } else {
      const label = (rawTunnelLabel ?? '').trim() || 'Tunnel';
      nodes.push(
        <TunnelBadge key={`${key}-tunnel-${tunnelIndex++}`} label={label} />
      );
    }
    lastIndex = regex.lastIndex;
  }

  pushText(text.slice(lastIndex));

  if (nodes.length === 0) {
    return text;
  }

  return nodes.length === 1 ? nodes[0] : nodes;
};

const renderBlock = (
  block: RuleContentBlock,
  key: string,
  renderText: (text: string, key: string) => React.ReactNode
) => {
  if (block.kind === 'paragraph') {
    return (
      <p key={key} className="text-slate-100/90 leading-relaxed">
        {renderText(block.text, `${key}-paragraph`)}
      </p>
    );
  }

  if (block.kind === 'list') {
    const ListTag = block.ordered ? 'ol' : 'ul';
    const listClass = block.ordered
      ? 'list-decimal list-inside space-y-1 text-slate-100/90'
      : 'list-disc list-inside space-y-1 text-slate-100/90';

    return (
      <div key={key} className="space-y-2">
        {block.title && (
          <p className="text-[var(--color-brass)] text-sm font-semibold tracking-[0.2em] uppercase">
            {renderText(block.title, `${key}-title`)}
          </p>
        )}
        <ListTag className={listClass}>
          {block.items.map((item, idx) => (
            <li key={`${key}-item-${idx}`}>
              {renderText(item, `${key}-item-${idx}`)}
            </li>
          ))}
        </ListTag>
      </div>
    );
  }

  return null;
};

interface SectionCardProps {
  section: RuleSection;
  level?: number;
  renderBlockFn: (block: RuleContentBlock, key: string) => React.ReactNode;
  renderText: (text: string, key: string) => React.ReactNode;
}

const SectionCard: React.FC<SectionCardProps> = ({ section, level = 1, renderBlockFn, renderText }) => {
  const HeadingTag = level === 1 ? 'h3' : level === 2 ? 'h4' : 'h5';
  const containerClass =
    level === 1
      ? 'bg-[rgba(15,12,20,0.9)] border-[rgba(242,200,121,0.25)]'
      : level === 2
        ? 'bg-[rgba(12,10,16,0.85)] border-[rgba(242,200,121,0.18)]'
        : 'bg-[rgba(10,8,14,0.65)] border-[rgba(242,200,121,0.12)] border-dashed';
  const headingClass =
    level === 1
      ? 'text-xl font-semibold text-[var(--color-brass)] tracking-[0.25em] uppercase'
      : level === 2
        ? 'text-lg font-semibold text-slate-100'
        : 'text-sm font-semibold text-slate-200 uppercase tracking-[0.35em]';

  return (
    <article className={`rounded-lg border p-4 sm:p-5 space-y-4 ${containerClass}`}>
      <HeadingTag className={headingClass}>{renderText(section.title, `${section.title}-heading`)}</HeadingTag>
      <div className="space-y-3">
        {section.blocks.map((block, idx) => renderBlockFn(block, `${section.title}-block-${idx}`))}
      </div>

      {section.subsections?.length ? (
        <div className="space-y-4">
          {section.subsections.map((sub, idx) => (
            <SectionCard
              key={`${section.title}-sub-${idx}`}
              section={sub}
              level={level + 1}
              renderBlockFn={renderBlockFn}
              renderText={renderText}
            />
          ))}
        </div>
      ) : null}
    </article>
  );
};

export const RulesView: React.FC<RulesViewProps> = ({ language = 'pl' }) => {
  const sections = RULES_CONTENT[language] ?? [];
  const headingTitle = t('rules_header_title', language);
  const emptyMessage = t('rules_missing_language', language);
  const cardLabels = useMemo<CardLabelLookup>(() => {
    const lookup = {} as CardLabelLookup;
    CARD_IDS.forEach(cardId => {
      const label = getCardName(cardId, language);
      lookup[cardId] = label;
    });
    return lookup;
  }, [language]);
  const renderText = (text: string, key: string) => renderRichText(text, key, cardLabels);
  const renderBlockWithCards = (block: RuleContentBlock, key: string) => renderBlock(block, key, renderText);

  return (
    <div className="h-full overflow-y-auto text-white space-y-8 px-3 pt-6 pb-24 sm:px-4 sm:pt-8">
      <header>
        <h2 className="text-2xl font-bold mb-2 mafia-title text-[var(--color-brass)]">{headingTitle}</h2>
      </header>

      {sections.length === 0 ? (
        <div className="bg-[rgba(15,12,20,0.82)] border border-[rgba(242,200,121,0.25)] rounded-2xl p-6 text-[rgba(242,200,121,0.8)]">
          {emptyMessage}
        </div>
      ) : (
        <section className="space-y-6">
          {sections.map(section => (
            <SectionCard
              key={section.title}
              section={section}
              renderBlockFn={renderBlockWithCards}
              renderText={renderText}
            />
          ))}
        </section>
      )}
    </div>
  );
};