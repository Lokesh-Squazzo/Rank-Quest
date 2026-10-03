# 💻 RankQuest Frontend

> The responsive, high-performance web client for **RankQuest**, built with React 18, Vite 5, Tailwind CSS, and the Monaco Editor.

---

## ⚡ Features

- **Integrated Monaco Code Editor**: Feature-rich web code editor with auto-completion, bracket matching, syntax highlighting, and custom dark mode themes.
- **Real-Time Code Execution**: Submits source code to the Judge0 CE API via RapidAPI for instant evaluation against custom and hidden test cases.
- **Dynamic Leaderboards**: Switch between Global rankings and filtered College/Campus leaderboards.
- **User Profile & Activity Tracking**:
  - Live problem-solving statistics (Easy, Medium, Hard distribution).
  - Streak tracking (current & longest).
  - Submissions history table with runtime, memory, and verdict tags.
  - Avatar management: file upload with instant camera click or 6 developer avatar presets.
- **Modern Security & Settings**:
  - JWT token-based auth with auto-refresh and protected route wrappers.
  - In-app password change and forgot-password recovery modals.
- **Real-time Contributor Showcase (`/about`)**: Live GitHub API queries fetching active contributors, total commits, and project metrics.
- **Responsive Dark Design**: Tailored glassmorphism UI with Tailwind CSS, custom gradients, and micro-interactions.

---

## 🛠️ Tech Stack & Dependencies

- **Core Framework**: [React 18](https://react.dev/)
- **Bundler & Dev Server**: [Vite 5](https://vitejs.dev/)
- **Styling**: [Tailwind CSS 3](https://tailwindcss.com/) with PostCSS & Autoprefixer
- **Code Editor**: [@monaco-editor/react](https://github.com/suren-atoyan/monaco-react)
- **Icons**: [lucide-react](https://lucide.dev/)
- **HTTP Client**: [Axios](https://axios-http.com/)
- **Routing**: [React Router DOM v6](https://reactrouter.com/)

---

## 🚀 Getting Started

### Prerequisites

- **Node.js**: `v18.0.0` or higher
- **npm**: `v9.0.0` or higher

### Installation

1. Navigate to the frontend directory:
   ```bash
   cd Front-End
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   ```bash
   cp .env.example .env
   ```
   Edit `.env`:
   ```env
   VITE_API_BASE_URL=http://localhost:8080/api
   VITE_JUDGE0_API_KEY=your_rapidapi_judge0_key_here
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 📜 Available Scripts

| Script | Command | Description |
| :--- | :--- | :--- |
| **Dev** | `npm run dev` | Runs the Vite dev server with Hot Module Replacement (HMR) at port `5173` |
| **Build** | `npm run build` | Compiles and optimizes assets into the `dist/` directory |
| **Preview** | `npm run preview`| Locally previews the production build in `dist/` |
| **Lint** | `npm run lint` | Runs ESLint to check for code quality and syntax issues |

---

## 🗺️ Application Routing

| Route | Page Component | Access | Description |
| :--- | :--- | :---: | :--- |
| `/` | `Dashboard.jsx` | Public | Landing page hero, problem sheets carousel, and stats |
| `/explore` | `Explore.jsx` | Public | Explore curated DSA sheets and problem sets |
| `/sheet/:id` | `SheetDetails.jsx`| Public | View problems contained within a specific sheet |
| `/solve/:id` | `ProblemSolver.jsx`| Public / Auth | Code editor, problem statement, test cases, and runner |
| `/rankings` | `Rankings.jsx` | Public | Global and college-specific leaderboard |
| `/profile` | `Profile.jsx` | Protected | User statistics, avatar quick-update, and submission history |
| `/settings` | `Settings.jsx` | Protected | Avatar picker, profile details, and password change |
| `/about` | `About.jsx` | Public | Contributors showcase with live GitHub metrics |
| `/admin/*` | `Admin*.jsx` | Admin | Administrative portal for user and content management |

---

## 📁 Directory Structure

```text
Front-End/
├── public/                 # Static assets and icons
├── src/
│   ├── assets/             # Images and design assets
│   ├── components/
│   │   ├── auth/           # ProtectedRoute and Auth modals
│   │   ├── layout/         # Navbar, Footer, and common wrappers
│   │   └── ui/             # Buttons, Cards, Inputs, and Badges
│   ├── context/
│   │   └── AuthContext.jsx # Global user authentication state
│   ├── docs/
│   │   └── API_Specification.md # Full API documentation
│   ├── pages/              # Primary route views
│   ├── services/
│   │   └── apiService.js   # Centralized Axios client & API endpoints
│   ├── App.jsx             # Main routing provider
│   ├── index.css           # Global Tailwind directives & dark theme utilities
│   └── main.jsx            # Application entry point
├── .env.example            # Environment variables template
├── tailwind.config.js      # Tailwind theme configuration
├── vercel.json             # SPA fallback routing for Vercel
└── vite.config.js          # Vite build configuration
```

---

## 🚢 Deployment

The frontend is optimized for zero-config deployment on **Vercel** or **Netlify**:
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- The included `vercel.json` ensures that client-side HTML5 routing (`pushState`) works seamlessly without 404 errors on page reload.
