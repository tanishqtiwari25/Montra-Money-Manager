import { useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Sparkles, Send, RotateCcw } from 'lucide-react';
import { Button, Input, ErrorState } from '@shared/ui';
import { useCfo } from '../model/store';
import { starterPrompts } from '../model/prompts';
import { cfoMessageSchema, type CfoMessageValues } from '../model/schema';
import { CfoRichCard } from './CfoRichCard';
import { CfoActions } from './CfoActions';
export function CfoConversation({ compact = false }: { compact?: boolean }) {
  const { messages, busy, error, send, retry, reset: resetChat } = useCfo();
  const scrollRef = useRef<HTMLDivElement>(null);
  const { register, handleSubmit, reset, formState: { errors } } = useForm<CfoMessageValues>({ resolver: zodResolver(cfoMessageSchema), defaultValues: { message: '' } });
  useEffect(() => { const container = scrollRef.current; if (container) container.scrollTop = container.scrollHeight; }, [messages, busy]);
  const last = [...messages].reverse().find(message => message.role === 'assistant');
  const replies = last?.role === 'assistant' ? last.response.quickReplies : starterPrompts;
  const failed = [...messages].reverse().find(message => message.role === 'user' && message.status === 'failed');
  const submit = async (values: CfoMessageValues) => { if (busy) return; reset({ message: '' }); await send(values.message); };
  return <div className="flex min-h-0 flex-col">
    <div className="mb-4 flex items-center justify-between"><div className="flex items-center gap-3"><span className="rounded-xl bg-indigo-100 p-2.5 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-200"><Sparkles size={20} aria-hidden="true" /></span><div><h3 className="text-sm font-semibold text-ink">Your personal CFO</h3><p className="text-xs text-muted">A clearer plan for your next decision</p></div></div><Button variant="ghost" disabled={busy || messages.length === 0} aria-label="Start a new CFO conversation" onClick={resetChat}><RotateCcw size={16} /></Button></div>
    <div ref={scrollRef} role="log" aria-label="CFO conversation" aria-live="polite" aria-relevant="additions" tabIndex={0} className={'space-y-4 overflow-y-auto overscroll-contain rounded-control bg-canvas p-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-indigo ' + (compact ? 'h-[340px]' : 'h-[min(60dvh,620px)]')}>
      {messages.length === 0 && <div className="py-6 text-center"><Sparkles size={30} aria-hidden="true" className="mx-auto mb-3 text-indigo-600 dark:text-indigo-300" /><h4 className="font-semibold text-ink">Make your next purchase with a plan.</h4><p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-muted">Ask about an upgrade, a work tool, or your loan payoff. We’ll look at the impact on your goals and emergency savings.</p></div>}
      {messages.map(message => message.role === 'user' ? <div key={message.id} className="ml-auto max-w-[85%] rounded-2xl rounded-br-sm bg-indigo px-4 py-3 text-sm text-white"><p className="whitespace-pre-wrap break-words">{message.text}</p>{message.status === 'failed' && <p className="mt-1 text-xs">Not delivered. Retry below.</p>}</div> : <article key={message.id} className="max-w-full rounded-2xl rounded-bl-sm border border-line bg-panel p-4"><p className="mb-3 whitespace-pre-wrap text-sm leading-relaxed text-ink">{message.response.text}</p><div className="space-y-3">{message.response.cards.map((card, index) => <CfoRichCard key={message.id + '-' + index} card={card} />)}</div><CfoActions actions={message.response.actions} /></article>)}
      {busy && <div role="status" className="flex items-center gap-2 text-sm text-muted"><span aria-hidden="true" className="flex gap-1">{[0, 1, 2].map(index => <span key={index} className="h-1.5 w-1.5 animate-pulse rounded-full bg-indigo-500 motion-reduce:animate-none" style={{ animationDelay: index * 150 + 'ms' }} />)}</span>Your CFO is thinking…</div>}
    </div>
    <div className="my-3 flex flex-wrap gap-2">{replies.map(reply => <Button key={reply.id} variant="secondary" className="min-h-9 px-3 text-xs" disabled={busy} onClick={() => void send(reply.message, reply.id)}>{reply.label}</Button>)}</div>
    {error && <div className="mb-3"><ErrorState message={error} onRetry={failed ? () => void retry(failed.id) : undefined} /></div>}
    <form onSubmit={handleSubmit(submit)} noValidate className="flex items-end gap-2"><div className="min-w-0 flex-1"><Input label="Ask your CFO" placeholder="Can I buy an iPhone?" autoComplete="off" disabled={busy} error={errors.message?.message} {...register('message')} /></div><Button type="submit" disabled={busy} aria-label="Send message"><Send size={18} /></Button></form>
  </div>;
}
