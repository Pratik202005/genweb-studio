'use client'

import React,{useState,useEffect,useContext,useRef} from 'react';
import Prism from 'prismjs';
import 'prismjs/themes/prism-okaidia.css';
import 'prismjs/components/prism-markup';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-javascript';
import Swal from 'sweetalert2';

import { Sandpack,
    SandpackProvider,
    SandpackLayout,
    SandpackCodeEditor,
    SandpackPreview,
    SandpackFileExplorer,useSandpack
   } from "@codesandbox/sandpack-react";
import { atomDark } from '@codesandbox/sandpack-themes';
import SandpackPreviewClient from './SandpackPreviewClient';
import { ActionContext } from './ActionContext'; // Updated import path
import { useParams } from 'react-router-dom';

import { useSpring, animated } from "@react-spring/web";
import { useDrag } from "@use-gesture/react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBarsStaggered, faCode, faWindowMaximize,faWandMagicSparkles,faFileExport, faRocket, faFloppyDisk, faHexagonNodes, faCopy, faLock, faArrowLeft} from "@fortawesome/free-solid-svg-icons";
import { faReact, faHtml5, faCss3Alt, faSquareJs  } from "@fortawesome/free-brands-svg-icons";
import { useUser } from '../hooks/userContext';
import { 
  useGenerationTracker, 
  GenerationChatCard, 
  GenerationPreviewOverlay 
} from '../components/GenerationProgress';
import { safeExtractCode } from './MainPagePlain';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:5000/";

const DEFAULT_REACT_PROJECT = {
  projectTitle: "GenWeb React App",
  explanation: "Welcome to your React workspace. Enter a prompt on the left to generate your custom React application.",
  entryFilePath: "/App.js",
  files: {
    "/App.js": {
      code: `import React from 'react';
import './App.css';

export default function App() {
  return (
    <div className="genweb-welcome-container">
      <div className="genweb-welcome-card">
        <div className="genweb-badge">GenWeb Studio • React Workspace</div>
        <h1 className="genweb-title">Ready to Generate Your React Website</h1>
        <p className="genweb-subtitle">
          Describe the website or features you want to build in the chat on the left, then click Generate to create complete, interactive React components with live preview.
        </p>
        <div className="genweb-features-grid">
          <div className="genweb-feature-pill">✦ Multi-Page Routes</div>
          <div className="genweb-feature-pill">✦ Responsive Layouts</div>
          <div className="genweb-feature-pill">✦ Live Code Editing</div>
          <div className="genweb-feature-pill">✦ Instant Cloud Deploy</div>
        </div>
      </div>
    </div>
  );
}`
    },
    "/App.css": {
      code: `* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  margin: 0;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  background: #090d16;
  color: #f1f5f9;
}

.genweb-welcome-container {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 2rem;
  background: radial-gradient(circle at 50% 20%, #1e1b4b 0%, #090d16 75%);
}

.genweb-welcome-card {
  max-width: 620px;
  text-align: center;
  padding: 3rem 2.5rem;
  background: rgba(15, 23, 42, 0.75);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(99, 102, 241, 0.3);
  border-radius: 20px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
}

.genweb-badge {
  display: inline-block;
  padding: 6px 14px;
  font-size: 0.8rem;
  font-weight: 600;
  letter-spacing: 0.05em;
  color: #a5b4fc;
  background: rgba(99, 102, 241, 0.15);
  border: 1px solid rgba(129, 140, 248, 0.3);
  border-radius: 9999px;
  margin-bottom: 1.5rem;
  text-transform: uppercase;
}

.genweb-title {
  font-size: 2.2rem;
  font-weight: 800;
  line-height: 1.25;
  margin-bottom: 1rem;
  background: linear-gradient(135deg, #ffffff 0%, #c7d2fe 60%, #818cf8 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.genweb-subtitle {
  font-size: 1.05rem;
  line-height: 1.6;
  color: #94a3b8;
  margin-bottom: 2rem;
}

.genweb-features-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: center;
}

.genweb-feature-pill {
  padding: 8px 16px;
  font-size: 0.85rem;
  color: #e2e8f0;
  background: rgba(30, 41, 59, 0.8);
  border: 1px solid rgba(71, 85, 105, 0.5);
  border-radius: 9999px;
}`
    }
  }
};

export default function MainPageReact({children}) {
  
  const { action, setAction } = useContext(ActionContext) || {};
  const [userprompts, setUserprompts] = useState([]);
  const [aimessage, setAimessage] = useState([]);
  const {projectid} = useParams();
  const [loading,setLoading] = useState(false);
  const generationTracker = useGenerationTracker(loading);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [userprompts, aimessage, loading]);

  const { user, setUser } = useUser();
  const [userIsOwner, setUserIsOwner] = useState(false);
  const [userpromptsTiming,setUserpromptsTiming] = useState([]);
  
  const getProjectData = async (pid) => {
    try {
        const response = await fetch(`${BACKEND_URL}project/${pid}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
        });
        
        if (!response.ok) {
            setUserIsOwner(true);
            return;
        }
        
        const data = await response.json(); 
        const isReact = data.projectType === true || data.projectType === "react";
        if (!isReact && data.projectType !== undefined) {
            console.log("[GenWeb Studio] Detected Plain project opened in React workspace. Redirecting to /main/plain/" + pid);
            window.location.replace(`/main/plain/${pid}`);
            return;
        }

        const isOwner = !data.owner || !user || String(data.owner) === String(user?._id) || (data.users && data.users.some(u => String(u) === String(user?._id)));
        setUserIsOwner(isOwner !== false);
    } catch (err) {
        console.log(err);
        setUserIsOwner(true);
    }
  };

  useEffect(() => {
    if (projectid) {
      getProjectData(projectid);
    }
  }, [projectid, user]);

  const [previousPrompts,setPreviousPrompts] = useState([
      {
        prompt : "hi",
        response: "A modern, responsive e-commerce website with product listing, cart functionality, and checkout process"
      }
    ]);
  const [prompt, setPrompt] = useState('');
  const [projectStructure, setProjectStructure] = useState(DEFAULT_REACT_PROJECT);
  const getAIResponse = async ()=>{
    setLoading(true);
    try {
      const response = await fetch(`${BACKEND_URL}chat/getchat/${projectid}`,{
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Include credentials for session management
      });

      const data = await response.json();
      const chats = data.chats || [];
      if (chats.length > 0) {
        let latest_code = null;
        for (let i = chats.length - 1; i >= 0; i--) {
          const parsed = safeExtractCode(chats[i].airesponse);
          if (parsed && ((parsed.files && Object.keys(parsed.files).length > 0) || parsed.html)) {
            latest_code = parsed;
            break;
          }
        }

        if (latest_code && latest_code.html && (!latest_code.files || Object.keys(latest_code.files).length === 0)) {
          console.log("[GenWeb Studio] Chats contain Plain HTML. Redirecting to /main/plain/" + projectid);
          window.location.replace(`/main/plain/${projectid}`);
          return;
        }

        if (latest_code && latest_code.files && Object.keys(latest_code.files).length > 0) {
          setProjectStructure(latest_code);
        }

        setUserprompts(chats.map((c) => c.userprompt));
        setAimessage(chats.map((c) => c.text));
        setUserpromptsTiming(chats.map((c) => c.time));
        setLoading(false);
      } else {
        const firstPromptData = localStorage.getItem('firstprompt');
        let initialPrompt = "";
        if (firstPromptData) {
          try {
            const parsed = JSON.parse(firstPromptData);
            if (parsed.prompt && (!parsed.PID || String(parsed.PID) === String(projectid))) {
              initialPrompt = parsed.prompt;
              localStorage.removeItem('firstprompt');
            }
          } catch (err) {
            console.error("Error parsing firstprompt", err);
          }
        }

        if (initialPrompt) {
          setPrompt(initialPrompt);
          await executePrompt(initialPrompt);
          return;
        }

        // Fallback: Check if the project has a description from creation to auto-generate
        try {
          const projRes = await fetch(`${BACKEND_URL}project/${projectid}`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            credentials: "include"
          });
          if (projRes.ok) {
            const projData = await projRes.json();
            if (projData.description && projData.description.trim().length > 3) {
              setPrompt(projData.description.trim());
              await executePrompt(projData.description.trim());
              return;
            }
          }
        } catch (descErr) {
          console.warn("Could not check project description for auto-generation:", descErr);
        }

        setLoading(false);
      }
    }catch(e){
      console.log("there is no previous chat in backend", e);
      setLoading(false);
    }
  };

  useEffect(() => {
    getAIResponse();
  }, [projectid]); 

  useEffect(() =>{
    console.log("After setting projectStructure in getAIResponse:",projectStructure);
  },[projectStructure])
  
  // getAIResponse();

  // Define states
  const [showCode, setShowCode] = useState(false); // State for toggling between website/code views
  const [activeTab,setActiveTab] = useState("preview");
  const prevTabRef = useRef();

  const highlightCode = React.useCallback(() => {
    if (window.Prism) {
      window.Prism.highlightAll();
    }
  }, []);

  const onActionBtn = (action) => {
    if (setAction) {
        setAction({
            actionType: action,
            timeStamp: Date.now()
        });
    } else {
        console.error("setAction is not defined");
    }
};

  const handleOnClick = () => {
    setActiveTab("preview");
  };

  useEffect(() => {
    prevTabRef.current = activeTab;
  }, [activeTab]);
  const executePrompt = async (promptText) => {
    const textToSubmit = (promptText || prompt || "").trim();
    if (!textToSubmit) return;
    setLoading(true);
    setPrompt("");
    setUserprompts((prevPrompts) => [...prevPrompts, textToSubmit]);

    try {
      const response = await fetch(`${BACKEND_URL}chat/${projectid}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: "include",
        body: JSON.stringify({
          message: textToSubmit,
          route: window.location.pathname,
          currentCode: projectStructure
        })
      });

      const data = await response.json();
      console.log('Response from backend:', data);

      if (data.error) {
        throw new Error(data.details || data.error);
      }

      const project_string = data?.content?.[0]?.text;
      if (!project_string) {
        throw new Error("No response received from AI backend");
      }

      const project_object = safeExtractCode(project_string) || {};
      setAimessage((prevMessages) => [...prevMessages, project_object.explanation || "Website generated successfully!"]);
      if (project_object.files && Object.keys(project_object.files).length > 0) {
        setProjectStructure(project_object);
      }

    } catch (error) {
      console.error('Error while generating website:', error);
      Swal.fire({
        icon: 'error',
        title: 'Generation Failed',
        text: error.message || 'Error occurred while generating with AI',
        background: '#1e293b',
        color: '#fff'
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePromptSubmit = async (e) => {
    if (e && typeof e.preventDefault === 'function') e.preventDefault();
    executePrompt(prompt);
  };

  const toggleView = ()=>{
    if(showCode){
      setShowCode(false);
    }
    else{
      setShowCode(true);
      setTimeout(highlightCode, 0);
    }
  };

  const copyProject = async () => {
    console.log("copy is hit");
    console.log(user);
    console.log(projectid);
    console.log(typeof projectid);  // Logs the type of projectid

    
    try {
      const response = await fetch(`${BACKEND_URL}project/copy/`+projectid, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ user }), // Fixed typo and stringified body
        credentials: "include", // Include credentials for session management
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      const data = await response.json();
      console.log("Project copied:", data);
  
      // Redirect to /main/react/{project_id} if response contains a valid ID
      if (data.project && data.project._id) {
        await Swal.fire({
            icon: 'success',
            title: 'Project Created!',
            html: `
                <div class="text-center">
                    <p>Your project has been successfully copied.</p>
                    <p>Redirecting to Copied Project Window</p>
                </div>
            `,
            customClass: {
                container: 'swal2-container-custom',
                popup: 'rounded-lg max-w-xs md:max-w-md mx-auto text-gray-200 p-6 shadow-xl',
                title: 'text-xl font-semibold text-green-400 mb-4',
                confirmButton: 'bg-green-500 hover:bg-green-600 text-white font-medium px-5 py-2 rounded-md',
                htmlContainer: 'text-sm font-normal text-gray-500',
                iconColor: 'text-green-400'
            },
            backdrop: 'backdrop-filter: blur(12px);',
        });
        window.location.href = `/main/react/${data.project._id}`;
      } else {
        console.error("Project ID missing in response");
      }
  
    } catch (error) {
      console.error("Error copying project:", error);
    }
  };
  
  const now = new Date();

  // Get time in 24-hour format
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const formattedTime = `${hours}:${minutes}`;
  
  // Get date in DD-MM-YYYY format
  const day = String(now.getDate()).padStart(2, '0');
  const month = String(now.getMonth() + 1).padStart(2, '0'); // Months are 0-based
  const year = now.getFullYear();
  const formattedDate = `${day}-${month}-${year}`;
  
  const finalOutput = `${formattedTime} ${formattedDate}`;

  return (
  <div className="flex flex-col md:flex-row h-screen w-full text-white bg-gray-900 overflow-hidden">
    {/* Left Panel */}
    <div
      className="w-full md:w-[42%] lg:w-[38%] h-[48vh] md:h-screen p-2 md:p-5 border-b md:border-b-0 md:border-r border-gray-700 bg-gray-900 flex flex-col shrink-0">
      {/* Previous Prompts Section */}
      <div className="flex-grow md:h-[70%] md:max-h-[70%] max-h-80 overflow-y-scroll p-3 mb-4 rounded-lg bg-gradient-to-br from-[#1A1A2E] to-[#0F3460] border border-indigo-400/20 shadow-2xl shadow-black/40">
        <div className="flex justify-between items-center mb-2">
          <div className="flex gap-2 text-xl font-semibold items-center">
            <div>
              <FontAwesomeIcon icon={faBarsStaggered} />
            </div>
            <div>
              Response History
            </div>
          </div>
          <button
            onClick={() => window.location.href = '/'}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 hover:text-white border border-zinc-700 text-xs font-medium transition shadow-sm cursor-pointer"
            title="Return to Dashboard"
          >
            <FontAwesomeIcon icon={faArrowLeft} className="text-xs" />
            <span>Back to Dashboard</span>
          </button>
        </div>
        {userprompts.map((prompt, index) => (
          <div key={index} className="mb-3">
            {/* User Prompt */}
            <div className="relative flex justify-end max-h-52 mt-3">
              <div className="bg-indigo-500 text-white px-4 py-2 rounded-lg max-w-[80%] overflow-scroll">
                {prompt}
              </div>
              <div className='absolute bottom-0 right-0 text-sm'>
                  {userpromptsTiming[index] || finalOutput}
                  </div>

            </div>
            {/* AI Response */}
            {aimessage[index] && (
              <div className="flex justify-start max-h-52 overflow-scroll mt-3">
                <div className="bg-gray-700 text-white px-4 py-2 rounded-lg max-w-[80%] overflow-scroll">
                  {aimessage[index]}
                </div>
              </div>
            )}
          </div>
        ))}
          {loading && <GenerationChatCard tracker={generationTracker} />}
          <div ref={chatEndRef} />
        </div>
      <div className='flex flex-col items-end w-full h-[30%] bg-gray-800 border border-gray-600 rounded-lg p-2'>
        <textarea
          id="prompt-area"
          className="w-full h-[75%] p-2 md:p-3 bg-gray-800 rounded-lg text-white placeholder-gray-400 focus:outline-none resize-none text-sm md:text-base"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handlePromptSubmit();
            }
          }}
          placeholder="Describe features or enter website prompt... (Press Enter to generate)"
        />
        <button 
          className="px-4 py-2 m-1 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-medium rounded-lg shadow-md transition flex items-center gap-2 text-sm"
          onClick={handlePromptSubmit}
          disabled={loading}
        >
          <FontAwesomeIcon icon={faWandMagicSparkles} />
          <span>{loading ? "Generating..." : "Generate"}</span>
        </button>
      </div>
    </div>
    
    
    {/* Right Panel */}
    <div className="w-full md:w-[58%] lg:w-[62%] h-[52vh] md:h-screen flex flex-col bg-gray-900 grow overflow-hidden relative">
      {/* Navigation Tabs */}
      <nav className="flex flex-row justify-between items-center p-1 md:p-2 bg-gray-900 border-b border-gray-700 h-[9%] mb-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => window.location.href = '/'}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-full bg-gray-800 hover:bg-gray-700 text-gray-200 hover:text-white border border-gray-600/70 text-xs md:text-sm font-medium transition shadow-sm cursor-pointer"
            title="Return to Dashboard"
          >
            <FontAwesomeIcon icon={faArrowLeft} className="text-xs" />
            <span className="hidden sm:inline">Dashboard</span>
          </button>
          <div 
            className="bg-gray-900 inline-flex rounded-full p-1 transition-colors duration-300 border border-gray-200/50"
            role="group"
          >
          <button
            type="button"
            className={`flex items-center rounded-full px-3 py-1.5 text-xs md:text-sm font-medium transition-all duration-300 
              ${activeTab === "preview" ? "bg-white text-gray-900 shadow-lg font-semibold" : "bg-gray-800 text-gray-300 hover:text-white"}`}
            onClick={handleOnClick}
          >
            <FontAwesomeIcon 
              icon={faWindowMaximize} 
              className="mr-1.5 text-xs md:text-sm text-indigo-500" 
            />
            <span>Preview</span>
          </button>

          <button
            type="button"
            className={`flex items-center rounded-full px-3 py-1.5 text-xs md:text-sm font-medium transition-all duration-300 
              ${activeTab === "code" ? "bg-white text-gray-900 shadow-lg font-semibold" : "bg-gray-800 text-gray-300 hover:text-white"}`}
            onClick={() => setActiveTab("code")}
          >
            <FontAwesomeIcon 
              icon={faCode} 
              className="mr-1.5 text-xs md:text-sm text-indigo-500" 
            />
            <span>Code</span>
          </button>
          </div>
        </div>
          
          {
            userIsOwner?(
          <div className='flex flex-row gap-3'>
          <button
            className={"relative group p-1 md:p-2 h-8 w-8 md:h-10 md:w-10 mt-1 rounded-full text-white ring-1 ring-slate-100/60" }
            onClick={() => onActionBtn("export")}
          
          >
            <FontAwesomeIcon icon={faFileExport} className="text-md md:text-xl" />
            <span className="absolute z-50 left-1/2 bottom-full mb-2 w-max -translate-x-1/2 
                     scale-0 rounded bg-gray-700 text-white text-xs px-2 py-1 
                     opacity-0 transition-all group-hover:scale-100 group-hover:opacity-100">
              Export
            </span>
          </button>
        
          <button
            className="relative group p-1 md:p-2 h-8 w-8 md:h-10 md:w-10 mt-1 rounded-full text-white ring-1 ring-slate-100/60"
            onClick={() => onActionBtn("deploy")}
          >
            <FontAwesomeIcon icon={faRocket} className="text-md md:text-xl" />
            <span className="absolute z-50 left-1/2 bottom-full mb-2 w-max -translate-x-1/2 
                     scale-0 rounded bg-gray-700 text-white text-xs px-2 py-1 
                     opacity-0 transition-all group-hover:scale-100 group-hover:opacity-100">
              Deploy
            </span>
          </button>
          </div>
          ):(
              <div className="flex flex-row gap-2 md:gap-3">
                <button className="relative group p-1 md:p-2 h-7 w-7 md:h-10 md:w-10 mt-1 rounded-full text-white ring-1 ring-slate-100/60"
                  onClick={copyProject}
                >
                  <FontAwesomeIcon icon={faCopy} className="text-md md:text-xl" />
                  <span className="absolute z-50 left-1/2 bottom-full mb-2 w-max -translate-x-1/2 scale-0 rounded bg-gray-700 text-white text-xs px-2 py-1 opacity-0 transition-all group-hover:scale-100 group-hover:opacity-100">
                  Copy
                </span>
                </button>
              </div>
            )
          }
      </nav>
      {loading && <GenerationPreviewOverlay tracker={generationTracker} />}

      {/* Sandpack Editor */}
      <SandpackProvider
        template="react"
        theme={atomDark}
        files={projectStructure?.files || DEFAULT_REACT_PROJECT.files}
        options={{
          showNavigator: true,
          showLineNumbers: true,
          closableTabs: true,
          activeFile: projectStructure?.entryFilePath || "/App.js",
        }}
        customSetup={{
          dependencies: {
            "axios": "^1.7.9",
            "class-variance-authority": "^0.7.1",
            "clsx": "^2.1.1",
            "cra-template": "1.2.0",
            "lucide-react": "^0.471.1",
            "prism": "^4.1.2",
            "prismjs": "^1.29.0",
            "react": "^18.3.1",
            "react-dom": "^18.3.1",
            "react-draggable": "^4.4.6",
            "react-frame-component": "^5.2.7",
            "react-grid-layout": "^1.5.0",
            "react-resizable": "^3.0.5",
            "react-router-dom": "^7.1.2",
            "react-scripts": "5.0.1",
          },
          main: projectStructure?.entryFilePath || "/App.js",
        }}
      >
        
        <SandpackLayout className="flex h-full bg-gray-900 w-full">
          <div className={`h-full w-full ${activeTab === "preview" ? "flex" : "hidden"}`}>
            <SandpackPreviewClient className="flex h-full w-full"/>
          </div>
          <div className={`h-full w-full overflow-hidden ${activeTab === "code" ? "flex" : "hidden"}`}>
            <SandpackFileExplorer className="border-r border-gray-700 h-full w-48 overflow-y-auto" />
            <SandpackCodeEditor className="h-full flex-grow overflow-y-auto" showLineNumbers />
          </div>
        </SandpackLayout>
      </SandpackProvider>
    </div>
  </div>
);
};
