import { useId, useRef, type KeyboardEvent } from 'react';
export function Tabs<T extends string>({ items, value, onChange, label, panelId }: { items: readonly { value: T; label: string }[]; value: T; onChange: (value: T) => void; label: string; panelId: string }) {
  const id = useId(); const ref = useRef<HTMLDivElement>(null);
  const handleKey = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    let next = index;
    if (event.key === 'ArrowRight') next = (index + 1) % items.length;
    else if (event.key === 'ArrowLeft') next = (index + items.length - 1) % items.length;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = items.length - 1;
    else return;
    event.preventDefault(); const item = items[next]; if (item) onChange(item.value);
    ref.current?.querySelectorAll<HTMLButtonElement>('button')[next]?.focus();
  };
  return <div ref={ref} role="tablist" aria-label={label} className="inline-flex gap-1 rounded-control bg-canvas p-1">{items.map((item, index) => <button key={item.value} id={id + '-' + item.value} role="tab" type="button" aria-selected={value === item.value} aria-controls={panelId} tabIndex={value === item.value ? 0 : -1} onKeyDown={event => handleKey(event, index)} onClick={() => onChange(item.value)} className={'min-h-10 rounded-lg px-3 text-sm font-medium focus-visible:outline focus-visible:outline-2 focus-visible:outline-indigo ' + (value === item.value ? 'bg-panel text-ink shadow-sm' : 'text-muted')}>{item.label}</button>)}</div>;
}
