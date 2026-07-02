import { describe, expect, it } from 'vitest'
import { parseFrontmatter, stringifyFrontmatter } from './frontmatter'

interface PostFrontmatter {
  id: number
  title: string
  tags: string[]
}

describe('frontmatter', () => {
  it('round-trips a post with tags and a markdown body', () => {
    const data: PostFrontmatter = { id: 15, title: 'Contributing to ArKanjo', tags: ['floss'] }
    const content = 'A walkthrough of contributing to ArKanjo.\n\n## Setup\n\nSome *markdown* here.'

    const serialized = stringifyFrontmatter(data, content)
    const parsed = parseFrontmatter<PostFrontmatter>(serialized)

    expect(parsed.data).toEqual(data)
    expect(parsed.content).toBe(content)
  })

  it('round-trips an empty body', () => {
    const data = { title: 'Floss Development', description: 'FLOSS', icon: null }
    const serialized = stringifyFrontmatter(data, '')
    const parsed = parseFrontmatter<typeof data>(serialized)

    expect(parsed.data).toEqual(data)
    expect(parsed.content).toBe('')
  })

  it('preserves accented characters and multi-paragraph markdown', () => {
    const data = { title: 'Atividade Curricular em Pesquisa' }
    const content =
      'A Ciência Aberta busca tornar a pesquisa mais acessível.\n\n### Justificativa\n\nOutro parágrafo com [link](https://example.com).'

    const serialized = stringifyFrontmatter(data, content)
    const parsed = parseFrontmatter<typeof data>(serialized)

    expect(parsed.data).toEqual(data)
    expect(parsed.content).toBe(content)
  })

  it('returns empty data when there is no frontmatter block', () => {
    const parsed = parseFrontmatter<Record<string, unknown>>('Just plain markdown, no frontmatter.')
    expect(parsed.data).toEqual({})
    expect(parsed.content).toBe('Just plain markdown, no frontmatter.')
  })
})
