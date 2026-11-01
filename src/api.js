/**
 * api.js — API base URL resolver.
 *
 * Why this file exists:
 * The dashboard and the certificate backend are deployed on DIFFERENT domains.
 * A relative fetch("/api/status") would hit the dashboard host (404). So every
 * request goes through apiUrl(), which resolves:
 *
 *   localhost / 127.0.0.1  ->  ""            (CRA proxy -> backend :4000)
 *   anywhere else          ->  LIVE API URL  (Vercel backend)
 *
 * Override without touching code:  REACT_APP_API_URL=https://...  in .env
 */

export const LIVE_API = (
  process.env.REACT_APP_API_URL || "https://osheq-cartifica.vercel.app/"
).replace(/\/+$/, "");

const isLocalHost = () => {
  if (typeof window === "undefined") return false;
  const h = window.location.hostname;
  return h === "localhost" || h === "127.0.0.1" || h === "[::1]" || h === "0.0.0.0";
};

export const API_BASE = isLocalHost() ? "" : LIVE_API;

/** Build an absolute API URL: apiUrl("/api/status") */
export function apiUrl(path) {
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${API_BASE}${p}`;
}

/** JSON fetch that surfaces backend error messages instead of "Failed to fetch". */
export async function apiFetch(path, init) {
  const res = await fetch(apiUrl(path), {
    ...init,
    headers: { "Content-Type": "application/json", ...(init && init.headers) },
  });
  let data = null;
  try {
    data = await res.json();
  } catch {
    data = null;
  }
  return { res, data };
}
