export type TransactionType = "expense" | "income";
export type Transaction = { id: string; date: string; description: string; category: string; amountCents: number; type: TransactionType; note?: string };
export const EXPENSE_CATEGORIES = ["Housing", "Groceries", "Dining", "Transportation", "Utilities", "Healthcare", "Shopping", "Entertainment", "Subscriptions", "Education", "Other"];
export const INCOME_CATEGORIES = ["Paycheck", "Side Income", "Interest", "Gift", "Other Income"];
export const SEED_TRANSACTIONS: Transaction[] = [
 {id:"demo-1",date:"2026-10-07",description:"Fresh Market",category:"Groceries",amountCents:8235,type:"expense"},
 {id:"demo-2",date:"2026-10-05",description:"October Paycheck",category:"Paycheck",amountCents:242500,type:"income"},
 {id:"demo-3",date:"2026-10-04",description:"Electric Service",category:"Utilities",amountCents:13210,type:"expense"},
 {id:"demo-4",date:"2026-10-03",description:"Fuel Stop",category:"Transportation",amountCents:4822,type:"expense"},
 {id:"demo-5",date:"2026-10-02",description:"Rent Payment",category:"Housing",amountCents:105000,type:"expense"},
 {id:"demo-6",date:"2026-10-01",description:"Coffee House",category:"Dining",amountCents:1460,type:"expense"},
 {id:"demo-7",date:"2026-09-28",description:"Streaming Service",category:"Subscriptions",amountCents:1599,type:"expense"},
 {id:"demo-8",date:"2026-09-26",description:"Freelance Work",category:"Side Income",amountCents:45000,type:"income"},
 {id:"demo-9",date:"2026-09-24",description:"Pharmacy",category:"Healthcare",amountCents:2540,type:"expense"},
];
export const money = (cents: number) => (cents/100).toLocaleString("en-US",{style:"currency",currency:"USD"});
export function parseMoneyToCents(value:string):number | null {const n=Number(value);if(!/^\d+(\.\d{1,2})?$/.test(value.trim())||!Number.isFinite(n)||n<=0||n>1000000000)return null;return Math.round(n*100)}
export function isTransaction(value:unknown):value is Transaction {if(!value||typeof value!=="object")return false;const x=value as Partial<Transaction>;return typeof x.id==="string"&&x.id.length<100&&typeof x.date==="string"&&/^\d{4}-\d\d-\d\d$/.test(x.date)&&typeof x.description==="string"&&x.description.length<=120&&typeof x.category==="string"&&x.category.length<=40&&typeof x.amountCents==="number"&&Number.isSafeInteger(x.amountCents)&&x.amountCents>0&&x.amountCents<=100000000000&&["expense","income"].includes(x.type||"")&&(x.note===undefined||(typeof x.note==="string"&&x.note.length<=500));}
