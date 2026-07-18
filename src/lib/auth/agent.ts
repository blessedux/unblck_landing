import { NextResponse } from "next/server";

export function requireAgentAuth(request: Request): string | NextResponse {
  const authHeader = request.headers.get("Authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return NextResponse.json(
      { error: "Missing or invalid Authorization header" },
      { status: 401 }
    );
  }

  const token = authHeader.substring(7);
  const expectedKey = process.env.AGENT_API_KEY;

  if (!expectedKey) {
    console.error("AGENT_API_KEY not configured");
    return NextResponse.json(
      { error: "Server configuration error" },
      { status: 500 }
    );
  }

  const isValid = constantTimeCompare(token, expectedKey);

  if (!isValid) {
    return NextResponse.json({ error: "Invalid API key" }, { status: 401 });
  }

  return token;
}

function constantTimeCompare(a: string, b: string): boolean {
  if (a.length !== b.length) {
    return false;
  }

  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }

  return result === 0;
}
