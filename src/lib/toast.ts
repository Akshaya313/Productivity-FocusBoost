/**
 * Lightweight in-app toast helper.
 * Dispatches a custom DOM event that ThemeProvider picks up and renders.
 */
export function showToast(
  title: string,
  description: string,
  type: "success" | "info" | "warning" | "error" = "success"
) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(
    new CustomEvent("app-toast", { detail: { title, description, type } })
  );
}
