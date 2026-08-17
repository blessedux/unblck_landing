"use client";

import type { ReactNode } from "react";
import { PrivyProvider } from "@privy-io/react-auth";
import { getPrivyAppId } from "@/lib/auth/privy-public";

export function PrivyAppProvider({ children }: { children: ReactNode }) {
  const appId = getPrivyAppId();
  if (!appId) return <>{children}</>;

  return (
    <PrivyProvider
      appId={appId}
      config={{
        loginMethods: ["google"],
        appearance: {
          theme: "light",
          accentColor: "#111111",
          landingHeader: "UNBLCK",
        },
        embeddedWallets: {
          ethereum: { createOnLogin: "off" },
        },
      }}
    >
      {children}
    </PrivyProvider>
  );
}
