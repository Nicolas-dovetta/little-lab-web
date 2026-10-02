import { NextRequest, NextResponse } from "next/server";
import { castVote, loadCurrentPoll } from "@/lib/vote-store";
import { hitRateLimit, isVoteToken, VOTE_COOKIE } from "@/lib/vote";

const hitsByIp = new Map<string, number[]>();

function clientIp(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) return first;
  }
  return request.headers.get("x-real-ip") ?? "unknown";
}

function allowRequest(ip: string): boolean {
  const result = hitRateLimit(hitsByIp.get(ip) ?? [], Date.now());
  hitsByIp.set(ip, result.hits);
  return result.allowed;
}

function tokenFrom(request: NextRequest): string | null {
  const raw = request.cookies.get(VOTE_COOKIE)?.value;
  return isVoteToken(raw) ? raw : null;
}

function withCookie(response: NextResponse, token: string): NextResponse {
  response.cookies.set({
    name: VOTE_COOKIE,
    value: token,
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 120,
  });
  response.headers.set("Cache-Control", "no-store");
  return response;
}

export async function GET(request: NextRequest) {
  const poll = await loadCurrentPoll(tokenFrom(request));
  if (!poll) {
    return NextResponse.json(
      { error: "The ballot isn't available right now." },
      { status: 503, headers: { "Cache-Control": "no-store" } },
    );
  }
  return NextResponse.json({ poll }, { headers: { "Cache-Control": "no-store" } });
}

export async function POST(request: NextRequest) {
  if (!allowRequest(clientIp(request))) {
    return NextResponse.json(
      { error: "Slow down a second and try again." },
      { status: 429, headers: { "Cache-Control": "no-store" } },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "That isn't one of this week's options." },
      { status: 400, headers: { "Cache-Control": "no-store" } },
    );
  }

  const optionId =
    body && typeof body === "object" && "optionId" in body && typeof body.optionId === "string"
      ? body.optionId.trim()
      : "";

  const token = tokenFrom(request) ?? crypto.randomUUID();
  const result = await castVote(optionId, token);
  const response = NextResponse.json(
    result.ok
      ? { ok: true, alreadyVoted: result.alreadyVoted, poll: result.poll }
      : { error: result.error, poll: result.poll },
    { status: result.ok ? 200 : result.status },
  );
  return withCookie(response, token);
}
