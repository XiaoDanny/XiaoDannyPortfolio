import { NextResponse } from "next/server";
import { registerView } from "@/app/lib/views";

// POST only: GET/HEAD from crawlers and monitors get a 405 and never reach the counter.
export async function POST(request: Request) {
  try {
    return NextResponse.json(await registerView(request.headers), { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    console.error("[views] Failed to register view", error);
    return NextResponse.json({ views: null, counted: false }, { status: 503, headers: { "Cache-Control": "no-store" } });
  }
}
