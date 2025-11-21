# Contributing

Thanks for your interest in improving ProCirculariTool!

## Ground rules
- The app is client-side only; do not introduce network calls that send BoM or parameter data off-device.
- Keep TypeScript strictness intact (no `any`), add tests for non-trivial changes.
- Preserve accessibility: use semantic elements and consider high-contrast mode and keyboard users.
- Keep user-facing strings in the i18n files (EN/DE).

## Setup
```bash
npm install
npm run dev
```

## Quality checks
- `npm run lint`
- `npm run test` (Vitest)
- `npm run e2e` (Playwright; starts the dev server)
- `npm run build`

## Pull requests
- Describe the problem and solution clearly.
- Note any TODOs or placeholders added.
- Update `PROJECT_STATUS.md` (and docs) if behavior or scope changes.
