import { reactive } from 'vue'

/**
 * Shared viewer state: steps list and viewer config.
 * Fetched via api.js and stored here for components.
 */
export const state = reactive({
  steps: [],
  stepsLoading: true,
  stepsError: null,

  viewerConfig: null,
  viewerConfigLoading: true,
  viewerConfigError: null,
})

export function setSteps(data) {
  state.steps = data || []
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
