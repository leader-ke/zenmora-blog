"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

function getString(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

export async function contactAction(formData: FormData) {
  const name = getString(formData, "name");
  const email = getString(formData, "email").toLowerCase();
  const subject = getString(formData, "subject");
  const message = getString(formData, "message");

  if (!name || !email.includes("@") || !subject || message.length < 10) {
    redirect("/contact?sent=invalid");
  }

  await prisma.contactMessage.create({
    data: {
      name,
      email,
      subject,
      message
    }
  });

  revalidatePath("/admin");
  revalidatePath("/admin/messages");
  redirect("/contact?sent=1");
}

export async function markContactMessageReviewedAction(formData: FormData) {
  await requireAdmin();
  const id = getString(formData, "id");

  await prisma.contactMessage.update({
    where: { id },
    data: { status: "REVIEWED" }
  });

  revalidatePath("/admin");
  revalidatePath("/admin/messages");
  redirect("/admin/messages?reviewed=1");
}
