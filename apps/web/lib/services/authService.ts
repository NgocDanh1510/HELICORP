import Cookies from "js-cookie";
import { useAuthStore } from "../store/authStore";

const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
const REFRESH_COOKIE = "helicorp_refresh_token";

let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

function subscribeTokenRefresh(cb: (token: string) => void) {
  refreshSubscribers.push(cb);
}

function onRefreshed(token: string) {
  refreshSubscribers.forEach((cb) => cb(token));
  refreshSubscribers = [];
}

/**
 * Custom request wrapper that automatically attaches the access token
 * and handles token refresh on 401 TOKEN_EXPIRED errors.
 */
export async function authRequest(path: string, init?: RequestInit): Promise<Response> {
  const store = useAuthStore.getState();
  const accessToken = store.accessToken;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(init?.headers as Record<string, string>)
  };

  if (accessToken) {
    headers["Authorization"] = `Bearer ${accessToken}`;
  }

  const response = await fetch(`${apiUrl}${path}`, {
    ...init,
    headers
  });

  if (response.status === 401) {
    const clone = response.clone();
    try {
      const body = await clone.json();
      if (body.code === "TOKEN_EXPIRED") {
        const refreshToken = Cookies.get(REFRESH_COOKIE);

        if (!refreshToken) {
          // No refresh token available, logout user
          useAuthStore.getState().logout();
          return response;
        }

        if (!isRefreshing) {
          isRefreshing = true;
          try {
            const refreshRes = await fetch(`${apiUrl}/api/auth/refresh`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ refreshToken })
            });

            if (refreshRes.ok) {
              const refreshData = await refreshRes.json();
              const newAccessToken = refreshData.accessToken;

              // Save new access token to store
              useAuthStore.getState().setAccessToken(newAccessToken);
              isRefreshing = false;
              onRefreshed(newAccessToken);
            } else {
              isRefreshing = false;
              useAuthStore.getState().logout();
              return response;
            }
          } catch (refreshErr) {
            isRefreshing = false;
            useAuthStore.getState().logout();
            return response;
          }
        }

        // Wait for the token to be refreshed
        return new Promise<Response>((resolve) => {
          subscribeTokenRefresh(async (newToken) => {
            headers["Authorization"] = `Bearer ${newToken}`;
            const retryRes = await fetch(`${apiUrl}${path}`, {
              ...init,
              headers
            });
            resolve(retryRes);
          });
        });
      }
    } catch (e) {
      // JSON parsing failed, return original response
    }
  }

  return response;
}

// Authentication API methods
export async function registerUser(payload: any) {
  const response = await fetch(`${apiUrl}/api/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.message || "Failed to register");
  }

  return response.json();
}

export async function loginUser(payload: any) {
  const response = await fetch(`${apiUrl}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.message || "Failed to login");
  }

  return response.json();
}

export async function logoutUser(refreshToken: string) {
  const response = await fetch(`${apiUrl}/api/auth/logout`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken })
  });

  return response.ok;
}

export async function getMe(accessToken: string) {
  const response = await fetch(`${apiUrl}/api/auth/me`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`
    }
  });

  if (!response.ok) {
    throw new Error("Failed to get profile");
  }

  return response.json();
}
