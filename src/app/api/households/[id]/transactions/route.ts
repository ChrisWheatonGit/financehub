import { db } from "@/lib/db";
import { authenticatedUser,requireMember,requestError } from "@/lib/household-access";
import { validateAllocations } from "@/lib/household-helpers.mjs";
import { z } from "zod";
const uuid=z.uuid();
const schema=z.object({accountId:uuid,categoryId:uuid.optional(),kind:z.enum(["EXPENSE","INCOME"]),amountCents:z.number().int().positive().safe(),description:z.string().trim().min(1).max(250),occurredAt:z.iso.datetime(),paidByUserId:z.string().optional(),splits:z.array(z.object({userId:z.string(),amountCents:z.number().int().nonnegative().safe()})).optional()});
export async function GET(_request:Request,ctx:{params:Promise<{id:string}>}) {
 try {const user=await authenticatedUser();const {id}=await ctx.params;await requireMember(id,user.id);
 const entries=await db.ledgerTransaction.findMany({where:{householdId:id},take:100,orderBy:{occurredAt:"desc"},include:{splits:true}});
 return Response.json({transactions:entries.map(t=>({...t,amountCents:t.amountCents.toString(),splits:t.splits.map(s=>({...s,amountCents:s.amountCents.toString()}))}))},{headers:{"Cache-Control":"no-store"}});
 }catch(e){return requestError(e);}
}
export async function POST(request:Request,ctx:{params:Promise<{id:string}>}) {
 try {const user=await authenticatedUser();const {id}=await ctx.params;await requireMember(id,user.id);
 const d=schema.parse(await request.json());
 if(d.splits && (d.kind!=="EXPENSE"|| !validateAllocations(d.amountCents,d.splits))) return Response.json({error:"Invalid allocation"},{status:400});
 const tx=await db.$transaction(async(dbtx)=>{
 const account=await dbtx.financialAccount.findUnique({where:{id_householdId:{id:d.accountId,householdId:id}}});
 if(!account) throw new Error("NOT_FOUND");
 if(d.categoryId && !(await dbtx.financialCategory.findUnique({where:{id_householdId:{id:d.categoryId,householdId:id}}})))throw new Error("NOT_FOUND");
 const ids=[...(d.splits?.map(x=>x.userId)||[]),...(d.paidByUserId?[d.paidByUserId]:[])];
 if(ids.length){const count=await dbtx.householdMember.count({where:{householdId:id,userId:{in:[...new Set(ids)]}}});if(count!==new Set(ids).size)throw new Error("NOT_FOUND");}
 return dbtx.ledgerTransaction.create({data:{householdId:id,accountId:d.accountId,categoryId:d.categoryId,kind:d.kind,amountCents:BigInt(d.amountCents),occurredAt:new Date(d.occurredAt),description:d.description,createdById:user.id,paidByUserId:d.paidByUserId,splits:d.splits?{create:d.splits.map(s=>({householdId:id,userId:s.userId,amountCents:BigInt(s.amountCents)}))}:undefined}});
 });return Response.json({id:tx.id},{status:201});
 }catch(e){return requestError(e);}
}
