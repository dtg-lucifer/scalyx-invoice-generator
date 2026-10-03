import crypto from "crypto";

const SECRET = process.env.AUTH_SECRET || "scalyx_invoice_secret_token_2026_key";

export function createSessionToken(email: string): string {
  const timestamp = Date.now();
  const payload = Buffer.from(JSON.stringify({ email, timestamp })).toString("base64url");
  const signature = crypto.createHmac("sha256", SECRET).update(payload).digest("base64url");
  return `${payload}.${signature}`;
}

export function verifySessionToken(token: string | undefined): { valid: boolean; email?: string } {
  if (!token) return { valid: false };
  const parts = token.split(".");
  if (parts.length !== 2) return { valid: false };
  const [payload, signature] = parts;

  const expectedSig = crypto.createHmac("sha256", SECRET).update(payload).digest("base64url");
  if (signature !== expectedSig) return { valid: false };

  try {
    const data = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
    // 7 days expiration
    if (Date.now() - data.timestamp > 7 * 86400000) {
      return { valid: false };
    }
    return { valid: true, email: data.email };
  } catch {
    return { valid: false };
  }
}
