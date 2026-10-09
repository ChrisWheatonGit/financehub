"use client";
import { useEffect, useMemo, useState } from "react";
import { Activity, ArrowDownRight, ArrowUpRight, Bell, CalendarDays, ChartNoAxesCombined, ChevronDown, CreditCard, FileText, House, Landmark, LayoutDashboard, Menu, Moon, Sun, PiggyBank, Plus, ReceiptText, Repeat, Settings, ShieldCheck, Target, Wallet, X } from "lucide-react";
import { money, type Transaction } from "@/lib/expense-data";
import { useDemoTransactions } from "@/lib/transaction-store";
import Expenses from "@/components/expenses";
import Debts from "@/components/debts";
import Savings from "@/components/savings";
import Budgets from "@/components/budgets";
import RetirementPage from "@/components/retirement";
import Calculators from "@/components/calculators";
import Subscriptions from "@/components/subscriptions";
import AppearanceSettings from "@/components/appearance-settings";
import {useOverviewData} from "@/lib/overview-store";
const nav = [
  {section:"OVERVIEW",items:[{name:"Dashboard",icon:LayoutDashboard},{name:"Transactions",icon:ReceiptText},{name:"Accounts",icon:Landmark},{name:"Budgets",icon:Wallet}]},
  {section:"PLANNING",items:[{name:"Debt & Loans",icon:CreditCard},{name:"Savings Goals",icon:Target},{name:"Retirement",icon:ChartNoAxesCombined},{name:"Subscriptions",icon:Repeat},{name:"Calculators",icon:House}]},
  {section:"MANAGE",items:[{name:"Documents",icon:FileText},{name:"Settings",icon:Settings}]}
];
const categoryColors = ["#6366f1", "#14b8a6", "#f59e0b", "#f472b6", "#94a3b8", "#8b5cf6"];
function shiftMonth(month:string, delta:number){const [y,m]=month.split("-").map(Number);const date=new Date(Date.UTC(y,m-1+delta,1));return date.toISOString().slice(0,7)}
function summarize(entries:Transaction[], month:string){
 const inMonth=entries.filter(t=>t.date.startsWith(month));
 const income=inMonth.filter(t=>t.type==="income").reduce((sum,t)=>sum+t.amountCents,0);
 const expenses=inMonth.filter(t=>t.type==="expense").reduce((sum,t)=>sum+t.amountCents,0);
 const totals=new Map<string,number>();
 inMonth.filter(t=>t.type==="expense").forEach(t=>totals.set(t.category,(totals.get(t.category)||0)+t.amountCents));
 const spending=[...totals.entries()].sort((a,b)=>b[1]-a[1]).map(([label,amount],i)=>({label,amount,color:categoryColors[i%categoryColors.length]}));
 return {income,expenses,spending};
}
function LineChart({cashflow}:{cashflow:{month:string;income:number;expenses:number}[]}) {
 const w=680,h=220,pad=20;
 const max=Math.max(100,Math.ceil(Math.max(...cashflow.flatMap(v=>[v.income,v.expenses]),0)/100)*100);
 const pts=(key:"income"|"expenses")=>cashflow.map((v,i)=>`${pad+(i*(w-2*pad))/(cashflow.length-1)},${h-pad-(v[key]/max)*(h-2*pad)}`).join(" ");
 return <div className="chart"><svg viewBox={`0 0 ${w} ${h}`} role="img" aria-label="Income and expenses over six months">
   {[.25,.5,.75,1].map(k=><line key={k} x1={pad} x2={w-pad} y1={h-pad-k*(h-2*pad)} y2={h-pad-k*(h-2*pad)} stroke="#e8edf5" strokeDasharray="5 7"/>)}
   <polyline points={pts("income")} fill="none" stroke="#5664e8" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"/>
   <polyline points={pts("expenses")} fill="none" stroke="#23b5aa" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"/>
   {cashflow.map((v,i)=><text key={i} x={pad+i*(w-2*pad)/(cashflow.length-1)} y={h-1} textAnchor="middle" className="axis">{v.month}</text>)}
 </svg></div>;
}
export default function HomePage(){
 const [selected,setSelected]=useState("Dashboard"); const [mobile,setMobile]=useState(false);
 const [theme,setTheme]=useState<"light"|"dark"|"system">("system");
 const [systemDark,setSystemDark]=useState(false);
 useEffect(()=>{try{const saved=localStorage.getItem("financehub:appearance:v1");if(saved==="light"||saved==="dark"||saved==="system")setTheme(saved)}catch{}const query=window.matchMedia("(prefers-color-scheme: dark)");setSystemDark(query.matches);const sync=(e:MediaQueryListEvent)=>setSystemDark(e.matches);query.addEventListener("change",sync);return()=>query.removeEventListener("change",sync)},[]);
 const isDark=theme==="dark"||(theme==="system"&&systemDark);
 useEffect(()=>{document.documentElement.dataset.theme=isDark?"dark":"light";document.documentElement.style.colorScheme=isDark?"dark":"light"},[isDark]);
 function updateTheme(next:"light"|"dark"|"system"){setTheme(next);try{localStorage.setItem("financehub:appearance:v1",next)}catch{}}
 const overviewData=useOverviewData(selected);

 const {entries,setEntries}=useDemoTransactions();
 const [monthOverride,setMonthOverride]=useState<string|null>(null);
 const latestMonth=useMemo(()=>entries.length?[...entries].sort((a,b)=>b.date.localeCompare(a.date))[0].date.slice(0,7):"2026-10",[entries]);
 const month=monthOverride||latestMonth;
 const months=useMemo(()=>Array.from(new Set([...entries.map(t=>t.date.slice(0,7)),latestMonth])).sort().reverse(),[entries,latestMonth]);
 const {income,expenses,spending}=useMemo(()=>summarize(entries,month),[entries,month]);
 const recent=useMemo(()=>[...entries].sort((a,b)=>b.date.localeCompare(a.date)||b.id.localeCompare(a.id)).slice(0,4),[entries]);
 const cashflow=useMemo(()=>Array.from({length:6},(_,i)=>{const m=shiftMonth(month,i-5);const sums=summarize(entries,m);return {month:new Date(m+"-01T00:00:00Z").toLocaleDateString("en-US",{month:"short",timeZone:"UTC"}),income:sums.income/100,expenses:sums.expenses/100}}),[entries,month]);
 const overview=[
  {label:"Net Cash Flow",value:money(income-expenses),change:"Income minus expenses",tone:income>=expenses?"positive":"neutral"},
  {label:"Monthly Income",value:money(income),change:month,tone:"neutral"},
  {label:"Monthly Expenses",value:money(expenses),change:income?`${Math.round(expenses/income*100)}% of monthly income`:"No income recorded",tone:"neutral"},
  {label:"Total Debt",value:money(overviewData.debtCents),change:`${overviewData.debtCount} demo debt accounts`,tone:"neutral"},
 ];
 return <div className="shell">
  <aside className={`sidebar ${mobile?"sidebar-open":""}`}>
   <div className="brand"><button className="brand-link" type="button" aria-label="FinanceHub home" onClick={()=>{setSelected("Dashboard");setMobile(false)}}><div className="brand-icon"><ChartNoAxesCombined size={22}/></div><div><strong>FinanceHub</strong><small>PERSONAL FINANCE</small></div></button><button className="close" onClick={()=>setMobile(false)} aria-label="Close navigation"><X size={18}/></button></div>
   <div className="workspace"><div className="workspace-avatar">FH</div><div><strong>Demo Workspace</strong><small>Local preview</small></div><ChevronDown size={14}/></div>
   <nav>{nav.map(group=><div className="navgroup" key={group.section}><span className="navlabel">{group.section}</span>{group.items.map(item=>{const Icon=item.icon;return <button key={item.name} className={`navitem ${selected===item.name?"active":""}`} onClick={()=>{setSelected(item.name);setMobile(false)}}><Icon size={18}/>{item.name}</button>})}</div>)}</nav>
   <div className="sidebar-bottom"><ShieldCheck size={18}/><span>Self-hosted • Demo mode</span></div>
  </aside>
  <main className="main">
   <header className="topbar"><button className="menu" onClick={()=>setMobile(true)} aria-label="Open navigation"><Menu size={22}/></button><div className="breadcrumb"><button type="button" onClick={()=>{setSelected("Dashboard");setMobile(false)}}>Workspace</button><span>/</span><button type="button" onClick={()=>setSelected("Dashboard")} aria-current={selected==="Dashboard"?"page":undefined}>{selected}</button></div><div className="top-actions"><button className="theme-quick" title={isDark?"Switch to light mode":"Switch to dark mode"} aria-label={isDark?"Switch to light mode":"Switch to dark mode"} onClick={()=>updateTheme(isDark?"light":"dark")}>{isDark?<Sun size={18}/>:<Moon size={18}/>}</button><span className="demo-pill">● DEMO DATA</span><Bell size={19}/><div className="user-avatar">FH</div></div></header>
   {selected==="Transactions"?<Expenses entries={entries} setEntries={setEntries}/>:selected==="Debt & Loans"?<Debts/>:selected==="Savings Goals"?<Savings/>:selected==="Budgets"?<Budgets entries={entries}/>:selected==="Retirement"?<RetirementPage/>:selected==="Calculators"?<Calculators/>:selected==="Subscriptions"?<Subscriptions/>:selected==="Settings"?<AppearanceSettings theme={theme} onThemeChange={updateTheme} isDark={isDark}/>:selected!=="Dashboard"?<section className="content"><div className="pagehead"><div><span className="eyebrow">FINANCEHUB</span><h1>{selected}</h1><p>This module is planned for the next development milestone. No real account data is collected yet.</p></div></div><div className="empty-card"><Activity size={30}/><h2>{selected} is coming next</h2><p>The navigation is ready; we'll connect this feature after secure authentication and the database layer are implemented.</p><button onClick={()=>setSelected("Dashboard")} className="primary">Return to Dashboard</button></div></section>:
   <section className="content">
    <div className="pagehead"><div><span className="eyebrow">YOUR FINANCIAL OVERVIEW</span><h1>Good afternoon <span className="wave">👋</span></h1><p>Here's a snapshot of your financial world. Demo-only data. Transaction cards and charts update from your entries.</p></div><label className="date-pill"><CalendarDays size={16}/><select aria-label="Dashboard reporting month" value={month} onChange={e=>setMonthOverride(e.target.value)} style={{background:"transparent",border:0,color:"inherit",font:"inherit"}}>{months.map(m=><option key={m} value={m}>{m}</option>)}</select></label></div>
    <div className="stat-grid">{overview.map((item,i)=>{const Icon=[Wallet,ArrowDownRight,ReceiptText,CreditCard][i];return <article className="stat" key={item.label}><div className="stat-heading"><span>{item.label}</span><div className={`stat-icon si${i}`}><Icon size={18}/></div></div><strong>{item.value}</strong><small className={item.tone==="positive"?"good":"muted"}>{item.change}</small></article>})}</div>
    <div className="major-grid"><article className="panel"><div className="panel-title"><div><h2>Cash Flow</h2><p>Income vs expenses over time</p></div><span className="period">Last 6 months <ChevronDown size={14}/></span></div><div className="legend"><span><i className="dot income"/> Income</span><span><i className="dot expenses"/> Expenses</span></div><LineChart cashflow={cashflow}/></article>
    <article className="panel"><div className="panel-title"><div><h2>Spending Breakdown</h2><p>Where your money is going</p></div><span className="period">This month</span></div><div className="donut" style={{background:expenses?`conic-gradient(${spending.map((item,i)=>{const prior=spending.slice(0,i).reduce((n,x)=>n+x.amount,0)/expenses*100;return `${item.color} ${prior}% ${prior+item.amount/expenses*100}%`}).join(",")})`:"#e7eaf0"}}><div><small>Total Spent</small><strong>{money(expenses)}</strong></div></div><div className="spend-list">{spending.length?spending.map(item=><div key={item.label}><span><i style={{background:item.color}}/>{item.label}</span><strong>{money(item.amount)}</strong></div>):<p>No expenses in this month.</p>}</div></article></div>
    <div className="bottom-grid"><article className="panel"><div className="panel-title"><div><h2>Recent Transactions</h2><p>Your latest activity · all months</p></div><span className="period">Recent demo records</span></div><div className="transactions">{recent.length?recent.map(t=><div className="tx" key={t.id}><div className="tx-icon">{t.type==="income"?"↗":"↘"}</div><div className="tx-name"><strong>{t.description}</strong><small>{t.category} · {t.date}</small></div><strong className={t.type==="income"?"good":""}>{t.type==="income"?"+":"−"}{money(t.amountCents)}</strong></div>):<p>No transactions yet. Add one from Transactions.</p>}</div></article>
    <article className="panel goals"><div className="panel-title"><div><h2>Savings Goals</h2><p>Keep your goals in sight</p></div><PiggyBank size={20} color="#6d70db"/></div>{overviewData.goals.map(goal=><div className="goalrow" key={goal.id}><div><strong>{goal.name}</strong><span>{money(goal.current)} / {money(goal.target)}</span></div><div className="progress"><span style={{width:`${goal.target?Math.min(100,goal.current/goal.target*100):0}%`}}/></div><small>{goal.target?Math.round(goal.current/goal.target*100):0}% complete</small></div>)}{!overviewData.goals.length&&<p className="planning-meta">Create a savings goal to see it here.</p>}<div className="demo-note"><ShieldCheck size={17}/> This is a fictional demo. Authentication and private account storage are not enabled.</div></article></div>
    <div className="insights-grid"><article className="panel"><div className="panel-title"><div><h2>Monthly Commitments</h2><p>Subscription and debt payment planning · not deducted from cash flow</p></div><Repeat size={19} color="#6976e5"/></div><div className="commitment-row"><span>Active subscriptions</span><strong>{money(overviewData.subscriptionMonthlyCents)} / month</strong></div><div className="commitment-row"><span>Scheduled debt payments</span><strong>{money(overviewData.debtPaymentCents)} / month</strong></div><div className="commitment-total"><span>Combined commitments</span><strong>{money(overviewData.subscriptionMonthlyCents+overviewData.debtPaymentCents)} / month</strong></div><p className="planning-meta">Planning estimates only. Avoid recording a subscription or loan payment again as a new expense unless it represents an actual transaction; this card does not alter your cash flow totals.</p></article><article className="panel"><div className="panel-title"><div><h2>At a Glance</h2><p>Data from your existing demo planning modules</p></div><Target size={19} color="#6976e5"/></div><div className="commitment-row"><span>Tracked debt</span><strong>{money(overviewData.debtCents)}</strong></div><div className="commitment-row"><span>Total saved toward goals</span><strong>{money(overviewData.savingsCents)}</strong></div><div className="commitment-row"><span>Active subscriptions</span><strong>{overviewData.subscriptionCount}</strong></div><button className="secondary-btn insight-action" onClick={()=>setSelected("Subscriptions")}>Manage subscriptions →</button></article></div>
   </section>}
  </main>
 </div>
}
