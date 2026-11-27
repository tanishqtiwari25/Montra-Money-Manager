export function Brand({ compact = false }: { compact?: boolean }) {
  return <span className="wp-brand"><svg className="wp-brand-symbol" width="36" height="36" viewBox="0 0 36 36" fill="none" aria-hidden="true"><rect width="36" height="36" rx="11" fill="#155EEF"/><path d="M8 12l5 13 5-9 5 9 5-13M18 7v5" stroke="white" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"/></svg>{!compact && <span className="wp-wordmark">WealthPilot<span className="wp-brand-tagline">Make room for what matters.</span></span>}</span>;
}
