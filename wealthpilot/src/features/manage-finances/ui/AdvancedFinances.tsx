import { useEffect, useRef, useState } from 'react';
import { useAccounts } from '@entities/account';
import { useCards } from '@entities/card';
import { useLoans } from '@entities/loan';
import { useGoals, useGoalPlan } from '@entities/goal';
import { useUser } from '@entities/user';
import { useTransactions } from '@entities/transaction';
import { useOverview } from '@entities/overview';
import { extendedApi, extendedActions, extendedFields, type PocketView } from '@shared/api';
import { Button, Modal, Select, Input, ErrorState, toast } from '@shared/ui';
import { errorMessage, formatMoney } from '@shared/lib';

export function AdvancedFinances() {
 const accounts=useAccounts(); const cards=useCards(); const loans=useLoans(); const goals=useGoals();
 const [open,setOpen]=useState(false); const [key,setKey]=useState('deposit'); const [id,setId]=useState('');
 const [values,setValues]=useState<Record<string,string>>({}); const [pockets,setPockets]=useState<PocketView[]>([]);
 const [busy,setBusy]=useState(false); const [error,setError]=useState<string|null>(null); const [confirmed,setConfirmed]=useState(false); const lock=useRef(false);
 const action=extendedActions.find(a=>a.key===key)!; const fields=action.schema?extendedFields[action.schema]:[];
 useEffect(()=>{if(!open)return;const controller=new AbortController();void extendedApi.pockets({signal:controller.signal}).then(setPockets).catch((cause:unknown)=>{if(!controller.signal.aborted)setError(errorMessage(cause));});return()=>controller.abort();},[open]);
 const resources=action.resource==='accounts'?accounts.items:action.resource==='cards'?cards.items:action.resource==='loans'?loans.items:action.resource==='goals'?goals.items:pockets;
 const choose=(next:string)=>{setKey(next);setId('');setValues(next==='pocketCreate'?{purpose:'general'}:next==='pocketMove'?{direction:'release'}:{});setError(null);setConfirmed(false);};
 const submit=async(event:React.FormEvent)=>{
  event.preventDefault();if(lock.current)return;lock.current=true;setBusy(true);setError(null);
  try{
   if(action.resource!=='none'&&!id)throw new Error('Choose the item to update.');
   if(!confirmed)throw new Error('Confirm this change before saving.');
   const body:Record<string,unknown>={};
   for(const field of fields??[]){const raw=values[field.name]??'';if(!raw.trim()){if(field.nullable){body[field.name]=null;continue;}throw new Error('Enter '+field.label+'.');}
    if(field.type==='integer'||field.type==='number'){const numeric=Number(raw);const value=field.money?Math.round(numeric*100):numeric;if(!Number.isFinite(value)||(field.type==='integer'&&!Number.isSafeInteger(value))||(field.money&&Math.abs(numeric*100-value)>0.00001))throw new Error(field.label+': enter a valid number, with at most two decimal places for money.');body[field.name]=value;}
    else body[field.name]=field.type==='boolean'?raw==='true':raw;
   }
   await extendedApi.execute(key,id,body);
   useGoalPlan.getState().invalidate();
   await Promise.all([accounts.load(true),cards.load(true),loans.load(true),goals.load(true),useUser.getState().load(true),useTransactions.getState().load(true),useOverview.getState().load(true),useGoalPlan.getState().load(),extendedApi.pockets().then(setPockets)]);
   toast('Change saved. Your financial plan has been refreshed.');setOpen(false);
  }catch(cause:unknown){setError(errorMessage(cause));}finally{lock.current=false;setBusy(false);}
 };
 return <><Button variant="secondary" onClick={()=>{choose('deposit');setOpen(true);}}>Savings pockets & corrections</Button><Modal open={open} title="Savings and financial details" onClose={()=>{if(!busy)setOpen(false);}}><form className="space-y-4" onSubmit={event=>void submit(event)}>
 <p className="text-sm text-muted">Manage recorded savings and correct your financial details. These actions do not send money.</p>
 <Select label="What would you like to do?" value={key} disabled={busy} onChange={event=>choose(event.target.value)}>{extendedActions.filter(a=>a.key!=='void').map(a=><option key={a.key} value={a.key}>{a.label}</option>)}</Select>
 {action.resource!=='none'&&<Select required label="Choose item" value={id} disabled={busy} onChange={event=>{const target=event.target.value;setId(target);const item=resources.find(r=>r.id===target) as unknown as Record<string,unknown>|undefined;setValues(Object.fromEntries((fields??[]).map(f=>[f.name,key==='pocketMove'&&f.name==='direction'?'release':['principalPaise','outstandingPaise'].includes(f.name)?'':item?.[f.name]==null?'':String(f.money?Number(item[f.name])/100:item[f.name])])));setConfirmed(false);}}><option value="">Choose</option>{resources.map(item=><option key={item.id} value={item.id}>{item.name}{'amountPaise' in item?' · '+formatMoney(item.amountPaise):''}</option>)}</Select>}
 {action.resource==='pockets'&&pockets.find(p=>p.id===id)&&<p className="text-xs text-muted">Recorded pocket savings: {formatMoney(pockets.find(p=>p.id===id)!.amountPaise)}</p>}
 {key==='pocketMove'&&<p className="text-xs text-muted">Release existing pocket savings. Adding savings is currently unavailable.</p>}{key==='adjust'&&<p className="text-sm text-muted">Enter the corrected total account balance. The server records a balancing transaction.</p>}
 {key==='void'&&<p className="text-sm text-muted">Use this only to correct a loan recorded by mistake. Enter the reason and the confirmation required by your backend; this does not repay a loan.</p>}
 {key==='goalDelete'&&<p className="text-sm text-muted">The selected goal will be removed if the server permits it. Review its history before confirming.</p>}
 {(fields??[]).map(field=>{const value=values[field.name]??'';const account=field.name==='accountId'||field.name==='paymentAccountId';return field.name==='purpose'||field.name==='direction'?<Select key={field.name} label={field.name==='direction'?'Movement':'Purpose'} value={value} required disabled={busy} onChange={event=>setValues(v=>({...v,[field.name]:event.target.value}))}>{(field.name==='purpose'?['general','emergency']:['release']).map(option=><option key={option} value={option}>{option==='release'?'Release savings back to account':option==='general'?'General savings':'Emergency savings'}</option>)}</Select>:account?<Select key={field.name} label={field.label} value={value} disabled={busy} required={!field.nullable} onChange={event=>setValues(v=>({...v,[field.name]:event.target.value}))}><option value="">Choose account</option>{accounts.items.filter(a=>!a.isArchived&&!a.archived).map(a=><option key={a.id} value={a.id}>{a.name}</option>)}</Select>:field.type==='boolean'?<Select key={field.name} label={field.label} value={value} disabled={busy} onChange={event=>setValues(v=>({...v,[field.name]:event.target.value}))}><option value="">Unspecified</option><option value="true">Yes</option><option value="false">No</option></Select>:<Input key={field.name} label={field.label+(field.nullable?' (optional)':'')} required={!field.nullable} disabled={busy} type={/Date$/.test(field.name)?'date':['integer','number'].includes(field.type)?'number':'text'} step={field.money||field.type==='number'?'0.01':'1'} value={value} onChange={event=>setValues(v=>({...v,[field.name]:event.target.value}))}/>;})}
 <label className="flex gap-2 text-sm text-ink"><input type="checkbox" checked={confirmed} disabled={busy} onChange={event=>setConfirmed(event.target.checked)}/>I have reviewed the selected item and confirm this change.</label>
 {error&&<ErrorState message={error}/>}<Button type="submit" busy={busy} disabled={!confirmed} className="w-full">Confirm and save</Button></form></Modal></>;
}
