/**
 * All fetches use relative URLs so the viewer works under GitHub Pages subpaths.
 * e.g. ./steps.json, ./step-01/notes.html — resolved by the browser from current location.
 */

export async function fetchJson(relativePath) {
  const res = await fetch(relativePath)
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${relativePath}`)
  return res.json()
}

export async function fetchHtml(relativePath) {
  const res = await fetch(relativePath)
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${relativePath}`)
  return res.text()
}

export function fetchSteps() {
  return fetchJson('./steps.json')
}

export function fetchViewerConfig() {
  return fetchJson('./viewer-config.json')
}

export function fetchStepNotes(stepId) {
  return fetchHtml(`./${stepId}/notes.html`)
}

export function fetchStepPrompt(stepId) {
  return fetchHtml(`./${stepId}/prompt.html`)
}
