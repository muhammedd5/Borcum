import React, { useCallback, useEffect, useMemo, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import createContextHook from "@nkzw/create-context-hook";

type AuthUser = {
  id: string;
  email?: string;
};

type AuthContextValue = {
  isAuthenticated: boolean;
  user: AuthUser | null;
  loading: boolean;
  error: string | null;
  loginWithEmail: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  loginWithApple: () => Promise<void>;
  logout: () => Promise<void>;
  setToken: (token: string, user?: AuthUser | null) => Promise<void>;
};

const TOKEN_KEY = "auth:token" as const;
const USER_KEY = "auth:user" as const;

export const [AuthProvider, useAuth] = createContextHook<AuthContextValue>(() => {
  const [token, setTokenState] = useState<string | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const init = async () => {
      try {
        console.log("[Auth] Initializing context");
        const [storedToken, storedUser] = await Promise.all([
          AsyncStorage.getItem(TOKEN_KEY),
          AsyncStorage.getItem(USER_KEY),
        ]);
        if (storedToken) {
          setTokenState(storedToken);
        }
        if (storedUser) {
          try {
            const parsed: AuthUser = JSON.parse(storedUser);
            setUser(parsed);
          } catch (e) {
            console.log("[Auth] Failed to parse stored user", e);
          }
        }
      } catch (e) {
        console.log("[Auth] Init error", e);
        setError("Oturum başlatma hatası");
      } finally {
        setLoading(false);
      }
    };
    void init();
  }, []);

  const loginWithEmail = useCallback(async (email: string, password: string) => {
    try {
      setError(null);
      setLoading(true);
      console.log("[Auth] loginWithEmail", email);
      await new Promise((r) => setTimeout(r, 400));
      const fakeToken = `token-${Date.now()}`;
      const u: AuthUser = { id: "local", email };
      await AsyncStorage.setItem(TOKEN_KEY, fakeToken);
      await AsyncStorage.setItem(USER_KEY, JSON.stringify(u));
      setTokenState(fakeToken);
      setUser(u);
    } catch (e) {
      console.log("[Auth] Login error", e);
      setError("Giriş başarısız. Lütfen tekrar deneyin.");
      throw e;
    } finally {
      setLoading(false);
    }
  }, []);

  const loginWithGoogle = useCallback(async () => {
    try {
      setError(null);
      setLoading(true);
      console.log("[Auth] loginWithGoogle");
      await new Promise((r) => setTimeout(r, 400));
      const fakeToken = `google-token-${Date.now()}`;
      const u: AuthUser = { id: "google", email: "google.user@gmail.com" };
      await AsyncStorage.setItem(TOKEN_KEY, fakeToken);
      await AsyncStorage.setItem(USER_KEY, JSON.stringify(u));
      setTokenState(fakeToken);
      setUser(u);
    } catch (e) {
      console.log("[Auth] Google login error", e);
      setError("Google ile giriş başarısız. Lütfen tekrar deneyin.");
      throw e;
    } finally {
      setLoading(false);
    }
  }, []);

  const loginWithApple = useCallback(async () => {
    try {
      setError(null);
      setLoading(true);
      console.log("[Auth] loginWithApple");
      await new Promise((r) => setTimeout(r, 400));
      const fakeToken = `apple-token-${Date.now()}`;
      const u: AuthUser = { id: "apple", email: "apple.user@icloud.com" };
      await AsyncStorage.setItem(TOKEN_KEY, fakeToken);
      await AsyncStorage.setItem(USER_KEY, JSON.stringify(u));
      setTokenState(fakeToken);
      setUser(u);
    } catch (e) {
      console.log("[Auth] Apple login error", e);
      setError("Apple ile giriş başarısız. Lütfen tekrar deneyin.");
      throw e;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      console.log("[Auth] logout");
      await AsyncStorage.multiRemove([TOKEN_KEY, USER_KEY]);
      setTokenState(null);
      setUser(null);
    } catch (e) {
      console.log("[Auth] Logout error", e);
      setError("Çıkış yapılamadı");
      throw e;
    }
  }, []);

  const setToken = useCallback(async (newToken: string, newUser?: AuthUser | null) => {
    try {
      console.log("[Auth] setToken");
      await AsyncStorage.setItem(TOKEN_KEY, newToken);
      setTokenState(newToken);
      if (newUser !== undefined) {
        if (newUser === null) {
          await AsyncStorage.removeItem(USER_KEY);
          setUser(null);
        } else {
          await AsyncStorage.setItem(USER_KEY, JSON.stringify(newUser));
          setUser(newUser);
        }
      }
    } catch (e) {
      console.log("[Auth] setToken error", e);
      setError("Oturum güncellenemedi");
      throw e;
    }
  }, []);

  const value = useMemo<AuthContextValue>(() => ({
    isAuthenticated: !!token,
    user,
    loading,
    error,
    loginWithEmail,
    loginWithGoogle,
    loginWithApple,
    logout,
    setToken,
  }), [token, user, loading, error, loginWithEmail, loginWithGoogle, loginWithApple, logout, setToken]);

  return value;
});
