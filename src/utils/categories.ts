import { useEffect, useState } from 'react';

export interface Category {
  id: string;   // stable id — also stored on each habit as `habit.time`
  label: string;
  color: string;
}

const STORAGE_KEY = 'buttress-categories';
export const CATEGORIES_EVENT = 'categories-updated';

export const DEFAULT_CATEGORIES: Category[] = [
  { id: 'reset', label: 'Health', color: '#6fa83b' },
  { id: 'growth', label: 'Growth', color: '#9b5cff' },
  { id: 'distraction', label: 'Reset', color: '#4e55e0' },
  { id: 'any', label: 'Eliminate', color: '#d05a96' },
  { id: 'spending', label: 'Boundary', color: '#b08d2e' },
];

export const CATEGORY_COLOR_SWATCHES = [
  '#6fa83b', '#9b5cff', '#4e55e0', '#d05a96', '#b08d2e',
  '#ff6b00', '#00ba7c', '#1d9bf0', '#f91880', '#71767b',
];

export function getCategories(): Category[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_CATEGORIES;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : DEFAULT_CATEGORIES;
  } catch {
    return DEFAULT_CATEGORIES;
  }
}

function saveCategories(categories: Category[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(categories));
  } catch { /* ignore */ }
  window.dispatchEvent(new Event(CATEGORIES_EVENT));
}

let _id = Date.now();
const nextId = () => `cat-${_id++}`;

export function addCategory(label: string, color: string): Category {
  const category: Category = { id: nextId(), label, color };
  saveCategories([...getCategories(), category]);
  return category;
}

export function updateCategory(id: string, patch: Partial<Omit<Category, 'id'>>) {
  const all = getCategories();
  const idx = all.findIndex((c) => c.id === id);
  if (idx === -1) return;
  const updated = [...all];
  updated[idx] = { ...updated[idx], ...patch };
  saveCategories(updated);
}

export function deleteCategory(id: string) {
  const all = getCategories();
  if (all.length <= 1) return; // always keep at least one category
  saveCategories(all.filter((c) => c.id !== id));
}

// Live-updating category list — refreshes whenever any component adds,
// edits, or removes a category (via the CATEGORIES_EVENT), so every tab
// stays in sync without needing to remount.
export function useCategories(): Category[] {
  const [categories, setCategories] = useState<Category[]>(() => getCategories());

  useEffect(() => {
    const handler = () => setCategories(getCategories());
    window.addEventListener(CATEGORIES_EVENT, handler);
    return () => window.removeEventListener(CATEGORIES_EVENT, handler);
  }, []);

  return categories;
}

// Drop-in shape for the existing TIME_PHASES consumers (`key` + `time`
// both equal `id`, so habit.time lookups keep working unchanged).
export interface Phase {
  key: string;
  label: string;
  time: string;
  color: string;
}

export function toPhases(categories: Category[]): Phase[] {
  return categories.map((c) => ({ key: c.id, label: c.label, time: c.id, color: c.color }));
}
