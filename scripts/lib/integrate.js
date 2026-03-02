/**
 * Detect step definitions and build step artifacts (integrated mode).
 * 1) Prefer git tags: step-01, step-02, ...
 * 2) Or step folders: step-01, step-02, ... in repo root
 * 3) Or manifest file if present
 */

import { execSync } from 'child_process'
import { join } from 'path'
import { existsSync, readdirSync } from 'fs'
import { REPO_ROOT } from './env.js'
import { listDir, exists, readText, copyDir, removeDir, ensureDir, writeText } from './fs.js'
import { renderMarkdownFile, wrapProse } from './markdown.js'

const STEP_TAG_RE = /^step-(\d+)$/i
const STEP_DIR_RE = /^step-(\d+)$/

function parseStepNum(id) {
  const m = id.match(/^step-(\d+)$/i)
  return m ? parseInt(m[1], 10) : null
}

/**
 * Discover step IDs: from git tags, or step-* directories, or manifest.
 */
export function discoverSteps() {
  const fromTags = discoverFromTags()
  if (fromTags.length > 0) return fromTags

  const fromDirs = discoverFromStepDirs()
  if (fromDirs.length > 0) return fromDirs

  const fromManifest = discoverFromManifest()
  if (fromManifest.length > 0) return fromManifest

  return []
}

function discoverFromTags() {
  try {
    const out = execSync('git tag -l "step-*"', { cwd: REPO_ROOT, encoding: 'utf-8' })
    const tags = out.trim().split(/\s+/).filter(Boolean)
    return tags.sort((a, b) => {
      const na = parseStepNum(a)
      const nb = parseStepNum(b)
      return (na || 0) - (nb || 0)
    })
  } catch {
    return []
  }
}

function discoverFromStepDirs() {
  const entries = listDir(REPO_ROOT)
  const dirs = entries
    .filter((e) => e.isDirectory() && STEP_DIR_RE.test(e.name))
    .map((e) => e.name)
    .sort((a, b) => {
      const na = parseStepNum(a)
      const nb = parseStepNum(b)
      return (na || 0) - (nb || 0)
    })
  return dirs
}

function discoverFromManifest() {
  const manifestPath = join(REPO_ROOT, 'steps.json')
  if (!exists(manifestPath)) return []
  try {
    const data = JSON.parse(readText(manifestPath))
    const arr = Array.isArray(data) ? data : data.steps || []
    return arr.map((s) => (typeof s === 'string' ? s : s.id)).filter(Boolean)
  } catch {
    return []
  }
}

/**
 * Build one step and write to siteDir/step-XX/.
 * Returns { id, num, title, tag, hasNotes, hasPrompt } for steps.json.
 */
export function buildStep(stepId, siteDir, options = {}) {
  const num = parseStepNum(stepId)
  if (num == null) return null

  const stepOutDir = join(siteDir, stepId)
  removeDir(stepOutDir)
  ensureDir(stepOutDir)

  const useTags = options.useTags !== false && discoverFromTags().length > 0
  let built = false
  let hasNotes = false
  let hasPrompt = false
  let title = `Step ${String(num).padStart(2, '0')}`
  let tag = null

  if (useTags) {
    const result = buildStepFromTag(stepId, stepOutDir, options)
    if (result) {
      built = true
      hasNotes = result.hasNotes
      hasPrompt = result.hasPrompt
      title = result.title || title
      tag = stepId
    }
  }

  if (!built) {
    const result = buildStepFromFolder(stepId, stepOutDir)
    if (result) {
      built = true
      hasNotes = result.hasNotes
      hasPrompt = result.hasPrompt
      title = result.title || title
    }
  }

  if (!built) return null

  return {
    id: stepId,
    num,
    title,
    tag: useTags ? stepId : null,
    hasNotes,
    hasPrompt,
  }
}

function buildStepFromTag(stepId, stepOutDir, options = {}) {
  const worktree = join(REPO_ROOT, '.wt-' + stepId)
  try {
    execSync(`git worktree add "${worktree}" ${stepId}`, { cwd: REPO_ROOT, stdio: 'pipe' })
  } catch {
    return null
  }

  try {
    const num = stepId.replace(/^step-/i, '')
    const notesPath = join(worktree, 'docs', 'agent-notes', `${num}.md`)
    const promptPathA = join(worktree, 'docs', 'prompts', `step-${num}.md`)
    const promptPathB = join(worktree, 'docs', 'prompts', `${num}.md`)

    let title = `Step ${num.padStart(2, '0')}`
    let hasNotes = false
    let hasPrompt = false

    const pkgPath = join(worktree, 'package.json')
    const distPath = join(worktree, 'dist')
    if (existsSync(pkgPath)) {
      try {
        execSync('npm ci', { cwd: worktree, stdio: 'pipe' })
      } catch {}
      const base = options.basePath ? options.basePath.replace('${step}', stepId) : './'
      execSync(`npx vite build --base="${base}" --outDir="${stepOutDir}"`, { cwd: worktree, stdio: 'pipe' })
    } else if (existsSync(distPath)) {
      copyDir(distPath, stepOutDir)
    }

    if (existsSync(notesPath)) {
      const html = renderMarkdownFile(notesPath)
      if (html) {
        writeText(join(stepOutDir, 'notes.html'), wrapProse(html))
        hasNotes = true
        const h1 = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i)
        if (h1 && h1[1]) {
          const raw = h1[1].replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').trim()
          if (raw) title = raw
        }
      }
    }
    const promptPath = existsSync(promptPathA) ? promptPathA : promptPathB
    if (promptPath && existsSync(promptPath)) {
      const html = renderMarkdownFile(promptPath)
      if (html) {
        writeText(join(stepOutDir, 'prompt.html'), wrapProse(html))
        hasPrompt = true
      }
    }

    return { title, hasNotes, hasPrompt }
  } finally {
    try {
      execSync(`git worktree remove "${worktree}" --force`, { cwd: REPO_ROOT, stdio: 'pipe' })
    } catch {}
  }
}

function buildStepFromFolder(stepId, stepOutDir) {
  const stepDir = join(REPO_ROOT, stepId)
  if (!existsSync(stepDir)) return null

  const num = stepId.replace(/^step-/i, '')
  const notesPath = join(REPO_ROOT, 'docs', 'agent-notes', `${num}.md`)
  const promptPathA = join(REPO_ROOT, 'docs', 'prompts', `step-${num}.md`)
  const promptPathB = join(REPO_ROOT, 'docs', 'prompts', `${num}.md`)

  let title = `Step ${num.padStart(2, '0')}`
  let hasNotes = false
  let hasPrompt = false

  const pkgPath = join(stepDir, 'package.json')
  const distPath = join(stepDir, 'dist')
  if (existsSync(pkgPath)) {
    try {
      execSync('npm run build', { cwd: stepDir, stdio: 'pipe' })
    } catch {}
    if (existsSync(distPath)) copyDir(distPath, stepOutDir)
  } else if (existsSync(distPath)) {
    copyDir(distPath, stepOutDir)
  } else {
    const rootDist = join(REPO_ROOT, 'dist')
    const rootPkg = join(REPO_ROOT, 'package.json')
    if (existsSync(rootPkg) && existsSync(rootDist)) {
      copyDir(rootDist, stepOutDir)
    }
  }

  if (existsSync(notesPath)) {
    const html = renderMarkdownFile(notesPath)
    if (html) {
      writeText(join(stepOutDir, 'notes.html'), wrapProse(html))
      hasNotes = true
      const h1 = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i)
      if (h1 && h1[1]) {
        const raw = h1[1].replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').trim()
        if (raw) title = raw
      }
    }
  }
  const promptPath = existsSync(promptPathA) ? promptPathA : promptPathB
  if (promptPath && existsSync(promptPath)) {
    const html = renderMarkdownFile(promptPath)
    if (html) {
      writeText(join(stepOutDir, 'prompt.html'), wrapProse(html))
      hasPrompt = true
    }
  }

  return { title, hasNotes, hasPrompt }
}

export function hasIntegratedSteps() {
  return discoverSteps().length > 0
}
