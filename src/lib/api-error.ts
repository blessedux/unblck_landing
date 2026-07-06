import { NextResponse } from "next/server";

export function configurationErrorResponse(
  error: unknown,
  fallback = "Server configuration error",
) {
  const message =
    error instanceof Error ? error.message : fallback;

  console.error(message, error);

  return NextResponse.json(
    {
      error:
        process.env.NODE_ENV === "development" ? message : fallback,
    },
    { status: 500 },
  );
}
