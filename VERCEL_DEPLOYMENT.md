# Deploying the Therapeutic Letter Writer to Vercel

This guide explains how to deploy this application to **Vercel** and resolve common issues such as missing API keys and repetitive fallback responses.

---

## Why You Saw the Same Response Repeatedly

When you import this repository into Vercel from GitHub, two things happen by default:

1. **Missing `GEMINI_API_KEY` Environment Variable:**
   In Google AI Studio, the Gemini API key is injected automatically into the workspace. When imported into Vercel, your Vercel project starts with **no environment variables**. Without `GEMINI_API_KEY`, the server cannot reach Gemini and was falling back to a default offline message.

2. **Serverless Function Routing (`/api/*`):**
   Vercel is a serverless platform, not a continuous Node.js server. Vite apps on Vercel build static assets into `dist/`. Without `vercel.json` and an `/api` directory, Vercel had no handler for `POST /api/agent/chat`, causing the browser to receive a 404 or index HTML fallback.

---

## What Has Been Configured For You

We have already configured this repository with:

1. **`vercel.json`**:
   Configured URL rewrites so requests to `/api/(.*)` route to Vercel Serverless Functions, while all other requests route to the Vite frontend SPA.

2. **`/api/index.ts`**:
   A dedicated Vercel Serverless Function entry point that wraps the Express backend and handles `/api/agent/chat`, `/api/agent/revise`, and `/api/health`.

3. **Multi-Mount Endpoints in `server.ts`**:
   Both `/api/agent/chat` and `/agent/chat` are registered so requests succeed regardless of whether Vercel rewrites strip or keep the `/api` prefix.

4. **Helpful Diagnostics in `src/App.tsx` & `server.ts`**:
   If the API key is not configured, the app will explicitly guide you on what variable is missing and how to add it, rather than repeating a canned message.

---

## Step-by-Step Deployment Instructions

### Step 1: Push Your Code to GitHub
Ensure you pull or push the latest changes (including `vercel.json`, `/api/index.ts`, and updated `server.ts`) to your GitHub repository:
```bash
git add .
git commit -m "Configure Vercel serverless functions and API error handling"
git push origin main
```

### Step 2: Add `GEMINI_API_KEY` in Vercel
1. Log in to [vercel.com](https://vercel.com) and click on your imported project.
2. In the top navigation, go to **Settings**.
3. In the left sidebar, click **Environment Variables**.
4. Add a new variable:
   - **Key**: `GEMINI_API_KEY`
   - **Value**: Your Google Gemini API key (obtainable from [Google AI Studio](https://aistudio.google.com/app/apikey))
   - **Environments**: Check **Production**, **Preview**, and **Development**.
5. Click **Save**.

### Step 3: Trigger a Redeploy on Vercel
Environment variables in Vercel only take effect on new deployments:
1. In your Vercel project dashboard, go to the **Deployments** tab.
2. Click the three dots (`...`) next to your latest deployment.
3. Click **Redeploy**.
4. Leave "Use existing build cache" unchecked and click **Redeploy**.

---

## Verify Your Deployment

Once deployed:
1. **Health Check Endpoint:**
   Visit `https://<your-project>.vercel.app/api/health` in your browser.
   You should see:
   ```json
   {
     "status": "ok",
     "hasApiKey": true,
     "runtime": "vercel-serverless",
     "time": "..."
   }
   ```
   - If `"hasApiKey"` is `true`, your environment variable is working!
   - If `"hasApiKey"` is `false`, double check Step 2 and redeploy.

2. **Chat Testing:**
   Open the main web app at `https://<your-project>.vercel.app/`.
   Type any message. The agent will analyze your context, guide you through the therapeutic conflict resolution stages, and compose a letter when ready!

---

## Alternative: Deploy as a Container (Render / Railway / Cloud Run)

If you prefer deploying a standard continuous Node.js server instead of serverless functions:
- **Render / Railway / Fly.io / Heroku:**
  - Build Command: `npm run build`
  - Start Command: `npm start` (runs `node dist/server.cjs`)
  - Environment Variable: `GEMINI_API_KEY`
