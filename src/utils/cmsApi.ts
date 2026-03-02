import type { Post, Subject } from '../types/content';

const API_BASE = '/api';

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers || {}),
    },
    ...init,
  });

  if (!response.ok) {
    let message = 'Request failed';
    try {
      const payload = await response.json();
      if (payload?.message) {
        message = payload.message;
      }
    } catch {
      // ignore invalid body
    }

    throw new Error(message);
  }

  return response.json() as Promise<T>;
}

export const cmsApi = {
  listSubjects: () => request<Subject[]>('/subjects'),
  listPosts: () => request<Post[]>('/posts'),

  createSubject: (token: string, subject: Subject) =>
    request<Subject>('/subjects', {
      method: 'POST',
      headers: { 'x-admin-token': token },
      body: JSON.stringify(subject),
    }),

  updateSubject: (token: string, subjectId: string, subject: Subject) =>
    request<Subject>(`/subjects/${subjectId}`, {
      method: 'PUT',
      headers: { 'x-admin-token': token },
      body: JSON.stringify(subject),
    }),

  deleteSubject: (token: string, subjectId: string) =>
    request<{ ok: boolean }>(`/subjects/${subjectId}`, {
      method: 'DELETE',
      headers: { 'x-admin-token': token },
    }),

  createPost: (
    token: string,
    post: Omit<Post, 'id'>
  ) =>
    request<Post>('/posts', {
      method: 'POST',
      headers: { 'x-admin-token': token },
      body: JSON.stringify(post),
    }),

  updatePost: (token: string, postId: number, post: Omit<Post, 'id'>) =>
    request<Post>(`/posts/${postId}`, {
      method: 'PUT',
      headers: { 'x-admin-token': token },
      body: JSON.stringify(post),
    }),

  deletePost: (token: string, postId: number) =>
    request<{ ok: boolean }>(`/posts/${postId}`, {
      method: 'DELETE',
      headers: { 'x-admin-token': token },
    }),
};
