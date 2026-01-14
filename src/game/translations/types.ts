export type RuleContentBlock =
  | { kind: 'paragraph'; text: string }
  | { kind: 'list'; title?: string; ordered?: boolean; items: string[] };

export interface RuleSection {
  title: string;
  blocks: RuleContentBlock[];
  subsections?: RuleSection[];
}
