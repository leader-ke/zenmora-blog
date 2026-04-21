"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { buildUnsubscribeUrl, sendEmail } from "@/lib/email";

const SUBSCRIBER_STATUS = {
  SUBSCRIBED: "SUBSCRIBED",
  UNSUBSCRIBED: "UNSUBSCRIBED"
} as const;

function getString(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

async function sendSubscriptionEmail(email: string, unsubscribeToken: string) {
  const unsubscribeUrl = buildUnsubscribeUrl(email, unsubscribeToken);

  try {
    await sendEmail({
      to: email,
      subject: "You are subscribed to Zenmora Co.",
      text: `Thanks for subscribing to Zenmora Co. You will receive new editorial updates here. Unsubscribe anytime: ${unsubscribeUrl}`,
      html: `<p>Thanks for subscribing to <strong>Zenmora Co.</strong>.</p><p>You will receive new editorial updates here.</p><p><a href="${unsubscribeUrl}">Unsubscribe</a> anytime.</p>`
    });
  } catch (error) {
    console.error("Subscription email failed", error);
  }
}

export async function subscribeAction(formData: FormData) {
  const email = getString(formData, "email").toLowerCase();

  if (!email || !email.includes("@")) {
    redirect("/?subscribed=invalid");
  }

  const existing = await prisma.subscriber.findUnique({
    where: { email }
  });

  const subscriber = await prisma.subscriber.upsert({
    where: { email },
    update: {
      status: SUBSCRIBER_STATUS.SUBSCRIBED,
      subscribedAt: new Date(),
      unsubscribedAt: null
    },
    create: { email }
  });

  await sendSubscriptionEmail(subscriber.email, subscriber.unsubscribeToken);
  revalidatePath("/admin");
  revalidatePath("/admin/subscribers");
  redirect(existing?.status === SUBSCRIBER_STATUS.SUBSCRIBED ? "/?subscribed=exists" : "/?subscribed=1");
}

export async function unsubscribeAction(formData: FormData) {
  const email = getString(formData, "email").toLowerCase();
  const token = getString(formData, "token");

  const subscriber = await prisma.subscriber.findUnique({
    where: { email }
  });

  if (!subscriber || subscriber.unsubscribeToken !== token) {
    redirect("/unsubscribe?status=invalid");
  }

  await prisma.subscriber.update({
    where: { email },
    data: {
      status: SUBSCRIBER_STATUS.UNSUBSCRIBED,
      unsubscribedAt: new Date()
    }
  });

  revalidatePath("/admin");
  revalidatePath("/admin/subscribers");
  redirect("/unsubscribe?status=success");
}
