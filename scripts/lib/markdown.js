/**
 * Render Markdown to HTML fragment using markdown-it.
 */

import { readFileSync, existsSync } from 'fs'
import MarkdownIt from 'markdown-it'

const md = new MarkdownIt({ html: true })

export function renderMarkdownFile(path) {
  if (!existsSync(path)) return null
  const raw = readFileSync(path, 'utf-8')
  return md.render(raw)
}

export function wrapProse(html) {
  return `<div class="prose">\n${html}\n</div>`
}
