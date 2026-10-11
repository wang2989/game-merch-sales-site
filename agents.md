# Agent Guidelines & Project Instructions: Game Merch Sales Site

This document serves as the guide for AI coding agents and developers working on the **Game Merch Sales Site** frontend codebase.

---

## 1. Project Overview

- **Project Name:** `game-merch-sales-site`
- **Application Type:** Single Page Application (SPA) frontend
- **Tech Stack:**
  - **Framework:** React 19
  - **Build Tool / Bundler:** Vite
  - **Language:** JavaScript (ESModules / JSX)
  - **Linter:** ESLint (flat config via `eslint.config.js`)
  - **Node Environment:** Node.js v20+ / npm v10+

---

## 2. Essential Commands

Always verify commands in the repository root:

| Command | Description |
| :--- | :--- |
| `npm run dev` | Starts local development server with Hot Module Replacement (HMR). |
| `npm run build` | Builds production-ready static assets to the `/dist` directory. |
| `npm run preview` | Locally serves the production build from `/dist` for testing. |
| `npm run lint` | Runs ESLint across the codebase to catch style and syntax issues. |

> **Agent Rule:** Always run `npm run lint` and `npm run build` before finalizing any changes to ensure the build compiles without errors or warnings.

---

## 3. Agent Workflow Rules

1. **Verify Before Delivering:**
   - Run `npm run lint` to confirm no linting errors.
   - Run `npm run build` to confirm zero compilation errors.
2. **Preserve Configuration:**
   - Do not overwrite existing configuration files (`vite.config.js`, `eslint.config.js`, `.gitignore`) unless specifically instructed.
   - Respect `.gitignore` rules (never commit `/dist`, `/node_modules`, `.env.local`, or cache directories).
3. **Incremental & Clean Changes:**
   - Keep changes focused and modular.
   - Preserve existing code comments and adhere to established patterns in the project.
