# GenAI Experiment Viewer

A standalone viewer for GenAI incremental experiments (e.g. Cursor/Copilot). It builds a full static site (viewer UI + step artifacts + metadata) suitable for GitHub Pages. The repo can be used standalone or vendored into consumer repos via **git subtree**.

- **Tech:** Vue 3 (Composition API), Vite, Vuetify. JavaScript only (no TypeScript).
- **Output:** Static site under `_site/` (or `viewer/_site/` when vendored). GitHub Pages should publish this folder, not the raw SPA `dist/`.

---

## 1. Overview

The viewer is a small Vue 3 SPA that loads:

- `./steps.json` — list of steps and metadata
- `./viewer-config.json` — branding/title/links
- `./step-XX/` — per-step builds (`index.html`, `notes.html`, `prompt.html` when present)

The **full static site** is produced by `npm run build:pages`, which:

1. Builds the viewer app into `_site/`
2. Writes `viewer-config.json` and `steps.json` into `_site/`
3. Either builds real step artifacts from the repo (tags or `step-*` folders) or generates mock steps in standalone mode

---

## 2. Standalone quick start

**Install:**

```bash
npm ci
npm ci --prefix viewer-app
```

**Build the full static site:**

```bash
npm run build:pages
```

**Preview the full static site:**

```bash
npm run preview:pages
```

This serves `_site/` (e.g. with `npx serve _site`). Open the URL shown to verify the viewer and step content.

---

## 3. Viewer-only workflow

For UI development without step artifacts:

- `npm run dev:viewer` — run the Vue dev server
- `npm run build:viewer` — build only the SPA to `viewer-app/dist/`
- `npm run preview:viewer` — preview the SPA build

These do **not** include `steps.json`, step folders, or `viewer-config.json`. Use `build:pages` and `preview:pages` for the complete site.

---

## 4. What `build:pages` produces

`_site/` contains:

| Path | Description |
|------|-------------|
| `index.html` + assets | Viewer UI (Vite build) |
| `steps.json` | Step list and metadata |
| `viewer-config.json` | Branding/config (from `viewer.config.json` at repo root) |
| `step-XX/` | One folder per step |
| `step-XX/index.html` | Step artifact (app or static page) |
| `step-XX/notes.html` | Optional notes (when present) |
| `step-XX/prompt.html` | Optional prompt (when present) |

**GitHub Pages:** Publish the contents of `_site/` (standalone repo) or `viewer/_site/` (consumer repo after vendoring). Do **not** publish only the SPA `dist/` — the build script checks that `index.html`, `steps.json`, `viewer-config.json`, and at least one `step-*/index.html` exist and exits with an error if not.

---

## 5. Consumer repo contract (for subtree)

After vendoring this repo into a consumer repo (e.g. under `viewer/`):

**Scripts the consumer should expose:**

- `build:pages` → run the viewer’s full build (e.g. `node viewer/scripts/build-pages.mjs`)
- Optional: `preview:pages` → serve the built site (e.g. `npx serve viewer/_site`)

**Recommended consumer `package.json` snippet:**

```json
{
  "scripts": {
    "build:pages": "node viewer/scripts/build-pages.mjs",
    "preview:pages": "npx serve viewer/_site"
  }
}
```

**Config:** The consumer repo should provide `viewer.config.json` at **its repo root** (site title, assistant name, repo URL, etc.). The build reads it and writes `viewer/_site/viewer-config.json` at build time.

---

## 6. GitHub Actions template

An example workflow is included in this repo:

- **[examples/github-pages-workflow.yml](examples/github-pages-workflow.yml)**

It:

- Uses Node 20, runs `npm ci` (root) and `npm ci --prefix viewer-app`, then `npm run build:pages`
- Uploads the Pages artifact from `_site` (standalone)

**For a consumer repo:** After vendoring, change the artifact path in the workflow to `viewer/_site` so GitHub Pages publishes the viewer’s built site from the correct directory.

---

## 7. Subtree notes

- **Add** the viewer as a subtree (e.g. `viewer` branch → `viewer/` in your repo):  
  `git subtree add --prefix=viewer <viewer-repo-url> main --squash`  
  (adjust branch and prefix as needed.)

- **Update** from upstream:  
  `git subtree pull --prefix=viewer <viewer-repo-url> main --squash`

This repo is the **source of truth** for the viewer; consumer repos pull in changes via subtree and only need to wire `build:pages` and, if desired, the example workflow (with `viewer/_site` as the artifact path).
