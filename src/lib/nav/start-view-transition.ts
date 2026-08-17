export function startViewTransition(update: () => void): void {
  if (typeof document !== "undefined" && "startViewTransition" in document) {
    document.startViewTransition(update);
    return;
  }
  update();
}
