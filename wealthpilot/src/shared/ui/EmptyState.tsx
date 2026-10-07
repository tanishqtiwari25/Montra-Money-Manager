import { Inbox } from 'lucide-react';
import type { ReactNode } from 'react';
export function EmptyState({ title, description, action }: { title: string; description: string; action?: ReactNode }) { return <div className="flex flex-col items-center gap-3 py-12 text-center"><Inbox size={32} aria-hidden="true" className="text-muted" /><h3 className="font-semibold text-ink">{title}</h3><p className="max-w-sm text-sm text-muted">{description}</p>{action}</div>; }
