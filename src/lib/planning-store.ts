"use client";
import {useEffect,useState} from "react";
export type Goal={id:string;name:string;kind:string;current:number;target:number;monthly:number};
export type Budget={id:string;category:string;limit:number};
export type Retirement={id:string;name:string;kind:string;balance:number;monthly:number;match:number};
export const demoGoals:Goal[]=[{id:"demo-emergency",name:"Emergency Fund",kind:"Emergency",current:480000,target:1000000,monthly:30000},{id:"demo-home",name:"Home Down Payment",kind:"Home",current:750000,target:2500000,monthly:50000}];
export const demoBudgets:Budget[]=[{id:"b1",category:"Groceries",limit:60000},{id:"b2",category:"Dining",limit:25000},{id:"b3",category:"Transport",limit:30000}];
export const demoRetirement:Retirement[]=[{id:"r1",name:"Example Workplace 401(k)",kind:"401(k)",balance:1150000,monthly:24000,match:12000},{id:"r2",name:"Example Roth IRA",kind:"Roth IRA",balance:375000,monthly:15000,match:0}];
export const dollars=(v:number)=>new Intl.NumberFormat("en-US",{style:"currency",currency:"USD"}).format(v/100);
export const toCents=(v:string)=>/^\d+(?:\.\d{1,2})?$/.test(v.trim())&&Number(v)<1e10?Math.round(Number(v)*100):NaN;
export function useLocalDemo<T>(key:string,initial:T[],guard:(v:unknown)=>v is T){
 const [items,setItems]=useState<T[]>(initial);const [loaded,setLoaded]=useState(false);
 useEffect(()=>{try{const raw=localStorage.getItem(key);if(raw!==null){const parsed:unknown=JSON.parse(raw);if(Array.isArray(parsed)&&parsed.length<=500&&parsed.every(guard))setItems(parsed)}}catch{}setLoaded(true)},[key]);
 useEffect(()=>{if(loaded)try{localStorage.setItem(key,JSON.stringify(items))}catch{}},[key,loaded,items]);
 return {items,setItems};
}
const obj=(v:unknown):v is Record<string,unknown>=>typeof v==="object"&&v!==null;
const num=(v:unknown)=>typeof v==="number"&&Number.isSafeInteger(v)&&v>=0&&v<=1e12;
export const isGoal=(v:unknown):v is Goal=>obj(v)&&typeof v.id==="string"&&typeof v.name==="string"&&typeof v.kind==="string"&&num(v.current)&&num(v.target)&&num(v.monthly);
export const isBudget=(v:unknown):v is Budget=>obj(v)&&typeof v.id==="string"&&typeof v.category==="string"&&num(v.limit);
export const isRetirement=(v:unknown):v is Retirement=>obj(v)&&typeof v.id==="string"&&typeof v.name==="string"&&typeof v.kind==="string"&&num(v.balance)&&num(v.monthly)&&num(v.match);
