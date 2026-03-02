/**
 * Load or create viewer.config.json at repo root.
 */

import { join } from 'path'
import { readJson, writeJson, exists } from './fs.js'
import { REPO_ROOT } from './env.js'

const CONFIG_PATH = join(REPO_ROOT, 'viewer.config.json')

const DEFAULTS = {
  siteTitle: 'GenAI Incremental Experiment Viewer',
  assistantName: '',
  repoUrl: '',
  otherExperimentUrl: '',
  footerName: 'Moriel Schottlender',
  footerUrl: 'https://moriel.tech',
  description: '',
  /** Base path for step pages when deployed (e.g. "" for root, "/viewer" for subpath). Empty = preview/root. */
  pagesURL: '',
}

export function loadViewerConfig() {
  if (!exists(CONFIG_PATH)) {
    writeJson(CONFIG_PATH, DEFAULTS)
    return DEFAULTS
  }
  try {
    const data = readJson(CONFIG_PATH)
    return { ...DEFAULTS, ...data }
  } catch {
    return DEFAULTS
  }
}
