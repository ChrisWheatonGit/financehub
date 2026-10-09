import { db } from "@/lib/db";
import { authenticatedUser, requestError } from "@/lib/household-access";
import { hashToken, normalizeEmail } from "@/lib/household-helpers.mjs";
import { z } from "zod";
export async function POST(request:Request) {
 try { const user=await authenticatedUser();
  const {token}=z.object({token:z.string().min(30).max(128)}).parse(await request.json());
  const result=await db.$transaction(async(tx)=>{
    const invitation=await tx.householdInvitation.findUnique({where:{tokenHash:hashToken(token)}});
    if(!invitation || invitation.state!=="PENDING" || invitation.expiresAt<=new Date() || normalizeEmail(user.email)!==invitation.email) throw new Error("NOT_FOUND");
    // Atomic conditional update prevents two uses of the same invitation.
    const updated=await tx.householdInvitation.updateMany({where:{id:invitation.id,state:"PENDING",expiresAt:{gt:new Date()}},data:{state:"ACCEPTED",acceptedAt:new Date()}});
    if(updated.count!==1) throw new Error("NOT_FOUND");
    await tx.householdMember.create({data:{householdId:invitation.householdId,userId:user.id,role:invitation.role}});
    return invitation.householdId;
  });
  return Response.json({householdId:result});
 } catch(e){return requestError(e);}
}
