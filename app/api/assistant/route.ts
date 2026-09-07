import { NextResponse } from "next/server";
import { answerFromDishaContext } from "@/lib/assistant";
import type { DishaContext } from "@/lib/dishaContext";

export async function POST(request: Request) {
  const body = (await request.json()) as { message?: string; context?: DishaContext };

  if (!body.message || !body.context) {
    return NextResponse.json({ error: "Message and DishaContext are required." }, { status: 400 });
  }

  return NextResponse.json(answerFromDishaContext(body.message, body.context));
}
