/**
 * The Figma design is a 1440px-wide canvas. Below 1440px viewport width, scale the element down
 * uniformly (CSS zoom) so the whole composition stays visible instead of being cut off at the right.
 * At >= 1440px nothing changes.
 */
/** At or below this viewport width pages switch from the scaled 1440 canvas to real responsive (mobile) layouts. */
export const MOBILE_MAX = 900;

export function fitWidth(el: HTMLElement, designWidth = 1440): () => void {
  const apply = () => {
    if (document.documentElement.clientWidth <= MOBILE_MAX) {
      // mobile: no scaled canvas — CSS media queries (max-width: 900px) own the layout
      el.style.width = "";
      el.style.maxWidth = "";
      el.style.left = "";
      el.style.right = "";
      (el.style as CSSStyleDeclaration & { zoom: string }).zoom = "";
      return;
    }
    const k = Math.min(1, document.documentElement.clientWidth / designWidth);
    el.style.width = `${designWidth}px`;
    el.style.maxWidth = "none";
    (el.style as CSSStyleDeclaration & { zoom: string }).zoom = k < 1 ? String(k) : "";
    // absolutely-positioned bars (navbar) must sit over the centred 1440 canvas on wide screens
    if (getComputedStyle(el).position === "absolute") {
      el.style.right = "auto";
      el.style.left = k < 1 ? "0" : `${Math.max(0, (document.documentElement.clientWidth - designWidth) / 2)}px`;
    }
  };
  apply();
  window.addEventListener("resize", apply);
  return () => window.removeEventListener("resize", apply);
}
