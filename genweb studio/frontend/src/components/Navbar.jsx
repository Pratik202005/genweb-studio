import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { useUser } from "../hooks/userContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faBars, faArrowLeft, faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import { Popover, PopoverButton, PopoverPanel } from "@headlessui/react";
import Logo from "./Logo";
import { MOTION } from "../lib/motionTokens";

const Navbar = () => {
    const { user, loginWithGoogle, logoutUser, authLoading } = useUser();
    const navigate = useNavigate();
    const location = useLocation();
    
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isVisible, setIsVisible] = useState(true);
    const closeMobileMenu = () => setIsMobileMenuOpen(false);

    // Hide on scroll down, show on scroll up
    useEffect(() => {
        let lastY = window.scrollY;

        const handleScroll = () => {
            const currentY = window.scrollY;

            if (currentY > lastY + 8 && currentY > 70) {
                // Scrolling down past threshold
                setIsVisible(false);
            } else if (currentY < lastY - 6) {
                // Scrolling up
                setIsVisible(true);
            }
            lastY = currentY;
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const handleLogin = async () => {
        try {
            await loginWithGoogle();
        } catch (error) {
            console.error("Sign-in failed:", error);
        }
    };

    const handleLogout = async () => {
        await logoutUser();
        navigate("/");
    };

    const navItems = [
        { path: "/", label: "Home" },
        { path: "/universal", label: "Explore" },
        { path: "/about", label: "About" },
    ];

    return (
        <>
            <motion.nav 
                initial={{ y: 0 }}
                animate={{ y: isVisible ? 0 : -90 }}
                transition={{ duration: MOTION.duration.base, ease: MOTION.ease.easeOut }}
                className="w-full z-40 sticky top-0 border-b border-zinc-800/80 bg-[#07070A]/85 backdrop-blur-md px-5 sm:px-8 py-3 transition-colors"
            >
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    {/* Mobile Menu Toggle */}
                    <button 
                        className="md:hidden text-zinc-400 hover:text-white p-1.5 rounded-lg border border-zinc-800 bg-zinc-900/60 transition-colors"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        aria-label="Toggle Navigation"
                    >
                        <FontAwesomeIcon icon={isMobileMenuOpen ? faArrowLeft : faBars} className="w-4 h-4" />
                    </button>

                    {/* Brand */}
                    <div className="flex-1 md:flex-none flex justify-start items-center">
                        <Link to="/" className="flex items-center gap-2.5 group">
                            <Logo className="w-7 h-7 drop-shadow-[0_0_8px_rgba(99,102,241,0.35)] group-hover:scale-105 transition-transform" />
                            <span className="font-display font-bold text-base sm:text-lg tracking-tight text-zinc-100 group-hover:text-white transition-colors">
                                GenWeb Studio
                            </span>
                        </Link>
                    </div>

                    {/* Desktop Navigation Links with Framer-Motion Shared Layout Pill */}
                    <div className="hidden md:flex items-center gap-1 bg-zinc-900/70 border border-zinc-800/90 rounded-full p-1 text-sm font-medium shadow-inner relative">
                        {navItems.map((item) => {
                            const isActive = location.pathname === item.path;
                            return (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    className={`relative px-4 py-1.5 rounded-full text-xs font-medium transition-colors z-10 ${
                                        isActive ? "text-white" : "text-zinc-400 hover:text-zinc-200"
                                    }`}
                                >
                                    {isActive && (
                                        <motion.div
                                            layoutId="nav-active-pill"
                                            className="absolute inset-0 bg-zinc-800 rounded-full shadow-sm -z-10"
                                            transition={MOTION.ease.spring}
                                        />
                                    )}
                                    <span>{item.label}</span>
                                </Link>
                            );
                        })}
                    </div>

                    {/* Auth Action */}
                    <div className="flex items-center justify-end">
                        {!user && (
                            <button 
                                onClick={handleLogin}
                                disabled={authLoading}
                                className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 focus-visible:ring-2 focus-visible:ring-indigo-400 text-white font-medium text-xs sm:text-sm rounded-lg transition-all duration-200 shadow-sm shadow-indigo-600/20 hover:shadow-indigo-600/30 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-60 flex items-center gap-2"
                            >
                                {authLoading ? "Signing in..." : "Sign In with Google"}
                            </button>
                        )}
                        
                        {user && (
                            <Popover className="relative">
                                <PopoverButton className="border border-zinc-700/80 rounded-full p-0.5 h-8 w-8 flex items-center justify-center focus-visible:ring-2 focus-visible:ring-indigo-500 hover:border-zinc-500 transition-colors">
                                    <img 
                                        src={user.imageURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`} 
                                        alt="User Avatar" 
                                        className="h-full w-full object-cover rounded-full" 
                                    />
                                </PopoverButton>
                            
                                <PopoverPanel
                                    transition
                                    className="absolute right-0 mt-2.5 w-52 bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl ring-1 ring-black/40 p-1.5 text-zinc-200 text-sm z-50">
                                    <div className="px-3 py-2 text-xs text-zinc-400 border-b border-zinc-800 mb-1 truncate">
                                        {user.email}
                                    </div>
                                    <button 
                                        className="w-full px-3 py-2 flex items-center gap-2.5 hover:bg-zinc-800 cursor-pointer rounded-lg text-xs font-medium text-zinc-200 transition-colors"
                                        onClick={() => { navigate('/profile') }}
                                    >
                                        <FontAwesomeIcon icon={faUser} className="text-zinc-400 w-3.5 h-3.5" />
                                        Profile
                                    </button>
                                    <button 
                                        className="w-full px-3 py-2 flex items-center gap-2.5 hover:bg-zinc-800 cursor-pointer rounded-lg text-xs font-medium text-rose-400 transition-colors"
                                        onClick={handleLogout}
                                    >
                                        <FontAwesomeIcon icon={faSignOutAlt} className="w-3.5 h-3.5" />
                                        Logout
                                    </button>
                                </PopoverPanel>
                            </Popover>
                        )}
                    </div>
                </div>
            </motion.nav>

            {/* Mobile Drawer */}
            {isMobileMenuOpen && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 md:hidden" onClick={closeMobileMenu}>
                    <div className="fixed left-0 top-0 h-full w-72 bg-zinc-950 border-r border-zinc-800 shadow-2xl z-50 p-5 flex flex-col justify-between" onClick={(e) => e.stopPropagation()}>
                        <div>
                            <div className="flex justify-between items-center mb-6 pb-4 border-b border-zinc-800">
                                <div className="flex items-center gap-2">
                                    <Logo className="w-6 h-6" />
                                    <span className="font-display font-bold text-base text-zinc-100">GenWeb Studio</span>
                                </div>
                                <button 
                                    onClick={closeMobileMenu}
                                    className="text-zinc-400 hover:text-white p-1 rounded-md"
                                >
                                    <FontAwesomeIcon icon={faArrowLeft} className="w-4 h-4"/>
                                </button>
                            </div>
                            <div className="flex flex-col space-y-1.5">
                                <Link to="/" className={`p-2.5 rounded-lg text-sm transition-colors ${location.pathname === '/' ? 'bg-zinc-800 text-white font-medium' : 'text-zinc-300 hover:bg-zinc-900'}`} onClick={closeMobileMenu}>Home</Link>
                                <Link to="/universal" className={`p-2.5 rounded-lg text-sm transition-colors ${location.pathname === '/universal' ? 'bg-zinc-800 text-white font-medium' : 'text-zinc-300 hover:bg-zinc-900'}`} onClick={closeMobileMenu}>Explore</Link>
                                <Link to="/about" className={`p-2.5 rounded-lg text-sm transition-colors ${location.pathname === '/about' ? 'bg-zinc-800 text-white font-medium' : 'text-zinc-300 hover:bg-zinc-900'}`} onClick={closeMobileMenu}>About</Link>
                            </div>
                        </div>

                        <div className="pt-4 border-t border-zinc-800">
                            {!user ? (
                                <button 
                                    className="w-full rounded-lg px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm transition-colors shadow-sm" 
                                    onClick={() => {
                                        closeMobileMenu();
                                        handleLogin();
                                    }}
                                >
                                    Sign In with Google
                                </button>
                            ) : (
                                <div className="space-y-2">
                                    <button 
                                        className="w-full rounded-lg px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-200 flex items-center justify-center gap-2 text-sm border border-zinc-800 transition-colors" 
                                        onClick={() => {
                                            closeMobileMenu();
                                            navigate('/profile');
                                        }}>
                                        <FontAwesomeIcon icon={faUser} className="w-3.5 h-3.5" />
                                        Profile
                                    </button>

                                    <button 
                                        className="w-full rounded-lg px-4 py-2 bg-rose-950/30 hover:bg-rose-900/40 text-rose-300 border border-rose-900/40 flex items-center justify-center gap-2 text-sm transition-colors" 
                                        onClick={() => {
                                            closeMobileMenu();
                                            handleLogout();
                                        }}>
                                        <FontAwesomeIcon icon={faSignOutAlt} className="w-3.5 h-3.5" />
                                        Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Navbar;
