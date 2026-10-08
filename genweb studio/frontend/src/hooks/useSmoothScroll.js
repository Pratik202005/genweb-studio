import { useEffect } from "react";

/**
 * useSmoothScroll
 * Provides momentum-damped, 60/120fps hardware-accelerated smooth scrolling.
 * Specifically smooths out mechanical mouse wheel jumps on Windows/Linux,
 * while preserving native touch gestures, keyboard accessibility, and form controls.
 */
export const useSmoothScroll = (enabled = true) => {
  useEffect(() => {
    if (!enabled) return;

    // Check prefers-reduced-motion
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    // Touch devices already have native momentum physics
    const isTouchDevice = "ontouchstart" in window || navigator.maxTouchPoints > 0;
    if (isTouchDevice && window.innerWidth < 768) {
      return;
    }

    let targetY = window.scrollY;
    let currentY = window.scrollY;
    let isRunning = false;
    let animId = null;

    const ease = 0.1; // Smooth damping coefficient (luxurious gliding feel)
    const threshold = 0.5; // Snap threshold in px

    const getMaxScroll = () => {
      const docHeight = Math.max(
        document.body.scrollHeight,
        document.documentElement.scrollHeight,
        document.body.offsetHeight,
        document.documentElement.offsetHeight
      );
      return Math.max(0, docHeight - window.innerHeight);
    };

    const updateScroll = () => {
      if (!isRunning) return;

      const diff = targetY - currentY;
      if (Math.abs(diff) < threshold) {
        currentY = targetY;
        window.scrollTo(0, Math.round(currentY));
        isRunning = false;
        animId = null;
        return;
      }

      currentY += diff * ease;
      window.scrollTo(0, Math.round(currentY));
      animId = requestAnimationFrame(updateScroll);
    };

    const handleWheel = (e) => {
      // Do not intercept if inside a scrollable child (e.g. textarea, select, modal, or element with overflow)
      const target = e.target;
      if (
        target.closest("textarea, input, select, [data-scrollable], .monaco-editor, [role='dialog']")
      ) {
        return;
      }

      // Check if event target has a scrollable ancestor that is actually scrolling
      let el = target;
      while (el && el !== document.body && el !== document.documentElement) {
        const style = window.getComputedStyle(el);
        const overflowY = style.overflowY;
        if (
          (overflowY === "auto" || overflowY === "scroll") &&
          el.scrollHeight > el.clientHeight
        ) {
          // If the child element can still scroll in this direction, let it scroll natively
          if (
            (e.deltaY > 0 && el.scrollTop + el.clientHeight < el.scrollHeight - 1) ||
            (e.deltaY < 0 && el.scrollTop > 1)
          ) {
            return;
          }
        }
        el = el.parentElement;
      }

      // Normalize delta based on deltaMode (0 = pixels, 1 = lines, 2 = pages)
      let delta = e.deltaY;
      if (e.deltaMode === 1) {
        delta *= 36;
      } else if (e.deltaMode === 2) {
        delta *= window.innerHeight;
      }

      // Sync target with current position if animation was idle or displaced
      if (!isRunning) {
        currentY = window.scrollY;
        targetY = window.scrollY;
      }

      const maxScroll = getMaxScroll();
      targetY = Math.max(0, Math.min(maxScroll, targetY + delta));

      if (!isRunning) {
        isRunning = true;
        animId = requestAnimationFrame(updateScroll);
      }

      // Prevent native discrete stepped jump
      e.preventDefault();
    };

    // Keep state synchronized on manual scroll (e.g. dragging scrollbar, keyboard arrows, touch)
    const handleNativeScroll = () => {
      if (!isRunning) {
        targetY = window.scrollY;
        currentY = window.scrollY;
      }
    };

    const handleTouchStart = () => {
      if (isRunning) {
        isRunning = false;
        if (animId) cancelAnimationFrame(animId);
        targetY = window.scrollY;
        currentY = window.scrollY;
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("scroll", handleNativeScroll, { passive: true });
    window.addEventListener("touchstart", handleTouchStart, { passive: true });

    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("scroll", handleNativeScroll);
      window.removeEventListener("touchstart", handleTouchStart);
      if (animId) cancelAnimationFrame(animId);
    };
  }, [enabled]);
};

export default useSmoothScroll;
