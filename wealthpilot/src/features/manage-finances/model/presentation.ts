export const financeTasks = [
 {key:'account',label:'Bank account or wallet',description:'Start with the money you already have.'},
 {key:'card',label:'Debit or credit card',description:'Keep your cards and card bills together.'},
 {key:'budget',label:'Monthly budget',description:'Choose a spending limit for a category.'},
 {key:'loan',label:'Loan',description:'Track what you owe and your monthly payment.'},
 {key:'bill',label:'Credit card bill',description:'Record a statement and its due date.'},
 {key:'repay',label:'Card repayment',description:'Record a payment you have already made.'},
 {key:'pay',label:'Loan payment',description:'Record principal, interest and fees.'},
 {key:'reminder',label:'Payment reminder',description:'Remember a date that matters.'},
 {key:'category',label:'Spending category',description:'Organise expenses in your own way.'},
];
const labels:Record<string,string>={institution:'Bank or provider',accountId:'Linked account',paymentAccountId:'Pay from',categoryId:'Category',openingBalancePaise:'Starting balance (₹)',openingDebtPaise:'Starting card debt (₹)',principalPaise:'Original loan amount (₹)',outstandingPaise:'Amount still owed (₹)',emiPaise:'Monthly payment (₹)',annualInterestRate:'Yearly interest rate (%)',remainingMonths:'Months left',lastFour:'Last 4 digits (optional)',dueDate:'Payment due date',nextDueDate:'Next payment date',limitPaise:'Limit (₹)',advanceDueDate:'Update next payment date',billId:'Apply to a bill (optional)',name:'Name',issuer:'Card provider',type:'Account type'};
export function financeLabel(name:string,fallback:string,kind:string){if(name==='type'&&kind==='card')return 'Card type';if(name==='limitPaise'&&kind==='budget')return 'Monthly spending limit (₹)';if(name==='principalPaise'&&kind==='pay')return 'Amount paid towards the loan (₹)';return labels[name]??fallback;}
export const choiceLabels:Record<string,string>={bank:'Bank account',wallet:'Digital wallet',cash:'Cash in hand',investment:'Investment account',debit:'Debit card',credit:'Credit card'};
