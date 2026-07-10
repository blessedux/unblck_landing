const BUTTONDOWN_API_BASE = "https://api.buttondown.com/v1";

function getApiKey(): string | undefined {
  return process.env.BUTTONDOWN_API_KEY;
}

type ButtondownResult = { ok: boolean; error?: string };

type SubscriberCountResult = { count: number; error?: string };

type SubscribeOptions = {
  metadata?: Record<string, string>;
  /** End-user IP — required so Buttondown doesn't treat Vercel as a bot farm. */
  ipAddress?: string;
};

export async function subscribeEmail(
  email: string,
  options?: SubscribeOptions,
): Promise<ButtondownResult> {
  const apiKey = getApiKey();
  if (!apiKey) {
    const message = "BUTTONDOWN_API_KEY is not configured";
    console.error(message);
    return { ok: false, error: message };
  }

  const { metadata, ipAddress } = options ?? {};

  try {
    const response = await fetch(`${BUTTONDOWN_API_BASE}/subscribers`, {
      method: "POST",
      headers: {
        Authorization: `Token ${apiKey}`,
        "Content-Type": "application/json",
        "X-Buttondown-Collision-Behavior": "overwrite",
      },
      body: JSON.stringify({
        email_address: email,
        type: "regular",
        ...(ipAddress ? { ip_address: ipAddress } : {}),
        ...(metadata ? { metadata } : {}),
      }),
    });

    if (!response.ok) {
      const body = await response.text();
      const message = `Buttondown subscribe failed (${response.status}): ${body}`;
      console.error(message);
      return { ok: false, error: message };
    }

    return { ok: true };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown Buttondown error";
    console.error("Buttondown subscribe error:", error);
    return { ok: false, error: message };
  }
}

export async function getSubscriberCount(): Promise<SubscriberCountResult> {
  const apiKey = getApiKey();
  if (!apiKey) {
    const message = "BUTTONDOWN_API_KEY is not configured";
    console.error(message);
    return { count: 0, error: message };
  }

  try {
    const response = await fetch(
      `${BUTTONDOWN_API_BASE}/subscribers?type=regular`,
      {
        headers: {
          Authorization: `Token ${apiKey}`,
        },
      },
    );

    if (!response.ok) {
      const body = await response.text();
      const message = `Buttondown subscriber count failed (${response.status}): ${body}`;
      console.error(message);
      return { count: 0, error: message };
    }

    const data = (await response.json()) as { count?: number };
    return { count: data.count ?? 0 };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown Buttondown error";
    console.error("Buttondown subscriber count error:", error);
    return { count: 0, error: message };
  }
}
