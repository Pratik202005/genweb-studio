import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Logo from "./Logo";

export const Footer = () => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true });

    return (
        <motion.footer 
            ref={ref}
            initial={{ opacity: 0, y: 30 }} 
            animate={isInView ? { opacity: 1, y: 0 } : {}} 
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="w-full bg-[#0A0A0B]/90 backdrop-blur-md py-6 px-8 flex flex-col md:flex-row justify-between items-center border-t border-zinc-800/80 z-40 gap-4"
        >
            <div className="flex flex-col md:flex-row items-center gap-4 text-center md:text-left">
                <div className="text-white font-display font-bold text-base flex items-center gap-2.5">
                    <Logo className="h-5 w-5" />
                    <span className="text-zinc-100 tracking-tight">
                        GenWeb Studio
                    </span>
                </div>
                <span className="text-zinc-700 text-sm hidden md:inline">•</span>
                <div className="text-xs text-zinc-400">
                    <span>&copy; {new Date().getFullYear()} GenWeb Studio. Developed by <strong className="text-zinc-200 font-medium">Pratik</strong>.</span>
                </div>
            </div>

            <div className="flex items-center gap-1.5 text-xs text-zinc-400 bg-zinc-900/80 border border-zinc-800/90 px-3 py-1.5 rounded-full shadow-sm">
                <span>Powered by</span>
                <span className="font-medium text-zinc-200">
                    Google Gemini 2.0
                </span>
            </div>
        </motion.footer>
    );
};

export default Footer;
