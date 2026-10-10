export const PALETTES = [
 {id:"sage",name:"Sage & Charcoal",description:"Balanced muted sage, signature CommonSense",light:"#F7F8F6",dark:"#15191C",accent:"#8FA89A",deep:"#617B6D",soft:"#EDF2ED"},
 {id:"coastal",name:"Eucalyptus Slate",description:"Cool eucalyptus with graphite undertones",light:"#F7F8F8",dark:"#15191C",accent:"#8CA9A3",deep:"#607D79",soft:"#EDF2F1"},
 {id:"lavender",name:"Silver Sage",description:"Silvery sage and softened graphite",light:"#F8F9F7",dark:"#15191C",accent:"#9BAA9F",deep:"#737F77",soft:"#F0F2EF"},
 {id:"sand",name:"Stone & Moss",description:"Warm gray stone with quiet moss",light:"#F9F9F6",dark:"#15191C",accent:"#9EA994",deep:"#73796A",soft:"#F1F2ED"},
 {id:"rose",name:"Ash & Fern",description:"Soft ash-gray with fern accents",light:"#F7F8F7",dark:"#15191C",accent:"#99ADA5",deep:"#6D827B",soft:"#EFF2F0"},
 {id:"forest",name:"Juniper Charcoal",description:"Subtle deep juniper against dark slate",light:"#F6F8F7",dark:"#15191C",accent:"#829E95",deep:"#506B65",soft:"#ECF1EF"},
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
