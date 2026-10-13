import { http } from './http';
import { resourceId } from './query';
import type { RequestOptions } from './types';
export interface PocketView { id:string; accountId:string; name:string; amountPaise:number; targetPaise:number|null; purpose:string }
export const extendedActions = [
  {
    "key": "deposit",
    "label": "Deposit terms",
    "resource": "accounts",
    "method": "PATCH",
    "path": "/accounts/{id}/deposit-terms",
    "schema": "DepositTermsInput"
  },
  {
    "key": "adjust",
    "label": "Correct account balance",
    "resource": "accounts",
    "method": "POST",
    "path": "/accounts/{id}/balance-adjustment",
    "schema": "AccountBalanceAdjustmentInput"
  },
  {
    "key": "schedule",
    "label": "Card billing schedule",
    "resource": "cards",
    "method": "PATCH",
    "path": "/cards/{id}/schedule",
    "schema": "CardScheduleInput"
  },
  {
    "key": "details",
    "label": "Loan details and corrections",
    "resource": "loans",
    "method": "PATCH",
    "path": "/loans/{id}/details",
    "schema": "LoanDetailsInput"
  },
  {
    "key": "void",
    "label": "Void an incorrect loan",
    "resource": "loans",
    "method": "POST",
    "path": "/loans/{id}/void",
    "schema": "LoanVoidInput"
  },
  {
    "key": "pocketCreate",
    "label": "Create savings pocket",
    "resource": "none",
    "method": "POST",
    "path": "/pockets",
    "schema": "PocketInput"
  },
  {
    "key": "pocketEdit",
    "label": "Edit savings pocket",
    "resource": "pockets",
    "method": "PATCH",
    "path": "/pockets/{id}",
    "schema": "PocketUpdateInput"
  },
  {
    "key": "pocketMove",
    "label": "Set aside or release pocket savings",
    "resource": "pockets",
    "method": "POST",
    "path": "/pockets/{id}/movements",
    "schema": "PocketMovementInput"
  },
  {
    "key": "pocketEmergency",
    "label": "Convert emergency savings to pocket",
    "resource": "pockets",
    "method": "POST",
    "path": "/pockets/{id}/convert-emergency",
    "schema": "EmergencyPocketConversionInput"
  },
  {
    "key": "pocketDelete",
    "label": "Remove empty pocket",
    "resource": "pockets",
    "method": "DELETE",
    "path": "/pockets/{id}",
    "schema": null
  },
  {
    "key": "goalDelete",
    "label": "Remove goal",
    "resource": "goals",
    "method": "DELETE",
    "path": "/goals/{id}",
    "schema": null
  }
] as const;
export const extendedFields: Record<string,{name:string;label:string;type:string;nullable:boolean;money:boolean}[]> = {
  "DepositTermsInput": [
    {
      "name": "depositDate",
      "label": "Deposit Date",
      "type": "string",
      "nullable": true,
      "money": false
    },
    {
      "name": "maturityDate",
      "label": "Maturity Date",
      "type": "string",
      "nullable": true,
      "money": false
    },
    {
      "name": "annualInterestRate",
      "label": "Annual Interest Rate",
      "type": "number",
      "nullable": false,
      "money": false
    }
  ],
  "AccountBalanceAdjustmentInput": [
    {
      "name": "newBalancePaise",
      "label": "New Balance (₹)",
      "type": "integer",
      "nullable": false,
      "money": true
    },
    {
      "name": "note",
      "label": "Note",
      "type": "string",
      "nullable": true,
      "money": false
    }
  ],
  "CardScheduleInput": [
    {
      "name": "billingDate",
      "label": "Billing Date",
      "type": "string",
      "nullable": true,
      "money": false
    },
    {
      "name": "paymentDueDate",
      "label": "Payment Due Date",
      "type": "string",
      "nullable": true,
      "money": false
    },
    {
      "name": "billingDay",
      "label": "Billing Day",
      "type": "integer",
      "nullable": true,
      "money": false
    },
    {
      "name": "paymentDueDay",
      "label": "Payment Due Day",
      "type": "integer",
      "nullable": true,
      "money": false
    }
  ],
  "LoanDetailsInput": [
    {
      "name": "name",
      "label": "Name",
      "type": "string",
      "nullable": true,
      "money": false
    },
    {
      "name": "lender",
      "label": "Lender",
      "type": "string",
      "nullable": true,
      "money": false
    },
    {
      "name": "annualInterestRate",
      "label": "Annual Interest Rate",
      "type": "number",
      "nullable": false,
      "money": false
    },
    {
      "name": "emiPaise",
      "label": "Emi (₹)",
      "type": "integer",
      "nullable": false,
      "money": true
    },
    {
      "name": "nextDueDate",
      "label": "Next Due Date",
      "type": "string",
      "nullable": true,
      "money": false
    },
    {
      "name": "remainingMonths",
      "label": "Remaining Months",
      "type": "integer",
      "nullable": false,
      "money": false
    },
    {
      "name": "paymentAccountId",
      "label": "Payment Account Id",
      "type": "string",
      "nullable": true,
      "money": false
    },
    {
      "name": "principalPaise",
      "label": "Principal (₹)",
      "type": "integer",
      "nullable": true,
      "money": true
    },
    {
      "name": "outstandingPaise",
      "label": "Outstanding (₹)",
      "type": "integer",
      "nullable": true,
      "money": true
    },
    {
      "name": "correctionReason",
      "label": "Correction Reason",
      "type": "string",
      "nullable": true,
      "money": false
    },
    {
      "name": "autoDebit",
      "label": "Auto Debit",
      "type": "boolean",
      "nullable": true,
      "money": false
    }
  ],
  "LoanVoidInput": [
    {
      "name": "reason",
      "label": "Reason",
      "type": "string",
      "nullable": true,
      "money": false
    },
    {
      "name": "confirmation",
      "label": "Confirmation",
      "type": "string",
      "nullable": true,
      "money": false
    }
  ],
  "PocketInput": [
    {
      "name": "accountId",
      "label": "Account Id",
      "type": "string",
      "nullable": true,
      "money": false
    },
    {
      "name": "name",
      "label": "Name",
      "type": "string",
      "nullable": true,
      "money": false
    },
    {
      "name": "targetPaise",
      "label": "Target (₹)",
      "type": "integer",
      "nullable": true,
      "money": true
    },
    {
      "name": "purpose",
      "label": "Purpose",
      "type": "string",
      "nullable": true,
      "money": false
    }
  ],
  "PocketUpdateInput": [
    {
      "name": "name",
      "label": "Name",
      "type": "string",
      "nullable": true,
      "money": false
    },
    {
      "name": "targetPaise",
      "label": "Target (₹)",
      "type": "integer",
      "nullable": true,
      "money": true
    }
  ],
  "PocketMovementInput": [
    {
      "name": "direction",
      "label": "Direction",
      "type": "string",
      "nullable": true,
      "money": false
    },
    {
      "name": "amountPaise",
      "label": "Amount (₹)",
      "type": "integer",
      "nullable": false,
      "money": true
    }
  ],
  "EmergencyPocketConversionInput": [
    {
      "name": "amountPaise",
      "label": "Amount (₹)",
      "type": "integer",
      "nullable": false,
      "money": true
    }
  ]
};
export const extendedApi = {
 pockets: (options?:RequestOptions)=>http.get<PocketView[]>('/pockets',options),
 execute: (key:string,id:string,body:Record<string,unknown>,options?:RequestOptions)=>{
  const action=extendedActions.find(a=>a.key===key); if(!action)throw new Error('Choose a supported action.');
  const path=action.path.replace('{id}',resourceId(id));
  if(action.method==='DELETE')return http.delete(path,options);
  if(action.method==='PATCH')return http.patch(path,body,options);
  return http.command(path,body,options);
 }
};
