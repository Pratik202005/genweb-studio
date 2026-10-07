import React, { useEffect, useRef, useState } from "react";

export const AmbientBackground = () => {
  const [mousePos, setMousePos] = useState({ x: 50, y: 30 });
  const [reducedMotion, setReducedMotion] = useState(false);
  const targetPos = useRef({ x: 50, y: 30 });
  const animFrameId = useRef(null);

  useEffect(() => {
    // Check reduced motion preference
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mediaQuery.matches);
    const handleMotionChange = (e) => setReducedMotion(e.matches);
    mediaQuery.addEventListener("change", handleMotionChange);

    if (mediaQuery.matches) return;

    const handleMouseMove = (e) => {
      const xPercent = (e.clientX / window.innerWidth) * 100;
      const yPercent = (e.clientY / window.innerHeight) * 100;
      targetPos.current = { x: xPercent, y: yPercent };
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    // Smooth lerp loop for the mouse spotlight (60fps)
    let currentX = 50;
    let currentY = 30;

    const updateSpotlight = () => {
      currentX += (targetPos.current.x - currentX) * 0.04;
      currentY += (targetPos.current.y - currentY) * 0.04;
      setMousePos({ x: currentX, y: currentY });
      animFrameId.current = requestAnimationFrame(updateSpotlight);
    };

    animFrameId.current = requestAnimationFrame(updateSpotlight);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      mediaQuery.removeEventListener("change", handleMotionChange);
      if (animFrameId.current) cancelAnimationFrame(animFrameId.current);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none bg-[#0A0A0B]"
    >
      {/* 1. Subtle Radial Background Ambient Light */}
      <div 
        className="absolute inset-0 transition-opacity duration-1000"
        style={{
          background: reducedMotion
            ? `radial-gradient(circle at 50% 20%, rgba(99, 102, 241, 0.07) 0%, transparent 60%)`
            : `radial-gradient(circle 800px at ${mousePos.x}% ${mousePos.y}%, rgba(99, 102, 241, 0.07) 0%, transparent 70%), radial-gradient(circle 900px at 50% 0%, rgba(255, 255, 255, 0.03) 0%, transparent 80%)`,
        }}
      />

      {/* 2. Soft Drifting Mesh Gradient Blobs (Restrained & Low Contrast) */}
      <div 
        className="absolute -top-40 left-1/3 w-[600px] h-[600px] rounded-full bg-indigo-500/[0.04] blur-[150px] animate-pulse"
        style={{ animationDuration: '8s' }}
      />
      <div 
        className="absolute top-1/2 -right-40 w-[650px] h-[650px] rounded-full bg-zinc-700/[0.03] blur-[160px]"
      />

      {/* 3. Faint Dot Grid Pattern Masked by Spotlight */}
      <div
        className="absolute inset-0 bg-studio-dots [mask-image:radial-gradient(ellipse_75%_65%_at_50%_35%,black_40%,transparent_90%)] opacity-60"
      />

      {/* 4. Film Grain Noise Texture */}
      <div className="absolute inset-0 bg-noise pointer-events-none" />
    </div>
  );
};

export default AmbientBackground;
