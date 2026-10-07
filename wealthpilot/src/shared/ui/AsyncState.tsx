import type { ReactNode } from 'react';
import { ErrorState } from './ErrorState';
import { Skeleton } from './Skeleton';
export function AsyncState({ loading, error, onRetry, children }: { loading: boolean; error?: string | null; onRetry?: () => void; children: ReactNode }) { if (error) return <ErrorState message={error} onRetry={onRetry} />; if (loading) return <div className="space-y-3"><Skeleton className="h-8 w-40" /><Skeleton className="h-48" /></div>; return <>{children}</>; }
