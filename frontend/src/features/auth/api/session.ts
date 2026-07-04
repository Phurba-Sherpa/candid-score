import type { AuthResponse, AuthSession } from "./types";

const SESSION_STORAGE_KEY = "candid-score.auth-session";

export function persistSession(response: AuthResponse) {
  const session: AuthSession = {
    token: response.access_token,
    role: response.role,
  };

  window.localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
}

export function getSession() {
  const rawSession = window.localStorage.getItem(SESSION_STORAGE_KEY);

  if (!rawSession) {
    return null;
  }

  try {
    return JSON.parse(rawSession) as AuthSession;
  } catch {
    window.localStorage.removeItem(SESSION_STORAGE_KEY);
    return null;
  }
}

export function getSessionToken() {
  return getSession()?.token ?? null;
}

export function clearSession() {
  window.localStorage.removeItem(SESSION_STORAGE_KEY);
}

export const getRole = () => getSession()?.role ?? null;
