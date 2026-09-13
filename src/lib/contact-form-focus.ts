/** Reset and focus the contact form after navigation or a section scroll. */
export function focusContactForm(preselectNeed?: string, delay = 0) {
  if (typeof window === "undefined") return;
  window.setTimeout(() => {
    window.dispatchEvent(new CustomEvent("tretnix:openContact", { detail: { preselectNeed } }));
    window.requestAnimationFrame(() => {
      document.getElementById("contact-step-1-heading")?.focus({ preventScroll: true });
    });
  }, delay);
}
