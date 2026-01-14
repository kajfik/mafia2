import React, { useMemo } from 'react';
import type { CardId, Language } from '../game/types';
import { CARD_IDS } from '../game/types';
import type { RuleSection, RuleContentBlock } from '../game/translations';
import { RULES_CONTENT, getCardName, t } from '../game/translations';
import { CardLabelBadge } from './CardLabelBadge';

interface RulesViewProps {
  language?: Language;
}

type CardNameLookup = Record<string, { cardId: CardId; label: string }>;

const normalizeCardKey = (value: string) => value.trim().toLowerCase();

const renderBlock = (block: RuleContentBlock, key: string, cardLookup: CardNameLookup) => {
  if (block.kind === 'paragraph') {
    return (
      <p key={key} className="text-slate-100/90 leading-relaxed">
        {block.text}
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
        {block.title && <p className="text-[var(--color-brass)] text-sm font-semibold tracking-[0.2em] uppercase">{block.title}</p>}
        <ListTag className={listClass}>
          {block.items.map((item, idx) => {
            const normalized = normalizeCardKey(item);
            const matchedCard = cardLookup[normalized];
            return (
              <li key={`${key}-item-${idx}`}>
                {matchedCard ? (
                  <CardLabelBadge
                    cardId={matchedCard.cardId}
                    label={matchedCard.label}
                    size="sm"
                    className="inline-flex px-2 py-0.5 rounded-full border border-[rgba(242,200,121,0.25)] bg-[rgba(242,200,121,0.08)] text-[var(--color-brass)]"
                  />
                ) : (
                  item
                )}
              </li>
            );
          })}
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
}

const SectionCard: React.FC<SectionCardProps> = ({ section, level = 1, renderBlockFn }) => {
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
      <HeadingTag className={headingClass}>{section.title}</HeadingTag>
      <div className="space-y-3">
        {section.blocks.map((block, idx) => renderBlockFn(block, `${section.title}-block-${idx}`))}
      </div>

      {section.subsections?.length ? (
        <div className="space-y-4">
          {section.subsections.map((sub, idx) => (
            <SectionCard key={`${section.title}-sub-${idx}`} section={sub} level={level + 1} renderBlockFn={renderBlockFn} />
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
  const cardLookup = useMemo<CardNameLookup>(() => {
    const lookup: CardNameLookup = {};
    CARD_IDS.forEach(cardId => {
      const label = getCardName(cardId, language);
      lookup[normalizeCardKey(label)] = { cardId, label };
    });
    return lookup;
  }, [language]);
  const renderBlockWithCards = (block: RuleContentBlock, key: string) => renderBlock(block, key, cardLookup);

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
            <SectionCard key={section.title} section={section} renderBlockFn={renderBlockWithCards} />
          ))}
        </section>
      )}
    </div>
  );
};