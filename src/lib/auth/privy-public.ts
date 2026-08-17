export function getPrivyAppId(): string {
  return process.env.NEXT_PUBLIC_PRIVY_APP_ID?.trim() ?? "";
}

export function isPrivyConfigured(): boolean {
  return Boolean(getPrivyAppId());
}
