import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { CfoConversation, CfoFinancialSnapshot, cfoApi, useCfo, type CfoSnapshot } from '@features/ask-cfo';
import { Card, AsyncState } from '@shared/ui';
import { errorMessage } from '@shared/lib';
export function CfoChat({ full = false }: { full?: boolean }) {
  const messages = useCfo(state => state.messages); const [snapshot, setSnapshot] = useState<CfoSnapshot | null>(null); const [error, setError] = useState<string | null>(null); const [revision, setRevision] = useState(0);
  useEffect(() => { if (!full) return; const controller = new AbortController(); setError(null); void cfoApi.getSnapshot({ signal: controller.signal }).then(setSnapshot).catch((cause: unknown) => { if (!controller.signal.aborted) setError(errorMessage(cause)); }); return () => controller.abort(); }, [full, revision]);
  const last = [...messages].reverse().find(message => message.role === 'assistant'); const current = last?.role === 'assistant' ? last.response.snapshot : snapshot;
  return <div className={full ? 'cfo-full-grid' : ''}><Card title={full ? undefined : 'A second opinion for your money'} action={full ? undefined : <Link to="/ask-cfo" className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-700 dark:text-indigo-300">Open CFO <ArrowUpRight size={14} /></Link>}><CfoConversation compact={!full} /></Card>{full && <aside><AsyncState loading={!current} error={error} onRetry={() => setRevision(value => value + 1)}>{current && <CfoFinancialSnapshot snapshot={current} />}</AsyncState><div className="mt-5 rounded-card border border-line bg-panel p-5"><p className="text-xs font-semibold text-ink">A thoughtful purchase starts with a reason.</p><p className="mt-2 text-xs leading-relaxed text-muted">Tell your CFO what matters to you. It can help you compare the impact, repayment timeline, and a plan that protects your goals.</p></div></aside>}</div>;
}
