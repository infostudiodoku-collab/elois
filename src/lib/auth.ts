import crypto from "crypto";
import { cookies } from "next/headers";

const SECRET = process.env.ADMIN_SECRET || "change-me-please-this-is-not-secret";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123";
const COOKIE_NAME = "icw_admin";
const SESSION_LIFETIME_MS = 1000 * 60 * 60 * 24 * 7; // 7 days

function sign(payload: string) {
  return crypto.createHmac("sha256", SECRET).update(payload).digest("hex");
}

export function verifyPassword(input: string) {
  return input === ADMIN_PASSWORD;
}

export function makeSessionToken() {
  const exp = Date.now() + SESSION_LIFETIME_MS;
  const payload = `admin:${exp}`;
  const sig = sign(payload);
  return `${payload}:${sig}`;
}

export function isValidSession(token?: string | null) {
  if (!token) return false;
  const parts = token.split(":");
  if (parts.length !== 3) return false;
  const [user, expStr, sig] = parts;
  const payload = `${user}:${expStr}`;
  if (sign(payload) !== sig) return false;
  if (user !== "admin") return false;
  if (Number(expStr) < Date.now()) return false;
  return true;
}

export function isAuthenticated() {
  const c = cookies();
  const token = c.get(COOKIE_NAME)?.value;
  return isValidSession(token);
}

export const COOKIE = COOKIE_NAME;
