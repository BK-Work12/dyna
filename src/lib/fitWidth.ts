/**
 * The Figma design is a 1440px-wide canvas. Below 1440px viewport width, scale the element down
 * uniformly (CSS zoom) so the whole composition stays visible instead of being cut off at the right.
 * At >= 1440px nothing changes.
 */
export function fitWidth(el: HTMLElement, designWidth = 1440): () => void {
  const apply = () => {
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
