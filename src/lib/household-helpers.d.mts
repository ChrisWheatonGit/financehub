export function normalizeEmail(email: string): string;
export function generateInvitationToken(): string;
export function hashToken(token: string): string;
export function validateAllocations(total: number, shares: {userId: string;amountCents: number}[]): boolean;
