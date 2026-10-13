import { pocketMovement, loanVoid } from '../model/commands';
import { useEffect, useRef, useState } from 'react';
import { useAccounts } from '@entities/account';
import { useCards } from '@entities/card';
import { useLoans } from '@entities/loan';
import { useGoals, useGoalPlan } from '@entities/goal';
import { useUser } from '@entities/user';
import { useTransactions } from '@entities/transaction';
import { useOverview } from '@entities/overview';
import { ApiError, extendedApi, extendedActions, extendedFields, type PocketView } from '@shared/api';
import { Button, Modal, Select, Input, ErrorState, toast } from '@shared/ui';
import { errorMessage, usePrivateMoney } from '@shared/lib';

export function AdvancedFinances() { const formatMoney = usePrivateMoney();
 const accounts=useAccounts(); const cards=useCards(); const loans=useLoans(); const goals=useGoals();
 const [open,setOpen]=useState(false); const [key,setKey]=useState('deposit'); const [id,setId]=useState('');
 const [values,setValues]=useState<Record<string,string>>({}); const [pockets,setPockets]=useState<PocketView[]>([]);
 const [busy,setBusy]=useState(false); const [error,setError]=useState<string|null>(null); const [confirmed,setConfirmed]=useState(false); const lock=useRef(false); const intent=useRef<{key:string;action:string;id:string;body:Record<string,unknown>}|null>(null); const [retrying,setRetrying]=useState(false);
 const action=extendedActions.find(a=>a.key===key)!; const fields=action.schema?extendedFields[action.schema]:[];
 useEffect(()=>{if(!open)return;const controller=new AbortController();void extendedApi.pockets({signal:controller.signal}).then(setPockets).catch((cause:unknown)=>{if(!controller.signal.aborted)setError(errorMessage(cause));});return()=>controller.abort();},[open]);
 const resources=action.resource==='accounts'?accounts.items:action.resource==='cards'?cards.items:action.resource==='loans'?loans.items:action.resource==='goals'?goals.items:pockets;
 const choose=(next:string)=>{setKey(next);setId('');setValues(next==='pocketCreate'?{purpose:'general'}:next==='pocketMove'?{direction:'set-aside'}:{});setError(null);setConfirmed(false);};
 const submit=async(event:React.FormEvent)=>{
  event.preventDefault();if(lock.current)return;lock.current=true;setBusy(true);setError(null);
  try{
   if(action.resource!=='none'&&!id)throw new Error('Choose the item to update.');
   if(!confirmed)throw new Error('Confirm this change before saving.');
   const body:Record<string,unknown>={};
   for(const field of (key==='pocketMove'||key==='void'?[]:fields)??[]){const raw=values[field.name]??'';if(!raw.trim()){if(field.nullable){body[field.name]=null;continue;}throw new Error('Enter '+field.label+'.');}
    if(field.type==='integer'||field.type==='number'){const numeric=Number(raw);const value=field.money?Math.round(numeric*100):numeric;if(!Number.isFinite(value)||(field.type==='integer'&&!Number.isSafeInteger(value))||(field.money&&Math.abs(numeric*100-value)>0.00001))throw new Error(field.label+': enter a valid number, with at most two decimal places for money.');body[field.name]=value;}
    else body[field.name]=field.type==='boolean'?raw==='true':raw;
   }
   if(key==='pocketMove')Object.assign(body,pocketMovement(values.direction??'',values.amountPaise??''));
   if(key==='void')Object.assign(body,loanVoid(values.reason??'',values.confirmation??'',loans.items.find(loan=>loan.id===id)?.name??''));
   if(key==='pocketMove'||key==='void'){
    const pending=intent.current??{key:crypto.randomUUID(),action:key,id,body}; intent.current=pending;
    await extendedApi.execute(pending.action,pending.id,pending.body,{idempotencyKey:pending.key});
    intent.current=null;setRetrying(false);
   }else await extendedApi.execute(key,id,body);
   useGoalPlan.getState().invalidate();
   await Promise.allSettled([accounts.load(true),cards.load(true),loans.load(true),goals.load(true),useUser.getState().load(true),useTransactions.getState().load(true),useOverview.getState().load(true),useGoalPlan.getState().load(),extendedApi.pockets().then(setPockets)]);
   toast('Change saved. Your financial plan has been refreshed.');setOpen(false);
  }catch(cause:unknown){if(cause instanceof ApiError&&[400,403,404,422].includes(cause.status)){intent.current=null;setRetrying(false);}else if(intent.current)setRetrying(true);setError(errorMessage(cause));}finally{lock.current=false;setBusy(false);}
 };
 return <><Button variant="secondary" onClick={()=>{if(!intent.current)choose('deposit');setOpen(true);}}>Savings pockets & corrections</Button><Modal open={open} title="Savings and financial details" onClose={()=>{if(!busy)setOpen(false);}}><form className="space-y-4" onSubmit={event=>void submit(event)}>
 <p className="text-sm text-muted">Manage recorded savings and correct your financial details. These actions do not send money.</p>
 <Select label="What would you like to do?" value={key} disabled={busy||retrying} onChange={event=>choose(event.target.value)}>{extendedActions.map(a=><option key={a.key} value={a.key}>{a.label}</option>)}</Select>
 {action.resource!=='none'&&<Select required label="Choose item" value={id} disabled={busy||retrying} onChange={event=>{const target=event.target.value;setId(target);const item=resources.find(r=>r.id===target) as unknown as Record<string,unknown>|undefined;setValues(Object.fromEntries((fields??[]).map(f=>[f.name,key==='pocketMove'&&f.name==='direction'?'set-aside':['principalPaise','outstandingPaise'].includes(f.name)?'':item?.[f.name]==null?'':String(f.money?Number(item[f.name])/100:item[f.name])])));setConfirmed(false);}}><option value="">Choose</option>{resources.map(item=><option key={item.id} value={item.id}>{item.name}{'amountPaise' in item?' · '+formatMoney(item.amountPaise):''}</option>)}</Select>}
 {action.resource==='pockets'&&pockets.find(p=>p.id===id)&&<p className="text-xs text-muted">Recorded pocket savings: {formatMoney(pockets.find(p=>p.id===id)!.amountPaise)}</p>}
 {key==='pocketMove'&&<p className="text-xs text-muted">Set aside available funds from the linked account, or release pocket savings. This does not add new money to your account.</p>}{key==='adjust'&&<p className="text-sm text-muted">Enter the corrected total account balance. The server records a balancing transaction.</p>}
 {key==='void'&&<p className="text-sm text-muted">Use this only to correct a loan recorded by mistake. Loans with recorded payment or transaction history cannot be voided. This archives an incorrect loan without repaying it or moving cash.</p>}
 {key==='void'&&id&&<p className="text-sm font-medium text-ink">Type this loan name to confirm: {loans.items.find(loan=>loan.id===id)?.name}</p>}{key==='goalDelete'&&<p className="text-sm text-muted">The selected goal will be removed if the server permits it. Review its history before confirming.</p>}
 {(fields??[]).map(field=>{const value=values[field.name]??'';const account=field.name==='accountId'||field.name==='paymentAccountId';return field.name==='purpose'||field.name==='direction'?<Select key={field.name} label={field.name==='direction'?'Movement':'Purpose'} value={value} required disabled={busy||retrying} onChange={event=>setValues(v=>({...v,[field.name]:event.target.value}))}>{(field.name==='purpose'?['general','emergency']:['set-aside','release']).map(option=><option key={option} value={option}>{option==='set-aside'?'Set aside savings':option==='release'?'Release savings back to account':option==='general'?'General savings':'Emergency savings'}</option>)}</Select>:account?<Select key={field.name} label={field.label} value={value} disabled={busy||retrying} required={!field.nullable} onChange={event=>setValues(v=>({...v,[field.name]:event.target.value}))}><option value="">Choose account</option>{accounts.items.filter(a=>!a.isArchived&&!a.archived).map(a=><option key={a.id} value={a.id}>{a.name}</option>)}</Select>:field.type==='boolean'?<Select key={field.name} label={field.label} value={value} disabled={busy||retrying} onChange={event=>setValues(v=>({...v,[field.name]:event.target.value}))}><option value="">Unspecified</option><option value="true">Yes</option><option value="false">No</option></Select>:<Input key={field.name} label={key==='void'&&field.name==='confirmation'?'Type the exact loan name':field.label+(field.nullable&&key!=='void'?' (optional)':'')} required={key==='void'||!field.nullable} disabled={busy||retrying} min={key==='pocketMove'?'0.01':undefined} minLength={key==='void'&&field.name==='reason'?8:undefined} maxLength={key==='void'&&field.name==='reason'?200:undefined} type={/Date$/.test(field.name)?'date':['integer','number'].includes(field.type)?'number':'text'} step={field.money||field.type==='number'?'0.01':'1'} value={value} onChange={event=>setValues(v=>({...v,[field.name]:event.target.value}))}/>;})}
 <label className="flex gap-2 text-sm text-ink"><input type="checkbox" checked={confirmed} disabled={busy||retrying} onChange={event=>setConfirmed(event.target.checked)}/>I have reviewed the selected item and confirm this change.</label>
 {retrying&&<p className="text-sm text-muted">The previous request is unresolved. Retry sends the same change; its values are locked to prevent duplicate submissions.</p>}{error&&<ErrorState message={error}/>}<Button type="submit" busy={busy} disabled={!confirmed} className="w-full">{retrying?'Retry same change':'Confirm and save'}</Button></form></Modal></>;
}
