import { ReactNode } from "react";
import { HubMemberLayout } from "@/components/HubMemberLayout";

export default function HubLayout({ children }: { children: ReactNode }) {
  return <HubMemberLayout>{children}</HubMemberLayout>;
}
