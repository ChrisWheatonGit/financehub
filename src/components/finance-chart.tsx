"use client";
import React from "react";
export default function FinanceChart({title,subtitle,points,unit="currency"}:{title:string;subtitle:string;points:{label:string;value:number}[];unit?:"currency"|"percent"}){
 const items=points.filter(x=>Number.isFinite(x.value)&&x.value>=0).slice(0,18);
 const max=Math.max(1,...items.map(x=>x.value));
 const label=(n:number)=>unit==="percent"?`${n.toFixed(1)}%`:new Intl.NumberFormat("en-US",{style:"currency",currency:"USD",maximumFractionDigits:0}).format(n/100);
 return <article className="panel finance-graph"><div className="panel-title"><div><h2>{title}</h2><p>{subtitle}</p></div></div>{items.length?<div className="finance-bars" role="img" aria-label={`${title}: ${items.map(x=>`${x.label} ${label(x.value)}`).join(", ")}`}>{items.map((x,i)=><div className="finance-bar-column" key={`${x.label}-${i}`}><span className="finance-bar-value">{label(x.value)}</span><div className="finance-bar-track"><div className="finance-bar-fill" style={{height:`${Math.max(3,x.value/max*100)}%`}}/></div><span className="finance-bar-name" title={x.label}>{x.label}</span></div>)}</div>:<p className="planning-meta">No entries to chart yet.</p>}</article>;
}
