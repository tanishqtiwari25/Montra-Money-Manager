import { create } from 'zustand';
export type Theme = 'light' | 'dark';
const key = 'wealthpilot.theme';
function preferredTheme(): Theme {
  try { const stored = localStorage.getItem(key); if (stored === 'light' || stored === 'dark') return stored; } catch { /* Use system preference. */ }
  return typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}
function applyTheme(theme: Theme): void {
  if (typeof document !== 'undefined') { document.documentElement.classList.toggle('dark', theme === 'dark'); document.documentElement.style.colorScheme = theme; }
  try { localStorage.setItem(key, theme); } catch { /* Theme remains usable in memory. */ }
}
interface ThemeState { theme: Theme; setTheme: (theme: Theme) => void; toggle: () => void; initialize: () => void }
export const useTheme = create<ThemeState>((set, get) => ({ theme: preferredTheme(), setTheme: theme => { applyTheme(theme); set({ theme }); }, toggle: () => get().setTheme(get().theme === 'light' ? 'dark' : 'light'), initialize: () => applyTheme(get().theme) }));
