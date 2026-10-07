import { Moon, Sun } from 'lucide-react';
import { Button } from '@shared/ui';
import { useTheme } from '../model/store';
export function ThemeToggle() { const theme = useTheme(state => state.theme); const toggle = useTheme(state => state.toggle); return <Button variant="ghost" onClick={toggle} aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'} aria-pressed={theme === 'dark'}>{theme === 'dark' ? <Sun size={19} /> : <Moon size={19} />}</Button>; }
