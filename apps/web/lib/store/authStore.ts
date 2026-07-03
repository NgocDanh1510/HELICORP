import Cookies from "js-cookie";
import { create } from "zustand";
import { getMe, loginUser, logoutUser, registerUser } from "../services/authService";

const REFRESH_COOKIE = "helicorp_refresh_token";

export type UserProfile = {
  id: string;
  name: string;
  email: string;
};

type AuthState = {
  user: UserProfile | null;
  accessToken: string | null;
  isLoading: boolean;
  isAuthModalOpen: boolean;
  error: string | null;

  setAccessToken: (token: string | null) => void;
  openAuthModal: () => void;
  closeAuthModal: () => void;
  setError: (error: string | null) => void;

  login: (payload: any) => Promise<boolean>;
  register: (payload: any) => Promise<boolean>;
  logout: () => Promise<void>;
  initializeAuth: () => Promise<void>;
};

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  accessToken: null,
  isLoading: false,
  isAuthModalOpen: false,
  error: null,

  setAccessToken: (token) => set({ accessToken: token }),
  openAuthModal: () => set({ isAuthModalOpen: true, error: null }),
  closeAuthModal: () => set({ isAuthModalOpen: false, error: null }),
  setError: (error) => set({ error }),

  login: async (payload) => {
    set({ isLoading: true, error: null });
    try {
      const data = await loginUser(payload);
      
      // Save refresh token to cookie (secure, valid for 7 days)
      Cookies.set(REFRESH_COOKIE, data.refreshToken, { expires: 7, sameSite: "lax" });

      set({
        user: data.user,
        accessToken: data.accessToken,
        isAuthModalOpen: false,
        isLoading: false,
        error: null
      });
      return true;
    } catch (err: any) {
      set({ isLoading: false, error: err.message || "Failed to login" });
      return false;
    }
  },

  register: async (payload) => {
    set({ isLoading: true, error: null });
    try {
      const data = await registerUser(payload);

      // Save refresh token to cookie (secure, valid for 7 days)
      Cookies.set(REFRESH_COOKIE, data.refreshToken, { expires: 7, sameSite: "lax" });

      set({
        user: data.user,
        accessToken: data.accessToken,
        isAuthModalOpen: false,
        isLoading: false,
        error: null
      });
      return true;
    } catch (err: any) {
      set({ isLoading: false, error: err.message || "Failed to register" });
      return false;
    }
  },

  logout: async () => {
    const refreshToken = Cookies.get(REFRESH_COOKIE);
    
    // Clear state immediately on client side for responsive UX
    Cookies.remove(REFRESH_COOKIE);
    set({
      user: null,
      accessToken: null,
      error: null
    });

    if (refreshToken) {
      try {
        await logoutUser(refreshToken);
      } catch (err) {
        console.error("Logout API failed", err);
      }
    }
  },

  initializeAuth: async () => {
    const refreshToken = Cookies.get(REFRESH_COOKIE);
    
    if (!refreshToken) {
      return;
    }

    set({ isLoading: true });
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
      
      // Get new access token
      const res = await fetch(`${apiUrl}/api/auth/refresh`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken })
      });

      if (!res.ok) {
        throw new Error("Session expired");
      }

      const data = await res.json();
      const accessToken = data.accessToken;

      // Get user profile
      const profileData = await getMe(accessToken);

      set({
        user: profileData.user,
        accessToken,
        isLoading: false
      });
    } catch (err) {
      console.warn("Session initialization failed, logging out client.", err);
      Cookies.remove(REFRESH_COOKIE);
      set({
        user: null,
        accessToken: null,
        isLoading: false
      });
    }
  }
}));
