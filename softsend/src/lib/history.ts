"use client";

import type { RewriteHistoryItem, Tone } from "./types";

const HISTORY_KEY = "softsend_history";
const MAX_ITEMS = 10;

export function getHistory(): RewriteHistoryItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function addToHistory(
  original: string,
  rewritten: string,
  tone: Tone
): void {
  if (typeof window === "undefined") return;
  const item: RewriteHistoryItem = {
    id: crypto.randomUUID(),
    original,
    rewritten,
    tone,
    createdAt: new Date().toISOString(),
  };
  const current = getHistory();
  const updated = [item, ...current].slice(0, MAX_ITEMS);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
}
