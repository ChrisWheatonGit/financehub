import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function authenticatedUser() {
 const session = await auth.api.getSession({ headers: await headers() });
 if (!session?.user) throw new Error("UNAUTHENTICATED");
 return session.user;
}
export async function requireMember(householdId: string, userId: string) {
 const member = await db.householdMember.findUnique({ where: { householdId_userId: { householdId, userId } } });
 if (!member) throw new Error("NOT_FOUND"); // intentionally conceal existence
 return member;
}
export function requestError(e: unknown) {
 const status = e instanceof Error && e.message === "UNAUTHENTICATED" ? 401 : e instanceof Error && e.message === "NOT_FOUND" ? 404 : 400;
 return Response.json({ error: status===401?"Authentication required":status===404?"Not found":"Request rejected" }, { status });
}
