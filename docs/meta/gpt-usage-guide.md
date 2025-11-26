# GPT / Codex Usage Guide

Use this guide to collaborate with ChatGPT/Codex effectively on ProCirculariTool.

## Before asking for help
- Skim `meta/architecture.md`, `meta/project-status.md`, and `roadmap.md` (in `docs/`) to align on current shape and priorities.
- Gather the relevant files or excerpts (components, core logic, tests) and share concise snippets in your prompt.

## Good prompt patterns
- **Targeted change:**
  - "Update `calculationEngine.ts` to use the new PCI equation (attached) and extend `CalculationResult` with X. Also update the results table."
- **Refactor:**
  - "Refactor `WhatIfPanel` to memoize sensitivity calls and avoid duplicate calculations. Ensure tests still pass."
- **Design guidance:**
  - "Propose an accessible high-contrast palette for Mantine themes and update `theme.ts` accordingly."
- **Bug reproduction:**
  - "When uploading a CSV with grams, unit conversion fails. Here are the first 5 rows. Please add a unit validation step."

## Workflow suggestions
1. Explain current behavior and desired outcome, plus any constraints (performance, privacy, UX).
2. Provide file paths and the specific blocks to change; include current code if small enough.
3. After AI-assisted edits, run `npm run lint`, `npm run test`, and, if relevant, `npm run e2e`.
4. Update `meta/project-status.md` (and `roadmap.md`/`meta/architecture.md` if needed) after significant changes.
5. Keep privacy constraints in mind: BoM data must remain client-side; avoid adding network calls.
