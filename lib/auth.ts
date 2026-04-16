import { createHash, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const COOKIE_NAME = "zenmora-admin-session";

function digest(value: string) {
  return createHash("sha256").update(value).digest("hex");
}

export async function createSession() {
  const password = process.env.ADMIN_PASSWORD;
  const secret = process.env.SESSION_SECRET;

  if (!password || !secret) {
    throw new Error("ADMIN_PASSWORD and SESSION_SECRET must be set.");
  }

  const token = digest(`${password}:${secret}`);
  const store = await cookies();
  store.set(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7
  });
}

export async function clearSession() {
  const store = await cookies();
  store.delete(COOKIE_NAME);
}

export async function isAuthenticated() {
  const password = process.env.ADMIN_PASSWORD;
  const secret = process.env.SESSION_SECRET;
  const store = await cookies();
  const token = store.get(COOKIE_NAME)?.value;

  if (!password || !secret || !token) {
    return false;
  }

  const expected = Buffer.from(digest(`${password}:${secret}`));
  const current = Buffer.from(token);

  if (expected.length !== current.length) {
    return false;
  }

  return timingSafeEqual(expected, current);
}

export async function requireAdmin() {
  if (!(await isAuthenticated())) {
    redirect("/admin/login");
  }
}
