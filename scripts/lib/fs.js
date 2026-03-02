/**
 * File system helpers for the build.
 */

import { readFileSync, writeFileSync, mkdirSync, readdirSync, existsSync, cpSync, rmSync } from 'fs'
import { join, dirname } from 'path'

export function readText(path) {
  return readFileSync(path, 'utf-8')
}

export function readJson(path) {
  return JSON.parse(readText(path))
}

export function writeText(path, content) {
  mkdirSync(dirname(path), { recursive: true })
  writeFileSync(path, content, 'utf-8')
}

export function writeJson(path, data) {
  writeText(path, JSON.stringify(data, null, 2) + '\n')
}

export function ensureDir(path) {
  mkdirSync(path, { recursive: true })
}

export function listDir(path) {
  if (!existsSync(path)) return []
  return readdirSync(path, { withFileTypes: true })
}

export function exists(path) {
  return existsSync(path)
}

export function copyDir(src, dest) {
  cpSync(src, dest, { recursive: true })
}

export function removeDir(path) {
  if (existsSync(path)) rmSync(path, { recursive: true })
}
