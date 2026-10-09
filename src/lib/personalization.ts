export const PALETTES = [
 {id:"sage",name:"Sage Garden",description:"Soft sage and quiet greenery",light:"#f4f7f2",dark:"#141f1b",accent:"#638875",deep:"#345746",soft:"#d8e6db"},
 {id:"coastal",name:"Coastal Mist",description:"Sea glass and washed blue",light:"#f1f7f8",dark:"#142329",accent:"#5b8995",deep:"#315760",soft:"#d6e7e9"},
 {id:"lavender",name:"Lavender Haze",description:"Soft lilac and gentle gray",light:"#f7f4fa",dark:"#211c2a",accent:"#8e7da9",deep:"#574667",soft:"#e5daee"},
 {id:"sand",name:"Warm Sand",description:"Cream and understated earth",light:"#f9f6f1",dark:"#26211d",accent:"#9c8267",deep:"#64503c",soft:"#e9ddce"},
 {id:"rose",name:"Dusty Rose",description:"Calming blush and stone",light:"#faf5f5",dark:"#281e24",accent:"#a47d89",deep:"#664852",soft:"#eedde1"},
 {id:"forest",name:"Forest Retreat",description:"Eucalyptus and woodland",light:"#f2f6f2",dark:"#15221c",accent:"#5f8571",deep:"#355746",soft:"#d7e4d8"}
] as const;
export type PaletteId = typeof PALETTES[number]["id"];
export type Profile = {displayName:string;career:string;company:string;location:string;bio:string;avatar:string};
export const AVATAR_OPTIONS = [
 {id:"wallet",name:"Wallet"},
 {id:"card",name:"Card"},
 {id:"saver",name:"Saver"},
 {id:"budget",name:"Budget"},
 {id:"payroll",name:"Payroll"},
 {id:"investor",name:"Investor"},
 {id:"planner",name:"Planner"},
 {id:"mortgage",name:"Mortgage"},
 {id:"analyst",name:"Analyst"},
 {id:"banker",name:"Banker"},
 {id:"goals",name:"Goals"},
 {id:"taxes",name:"Taxes"}
] as const;
export const AVATARS = AVATAR_OPTIONS.map(option=>option.id) as readonly string[];
export const DEFAULT_PROFILE:Profile = {displayName:"Demo User",career:"",company:"",location:"",bio:"",avatar:"wallet"};
export const PERSONALIZATION_KEY="financehub:profile:demo:v1";
