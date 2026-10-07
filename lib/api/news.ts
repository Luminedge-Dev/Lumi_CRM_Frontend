import { API_URL, authHeader } from './base';

// Absolute backend URL: the API is a separate deployment, so a relative '/api' would hit the frontend host.
const BASE = API_URL;

export async function getNews(category?: string) {
  const qs = category ? `?category=${encodeURIComponent(category)}` : '';
  const res = await fetch(`${BASE}/news${qs}`);
  return res.json();
}

export async function createNews(token: string, data: {
  title: string;
  content: string;
  category: string;
  isPinned?: boolean;
}) {
  const res = await fetch(`${BASE}/admin/news`, {
    method: 'POST',
    headers: authHeader(token),
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function updateNews(token: string, id: string, data: Partial<{
  title: string;
  content: string;
  category: string;
  isPinned: boolean;
  isActive: boolean;
}>) {
  const res = await fetch(`${BASE}/admin/news/${id}`, {
    method: 'PATCH',
    headers: authHeader(token),
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function deleteNews(token: string, id: string) {
  const res = await fetch(`${BASE}/admin/news/${id}`, {
    method: 'DELETE',
    headers: authHeader(token),
  });
  return res.json();
}
