"use client";

type AuthPreloaderProps = {
  label: string;
  /**
   * `panel` — sits inside the login shell.
   * `fullscreen` — post-Gmail handoff; avoids flashing the login layout.
   */
  variant?: "panel" | "fullscreen";
};

/** Centered loading state for auth / Gmail handoff. */
export function AuthPreloader({
  label,
  variant = "panel",
}: AuthPreloaderProps) {
  const spinner =
    variant === "fullscreen" ? (
      <div
        className="h-9 w-9 animate-spin rounded-full border-2 border-white/20 border-t-white"
        aria-hidden
      />
    ) : (
      <div
        className="h-9 w-9 animate-spin rounded-full border-2 border-gray-200 border-t-gray-900"
        aria-hidden
      />
    );

  const body = (
    <div
      className="flex flex-col items-center justify-center gap-5"
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      {spinner}
      <p
        className={
          variant === "fullscreen" ? "text-sm text-white/55" : "text-sm text-gray-500"
        }
      >
        {label}
      </p>
    </div>
  );

  if (variant === "fullscreen") {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black">
        {body}
      </div>
    );
  }

  return <div className="flex min-h-[14rem] items-center justify-center">{body}</div>;
}
