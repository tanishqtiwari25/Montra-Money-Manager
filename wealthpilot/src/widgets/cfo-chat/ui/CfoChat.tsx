import { Sparkles } from 'lucide-react';
import { Card, Badge } from '@shared/ui';
export function CfoChat({ full = false }: { full?: boolean }) {
 return <Card><div className={full?'flex min-h-64 flex-col items-center justify-center py-10 text-center':'space-y-3'}><span className="inline-flex rounded-xl bg-indigo-500/10 p-3 text-indigo-500"><Sparkles size={28} aria-hidden="true" /></span><div className="mt-3"><Badge tone="brand">Coming soon</Badge><h2 className="mt-3 text-lg font-semibold text-ink">Your personal CFO</h2><p className="mt-2 max-w-md text-sm leading-relaxed text-muted">A clearer way to plan your financial decisions is on its way. Stay tuned.</p></div></div></Card>;
}
