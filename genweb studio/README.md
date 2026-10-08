# ⚡ GenWeb Studio

<div align="center">

  <img src="https://raw.githubusercontent.com/Pratik202005/genweb-studio/main/genweb%20studio/frontend/public/logo.png" alt="GenWeb Studio Logo" width="96" height="96" />

  <h3>AI-Powered Full-Stack Website Synthesis & Live Sandbox Studio</h3>
  <p><em>Transform natural language prompts into responsive, production-grade web applications in seconds with Google Gemini.</em></p>

  <p>
    <a href="https://genweb-studio-frontend.vercel.app/" target="_blank">
      <img src="https://img.shields.io/badge/Live%20Demo-genweb--studio.vercel.app-6366F1?style=for-the-badge&logo=vercel&logoColor=white" alt="Live Demo" />
    </a>
    <a href="https://github.com/Pratik202005/genweb-studio" target="_blank">
      <img src="https://img.shields.io/badge/GitHub-Repository-181717?style=for-the-badge&logo=github&logoColor=white" alt="GitHub Repo" />
    </a>
  </p>

  <p>
    <img src="https://img.shields.io/badge/React-18.3-61DAFB?style=flat-square&logo=react&logoColor=black" alt="React 18" />
    <img src="https://img.shields.io/badge/Node.js-18+-339933?style=flat-square&logo=node.js&logoColor=white" alt="Node.js" />
    <img src="https://img.shields.io/badge/Express-4.21-000000?style=flat-square&logo=express&logoColor=white" alt="Express" />
    <img src="https://img.shields.io/badge/MongoDB-Atlas-47A248?style=flat-square&logo=mongodb&logoColor=white" alt="MongoDB" />
    <img src="https://img.shields.io/badge/Google%20Gemini-2.0%20Flash-4285F4?style=flat-square&logo=google&logoColor=white" alt="Google Gemini" />
    <img src="https://img.shields.io/badge/TailwindCSS-3.4-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
    <img src="https://img.shields.io/badge/Sandpack-CodeSandbox-151515?style=flat-square&logo=codesandbox&logoColor=white" alt="Sandpack" />
    <img src="https://img.shields.io/badge/Firebase-Auth-FFCA28?style=flat-square&logo=firebase&logoColor=black" alt="Firebase" />
  </p>

</div>

---

## 📑 Table of Contents

- [Overview](#-overview)
- [Key Features](#-key-features)
- [Project Architecture & Directory Structure](#-project-architecture--directory-structure)
- [Technology Stack](#-technology-stack)
- [System Architecture & Data Flow](#-system-architecture--data-flow)
- [REST API Reference](#-rest-api-reference)
- [Environment Configuration](#-environment-configuration)
- [Local Development & Quickstart](#-local-development--quickstart)
- [Production Deployment Guide](#-production-deployment-guide)
- [Performance & Motion Engineering](#-performance--motion-engineering)
- [Contributing](#-contributing)
- [Author & Acknowledgments](#-author--acknowledgments)

---

## 🌟 Overview

**GenWeb Studio** is an open-source, AI-first generative web studio that bridges the gap between imagination and production deployment. By orchestrating **Google Gemini** language models with in-browser sandboxing engines (CodeSandbox Sandpack and sandboxed iframes), GenWeb Studio allows developers, founders, and designers to describe their desired web application in conversational English and witness it synthesize, compile, and execute in real-time.

Whether generating a responsive developer portfolio, an editorial publishing platform, or a modern SaaS task manager, GenWeb Studio crafts clean, componentized code with zero placeholder artifacts.

---

## ✨ Key Features

### 🤖 Generative AI Synthesis
- **Intelligent Architectural Synthesis**: Translates high-level prompts into semantic code with comprehensive styling and interactivity.
- **Dual Runtime Support**:
  - **React Runtime**: Fully modular multi-file React architectures featuring state hooks, modern icons (`lucide-react`), and component separation.
  - **Plain Runtime**: Clean, standards-compliant HTML5, responsive CSS3, and native vanilla JavaScript.
- **Contextual Iteration Engine**: Co-pilot refinement that allows users to chat with the AI to tweak styles, add components, or modify layouts without rewriting the whole codebase from scratch.

### 🎨 Live Studio & Interactive Sandboxes
- **Instant Hot-Reload Preview**:
  - Live sandboxing powered by **CodeSandbox Sandpack** for React applications.
  - Sandboxed iframe with dynamic stylesheet injection and DOM parsing for HTML/CSS/JS.
- **Interactive Component Drag & Drop**: Visual section reordering with real-time DOM restructuring and dotted layout indicators.
- **Multi-Device Responsive Frame**: Toggle between Desktop, Tablet, and Mobile viewport modes with pixel-accurate viewport constraints.
- **Dynamic Palette Switcher**: Real-time theme injection across curated palettes (Modern Indigo, Emerald Cyber, Amber Sunset, Rose Velvet, Midnight Minimal).
- **One-Click Source Export**: Download your synthesized web project as a clean, ready-to-deploy `.zip` archive or copy individual source files.

### ⚡ Butter-Smooth Motion & Aesthetics
- **Hardware-Accelerated 60/120 FPS Scrolling**: Momentum-damped smooth scrolling engine (`useSmoothScroll`) eliminating stepped notch stutter on Windows/Linux desktop mice.
- **Interactive Constellation Canvas**: Background neural network of particles and dots that seamlessly morph and connect into translucent geometric facets on scroll.
- **GPU-Optimized Multi-Stop Aurora Blobs**: Vibrant backdrop glows utilizing zero-overhead radial gradient falloffs.

### 🔐 Secure Identity & Cloud Storage
- **Google OAuth via Firebase**: Single-tap authentication with token exchange.
- **Project Persistence**: Saved projects stored in MongoDB Atlas with public/private visibility toggles.
- **Community Showcase**: Discover, explore, test live demos, and upvote community-synthesized projects.

---

## 📂 Project Architecture & Directory Structure

```text
genweb-studio/
├── README.md                      # Comprehensive project documentation
├── .gitignore                     # Git tracking ignore rules
│
├── backend/                       # Node.js & Express REST API Backend
│   ├── .env.example               # Backend environment variables template
│   ├── package.json               # Backend dependencies & scripts
│   ├── app.js                     # Express app bootstrap, dynamic CORS & sessions
│   ├── config/
│   │   └── passport.js            # Passport authentication configuration
│   ├── controllers/
│   │   ├── authController.js      # Session auth & user verification handlers
│   │   ├── chatController.js      # Gemini AI prompt synthesis & code generation
│   │   ├── projectController.js   # Project CRUD, visibility & Sandpack state
│   │   └── userController.js      # User profile, starred & created projects
│   ├── models/
│   │   ├── projectModel.js        # Project schema (React / Plain, files, metadata)
│   │   └── userModel.js           # User schema (Google ID, email, avatar)
│   └── routers/
│       ├── auth.js                # Auth endpoints (/auth)
│       ├── chatRoutes.js          # AI generation endpoints (/chat)
│       ├── projectRoutes.js       # Project endpoints (/project)
│       └── userRoutes.js          # User profile endpoints (/user)
│
└── frontend/                      # React 18 SPA & Interactive Studio
    ├── .env.example               # Frontend environment template
    ├── package.json               # Frontend dependencies & build scripts
    ├── tailwind.config.js         # Tailwind typography, theme tokens & design system
    ├── vercel.json                # Vercel SPA routing rewrite rules
    ├── public/
    │   ├── favicon.svg            # Brand vector icon
    │   ├── logo.png               # High-resolution raster logo
    │   └── manifest.json          # PWA web manifest
    └── src/
        ├── App.js                 # App routing & momentum smooth scroll provider
        ├── App.css                # Animation keyframes & base resets
        ├── index.css              # Global styles, Tailwind base & scroll physics
        ├── index.js               # React 18 DOM mount entry point
        ├── firebase.js            # Firebase SDK client initialization
        ├── components/
        │   ├── AnimatedBackground.jsx # 60fps GPU aurora, grid & particle constellations
        │   ├── ErrorBoundary.jsx  # React UI error boundary & recovery screen
        │   ├── Footer.jsx         # Global footer with social links & branding
        │   ├── GenerationProgress.jsx # AI compilation progress overlay (0-100%)
        │   ├── Introduction.jsx   # Hero section with 3D tilt cards & typewriter
        │   ├── Logo.jsx           # Vector SVG brand icon with glow effects
        │   ├── Navbar.jsx         # Responsive navbar with auth state & user menu
        │   ├── Prompt.jsx         # Natural language prompt bar & starter blueprints
        │   ├── ProtectedRoute.jsx # Authentication route guard
        │   ├── TemplateCard.jsx   # Explore showcase project cards with like/fork
        │   └── project.jsx        # Project card with preview thumbnail
        ├── hooks/
        │   ├── hardPrompts.js     # Curated prompt starters & templates
        │   ├── useSmoothScroll.js # 60/120fps momentum-damped scroll hook
        │   ├── useVoting.js       # Showcase likes & engagement management
        │   └── userContext.js     # Global Firebase auth session & user context
        ├── lib/
        │   ├── motionTokens.js    # Framer Motion spring & easing design tokens
        │   └── utils.js           # Class merging (clsx + tailwind-merge)
        └── pages/
            ├── About.jsx          # Architecture & feature showcase page
            ├── ActionContext.js   # Global studio event dispatch context
            ├── Landing.jsx        # Primary landing page (Hero + Prompt)
            ├── MainPagePlain.js   # HTML/CSS/JS Studio (Live DOM preview & editor)
            ├── MainPageReact.js   # React Studio (Live Sandpack sandbox & editor)
            ├── Profile.jsx        # User dashboard (personal projects & stats)
            ├── SandpackPreviewClient.js # Sandpack preview client bridge
            └── UniversalPage.jsx  # Community project explore & showcase feed
```

---

## 🛠️ Technology Stack

| Layer | Technologies | Purpose |
| :--- | :--- | :--- |
| **Frontend Framework** | React 18, React Router v7 | Single Page Application, component lifecycle & client-side routing |
| **Styling & Design** | Tailwind CSS 3.4, PostCSS | Utility-first styling, curated dark-mode theme tokens, responsive layouts |
| **Animations & FX** | Framer Motion, HTML5 Canvas 2D | Micro-interactions, 3D card tilts, spring easing & particle constellations |
| **In-Browser Sandboxing**| CodeSandbox Sandpack React | Browser-side bundling, transpilation & hot-reloading React execution |
| **Backend Framework** | Node.js, Express.js | Scalable REST API, streaming AI endpoints, JSON payload validation |
| **AI Inference** | Google Gemini 2.0 Flash (`@google/genai` / REST) | Natural language decomposition, architecture planning & code synthesis |
| **Database & ODM** | MongoDB Atlas, Mongoose 8 | Multi-tenant storage for user profiles, generated source code & metadata |
| **Authentication** | Firebase Auth & Google OAuth | Secure tokenized sessions and seamless social sign-in |
| **Deployment** | Vercel (Frontend), Render (Backend) | Globally distributed edge hosting and continuous CI/CD delivery |

---

## 🔄 System Architecture & Data Flow

```mermaid
sequenceDiagram
    autonumber
    actor User as 👤 User / Developer
    participant UI as 🖥️ GenWeb Studio (React)
    participant Auth as 🔐 Firebase Auth
    participant API as ⚙️ Express Backend
    participant Gemini as 🧠 Google Gemini 2.0
    participant DB as 🗄️ MongoDB Atlas
    participant Sandbox as 📦 Sandpack / Iframe Runtime

    User->>UI: Types Prompt & Selects Runtime (React / Plain)
    UI->>Auth: Validates User Session (Google OAuth)
    UI->>API: POST /project/add (prompt, runtime, title)
    API->>Gemini: Prompts Gemini Engine with Architecture Specs
    Gemini-->>API: Returns Synthesized Source Code & File Map
    API->>DB: Stores Project Record & Source Files
    API-->>UI: Returns Project Payload & Project ID
    UI->>Sandbox: Injects Code into Live Sandbox Runtime
    Sandbox-->>UI: Mounts Live Interactive Preview (Hot Reload)
    UI-->>User: Displays Workspace Studio (Code + Preview + Palette Controls)
```

---

## 🔌 REST API Reference

### 1. Projects (`/project`)

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| `POST` | `/project/add` | Synthesize and create a new AI web project | Optional (Creator) |
| `GET` | `/project/get` | Retrieve project source code & metadata by ID (`?id=...`) | No |
| `POST` | `/project/user` | Fetch all projects belonging to the authenticated user | Yes |
| `GET` | `/project/public` | Retrieve all public projects for the Explore showcase | No |
| `DELETE`| `/project/delete/:id` | Delete a project owned by the user | Yes |

### 2. AI Co-Pilot & Chat (`/chat`)

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| `POST` | `/chat/generate` | Generate initial codebase from scratch with Google Gemini | Optional |
| `POST` | `/chat/iterate` | Contextual conversational updates to an existing codebase | Optional |

### 3. Authentication & User (`/auth` & `/user`)

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| `POST` | `/auth/google` | Exchange Firebase ID token for backend session | No |
| `GET` | `/user/profile` | Get current authenticated user profile & project counts | Yes |

---

## ⚙️ Environment Configuration

### Backend Configuration (`backend/.env`)

```env
# Server Port & Mode
PORT=5000
NODE_ENV=development

# Session Encryption Key
SECRETKEY=your_super_secret_session_key_here

# Frontend Client URL (For CORS whitelist)
CLIENT_URL=http://localhost:3000

# MongoDB Database Connection String
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/genweb_studio?retryWrites=true&w=majority

# Google Gemini API Key (Obtain from Google AI Studio)
GEMINI_API_KEY=AIzaSyD_your_actual_gemini_api_key_here
```

### Frontend Configuration (`frontend/.env`)

```env
# Backend API Base URL
REACT_APP_BACKEND_URL=http://localhost:5000/

# Firebase Authentication Client Configuration
REACT_APP_FIREBASE_API_KEY=AIzaSyYourFirebaseWebApiKey
REACT_APP_FIREBASE_AUTH_DOMAIN=your-app.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your-firebase-project-id
REACT_APP_FIREBASE_STORAGE_BUCKET=your-app.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=123456789012
REACT_APP_FIREBASE_APP_ID=1:123456789012:web:abcdef123456
```

---

## 🚀 Local Development & Quickstart

### Prerequisites
- **Node.js** `v18.0.0` or higher
- **npm** `v9.0.0` or higher
- **MongoDB** instance (Local Community Server or MongoDB Atlas cluster)
- **Google Gemini API Key** (Free tier available at [Google AI Studio](https://aistudio.google.com/))
- **Firebase Project** with Google Sign-In enabled in [Firebase Console](https://console.firebase.google.com/)

### Step 1: Clone the Repository
```bash
git clone https://github.com/Pratik202005/genweb-studio.git
cd genweb-studio
```

### Step 2: Setup & Launch the Backend
```bash
# Navigate to backend directory
cd "genweb studio/backend"

# Install backend dependencies
npm install

# Create environment configuration
cp .env.example .env
# Edit .env with your GEMINI_API_KEY and MONGODB_URI

# Start the Express API server
npm start
```
*The backend API will initialize on `http://localhost:5000`.*

### Step 3: Setup & Launch the Frontend
```bash
# In a new terminal window, navigate to frontend directory
cd "genweb studio/frontend"

# Install frontend dependencies
npm install --legacy-peer-deps

# Create environment configuration
cp .env.example .env
# Edit .env with your Firebase keys and REACT_APP_BACKEND_URL

# Start the React development server
npm start
```
*The web studio will launch on `http://localhost:3000`.*

---

## 🌐 Production Deployment Guide

### Deploying Frontend to Vercel

1. Push your repository to GitHub.
2. In the [Vercel Dashboard](https://vercel.com/), select **Add New Project** and import `genweb-studio`.
3. Set the **Root Directory** to `genweb studio/frontend`.
4. Configure Build Settings:
   - **Framework Preset**: `Create React App`
   - **Build Command**: `cross-env CI=false react-scripts build`
   - **Output Directory**: `build`
5. Add Frontend Environment Variables:
   - Set `REACT_APP_BACKEND_URL` to your production backend URL (e.g. `https://your-backend.onrender.com/`).
   - Add all `REACT_APP_FIREBASE_*` credentials.
6. Deploy! Vercel will automatically compile the SPA and respect [vercel.json](file:///c:/Users/PRASAD%20SURALKAR/Downloads/genweb%20studio/genweb%20studio/frontend/vercel.json) client-side rewrite rules.

### Deploying Backend to Render / Railway

1. In [Render Dashboard](https://dashboard.render.com/), create a new **Web Service**.
2. Connect your repository and configure:
   - **Root Directory**: `genweb studio/backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node app.js`
3. Add Backend Environment Variables (`MONGODB_URI`, `GEMINI_API_KEY`, `SECRETKEY`, `CLIENT_URL`).
4. Under Firebase Console > **Authentication** > **Settings** > **Authorized Domains**, add your Vercel deployment domain (e.g., `genweb-studio-frontend.vercel.app`).

---

## 🏎️ Performance & Motion Engineering

GenWeb Studio implements state-of-the-art web performance practices:
- **Momentum-Damped Scrolling**: Custom [useSmoothScroll.js](file:///c:/Users/PRASAD%20SURALKAR/Downloads/genweb%20studio/genweb%20studio/frontend/src/hooks/useSmoothScroll.js) hook converts stepped mouse wheel ticks into high-precision, 60/120 FPS momentum scrolling without interfering with inputs or native mobile touch.
- **Hardware-Accelerated Aurora**: Replaced heavy 90px Gaussian convolution blurs with GPU-rasterized multi-stop radial gradient falloffs, cutting raster thread overhead by over 90%.
- **Constellation Shape Morphing**: Continuous canvas particle system with internal RAF lerp damping. Connecting nodes smoothly form glowing triangular facets and wireframe shapes that glide with scroll physics.
- **Zero Frame-Drop Compositing**: Eliminated full-screen `mix-blend-mode: overlay` readback stalls for solid 60 FPS performance across modern laptops and mobile screens.

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

1. **Fork** the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'feat: add AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a **Pull Request**

---

## 👤 Author & Acknowledgments

- **Pratik Suralkar** — *Creator & Lead Full-Stack Architect*
  - GitHub: [@Pratik202005](https://github.com/Pratik202005)

### Acknowledgments
- **Google DeepMind & Google Gemini** for state-of-the-art generative language intelligence.
- **CodeSandbox** for the revolutionary Sandpack in-browser bundling engine.
- **Tailwind Labs** & **Lucide Icons** for modern aesthetic design primitives.

---

<div align="center">
  <sub>Built with ❤️ by Pratik Suralkar. Distributed under the MIT License.</sub>
</div>
