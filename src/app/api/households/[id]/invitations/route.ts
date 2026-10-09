import { db } from "@/lib/db";
import { authenticatedUser, requireMember, requestError } from "@/lib/household-access";
import { normalizeEmail, generateInvitationToken, hashToken } from "@/lib/household-helpers.mjs";
import { z } from "zod";
export async function POST(request:Request,context:{params:Promise<{id:string}>}) {
 try {
  const user=await authenticatedUser();const {id}=await context.params;await requireMember(id,user.id);
  const {email}=z.object({email:z.email().max(254)}).parse(await request.json());
  const normalized=normalizeEmail(email);
  if(normalized===normalizeEmail(user.email)) return Response.json({error:"Cannot invite yourself"},{status:400});
  // This is local-development invitation preview only. No email delivery exists yet.
  const token=generateInvitationToken();
  await db.householdInvitation.create({data:{householdId:id,email:normalized,tokenHash:hashToken(token),invitedById:user.id,expiresAt:new Date(Date.now()+24*60*60*1000)}});
  return Response.json({invitationToken:token, expiresInHours:24},{status:201,headers:{"Cache-Control":"no-store"}});
 } catch(e){return requestError(e);}
}
