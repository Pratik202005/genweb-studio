import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { UserProvider } from "./hooks/userContext";

import Navbar from "./components/Navbar";
import Profile from "./pages/Profile";
import MainPageReact from "./pages/MainPageReact";
import MainPagePlain from "./pages/MainPagePlain";
import Landing from "./pages/Landing";
import Footer from "./components/Footer";
import { UniversalPage } from "./pages/UniversalPage";
import { ActionContext } from './pages/ActionContext';
import About from "./pages/About";

import AnimatedBackground from "./components/AnimatedBackground";
import ErrorBoundary from "./components/ErrorBoundary";
import { useSmoothScroll } from "./hooks/useSmoothScroll";

const AppContent = () => {
    const location = useLocation();
    const isWorkspace = location.pathname.startsWith('/main/');

    // Enable fluid 60fps smooth scrolling on home and public routes
    useSmoothScroll(!isWorkspace);

    return (
        <div className={`flex flex-col items-center min-h-screen w-full text-zinc-100 ${isWorkspace ? 'bg-gray-900' : 'bg-transparent'} relative isolate overflow-x-clip selection:bg-indigo-500/30 selection:text-indigo-200 font-sans`}>
            {!isWorkspace && <AnimatedBackground />}
            {!isWorkspace && <Navbar />}
            <main className="flex-grow w-full flex flex-col">
                <ErrorBoundary>
                    <Routes>
                        <Route path="/" element={<Landing />} />
                        <Route path="/universal" element={<UniversalPage />} />
                        <Route path="/profile" element={<Profile />} />
                        <Route path="/main/react/:projectid" element={<MainPageReact />} />
                        <Route path="/main/plain/:projectid" element={<MainPagePlain />} />
                        <Route path="/about" element={<About />} />
                    </Routes>
                </ErrorBoundary>
            </main>
            {!isWorkspace && <Footer />}
        </div>
    );
};

function App() {
    const [action, setAction] = useState();

    return (
        <UserProvider>
            <ActionContext.Provider value={{ action, setAction }}>
                <Router>
                    <ErrorBoundary>
                        <AppContent />
                    </ErrorBoundary>
                </Router>
            </ActionContext.Provider>
        </UserProvider>
    );
}

export default App;