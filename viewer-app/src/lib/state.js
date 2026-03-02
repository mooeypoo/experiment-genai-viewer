import { reactive } from 'vue'

/**
 * Shared viewer state: steps list and viewer config.
 * Fetched via api.js and stored here for components.
 */

/** Normalize a step so it always has id and label (for display and routing). */
function normalizeStep(step) {
  if (!step || typeof step !== 'object') return null
  const id = step.id ?? step.tag ?? null
  const label = step.label ?? step.title ?? step.description ?? (id ? `Step ${String(id).replace(/^step-/i, '')}` : null)
  if (!id) return null
  return { ...step, id, label }
}

export const state = reactive({
  steps: [],
  stepsLoading: true,
  stepsError: null,

  viewerConfig: null,
  viewerConfigLoading: true,
  viewerConfigError: null,
})

export function setSteps(data) {
  const raw = data || []
  const list = Array.isArray(raw) ? raw : (raw.steps || [])
  state.steps = list.map(normalizeStep).filter(Boolean)
  state.stepsLoading = false
  state.stepsError = null
}

export function setStepsError(err) {
  state.steps = []
  state.stepsLoading = false
  state.stepsError = err
}

export function setViewerConfig(data) {
  state.viewerConfig = data
  state.viewerConfigLoading = false
  state.viewerConfigError = null
}

export function setViewerConfigError(err) {
  state.viewerConfig = null
  state.viewerConfigLoading = false
  state.viewerConfigError = err
}
