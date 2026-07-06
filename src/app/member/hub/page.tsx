import { HubMenuLinks } from "@/components/HubMenuLinks";
import { HubHomeAside } from "@/components/HubHomeAside";

export default function HubHomePage() {
  return (
    <div className="grid min-h-[calc(100vh-8rem)] md:grid-cols-2">
      <div className="md:border-r md:border-black/10">
        <div className="md:hidden">
          <HubMenuLinks variant="stack" />
        </div>
        <div className="hidden md:block">
          <HubMenuLinks variant="sidebar" />
        </div>
      </div>

      <HubHomeAside />
    </div>
  );
}
