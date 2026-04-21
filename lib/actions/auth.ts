"use server";

import { redirect } from "next/navigation";
import { clearSession, createSession } from "@/lib/auth";

function getString(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

export async function loginAction(formData: FormData) {
  const password = getString(formData, "password");

  if (!process.env.ADMIN_PASSWORD) {
    throw new Error("Missing ADMIN_PASSWORD");
  }

  if (password !== process.env.ADMIN_PASSWORD) {
    redirect("/admin/login?error=invalid-password");
  }

  await createSession();
  redirect("/admin");
}

export async function logoutAction() {
  await clearSession();
  redirect("/admin/login");
}
