import React, { useEffect, useRef, useState, useCallback } from "react";

// ============================================================================
// CONFIGURATION CONSTANTS (All colors, counts, speeds & opacities tunable here)
// ============================================================================
export const BG_CONFIG = {
  // Base canvas background
  baseColor: "#07070A",

  // 4 Vivid Aurora Blobs (35-45% opacity, 600-800px, blur 90px)
  blobs: {
    indigo: { color: "#6366F1", size: 760, opacity: 0.40, blur: 90, duration: 22 },
    violet: { color: "#A855F7", size: 680, opacity: 0.38, blur: 90, duration: 27 },
    cyan:   { color: "#22D3EE", size: 640, opacity: 0.36, blur: 90, duration: 24 },
    teal:   { color: "#14B8A6", size: 600, opacity: 0.35, blur: 90, duration: 29 },
  },

  // Rotating conic beam behind hero logo/heading
  conicBeam: {
    size: 780,
    opacity: 0.25,
    duration: 24, // seconds for full 360 rotation
  },

  // Neural Network Canvas
  canvas: {
    particlesDesktop: 50,
    particlesTablet: 35,
    particlesMobile: 22,
    maxDistance: 130, // max line connection distance in px
    particleColor: "rgba(199, 210, 254, 0.75)",
    lineRgb: "99, 102, 241", // indigo connection lines
    mouseAttractRadius: 180,
    mouseAttractForce: 0.018,
  },

  // "Site Assembling" SVG Wireframes (18-25% opacity)
  wireframes: {
    opacity: 0.22,
    cycleDuration: 10, // seconds
  },

  // Cursor Spotlight & 48px Grid
  grid: {
    cellSize: 48,
    baseLineColor: "rgba(255, 255, 255, 0.05)",
    litLineColor: "rgba(34, 211, 238, 0.18)", // glows cyan/indigo where spotlight passes
    spotlightRadius: 420,
    spotlightOpacity: 0.18, // 18% opacity
    lerpFactor: 0.08,
  },

  // Hero Scrim for WCAG AA text contrast
  scrim: {
    opacity: 0.85,
  },

  // Parallax rates on scroll (different speed per layer)
  parallax: {
    aurora: 0.04,     // slowest
    wireframes: 0.08, // medium
    particles: 0.14,  // faster
  },

  // Film grain overlay
  noiseOpacity: 0.03, // 3%
};

export const AnimatedBackground = () => {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const auroraRef = useRef(null);
  const wireframesRef = useRef(null);
  const spotlightBgRef = useRef(null);
  const spotlightGridRef = useRef(null);

  const [reducedMotion, setReducedMotion] = useState(false);
  const [deviceType, setDeviceType] = useState("desktop"); // 'desktop' | 'tablet' | 'mobile'

  // Mouse spotlight lerp coordinates (kept in refs to avoid 60fps re-rendering)
  const mouseTargetRef = useRef({ x: window.innerWidth * 0.5, y: 300 });
  const spotlightPosRef = useRef({ x: window.innerWidth * 0.5, y: 300 });

  const animFrameRef = useRef(null);
  const particlesRef = useRef([]);
  const isTabVisibleRef = useRef(true);
  const isHeroInViewRef = useRef(true);

  // 1. Media Queries & Motion Preference
  useEffect(() => {
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(motionQuery.matches);
    const handleMotionChange = (e) => setReducedMotion(e.matches);
    motionQuery.addEventListener("change", handleMotionChange);

    const updateDeviceType = () => {
      const width = window.innerWidth;
      if (width < 640) setDeviceType("mobile");
      else if (width < 1024) setDeviceType("tablet");
      else setDeviceType("desktop");
    };
    updateDeviceType();

    let resizeTimer = null;
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(updateDeviceType, 100);
    };
    window.addEventListener("resize", handleResize);

    // Smooth RAF scroll tracking directly via hardware transforms
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const sy = window.scrollY;
          if (auroraRef.current) {
            auroraRef.current.style.transform = `translate3d(0, ${-sy * BG_CONFIG.parallax.aurora}px, 0)`;
          }
          if (wireframesRef.current) {
            wireframesRef.current.style.transform = `translate3d(0, ${-sy * BG_CONFIG.parallax.wireframes}px, 0)`;
          }
          if (canvasRef.current) {
            canvasRef.current.style.transform = `translate3d(0, ${-sy * BG_CONFIG.parallax.particles}px, 0)`;
          }
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });

    // Page visibility check (pause when tab hidden)
    const handleVisibilityChange = () => {
      isTabVisibleRef.current = !document.hidden;
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      motionQuery.removeEventListener("change", handleMotionChange);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      clearTimeout(resizeTimer);
    };
  }, []);

  // 2. Mouse Move Listener (Desktop only)
  useEffect(() => {
    if (reducedMotion || deviceType === "mobile") return;

    const handleMouseMove = (e) => {
      mouseTargetRef.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [reducedMotion, deviceType]);

  // 3. Observer to pause canvas when hero is far offscreen
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        isHeroInViewRef.current = entry.isIntersecting;
      },
      { rootMargin: "300px" }
    );

    const heroEl = document.getElementById("hero-section");
    if (heroEl) observer.observe(heroEl);

    return () => {
      if (heroEl) observer.unobserve(heroEl);
    };
  }, []);

  // 4. Neural Network Canvas Animation Loop (60fps with delta-time, paused when hidden/offscreen)
  const initParticles = useCallback((count, width, height) => {
    const particles = [];
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.6,
        vy: (Math.random() - 0.5) * 0.6,
        radius: Math.random() * 1.2 + 1.2,
      });
    }
    return particles;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || reducedMotion) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas dimensions capped at DPR = 2
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let width = window.innerWidth;
    let height = window.innerHeight;

    const resizeCanvas = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.scale(dpr, dpr);

      const count =
        deviceType === "mobile"
          ? BG_CONFIG.canvas.particlesMobile
          : deviceType === "tablet"
          ? BG_CONFIG.canvas.particlesTablet
          : BG_CONFIG.canvas.particlesDesktop;

      particlesRef.current = initParticles(count, width, height);
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    let lastTime = performance.now();

    const render = (now) => {
      animFrameRef.current = requestAnimationFrame(render);

      // Smooth spotlight lerp
      const factor = BG_CONFIG.grid.lerpFactor;
      spotlightPosRef.current.x += (mouseTargetRef.current.x - spotlightPosRef.current.x) * factor;
      spotlightPosRef.current.y += (mouseTargetRef.current.y - spotlightPosRef.current.y) * factor;

      const sx = Math.round(spotlightPosRef.current.x);
      const sy = Math.round(spotlightPosRef.current.y);

      // Direct DOM updates for CSS radial spotlights (bypassing React re-renders for smooth 60fps)
      if (spotlightBgRef.current) {
        spotlightBgRef.current.style.background = `radial-gradient(circle ${BG_CONFIG.grid.spotlightRadius}px at ${sx}px ${sy}px, rgba(34, 211, 238, 0.12) 0%, rgba(99, 102, 241, ${BG_CONFIG.grid.spotlightOpacity}) 45%, transparent 80%)`;
      }
      if (spotlightGridRef.current) {
        const mask = `radial-gradient(circle ${BG_CONFIG.grid.spotlightRadius * 0.8}px at ${sx}px ${sy}px, black 20%, transparent 85%)`;
        spotlightGridRef.current.style.webkitMaskImage = mask;
        spotlightGridRef.current.style.maskImage = mask;
      }

      // Pause canvas draw if tab hidden or hero not in view
      if (!isTabVisibleRef.current || !isHeroInViewRef.current) {
        lastTime = now;
        return;
      }

      const dt = Math.min((now - lastTime) / 1000, 0.1); // delta-time in seconds
      lastTime = now;

      ctx.clearRect(0, 0, width, height);

      const particles = particlesRef.current;
      const mouseX = spotlightPosRef.current.x;
      const mouseY = spotlightPosRef.current.y;
      const attractRadius = BG_CONFIG.canvas.mouseAttractRadius;
      const attractForce = BG_CONFIG.canvas.mouseAttractForce;
      const maxDist = BG_CONFIG.canvas.maxDistance;
      const isInteractive = deviceType !== "mobile";

      // 1. Update and draw particles
      ctx.fillStyle = BG_CONFIG.canvas.particleColor;
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Mouse attraction
        if (isInteractive) {
          const dx = mouseX - p.x;
          const dy = mouseY - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < attractRadius && dist > 1) {
            p.vx += (dx / dist) * attractForce;
            p.vy += (dy / dist) * attractForce;
          }
        }

        // Apply velocities with subtle friction
        p.x += p.vx * (dt * 60);
        p.y += p.vy * (dt * 60);
        p.vx *= 0.99;
        p.vy *= 0.99;

        // Bounce at boundaries
        if (p.x < 0) { p.x = 0; p.vx *= -1; }
        else if (p.x > width) { p.x = width; p.vx *= -1; }
        if (p.y < 0) { p.y = 0; p.vy *= -1; }
        else if (p.y > height) { p.y = height; p.vy *= -1; }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
      }

      // 2. Connecting lines with distance fade and cursor glow
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const p1 = particles[i];
          const p2 = particles[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < maxDist) {
            let alpha = (1 - dist / maxDist) * 0.28;

            // Lines near cursor glow brighter
            if (isInteractive) {
              const midX = (p1.x + p2.x) * 0.5;
              const midY = (p1.y + p2.y) * 0.5;
              const mouseDist = Math.hypot(mouseX - midX, mouseY - midY);
              if (mouseDist < 160) {
                alpha += (1 - mouseDist / 160) * 0.45;
              }
            }

            ctx.strokeStyle = `rgba(${BG_CONFIG.canvas.lineRgb}, ${Math.min(alpha, 0.75)})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      }
    };

    animFrameRef.current = requestAnimationFrame(render);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [reducedMotion, deviceType, initParticles]);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: -1,
        pointerEvents: "none",
        overflow: "hidden",
        backgroundColor: BG_CONFIG.baseColor,
        userSelect: "none",
      }}
    >
      <style>{`
        /* 1. Aurora blob drift loops (20-30s ease-in-out loops) */
        @keyframes driftBlob1 {
          0%, 100% { transform: translate3d(0, 0, 0) scale(1); }
          50% { transform: translate3d(55px, -45px, 0) scale(1.1); }
        }
        @keyframes driftBlob2 {
          0%, 100% { transform: translate3d(0, 0, 0) scale(1); }
          50% { transform: translate3d(-50px, 40px, 0) scale(1.08); }
        }
        @keyframes driftBlob3 {
          0%, 100% { transform: translate3d(0, 0, 0) scale(1); }
          50% { transform: translate3d(45px, 50px, 0) scale(0.92); }
        }
        @keyframes driftBlob4 {
          0%, 100% { transform: translate3d(0, 0, 0) scale(1); }
          50% { transform: translate3d(-35px, -35px, 0) scale(1.06); }
        }

        /* 2. Slow rotating conic-gradient beam */
        @keyframes rotateConicBeam {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        /* 3. Site-assembling wireframes drawing with stroke-dashoffset */
        @keyframes drawWireframe {
          0% {
            stroke-dashoffset: 600;
            opacity: 0;
          }
          15% {
            opacity: 1;
          }
          55% {
            stroke-dashoffset: 0;
            opacity: 1;
          }
          80% {
            stroke-dashoffset: 0;
            opacity: 1;
          }
          100% {
            stroke-dashoffset: 0;
            opacity: 0;
          }
        }
      `}</style>

      {/* ================================================================== */}
      {/* LAYER 2: FOUR VIVID AURORA BLOBS + CONIC BEAM                      */}
      {/* ================================================================== */}
      <div
        ref={auroraRef}
        style={{
          position: "absolute",
          inset: 0,
          transform: "translate3d(0, 0, 0)",
          willChange: "transform",
        }}
      >
        {/* Blob 1: Indigo (#6366F1, 760px) behind hero */}
        <div
          style={{
            position: "absolute",
            top: "-5%",
            left: "26%",
            width: `${BG_CONFIG.blobs.indigo.size}px`,
            height: `${BG_CONFIG.blobs.indigo.size}px`,
            borderRadius: "50%",
            background: `radial-gradient(circle, rgba(99, 102, 241, ${BG_CONFIG.blobs.indigo.opacity}) 0%, rgba(99, 102, 241, 0.12) 50%, transparent 70%)`,
            filter: `blur(${BG_CONFIG.blobs.indigo.blur}px)`,
            animation: reducedMotion
              ? "none"
              : `driftBlob1 ${BG_CONFIG.blobs.indigo.duration}s ease-in-out infinite`,
          }}
        />

        {/* Blob 2: Violet (#A855F7, 680px) behind workspace */}
        <div
          style={{
            position: "absolute",
            top: "44%",
            left: "8%",
            width: `${BG_CONFIG.blobs.violet.size}px`,
            height: `${BG_CONFIG.blobs.violet.size}px`,
            borderRadius: "50%",
            background: `radial-gradient(circle, rgba(168, 85, 247, ${BG_CONFIG.blobs.violet.opacity}) 0%, rgba(168, 85, 247, 0.10) 50%, transparent 70%)`,
            filter: `blur(${BG_CONFIG.blobs.violet.blur}px)`,
            animation: reducedMotion
              ? "none"
              : `driftBlob2 ${BG_CONFIG.blobs.violet.duration}s ease-in-out infinite`,
          }}
        />

        {/* Blob 3: Cyan (#22D3EE, 640px) */}
        <div
          style={{
            position: "absolute",
            top: "12%",
            right: "8%",
            width: `${BG_CONFIG.blobs.cyan.size}px`,
            height: `${BG_CONFIG.blobs.cyan.size}px`,
            borderRadius: "50%",
            background: `radial-gradient(circle, rgba(34, 211, 238, ${BG_CONFIG.blobs.cyan.opacity}) 0%, rgba(34, 211, 238, 0.08) 50%, transparent 70%)`,
            filter: `blur(${BG_CONFIG.blobs.cyan.blur}px)`,
            animation: reducedMotion
              ? "none"
              : `driftBlob3 ${BG_CONFIG.blobs.cyan.duration}s ease-in-out infinite`,
          }}
        />

        {/* Blob 4: Teal (#14B8A6, 600px) */}
        <div
          style={{
            position: "absolute",
            top: "56%",
            right: "12%",
            width: `${BG_CONFIG.blobs.teal.size}px`,
            height: `${BG_CONFIG.blobs.teal.size}px`,
            borderRadius: "50%",
            background: `radial-gradient(circle, rgba(20, 184, 166, ${BG_CONFIG.blobs.teal.opacity}) 0%, rgba(20, 184, 166, 0.08) 50%, transparent 70%)`,
            filter: `blur(${BG_CONFIG.blobs.teal.blur}px)`,
            animation: reducedMotion
              ? "none"
              : `driftBlob4 ${BG_CONFIG.blobs.teal.duration}s ease-in-out infinite`,
          }}
        />

        {/* Rotating conic-gradient beam behind hero logo/heading (~25% opacity) */}
        <div
          style={{
            position: "absolute",
            top: "8%",
            left: "50%",
            marginLeft: `-${BG_CONFIG.conicBeam.size / 2}px`,
            width: `${BG_CONFIG.conicBeam.size}px`,
            height: `${BG_CONFIG.conicBeam.size}px`,
            borderRadius: "50%",
            background: `conic-gradient(from 0deg at 50% 50%, transparent 0deg, rgba(99, 102, 241, ${BG_CONFIG.conicBeam.opacity}) 60deg, rgba(34, 211, 238, ${BG_CONFIG.conicBeam.opacity}) 130deg, rgba(168, 85, 247, 0.20) 200deg, transparent 270deg)`,
            filter: "blur(60px)",
            animation: reducedMotion
              ? "none"
              : `rotateConicBeam ${BG_CONFIG.conicBeam.duration}s linear infinite`,
            transformOrigin: "center center",
          }}
        />
      </div>

      {/* ================================================================== */}
      {/* LAYER 3: 48PX GRID + CURSOR SPOTLIGHT                              */}
      {/* ================================================================== */}
      {/* Base 48px Grid */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `linear-gradient(to right, ${BG_CONFIG.grid.baseLineColor} 1px, transparent 1px), linear-gradient(to bottom, ${BG_CONFIG.grid.baseLineColor} 1px, transparent 1px)`,
          backgroundSize: `${BG_CONFIG.grid.cellSize}px ${BG_CONFIG.grid.cellSize}px`,
          WebkitMaskImage: "radial-gradient(ellipse 90% 80% at 50% 45%, black 35%, transparent 95%)",
          maskImage: "radial-gradient(ellipse 90% 80% at 50% 45%, black 35%, transparent 95%)",
        }}
      />

      {/* Dynamic Cursor Spotlight (indigo-to-cyan 420px at 18% opacity) */}
      {!reducedMotion && deviceType !== "mobile" && (
        <>
          <div
            ref={spotlightBgRef}
            style={{
              position: "absolute",
              inset: 0,
              background: `radial-gradient(circle ${BG_CONFIG.grid.spotlightRadius}px at 50% 300px, rgba(34, 211, 238, 0.12) 0%, rgba(99, 102, 241, ${BG_CONFIG.grid.spotlightOpacity}) 45%, transparent 80%)`,
            }}
          />

          {/* Grid lines glow where cursor spotlight passes */}
          <div
            ref={spotlightGridRef}
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage: `linear-gradient(to right, ${BG_CONFIG.grid.litLineColor} 1px, transparent 1px), linear-gradient(to bottom, ${BG_CONFIG.grid.litLineColor} 1px, transparent 1px)`,
              backgroundSize: `${BG_CONFIG.grid.cellSize}px ${BG_CONFIG.grid.cellSize}px`,
              WebkitMaskImage: `radial-gradient(circle ${BG_CONFIG.grid.spotlightRadius * 0.8}px at 50% 300px, black 20%, transparent 85%)`,
              maskImage: `radial-gradient(circle ${BG_CONFIG.grid.spotlightRadius * 0.8}px at 50% 300px, black 20%, transparent 85%)`,
            }}
          />
        </>
      )}

      {/* ================================================================== */}
      {/* LAYER 4: SINGLE NEURAL NETWORK CANVAS (50 / 35 / 22 particles)     */}
      {/* ================================================================== */}
      {!reducedMotion && (
        <canvas
          ref={canvasRef}
          style={{
            position: "absolute",
            inset: 0,
            transform: "translate3d(0, 0, 0)",
            willChange: "transform",
          }}
        />
      )}

      {/* ================================================================== */}
      {/* LAYER 5: "SITE ASSEMBLING" SVG WIREFRAMES (Line-by-line drawing)   */}
      {/* ================================================================== */}
      <div
        ref={wireframesRef}
        style={{
          position: "absolute",
          inset: 0,
          transform: "translate3d(0, 0, 0)",
          willChange: "transform",
          opacity: BG_CONFIG.wireframes.opacity,
        }}
      >
        {/* Wireframe 1: Top-Left floating site layout */}
        <svg
          className="hidden sm:block absolute top-[16%] left-[4%] w-48 h-36"
          viewBox="0 0 200 150"
          fill="none"
        >
          <g stroke="rgba(34, 211, 238, 0.85)" strokeWidth="1.2">
            {/* Outer window frame */}
            <rect x="2" y="2" width="196" height="146" rx="8" strokeDasharray="600" style={{ animation: `drawWireframe ${BG_CONFIG.wireframes.cycleDuration}s ease-in-out infinite` }} />
            {/* Navbar bar */}
            <line x1="12" y1="18" x2="188" y2="18" strokeDasharray="200" style={{ animation: `drawWireframe ${BG_CONFIG.wireframes.cycleDuration}s ease-in-out infinite 0.4s` }} />
            <circle cx="20" cy="18" r="3" fill="rgba(34, 211, 238, 0.8)" />
            {/* Hero block */}
            <rect x="18" y="32" width="164" height="42" rx="4" stroke="rgba(99, 102, 241, 0.85)" strokeDasharray="400" style={{ animation: `drawWireframe ${BG_CONFIG.wireframes.cycleDuration}s ease-in-out infinite 0.8s` }} />
            {/* 3 mini cards */}
            <rect x="18" y="86" width="48" height="46" rx="4" strokeDasharray="200" style={{ animation: `drawWireframe ${BG_CONFIG.wireframes.cycleDuration}s ease-in-out infinite 1.2s` }} />
            <rect x="76" y="86" width="48" height="46" rx="4" strokeDasharray="200" style={{ animation: `drawWireframe ${BG_CONFIG.wireframes.cycleDuration}s ease-in-out infinite 1.4s` }} />
            <rect x="134" y="86" width="48" height="46" rx="4" strokeDasharray="200" style={{ animation: `drawWireframe ${BG_CONFIG.wireframes.cycleDuration}s ease-in-out infinite 1.6s` }} />
          </g>
        </svg>

        {/* Wireframe 2: Bottom-Right floating responsive mobile layout */}
        <svg
          className="hidden md:block absolute top-[52%] right-[5%] w-36 h-56"
          viewBox="0 0 140 220"
          fill="none"
        >
          <g stroke="rgba(168, 85, 247, 0.85)" strokeWidth="1.2">
            <rect x="2" y="2" width="136" height="216" rx="16" strokeDasharray="600" style={{ animation: `drawWireframe ${BG_CONFIG.wireframes.cycleDuration}s ease-in-out infinite 2s` }} />
            <line x1="45" y1="12" x2="95" y2="12" strokeDasharray="50" style={{ animation: `drawWireframe ${BG_CONFIG.wireframes.cycleDuration}s ease-in-out infinite 2.2s` }} />
            {/* Stacked content blocks */}
            <rect x="14" y="28" width="112" height="48" rx="6" stroke="rgba(34, 211, 238, 0.85)" strokeDasharray="300" style={{ animation: `drawWireframe ${BG_CONFIG.wireframes.cycleDuration}s ease-in-out infinite 2.5s` }} />
            <rect x="14" y="86" width="112" height="34" rx="4" strokeDasharray="250" style={{ animation: `drawWireframe ${BG_CONFIG.wireframes.cycleDuration}s ease-in-out infinite 2.8s` }} />
            <rect x="14" y="130" width="112" height="34" rx="4" strokeDasharray="250" style={{ animation: `drawWireframe ${BG_CONFIG.wireframes.cycleDuration}s ease-in-out infinite 3.1s` }} />
            <rect x="30" y="178" width="80" height="22" rx="11" stroke="rgba(99, 102, 241, 0.9)" strokeDasharray="200" style={{ animation: `drawWireframe ${BG_CONFIG.wireframes.cycleDuration}s ease-in-out infinite 3.4s` }} />
          </g>
        </svg>
      </div>

      {/* ================================================================== */}
      {/* LAYER 6: HERO DARK RADIAL SCRIM (Keeps text contrast > WCAG AA)    */}
      {/* ================================================================== */}
      <div
        style={{
          position: "absolute",
          top: "5%",
          left: "50%",
          transform: "translateX(-50%)",
          width: "900px",
          height: "560px",
          background: `radial-gradient(ellipse 750px 480px at 50% 40%, rgba(7, 7, 10, ${BG_CONFIG.scrim.opacity}) 25%, rgba(7, 7, 10, 0.55) 65%, transparent 100%)`,
          pointerEvents: "none",
        }}
      />

      {/* ================================================================== */}
      {/* LAYER 8: TOP VIGNETTE & BOTTOM FADE INTO FOOTER                    */}
      {/* ================================================================== */}
      {/* Top Vignette */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "120px",
          background: `linear-gradient(to bottom, ${BG_CONFIG.baseColor} 0%, rgba(7, 7, 10, 0.6) 50%, transparent 100%)`,
        }}
      />

      {/* Bottom Fade */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: "220px",
          background: `linear-gradient(to top, ${BG_CONFIG.baseColor} 0%, rgba(7, 7, 10, 0.8) 50%, transparent 100%)`,
        }}
      />

      {/* ================================================================== */}
      {/* LAYER 9: 3% SVG FILM GRAIN OVERLAY                                 */}
      {/* ================================================================== */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: BG_CONFIG.noiseOpacity,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          mixBlendMode: "overlay",
          pointerEvents: "none",
        }}
      />
    </div>
  );
};

export default AnimatedBackground;
