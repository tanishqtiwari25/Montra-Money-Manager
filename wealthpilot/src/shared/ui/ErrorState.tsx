import { Button } from './Button';
export function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) { return <div role="alert" className="space-y-3 rounded-control border border-rose-300 bg-rose-50 p-5 text-rose-900 dark:bg-rose-950 dark:text-rose-100"><p>{message}</p>{onRetry && <Button variant="secondary" onClick={onRetry}>Try again</Button>}</div>; }
