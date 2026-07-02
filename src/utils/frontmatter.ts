import { load, dump } from 'js-yaml'

const DELIMITER = '---'

export interface ParsedMarkdown<T> {
  data: T
  content: string
}

export function parseFrontmatter<T>(raw: string): ParsedMarkdown<T> {
  const normalized = raw.replace(/\r\n/g, '\n')

  if (!normalized.startsWith(`${DELIMITER}\n`)) {
    return { data: {} as T, content: normalized.trim() }
  }

  const closingIndex = normalized.indexOf(`\n${DELIMITER}`, DELIMITER.length + 1)
  if (closingIndex === -1) {
    return { data: {} as T, content: normalized.trim() }
  }

  const frontmatterBlock = normalized.slice(DELIMITER.length + 1, closingIndex)
  const content = normalized.slice(closingIndex + `\n${DELIMITER}`.length).replace(/^\n+/, '')

  const data = (load(frontmatterBlock) ?? {}) as T

  return { data, content: content.trimEnd() }
}

export function stringifyFrontmatter<T>(data: T, content: string): string {
  const frontmatterBlock = dump(data, { lineWidth: -1 }).trimEnd()
  return `${DELIMITER}\n${frontmatterBlock}\n${DELIMITER}\n\n${content.trim()}\n`
}
