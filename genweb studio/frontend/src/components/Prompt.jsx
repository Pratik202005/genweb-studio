import { 
    Briefcase, 
    FileText, 
    ShoppingBag, 
    CheckSquare, 
    ArrowUp,
    Terminal
} from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import Swal from 'sweetalert2';
import { useUser } from "../hooks/userContext";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:5000/";

const Prompt = () => {
    const HardPrompts = [
        "Generate a modern, responsive portfolio website to showcase projects, skills, and experience. Include a Home page (bio, photo), Projects page (demos, descriptions), Skills page, About page, and Contact page (form, social links). Features: sticky header, downloadable resume, testimonials, dark mode, and SEO optimization.",
        "Create a clean, responsive multi-page blog website with a Home page (recent posts), Blog Listing (pagination, filters), Single Post (title, author, comments), About, Contact, and an Admin Dashboard (create/edit/delete posts). Features: Markdown support, API/JSON data, category sidebar, SEO optimization, and dark mode.",
        "Build a modern, fully responsive e-commerce website with a Home page (featured products), Product Listing (filters), Single Product (details, reviews, cart), Cart, Checkout, and Order Confirmation. Features: user authentication, admin dashboard, secure payments, wishlist, and fast loading times.",
        "Develop a responsive task management web app with a Dashboard (To-Do, In Progress, Completed), Task List (filters), Single Task View (details, subtasks), Add/Edit Task, and Settings. Features: drag-and-drop, reminders, user authentication, dark mode, and API/local storage integration."
    ];
    
    const { user, loginWithGoogle } = useUser();
    const [prompt, setPrompt] = useState("");
    const [callCreatePrject, setCallCreateProject] = useState(false);

    useEffect(() => {
        if (callCreatePrject) handleCreateProject();
        setCallCreateProject(false);
    }, [callCreatePrject]);

    const handleCreateProject = async () => {
        let activeUser = user;
        if (!activeUser) {
            try {
                activeUser = await loginWithGoogle();
            } catch(e) {
                console.warn("Sign in skipped or cancelled, continuing as creator:", e);
            }
        }
        if (!prompt.trim()) return;

        const { value: formValues } = await Swal.fire({
            title: '<div class="text-lg font-bold text-zinc-100">Create New Project</div>',
            html: `
                <div class="w-full max-w-xs md:max-w-md mx-auto space-y-4 text-left">
                    <div class="flex flex-col space-y-1.5">
                        <label class="text-xs font-semibold text-zinc-300 uppercase tracking-wider" for="projectName">
                            Project Name
                        </label>
                        <input
                            id="projectName"
                            class="w-full px-3.5 py-2.5 bg-zinc-800 text-zinc-100 border border-zinc-700 rounded-lg shadow-sm focus:outline-none focus:border-indigo-500 text-sm"
                            placeholder="e.g. Modern Portfolio"
                            value="My New Website"
                        />
                    </div>
                    
                    <div class="grid grid-cols-2 gap-3">
                        <div class="flex flex-col space-y-1.5">
                            <label class="text-xs font-semibold text-zinc-300 uppercase tracking-wider" for="visibility">
                                Visibility
                            </label>
                            <select
                                id="visibility"
                                class="w-full px-3 py-2.5 bg-zinc-800 text-zinc-100 border border-zinc-700 rounded-lg shadow-sm focus:outline-none focus:border-indigo-500 text-sm"
                            >
                                <option value="private">Private</option>
                                <option value="public">Public</option>
                            </select>
                        </div>
                        
                        <div class="flex flex-col space-y-1.5">
                            <label class="text-xs font-semibold text-zinc-300 uppercase tracking-wider" for="projectType">
                                Runtime
                            </label>
                            <select
                                id="projectType"
                                class="w-full px-3 py-2.5 bg-zinc-800 text-zinc-100 border border-zinc-700 rounded-lg shadow-sm focus:outline-none focus:border-indigo-500 text-sm"
                            >
                                <option value="html-css-js">HTML / CSS / JS</option>
                                <option value="react">React</option>
                            </select>
                        </div>
                    </div>

                    <div class="flex flex-col space-y-1.5">
                        <label class="text-xs font-semibold text-zinc-300 uppercase tracking-wider" for="projectDescription">
                            Description
                        </label>
                        <textarea
                            id="projectDescription"
                            class="w-full px-3.5 py-2.5 bg-zinc-800 text-zinc-100 border border-zinc-700 rounded-lg shadow-sm focus:outline-none focus:border-indigo-500 text-sm"
                            placeholder="Optional project summary..."
                            rows="2"
                        ></textarea>
                    </div>
                </div>
            `,
            background: '#121214',
            color: '#F4F4F5',
            showCancelButton: true,
            cancelButtonText: 'Cancel',
            confirmButtonText: 'Create & Launch',
            confirmButtonColor: '#6366F1',
            cancelButtonColor: '#27272A',
            customClass: {
                popup: 'border border-zinc-800 rounded-2xl shadow-2xl',
            },
            focusConfirm: false,
            preConfirm: () => {
                const name = document.getElementById('projectName')?.value?.trim();
                const visibility = document.getElementById('visibility')?.value;
                const projectType = document.getElementById('projectType')?.value;
                const description = document.getElementById('projectDescription')?.value;

                if (!name) {
                    Swal.showValidationMessage('Project Name is required!');
                    return false;
                }

                return { name, visibility, projectType, description };
            }
        });

        if (formValues) {
            try {
                const targetUserId = activeUser?._id || user?._id || null;
                const response = await fetch(`${BACKEND_URL}project/add`, { 
                    method: "POST", 
                    headers: { 
                        "Content-Type": "application/json", 
                    },
                    body: JSON.stringify({
                        userId: targetUserId,
                        name: formValues.name,
                        description: formValues.description,
                        visibility: formValues.visibility,
                        projectType: formValues.projectType,
                        prompt: prompt
                    }),
                    credentials: "include", 
                });
                const data = await response.json();
                if (!response.ok) {
                    throw new Error(data.error || "Failed to create project");
                }
                localStorage.setItem('firstprompt', JSON.stringify(data));
                
                await Swal.fire({
                    icon: 'success',
                    title: 'Project Initialized!',
                    html: `
                        <div class="text-center">
                            <p class="text-zinc-300 text-sm">Launching workspace for <strong>${formValues.name}</strong>...</p>
                        </div>
                    `,
                    timer: 1400,
                    showConfirmButton: false,
                    background: '#121214',
                    color: '#F4F4F5',
                    customClass: {
                        popup: 'border border-zinc-800 rounded-2xl',
                    }
                });
                
                const targetPID = data.PID || data._id;
                setPrompt("");
                window.location.href = `/main/${(formValues.projectType==='react')?'react':'plain'}/${targetPID}`;
            } catch (err) {
                console.error("Project creation error:", err);

                await Swal.fire({
                    icon: 'error',
                    title: 'Creation Failed',
                    text: err.message || 'Something went wrong. Please try again later.',
                    background: '#121214',
                    color: '#F4F4F5',
                    confirmButtonColor: '#ef4444',
                    customClass: {
                        popup: 'border border-zinc-800 rounded-2xl',
                    }
                });
            }
        }
    };

    const starterBlueprints = [
        { 
            icon: Briefcase, 
            label: "Developer Portfolio", 
            tag: "Personal" 
        },
        { 
            icon: FileText, 
            label: "Editorial Blog", 
            tag: "Content" 
        },
        { 
            icon: ShoppingBag, 
            label: "E-Commerce Shop", 
            tag: "Storefront" 
        },
        { 
            icon: CheckSquare, 
            label: "SaaS Task Manager", 
            tag: "Dashboard" 
        }
    ];

    const [isFocused, setIsFocused] = useState(false);
    const [selectedChipIndex, setSelectedChipIndex] = useState(null);
    const [buttonPulsed, setButtonPulsed] = useState(false);
    const [placeholderIndex, setPlaceholderIndex] = useState(0);

    const examplePlaceholders = [
        "e.g. Build a sleek dashboard for a fitness tracking startup with workout metrics, goal progress cards, dark mode, and an exercise log...",
        "e.g. Generate a modern developer portfolio with project showcases, terminal aesthetic, live demos, and a contact form...",
        "e.g. Design a responsive editorial blog with reading time estimate, newsletter subscriptions, tags, and rich typography..."
    ];

    // Gentle placeholder fade cycle if prompt is empty
    useEffect(() => {
        if (prompt.trim() || isFocused) return;
        const interval = setInterval(() => {
            setPlaceholderIndex((prev) => (prev + 1) % examplePlaceholders.length);
        }, 5000);
        return () => clearInterval(interval);
    }, [prompt, isFocused]);

    // Send button pulse once when text is entered
    useEffect(() => {
        if (prompt.trim().length > 0 && !buttonPulsed) {
            setButtonPulsed(true);
        } else if (prompt.trim().length === 0) {
            setButtonPulsed(false);
        }
    }, [prompt, buttonPulsed]);

    return ( 
        <motion.div 
            id="prompt-section" 
            initial={{ scale: 0.97, opacity: 0.8 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-[92vw] max-w-4xl mb-24 mt-4 bg-zinc-900/40 backdrop-blur-xl rounded-2xl border border-zinc-800/80 hover:border-zinc-700/90 transition-all duration-300 shadow-xl p-6 sm:p-8 mx-auto flex flex-col"
        >
            <style>{`
                @keyframes spinConic {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
            `}</style>

            {/* Header */}
            <div className="text-center relative z-10 flex flex-col items-center mb-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-zinc-800 bg-zinc-800/60 text-zinc-300 text-xs font-medium mb-3">
                    <Terminal className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Interactive Workspace Studio</span>
                </div>
                <h3 className="font-display text-2xl sm:text-3xl font-semibold text-zinc-100 tracking-tight">
                    What would you like to build?
                </h3>
                <p className="text-xs sm:text-sm text-zinc-400 mt-1.5 max-w-md">
                    Click a quick blueprint starter below or describe your custom layout.
                </p>
            </div>

            {/* Quick Starter Blueprints (Uniform refined pills with spring scale & highlight) */}
            <div className="relative z-10 flex justify-center mb-6">
                <div className="flex flex-wrap justify-center gap-2 px-2">
                    {starterBlueprints.map((item, index) => {
                        const IconComp = item.icon;
                        const isSelected = selectedChipIndex === index;
                        return (
                            <motion.button 
                                key={index} 
                                whileHover={{ scale: 1.04 }}
                                whileTap={{ scale: 0.96 }}
                                transition={{ type: "spring", stiffness: 260, damping: 24 }}
                                className={`relative px-3.5 py-1.5 text-xs font-medium rounded-full border transition-all duration-200 flex items-center gap-2 group cursor-pointer ${
                                    isSelected 
                                        ? "border-indigo-500 text-white shadow-sm shadow-indigo-500/20" 
                                        : "border-zinc-800 bg-zinc-900/60 hover:bg-zinc-800/80 hover:border-zinc-700 text-zinc-300 hover:text-white"
                                }`}
                                onClick={() => {
                                    setSelectedChipIndex(index);
                                    setPrompt(HardPrompts[index]);
                                    setCallCreateProject(true);
                                }}
                            >
                                {isSelected && (
                                    <motion.div
                                        layoutId="blueprint-selected-pill"
                                        className="absolute inset-0 bg-indigo-600/30 rounded-full border border-indigo-500/50 -z-10"
                                        transition={{ type: "spring", stiffness: 300, damping: 26 }}
                                    />
                                )}
                                <IconComp className={`w-3.5 h-3.5 transition-colors ${isSelected ? "text-indigo-300" : "text-zinc-400 group-hover:text-indigo-400"}`} />
                                <span>{item.label}</span>
                                <span className="text-[10px] text-zinc-400 bg-zinc-800/80 px-1.5 py-0.5 rounded-full border border-zinc-700/60">
                                    {item.tag}
                                </span>
                            </motion.button>
                        );
                    })}
                </div>
            </div>

            {/* Prompt Input Panel with Conic Animated Focus Border */}
            <div className="relative z-10 flex justify-center">
                <div className="relative w-full rounded-xl p-[1px] transition-all duration-300 overflow-hidden">
                    {/* Animated rotating conic gradient border on focus */}
                    {isFocused && (
                        <div 
                            className="absolute -inset-[100%] pointer-events-none"
                            style={{
                                background: "conic-gradient(from 0deg, #6366F1, #22D3EE, #A855F7, #6366F1)",
                                animation: "spinConic 4s linear infinite",
                            }}
                        />
                    )}

                    <div 
                        className={`relative w-full flex items-end p-3.5 rounded-xl bg-zinc-950/90 border transition-all duration-300 ${
                            isFocused 
                                ? "border-transparent shadow-[0_0_25px_rgba(99,102,241,0.25)]" 
                                : "border-zinc-800 hover:border-zinc-700"
                        }`}
                    >
                        <textarea 
                            placeholder={examplePlaceholders[placeholderIndex]}
                            className="flex-1 bg-transparent text-zinc-100 outline-none border-none px-2 placeholder-zinc-500 text-sm sm:text-base resize-none overflow-y-auto leading-relaxed transition-all duration-200"
                            style={{ height: 'auto', minHeight: '44px', maxHeight: '11em' }}
                            rows="2"
                            value={prompt}
                            onFocus={() => setIsFocused(true)}
                            onBlur={() => setIsFocused(false)}
                            onInput={(e) => {
                                setPrompt(e.target.value);
                                e.target.style.height = 'auto';
                                e.target.style.height = `${e.target.scrollHeight}px`;
                            }} 
                        />

                        {/* Send button with one-time pulse on input */}
                        <motion.button 
                            onClick={handleCreateProject}
                            title="Generate Project"
                            disabled={!prompt.trim()}
                            animate={buttonPulsed ? { scale: [1, 1.15, 1] } : {}}
                            transition={{ duration: 0.35, ease: "easeOut" }}
                            whileTap={{ scale: 0.94 }}
                            className={`ml-2 p-3 rounded-lg flex items-center justify-center transition-all duration-200 ${
                                prompt.trim() 
                                    ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm shadow-indigo-600/30 hover:-translate-y-0.5 active:translate-y-0 cursor-pointer' 
                                    : 'bg-zinc-800/80 text-zinc-500 cursor-not-allowed'
                            }`}
                        >                         
                            <ArrowUp className="w-4 h-4" />
                        </motion.button>
                    </div>
                </div>
            </div>

            {/* Bottom Helper Hints */}
            <div className="relative z-10 flex items-center justify-between text-[11px] text-zinc-400 mt-3 px-2">
                <span>Tip: Be specific about pages, color style, and required widgets.</span>
                <span className="hidden sm:inline">Supports HTML/CSS/JS and React</span>
            </div>
        </motion.div>
    );
};

export default Prompt;