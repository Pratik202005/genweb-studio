import React from 'react';
import { useState, useEffect, useRef } from 'react';
import { TemplateCard } from "../components/TemplateCard";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass, faRocket, faHexagonNodes } from "@fortawesome/free-solid-svg-icons";
import InfiniteScroll from "react-infinite-scroller";
import { useUser } from "../hooks/userContext";
import Logo from "../components/Logo";
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:5000/";

const SearchBar = () => (
  <div className="relative w-full max-w-sm my-3">
    <input
      className="w-full px-5 py-3 text-sm rounded-full bg-gray-800 border border-gray-600 text-white outline-none focus:ring-2 focus:ring-blue-500 transition"
      placeholder="Search projects..."
    />
    <button className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-blue-500 transition">
      <FontAwesomeIcon icon={faMagnifyingGlass} />
    </button>
  </div>
);

export const UniversalPage = () => {
  
  const [hasMore, setHasMore] = useState(true);
  const [templates, setTemplates] = useState([]);
  const [visibleTemplates, setVisibleTemplates] = useState([]);
  const [page, setPage] = useState(1);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResult, setSearchResult]= useState([]);
  const [mount, setMount] = useState(false);
  const [showSearchResult, setShowSearchResult] = useState(false);

  const { user, setUser } = useUser();

  const searchRef = useRef(null);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSearchResult(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  });

  const handleSearch = ()=>{
    setVisibleTemplates([]);
    templates.map((template,index)=>{
        const tosearch = template.name.trim().toLowerCase();
        const search = searchTerm.trim().toLowerCase();
        if(tosearch.includes(search)){
            setVisibleTemplates((old)=>[...old,template]);
        }
    });
    setShowSearchResult(true);
  };

  useEffect(()=>{
    if(mount)handleSearch();
    else setMount(true);
  },[searchTerm]);

const CURATED_SHOWCASE_TEMPLATES = [
  {
    _id: "dummy-apex-portfolio",
    name: "Apex Portfolio Studio",
    description: "Ultra-sleek personal developer portfolio with interactive project showcases, responsive timeline, skills grid, and contact modal.",
    projectType: "react",
    votes: {
      upvotes: Array.from({ length: 148 }, (_, i) => `up-${i}`),
      downvotes: Array.from({ length: 4 }, (_, i) => `dn-${i}`),
    },
  },
  {
    _id: "dummy-novu-saas",
    name: "Novu SaaS Landing Page",
    description: "High-conversion product landing page featuring interactive pricing calculators, testimonial carousels, feature comparisons, and email signup.",
    projectType: "react",
    votes: {
      upvotes: Array.from({ length: 215 }, (_, i) => `up-${i}`),
      downvotes: Array.from({ length: 9 }, (_, i) => `dn-${i}`),
    },
  },
  {
    _id: "dummy-lumina-agency",
    name: "Lumina Creative Agency",
    description: "Vibrant bright-themed digital agency website with bold typography, interactive client case studies, team grid, and service rate cards.",
    projectType: "plain",
    votes: {
      upvotes: Array.from({ length: 94 }, (_, i) => `up-${i}`),
      downvotes: Array.from({ length: 2 }, (_, i) => `dn-${i}`),
    },
  },
  {
    _id: "dummy-zenith-ai",
    name: "Zenith AI Analytics Hub",
    description: "Comprehensive web app dashboard with telemetry graphs, prompt history, user controls, and dynamic dark/light theme switching.",
    projectType: "react",
    votes: {
      upvotes: Array.from({ length: 182 }, (_, i) => `up-${i}`),
      downvotes: Array.from({ length: 11 }, (_, i) => `dn-${i}`),
    },
  },
  {
    _id: "dummy-krafted-store",
    name: "Krafted Artisan Storefront",
    description: "Clean e-commerce store with functional shopping cart drawer, category filtering, product preview modals, and customer reviews.",
    projectType: "plain",
    votes: {
      upvotes: Array.from({ length: 136 }, (_, i) => `up-${i}`),
      downvotes: Array.from({ length: 6 }, (_, i) => `dn-${i}`),
    },
  },
  {
    _id: "dummy-pulse-magazine",
    name: "Pulse Tech Magazine",
    description: "Modern editorial blog with live reading progress bar, category filters, newsletter subscriptions, and markdown code formatting.",
    projectType: "plain",
    votes: {
      upvotes: Array.from({ length: 77 }, (_, i) => `up-${i}`),
      downvotes: Array.from({ length: 1 }, (_, i) => `dn-${i}`),
    },
  },
  {
    _id: "dummy-fitness-track",
    name: "FitPulse Workout Tracker",
    description: "Interactive workout tracker with streak counters, weekly progress graphs, meal planner, and motivational audio cues.",
    projectType: "react",
    votes: {
      upvotes: Array.from({ length: 165 }, (_, i) => `up-${i}`),
      downvotes: Array.from({ length: 14 }, (_, i) => `dn-${i}`),
    },
  },
  {
    _id: "dummy-aura-bistro",
    name: "Aura Artisan Bistro & Cafe",
    description: "Warm, appetizing restaurant landing page with online table reservations, interactive seasonal menu cards, and location hours.",
    projectType: "plain",
    votes: {
      upvotes: Array.from({ length: 112 }, (_, i) => `up-${i}`),
      downvotes: Array.from({ length: 5 }, (_, i) => `dn-${i}`),
    },
  },
];

  const getAllProjects = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${BACKEND_URL}project/visible`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      let backendProjects = [];
      if (response.ok) {
        backendProjects = await response.json();
      }

      const combined = (backendProjects && backendProjects.length > 0)
        ? [...backendProjects, ...CURATED_SHOWCASE_TEMPLATES]
        : CURATED_SHOWCASE_TEMPLATES;

      const sortedTemplates = combined.sort((a, b) => {
        const aCount = (a.votes?.upvotes?.length || 0) - (a.votes?.downvotes?.length || 0);
        const bCount = (b.votes?.upvotes?.length || 0) - (b.votes?.downvotes?.length || 0);
        return bCount - aCount;
      });
      setTemplates(sortedTemplates);
    } catch (err) {
      console.warn("Using fallback showcase templates:", err);
      setTemplates(CURATED_SHOWCASE_TEMPLATES);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getAllProjects();
  }, []);

  useEffect(() => {
    const initialItems = templates.slice(0, 6);
    setVisibleTemplates(initialItems);
    setHasMore(initialItems.length < templates.length);
  }, [templates]);

  const loadMoreTemplates = () => {
    if (!isLoading) {
      const nextPage = page + 1;
      const nextItems = templates.slice(0, nextPage * 6);
      
      setVisibleTemplates(nextItems);
      setPage(nextPage);
      setHasMore(nextItems.length < templates.length);
    }
  };
  const handleRedirect = (project) => {
    const isReact = project && (project.projectType === true || project.projectType === "react");
    if (isReact) {
        window.location.href = '/main/react/' + project._id;
    } else {
        window.location.href = '/main/plain/' + project._id;
    }
  };
  return (
    <div className="min-h-screen w-full text-zinc-100 px-6 sm:px-12 py-12 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h2 className="text-3xl sm:text-4xl font-display font-extrabold tracking-tight text-white flex items-center gap-3">
            <span className="text-indigo-400"><FontAwesomeIcon icon={faRocket} /></span>
            <span>Community Showcase</span>
          </h2>
          <p className="text-zinc-400 mt-2 text-sm sm:text-base max-w-xl">
            Explore curated web applications and responsive templates synthesized with GenWeb Studio.
          </p>
        </div>
        <div ref={searchRef} className="relative w-full md:w-[25rem]">
          <div className="relative w-full">
            <input
              onChange={(e) => {setSearchTerm(e.target.value)}}
              className="w-full px-5 py-3 text-sm rounded-full bg-zinc-900/90 border border-zinc-800 text-white outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition shadow-inner placeholder-zinc-500"
              placeholder="Search templates & projects..."
              value={searchTerm}
              onClick={() => setShowSearchResult(true)}
            />
            <button 
              onClick={() => {setShowSearchResult(false);}} 
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-zinc-400 hover:text-indigo-400 transition"
            >
              <FontAwesomeIcon icon={faMagnifyingGlass} />
            </button>
          </div>
          {showSearchResult && (
            <div className="absolute w-full mt-2 bg-zinc-900/95 border border-zinc-800 rounded-2xl shadow-2xl z-20 p-2 backdrop-blur-xl">
              {visibleTemplates.length === 0 ? (
                <div className="px-4 py-3 text-zinc-400 text-sm">
                  No matching projects found
                </div>
              ) : (
                visibleTemplates.map((template, index) => (
                  <div
                    key={index}
                    className="px-4 py-2.5 rounded-xl hover:bg-zinc-800 text-zinc-200 text-sm cursor-pointer transition flex items-center justify-between"
                    onClick={() => {handleRedirect(template)}}
                  >
                    <span>{template.name}</span>
                    <span className="text-[11px] text-indigo-400 uppercase font-medium">{template.projectType || 'plain'}</span>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>

      {isLoading && visibleTemplates.length === 0 ? (
        <div className="flex justify-center my-6">
          <Logo className="w-12 h-12 animate-pulse drop-shadow-[0_0_16px_rgba(99,102,241,0.6)]" />
        </div>
      ) : (
        <InfiniteScroll
          pageStart={0}
          loadMore={loadMoreTemplates}
          hasMore={hasMore}
          loader={
            <div key={0} className="flex justify-center my-6">
              <Logo className="w-10 h-10 animate-pulse drop-shadow-[0_0_12px_rgba(99,102,241,0.5)]" />
            </div>
          }
          useWindow={true}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {visibleTemplates.map((template, index) => (
              <div 
                key={index} 
                className="transform transition-all duration-300">
                <TemplateCard 
                  id={template._id}
                  title={template.name} 
                  description={template.description}
                  initialVotes={template.votes}
                  projectType={template.projectType}
                  user={user}
                />
              </div>
            ))}
          </div>
        </InfiniteScroll>
      )}
    </div>
  );
};

export default UniversalPage;