# NUSPlanner web app

The production NUSPlanner client is a React, TypeScript, and Vite application. It uses the existing NUSMods, community, and EmailJS integrations.

## Local development

Requirements: Node.js 20 and npm.

```bash
npm ci
npm run dev
```

Vite serves the app with hot reload. Copy `.env.example` to `.env.local` only when you need to override optional configuration.

## Quality checks

Run the complete release gate before merging:

```bash
npm run check
```

This runs TypeScript validation, ESLint, the Jest suite, and the optimized Vite build. Build output is written to `dist/`.

## Configuration

`VITE_COMMUNITY_API_URL` overrides the existing community service origin. The current API remains the local fallback. HTTPS deployments should set this variable to an HTTPS endpoint that exposes the same routes, otherwise browsers can block community requests as mixed content.

NUSMods requests continue to use `https://api.nusmods.com/v2/` directly.

## Deployment

Pushing `main` runs `.github/workflows/deploy-pages.yml`. The workflow installs locked dependencies, runs every quality gate, builds `website/dist`, and publishes that artifact to GitHub Pages.

The Vite base path is `/NUSplanner/`, matching the current repository Pages URL. For another repository name or a root-domain deployment, update `base` in `vite.config.ts`.
