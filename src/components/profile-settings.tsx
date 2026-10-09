"use client";
import {useState} from "react";
import {BadgeDollarSign, Banknote, BriefcaseBusiness, Calculator, Check, CreditCard, Landmark, LineChart, MapPin, PiggyBank, Receipt, Save, Target, Wallet} from "lucide-react";
import type {Profile} from "@/lib/personalization";
import {AVATAR_OPTIONS} from "@/lib/personalization";

const avatarMap={
 wallet:{Icon:Wallet,bg:"#eaf1ff",fg:"#5168e5",accent:"#96a9ff",label:"Wallet"},
 card:{Icon:CreditCard,bg:"#edf7f4",fg:"#2b9f87",accent:"#92dac7",label:"Card"},
 saver:{Icon:PiggyBank,bg:"#fff1ea",fg:"#d47a42",accent:"#f3c29e",label:"Saver"},
 budget:{Icon:Calculator,bg:"#f4eefc",fg:"#8a69c8",accent:"#c9b4ea",label:"Budget"},
 payroll:{Icon:Banknote,bg:"#edf6ff",fg:"#4a83d8",accent:"#9ac1f4",label:"Payroll"},
 investor:{Icon:LineChart,bg:"#edf7ef",fg:"#4a9361",accent:"#9ed2ac",label:"Investor"},
 planner:{Icon:BriefcaseBusiness,bg:"#fff6e9",fg:"#bf8a34",accent:"#eecb8d",label:"Planner"},
 mortgage:{Icon:Landmark,bg:"#f3f4f7",fg:"#5f6784",accent:"#b8bfd4",label:"Mortgage"},
 analyst:{Icon:LineChart,bg:"#eef3ff",fg:"#4867b9",accent:"#a9bbe9",label:"Analyst"},
 banker:{Icon:BadgeDollarSign,bg:"#eef8f0",fg:"#4b8d5c",accent:"#9ed0aa",label:"Banker"},
 goals:{Icon:Target,bg:"#fff0f4",fg:"#c76683",accent:"#efb1c1",label:"Goals"},
 taxes:{Icon:Receipt,bg:"#f1f3f7",fg:"#6c748f",accent:"#bec4d7",label:"Taxes"}
} as const;

type AvatarId = keyof typeof avatarMap;

export function ProfileAvatar({avatar,size=20}:{avatar:string;size?:number}){
 const meta=avatarMap[(avatar as AvatarId)]||avatarMap.wallet;
 const {Icon,bg,fg,accent,label}=meta;
 return <span className="finance-avatar" style={{width:size*2,height:size*2,background:bg,color:fg}} aria-label={label}><span className="finance-avatar-glow" style={{background:accent}}/><span className="finance-avatar-inner"><Icon size={size} aria-hidden="true" strokeWidth={2.2}/></span></span>
}

export default function ProfileSettings({profile,onSave}:{profile:Profile;onSave:(p:Profile)=>void}){
 const [draft,setDraft]=useState(profile);const [saved,setSaved]=useState(false);
 const edit=(key:keyof Profile,value:string)=>{setDraft(p=>({...p,[key]:value}));setSaved(false)};
 const currentMeta=avatarMap[(draft.avatar as AvatarId)]||avatarMap.wallet;
 return <section className="content profile-page"><div className="pagehead"><div><span className="eyebrow">PERSONALIZATION</span><h1>My Profile</h1><p>Choose a finance-themed avatar and personalize your workspace.</p></div></div>
 <div className="profile-layout"><article className="panel"><div className="profile-hero"><div className="profile-avatar-large"><ProfileAvatar avatar={draft.avatar} size={18}/></div><div><h2>{draft.displayName.trim()||"Demo User"}</h2><p>{draft.career||"Your career"}{draft.company?` · ${draft.company}`:""}</p><small className="avatar-caption">Selected avatar: {currentMeta.label}</small></div></div>
 <div className="panel-title"><div><h2>Choose your avatar</h2><p>12 polished finance-themed profile options</p></div></div>
 <div className="avatar-picker">{AVATAR_OPTIONS.map(({id,name})=><button type="button" key={id} className={`avatar-option ${draft.avatar===id?"active":""}`} aria-label={`${name} avatar`} aria-pressed={draft.avatar===id} title={name} onClick={()=>edit("avatar",id)}><ProfileAvatar avatar={id} size={12}/><span className="avatar-name">{name}</span>{draft.avatar===id&&<Check className="avatar-check" size={12}/>}</button>)}</div>
 <div className="profile-form"><label>Display name<input maxLength={64} value={draft.displayName} onChange={e=>edit("displayName",e.target.value)} placeholder="How you'd like to be addressed"/></label><label>Career / occupation<input maxLength={80} value={draft.career} onChange={e=>edit("career",e.target.value)} placeholder="e.g. Systems Engineer"/></label><label>Company / organization<input maxLength={100} value={draft.company} onChange={e=>edit("company",e.target.value)} placeholder="Optional"/></label><label>Location <span>(optional)</span><input maxLength={100} value={draft.location} onChange={e=>edit("location",e.target.value)} placeholder="City or region — not a street address"/></label><label className="profile-full">About me <span>(optional)</span><textarea maxLength={350} rows={4} value={draft.bio} onChange={e=>edit("bio",e.target.value)} placeholder="A little about yourself"/></label></div>
 <div className="profile-footer"><button className="primary" type="button" disabled={!draft.displayName.trim()} onClick={()=>{onSave({...draft,displayName:draft.displayName.trim()});setSaved(true)}}><Save size={16}/> Save profile</button>{saved&&<span role="status" className="profile-saved"><Check size={16}/> Saved on this device</span>}</div></article>
 <aside className="panel profile-aside"><h2>Personal and private</h2><p>This is a fictional, browser-only development profile. Your edits stay on this browser, not in the shared household database or your GitHub repository.</p><p>Real user profiles and permissions will be connected to authenticated accounts later. Your career and employer will remain optional.</p><div className="profile-tip"><MapPin size={18}/> Avoid entering sensitive identifiers, account information, or your full address.</div></aside></div></section>
}
