import '../App.css';

import React, { useState, useEffect, useRef, useContext } from 'react';
import Prism from 'prismjs';
import 'prismjs/themes/prism-okaidia.css';
import 'prismjs/components/prism-markup';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-javascript';
import { useParams } from 'react-router-dom';

import { ActionContext } from './ActionContext'; // Updated import path
import { useUser } from "../hooks/userContext";
import Swal from 'sweetalert2';
import { Sandpack, SandpackProvider, useSandpack, SandpackLayout } from "@codesandbox/sandpack-react";
import SandpackPreviewClient2 from './SandpackPreviewClient2';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBarsStaggered, faCode, faWindowMaximize, faWandMagicSparkles,
  faFileArrowDown, faRocket, faFloppyDisk,
  faHexagonNodes, faCopy, faLock, faArrowLeft
}
  from "@fortawesome/free-solid-svg-icons";
import { faReact, faHtml5, faCss3Alt, faSquareJs } from "@fortawesome/free-brands-svg-icons";
import { 
  useGenerationTracker, 
  GenerationChatCard, 
  GenerationPreviewOverlay 
} from '../components/GenerationProgress';

export const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:5000/";

export const safeExtractCode = (raw) => {
  if (!raw) return null;
  let data = raw;

  if (typeof data === "string") {
    try {
      data = JSON.parse(data);
    } catch (e) {}
  }

  if (typeof data === "string") {
    try {
      data = JSON.parse(data);
    } catch (e) {}
  }

  if (typeof data === "string") {
    try {
      let cleaned = data.trim().replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "").trim();
      const firstBrace = cleaned.indexOf("{");
      const lastBrace = cleaned.lastIndexOf("}");
      if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
        cleaned = cleaned.slice(firstBrace, lastBrace + 1);
      }
      data = JSON.parse(cleaned);
    } catch (e) {}
  }

  if (typeof data === "string") {
    try {
      const extractField = (fieldName, nextFields) => {
        const regexStart = new RegExp(`"${fieldName}"\\s*:\\s*"`, "i");
        const match = data.match(regexStart);
        if (!match) return null;
        const startIndex = match.index + match[0].length;
        const nextPattern = new RegExp(`",\\s*"(?:${nextFields.join("|")})"\\s*:|"\\s*}\\s*$`, "i");
        const remaining = data.slice(startIndex);
        const endMatch = remaining.match(nextPattern);
        const endIndex = endMatch ? (startIndex + endMatch.index) : data.lastIndexOf('"');
        if (endIndex > startIndex) {
          return data.slice(startIndex, endIndex)
            .replace(/\\"/g, '"')
            .replace(/\\n/g, '\n')
            .replace(/\\r/g, '')
            .replace(/\\t/g, '\t')
            .replace(/\\\\/g, '\\');
        }
        return null;
      };

      const html = extractField("html", ["css", "js", "explanation"]);
      const css = extractField("css", ["js", "explanation", "html"]);
      const js = extractField("js", ["explanation", "html", "css"]);
      const explanation = extractField("explanation", ["html", "css", "js"]);

      if (html || css || js) {
        data = {
          html: html || "",
          css: css || "",
          js: js || "",
          explanation: explanation || ""
        };
      }
    } catch (e) {}
  }

  if (typeof data === "string") {
    try {
      const filesMatch = data.match(/"files"\s*:\s*(\{[\s\S]*?\})\s*,\s*"(?:entryFilePath|projectTitle|explanation)"/i) ||
                         data.match(/"files"\s*:\s*(\{[\s\S]*?\})\s*\}/i);
      if (filesMatch) {
        const parsedFiles = JSON.parse(filesMatch[1]);
        if (parsedFiles) {
          data = {
            projectTitle: "React App",
            explanation: "Generated React project",
            files: parsedFiles,
            entryFilePath: "/App.js"
          };
        }
      }
    } catch (e) {}
  }

  return (data && typeof data === "object") ? data : null;
};

const DEFAULT_PLAIN_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>GenWeb Studio - Workspace</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background: radial-gradient(circle at 50% 25%, #1e1b4b 0%, #090d16 80%);
      color: #f1f5f9;
      font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 24px;
      overflow-y: auto;
    }
    .genweb-canvas-card {
      max-width: 600px;
      width: 100%;
      text-align: center;
      padding: 40px 32px;
      background: rgba(15, 23, 42, 0.7);
      backdrop-filter: blur(16px);
      border: 1px solid rgba(99, 102, 241, 0.3);
      border-radius: 24px;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.6);
    }
    .genweb-icon {
      width: 64px;
      height: 64px;
      margin: 0 auto 20px;
      background: linear-gradient(135deg, #4f46e5 0%, #9333ea 100%);
      border-radius: 18px;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 10px 25px rgba(79, 70, 229, 0.4);
    }
    .genweb-icon svg {
      width: 34px;
      height: 34px;
      fill: #ffffff;
    }
    .genweb-tag {
      display: inline-block;
      padding: 5px 14px;
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: #a5b4fc;
      background: rgba(99, 102, 241, 0.15);
      border: 1px solid rgba(129, 140, 248, 0.3);
      border-radius: 9999px;
      margin-bottom: 16px;
    }
    h1 {
      font-size: 26px;
      font-weight: 800;
      line-height: 1.3;
      margin-bottom: 12px;
      background: linear-gradient(135deg, #ffffff 0%, #c7d2fe 70%, #818cf8 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    p {
      color: #94a3b8;
      font-size: 14px;
      line-height: 1.6;
      margin-bottom: 24px;
    }
    .genweb-tips {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      justify-content: center;
    }
    .genweb-tip {
      font-size: 12px;
      padding: 6px 14px;
      background: rgba(30, 41, 59, 0.7);
      border: 1px solid rgba(71, 85, 105, 0.4);
      border-radius: 9999px;
      color: #cbd5e1;
    }
  </style>
</head>
<body>
  <div class="genweb-canvas-card">
    <div class="genweb-icon">
      <svg viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
    </div>
    <div class="genweb-tag">GenWeb Studio • Live Canvas</div>
    <h1>Ready to Build Your Website</h1>
    <p>Describe your website or app on the left, then click <strong>Generate</strong>. Your interactive design, styling, and drag-and-drop components will appear right here.</p>
    <div class="genweb-tips">
      <span class="genweb-tip">✦ Drag & Drop Reordering</span>
      <span class="genweb-tip">✦ Instant Preview</span>
      <span class="genweb-tip">✦ Clean Code Export</span>
      <span class="genweb-tip">✦ Single-Page SPA Ready</span>
    </div>
  </div>
</body>
</html>`;

const MainPagePlain = () => {
  // Context and routing
  const { action, setAction } = useContext(ActionContext) || {};
  const { projectid } = useParams();
  const { user, setUser } = useUser();

  // State hooks
  const [prompt, setPrompt] = useState("");
  const [userIsOwner, setUserIsOwner] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userprompts, setUserprompts] = useState([]);
  const [aimessage, setAimessage] = useState([]);
  const [userpromptsTiming, setUserpromptsTiming] = useState([]);
  const [generatedHTML, setGeneratedHTML] = useState(DEFAULT_PLAIN_HTML);
  const [showCode, setShowCode] = useState(false);
  const [fileName, setFileName] = useState("html");
  const [generatedCSS, setGeneratedCSS] = useState("");
  const [generatedJS, setGeneratedJS] = useState("");
  const [generatedText, setGeneratedText] = useState("");
  const [deployedCode, setDeployedCode] = useState("");

  // Refs and helper hooks
  const chatEndRef = useRef(null);
  const iframeRef = useRef(null);
  const generationTracker = useGenerationTracker(loading);

  const previousPrompts = [
    {
      prompt: "hi",
      response: "hi"
    }
  ];

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [userprompts, aimessage, loading]);

  useEffect(() => {
    const handleReorder = (e) => {
      if (e.data && e.data.type === 'GENWEB_SECTION_REORDERED' && e.data.bodyHtml) {
        setGeneratedHTML(prev => {
          if (prev && prev.includes('<body')) {
            const bodyStart = prev.indexOf('<body');
            const bodyClose = prev.lastIndexOf('</body>');
            if (bodyStart !== -1 && bodyClose !== -1) {
              const beforeBody = prev.slice(0, prev.indexOf('>', bodyStart) + 1);
              const afterBody = prev.slice(bodyClose);
              return `${beforeBody}\n${e.data.bodyHtml}\n${afterBody}`;
            }
          }
          return e.data.bodyHtml;
        });
      }
    };
    window.addEventListener('message', handleReorder);
    return () => window.removeEventListener('message', handleReorder);
  }, []);
  
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
        if (isReact) {
            console.log("[GenWeb Studio] Detected React project opened in Plain workspace. Redirecting to /main/react/" + pid);
            window.location.replace(`/main/react/${pid}`);
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

  useEffect(() => {
    if (window.Prism) {
      Prism.highlightAll(); // Applies syntax highlighting to all <code> elements
    }
  }, [generatedHTML, generatedCSS, generatedJS]);

  const highlightCode = React.useCallback(() => {
    if (window.Prism) {
      window.Prism.highlightAll();
    }
  }, []);

  const handleClick = (type) => {
    setFileName(type);
    setTimeout(highlightCode, 0);
  };

  const getCleanedExportHTML = (doc, isDeploy = false) => {
    if (!doc || !doc.documentElement) return "";
    const rawHtml = `<!DOCTYPE html>\n<html>\n${doc.documentElement.innerHTML}\n</html>`;
    let cleaned = rawHtml
      .replace(/<script[^>]*id="draggable-script"[\s\S]*?<\/script>/gi, "")
      .replace(/<style[^>]*id="draggable-styles"[\s\S]*?<\/style>/gi, "")
      .replace(/<div[^>]*class="genweb-drag-handle"[\s\S]*?<\/div>/gi, "")
      .replace(/<div[^>]*id="genweb-scroll-[^"]*"[\s\S]*?<\/div>/gi, "")
      .replace(/<base[^>]*target=["']_self["'][^>]*>/gi, "");

    if (isDeploy) {
      cleaned = cleaned.replace(/(<button[^>]*id=["']theme-toggle["'][^>]*)(>)/gi, '$1 style="display: none;"$2');
    } else {
      cleaned = cleaned.replace(/<button[^>]*id=["']theme-toggle["'][^>]*>[\s\S]*?<\/button>/gi, "");
    }

    // Strip internal drag helper classes and attributes
    cleaned = cleaned
      .replace(/genweb-draggable-item/g, "")
      .replace(/genweb-drag-over-[a-z]+/g, "")
      .replace(/genweb-dragging/g, "")
      .replace(/genweb-just-dropped/g, "")
      .replace(/\s*data-genweb-draggable="true"/g, "")
      .replace(/\s*draggable="true"/g, "");

    return cleaned;
  };

  const downloadHtmlContent = () => {
    const iframeDocument = iframeRef.current?.contentDocument || iframeRef.current?.contentWindow?.document;
    if (!iframeDocument) {
      console.error("Unable to access iframe content.");
      return;
    }

    const cleanedCode = getCleanedExportHTML(iframeDocument, false);

    const blob = new Blob([cleanedCode], { type: "text/html;charset=utf-8" });
    const downloadLink = document.createElement("a");
    downloadLink.href = URL.createObjectURL(blob);
    downloadLink.download = "index.html";

    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
    URL.revokeObjectURL(downloadLink.href);

    Swal.fire({
      icon: 'success',
      title: 'Downloaded index.html',
      text: 'Production HTML file downloaded and ready to deploy.',
      timer: 1600,
      showConfirmButton: false,
      background: '#121214',
      color: '#F4F4F5'
    });
  };

  const handleDeploySite = () => {
    const iframeDocument = iframeRef.current?.contentDocument || iframeRef.current?.contentWindow?.document;
    const cleanedCode = iframeDocument ? getCleanedExportHTML(iframeDocument, true) : (displayCodedeploy || "<!DOCTYPE html><html><body></body></html>");
    setDeployedCode(cleanedCode);

    const blob = new Blob([cleanedCode], { type: "text/html;charset=utf-8" });
    const livePreviewUrl = URL.createObjectURL(blob);

    Swal.fire({
      icon: 'success',
      title: '<div class="text-xl font-bold text-white">Website Ready to Deploy!</div>',
      html: `
        <div class="text-left text-zinc-300 text-sm space-y-4 pt-2">
          <p class="text-zinc-400">Your site is bundled and ready. You can test it in a standalone live tab or export the production package.</p>
          
          <div class="p-3 bg-zinc-800/80 border border-zinc-700/80 rounded-xl space-y-2">
            <div class="text-xs font-semibold text-indigo-400 uppercase tracking-wider">Quick Actions</div>
            <div class="flex flex-col sm:flex-row gap-2 pt-1">
              <a href="${livePreviewUrl}" target="_blank" rel="noopener noreferrer" 
                 class="inline-flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold transition shadow-md">
                🚀 Open Standalone Live Site
              </a>
              <button id="swal-download-btn"
                 class="inline-flex items-center justify-center gap-2 px-4 py-2 bg-zinc-700 hover:bg-zinc-600 text-white rounded-lg text-xs font-medium transition">
                📥 Download index.html
              </button>
            </div>
          </div>

          <div class="p-3 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-zinc-400 space-y-1.5">
            <span class="font-semibold text-zinc-200">Free 1-Click Hosting:</span>
            <p>Drag and drop the downloaded <code>index.html</code> to <strong class="text-indigo-300">Netlify Drop</strong> (netlify.com/drop) or upload to <strong class="text-indigo-300">Vercel</strong> / <strong class="text-indigo-300">GitHub Pages</strong> for permanent free hosting!</p>
          </div>
        </div>
      `,
      showCancelButton: true,
      cancelButtonText: 'Done',
      showConfirmButton: false,
      background: '#121214',
      color: '#F4F4F5',
      customClass: {
        popup: 'border border-zinc-800 rounded-2xl shadow-2xl max-w-lg',
      },
      didOpen: () => {
        document.getElementById('swal-download-btn')?.addEventListener('click', () => {
          downloadHtmlContent();
        });
      }
    });
  };

  const onActionBtn = (action) => {
    if (action === "deploy") {
      handleDeploySite();
      return;
    }
    if (setAction) {
      setAction({
        actionType: action,
        timeStamp: Date.now()
      });
    }
  };

  const draggableStyles = `
<style id="draggable-styles">
  html, body {
    overflow-y: auto !important;
    scroll-behavior: auto !important;
  }
  .genweb-draggable-item {
    position: relative !important;
    cursor: grab !important;
    transition: outline 0.15s ease, opacity 0.2s ease, box-shadow 0.2s ease !important;
  }
  .genweb-draggable-item:hover {
    outline: 2px dashed rgba(99, 102, 241, 0.5) !important;
    outline-offset: -2px !important;
  }
  .genweb-drag-handle {
    position: absolute !important;
    top: 8px !important;
    right: 12px !important;
    background: rgba(30, 27, 75, 0.9) !important;
    color: #c7d2fe !important;
    border: 1px solid rgba(129, 140, 248, 0.4) !important;
    border-radius: 9999px !important;
    padding: 3px 10px !important;
    font-size: 11px !important;
    font-family: system-ui, -apple-system, sans-serif !important;
    font-weight: 600 !important;
    display: inline-flex !important;
    align-items: center !important;
    gap: 4px !important;
    cursor: grab !important;
    z-index: 9999 !important;
    box-shadow: 0 2px 8px rgba(0,0,0,0.25) !important;
    opacity: 0.8 !important;
    transition: opacity 0.15s ease, transform 0.15s ease !important;
    user-select: none !important;
    pointer-events: none !important;
  }
  .genweb-draggable-item:hover .genweb-drag-handle {
    opacity: 1 !important;
    transform: scale(1.04) !important;
  }
  .genweb-draggable-item.genweb-dragging {
    opacity: 0.35 !important;
    outline: 3px dashed #6366f1 !important;
    outline-offset: -3px !important;
    cursor: grabbing !important;
    transform: scale(0.995) !important;
  }
  .genweb-drag-over-top {
    border-top: 4px solid #6366f1 !important;
    box-shadow: 0 -6px 16px rgba(99, 102, 241, 0.35) !important;
  }
  .genweb-drag-over-bottom {
    border-bottom: 4px solid #6366f1 !important;
    box-shadow: 0 6px 16px rgba(99, 102, 241, 0.35) !important;
  }
  .genweb-just-dropped {
    animation: genweb-drop-pulse 0.7s ease !important;
  }
  @keyframes genweb-drop-pulse {
    0% { outline: 3px solid #10b981; }
    50% { outline: 3px solid #6366f1; }
    100% { outline: none; }
  }
  .genweb-scroll-indicator {
    position: fixed;
    left: 50%;
    transform: translateX(-50%);
    padding: 7px 18px;
    background: rgba(15, 23, 42, 0.95);
    color: #a5b4fc;
    border: 1px solid rgba(99, 102, 241, 0.5);
    border-radius: 9999px;
    font-family: system-ui, -apple-system, sans-serif;
    font-size: 12px;
    font-weight: 600;
    pointer-events: all;
    z-index: 999999;
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.6);
    display: none;
    align-items: center;
    gap: 8px;
    letter-spacing: 0.02em;
    cursor: copy;
  }
  .genweb-scroll-indicator.active {
    display: flex;
    animation: pulse 1s infinite alternate;
  }
  #genweb-scroll-top-banner {
    top: 14px;
  }
  #genweb-scroll-bottom-banner {
    bottom: 14px;
  }
</style>
`;

  const draggableScript = `(function() {
    // Intercept all link clicks and form submits in capture phase so iframe never navigates or reloads
    document.addEventListener('click', function(e) {
      const link = e.target.closest('a, [data-page], .nav-route');
      if (link) {
        const href = (link.getAttribute('href') || '').trim();
        const targetPage = link.getAttribute('data-page') || link.dataset?.page;

        if (targetPage) {
          e.preventDefault();
          const targetEl = document.getElementById('page-' + targetPage) ||
                           document.getElementById(targetPage) ||
                           document.querySelector('[data-page="' + targetPage + '"]');
          if (targetEl) {
            document.querySelectorAll('.page-content, .page-view, .page').forEach(p => {
              p.classList.remove('active');
              p.style.display = 'none';
            });
            targetEl.classList.add('active');
            targetEl.style.display = 'block';
            targetEl.scrollIntoView({ behavior: 'smooth' });
          }
          return;
        }

        // 1. If it's a hash anchor (#section or #view)
        if (href.startsWith('#') && href.length > 1) {
          e.preventDefault();
          const targetId = href.slice(1);
          const targetEl = document.getElementById(targetId) || document.querySelector(href);
          if (targetEl) {
            const pageView = targetEl.closest('.page-view, .page, .page-content, [data-page]') || targetEl;
            if (pageView && (pageView.classList.contains('page-view') || pageView.classList.contains('page') || pageView.classList.contains('page-content'))) {
              document.querySelectorAll('.page-view, .page, .page-content').forEach(p => {
                p.classList.remove('active');
                p.style.display = 'none';
              });
              pageView.classList.add('active');
              pageView.style.display = 'block';
            }
            targetEl.scrollIntoView({ behavior: 'smooth' });
          }
          return;
        } 
        // 2. If it's a page link (e.g. 'products.html', '/products', 'about')
        else if (href && href !== '#' && !href.startsWith('http://') && !href.startsWith('https://') && !href.startsWith('javascript:')) {
          e.preventDefault();
          const pageName = href.replace(/^(\\/|\\.\\/)/, '').replace(/\\.html$/, '');
          const pageEl = document.getElementById(pageName) ||
                         document.getElementById('page-' + pageName) ||
                         document.getElementById(pageName + '-view') ||
                         document.getElementById(pageName + '-page');
          if (pageEl) {
            document.querySelectorAll('.page-view, .page, .page-content, [data-page]').forEach(p => {
              p.classList.remove('active');
              p.style.display = 'none';
            });
            pageEl.classList.add('active');
            pageEl.style.display = 'block';
            pageEl.scrollIntoView({ behavior: 'smooth' });
          }
          return;
        } else if (href === '#' || !href) {
          e.preventDefault();
        }
      }

      const formBtn = e.target.closest('button, input[type="submit"]');
      if (formBtn && (formBtn.type === 'submit' || formBtn.closest('form'))) {
        e.preventDefault();
      }
    }, true);

    document.addEventListener('submit', function(e) {
      e.preventDefault();
      return false;
    }, true);

    function initGenWebDragAndDrop() {
      if (!document.body) {
        window.addEventListener('DOMContentLoaded', initGenWebDragAndDrop);
        return;
      }

      // Ensure at least one section / page-view is visible if all are hidden
      try {
        const allPageViews = document.querySelectorAll('.page-content, .page-view, .page, [data-page]');
        if (allPageViews.length > 0) {
          const anyVisible = Array.from(allPageViews).some(p => {
            return p.classList.contains('active') || (p.style.display && p.style.display !== 'none');
          });
          if (!anyVisible) {
            allPageViews[0].classList.add('active');
            allPageViews[0].style.display = 'block';
          }
        }
      } catch(e) {}

      let isDragging = false;
      let currentPointerY = -1;
      let scrollAnimId = null;
      let currentDragged = null;
      let currentDropTarget = null;
      let dropPosition = 'after'; // 'before' | 'after'

      // Create scroll indicators if not present
      let topBanner = document.getElementById('genweb-scroll-top-banner');
      if (!topBanner) {
        topBanner = document.createElement('div');
        topBanner.id = 'genweb-scroll-top-banner';
        topBanner.className = 'genweb-scroll-indicator';
        topBanner.innerHTML = '▲ Scrolling Up... (Drop here for Top)';
        document.body.appendChild(topBanner);
      }
      let bottomBanner = document.getElementById('genweb-scroll-bottom-banner');
      if (!bottomBanner) {
        bottomBanner = document.createElement('div');
        bottomBanner.id = 'genweb-scroll-bottom-banner';
        bottomBanner.className = 'genweb-scroll-indicator';
        bottomBanner.innerHTML = '▼ Scrolling Down... (Drop here for Bottom)';
        document.body.appendChild(bottomBanner);
      }

      // Auto-scroll loop using requestAnimationFrame
      const SCROLL_ZONE = 130;
      const MAX_SPEED = 28;

      function autoScrollStep() {
        if (!isDragging) {
          if (topBanner) topBanner.classList.remove('active');
          if (bottomBanner) bottomBanner.classList.remove('active');
          return;
        }

        const viewportHeight = window.innerHeight;

        if (currentPointerY >= 0 && currentPointerY < SCROLL_ZONE) {
          const intensity = Math.max(0.2, (SCROLL_ZONE - currentPointerY) / SCROLL_ZONE);
          const speed = Math.ceil(intensity * MAX_SPEED);
          
          window.scrollBy(0, -speed);
          if (document.documentElement) document.documentElement.scrollTop -= speed;
          if (document.body) document.body.scrollTop -= speed;
          const rootLayout = document.getElementById('layout');
          if (rootLayout) rootLayout.scrollTop -= speed;

          if (topBanner) topBanner.classList.add('active');
          if (bottomBanner) bottomBanner.classList.remove('active');
        } else if (currentPointerY > viewportHeight - SCROLL_ZONE && currentPointerY <= viewportHeight + 60) {
          const intensity = Math.max(0.2, (currentPointerY - (viewportHeight - SCROLL_ZONE)) / SCROLL_ZONE);
          const speed = Math.ceil(intensity * MAX_SPEED);

          window.scrollBy(0, speed);
          if (document.documentElement) document.documentElement.scrollTop += speed;
          if (document.body) document.body.scrollTop += speed;
          const rootLayout = document.getElementById('layout');
          if (rootLayout) rootLayout.scrollTop += speed;

          if (bottomBanner) bottomBanner.classList.add('active');
          if (topBanner) topBanner.classList.remove('active');
        } else {
          if (topBanner) topBanner.classList.remove('active');
          if (bottomBanner) bottomBanner.classList.remove('active');
        }

        scrollAnimId = requestAnimationFrame(autoScrollStep);
      }

      function stopAutoScroll() {
        isDragging = false;
        currentPointerY = -1;
        if (scrollAnimId) {
          cancelAnimationFrame(scrollAnimId);
          scrollAnimId = null;
        }
        if (topBanner) topBanner.classList.remove('active');
        if (bottomBanner) bottomBanner.classList.remove('active');
        document.querySelectorAll('.genweb-drag-over-top, .genweb-drag-over-bottom').forEach(el => {
          el.classList.remove('genweb-drag-over-top', 'genweb-drag-over-bottom');
        });
        document.querySelectorAll('.genweb-dragging').forEach(el => {
          el.classList.remove('genweb-dragging');
        });
        currentDragged = null;
        currentDropTarget = null;
      }

      function notifyParentOfDomChange() {
        try {
          const clone = document.documentElement.cloneNode(true);
          clone.querySelectorAll('#draggable-script, #draggable-styles, .genweb-scroll-indicator, .genweb-drag-handle').forEach(el => el.remove());
          clone.querySelectorAll('.genweb-draggable-item').forEach(el => {
            el.classList.remove('genweb-draggable-item', 'genweb-dragging', 'genweb-drag-over-top', 'genweb-drag-over-bottom', 'genweb-just-dropped');
            el.removeAttribute('draggable');
            el.removeAttribute('data-genweb-draggable');
          });
          const cleanBody = clone.querySelector('body')?.innerHTML || '';
          window.parent.postMessage({
            type: 'GENWEB_SECTION_REORDERED',
            bodyHtml: cleanBody
          }, '*');
        } catch(err) {
          console.warn('Could not postMessage to parent:', err);
        }
      }

      function handleDropExecution(e) {
        if (e) {
          e.preventDefault();
          e.stopPropagation();
        }
        if (currentDragged && currentDropTarget && currentDragged !== currentDropTarget) {
          if (dropPosition === 'before') {
            currentDropTarget.before(currentDragged);
          } else if (dropPosition === 'after') {
            currentDropTarget.after(currentDragged);
          }
          currentDragged.classList.add('genweb-just-dropped');
          setTimeout(() => {
            currentDragged.classList.remove('genweb-just-dropped');
          }, 800);
          notifyParentOfDomChange();
        }
        stopAutoScroll();
      }

      topBanner.addEventListener('dragover', (e) => {
        e.preventDefault();
        currentPointerY = e.clientY;
        const draggables = Array.from(document.querySelectorAll('.genweb-draggable-item')).filter(el => el !== currentDragged);
        if (draggables.length > 0) {
          document.querySelectorAll('.genweb-drag-over-top, .genweb-drag-over-bottom').forEach(el => el.classList.remove('genweb-drag-over-top', 'genweb-drag-over-bottom'));
          draggables[0].classList.add('genweb-drag-over-top');
          currentDropTarget = draggables[0];
          dropPosition = 'before';
        }
      });

      bottomBanner.addEventListener('dragover', (e) => {
        e.preventDefault();
        currentPointerY = e.clientY;
        const draggables = Array.from(document.querySelectorAll('.genweb-draggable-item')).filter(el => el !== currentDragged);
        if (draggables.length > 0) {
          document.querySelectorAll('.genweb-drag-over-top, .genweb-drag-over-bottom').forEach(el => el.classList.remove('genweb-drag-over-top', 'genweb-drag-over-bottom'));
          const lastEl = draggables[draggables.length - 1];
          lastEl.classList.add('genweb-drag-over-bottom');
          currentDropTarget = lastEl;
          dropPosition = 'after';
        }
      });

      topBanner.addEventListener('drop', handleDropExecution);
      bottomBanner.addEventListener('drop', handleDropExecution);

      window.addEventListener('dragover', (e) => {
        e.preventDefault();
        currentPointerY = e.clientY;
      });

      document.addEventListener('dragover', (e) => {
        e.preventDefault();
        currentPointerY = e.clientY;
      });

      document.addEventListener('dragend', stopAutoScroll);
      window.addEventListener('dragend', stopAutoScroll);
      document.addEventListener('drop', handleDropExecution);

      function initializeDraggable(element) {
        if (!element || 
            element.hasAttribute('data-genweb-draggable') ||
            element.id === 'theme-toggle' || 
            element.id === 'genweb-scroll-top-banner' || 
            element.id === 'genweb-scroll-bottom-banner' || 
            element.tagName === 'SCRIPT' || 
            element.tagName === 'STYLE') return;

        element.setAttribute('data-genweb-draggable', 'true');
        element.setAttribute('draggable', 'true');
        element.classList.add('genweb-draggable-item');

        if (!element.querySelector('.genweb-drag-handle')) {
          const handle = document.createElement('div');
          handle.className = 'genweb-drag-handle';
          handle.innerHTML = '<span>⠿</span> Reorder';
          element.appendChild(handle);
        }

        element.addEventListener('dragstart', (e) => {  
          const interactive = e.target.closest('button, a, input, textarea, select, [contenteditable="true"]');
          if (interactive && !interactive.classList.contains('genweb-drag-handle')) {
            e.preventDefault();
            return;
          }
          e.stopPropagation(); 
          try { e.dataTransfer.setData('text/plain', element.id || 'drag-section'); } catch(err){}
          e.dataTransfer.effectAllowed = 'move';
          element.classList.add('genweb-dragging');
          currentDragged = element;
          isDragging = true;
          currentPointerY = e.clientY;
          if (!scrollAnimId) {
            scrollAnimId = requestAnimationFrame(autoScrollStep);
          }
        });

        element.addEventListener('drag', (e) => {
          if (e.clientY && e.clientY > 0) {
            currentPointerY = e.clientY;
          }
        });

        element.addEventListener('dragend', stopAutoScroll);

        element.addEventListener('dragover', (e) => {
          e.preventDefault();
          e.stopPropagation();
          currentPointerY = e.clientY;

          if (!currentDragged || currentDragged === element || currentDragged.contains(element)) return;

          const bounding = element.getBoundingClientRect();
          const offset = e.clientY - bounding.top;
          const dimension = bounding.height;

          document.querySelectorAll('.genweb-drag-over-top, .genweb-drag-over-bottom').forEach(el => {
            if (el !== element) el.classList.remove('genweb-drag-over-top', 'genweb-drag-over-bottom');
          });

          if (offset > dimension / 2) {
            element.classList.remove('genweb-drag-over-top');
            element.classList.add('genweb-drag-over-bottom');
            currentDropTarget = element;
            dropPosition = 'after';
          } else {
            element.classList.remove('genweb-drag-over-bottom');
            element.classList.add('genweb-drag-over-top');
            currentDropTarget = element;
            dropPosition = 'before';
          }
        });

        element.addEventListener('dragleave', (e) => {
          if (!element.contains(e.relatedTarget)) {
            element.classList.remove('genweb-drag-over-top', 'genweb-drag-over-bottom');
          }
        });

        element.addEventListener('drop', (e) => {
          e.preventDefault();
          e.stopPropagation();
          handleDropExecution(e);
        });
      }

      function refreshDraggables() {
        if (!document.body) return;
        const rootContainer = document.getElementById('layout') || document.body;
        let sections = [];
        if (rootContainer.id === 'layout' && rootContainer.children.length > 1) {
          sections = Array.from(rootContainer.children);
        } else {
          sections = Array.from(document.querySelectorAll('#layout > *, main > *, header, section, footer, article, .draggable'));
          if (sections.length === 0 && document.body) {
            sections = Array.from(document.body.children);
          }
        }

        const uniqueItems = Array.from(new Set(sections)).filter(el => {
          return el &&
            el.nodeType === 1 &&
            !['SCRIPT', 'STYLE', 'NOSCRIPT', 'TEMPLATE', 'BASE'].includes(el.tagName) &&
            el.id !== 'theme-toggle' &&
            !el.id?.startsWith('genweb-') &&
            !el.classList.contains('genweb-scroll-indicator');
        });

        uniqueItems.forEach(el => initializeDraggable(el));
      }

      refreshDraggables();

      try {
        const observer = new MutationObserver(() => {
          refreshDraggables();
        });
        const obsTarget = document.getElementById('layout') || document.body;
        if (obsTarget) {
          observer.observe(obsTarget, { childList: true, subtree: false });
        }
      } catch(err) {}
    }

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initGenWebDragAndDrop);
    } else {
      initGenWebDragAndDrop();
    }
  })();`;

  function injectContentIntoHTML(htmlCode, cssCode, jsCode, dragScript, dragStyles) {
    let cleanHtml = htmlCode || "";
    let cleanCss = cssCode || "";
    let cleanJs = jsCode || "";

    const lower = cleanHtml.toLowerCase();
    if (!lower.includes('</head>') || !lower.includes('</body>')) {
      cleanHtml = `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <base target="_self">
    <title>Generated Page</title>
</head>
<body>
    ${cleanHtml}
</body>
</html>`;
    }

    // Ensure <base target="_self"> is in <head> to prevent target="_top" or navigation escape
    if (!cleanHtml.includes('<base')) {
      const headOpenIndex = cleanHtml.toLowerCase().indexOf('<head>');
      if (headOpenIndex !== -1) {
        cleanHtml = cleanHtml.slice(0, headOpenIndex + 6) + '\n<base target="_self">\n' + cleanHtml.slice(headOpenIndex + 6);
      }
    }

    // Inject Font Awesome CDN if not already in HTML
    if (!cleanHtml.includes('font-awesome') && !cleanHtml.includes('fontawesome')) {
      const headOpenIndex = cleanHtml.toLowerCase().indexOf('<head>');
      if (headOpenIndex !== -1) {
        cleanHtml = cleanHtml.slice(0, headOpenIndex + 6) + '\n<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">\n' + cleanHtml.slice(headOpenIndex + 6);
      }
    }

    // Inject CSS & draggable styles into head
    const headCloseIndex = cleanHtml.toLowerCase().indexOf('</head>');
    const styleTag = `<style>\n${cleanCss}\n</style>\n` + (dragStyles || '');
    if (headCloseIndex !== -1) {
      cleanHtml = cleanHtml.slice(0, headCloseIndex) + styleTag + cleanHtml.slice(headCloseIndex);
    } else {
      cleanHtml = styleTag + cleanHtml;
    }

    // Inject JavaScript & draggable script just before closing body tag
    const scriptTag = `<script>\n${cleanJs}\n</script>\n`;
    const draggable = dragScript ? `<script id="draggable-script">\n${dragScript}\n</script>\n` : '';
    const scripts = `${draggable}\n${scriptTag}`;
    const bodyCloseIndex = cleanHtml.toLowerCase().lastIndexOf('</body>');
    if (bodyCloseIndex !== -1) {
      cleanHtml = cleanHtml.slice(0, bodyCloseIndex) + scripts + cleanHtml.slice(bodyCloseIndex);
    } else {
      cleanHtml += scripts;
    }

    return cleanHtml;
  }

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
          currentCode: {
            html: generatedHTML,
            css: generatedCSS,
            js: generatedJS
          }
        })
      });

      const data = await response.json();
      console.log('Response from backend:', data);

      if (data.error) {
        throw new Error(data.details || data.error);
      }

      const text = data?.content?.[0]?.text;
      if (!text) {
        throw new Error("No response received from AI backend");
      }

      const object_data = safeExtractCode(text) || {};

      setAimessage((prevMessages) => [...prevMessages, object_data.explanation || "Website generated successfully!"]);
      if (object_data.explanation) setGeneratedText(object_data.explanation);
      if (object_data.html && object_data.html.trim()) setGeneratedHTML(object_data.html);
      if (object_data.css) setGeneratedCSS(object_data.css);
      if (object_data.js) setGeneratedJS(object_data.js);

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

  const getAIResponse = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${BACKEND_URL}chat/getchat/${projectid}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      const data = await response.json();
      const chats = data.chats || [];
      if (chats.length > 0) {
        let latest_code = null;
        for (let i = chats.length - 1; i >= 0; i--) {
          const parsed = safeExtractCode(chats[i].airesponse);
          if (parsed && (parsed.html || (parsed.files && Object.keys(parsed.files).length > 0))) {
            latest_code = parsed;
            break;
          }
        }

        if (latest_code && latest_code.files && !latest_code.html) {
          console.log("[GenWeb Studio] Chats contain React code. Redirecting to /main/react/" + projectid);
          window.location.replace(`/main/react/${projectid}`);
          return;
        }

        if (latest_code && latest_code.html) {
          setGeneratedText(latest_code.explanation || "");
          setGeneratedHTML(latest_code.html);
          setGeneratedCSS(latest_code.css || "");
          setGeneratedJS(latest_code.js || "");
        }

        setUserprompts(chats.map((element) => element.userprompt));
        setAimessage(chats.map((element) => element.text));
        setUserpromptsTiming(chats.map((element) => element.time));
        setLoading(false);
      } else {
        // No previous chat, check if an initial prompt is waiting in localStorage
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
              await executePrompt(projData.description.trim());
              return;
            }
          }
        } catch (descErr) {
          console.warn("Could not check project description for auto-generation:", descErr);
        }

        setLoading(false);
      }
    } catch (e) {
      console.log("No previous chat history in backend", e);
      setLoading(false);
    }
  };

  useEffect(() => {
    getAIResponse();
  }, [projectid]);


  const displayCode = injectContentIntoHTML(generatedHTML, generatedCSS, generatedJS, draggableScript, draggableStyles);
  const displayCodedeploy = injectContentIntoHTML(generatedHTML, generatedCSS, generatedJS);
  const downloadableCode = injectContentIntoHTML(generatedHTML, generatedCSS, generatedJS);
  console.log("This is the code that will be given to the iframe:", displayCode);

  const handleViewPreview = () => {
    setShowCode(false);
  };

  const handleViewCode = () => {
    setShowCode(true);
    setTimeout(highlightCode, 50);
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
        window.location.href = `/main/plain/${data.project._id}`;
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
      {/* Left Panel - Fixed on left side for desktop */}
      <div className="w-full md:w-[42%] lg:w-[38%] h-[48vh] md:h-screen p-3 md:p-5 border-b md:border-b-0 md:border-r border-gray-700 bg-gray-900 flex flex-col shrink-0">
        {/* Previous Prompts Section - Adjusted height for mobile */}
        <div className="flex-grow h-[65%] md:h-[70%] overflow-y-scroll p-2 md:p-3 mb-4 rounded-lg bg-gradient-to-br from-[#1A1A2E] to-[#0F3460] border border-indigo-400/20 shadow-2xl shadow-black/40">
          <div className="flex justify-between items-center mb-2">
            <div className="flex gap-2 text-lg md:text-xl font-semibold items-center">
              <div>
                <FontAwesomeIcon icon={faBarsStaggered} />
              </div>
              <div>Response History</div>
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
              {/* User Prompt - Adjusted for better mobile display */}
              <div className="relative flex justify-end max-h-40 md:max-h-52 mt-3">
              <div className="bg-indigo-500 text-white px-3 md:px-4 py-2 rounded-lg max-w-[90%] md:max-w-[80%] overflow-y-auto text-sm md:text-base">
                {prompt}
              </div>
              <div className='absolute bottom-[-20px] right-0 text-xs text-gray-300'>
                {userpromptsTiming[index] || finalOutput}
              </div>
              </div>

              {/* AI Response - Adjusted for better mobile display */}
              {aimessage[index] && (
                <div className="flex justify-start max-h-40 md:max-h-52 mt-3">
                  <div className="bg-gray-700 text-white px-3 md:px-4 py-2 rounded-lg max-w-[90%] md:max-w-[80%] overflow-y-auto text-sm md:text-base">
                    {aimessage[index]}
                  </div>
                </div>
              )}
            </div>
          ))}
          {loading && <GenerationChatCard tracker={generationTracker} />}
          <div ref={chatEndRef} />
        </div>

        {/* Input Area - Adjusted for mobile */}
        <div className="flex flex-col items-end w-full h-[35%] md:h-[30%] bg-gray-800 border border-gray-600 rounded-lg p-2">
          <textarea
            id="prompt-area"
            className="w-full h-[75%] md:h-[75%] p-2 md:p-3 bg-gray-800 rounded-lg text-white placeholder-gray-400 focus:outline-none resize-none text-sm md:text-base"
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
      <div className="w-full md:w-[58%] lg:w-[62%] h-[52vh] md:h-screen flex flex-col bg-gray-900 grow overflow-hidden">
        {/* Navigation Tabs - Fully responsive and bounded */}
        <nav className="flex flex-wrap sm:flex-nowrap justify-between items-center px-2.5 sm:px-4 py-2 border-b border-gray-800 bg-gray-900 min-h-[54px] h-auto gap-2 shrink-0 z-20">
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => window.location.href = '/'}
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-full bg-gray-800 hover:bg-gray-700 text-gray-200 hover:text-white border border-gray-600/70 text-xs md:text-sm font-medium transition shadow-sm cursor-pointer"
              title="Return to Dashboard"
            >
              <FontAwesomeIcon icon={faArrowLeft} className="text-xs" />
              <span className="hidden sm:inline">Dashboard</span>
            </button>
            <div className="bg-gray-900 inline-flex rounded-full p-1 transition-colors duration-300 border border-gray-200/50">
            <button
              type="button"
              className={`flex items-center rounded-full px-3 py-1.5 text-xs md:text-sm font-medium transition-all duration-300 ${!showCode ? "bg-white text-gray-900 shadow-lg font-semibold" : "bg-gray-800 text-gray-300 hover:text-white"}`}
              onClick={handleViewPreview}
              aria-pressed={!showCode}
            >
              <FontAwesomeIcon
                icon={faWindowMaximize}
                className="mr-1.5 text-xs md:text-sm text-indigo-500"
              />
              <span>Preview</span>
            </button>

            <button
              type="button"
              className={`flex items-center rounded-full px-3 py-1.5 text-xs md:text-sm font-medium transition-all duration-300 ${showCode ? "bg-white text-gray-900 shadow-lg font-semibold" : "bg-gray-800 text-gray-300 hover:text-white"}`}
              onClick={handleViewCode}
              aria-pressed={showCode}
            >
              <FontAwesomeIcon
                icon={faCode}
                className="mr-1.5 text-xs md:text-sm text-indigo-500"
              />
              <span>Code</span>
            </button>
            </div>
          </div>

          {/* Action Buttons - Clean, responsive, and bounded */}
          {
            userIsOwner ? (
            <div className="flex items-center gap-2 shrink-0">
              <button 
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-100 border border-zinc-700 hover:border-zinc-600 text-xs sm:text-sm font-medium transition shadow-sm"
                onClick={downloadHtmlContent}
                title="Download HTML package"
              >
                <FontAwesomeIcon icon={faFileArrowDown} className="text-emerald-400 text-xs sm:text-sm" />
                <span>Download</span>
              </button>

              <button 
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white border border-indigo-500 text-xs sm:text-sm font-semibold transition shadow-md shadow-indigo-600/30"
                onClick={handleDeploySite}
                title="Deploy website"
              >
                <FontAwesomeIcon icon={faRocket} className="text-white text-xs sm:text-sm" />
                <span>Deploy</span>
              </button>
            </div>
            ) : (
              <div className="flex items-center gap-2 shrink-0">
                <button 
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-100 border border-zinc-700 text-xs sm:text-sm font-medium transition shadow-sm"
                  onClick={copyProject}
                >
                  <FontAwesomeIcon icon={faCopy} className="text-indigo-400 text-xs sm:text-sm" />
                  <span>Copy</span>
                </button>
              </div>
            )
          }
        </nav>

        {/* Content Area - Adjusted for mobile */}
        <div className="flex-grow p-2 md:p-4 h-[88%] md:h-[90%] bg-gray-900 relative">
          {loading && <GenerationPreviewOverlay tracker={generationTracker} />}
          {showCode ? (
            <div className="box-border h-full">
              <nav className="flex justify-start items-center space-x-1 md:space-x-2 mb-2">
                <button
                  className={`font-semibold inline-flex items-center justify-center p-1 md:p-2 border-transparent rounded-t-lg hover:border-gray-300 min-w-8 md:min-w-12 group text-xs md:text-base ${fileName === "html" ? "bg-orange-600 text-white" : "text-orange-600"} border border-blue-600`}
                  onClick={() => handleClick("html")}
                >
                  <FontAwesomeIcon icon={faHtml5} className="h-5 w-5 md:h-7 md:w-7 mx-1 md:mx-2" /> HTML
                </button>
                <button
                  className={`font-semibold inline-flex items-center justify-center p-1 md:p-2 border-transparent rounded-t-lg hover:border-gray-300 min-w-8 md:min-w-12 group text-xs md:text-base ${fileName === "css" ? "bg-[#2965f1] text-white" : "text-[#2965f1]"} border border-blue-600`}
                  onClick={() => handleClick("css")}
                >
                  <FontAwesomeIcon icon={faCss3Alt} className="h-5 w-5 md:h-7 md:w-7 mx-1 md:mx-2" /> CSS
                </button>
                <button
                  className={`font-semibold inline-flex items-center justify-center p-1 md:p-2 border-transparent rounded-t-lg hover:border-gray-300 min-w-8 md:min-w-12 group text-xs md:text-base ${fileName === "js" ? "bg-[#f2db3d] text-white" : "text-[#f2db3d]"} border border-blue-600`}
                  onClick={() => handleClick("js")}
                >
                  <FontAwesomeIcon icon={faSquareJs} className="h-5 w-5 md:h-7 md:w-7 mx-1 md:mx-2" /> JS
                </button>
              </nav>
              <pre className="w-full h-[90%] p-2 m-0 border border-gray-600 rounded-lg bg-gray-800 text-white overflow-scroll text-sm md:text-base">
                <code className={`language-${fileName === "html" ? "markup" : fileName === "css" ? "css" : "javascript"}`}>
                  {fileName === "html" ? generatedHTML : fileName === "css" ? generatedCSS : generatedJS}
                </code>
              </pre>
            </div>
          ) : (
            <div className="w-full h-full relative overflow-hidden bg-white rounded-lg shadow-2xl border border-gray-700">
              <iframe
                key={projectid || 'preview'}
                ref={iframeRef}
                srcDoc={displayCode}
                title="Website Live Preview"
                className="w-full h-full border-0 bg-white"
              />
            </div>
          )}
          <div className="hidden">
            <SandpackProvider
              template="react"
              files={{
                "public/index.html": {
                  code: displayCodedeploy || "<!DOCTYPE html><html><body></body></html>",
                  active: true
                },
                "/index.js": {
                  code: "",
                  active: true
                }

              }}
              options={{
                showNavigator: true,
                showLineNumbers: true,
                closableTabs: true,
                activeFile: "/index.html",
              }}
            >
              <SandpackLayout className="h-full bg-gray-900">
                <SandpackPreviewClient2 />
              </SandpackLayout>
            </SandpackProvider>
          </div>
        </div>
      </div>
    </div>
  );

};
export default MainPagePlain;
