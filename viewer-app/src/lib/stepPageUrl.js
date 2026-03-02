import { state } from '@/lib/state'

/**
 * Base URL for step pages. Uses pagesURL from viewer config when set (production subpath);
 * otherwise uses current pathname (preview/root).
 */
function getBaseUrl() {
  if (typeof window === 'undefined') return ''
  const pagesURL = state.viewerConfig?.pagesURL
  const path = (pagesURL != null && String(pagesURL).trim() !== '')
    ? '/' + String(pagesURL).replace(/^\/+|\/+$/g, '') + '/'
    : window.location.pathname.replace(/\/$/, '') + '/'
  return window.location.origin + path
}

/**
 * Full URL for a step's index.html (for iframe src and existence check).
 */
export function stepPageUrl(stepId) {
  const base = getBaseUrl()
  return base ? `${base}${stepId}/index.html` : `./${stepId}/index.html`
}
