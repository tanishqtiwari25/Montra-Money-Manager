import { useCallback } from 'react';
import { create } from 'zustand';
import { formatMoney } from './currency';
export const HIDDEN_AMOUNT='₹••••';
const key='wealthpilot.hide-amounts';
function savedPreference(){try{return localStorage.getItem(key)==='true';}catch{return false;}}
export const useAmountPrivacy=create<{hidden:boolean;setHidden:(hidden:boolean)=>void;toggle:()=>void}>((set,get)=>({hidden:savedPreference(),setHidden:hidden=>{try{localStorage.setItem(key,String(hidden));}catch{/* Keep the preference usable in memory. */}set({hidden});},toggle:()=>get().setHidden(!get().hidden)}));
export function privateMoney(paise:number,hidden:boolean,options:Parameters<typeof formatMoney>[1]={}){return hidden?HIDDEN_AMOUNT:formatMoney(paise,options);}
export function maskMoneyText(text:string,hidden:boolean){return hidden?text.replace(/(?:[−-]\s*)?(?:₹\s*|\b(?:INR|Rs\.?)\s*)(?:[−-]\s*)?\d[\d,]*(?:\.\d+)?(?:\s*(?:crores?|crore|lakhs?|lacs?|Cr|Lakh|k)\b)?/gi,HIDDEN_AMOUNT).replace(/\b\d[\d,]*(?:\.\d+)?\s*(?:rupees|INR)\b/gi,HIDDEN_AMOUNT):text;}
export function usePrivateMoney(){const hidden=useAmountPrivacy(s=>s.hidden);return useCallback((paise:number,options:Parameters<typeof formatMoney>[1]={})=>privateMoney(paise,hidden,options),[hidden]);}
export function usePrivateText(){const hidden=useAmountPrivacy(s=>s.hidden);return useCallback((text:string)=>maskMoneyText(text,hidden),[hidden]);}
