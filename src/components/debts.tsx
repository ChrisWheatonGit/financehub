"use client";
import {useEffect, useMemo, useState} from "react";
import {CreditCard, Plus, Pencil, Trash2, X, ShieldCheck} from "lucide-react";
import {money} from "@/lib/expense-data";
import FinanceChart from "@/components/finance-chart";

type Debt={id:string;name:string;kind:string;balanceCents:number;apr:number;paymentCents:number};
const KEY="financehub:fictional-debts:v1";
const SAMPLE:Debt[]=[
{id:"seed-card",name:"Example Credit Card",kind:"Credit Card",balanceCents:380000,apr:21.9,paymentCents:17500},
{id:"seed-loan",name:"Example Student Loan",kind:"Student Loan",balanceCents:1800000,apr:6.6,paymentCents:24000}];
const DEFAULT={name:"",kind:"Credit Card",balance:"",apr:"",payment:""};
const cents=(v:string)=>/^\d+(?:\.\d{1,2})?$/.test(v.trim())?Math.round(Number(v)*100):NaN;
const valid=(d:unknown):d is Debt=>typeof d==="object"&&d!==null&&typeof(d as Debt).id==="string"&&typeof(d as Debt).name==="string"&&typeof(d as Debt).kind==="string"&&Number.isSafeInteger((d as Debt).balanceCents)&& (d as Debt).balanceCents>=0&&Number.isFinite((d as Debt).apr)&&(d as Debt).apr>=0&&(d as Debt).apr<=100&&Number.isSafeInteger((d as Debt).paymentCents)&&(d as Debt).paymentCents>=0;
export function estimate(balanceCents:number,apr:number,paymentCents:number){
  if(balanceCents===0)return {months:0,interestCents:0};
  const r=apr/1200;
  if(paymentCents<=balanceCents*r)return null;
  let balance=balanceCents,interestCents=0;
  for(let month=1;month<=1200;month++){
    const interest=Math.round(balance*r);
    interestCents+=interest;
    balance=Math.max(0,balance+interest-paymentCents);
    if(balance===0)return {months:month,interestCents};
  }
  return null;
}
export default function Debts(){
 const [items,setItems]=useState<Debt[]>(SAMPLE),[loaded,setLoaded]=useState(false);
 const [open,setOpen]=useState(false),[editing,setEditing]=useState<string|null>(null),[form,setForm]=useState(DEFAULT),[error,setError]=useState("");
 useEffect(()=>{try{const raw=localStorage.getItem(KEY);if(raw!==null){const v:unknown=JSON.parse(raw);if(Array.isArray(v)&&v.length<=300&&v.every(valid))setItems(v);}}catch{}setLoaded(true)},[]);
 useEffect(()=>{if(loaded)try{localStorage.setItem(KEY,JSON.stringify(items))}catch{}},[items,loaded]);
 const total=useMemo(()=>items.reduce((sum,d)=>sum+d.balanceCents,0),[items]);
 const payments=useMemo(()=>items.reduce((sum,d)=>sum+d.paymentCents,0),[items]);
 const edit=(d:Debt)=>{setEditing(d.id);setForm({name:d.name,kind:d.kind,balance:(d.balanceCents/100).toFixed(2),apr:String(d.apr),payment:(d.paymentCents/100).toFixed(2)});setError("");setOpen(true)};
 const add=()=>{setEditing(null);setForm(DEFAULT);setError("");setOpen(true)};
 function save(e:React.FormEvent){e.preventDefault();const balance=cents(form.balance),payment=cents(form.payment),apr=Number(form.apr);
  if(!form.name.trim()||form.name.length>90||!Number.isSafeInteger(balance)||balance<0||balance>1e12||!Number.isSafeInteger(payment)||payment<=0||payment>1e11||form.apr.trim()===""||!Number.isFinite(apr)||apr<0||apr>100){setError("Enter a name, valid amounts, APR between 0 and 100%, and a positive payment.");return;}
  const item:Debt={id:editing||crypto.randomUUID(),name:form.name.trim(),kind:form.kind,balanceCents:balance,apr,paymentCents:payment};
  setItems(prev=>editing?prev.map(d=>d.id===editing?item:d):[...prev,item]);setOpen(false);
 }
 return <section className="content expenses-page debt-page">
  <div className="pagehead"><div><span className="eyebrow">PAYOFF PLANNING</span><h1>Debt & Loans</h1><p>Explore balances, interest and projected payoff with fictional data.</p></div><button className="primary add-button" onClick={add}><Plus size={16}/> Add Debt</button></div>
  <div className="notice"><ShieldCheck size={18}/><span><strong>Demo only:</strong> Stored in this browser without user authentication. Do not enter actual loan balances, lender account numbers or personal data.</span></div>
  <div className="expense-stats"><article className="stat"><div className="stat-heading">Total Outstanding <CreditCard size={18}/></div><strong>{money(total)}</strong><small className="muted">Across {items.length} fictional accounts</small></article><article className="stat"><div className="stat-heading">Scheduled Monthly Payments</div><strong>{money(payments)}</strong><small className="muted">User-supplied payment amounts</small></article><article className="stat"><div className="stat-heading">Average APR</div><strong>{items.length?(items.reduce((n,d)=>n+d.apr,0)/items.length).toFixed(2):"0.00"}%</strong><small className="muted">Simple account average (not weighted)</small></article></div>
  <FinanceChart title="Outstanding Balances" subtitle="Debt by account · current demo balance" points={items.map(x=>({label:x.name,value:x.balanceCents}))}/><div className="panel"><div className="panel-title"><div><h2>Debt portfolio</h2><p>Payoff projections assume a fixed APR and a constant monthly payment.</p></div></div><div className="table-scroll"><table className="expense-table debt-table"><thead><tr><th>Account</th><th>Balance</th><th>APR</th><th>Monthly payment</th><th>Est. payoff</th><th>Actions</th></tr></thead><tbody>{items.map(d=>{const result=estimate(d.balanceCents,d.apr,d.paymentCents);return <tr key={d.id}><td><span className="merchant"><strong>{d.name}</strong><small>{d.kind}</small></span></td><td>{money(d.balanceCents)}</td><td>{d.apr.toFixed(2)}%</td><td>{money(d.paymentCents)}</td><td>{result?result.months===0?"Paid off":`${result.months} mo · ${money(result.interestCents)} interest`:"Payment too low / >100 years"}</td><td className="row-actions"><button aria-label={`Edit ${d.name}`} onClick={()=>edit(d)}><Pencil size={16}/></button><button aria-label={`Delete ${d.name}`} onClick={()=>{if(confirm(`Delete fictional debt "${d.name}"?`))setItems(v=>v.filter(x=>x.id!==d.id))}}><Trash2 size={16}/></button></td></tr>})}</tbody></table>{!items.length&&<p className="no-results">No debts yet. Add a fictional account to start planning.</p>}</div><button className="secondary-btn reset-demo" onClick={()=>{if(confirm("Reset fictional debt accounts?"))setItems(SAMPLE)}}>Reset sample debts</button><p className="debt-footnote">Estimates exclude fees, rate changes, promotional interest, payment timing differences and extra principal payments. Not lender payoff quotes.</p></div>
  {open&&<div className="modal-backdrop" role="presentation" onMouseDown={e=>{if(e.target===e.currentTarget)setOpen(false)}}><div className="modal-card" role="dialog" aria-modal="true" aria-labelledby="debt-modal-title"><div className="modal-top"><div><span className="eyebrow">FICTIONAL ACCOUNT</span><h2 id="debt-modal-title">{editing?"Edit Debt":"Add Debt"}</h2></div><button aria-label="Close" onClick={()=>setOpen(false)}><X size={20}/></button></div><form className="expense-form" onSubmit={save}><label>Account label<input maxLength={90} required value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="e.g. Example Student Loan"/></label><label>Debt type<select value={form.kind} onChange={e=>setForm({...form,kind:e.target.value})}>{["Credit Card","Student Loan","Personal Loan","Auto Loan","Mortgage","Other"].map(k=><option key={k}>{k}</option>)}</select></label><div className="two-fields"><label>Balance ($)<input type="number" min="0" step="0.01" required value={form.balance} onChange={e=>setForm({...form,balance:e.target.value})}/></label><label>APR (%)<input type="number" min="0" max="100" step="0.01" required value={form.apr} onChange={e=>setForm({...form,apr:e.target.value})}/></label></div><label>Monthly payment ($)<input type="number" min="0.01" step="0.01" required value={form.payment} onChange={e=>setForm({...form,payment:e.target.value})}/></label>{error&&<p role="alert" className="form-error">{error}</p>}<div className="form-actions"><button type="button" className="secondary-btn" onClick={()=>setOpen(false)}>Cancel</button><button type="submit" className="primary">Save fictional debt</button></div></form></div></div>}
 </section>;
}
