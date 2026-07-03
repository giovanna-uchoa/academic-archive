import { getStoredToken } from './githubAuth'

const OWNER = import.meta.env.VITE_GITHUB_OWNER
const REPO = import.meta.env.VITE_GITHUB_REPO
const BRANCH = import.meta.env.VITE_GITHUB_BRANCH || 'main'

function assertConfigured() {
  if (!OWNER || !REPO) {
    throw new Error(
      'Missing VITE_GITHUB_OWNER / VITE_GITHUB_REPO. Set them in your .env file.'
    )
  }
}

function encodeUtf8Base64(value: string): string {
  const bytes = new TextEncoder().encode(value)
  let binary = ''
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte)
  })
  return btoa(binary)
}

function decodeUtf8Base64(base64: string): string {
  const binary = atob(base64.replace(/\n/g, ''))
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0))
  return new TextDecoder().decode(bytes)
}

function authHeaders(): HeadersInit {
  const token = getStoredToken()
  if (!token) {
    throw new Error('Not authenticated')
  }
  return {
    Authorization: `Bearer ${token}`,
    Accept: 'application/vnd.github+json',
  }
}

async function isMissing(response: Response, path: string): Promise<boolean> {
  if (response.status === 404) return true
  if (!response.ok) {
    throw new Error(`Failed to fetch ${path}: ${response.status}`)
  }
  return false
}

async function throwIfWriteFailed(response: Response, path: string, action: 'write' | 'delete'): Promise<void> {
  if (!response.ok) {
    const body = await response.json().catch(() => null)
    throw new Error(body?.message ?? `Failed to ${action} ${path}: ${response.status}`)
  }
}

export async function getRawFile(path: string): Promise<string | null> {
  assertConfigured()

  const response = await fetch(
    `https://raw.githubusercontent.com/${OWNER}/${REPO}/${BRANCH}/${path}`,
    { cache: 'no-store' }
  )

  if (await isMissing(response, path)) return null

  return response.text()
}

export interface FileWithSha {
  content: string
  sha: string
}

export async function getFileWithSha(path: string): Promise<FileWithSha | null> {
  assertConfigured()

  const response = await fetch(
    `https://api.github.com/repos/${OWNER}/${REPO}/contents/${path}?ref=${BRANCH}`,
    { headers: authHeaders() }
  )

  if (await isMissing(response, path)) return null

  const json = await response.json()
  return { content: decodeUtf8Base64(json.content), sha: json.sha }
}

export async function putFile(
  path: string,
  content: string,
  message: string,
  sha?: string
): Promise<{ sha: string }> {
  assertConfigured()

  const response = await fetch(
    `https://api.github.com/repos/${OWNER}/${REPO}/contents/${path}`,
    {
      method: 'PUT',
      headers: { ...authHeaders(), 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message,
        content: encodeUtf8Base64(content),
        branch: BRANCH,
        ...(sha ? { sha } : {}),
      }),
    }
  )

  await throwIfWriteFailed(response, path, 'write')

  const json = await response.json()
  return { sha: json.content.sha }
}

export async function deleteFile(path: string, sha: string, message: string): Promise<void> {
  assertConfigured()

  const response = await fetch(
    `https://api.github.com/repos/${OWNER}/${REPO}/contents/${path}`,
    {
      method: 'DELETE',
      headers: { ...authHeaders(), 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, sha, branch: BRANCH }),
    }
  )

  await throwIfWriteFailed(response, path, 'delete')
}
