# GenWeb Studio - AI-Powered Website Generator

*Transform your ideas into production-ready websites using Google Gemini AI*

---

## 🚀 Live Demo
🔗 **[Launch GenWeb Studio](https://your-live-deployment-url.com)** *(Coming Soon / Deploy Link)*

---

## 🌟 Introduction

**GenWeb Studio** is an innovative AI-driven full-stack website generator designed to bridge the gap between imagination and web deployment. By combining natural language understanding powered by **Google Gemini 2.0** with intuitive browser-based editing tools, users can generate fully functional, responsive websites simply by describing their vision in plain English.

---

## ✨ Key Features

### 🤖 Intelligent AI Generation
- **Google Gemini Integration**: Fast, high-context generation of complete web applications with clean, production-ready code.
- **Multi-Framework Output**:
  - **React.js Projects**: Multi-page, component-based architectures with React Router and scoped styling.
  - **Plain Web Projects**: Semantic HTML5, modern CSS3, and interactive JavaScript.
- **AI Asset Generation**: Automatically generates contextual visual assets without requiring placeholder images.

### 🎨 Interactive Studio & Editor
- **Live In-Browser Preview**: Powered by CodeSandbox Sandpack for hot-reloading code previews.
- **Drag-and-Drop Layouts**: Reorder UI sections visually on the fly.
- **Dynamic Color Theme Switcher**: Instantly switch palettes across 5 modern themes.
- **One-Click Source Export**: Download the entire project structure as clean, deployable code.

### 🔐 Modern Authentication
- **Firebase Authentication**: One-click Google Sign-In with secure, tokenized sessions.
- **Personalized Dashboards**: Save, manage, and explore your generated projects in your profile.

---

## 🛠️ Tech Stack

- **Frontend**: React.js, Tailwind CSS, Framer Motion, CodeSandbox Sandpack, SweetAlert2
- **Backend**: Node.js, Express.js, MongoDB (Mongoose)
- **AI Engine**: Google Gemini API (`gemini-2.0-flash` / `gemini-1.5-flash`)
- **Authentication**: Firebase Authentication (Google OAuth)

---

## 📦 Getting Started Locally

### 1. Prerequisites
- Node.js (v16 or higher)
- npm (v7 or higher)
- MongoDB (Local community server or MongoDB Atlas)
- Google Gemini API Key (Free from [Google AI Studio](https://aistudio.google.com/))
- Firebase Project (Free from [Firebase Console](https://console.firebase.google.com/))

### 2. Backend Setup
```bash
cd "genweb studio/backend"
npm install
```

Create a `.env` file inside `backend/`:
```env
PORT=5000
NODE_ENV=development
SECRETKEY=your_secret_session_key
CLIENT_URL=http://localhost:3000
MONGODB_URI=mongodb://127.0.0.1:27017/genweb_studio

# Google Gemini API Key
GEMINI_API_KEY=your_gemini_api_key_here
```

Start the backend:
```bash
npm start
```

### 3. Frontend Setup
```bash
cd "../frontend"
npm install --legacy-peer-deps
```

Create a `.env` file inside `frontend/`:
```env
REACT_APP_BACKEND_URL=http://localhost:5000/
REACT_APP_FIREBASE_API_KEY=your_firebase_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
```

Start the frontend:
```bash
npm start
```

Visit `http://localhost:3000` in your browser.

---

## 👤 Author

- **Pratik Suralkar** - *Creator & Lead Developer*
  - GitHub: [Pratik Suralkar](https://github.com/Pratik202005)

---

<div align="center">
  Developed with ❤️ by Pratik Suralkar
</div>
