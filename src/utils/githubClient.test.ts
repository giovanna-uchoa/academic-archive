import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('./githubAuth', () => ({
  getStoredToken: vi.fn(() => 'test-token'),
}))

describe('githubClient', () => {
  const originalFetch = global.fetch

  beforeEach(() => {
    vi.stubEnv('VITE_GITHUB_OWNER', 'giovanna-uchoa')
    vi.stubEnv('VITE_GITHUB_REPO', 'academic-archive')
    vi.stubEnv('VITE_GITHUB_BRANCH', 'main')
    vi.resetModules()
  })

  afterEach(() => {
    global.fetch = originalFetch
    vi.unstubAllEnvs()
  })

  it('fetches raw files without auth from raw.githubusercontent.com', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      text: () => Promise.resolve('---\ntitle: Hi\n---\n\nBody'),
    })
    global.fetch = fetchMock as unknown as typeof fetch

    const { getRawFile } = await import('./githubClient')
    const result = await getRawFile('content/posts/2.md')

    expect(result).toBe('---\ntitle: Hi\n---\n\nBody')
    const [url, options] = fetchMock.mock.calls[0]
    expect(url).toBe(
      'https://raw.githubusercontent.com/giovanna-uchoa/academic-archive/main/content/posts/2.md'
    )
    expect(options?.headers).toBeUndefined()
  })

  it('returns null for a missing raw file (404)', async () => {
    global.fetch = vi.fn().mockResolvedValue({ ok: false, status: 404 }) as unknown as typeof fetch

    const { getRawFile } = await import('./githubClient')
    expect(await getRawFile('content/posts/999.md')).toBeNull()
  })

  it('decodes base64 UTF-8 content and returns the sha on getFileWithSha', async () => {
    const utf8 = 'título com acento'
    const base64 = Buffer.from(utf8, 'utf8').toString('base64')

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: () => Promise.resolve({ content: base64, sha: 'abc123' }),
    }) as unknown as typeof fetch

    const { getFileWithSha } = await import('./githubClient')
    const result = await getFileWithSha('content/manifest.json')

    expect(result).toEqual({ content: utf8, sha: 'abc123' })
  })

  it('omits sha on create and includes it on update', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: () => Promise.resolve({ content: { sha: 'new-sha' } }),
    })
    global.fetch = fetchMock as unknown as typeof fetch

    const { putFile } = await import('./githubClient')

    await putFile('content/posts/16.md', 'hello', 'Create post')
    const createBody = JSON.parse(fetchMock.mock.calls[0][1].body)
    expect(createBody.sha).toBeUndefined()
    expect(createBody.content).toBe(Buffer.from('hello', 'utf8').toString('base64'))

    await putFile('content/posts/16.md', 'hello v2', 'Update post', 'old-sha')
    const updateBody = JSON.parse(fetchMock.mock.calls[1][1].body)
    expect(updateBody.sha).toBe('old-sha')
  })

  it('sends the sha and authorization header on delete', async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, status: 200 })
    global.fetch = fetchMock as unknown as typeof fetch

    const { deleteFile } = await import('./githubClient')
    await deleteFile('content/posts/16.md', 'some-sha', 'Delete post')

    const [url, options] = fetchMock.mock.calls[0]
    expect(url).toBe(
      'https://api.github.com/repos/giovanna-uchoa/academic-archive/contents/content/posts/16.md'
    )
    expect(options.method).toBe('DELETE')
    expect(options.headers.Authorization).toBe('Bearer test-token')
    expect(JSON.parse(options.body).sha).toBe('some-sha')
  })

  it('returns null for a missing file on getFileWithSha (404)', async () => {
    global.fetch = vi.fn().mockResolvedValue({ ok: false, status: 404 }) as unknown as typeof fetch

    const { getFileWithSha } = await import('./githubClient')
    expect(await getFileWithSha('content/posts/999.md')).toBeNull()
  })

  it('propagates the GitHub error body message on putFile failure', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 422,
      json: () => Promise.resolve({ message: 'Validation failed' }),
    }) as unknown as typeof fetch

    const { putFile } = await import('./githubClient')
    await expect(putFile('content/posts/16.md', 'hello', 'Create post')).rejects.toThrow(
      'Validation failed'
    )
  })

  it('propagates the GitHub error body message on deleteFile failure', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 409,
      json: () => Promise.resolve({ message: 'sha mismatch' }),
    }) as unknown as typeof fetch

    const { deleteFile } = await import('./githubClient')
    await expect(deleteFile('content/posts/16.md', 'some-sha', 'Delete post')).rejects.toThrow(
      'sha mismatch'
    )
  })
})
