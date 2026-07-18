import "server-only";
import { createHash, randomBytes } from "crypto";
import { cookies, headers } from "next/headers";
import { connectToDatabase } from "./mongodb";
import { Session } from "@/models/Session";
import { User } from "@/models/User";

export const SESSION_COOKIE = "msg2012_session";
const SESSION_DAYS = 14;
export const hashToken = (token: string) => createHash("sha256").update(token).digest("hex");
export const createOpaqueToken = () => randomBytes(32).toString("base64url");

export async function createSession(userId: string) {
  await connectToDatabase();
  const token = createOpaqueToken();
  const expiresAt = new Date(Date.now() + SESSION_DAYS * 86400000);
  const requestHeaders = await headers();
  await Session.create({ tokenHash: hashToken(token), userId, expiresAt, userAgent: requestHeaders.get("user-agent")?.slice(0, 300), ipAddress: requestHeaders.get("x-forwarded-for")?.split(",")[0]?.trim() });
  (await cookies()).set(SESSION_COOKIE, token, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", expires: expiresAt });
}

export async function deleteSession() {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (token) { await connectToDatabase(); await Session.deleteOne({ tokenHash: hashToken(token) }); }
  store.delete(SESSION_COOKIE);
}

export async function getCurrentUser() {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!token) return null;
  await connectToDatabase();
  const session = await Session.findOne({ tokenHash: hashToken(token), expiresAt: { $gt: new Date() } }).lean() as { userId: unknown } | null;
  if (!session) return null;
  const user = await User.findById(session.userId).lean() as { _id: unknown; name: string; email: string; roles: string[]; status: string; emailVerifiedAt?: Date } | null;
  if (!user || user.status === "suspended") return null;
  return { id: String(user._id), name: user.name, email: user.email, roles: user.roles as string[], status: user.status as string, emailVerified: Boolean(user.emailVerifiedAt) };
}

export function hasAdminRole(user: { roles: string[] } | null) { return Boolean(user?.roles.some(role => ["admin", "super_admin"].includes(role))); }
export function hasContentRole(user: { roles: string[] } | null) { return Boolean(user?.roles.some(role => ["editor", "admin", "super_admin"].includes(role))); }

export async function assertSameOrigin(request: Request) {
  const origin = request.headers.get("origin");
  const host = request.headers.get("host");
  if (origin && host && new URL(origin).host !== host) throw new Error("Invalid request origin.");
}
