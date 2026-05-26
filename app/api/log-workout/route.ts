import { NextResponse } from "next/server";
import { insertWorkout } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    await insertWorkout(body);
    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}
