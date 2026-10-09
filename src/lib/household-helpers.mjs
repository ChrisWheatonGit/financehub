import { createHash, randomBytes } from "node:crypto";
export const normalizeEmail = (email) => email.trim().toLowerCase();
export const generateInvitationToken = () => randomBytes(32).toString("base64url");
export const hashToken = (token) => createHash("sha256").update(token).digest("hex");
export function validateAllocations(total, shares) {
 if (!Number.isSafeInteger(total) || total <= 0 || !Array.isArray(shares) || shares.length === 0) return false;
 if (shares.some(s => !Number.isSafeInteger(s.amountCents) || s.amountCents < 0)) return false;
 if (new Set(shares.map(s => s.userId)).size !== shares.length) return false;
 return shares.reduce((n,s)=>n+s.amountCents,0) === total;
}
