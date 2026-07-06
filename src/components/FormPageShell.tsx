import type { ReactNode } from "react";

/** Full-viewport shell so apply forms sit above any fixed homepage layers on mobile. */
export function FormPageShell({ children }: { children: ReactNode }) {
  return (
    <div className="fixed inset-0 z-[100] overflow-y-auto overscroll-y-contain bg-black text-white touch-manipulation">
      {children}
    </div>
  );
}
