export function pocketMovement(direction: string, amount: string) {
 if (!['set-aside', 'release'].includes(direction)) throw new Error('Choose whether to set aside or release savings.');
 const rupees=Number(amount); const amountPaise=Math.round(rupees*100);
 if (!amount.trim()||!Number.isFinite(rupees)||!Number.isSafeInteger(amountPaise)||amountPaise<=0||Math.abs(rupees*100-amountPaise)>0.00001) throw new Error('Enter a positive amount with at most two decimal places.');
 return {direction,amountPaise};
}
export function loanVoid(reason: string, confirmation: string, loanName: string) {
 const trimmedReason=reason.trim();
 if(trimmedReason.length<8||trimmedReason.length>200)throw new Error('Give a reason of 8–200 characters.');
 if(!loanName||confirmation.trim()!==loanName)throw new Error('Type the selected loan name exactly, including its capitalization.');
 return {reason:trimmedReason,confirmation:confirmation.trim()};
}
