Act as a Senior Frontend Engineer specialized in React, Next.js (App Router), and Vercel deployments. 

Your objective is to build the frontend application for the "Projeto Futebol Brasileiro 2.0" dashboard, ensuring it is 100% optimized for a seamless deployment on Vercel.

### 1. ARCHITECTURE & DATA HANDLING (SERVERLESS OPTIMIZED)
- Since this application will be hosted on Vercel, we will avoid requiring a live Python backend server during runtime.
- Create a `/src/data` directory to store the static JSON outputs from the simulation engine (`clubes.json`, `calendario_geral.json`, and `perfis_dashboard.json`).
- Implement Next.js Server Components to read these files directly from the filesystem during build time (SSG) or client-side fetch if simulation state toggles are triggered.

### 2. COMPONENT STRUCTURE
Create a clean, modular structure under `/src/components`:
- `DashboardHero.tsx`: High-level metrics display (192 Active Clubs, 60-game physical cap, 21 double-match weeks vs 21 single/free weeks).
- `RegionalLeagues.tsx`: Tabs implementation using Shadcn/ui to easily navigate between the 6 Regional Leagues (Paulista, Nordeste, Sulista, Mineira/CO, Guanabara-Capixaba, Norte) showing Serie A and B tables with qualification badges.
- `InteractiveTimeline.tsx`: A search filter component allowing users to pick a club and see their 42-week calendar visualization, dynamically highlighting match days vs free midweeks.
- `ChampionsCup.tsx`: A visual presentation of the 48-team tournament layout (12 groups of 4 and the single-leg knockout tree).

### 3. TECH STACK & STYLING SPECIFICATIONS
- **Framework:** Next.js (TypeScript enabled).
- **Stylization:** TailwindCSS styled with a dark, premium sports analytics theme (slate/zinc dark backgrounds, neon accents for qualification zones).
- **UI Components:** Radix UI primitives or pre-configured Shadcn/ui elements (Tabs, Dialog, Card, Badge, Select, Command/Combobox).
- **Data Visualization:** Recharts for the horizontal bar charts comparing player workload profiles (Elite vs. Mid-tier vs. Lower-tier).

Ensure the project compiles with strict TypeScript rules, has zero hydration errors, and is completely ready to deploy on Vercel with a standard `next build` command.