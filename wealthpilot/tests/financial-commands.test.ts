import assert from 'node:assert/strict';
import { pocketMovement, loanVoid } from '../src/features/manage-finances/model/commands';
import { extendedApi, setAccessToken, ApiError } from '@shared/api';
async function run(){
 assert.deepEqual(pocketMovement('set-aside','100'),{direction:'set-aside',amountPaise:10000});
 assert.deepEqual(pocketMovement('release','0.01'),{direction:'release',amountPaise:1});
 for(const amount of ['','0','-1','1.001','NaN','Infinity','9007199254740992'])assert.throws(()=>pocketMovement('set-aside',amount));
 assert.throws(()=>pocketMovement('in','100'));
 assert.deepEqual(loanVoid('  Duplicate loan entered by mistake  ','  Home Loan  ','Home Loan'),{reason:'Duplicate loan entered by mistake',confirmation:'Home Loan'});
 for(const name of ['VOID','home loan','Home loan',''])assert.throws(()=>loanVoid('Duplicate entry',name,'Home Loan'));
 for(const reason of ['short',' '.repeat(20),'a'.repeat(201)])assert.throws(()=>loanVoid(reason,'Home Loan','Home Loan'));
 console.log('PASS exact funding enum, positive integer paise, trimmed reason limits and case-sensitive loan confirmation');
 setAccessToken('financial-command-test');const attempts:{path:string;key:string|null;body:string}[]=[];let fail=true;
 globalThis.fetch=async(url,init)=>{attempts.push({path:new URL(String(url)).pathname,key:new Headers(init?.headers).get('Idempotency-Key'),body:String(init?.body)});if(fail)throw new TypeError('Response lost');return new Response('{}',{status:200,headers:{'Content-Type':'application/json'}});};
 const body=pocketMovement('set-aside','100');const intent='qa-stable-pocket-intent';
 await assert.rejects(()=>extendedApi.execute('pocketMove','owned/pocket',body,{idempotencyKey:intent}),ApiError);
 fail=false;await extendedApi.execute('pocketMove','owned/pocket',body,{idempotencyKey:intent});
 assert.deepEqual(attempts[0],attempts[1]);assert.equal(attempts[0].path,'/api/v1/pockets/owned%2Fpocket/movements');assert.equal(attempts[0].key,intent);assert.deepEqual(JSON.parse(attempts[0].body),body);
 await extendedApi.execute('void','owned-loan',loanVoid('Duplicate entry','Home Loan','Home Loan'),{idempotencyKey:'qa-void-intent'});
 assert.equal(attempts[2].path,'/api/v1/loans/owned-loan/void');assert.equal(attempts[2].key,'qa-void-intent');
 console.log('PASS failed funding retry uses identical payload/key and loan void sends exact name with command header');
}
run().catch(error=>{console.error(error);process.exitCode=1;});
