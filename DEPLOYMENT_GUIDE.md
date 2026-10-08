# 🚀 GenWeb Studio - Production Deployment Guide

This guide provides a reproducible, step-by-step walkthrough for deploying **GenWeb Studio** to production.

The platform is designed to be hosted across two services:
- **Frontend SPA**: Hosted on [Vercel](https://vercel.com/) (Edge CDN, automatic SSL, SPA routing).
- **Backend API**: Hosted on [Render](https://render.com/) (Node.js web service, automatic TLS, zero-downtime deploys).
- **Database**: [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (Managed cloud database).
- **Authentication**: [Firebase Authentication](https://firebase.google.com/) (Google OAuth identity provider).
- **AI Inference**: [Google AI Studio](https://aistudio.google.com/) (Google Gemini API).

---

## 📑 Table of Contents

- [1. Prerequisites & Account Checklist](#1-prerequisites--account-checklist)
- [2. Step 1: MongoDB Atlas Database Configuration](#2-step-1-mongodb-atlas-database-configuration)
- [3. Step 2: Google Gemini API Key Provisioning](#3-step-2-google-gemini-api-key-provisioning)
- [4. Step 3: Firebase Authentication Configuration](#4-step-3-firebase-authentication-configuration)
- [5. Step 4: Backend Deployment on Render](#5-step-4-backend-deployment-on-render)
- [6. Step 5: Frontend Deployment on Vercel](#6-step-5-frontend-deployment-on-vercel)
- [7. Step 6: Post-Deployment Smoke Testing](#7-step-6-post-deployment-smoke-testing)
- [8. Troubleshooting & Common Pitfalls](#8-troubleshooting--common-pitfalls)

---

## 1. Prerequisites & Account Checklist

Before beginning deployment, ensure you have accounts with:
- [GitHub](https://github.com/) (with repository access to `Pratik202005/genweb-studio`)
- [Vercel](https://vercel.com/) (Free or Pro tier)
- [Render](https://render.com/) (Free or Team tier)
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (Free M0 or higher)
- [Firebase Console](https://console.firebase.google.com/)
- [Google AI Studio](https://aistudio.google.com/)

---

## 2. Step 1: MongoDB Atlas Database Configuration

1. Log in to [MongoDB Atlas](https://cloud.mongodb.com/) and create a free **M0 Sandbox** cluster (or use an existing cluster).
2. **Configure Database Access**:
   - In the sidebar, navigate to **Security** > **Database Access**.
   - Click **Add New Database User**.
   - Authentication Method: **Password**.
   - Create a username (e.g., `genweb_admin`) and a secure password.
   - Database User Privileges: `Read and write to any database`.
3. **Configure Network Access**:
   - In the sidebar, navigate to **Security** > **Network Access**.
   - Click **Add IP Address**.
   - Choose **Allow Access from Anywhere** (`0.0.0.0/0`) so dynamic cloud runners on Render can connect.
   - Confirm and wait for status to become `Active`.
4. **Copy Connection String**:
   - Navigate to **Deployments** > **Database**.
   - Click **Connect** on your cluster > **Drivers** (Node.js).
   - Copy the connection URI:
     ```text
     mongodb+srv://<username>:<password>@cluster0.mongodb.net/genweb_studio?retryWrites=true&w=majority
     ```
   - Replace `<username>` and `<password>` with your database user credentials.

---

## 3. Step 2: Google Gemini API Key Provisioning

1. Visit [Google AI Studio](https://aistudio.google.com/).
2. Sign in with your Google account.
3. Click **Get API key** in the top navigation.
4. Click **Create API key** (choose an existing Google Cloud project or create a new one).
5. Copy the generated key (`your_gemini_api_key`).
6. *Note*: The backend automatically performs model discovery across available versions (`gemini-3.5-flash-lite`, `gemini-2.5-flash`, etc.) on this key.

---

## 4. Step 3: Firebase Authentication Configuration

1. Open the [Firebase Console](https://console.firebase.google.com/) and click **Add Project** (e.g., `genweb-studio-prod`).
2. **Enable Authentication**:
   - In the sidebar, navigate to **Build** > **Authentication**.
   - Click **Get Started**.
   - Under **Sign-in method**, enable the **Google** provider.
   - Provide a support email and save.
3. **Obtain Client Credentials**:
   - In Project Overview, click the **Web** icon (`</>`) to register a web app.
   - Register the app name (e.g., `GenWeb Studio Web`).
   - Copy the `firebaseConfig` properties:
     - `apiKey`
     - `authDomain`
     - `projectId`
     - `storageBucket`
     - `messagingSenderId`
     - `appId`
4. **Configure Authorized Domains** *(Critical)*:
   - In Firebase Console, go to **Authentication** > **Settings** > **Authorized domains**.
   - By default, `localhost` and `your-app.firebaseapp.com` are authorized.
   - Click **Add domain** and enter your production Vercel domain:
     ```text
     genweb-studio-frontend.vercel.app
     ```
   - If you use a custom domain (e.g., `studio.yourdomain.com`), add that as well.

---

## 5. Step 4: Backend Deployment on Render

1. Log in to [Render](https://dashboard.render.com/).
2. Click **New +** > **Web Service**.
3. Connect your GitHub repository (`Pratik202005/genweb-studio`).
4. Configure the service settings:
   - **Name**: `genweb-studio-backend`
   - **Region**: Select the region closest to your users (e.g., Frankfurt, Oregon, Singapore).
   - **Branch**: `main`
   - **Root Directory**: `genweb studio/backend`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node app.js`
   - **Instance Type**: `Free` (or Starter for persistent RAM)
5. **Add Environment Variables**:
   Under **Environment Variables**, add the following keys:

   | Key | Value | Notes |
   | :--- | :--- | :--- |
   | `NODE_ENV` | `production` | Enables trust proxy & `SameSite=None; Secure` cookies |
   | `PORT` | `5000` | Port for Express listener |
   | `SECRETKEY` | `<your-generated-session-secret>` | High-entropy string for session signature |
   | `CLIENT_URL` | `https://genweb-studio-frontend.vercel.app` | Production frontend URL for CORS |
   | `MONGODB_URI`| `mongodb+srv://<user>:<password>@cluster0...` | MongoDB Atlas URI string |
   | `GEMINI_API_KEY` | `<your_gemini_api_key>` | Google AI Studio API key |

6. Click **Deploy Web Service**.
7. Once deployed, copy your service's live URL (e.g., `https://genweb-studio-backend.onrender.com`).
8. Verify health by opening `https://genweb-studio-backend.onrender.com/` in your browser. You should receive:
   ```json
   { "status": "ok", "message": "GenWeb Studio Backend API is running" }
   ```

---

## 6. Step 5: Frontend Deployment on Vercel

1. Log in to [Vercel](https://vercel.com/).
2. Click **Add New...** > **Project**.
3. Import your GitHub repository (`Pratik202005/genweb-studio`).
4. In the project configuration screen:
   - **Project Name**: `genweb-studio-frontend`
   - **Framework Preset**: `Create React App`
   - **Root Directory**: Click **Edit** and select `genweb studio/frontend`.
5. **Configure Build & Output Settings**:
   - **Build Command**: `cross-env CI=false react-scripts build`
   - **Output Directory**: `build`
   - **Install Command**: `npm install --legacy-peer-deps`
6. **Configure Environment Variables**:
   Add the following variables (all prefixed with `REACT_APP_` for React build bundling):

   | Variable Name | Value | Purpose |
   | :--- | :--- | :--- |
   | `REACT_APP_BACKEND_URL` | `https://genweb-studio-backend.onrender.com/` | **Must include trailing slash** |
   | `REACT_APP_FIREBASE_API_KEY` | `<your_firebase_api_key>` | Firebase Web API Key |
   | `REACT_APP_FIREBASE_AUTH_DOMAIN` | `<your-project-id>.firebaseapp.com` | Firebase Auth Domain |
   | `REACT_APP_FIREBASE_PROJECT_ID` | `<your-project-id>` | Firebase Project ID |
   | `REACT_APP_FIREBASE_STORAGE_BUCKET` | `<your-project-id>.appspot.com` | Firebase Storage Bucket |
   | `REACT_APP_FIREBASE_MESSAGING_SENDER_ID` | `<your_messaging_sender_id>` | Firebase Sender ID |
   | `REACT_APP_FIREBASE_APP_ID` | `<your_firebase_app_id>` | Firebase Application ID |

7. Click **Deploy**.
8. Vercel will build the React bundle and deploy the static assets across its Global Edge Network. The included [vercel.json](file:///c:/Users/PRASAD%20SURALKAR/Downloads/genweb%20studio/genweb%20studio/frontend/vercel.json) ensures all SPA routes (`/universal`, `/main/*`, `/profile`) resolve to `index.html`.

---

## 7. Step 6: Post-Deployment Smoke Testing

Execute this smoke test sequence to confirm all components are operational:

1. **API Availability Check**:
   ```bash
   curl -s https://<your-backend>.onrender.com/
   # Expected: {"status":"ok","message":"GenWeb Studio Backend API is running"}
   ```

2. **Explore Feed Data**:
   ```bash
   curl -s https://<your-backend>.onrender.com/project/visible
   # Expected: JSON array of public projects (status 200)
   ```

3. **Frontend Application Load**:
   - Open your Vercel deployment URL (`https://genweb-studio-frontend.vercel.app/`).
   - Check developer console (`F12`) for zero CORS or asset loading errors.
   - Verify smooth scrolling and animated canvas particle rendering.

4. **Authentication Flow**:
   - Click **Sign In** in the top navigation bar.
   - Ensure the Google OAuth popup appears without `auth/unauthorized-domain` errors.
   - Sign in and confirm your avatar and profile link appear in the navigation bar.

5. **Project Generation**:
   - Enter a simple prompt in the Hero prompt box (e.g., *"Modern portfolio for an iOS engineer"*).
   - Select runtime: **React** or **HTML / CSS / JS**.
   - Click **Create & Launch**.
   - Ensure the progress overlay advances and routes into `/main/react/:id` or `/main/plain/:id`.
   - Verify that the code editor displays synthesized files and the preview renders interactive components.

---

## 8. Troubleshooting & Common Pitfalls

### 1. `auth/unauthorized-domain` Firebase Error
- **Cause**: The current Vercel deployment hostname is not registered in Firebase's allowed domain list.
- **Fix**: Open Firebase Console > **Authentication** > **Settings** > **Authorized Domains**, click **Add domain**, and enter your exact Vercel URL (e.g., `genweb-studio-frontend.vercel.app`).

### 2. Cross-Site Cookies Blocked (Authentication Loses Session on Refresh)
- **Cause**: Third-party cookie restrictions in Safari / iOS or missing reverse proxy trust in Express.
- **Fix**:
  1. Ensure `NODE_ENV=production` is set in Render environment variables. This activates `app.set('trust proxy', 1)` and sets cookies with `sameSite: "none"` and `secure: true`.
  2. Confirm `REACT_APP_BACKEND_URL` in Vercel ends with a trailing slash (`/`).

### 3. Vercel Build Fails with `Treating warnings as errors`
- **Cause**: Create React App defaults to treating lint warnings as fatal errors when `CI=true` in Vercel's build environment.
- **Fix**: The frontend build command must be configured as `cross-env CI=false react-scripts build` (already included in `package.json` and `vercel.json`).

### 4. CORS Errors on API Calls
- **Cause**: Origin header does not match backend CORS policy.
- **Fix**: [backend/app.js](file:///c:/Users/PRASAD%20SURALKAR/Downloads/genweb%20studio/genweb%20studio/backend/app.js) contains dynamic origin handling supporting `localhost`, `*.vercel.app`, and `process.env.CLIENT_URL`. Verify that `CLIENT_URL` matches your exact Vercel frontend URL without trailing slashes.

### 5. Gemini API 404 or Quota Exhaustion
- **Cause**: A specific Gemini model identifier is unavailable or deprecated for your key.
- **Fix**: GenWeb Studio automatically discovers active models on your key and falls back through `gemini-3.5-flash-lite`, `gemini-3.5-flash`, `gemini-2.5-flash`, and `gemini-1.5-flash-latest`. Check Render runtime logs (`[GenWeb AI] Trying REST generateContent...`) to observe model selection in real-time.

---

<div align="center">
  <sub>GenWeb Studio Deployment Documentation • Maintained by Pratik Suralkar</sub>
</div>
