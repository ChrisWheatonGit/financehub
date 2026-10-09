"use client";
import {useEffect,useState} from "react";
import {demoGoals,type Goal} from "@/lib/planning-store";
type Debt={balanceCents:number;paymentCents:number};
type Subscription={cost:number;frequency:string;active:boolean};
type Overview={debtCents:number;debtPaymentCents:number;debtCount:number;savingsCents:number;goals:Goal[];subscriptionMonthlyCents:number;subscriptionCount:number};
const seed:Overview={debtCents:0,debtPaymentCents:0,debtCount:0,savingsCents:demoGoals.reduce((n,g)=>n+g.current,0),goals:demoGoals,subscriptionMonthlyCents:0,subscriptionCount:0};
function list<T>(key:string,validate:(item:unknown)=>item is T):T[]|null {try{const raw=localStorage.getItem(key);if(raw===null)return null;const parsed:unknown=JSON.parse(raw);if(Array.isArray(parsed)&&parsed.length<=500&&parsed.every(validate))return parsed}catch{}return null}
const isObj=(v:unknown):v is Record<string,unknown>=>typeof v==="object"&&v!==null;
const cents=(v:unknown)=>typeof v==="number"&&Number.isSafeInteger(v)&&v>=0&&v<=1e12;
const validDebt=(v:unknown):v is Debt=>isObj(v)&&cents(v.balanceCents)&&cents(v.paymentCents);
const validGoal=(v:unknown):v is Goal=>isObj(v)&&typeof v.id==="string"&&typeof v.name==="string"&&cents(v.current)&&cents(v.target)&&typeof v.kind==="string"&&cents(v.monthly);
const validSubscription=(v:unknown):v is Subscription=>isObj(v)&&cents(v.cost)&&typeof v.frequency==="string"&&["Monthly","Quarterly","Yearly"].includes(v.frequency)&&typeof v.active==="boolean";
export function useOverviewData(selected:string):Overview{
 const [state,setState]=useState<Overview>(seed);
 useEffect(()=>{if(selected!=="Dashboard")return;
  const debt=list("financehub:fictional-debts:v1",validDebt)??[];
  const goals=list("financehub:demo-savings:v1",validGoal)??demoGoals;
  const subscriptions=list("financehub:demo-subscriptions:v1",validSubscription)??[];
  const active=subscriptions.filter(s=>s.active);
  setState({debtCents:debt.reduce((sum,d)=>sum+d.balanceCents,0),debtPaymentCents:debt.reduce((sum,d)=>sum+d.paymentCents,0),debtCount:debt.length,savingsCents:goals.reduce((sum,g)=>sum+g.current,0),goals,subscriptionMonthlyCents:Math.round(active.reduce((sum,s)=>sum+(s.frequency==="Yearly"?s.cost/12:s.frequency==="Quarterly"?s.cost/3:s.cost),0)),subscriptionCount:active.length});
 },[selected]);
 return state;
}
