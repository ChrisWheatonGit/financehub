"use client";
import { useState } from "react";
import { Activity, ArrowDownRight, ArrowUpRight, Bell, CalendarDays, ChartNoAxesCombined, ChevronDown, CreditCard, FileText, House, Landmark, LayoutDashboard, Menu, Moon, PiggyBank, Plus, ReceiptText, Repeat, Settings, ShieldCheck, Target, Wallet, X } from "lucide-react";
import { cashflow, overview, spending, transactions } from "@/lib/demo-data";
import Expenses from "@/components/expenses";
const nav = [
  {section:"OVERVIEW",items:[{name:"Dashboard",icon:LayoutDashboard},{name:"Transactions",icon:ReceiptText},{name:"Accounts",icon:Landmark},{name:"Budgets",icon:Wallet}]},
  {section:"PLANNING",items:[{name:"Debt & Loans",icon:CreditCard},{name:"Savings Goals",icon:Target},{name:"Retirement",icon:ChartNoAxesCombined},{name:"Subscriptions",icon:Repeat},{name:"Calculators",icon:House}]},
  {section:"MANAGE",items:[{name:"Documents",icon:FileText},{name:"Settings",icon:Settings}]}
];
function LineChart() {
 const max=5000, w=680, h=220, pad=20;
 const pts=(key:"income"|"expenses")=>cashflow.map((v,i)=>`${pad+(i*(w-2*pad))/(cashflow.length-1)},${h-pad-(v[key]/max)*(h-2*pad)}`).join(" ");
 return <div className="chart"><svg viewBox={`0 0 ${w} ${h}`} role="img" aria-label="Demo cash flow: income and expenses for May to October">
   {[1000,2000,3000,4000].map(v=><line key={v} x1={pad} x2={w-pad} y1={h-pad-v/max*(h-2*pad)} y2={h-pad-v/max*(h-2*pad)} stroke="#e8edf5" strokeDasharray="5 7"/>)}
   <polyline points={pts("income")} fill="none" stroke="#5664e8" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"/>
   <polyline points={pts("expenses")} fill="none" stroke="#23b5aa" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"/>
   {cashflow.map((v,i)=><text key={v.month} x={pad+i*(w-2*pad)/(cashflow.length-1)} y={h-1} textAnchor="middle" className="axis">{v.month}</text>)}
 </svg></div>;
}
export default function HomePage(){
 const [selected,setSelected]=useState("Dashboard"); const [mobile,setMobile]=useState(false);
 return <div className="shell">
  <aside className={`sidebar ${mobile?"sidebar-open":""}`}>
   <div className="brand"><div className="brand-icon"><ChartNoAxesCombined size={22}/></div><div><strong>FinanceHub</strong><small>PERSONAL FINANCE</small></div><button className="close" onClick={()=>setMobile(false)} aria-label="Close navigation"><X size={18}/></button></div>
   <div className="workspace"><div className="workspace-avatar">FH</div><div><strong>Demo Workspace</strong><small>Local preview</small></div><ChevronDown size={14}/></div>
   <nav>{nav.map(group=><div className="navgroup" key={group.section}><span className="navlabel">{group.section}</span>{group.items.map(item=>{const Icon=item.icon;return <button key={item.name} className={`navitem ${selected===item.name?"active":""}`} onClick={()=>{setSelected(item.name);setMobile(false)}}><Icon size={18}/>{item.name}</button>})}</div>)}</nav>
   <div className="sidebar-bottom"><ShieldCheck size={18}/><span>Self-hosted • Demo mode</span></div>
  </aside>
  <main className="main">
   <header className="topbar"><button className="menu" onClick={()=>setMobile(true)} aria-label="Open navigation"><Menu size={22}/></button><span className="breadcrumb">Workspace <span>/</span> {selected}</span><div className="top-actions"><span className="demo-pill">● DEMO DATA</span><Bell size={19}/><div className="user-avatar">FH</div></div></header>
   {selected==="Transactions"?<Expenses/>:selected!=="Dashboard"?<section className="content"><div className="pagehead"><div><span className="eyebrow">FINANCEHUB</span><h1>{selected}</h1><p>This module is planned for the next development milestone. No real account data is collected yet.</p></div></div><div className="empty-card"><Activity size={30}/><h2>{selected} is coming next</h2><p>The navigation is ready; we'll connect this feature after secure authentication and the database layer are implemented.</p><button onClick={()=>setSelected("Dashboard")} className="primary">Return to Dashboard</button></div></section>:
   <section className="content">
    <div className="pagehead"><div><span className="eyebrow">YOUR FINANCIAL OVERVIEW</span><h1>Good afternoon <span className="wave">👋</span></h1><p>Here's a snapshot of your financial world. All amounts below are fictional.</p></div><span className="date-pill"><CalendarDays size={16}/> October 2026</span></div>
    <div className="stat-grid">{overview.map((item,i)=>{const Icon=[Wallet,ArrowDownRight,ReceiptText,CreditCard][i];return <article className="stat" key={item.label}><div className="stat-heading"><span>{item.label}</span><div className={`stat-icon si${i}`}><Icon size={18}/></div></div><strong>{item.value}</strong><small className={item.tone==="positive"?"good":"muted"}>{item.change}</small></article>})}</div>
    <div className="major-grid"><article className="panel"><div className="panel-title"><div><h2>Cash Flow</h2><p>Income vs expenses over time</p></div><span className="period">Last 6 months <ChevronDown size={14}/></span></div><div className="legend"><span><i className="dot income"/> Income</span><span><i className="dot expenses"/> Expenses</span></div><LineChart/></article>
    <article className="panel"><div className="panel-title"><div><h2>Spending Breakdown</h2><p>Where your money is going</p></div><span className="period">This month</span></div><div className="donut" style={{background:`conic-gradient(${spending.map((s,i)=>{const start=spending.slice(0,i).reduce((n,x)=>n+x.amount,0)/2680*100;return `${s.color} ${start}% ${(start+s.amount/2680*100)}%`}).join(",")})`}}><div><small>Total Spent</small><strong>$2,680</strong></div></div><div className="spend-list">{spending.map(s=><div key={s.label}><span><i style={{background:s.color}}/>{s.label}</span><strong>${s.amount.toLocaleString()}</strong></div>)}</div></article></div>
    <div className="bottom-grid"><article className="panel"><div className="panel-title"><div><h2>Recent Transactions</h2><p>Your latest activity</p></div><span className="period">Demo records</span></div><div className="transactions">{transactions.map(t=><div className="tx" key={t.name}><div className="tx-icon">{t.symbol}</div><div className="tx-name"><strong>{t.name}</strong><small>{t.category} · {t.date}</small></div><strong className={t.amount>0?"good":""}>{t.amount>0?"+":"−"}${Math.abs(t.amount).toLocaleString("en-US",{minimumFractionDigits:2})}</strong></div>)}</div></article>
    <article className="panel goals"><div className="panel-title"><div><h2>Savings Goals</h2><p>Keep your goals in sight</p></div><PiggyBank size={20} color="#6d70db"/></div><div className="goalrow"><div><strong>Emergency Fund</strong><span>$4,800 / $10,000</span></div><div className="progress"><span style={{width:"48%"}}/></div><small>48% complete</small></div><div className="goalrow"><div><strong>Home Down Payment</strong><span>$7,500 / $25,000</span></div><div className="progress"><span style={{width:"30%"}}/></div><small>30% complete</small></div><div className="demo-note"><ShieldCheck size={17}/> This is a fictional demo. Authentication and private account storage are not enabled.</div></article></div>
   </section>}
  </main>
 </div>
}
