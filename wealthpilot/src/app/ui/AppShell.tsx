import { useEffect, useRef } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar, MobileNavigation } from '@widgets/sidebar';
import { Topbar } from '@widgets/topbar';
import { NotificationsPanel } from '@widgets/notifications-panel';
export function AppShell() { const location = useLocation(); const mainRef = useRef<HTMLElement>(null); useEffect(() => { document.title = 'WealthPilot · ' + (location.pathname.split('/').filter(Boolean).pop() ?? 'Overview').replaceAll('-', ' '); window.scrollTo(0, 0); mainRef.current?.focus({ preventScroll: true }); }, [location.pathname]); return <div className="app-shell"><a href="#main-content" className="skip-link">Skip to content</a><Sidebar /><div className="app-workspace"><Topbar notifications={<NotificationsPanel />} /><main id="main-content" ref={mainRef} tabIndex={-1} className="main-content"><Outlet /></main><footer className="workspace-footer"><span>Thoughtfully planned. One rupee at a time.</span><span>WealthPilot · Frontend demo · INR / IST</span></footer></div><MobileNavigation /></div>; }
