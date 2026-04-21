import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const body = (await request.json()) as {
    email?: string;
    message?: string;
    name?: string;
    subject?: string;
  };

  const name = String(body.name ?? "").trim();
  const email = String(body.email ?? "").trim().toLowerCase();
  const subject = String(body.subject ?? "").trim();
  const message = String(body.message ?? "").trim();

  if (!name || !email.includes("@") || !subject || message.length < 10) {
    return NextResponse.json({ error: "Complete every field before sending." }, { status: 400 });
  }

  await prisma.contactMessage.create({
    data: {
      name,
      email,
      subject,
      message
    }
  });

  return NextResponse.json({ ok: true });
}
