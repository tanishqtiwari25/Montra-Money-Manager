import { Link } from 'react-router-dom';
import { CheckCircle2, CalendarClock, AlertTriangle, Bell } from 'lucide-react';
import { formatDate } from '@shared/lib';
import type { Notification } from '../model/types';
export function NotificationItem({ notification, onRead }: { notification: Notification; onRead: (id: string) => void }) {
  const Icon = { 'goal-achieved': CheckCircle2, 'bill-due': CalendarClock, 'budget-exceeded': AlertTriangle, reminder: Bell }[notification.kind];
  return <Link to={notification.href} onClick={() => onRead(notification.id)} className={'flex gap-3 rounded-control p-3 transition hover:bg-canvas focus-visible:outline focus-visible:outline-2 focus-visible:outline-indigo ' + (notification.read ? '' : 'bg-canvas')}><span className="mt-1 text-muted"><Icon size={18} aria-hidden="true" /></span><div className="min-w-0 flex-1"><p className="text-sm font-semibold text-ink">{notification.title}{!notification.read && <span className="ml-2 inline-block h-2 w-2 rounded-full bg-indigo-600"><span className="sr-only">Unread</span></span>}</p><p className="mt-1 text-xs leading-relaxed text-muted">{notification.message}</p><p className="mt-2 text-xs text-muted">{formatDate(notification.createdAt, { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</p></div></Link>;
}
