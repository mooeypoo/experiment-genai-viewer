#!/usr/bin/env node
/**
 * Canonical build script for the step viewer site.
 * Generates the static folder `_site/` at viewer repo root.
 *
 * MODE 1 — Integrated: step sources present (tags or step-* folders).
 *   Builds step artifacts, renders docs, emits steps.json from real data.
 *
 * MODE 2 — Standalone: no step sources. Generates mock step artifacts
 *   and steps.json so the viewer can be tested in isolation.
 */

import { spawnSync } from 'child_process'
import { join } from 'path'
import { existsSync, readdirSync } from 'fs'
import { REPO_ROOT, SITE_DIR, VIEWER_APP_DIR, TEMPLATES_DIR } from './lib/env.js'
import { loadViewerConfig } from './lib/config.js'
import { writeJson, ensureDir, removeDir, writeText, readText } from './lib/fs.js'
import { buildStepsJson } from './lib/steps.js'
import { discoverSteps, buildStep, hasIntegratedSteps } from './lib/integrate.js'

function log(msg) {
  console.log(msg)
}

function run(cmd, args, cwd) {
  const r = spawnSync(cmd, args, { cwd: cwd || REPO_ROOT, stdio: 'inherit', shell: true })
  if (r.status !== 0) {
    process.exit(r.status ?? 1)
  }
}

// ─── Clean and prepare ─────────────────────────────────────────────────────
removeDir(SITE_DIR)
ensureDir(SITE_DIR)

// ─── Build viewer app into _site/ first (so Vite can emptyOutDir safely) ─────
log('Building viewer app into _site/...')
run('npx', ['vite', 'build', '--outDir', SITE_DIR], VIEWER_APP_DIR)

// ─── Viewer config ─────────────────────────────────────────────────────────
const viewerConfig = loadViewerConfig()
writeJson(join(SITE_DIR, 'viewer-config.json'), viewerConfig)
log('Emitted viewer-config.json')

// ─── Steps: integrated or mock ─────────────────────────────────────────────
let stepsData = []

if (hasIntegratedSteps()) {
  log('Integrated mode: building step artifacts from repo.')
  const stepIds = discoverSteps()
  for (const stepId of stepIds) {
    log(`  Building ${stepId}...`)
    const meta = buildStep(stepId, SITE_DIR)
    if (meta) {
      stepsData.push(meta)
    }
  }
} else {
  log('Standalone mode: generating mock step artifacts.')
  stepsData = [
    { id: 'step-01', num: 1, title: 'Step 01 — Mock step with docs', tag: null, hasNotes: true, hasPrompt: true },
    { id: 'step-02', num: 2, title: 'Step 02 — Mock step missing docs', tag: null, hasNotes: false, hasPrompt: false },
  ]
  const missingNotes = readText(join(TEMPLATES_DIR, 'missing-notes.html'))
  const missingPrompt = readText(join(TEMPLATES_DIR, 'missing-prompt.html'))
  for (const step of stepsData) {
    const stepDir = join(SITE_DIR, step.id)
    ensureDir(stepDir)
    const indexHtml = `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>${step.title}</title></head><body><h1>${step.title}</h1><p>Mock step artifact. In standalone mode the viewer is tested with placeholder content.</p></body></html>`
    writeText(join(stepDir, 'index.html'), indexHtml)
    if (step.hasNotes) {
      writeText(join(stepDir, 'notes.html'), '<div class="prose"><h1>Mock notes</h1><p>Sample notes for this step.</p></div>')
    } else {
      writeText(join(stepDir, 'notes.html'), missingNotes)
    }
    if (step.hasPrompt) {
      writeText(join(stepDir, 'prompt.html'), '<div class="prose"><h1>Mock prompt</h1><p>Sample prompt for this step.</p></div>')
    } else {
      writeText(join(stepDir, 'prompt.html'), missingPrompt)
    }
  }
}

const stepsJson = buildStepsJson(stepsData)
writeJson(join(SITE_DIR, 'steps.json'), stepsJson)
log('Emitted steps.json')

// ─── Guardrails: ensure we did not deploy SPA-only ───────────────────────────
function verifyFullBuild() {
  const indexPath = join(SITE_DIR, 'index.html')
  const stepsPath = join(SITE_DIR, 'steps.json')
  const configPath = join(SITE_DIR, 'viewer-config.json')
  if (!existsSync(indexPath) || !existsSync(stepsPath) || !existsSync(configPath)) {
    console.error('Build produced SPA only; missing steps.json/step outputs. Ensure build-pages generates artifacts into _site.')
    if (!existsSync(indexPath)) console.error('  Missing: _site/index.html')
    if (!existsSync(stepsPath)) console.error('  Missing: _site/steps.json')
    if (!existsSync(configPath)) console.error('  Missing: _site/viewer-config.json')
    process.exit(1)
  }
  const entries = readdirSync(SITE_DIR, { withFileTypes: true })
  const hasStepDir = entries.some((e) => e.isDirectory() && /^step-\d+$/.test(e.name))
  if (!hasStepDir) {
    console.error('Build produced SPA only; missing steps.json/step outputs. Ensure build-pages generates artifacts into _site.')
    console.error('  Missing: at least one _site/step-*/ folder (e.g. step-01/index.html)')
    process.exit(1)
  }
  const stepDirs = entries.filter((e) => e.isDirectory() && /^step-\d+$/.test(e.name))
  const hasStepIndex = stepDirs.some((d) => existsSync(join(SITE_DIR, d.name, 'index.html')))
  if (!hasStepIndex) {
    console.error('Build produced SPA only; missing steps.json/step outputs. Ensure build-pages generates artifacts into _site.')
    console.error('  Missing: at least one _site/step-XX/index.html')
    process.exit(1)
  }
}
verifyFullBuild()
log('Done. Output: _site/')
