export interface Field { name: string; label: string; type: string; money: boolean; optional: boolean; value: string | number | boolean }
export const financeForms: Record<string, { label: string; schema: string; fields: Field[] }> = {
  "account": {
    "label": "Add account",
    "schema": "AccountInput",
    "fields": [
      {
        "name": "name",
        "label": "Name",
        "type": "text",
        "money": false,
        "optional": false,
        "value": ""
      },
      {
        "name": "institution",
        "label": "Institution",
        "type": "text",
        "money": false,
        "optional": false,
        "value": ""
      },
      {
        "name": "type",
        "label": "Type",
        "type": "text",
        "money": false,
        "optional": false,
        "value": "bank"
      },
      {
        "name": "openingBalancePaise",
        "label": "Opening Balance (₹)",
        "type": "number",
        "money": true,
        "optional": false,
        "value": 0
      },
      {
        "name": "lastFour",
        "label": "Last Four",
        "type": "text",
        "money": false,
        "optional": true,
        "value": ""
      },
      {
        "name": "color",
        "label": "Color",
        "type": "text",
        "money": false,
        "optional": false,
        "value": "#6366f1"
      }
    ]
  },
  "card": {
    "label": "Add card",
    "schema": "CardInput",
    "fields": [
      {
        "name": "accountId",
        "label": "Account Id",
        "type": "text",
        "money": false,
        "optional": false,
        "value": ""
      },
      {
        "name": "name",
        "label": "Name",
        "type": "text",
        "money": false,
        "optional": false,
        "value": ""
      },
      {
        "name": "issuer",
        "label": "Issuer",
        "type": "text",
        "money": false,
        "optional": false,
        "value": ""
      },
      {
        "name": "network",
        "label": "Network",
        "type": "text",
        "money": false,
        "optional": false,
        "value": "Visa"
      },
      {
        "name": "type",
        "label": "Type",
        "type": "text",
        "money": false,
        "optional": false,
        "value": "bank"
      },
      {
        "name": "lastFour",
        "label": "Last Four",
        "type": "text",
        "money": false,
        "optional": true,
        "value": ""
      },
      {
        "name": "gradient",
        "label": "Gradient",
        "type": "text",
        "money": false,
        "optional": false,
        "value": "linear-gradient(135deg, #172554, #4338ca)"
      },
      {
        "name": "openingDebtPaise",
        "label": "Opening Debt (₹)",
        "type": "number",
        "money": true,
        "optional": false,
        "value": 0
      },
      {
        "name": "limitPaise",
        "label": "Limit (₹)",
        "type": "number",
        "money": true,
        "optional": true,
        "value": 0
      }
    ]
  },
  "loan": {
    "label": "Add loan",
    "schema": "LoanInput",
    "fields": [
      {
        "name": "name",
        "label": "Name",
        "type": "text",
        "money": false,
        "optional": false,
        "value": ""
      },
      {
        "name": "lender",
        "label": "Lender",
        "type": "text",
        "money": false,
        "optional": false,
        "value": ""
      },
      {
        "name": "principalPaise",
        "label": "Principal (₹)",
        "type": "number",
        "money": true,
        "optional": false,
        "value": 0
      },
      {
        "name": "outstandingPaise",
        "label": "Outstanding (₹)",
        "type": "number",
        "money": true,
        "optional": false,
        "value": 0
      },
      {
        "name": "annualInterestRate",
        "label": "Annual Interest Rate",
        "type": "number",
        "money": false,
        "optional": false,
        "value": 0
      },
      {
        "name": "emiPaise",
        "label": "Emi (₹)",
        "type": "number",
        "money": true,
        "optional": false,
        "value": 0
      },
      {
        "name": "nextDueDate",
        "label": "Next Due Date",
        "type": "date",
        "money": false,
        "optional": false,
        "value": ""
      },
      {
        "name": "remainingMonths",
        "label": "Remaining Months",
        "type": "number",
        "money": false,
        "optional": false,
        "value": 0
      },
      {
        "name": "paymentAccountId",
        "label": "Payment Account Id",
        "type": "text",
        "money": false,
        "optional": false,
        "value": ""
      }
    ]
  },
  "category": {
    "label": "Add category",
    "schema": "CategoryInput",
    "fields": [
      {
        "name": "name",
        "label": "Name",
        "type": "text",
        "money": false,
        "optional": false,
        "value": ""
      },
      {
        "name": "color",
        "label": "Color",
        "type": "text",
        "money": false,
        "optional": false,
        "value": "#6366f1"
      },
      {
        "name": "icon",
        "label": "Icon",
        "type": "text",
        "money": false,
        "optional": false,
        "value": "sparkles"
      }
    ]
  },
  "budget": {
    "label": "Set budget",
    "schema": "BudgetInput",
    "fields": [
      {
        "name": "categoryId",
        "label": "Category Id",
        "type": "text",
        "money": false,
        "optional": false,
        "value": ""
      },
      {
        "name": "month",
        "label": "Month",
        "type": "month",
        "money": false,
        "optional": false,
        "value": ""
      },
      {
        "name": "limitPaise",
        "label": "Limit (₹)",
        "type": "number",
        "money": true,
        "optional": true,
        "value": 0
      }
    ]
  },
  "bill": {
    "label": "Add card bill",
    "schema": "CardBillInput",
    "fields": [
      {
        "name": "month",
        "label": "Month",
        "type": "month",
        "money": false,
        "optional": false,
        "value": ""
      },
      {
        "name": "amountPaise",
        "label": "Amount (₹)",
        "type": "number",
        "money": true,
        "optional": false,
        "value": 0
      },
      {
        "name": "dueDate",
        "label": "Due Date",
        "type": "date",
        "money": false,
        "optional": false,
        "value": ""
      }
    ]
  },
  "repay": {
    "label": "Repay credit card",
    "schema": "CardRepaymentInput",
    "fields": [
      {
        "name": "paymentAccountId",
        "label": "Payment Account Id",
        "type": "text",
        "money": false,
        "optional": false,
        "value": ""
      },
      {
        "name": "amountPaise",
        "label": "Amount (₹)",
        "type": "number",
        "money": true,
        "optional": false,
        "value": 0
      },
      {
        "name": "date",
        "label": "Date",
        "type": "date",
        "money": false,
        "optional": false,
        "value": ""
      },
      {
        "name": "billId",
        "label": "Bill Id",
        "type": "text",
        "money": false,
        "optional": true,
        "value": ""
      }
    ]
  },
  "pay": {
    "label": "Record loan payment",
    "schema": "LoanPaymentInput",
    "fields": [
      {
        "name": "paymentAccountId",
        "label": "Payment Account Id",
        "type": "text",
        "money": false,
        "optional": false,
        "value": ""
      },
      {
        "name": "principalPaise",
        "label": "Principal (₹)",
        "type": "number",
        "money": true,
        "optional": false,
        "value": 0
      },
      {
        "name": "interestPaise",
        "label": "Interest (₹)",
        "type": "number",
        "money": true,
        "optional": false,
        "value": 0
      },
      {
        "name": "feesPaise",
        "label": "Fees (₹)",
        "type": "number",
        "money": true,
        "optional": false,
        "value": 0
      },
      {
        "name": "date",
        "label": "Date",
        "type": "date",
        "money": false,
        "optional": false,
        "value": ""
      },
      {
        "name": "categoryId",
        "label": "Category Id",
        "type": "text",
        "money": false,
        "optional": false,
        "value": ""
      },
      {
        "name": "advanceDueDate",
        "label": "Advance Due Date",
        "type": "checkbox",
        "money": false,
        "optional": false,
        "value": false
      }
    ]
  },
  "reminder": {
    "label": "Set reminder",
    "schema": "ReminderInput",
    "fields": [
      {
        "name": "title",
        "label": "Title",
        "type": "text",
        "money": false,
        "optional": false,
        "value": ""
      },
      {
        "name": "dueDate",
        "label": "Due Date",
        "type": "date",
        "money": false,
        "optional": false,
        "value": ""
      }
    ]
  }
};
