import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@entities/auth';
import { IS_DEMO } from '@shared/config';
import { Button, ErrorState, Skeleton } from '@shared/ui';
export function AuthGate() {
  const auth = useAuth(); const location = useLocation();
  if (IS_DEMO || auth.status === 'authenticated') return <Outlet />;
  if (auth.status === 'checking') return <div className="mx-auto max-w-xl space-y-5 p-8"><Skeleton className="h-12" /><Skeleton className="h-64" /></div>;
  if (auth.status === 'error') return <main className="mx-auto max-w-lg space-y-4 p-8"><ErrorState message={auth.error ?? 'Could not verify your session.'} onRetry={() => void auth.initialize(true)} /><Button onClick={() => window.location.reload()}>Reload</Button></main>;
  return <Navigate to="/login" replace state={{ from: location.pathname + location.search }} />;
}
