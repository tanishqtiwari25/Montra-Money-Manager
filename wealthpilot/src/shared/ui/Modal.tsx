import { useEffect, useId, useRef, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { Button } from './Button';
export function Modal({ open, onClose, title, children }: { open: boolean; onClose: () => void; title: string; children: ReactNode }) {
  const ref = useRef<HTMLDialogElement>(null); const labelId = useId();
  useEffect(() => {
    const dialog = ref.current;
    if (!open || !dialog) return;
    const previous = document.activeElement;
    const overflow = document.body.style.overflow;
    dialog.showModal(); document.body.style.overflow = 'hidden';
    return () => { dialog.close(); document.body.style.overflow = overflow; if (previous instanceof HTMLElement) previous.focus(); };
  }, [open]);
  if (!open) return null;
  return createPortal(<dialog ref={ref} aria-labelledby={labelId} onCancel={event => { event.preventDefault(); onClose(); }} onClick={event => { if (event.target === event.currentTarget) { const box = event.currentTarget.getBoundingClientRect(); if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) onClose(); } }} className="m-auto max-h-[90dvh] w-[calc(100%_-_2rem)] max-w-lg overflow-auto rounded-card border border-line bg-panel p-6 text-ink shadow-2xl backdrop:bg-slate-950/60"><div className="mb-5 flex items-center justify-between gap-3"><h2 id={labelId} className="text-lg font-semibold">{title}</h2><Button variant="ghost" aria-label="Close dialog" onClick={onClose}><X size={18} /></Button></div>{children}</dialog>, document.body);
}
