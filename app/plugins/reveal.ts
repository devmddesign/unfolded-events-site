import type { Directive } from "vue";

/**
 * v-reveal — fades/slides an element into view once, when it enters the viewport.
 *
 * - Registered universally so SSR resolves the directive (no warning), but all
 *   logic runs only on the client.
 * - prefers-reduced-motion or no IntersectionObserver → element is shown
 *   immediately with no transform (the CSS media query also enforces this).
 * - Optional binding value sets a stagger delay in ms: v-reveal="120".
 */
const reveal: Directive<HTMLElement, number | undefined> = {
  mounted(el, binding) {
    if (import.meta.server) return;

    if (typeof binding.value === "number" && binding.value > 0) {
      el.style.setProperty("--reveal-delay", `${binding.value}ms`);
    }

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced || typeof IntersectionObserver === "undefined") {
      el.classList.add("is-visible");
      return;
    }

    const io = new IntersectionObserver(
      (entries, obs) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            obs.unobserve(entry.target);
          }
        }
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.08 },
    );
    io.observe(el);
    (el as HTMLElement & { _revealIO?: IntersectionObserver })._revealIO = io;
  },
  unmounted(el) {
    const io = (el as HTMLElement & { _revealIO?: IntersectionObserver })._revealIO;
    io?.disconnect();
  },
};

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.directive("reveal", reveal);
});
