# Prototype Instructions

Run the local server yourself and open the preview in the browser available to this environment. Do not give the user server-start instructions when you can run it.

Before making substantial visual changes, use the Product Design plugin's `get-context` skill when the visual source is unclear or no longer matches the current goal. When the user gives durable prototype-specific design feedback, preferences, or decisions, record them in `AGENTS.md`.

When implementing from a selected generated mock, treat that image as the source of truth for layout, component anatomy, density, spacing, color, typography, visible content, and hierarchy.

Build app UI in `src/`. Keep `.openai/hosting.json`, `worker/index.js`, `scripts/prepare-sites-build.mjs`, and `tests/sites-worker.test.mjs` intact so the same local prototype can be handed to Sites. Before a Sites handoff, run `npm run build` and `npm run test:sites`; the build must leave `dist/client/index.html`, `dist/server/index.js`, and `dist/.openai/hosting.json`.

## Selected redesign direction

- The user selected visual concept 2: a warm ivory editorial portfolio with high-contrast serif display type, restrained vermilion accents, layered studio photographs in the hero, a split artist-story section, and a light three-column catalogue.
- Preserve bilingual RU/EN content, catalogue search/filtering, artwork details, and real artwork imagery.
- Public artist copy must stay limited to verified, non-sensitive facts; do not add private health, housing, or residency-application details.

## Information architecture

- Keep the site multi-page, with distinct routes for `/`, `/works`, `/about`, `/projects`, `/projects/human-trust`, `/projects/archive-of-passing`, and `/contact`.
- Preserve RU/EN switching across every route and keep the catalogue search, filters, sorting, progressive loading, and artwork dialog intact.
- Treat the artist biography and project descriptions supplied by the user as the canonical public narrative for these pages.
