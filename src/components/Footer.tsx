export function Footer() {
  return (
    <footer className="border-t border-border px-6 py-8">
      <div className="mx-auto flex max-w-3xl flex-col gap-2 text-xs text-muted sm:flex-row sm:items-center sm:justify-between">
        <p>© {new Date().getFullYear()} UNBLCK</p>
        <p>AI & blockchain accelerator · Santiago, Chile</p>
      </div>
    </footer>
  );
}
