/**
 * steps.json structure and generation helpers.
 * Steps array: { id, num, title, tag, hasNotes, hasPrompt, label }.
 */

export function stepLabel(step) {
  const title = step.title || `Step ${String(step.num).padStart(2, '0')}`
  return step.short ? `Step ${String(step.num).padStart(2, '0')} — ${step.short}` : title
}

export function buildStepsJson(steps) {
  return steps.map((s) => ({
    id: s.id,
    num: s.num,
    title: s.title || `Step ${String(s.num).padStart(2, '0')}`,
    tag: s.tag ?? null,
    hasNotes: !!s.hasNotes,
    hasPrompt: !!s.hasPrompt,
    label: stepLabel(s),
  }))
}
