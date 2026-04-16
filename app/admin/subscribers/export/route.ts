import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  if (!(await isAuthenticated())) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const subscribers = await prisma.subscriber.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      email: true,
      createdAt: true
    }
  });

  const csv = [
    "email,createdAt",
    ...subscribers.map((subscriber) => `${subscriber.email},${subscriber.createdAt.toISOString()}`)
  ].join("\n");

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="zenmora-subscribers.csv"'
    }
  });
}
