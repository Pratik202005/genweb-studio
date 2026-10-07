/**
 * motionTokens.js
 * Centralized motion tokens for GenWeb Studio (Linear / Vercel / Stripe design standard)
 */

export const MOTION = {
  // Durations (in seconds for framer-motion)
  duration: {
    fast: 0.15, // 150ms
    base: 0.3,  // 300ms
    slow: 0.7,  // 700ms
    hero: 0.8,
  },

  // Easing curves
  ease: {
    // Custom cubic-bezier(0.22, 1, 0.36, 1) - snappy yet silky deceleration
    easeOut: [0.22, 1, 0.36, 1],
    easeInOut: [0.4, 0, 0.2, 1],
    // Spring configs
    spring: {
      type: "spring",
      stiffness: 260,
      damping: 24,
      mass: 1,
    },
    springGentle: {
      type: "spring",
      stiffness: 180,
      damping: 22,
      mass: 0.8,
    },
    springSnappy: {
      type: "spring",
      stiffness: 340,
      damping: 22,
      mass: 0.6,
    },
  },

  // Staggers
  stagger: {
    fast: 0.04,
    base: 0.08, // 80ms standard
    slow: 0.12,
  },

  // Distance units (in px)
  distance: {
    sm: 8,
    md: 24,
    lg: 40,
  },
};

// Reusable framer-motion animation variants (only animating transform and opacity)
export const createFadeUpVariants = (prefersReduced = false, distance = MOTION.distance.md) => ({
  hidden: {
    opacity: 0,
    y: prefersReduced ? 0 : distance,
  },
  visible: (custom = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: MOTION.duration.slow,
      ease: MOTION.ease.easeOut,
      delay: custom * MOTION.stagger.base,
    },
  }),
});

export const createScrollRevealVariants = (prefersReduced = false) => ({
  hidden: {
    opacity: 0,
    y: prefersReduced ? 0 : MOTION.distance.md,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: MOTION.duration.slow,
      ease: MOTION.ease.easeOut,
    },
  },
});

export default MOTION;
