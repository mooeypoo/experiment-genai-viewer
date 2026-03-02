/**
 * Fallback data when steps.json or viewer-config.json are missing
 * (e.g. viewer run standalone or outside the experiment repo).
 */

export const MOCK_STEPS = [
  { id: 'step-01', num: 1, title: 'Step 01 — Sample step', tag: null, hasNotes: true, hasPrompt: true, label: 'Step 01 — Sample step' },
  { id: 'step-02', num: 2, title: 'Step 02 — Sample step', tag: null, hasNotes: false, hasPrompt: false, label: 'Step 02 — Sample step' },
  { id: 'step-03', num: 3, title: 'Step 03 — Sample step', tag: null, hasNotes: true, hasPrompt: true, label: 'Step 03 — Sample step' },
]

export const DEFAULT_VIEWER_CONFIG = {
  siteTitle: 'Step viewer',
  assistantName: 'Preview',
  repoUrl: '',
  otherExperimentUrl: '',
  footerName: '',
  footerUrl: '',
  description: 'Step viewer for an incremental software development experiment.',
  pagesURL: '',
}
