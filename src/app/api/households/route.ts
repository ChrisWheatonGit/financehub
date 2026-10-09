import { db } from "@/lib/db";
import { authenticatedUser, requestError } from "@/lib/household-access";
import { z } from "zod";
export async function GET() {
 try { const user = await authenticatedUser();
  const memberships = await db.householdMember.findMany({ where: { userId: user.id }, include: { household: true } });
  return Response.json({ households: memberships.map(m=>({id:m.householdId,name:m.household.name,role:m.role})) });
 } catch(e) { return requestError(e); }
}
export async function POST(request: Request) {
 try { const user=await authenticatedUser();
  const data=z.object({name:z.string().trim().min(2).max(80)}).parse(await request.json());
  const household=await db.household.create({data:{name:data.name,memberships:{create:{userId:user.id,role:"OWNER"}}}});
  return Response.json({id:household.id,name:household.name},{status:201});
 } catch(e) {return requestError(e);}
}
