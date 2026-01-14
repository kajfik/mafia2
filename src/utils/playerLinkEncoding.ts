import type { CardId, Language } from '../game/types';

export interface PlayerLinkCard {
  cardId: CardId;
  instance: number;
}

export interface PlayerLinkData {
  name: string;
  cards: PlayerLinkCard[];
  labels?: string[];
  lang: Language;
}

const textEncoder = new TextEncoder();
const textDecoder = new TextDecoder();

const toBinaryString = (bytes: Uint8Array) => {
  let binary = '';
  bytes.forEach(byte => {
    binary += String.fromCharCode(byte);
  });
  return binary;
};

const fromBinaryString = (binary: string) => Uint8Array.from(binary, char => char.charCodeAt(0));

export const encodePlayerLinkData = (data: PlayerLinkData) => {
  const json = JSON.stringify(data);
  const binary = toBinaryString(textEncoder.encode(json));
  return btoa(binary);
};

export const decodePlayerLinkData = (encoded: string): PlayerLinkData | null => {
  try {
    const binary = atob(encoded);
    const json = textDecoder.decode(fromBinaryString(binary));
    return JSON.parse(json) as PlayerLinkData;
  } catch {
    return null;
  }
};
