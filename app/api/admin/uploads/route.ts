import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { saveUploadedFile } from "@/lib/uploads";

export async function POST(request: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("file");
  const directory = String(formData.get("directory") ?? "editor");

  if (!(file instanceof File) || file.size === 0) {
    return NextResponse.json({ error: "Missing file" }, { status: 400 });
  }

  const uploaded = await saveUploadedFile(file, directory);

  if (!uploaded) {
    return NextResponse.json({ error: "Upload failed" }, { status: 400 });
  }

  return NextResponse.json(uploaded);
}
