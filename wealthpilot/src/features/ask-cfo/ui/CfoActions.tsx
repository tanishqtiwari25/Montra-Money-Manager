import { IS_DEMO } from '@shared/config';
import { normalize } from '@shared/api';
import type { Goal } from '@entities/goal';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGoals } from '@entities/goal';
import { useNotifications } from '@entities/notification';
import { Button, ErrorState, toast } from '@shared/ui';
import { errorMessage, formatDate } from '@shared/lib';
import { cfoApi } from '../api/cfo.api';
import { useCfo } from '../model/store';
import type { CfoAction } from '../model/types';
export function CfoActions({ actions, responseId, active }: { actions: CfoAction[]; responseId: string; active: boolean }) {
  const navigate = useNavigate(); const chatBusy = useCfo(state => state.busy);
  const [pending, setPending] = useState<string | null>(null); const [error, setError] = useState<string | null>(null); const [saved, setSaved] = useState<string[]>([]);
  const execute = async (action: CfoAction) => {
    if (pending || chatBusy || !active) return;
    setPending(action.kind); setError(null);
    try {
      switch (action.kind) {
        case 'set-goal': { const goal = IS_DEMO ? await cfoApi.setGoal(action) : normalize<Goal>((await cfoApi.executeAction(responseId, actions.indexOf(action), action.idempotencyKey)).goal); useGoals.getState().upsert(goal); toast('Your purchase plan is saved in Goals.'); navigate('/goals'); break; }
        case 'show-payoff': await useCfo.getState().send(action.message, action.replyId); break;
        case 'remind': { const reminder = IS_DEMO ? await cfoApi.remind(action) : (await cfoApi.executeAction(responseId, actions.indexOf(action), action.idempotencyKey)).reminder; await useNotifications.getState().load(true); setSaved(items => [...items, action.idempotencyKey]); toast('Reminder saved for ' + formatDate(reminder.dueDate ?? action.dueDate) + '.'); break; }
      }
    } catch (cause: unknown) { setError(errorMessage(cause)); }
    finally { setPending(null); }
  };
  return <div className="mt-3 space-y-2"><div className="flex flex-wrap gap-2">{actions.map(action => <Button key={action.kind} variant="secondary" className="min-h-10 px-3 text-xs" busy={pending === action.kind} disabled={!active || Boolean(pending) || chatBusy || (action.kind === 'remind' && saved.includes(action.idempotencyKey))} onClick={() => void execute(action)}>{action.kind === 'remind' && saved.includes(action.idempotencyKey) ? 'Reminder saved' : action.label}</Button>)}</div>{error && <ErrorState message={error} />}</div>;
}
