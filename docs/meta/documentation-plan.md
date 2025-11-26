# Documentation Plan

This plan captures what exists, what to add, and who each section serves so we can scale the docs (local MkDocs + Read the Docs) without getting lost.

## Current assets
- User Guide (`docs/user-guide.md`)
- Developer Guide (`docs/developer-guide.md`)
- Calculation Logic (placeholder equations) (`docs/calculation-logic.md`)
- Roadmap (`docs/roadmap.md`)
- Meta docs (`docs/meta/*`: architecture, project status, contributing, GPT usage)

## Audiences
- **Practitioners (primary):** sustainability/product teams running PCI scenarios.
- **Contributors:** engineers/designers extending the tool.
- **Reviewers/decision-makers:** want methodology provenance and change log.

## Proposed structure (MkDocs/RTD)
- **Getting started:** install/run, supported browsers, sample BoMs, privacy note.
- **User guide:** upload/mapping, parameter-level selection & inheritance, calculation run, exports.
- **Parameters reference:** definitions, units, defaults, inheritance rules, TODO links to sources.
- **Calculation logic:** final equations and assumptions (replace placeholders); worked examples.
- **Data model:** BoM schema, product/component/material types, mapping rules.
- **FAQ/Troubleshooting:** common upload/mapping issues, mass-balance warnings.
- **Development:** stack, commands, testing, lint/format, architecture, contributing, release checklist.
- **Roadmap & status:** milestones and current gaps.

## Near-term tasks
- [ ] Fill **Parameters reference** with the 14 inputs (names, abbreviations, units, expected ranges, source links).
- [ ] Replace placeholder logic notes with validated equations in **Calculation logic**.
- [ ] Add diagrams: data flow (upload → mapping → parameters → calc → results), and parameter inheritance (product → component → material).
- [ ] Add sample walkthrough: run washing-machine CSV through all steps with screenshots.
- [ ] Document error handling: mass-balance warnings/errors, unsupported units.
- [ ] Add accessibility and privacy statements.

## What I need from you
- Final/default parameter values with sources (papers/DOIs/internal references).
- Any branding/visual guidance (logos, color constraints) for Read the Docs.
- Preferred voice/tone and target depth (e.g., primer vs. formal spec) for calculation details.
- Screenshots/GIFs you want included, or approval to capture new ones.
- Confirmation on analytics/privacy stance for the public docs (currently “no analytics, client-only”).

## Workflow
- Author in `docs/`; run `mkdocs serve -f mkdocs.yml` locally (`mkdocs.yml` inherits `config/mkdocs.yml`).
- RTD config is in `.readthedocs.yaml` and uses `docs/requirements.txt`.
- Keep meta/repo docs under `docs/meta/`; user-facing content stays at the top level.
