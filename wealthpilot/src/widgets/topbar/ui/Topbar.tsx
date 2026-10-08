import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Search, Compass, ChevronRight } from 'lucide-react';
import { useUser } from '@entities/user';
import { ThemeToggle } from '@features/toggle-theme';
import { Avatar } from '@shared/ui';
const titles: Record<string, string> = { dashboard: 'Overview', transactions: 'Transactions', accounts: 'Accounts & cards', budgets: 'Budgets', loans: 'Loans & EMIs', goals: 'Goals', reports: 'Reports & insights', settings: 'Settings', 'ask-cfo': 'Ask CFO' };
export function Topbar({ notifications }: { notifications: ReactNode }) {
  const location = useLocation(); const navigate = useNavigate(); const profile = useUser(state => state.profile); const [query, setQuery] = useState(''); const searchRef = useRef<HTMLInputElement>(null);
  const title = titles[location.pathname.split('/').filter(Boolean).pop() ?? 'dashboard'] ?? 'Workspace';
  useEffect(() => { const key = (event: KeyboardEvent) => { if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') { event.preventDefault(); searchRef.current?.focus(); } }; window.addEventListener('keydown', key); return () => window.removeEventListener('keydown', key); }, []);
  return <header className="topbar"><Link to="/dashboard" aria-label="WealthPilot home" className="mobile-brand"><Compass size={25} /></Link><div className="hidden items-center gap-2 text-xs text-muted md:flex"><span>Workspace</span><ChevronRight size={13} /><span className="font-medium text-ink">{title}</span></div><form className="topbar-search" role="search" onSubmit={event => { event.preventDefault(); navigate('/transactions?search=' + encodeURIComponent(query.trim())); }}><Search size={16} aria-hidden="true" /><input ref={searchRef} value={query} onChange={event => setQuery(event.target.value)} aria-label="Search transactions" placeholder="Search your transactions" /><kbd className="hidden text-[10px] text-muted xl:inline">Ctrl K</kbd></form><div className="ml-auto flex items-center gap-1 sm:gap-2"><ThemeToggle />{notifications}<div className="mx-2 hidden h-6 w-px bg-line sm:block" /><Link to="/settings" aria-label="Open profile"><Avatar name={profile?.name ?? 'Your account'} size="sm" /></Link></div></header>;
}
