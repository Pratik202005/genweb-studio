const Project = require('../models/projectModel');
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

// Helper to generate free contextual images via Pollinations AI
const fetchNewImageSrc = async (altText) => {
  const cleanAlt = encodeURIComponent(
    (altText || "modern website design")
      .replace(/[^a-zA-Z0-9 ]/g, "")
      .trim() || "modern web design"
  );
  return `https://image.pollinations.ai/prompt/${cleanAlt}?width=1024&height=768&nologo=true`;
};

const cleanPreviousCode = (rawHtml) => {
  if (!rawHtml) return "";
  return rawHtml
    .replace(/<script[^>]*id="draggable-script"[\s\S]*?<\/script>/gi, "")
    .replace(/<style[^>]*id="draggable-styles"[\s\S]*?<\/style>/gi, "")
    .replace(/<div[^>]*id="genweb-scroll-[^"]*"[\s\S]*?<\/div>/gi, "")
    .replace(/<base[^>]*target=["']_self["'][^>]*>/gi, "")
    .replace(/genweb-draggable-item/g, "")
    .replace(/genweb-drag-over-[a-z]+/g, "")
    .replace(/dragging/g, "");
};

const replaceImageSrc = async (html) => {
  if (!html) return html;
  const imgTagRegex = /<img[^>]+src=["']([^"']+)["'][^>]*>/g;
  const matches = Array.from(html.matchAll(imgTagRegex));

  for (const match of matches) {
    const currentSrc = match[1] || "";
    // If it's already a valid external photo URL, do not overwrite it
    if (
      (currentSrc.startsWith("https://images.unsplash.com") ||
       currentSrc.startsWith("https://image.pollinations.ai")) &&
      !currentSrc.includes("placeholder")
    ) {
      continue;
    }

    const altMatch = match[0].match(/alt="([^"]*)"/);
    const altText = altMatch ? altMatch[1] : "modern website image";
    const newSrc = await fetchNewImageSrc(altText);
    html = html.replace(match[0], match[0].replace(/src="[^"]+"/, `src="${newSrc}"`));
  }
  return html;
};

// Robust JSON parser for LLM outputs with multi-stage recovery
function safeParseAIResponse(rawText) {
  if (!rawText || typeof rawText !== "string") {
    throw new Error("Empty response received from AI model");
  }

  // 1. Strip markdown code fence wrappers
  let text = rawText.trim();
  text = text.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "").trim();

  // Find outermost JSON object
  const firstBrace = text.indexOf("{");
  const lastBrace = text.lastIndexOf("}");
  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    text = text.slice(firstBrace, lastBrace + 1);
  }

  // 2. Direct JSON.parse
  try {
    return JSON.parse(text);
  } catch (err1) {
    console.warn("[GenWeb AI] Direct JSON.parse failed, initiating recovery:", err1.message);
  }

  // 3. Try sanitizing illegal control characters (raw newlines and tabs inside strings)
  try {
    const sanitized = text.replace(/[\x00-\x1F\x7F-\x9F]/g, (c) => {
      if (c === "\n") return "\\n";
      if (c === "\r") return "\\r";
      if (c === "\t") return "\\t";
      return "";
    });
    return JSON.parse(sanitized);
  } catch (err2) {}

  // 4. Specialized boundary extraction for HTML/CSS/JS (Plain website format)
  try {
    const extractField = (fieldName, nextFields) => {
      const regexStart = new RegExp(`"${fieldName}"\\s*:\\s*"`, "i");
      const startMatch = text.match(regexStart);
      if (!startMatch) return null;

      const startIndex = startMatch.index + startMatch[0].length;
      const nextPattern = new RegExp(`",\\s*"(?:${nextFields.join("|")})"\\s*:|"\\s*}\\s*$`, "i");
      const remaining = text.slice(startIndex);
      const endMatch = remaining.match(nextPattern);

      let endIndex = -1;
      if (endMatch) {
        endIndex = startIndex + endMatch.index;
      } else {
        endIndex = text.lastIndexOf('"');
      }

      if (endIndex > startIndex) {
        const rawVal = text.slice(startIndex, endIndex);
        return rawVal
          .replace(/\\"/g, '"')
          .replace(/\\n/g, '\n')
          .replace(/\\r/g, '')
          .replace(/\\t/g, '\t')
          .replace(/\\\\/g, '\\');
      }
      return null;
    };

    const htmlVal = extractField("html", ["css", "js", "explanation"]);
    const cssVal = extractField("css", ["js", "explanation", "html"]);
    const jsVal = extractField("js", ["explanation", "html", "css"]);
    const expVal = extractField("explanation", ["html", "css", "js"]);

    if (htmlVal !== null || cssVal !== null || jsVal !== null) {
      console.log("[GenWeb AI] Successfully recovered website code via structured boundary extraction!");
      return {
        html: htmlVal || "",
        css: cssVal || "",
        js: jsVal || "",
        explanation: expVal || "Website updated successfully"
      };
    }
  } catch (err3) {
    console.warn("[GenWeb AI] Boundary extraction failed:", err3.message);
  }

  // 5. Specialized extraction for React project format ({ files, projectTitle, ... })
  try {
    const filesMatch = text.match(/"files"\s*:\s*(\{[\s\S]*?\})\s*,\s*"(?:entryFilePath|projectTitle|explanation)"/i) ||
                       text.match(/"files"\s*:\s*(\{[\s\S]*?\})\s*\}/i);
    if (filesMatch) {
      let parsedFiles = null;
      try {
        parsedFiles = JSON.parse(filesMatch[1]);
      } catch (fe) {}

      if (parsedFiles) {
        return {
          projectTitle: "React App",
          explanation: "Generated React project",
          files: parsedFiles,
          entryFilePath: "/App.js",
          generatedFiles: Object.keys(parsedFiles)
        };
      }
    }
  } catch (err4) {
    console.warn("[GenWeb AI] React files recovery failed:", err4.message);
  }

  // 6. Attribute quote recovery: replace unescaped quotes inside HTML tags
  try {
    const quoteRepaired = text.replace(/<[^>]+>/g, (tag) => {
      return tag.replace(/=(["])(.*?)\1/g, "='$2'");
    });
    return JSON.parse(quoteRepaired);
  } catch (err5) {}

  throw new Error("Unable to parse AI response into valid JSON. Please try again with a simpler prompt.");
}

// 1. Interactions API (recommended standard for Gemini 3.x models)
async function callInteractionsAPI(apiKey, modelName, systemInstruction, userPrompt) {
  const fullPrompt = `${systemInstruction}\n\nUser Prompt / Requirements:\n${userPrompt}`;
  const url = `https://generativelanguage.googleapis.com/v1beta/interactions?key=${encodeURIComponent(apiKey)}`;

  const payload = {
    model: modelName,
    input: fullPrompt
  };

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-goog-api-key": apiKey,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Interactions API [${modelName}] ${response.status}: ${errorText}`);
  }

  const data = await response.json();

  if (data?.output_text) return data.output_text;
  if (Array.isArray(data?.steps)) {
    for (const step of data.steps) {
      if (step?.type === "model_output" && Array.isArray(step?.content)) {
        const textItem = step.content.find(c => c?.type === "text" || c?.text);
        if (textItem?.text) return textItem.text;
      }
    }
  }
  if (Array.isArray(data?.outputs)) {
    for (const out of data.outputs) {
      if (typeof out?.data === "string") return out.data;
      if (out?.text) return out.text;
    }
  }
  if (data?.candidates?.[0]?.content?.parts?.[0]?.text) {
    return data.candidates[0].content.parts[0].text;
  }

  throw new Error("Interactions API response missing text: " + JSON.stringify(data).slice(0, 150));
}

// 2. Discover available models for this specific API key
async function discoverModels(apiKey) {
  const candidateModels = new Set(["gemini-3.8-flash"]);
  try {
    for (const ver of ["v1beta", "v1"]) {
      const res = await fetch(`https://generativelanguage.googleapis.com/${ver}/models?key=${encodeURIComponent(apiKey)}`, {
        headers: { "x-goog-api-key": apiKey }
      });
      if (res.ok) {
        const data = await res.json();
        const models = data.models || [];
        console.log(`[GenWeb AI] Models listed by ${ver}:`, models.map(m => m.name));
        for (const m of models) {
          const clean = m.name.replace(/^models\//, "");
          candidateModels.add(clean);
        }
      } else {
        const errText = await res.text();
        console.warn(`[GenWeb AI] ListModels (${ver}) returned ${res.status}:`, errText);
      }
    }
  } catch (e) {
    console.warn("[GenWeb AI] Model discovery network warning:", e.message);
  }

  if (candidateModels.size === 1) {
    candidateModels.add("gemini-2.5-flash");
    candidateModels.add("gemini-3-flash");
    candidateModels.add("gemini-1.5-flash-latest");
    candidateModels.add("gemini-1.5-pro-latest");
  }

  const nonTextKeywords = ["tts", "audio", "image", "embed", "transcribe", "clip", "veo", "robotics", "aqa", "banana", "customtools", "computer-use"];

  // Filter only models capable of text/code generation
  const textModels = Array.from(candidateModels).filter(name => {
    const lower = name.toLowerCase();
    return !nonTextKeywords.some(keyword => lower.includes(keyword));
  });

  // Prioritize proven fast and reliable models first (gemini-3.5-flash-lite is active and ultra-fast)
  const preferredPriority = [
    "gemini-3.5-flash-lite",
    "gemini-3.5-flash",
    "gemini-flash-lite-latest",
    "gemini-3.1-flash-lite",
    "gemini-3.8-flash",
    "gemini-3.7-flash",
    "gemini-3.6-flash",
    "gemini-flash-latest",
    "gemini-pro-latest"
  ];

  const sorted = textModels.sort((a, b) => {
    const aIndex = preferredPriority.indexOf(a);
    const bIndex = preferredPriority.indexOf(b);
    if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex;
    if (aIndex !== -1) return -1;
    if (bIndex !== -1) return 1;
    return 0;
  });

  console.log("[GenWeb AI] Prioritized text models to try:", sorted);
  return sorted;
}

// 3. Call Google Gemini with automatic fallbacks
async function callGeminiAPI(systemInstruction, userPrompt) {
  const rawKey = process.env.GEMINI_API_KEY || "";
  const apiKey = rawKey.replace(/^["']|["']$/g, "").trim();

  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not defined in backend .env file");
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const models = await discoverModels(apiKey);
  let lastError = null;

  for (const modelName of models) {
    // 1. Try direct REST generateContent endpoint (v1beta and v1)
    for (const ver of ["v1beta", "v1"]) {
      try {
        console.log(`[GenWeb AI] Trying REST generateContent ${ver} (${modelName})...`);
        const url = `https://generativelanguage.googleapis.com/${ver}/models/${modelName}:generateContent?key=${encodeURIComponent(apiKey)}`;
        const payload = {
          systemInstruction: { parts: [{ text: systemInstruction }] },
          contents: [{ role: "user", parts: [{ text: userPrompt }] }],
          generationConfig: { responseMimeType: "application/json", temperature: 0.2 },
        };

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 28000);

        const response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-goog-api-key": apiKey,
          },
          body: JSON.stringify(payload),
          signal: controller.signal
        });
        clearTimeout(timeoutId);

        if (response.ok) {
          const data = await response.json();
          const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
          if (text) {
            console.log(`[GenWeb AI] Success via REST ${ver} (${modelName})!`);
            return text;
          }
        } else {
          const errText = await response.text();
          console.warn(`[GenWeb AI] REST ${ver} (${modelName}) returned ${response.status}:`, errText.slice(0, 100));
          lastError = new Error(`Google API [${ver}/${modelName}]: ${response.status} - ${errText.slice(0, 80)}`);
        }
      } catch (restErr) {
        console.warn(`[GenWeb AI] REST ${ver} (${modelName}) error:`, restErr.message);
        lastError = restErr;
      }
    }

    // 2. Try SDK fallback
    try {
      console.log(`[GenWeb AI] Trying SDK fallback (${modelName})...`);
      const model = genAI.getGenerativeModel({
        model: modelName,
        systemInstruction: systemInstruction,
        generationConfig: {
          responseMimeType: "application/json",
          temperature: 0.2,
        },
      });

      const result = await model.generateContent(userPrompt);
      const text = result?.response?.text();
      if (text) {
        console.log(`[GenWeb AI] Success via SDK (${modelName})!`);
        return text;
      }
    } catch (sdkErr) {
      console.warn(`[GenWeb AI] SDK (${modelName}) failed:`, sdkErr.message);
      lastError = sdkErr;
    }
  }

  throw lastError || new Error("Failed to generate content with available Gemini models");
}

exports.chat = async (req, res) => {
  const projectId = req.params.pid;
  let project = null;
  if (projectId && !String(projectId).startsWith('dummy-')) {
    try {
      project = await Project.findById(projectId);
    } catch (err) {}
    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }
  } else {
    project = { _id: projectId, chats: [], isShowcase: true, save: async () => {} };
  }

  const isAuth =
    (typeof req.isAuthenticated === 'function' && req.isAuthenticated()) ||
    !!req.session?.user ||
    !!req.user ||
    !!project; // Allow active project workspace generation

  if (!isAuth) {
    return res.status(401).json({ error: "Not Authorized" });
  }

  const userPrompt = req.body.message;
  const frontendRoute = req.body.route;

  // Retrieve previous website state and chat history for incremental editing
  let previousWebsite = null;

  // 1. Check if client sent currentCode (fresh from active browser editor)
  if (req.body.currentCode) {
    const c = req.body.currentCode;
    if (typeof c === "object") {
      if (c.html && typeof c.html === "string" && !c.html.includes("background-svg")) {
        previousWebsite = {
          html: cleanPreviousCode(c.html),
          css: c.css || "",
          js: c.js || "",
        };
      } else if (c.files && typeof c.files === "object") {
        previousWebsite = c;
      }
    }
  }

  // 2. If not provided or empty, retrieve from project.chats in database
  if (!previousWebsite && project.chats && project.chats.length > 0) {
    for (let i = project.chats.length - 1; i >= 0; i--) {
      const prevChat = project.chats[i];
      if (prevChat.airesponse) {
        try {
          const parsed = typeof prevChat.airesponse === "string" ? JSON.parse(prevChat.airesponse) : prevChat.airesponse;
          if (parsed) {
            if (parsed.html && typeof parsed.html === "string" && !parsed.html.includes("background-svg")) {
              previousWebsite = {
                html: cleanPreviousCode(parsed.html),
                css: parsed.css || "",
                js: parsed.js || "",
              };
              break;
            } else if (parsed.files && typeof parsed.files === "object") {
              previousWebsite = parsed;
              break;
            }
          }
        } catch (e) {
          console.warn("[GenWeb AI] Error parsing previous chat airesponse:", e.message);
        }
      }
    }
  }

  // Build conversation summary (up to last 5 messages)
  let conversationHistory = "";
  if (project.chats && project.chats.length > 0) {
    conversationHistory = project.chats
      .slice(-5)
      .map((c, i) => `Turn ${i + 1}:\n- User requested: "${c.userprompt}"\n- Summary: "${c.text || 'Updated website'}"`)
      .join("\n\n");
  }

  const isIncremental = !!previousWebsite;
  console.log(`[GenWeb AI] Generation mode for project ${projectId}: ${isIncremental ? "INCREMENTAL UPDATE" : "INITIAL BUILD"}`);

  let systemInstruction = "";
  let promptPayload = "";

  if (frontendRoute === `/main/plain/${projectId}`) {
    if (isIncremental && previousWebsite.html) {
      systemInstruction = `You are an expert senior full-stack web developer and UI designer in GenWeb Studio.
The user is requesting an INCREMENTAL UPDATE / REVISION to their EXISTING website.

CRITICAL INCREMENTAL EDITING RULES:
1. DO NOT REBUILD THE ENTIRE WEBSITE FROM SCRATCH. Preserve the existing theme, layout, components, content, typography, styling, and functionality.
2. CHANGE ONLY WHAT THE USER ASKS:
   - Identify the specific element(s), text, section(s), styles, or functions the user wants changed or added.
   - For text or branding changes (e.g., "change name of store to ap"): update ONLY the corresponding text, headers, title, and branding throughout the HTML/JS. Keep all products, layout, images, and other sections intact.
   - For additions (e.g., "add a contact form" or "add a FAQ section"): insert the new section into the existing <div id="layout"> with class "draggable vertical", and add the corresponding CSS styles and JS handlers without deleting any existing sections.
   - For style/theme updates (e.g., "change background to dark" or "make buttons rounded"): update only the relevant CSS classes/variables and style rules.
   - COLOR & THEME DIRECTIVE (HIGHEST PRIORITY): You MUST strictly follow the user's color theme preferences. If the user mentions "bright color", "light theme", "colorful", "pastel", or "clean white": YOU MUST OVERRIDE AND REPLACE all previous dark/black backgrounds, gradients, and cards with clean bright/light backgrounds (#ffffff, #f8fafc) and sharp dark text (#0f172a). Never keep dark or black backgrounds when the user asks for bright or light colors!
   - For deletions: remove only the specific section or element the user asked to remove.
3. STRUCTURE & COMPLIANCE:
   - The body MUST keep a single container div with id 'layout' as the root element.
   - All top-level sections directly inside #layout MUST have the CSS classes 'draggable' and 'vertical' (e.g., <header class="draggable vertical">, <section class="draggable vertical">, <footer class="draggable vertical">).
   - Do NOT add any extra floating theme-toggle or palette buttons unless the user explicitly requests one.
   - MULTI-PAGE ARCHITECTURE: If the user requests a multi-page website or multiple pages/views (e.g. Home, Products, Features, Contact, About, Cart):
     * Implement it as a seamless Single Page Application (SPA) multi-page architecture inside the single HTML file.
     * Create separate modular view sections directly inside #layout: e.g. <section id='home-view' class='page-view draggable vertical'>...</section>, <section id='products-view' class='page-view draggable vertical' style='display: none;'>...</section>, <section id='contact-view' class='page-view draggable vertical' style='display: none;'>...</section>.
     * In navbar/header: use links with href='#home-view', href='#products-view', or onclick handlers.
     * In JavaScript: provide a clean switchPage(pageId) function that hides all .page-view sections and displays the requested page view.
     * NEVER use external page links like href='products.html' or href='/products' and NEVER use window.location.href, location.assign, or location.reload(). All navigation must switch views instantly in DOM.
   - Internal links should point to section anchors (e.g. href="#hero", href="#products-view") or href="#".
4. OUTPUT FORMAT & JSON SAFETY:
   - Inside the 'html' property, use single quotes for HTML attribute values (e.g. <div class='card' id='header'>, <a href='#hero'>, <img src='...' alt='photo'>) to avoid double-quote JSON escaping conflicts.
   - Return strictly a valid JSON object with four keys: 'html', 'css', 'js', and 'explanation'.
   {
     "html": "<complete updated HTML>",
     "css": "<complete updated CSS>",
     "js": "<complete updated JavaScript>",
     "explanation": "<concise summary of only what was modified according to user request>"
   }
   - Output pure JSON only without markdown formatting.`;

      promptPayload = `=== CURRENT WEBSITE CODE TO MODIFY ===
[EXISTING HTML]
${previousWebsite.html}

[EXISTING CSS]
${previousWebsite.css || "/* No custom CSS */"}

[EXISTING JAVASCRIPT]
${previousWebsite.js || "// No custom JS"}

=== CONVERSATION HISTORY ===
${conversationHistory || "No previous history"}

=== USER'S NEW MODIFICATION REQUEST ===
${userPrompt}

Apply ONLY the changes requested by the user, keeping all other existing structure, styles, content, and interactive features intact. Return strictly JSON.`;
    } else {
      systemInstruction = `Your task is to create a one-page website based on the given specifications, delivered as an HTML file, CSS file, and JavaScript file. The website should incorporate a variety of engaging and interactive design features, such as drop-down menus, dynamic text and content, clickable buttons, and more. Ensure that the design is visually appealing, responsive, and user-friendly. The HTML, CSS, and JavaScript code should be well-structured, efficiently organized, and properly commented for readability and maintainability.

Inside the body, there must be a single container div with id 'layout' as the root element. Divide the page into clear, beautiful modular sections (e.g. <header class="draggable vertical">, <section class="draggable vertical">, <footer class="draggable vertical">) placed directly inside this layout div. Every top-level section inside layout must have the CSS class 'draggable' and 'vertical' so users can drag and drop reorder them.

COLOR & THEME DIRECTIVE (HIGHEST PRIORITY):
Strictly follow the user's requested color scheme and mood. If the user mentions "bright color", "light theme", "colorful", "pastel", or "clean white": you MUST design the entire website using clean, bright, and vibrant colors (e.g. #ffffff, #f8fafc backgrounds, dark legible text #0f172a, and lively colorful accents). Do NOT default to dark or black backgrounds when bright or light is requested! Do NOT add unwanted theme-toggle or palette selector buttons.

Inside the 'html' property, use single quotes for HTML attribute values (e.g. <div class='card' id='header'>) to avoid JSON escaping issues.

Generate a JSON object with four keys: 'html' containing HTML, 'css' containing CSS, 'js' containing JavaScript, and 'explanation' containing description.
Format:
{
  "html": "",
  "css": "",
  "js": "",
  "explanation": ""
}
Return strictly JSON only.`;

      promptPayload = userPrompt;
    }
  } else if (frontendRoute === `/main/react/${projectId}`) {
    if (isIncremental && previousWebsite.files) {
      systemInstruction = `You are an expert React.js developer tasked with INCREMENTALLY UPDATING an existing React project in GenWeb Studio.
CRITICAL INCREMENTAL EDITING RULES:
1. DO NOT RECREATE THE ENTIRE PROJECT FROM SCRATCH. Preserve existing components, routes, structure, and CSS.
2. CHANGE ONLY WHAT THE USER ASKS:
   - Modify the relevant component(s), add new files if needed, or update styles to satisfy the user's request.
   - COLOR & THEME DIRECTIVE (CRITICAL): If the user requests "bright color", "light theme", "colorful", or pastel colors, YOU MUST OVERRIDE AND REPLACE all previous dark/black backgrounds, gradients, and cards in the CSS/JSX files with clean bright/light backgrounds (#ffffff, #f8fafc) and sharp dark text (#0f172a). Never keep dark or black backgrounds when the user asks for bright or light colors!
   - Keep existing functionality and navigation working.
3. All JSX top-level elements must retain 'draggable' and 'vertical' or 'horizontal' classes.
4. Response Format (Return strictly valid JSON only):
{
  "projectTitle": "",
  "explanation": "",
  "files": {
    "/App.js": { "code": "" }
  },
  "entryFilePath": "/App.js",
  "generatedFiles": []
}`;

      promptPayload = `=== CURRENT REACT PROJECT FILES ===
${JSON.stringify(previousWebsite.files, null, 2)}

=== CONVERSATION HISTORY ===
${conversationHistory || "No previous history"}

=== USER'S NEW MODIFICATION REQUEST ===
${userPrompt}

Apply ONLY the changes requested by the user, keeping all other components and functionality intact. Return strictly JSON.`;
    } else {
      systemInstruction = `You are an expert web developer tasked with generating a complete, production-ready React.js project from a user's description. Follow these precise guidelines:
Make sure to provide a complete ready to run code without any errors

1. Project Generation Requirements:
Create a fully functional React.js project using create-react-app or a custom Webpack configuration.
Website should be multipage with routes.
Use modern React best practices, including functional components and hooks.
Implement responsive design using only CSS.
COLOR & THEME DIRECTIVE (HIGHEST PRIORITY): Strictly follow the user's requested color scheme and mood. If the user mentions "bright color", "light theme", "colorful", "pastel", or "clean white": you MUST design the entire website using clean, bright, and vibrant colors (e.g. #ffffff, #f8fafc backgrounds, dark legible text #0f172a, and lively colorful accents). Do NOT default to dark or black backgrounds when bright or light is requested!
Ensure meaningful, clean, and well-structured code with a component-based architecture.
Include appropriate error boundaries for error handling.
Add basic optimizations for performance and SEO (where applicable for SPAs).
Use <img> tags for images and write a clear description in the alt attribute.
Hardcode the required string in the src and alt attributes of the img tag.

2. JSON Structure Specifications:
Generate a comprehensive JSON object.
Keys must represent full file paths.
Values must contain complete file contents.
Include all necessary project files, excluding node_modules and .git directories.
Maintain a standard React.js project structure.
entryFilePath must contain path to file App.js, the root app which has all routes.
Do not put App.js and other code files in src folder. Keep them in root folder itself.
Give the css files for all pages in css folder. Import them from that folder.

3. Structural Details:
Include at least one reusable component, such as a Button or Card.
Add basic routing configuration using React Router.
Provide a clean and maintainable project setup.

4. Response Format (Return strictly valid JSON only):
{
  "projectTitle": "",
  "explanation": "",
  "files": {
    "/App.js": {
      "code": ""
    }
  },
  "entryFilePath": "/App.js",
  "generatedFiles": []
}

All elements must have a draggable class and vertical or horizontal class. DO NOT GIVE ME A SCRIPT FOR draggable class as i am implementing my own script for drag and drop which will use the draggable class.`;

      promptPayload = userPrompt;
    }
  }

  try {
    const rawAiResponse = await callGeminiAPI(systemInstruction, promptPayload);
    let obj = safeParseAIResponse(rawAiResponse);

    // Replace image placeholders with contextual AI images
    if (frontendRoute === `/main/react/${projectId}` && obj.files) {
      for (const key in obj.files) {
        if (obj.files[key]?.code) {
          obj.files[key].code = await replaceImageSrc(obj.files[key].code);
        }
      }
    } else if (frontendRoute === `/main/plain/${projectId}` && obj.html) {
      obj.html = await replaceImageSrc(obj.html);
    }

    // project is already loaded and validated above

    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const formattedTime = `${hours}:${minutes}`;
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = now.getFullYear();
    const formattedDate = `${day}-${month}-${year}`;
    const finalOutput = `${formattedTime} ${formattedDate}`;

    const jsonStringOutput = JSON.stringify(obj);

    project.chats.push({
      userprompt: userPrompt,
      airesponse: jsonStringOutput,
      text: obj.explanation || "Generated with GenWeb Studio AI",
      time: finalOutput,
    });

    await project.save();

    // Anthropic-compatible envelope expected by the frontend
    res.json({
      content: [
        {
          text: jsonStringOutput,
        },
      ],
    });
  } catch (error) {
    console.error("GenWeb Studio Generation Error:", error);
    res.status(500).json({ error: "AI generation failed", details: error.message });
  }
};

exports.getchat = async (req, res) => {
  const { pid } = req.params;
  if (pid && String(pid).startsWith('dummy-')) {
    return res.status(200).json({ chats: [] });
  }
  try {
    const project = await Project.findById(pid);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }
    res.status(200).json({ chats: project.chats });
  } catch (error) {
    console.error("Error fetching chats:", error);
    res.status(500).json({ message: "An error occurred while fetching project chats", error: error.message });
  }
};
