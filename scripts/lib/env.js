/**
 * Environment and paths for the build.
 * Works for both standalone (this repo) and consumer (viewer vendored under viewer/).
 */

import { fileURLToPath } from 'url'
import { dirname, join, resolve } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

/** Scripts directory (parent of lib/) */
export const SCRIPTS_DIR = resolve(__dirname, '..')

/** Viewer repo root: parent of scripts/. Standalone = this repo root; consumer = viewer/ */
export const VIEWER_ROOT = resolve(SCRIPTS_DIR, '..')

/** Repo root for config and step discovery: where viewer.config.json and step-* live. Standalone = VIEWER_ROOT; consumer = parent of viewer/ */
export const REPO_ROOT = (() => {
  const name = VIEWER_ROOT.split(/[/\\]/).pop()
  return name === 'viewer' ? resolve(VIEWER_ROOT, '..') : VIEWER_ROOT
})()

/** @deprecated Use VIEWER_ROOT */
export const VIEWER_DIR = VIEWER_ROOT

/** viewer-app directory */
export const VIEWER_APP_DIR = join(VIEWER_ROOT, 'viewer-app')

/** Output directory for the static site (_site) */
export const SITE_DIR = join(VIEWER_ROOT, '_site')

/** templates directory (next to scripts) */
export const TEMPLATES_DIR = join(SCRIPTS_DIR, 'templates')
