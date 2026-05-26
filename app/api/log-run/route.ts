import { NextResponse } from "next/server";
import { insertRun } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    await insertRun(body);
    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}
