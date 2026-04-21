import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { buildUnsubscribeUrl, sendEmail } from "@/lib/email";

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

export async function POST(request: Request) {
  const body = (await request.json()) as { email?: string };
  const email = String(body.email ?? "").trim().toLowerCase();

  if (!email || !email.includes("@")) {
    return NextResponse.json({ error: "Invalid email" }, { status: 400 });
  }

  const existing = await prisma.subscriber.findUnique({
    where: { email }
  });

  const subscriber = await prisma.subscriber.upsert({
    where: { email },
    update: {
      status: "SUBSCRIBED",
      subscribedAt: new Date(),
      unsubscribedAt: null
    },
    create: { email }
  });

  await sendSubscriptionEmail(subscriber.email, subscriber.unsubscribeToken);

  return NextResponse.json({
    ok: true,
    status: existing?.status === "SUBSCRIBED" ? "exists" : "subscribed"
  });
}
