import { db } from "@/lib/db";
import { authenticatedUser, requireMember, requestError } from "@/lib/household-access";
export async function GET(_request:Request,context:{params:Promise<{id:string}>}) {
 try { const user=await authenticatedUser(); const {id}=await context.params; await requireMember(id,user.id);
  const members=await db.householdMember.findMany({where:{householdId:id},select:{role:true,joinedAt:true,user:{select:{id:true,name:true,email:true}}}});
  return Response.json({members});
 } catch(e){return requestError(e);}
}
