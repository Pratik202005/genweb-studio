import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
    Sparkles, 
    Layers, 
    Bot, 
    ArrowRight,
    Zap,
    Smartphone,
    Palette,
    Download
} from "lucide-react";
import Logo from "./Logo";
import { MOTION } from "../lib/motionTokens";

// Interactive 3D Tilt Feature Card with cursor-following spotlight
const TiltFeatureCard = ({ feature, idx, isMobile }) => {
    const cardRef = useRef(null);
    const spotlightRef = useRef(null);
    const IconComponent = feature.icon;

    const handleMouseMove = (e) => {
        if (isMobile || !cardRef.current) return;
        const rect = cardRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotX = ((y - centerY) / centerY) * -5;
        const rotY = ((x - centerX) / centerX) * 5;

        cardRef.current.style.transform = `perspective(1000px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-4px)`;
        if (spotlightRef.current) {
            spotlightRef.current.style.opacity = '1';
            spotlightRef.current.style.background = `radial-gradient(circle 260px at ${x}px ${y}px, rgba(99, 102, 241, 0.16) 0%, rgba(34, 211, 238, 0.04) 60%, transparent 80%)`;
        }
    };

    const handleMouseLeave = () => {
        if (cardRef.current) {
            cardRef.current.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)`;
        }
        if (spotlightRef.current) {
            spotlightRef.current.style.opacity = '0';
        }
    };

    return (
        <motion.div
            ref={cardRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
                delay: 0.45 + idx * 0.06,
                duration: 0.4,
                ease: [0.22, 1, 0.36, 1],
            }}
            style={{
                perspective: 1000,
                transformStyle: "preserve-3d",
                transition: "transform 0.15s cubic-bezier(0.22, 1, 0.36, 1)",
                willChange: "transform",
            }}
            className="group relative bg-zinc-900/40 hover:bg-zinc-900/70 backdrop-blur-xl border border-zinc-800/80 hover:border-indigo-500/50 rounded-2xl p-6 hover:shadow-2xl hover:shadow-indigo-500/10 flex flex-col justify-between overflow-hidden cursor-pointer"
        >
            {/* Radial spotlight following cursor inside card */}
            <div
                ref={spotlightRef}
                className="absolute inset-0 pointer-events-none transition-opacity duration-200"
                style={{
                    opacity: 0,
                    background: `radial-gradient(circle 260px at 50% 50%, rgba(99, 102, 241, 0.16) 0%, rgba(34, 211, 238, 0.04) 60%, transparent 80%)`,
                }}
            />

            <div className="relative z-10">
                <div className="flex items-center justify-between mb-5">
                    {/* Icon container with hover rotation/bob */}
                    <div className="w-10 h-10 rounded-xl bg-zinc-800/80 border border-zinc-700/60 text-indigo-400 flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 group-hover:text-cyan-300 transition-all duration-300">
                        <IconComponent className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400 bg-zinc-800/60 px-2.5 py-1 rounded-md border border-zinc-700/50">
                        {feature.badge}
                    </span>
                </div>
                <h3 className="font-display text-base font-semibold text-zinc-100 mb-2 group-hover:text-white transition-colors">
                    {feature.title}
                </h3>
                <p className="text-xs sm:text-sm text-zinc-400 font-normal leading-relaxed">
                    {feature.description}
                </p>
            </div>
        </motion.div>
    );
};

// Magnetic Button with cursor tracking and sheen sweep
const MagneticPrimaryButton = ({ onClick, children, isMobile }) => {
    const btnRef = useRef(null);

    const handleMouseMove = (e) => {
        if (isMobile || !btnRef.current) return;
        const rect = btnRef.current.getBoundingClientRect();
        const x = Math.max(-6, Math.min(6, (e.clientX - (rect.left + rect.width / 2)) * 0.15));
        const y = Math.max(-6, Math.min(6, (e.clientY - (rect.top + rect.height / 2)) * 0.15));
        btnRef.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    };

    const handleMouseLeave = () => {
        if (btnRef.current) {
            btnRef.current.style.transform = `translate3d(0, 0, 0)`;
        }
    };

    return (
        <motion.button
            ref={btnRef}
            onClick={onClick}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            whileTap={{ scale: 0.97 }}
            style={{
                transition: "transform 0.18s cubic-bezier(0.22, 1, 0.36, 1)",
                willChange: "transform",
            }}
            className="relative px-6 sm:px-7 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 focus-visible:ring-2 focus-visible:ring-indigo-400 text-white font-medium text-sm sm:text-base shadow-sm shadow-indigo-600/30 hover:shadow-indigo-600/50 transition-colors duration-200 flex items-center gap-2 group overflow-hidden"
        >
            {/* Light sheen sweep on hover */}
            <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" />
            <span className="relative z-10">{children}</span>
            <ArrowRight className="w-4 h-4 text-indigo-200 group-hover:translate-x-1 transition-transform relative z-10" />
        </motion.button>
    );
};

const Introduction = () => {
    const words = [
        "GenWeb Studio",
        "Prompt to Website",
        "AI Web Synthesis",
        "Full-Stack Layouts"
    ];
    const [text, setText] = useState("");
    const [index, setIndex] = useState(0);
    const [charIndex, setCharIndex] = useState(0);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener("resize", checkMobile);
        return () => window.removeEventListener("resize", checkMobile);
    }, []);

    // 0.6s: Typing text with blinking cursor and letter reveal
    useEffect(() => {
        const currentWord = words[index];
        const typeSpeed = isDeleting ? 75 : 140;
        const nextDelay = isDeleting && charIndex === -1 ? 900 : typeSpeed;

        const timer = setTimeout(() => {
            if (!isDeleting && charIndex === currentWord.length) {
                setTimeout(() => setIsDeleting(true), 1200);
            } else if (isDeleting && charIndex === 0) {
                setIsDeleting(false);
                setIndex((prevIndex) => (prevIndex + 1) % words.length);
            }

            setText(currentWord.substring(0, charIndex));
            setCharIndex((prevChar) => prevChar + (isDeleting ? -1 : 1));
        }, nextDelay);

        return () => clearTimeout(timer);
    }, [charIndex, isDeleting, index]);

    const features = [
        {
            icon: Sparkles,
            title: "Prompt-to-Site Engine",
            description: "Describe your portfolio, blog, or SaaS platform in plain English and generate production-ready code in seconds.",
            badge: "Generative AI"
        },
        {
            icon: Layers,
            title: "Live Sandboxed Preview",
            description: "Interact with real-time responsive frames, test interactive buttons, and switch between code view and visual mode.",
            badge: "Interactive"
        },
        {
            icon: Bot,
            title: "Contextual AI Co-Pilot",
            description: "Refine layouts through conversational iterations that remember prior modifications without re-generating from scratch.",
            badge: "Smart Context"
        },
    ];

    const handleScroll = () => {
        const promptEl = document.getElementById("prompt-section");
        if (promptEl) {
            promptEl.scrollIntoView({ behavior: "smooth" });
        } else {
            window.scrollBy({ top: window.innerHeight * 0.8, behavior: "smooth" });
        }
    };

    return (
        <section id="hero-section" className="relative w-full flex flex-col items-center justify-center pt-16 pb-12 px-4 sm:px-6">
            <div className="relative text-center w-full max-w-5xl flex flex-col items-center">
                
                {/* Refined Pill Badge rising in with stagger */}
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-zinc-800 bg-zinc-900/60 backdrop-blur-md text-zinc-300 text-xs font-medium mb-8 hover:border-zinc-700 transition-colors shadow-sm"
                >
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse"></span>
                    <span className="tracking-wide text-zinc-300">AI-Powered Web Synthesis • Powered by Google Gemini</span>
                </motion.div>

                {/* Signature Logo scale (0.8 -> 1) with cyan-violet glow + Typewriter */}
                <div className="flex items-center justify-center flex-wrap gap-3 sm:gap-4 mb-5">
                    <motion.div
                        initial={{ scale: 0.85, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    >
                        <Logo className="w-12 h-12 sm:w-16 sm:h-16 md:w-18 md:h-18 drop-shadow-[0_0_16px_rgba(99,102,241,0.5)]" />
                    </motion.div>

                    <h1 className="font-display text-4xl sm:text-6xl md:text-7xl font-bold tracking-tightest text-zinc-100">
                        <span className="transition-all duration-75">{text}</span>
                        <span className="inline-block w-[3px] h-9 sm:h-12 md:h-14 ml-1.5 bg-indigo-500 animate-pulse align-middle"></span>
                    </h1>
                </div>

                {/* Subheadline */}
                <motion.h2
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    className="font-display text-xl sm:text-2xl md:text-3xl text-zinc-200 mb-4 font-semibold max-w-2xl tracking-tighter leading-snug"
                >
                    Build Full-Stack Websites at the Speed of Thought
                </motion.h2>

                {/* Body Paragraph */}
                <motion.p
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    className="max-w-2xl mx-auto text-sm sm:text-base text-zinc-400 mb-10 font-normal leading-relaxed"
                >
                    Turn natural language prompts into responsive multi-page web applications. 
                    Inspect live sandboxes, refine sections with conversational AI, and export clean code instantly.
                </motion.p>

                {/* Primary Magnetic Button and Secondary Ghost Button */}
                <motion.div 
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    className="flex flex-wrap justify-center gap-3.5 items-center mb-16"
                >
                    <MagneticPrimaryButton onClick={handleScroll} isMobile={isMobile}>
                        Start Generating
                    </MagneticPrimaryButton>

                    <motion.button
                        onClick={() => navigate('/universal')}
                        whileTap={{ scale: 0.97 }}
                        className="px-6 sm:px-7 py-3 rounded-xl border border-zinc-800 hover:border-zinc-600 bg-zinc-900/50 hover:bg-zinc-800/80 text-zinc-300 hover:text-white font-medium text-sm sm:text-base backdrop-blur-sm hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 flex items-center gap-2"
                    >
                        <span>Explore Showcase</span>
                    </motion.button>
                </motion.div>

                {/* 1.6s: 3D Tilt Feature Cards cascade in with rotateX(8deg) -> 0 */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5 w-full max-w-4xl mx-auto mb-14 text-left">
                    {features.map((feature, idx) => (
                        <TiltFeatureCard
                            key={feature.title}
                            feature={feature}
                            idx={idx}
                            isMobile={isMobile}
                        />
                    ))}
                </div>

                {/* Feature Highlights Strip: Scroll-Reveal + Hover Bounce on Icons */}
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: MOTION.duration.slow, ease: MOTION.ease.easeOut }}
                    className="flex flex-wrap items-center justify-center gap-5 sm:gap-8 text-xs text-zinc-400 pt-2 border-t border-zinc-800/60 w-full max-w-3xl"
                >
                    <motion.span 
                        whileHover={{ y: -3, scale: 1.05 }}
                        transition={MOTION.ease.spring}
                        className="flex items-center gap-2 cursor-default"
                    >
                        <Zap className="w-3.5 h-3.5 text-indigo-400" />
                        <span>Instant Live Sandboxing</span>
                    </motion.span>

                    <motion.span 
                        whileHover={{ y: -3, scale: 1.05 }}
                        transition={MOTION.ease.spring}
                        className="flex items-center gap-2 cursor-default"
                    >
                        <Smartphone className="w-3.5 h-3.5 text-indigo-400" />
                        <span>Multi-Page Responsive Routing</span>
                    </motion.span>

                    <motion.span 
                        whileHover={{ y: -3, scale: 1.05 }}
                        transition={MOTION.ease.spring}
                        className="flex items-center gap-2 cursor-default"
                    >
                        <Palette className="w-3.5 h-3.5 text-indigo-400" />
                        <span>Modern Tailwind & CSS</span>
                    </motion.span>

                    <motion.span 
                        whileHover={{ y: -3, scale: 1.05 }}
                        transition={MOTION.ease.spring}
                        className="flex items-center gap-2 cursor-default"
                    >
                        <Download className="w-3.5 h-3.5 text-indigo-400" />
                        <span>Clean One-Click Export</span>
                    </motion.span>
                </motion.div>
            </div>
        </section>
    );
};

export default Introduction;
