const API_BASE = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/+$/, '');

/**
 * Resolves an API endpoint against VITE_API_BASE_URL in production (Vercel -> Render)
 * or falls back to a relative `/api/...` path in local Vite dev (proxied to localhost:3000).
 */
export function apiUrl(path) {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${API_BASE}${normalizedPath}`;
}
