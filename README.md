# PrepAI — AI Mock Interview & Study Mentor Platform

PrepAI is a modern, clean, production-grade AI learning and interview preparation platform for software engineering candidates. Using PrepAI, candidates can specialized in modern topics (JavaScript & Frontend, Python Backend, Data Structures & Algorithms, AI/ML, and Behavioral HR), answer tailored mock questions generated on the fly, and receive expert rating reports detailing strengths, gaps, and exemplary solutions.

## ✨ Core Features
*   **Startup Aesthetic Layout**: Framed under an eye-safe, slate-cosmic dark design featuring glassmorphism, glowing accents, and dynamic layout transitions.
*   **Chamber Customization matrix**: Tailor practice chambers by categories and experience difficulties (Easy, Medium, Hard).
*   **Gemini 3.5 Synthesis Engine**: Leverages real-time AI to generate challenging development scenarios with custom hints to guide users under pressure.
*   **Automated Evaluation Reports**: High-precision grading detailing raw scores out of 10, identified strengths, recommended revisions, and speech feedback.
*   **Side-by-Side Code Review Tab**: Compares candidate draft replies side-by-side with senior-leveraged reference templates.
*   **Persistence & Analytics**: Completion streaks, average analytical score histories, and syllabus ratio curves saved automatically to localStorage.
*   **Pre-populated Onboarding State**: Automatically bootstraps sample historical responses so recruiters don't witness blank metrics.

---

## 🛠️ Technological Stack
*   **Frontend**: React (v19) with Vite, Tailwind CSS (v4) for custom utility layouts, and Lucide icons.
*   **Animation**: Framer Motion (Framer package).
*   **Backend**: Node.js Express Server serving as a secure proxy to preserve API key confidentiality.
*   **AI Engine**: `@google/genai` TypeScript SDK utilizing the `gemini-3.5-flash` model.

---

## 💻 Local Setup & Run Instructions

To run **PrepAI** on your personal machine, follow these steps:

### 1. Clone & Preparation
Ensure you have Node.js (v18+) and npm installed. Download the directory and navigate into it:
```bash
cd react-example
```

### 2. Configure Environment Secrets
Create a `.env` file at the root level of your directory (or modify the existing `.env.example`) and insert your Gemini API Key:
```env
# Create .env and supply keys
GEMINI_API_KEY="YOUR_ACTUAL_GEMINI_API_KEY"
```
*Note: Get your free API key at [Google AI Studio](https://aistudio.google.com/).*

### 3. Install Dependencies
Installs required packages for Express and compiled Vite modules:
```bash
npm install
```

### 4. Execute Development Client & Server
Start the dual full-stack Express reverse proxy. This binds to port `3000` automatically:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your web browser.

### 5. Production Compilation
To bundle both the frontend static views and compile the backend proxy using esbuild:
```bash
npm run build
npm run start
```

---

## 🚀 Deploying to Vercel / Cloud Run

### Option A: Serverless Vercel Deployment (Full-Stack)
Vercel supports serverless full-stack out of the box. Setup the directory as follows:

1.  Create a `vercel.json` file in the root to map Express routes as Serverless Functions:
    ```json
    {
      "rewrites": [
        { "source": "/api/(.*)", "destination": "/api/index.js" },
        { "source": "/(.*)", "destination": "/dist/$1" }
      ]
    }
    ```
2.  Push code to your GitHub repository.
3.  Import the repository into Vercel and set the following environment variable in your Vercel Project Dashboard:
    *   `GEMINI_API_KEY` = `[Your Google AI Studio API Key]`
4.  Deploy! Vercel will host the compiled static assets and resolve serverless function routes.

### Option B: Containerized Cloud Run Deployment (Standard Production)
This project is fully docker-ready. Because it serves on host `0.0.0.0` and port `3000`, you can deploy it on GCP Cloud Run inside a standard Node.js alpine container.
```dockerfile
# Standard Dockerfile blueprint
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "start"]
```

---

## 📁 Repository Map
```text
├── .env.example             # Documented secret matrix
├── package.json             # Build commands and custom dependencies
├── server.ts                # Express backend proxy servicing Gemini requests
├── tsconfig.json            # Strict TypeScript compilation options
├── vite.config.ts           # Vite Bundler with client-server HMR disabled
├── src/
│   ├── App.tsx              # Application state and views orchestrator
│   ├── main.tsx             # DOM entry renderer
│   ├── types.ts             # Performance, questions, and session structures
│   ├── data.ts              # Tracks, timelines, and static metrics
│   ├── index.css            # Google Font mappings and core Tailwind @import
│   └── components/
│       ├── Navbar.tsx       # responsive header and streak indicators
│       ├── Hero.tsx         # modern timeline & bento benefits section
│       ├── SetupForm.tsx    # topic / difficulty picker
│       ├── InterviewPanel.tsx  # typing question & text editor input UI
│       ├── EvaluationPanel.tsx # Radial score meter, strengths / reviews
│       ├── HistoryPanel.tsx # Historical search & collapsible ledger lists
│       └── PerformanceDashboard.tsx # SVG trendline curves & XP gaming indicators
```

*Crafted proudly under the AI Studio Build workflow to provide a benchmark-ready candidate review tool.*
