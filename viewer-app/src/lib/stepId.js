/**
 * Normalize step route param to canonical step-XX form.
 * Accepts "01" or "step-01" and returns "step-01".
 */
export function normalizeStepId(param) {
  if (!param || typeof param !== 'string') return null
  const trimmed = param.trim()
  if (/^step-\d+$/i.test(trimmed)) return trimmed.toLowerCase()
  if (/^\d+$/.test(trimmed)) return `step-${trimmed.padStart(2, '0')}`
  return null
}

export function stepIdToNum(stepId) {
  if (!stepId || !/^step-(\d+)$/i.test(stepId)) return null
  return parseInt(stepId.replace(/^step-/i, ''), 10)
}
