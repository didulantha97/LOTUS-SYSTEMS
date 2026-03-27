"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

import type { AuthSession } from "@/app/types/auth";

type CustomerLoginInput = {
  customerId: string;
  companyName: string;
  email: string;
};

type AdminLoginInput = {
  adminName: string;
  password: string;
};

type AuthContextValue = {
  isHydrated: boolean;
  session: AuthSession;
  loginCustomer: (input: CustomerLoginInput) => void;
  loginAdmin: (input: AdminLoginInput) => { ok: boolean; error?: string };
  logout: () => void;
};

const SESSION_KEY = "lotus.auth.session";

const guestSession: AuthSession = { role: "guest" };

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<AuthSession>(guestSession);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    const rawSession = window.localStorage.getItem(SESSION_KEY);
    if (rawSession) {
      try {
        setSession(JSON.parse(rawSession) as AuthSession);
      } catch {
        window.localStorage.removeItem(SESSION_KEY);
      }
    }

    setIsHydrated(true);
  }, []);

  const persistSession = (nextSession: AuthSession) => {
    setSession(nextSession);
    window.localStorage.setItem(SESSION_KEY, JSON.stringify(nextSession));
  };

  const loginCustomer = (input: CustomerLoginInput) => {
    persistSession({
      role: "customer",
      customerId: input.customerId.trim(),
      companyName: input.companyName.trim(),
      email: input.email.trim()
    });
  };

  const loginAdmin = (input: AdminLoginInput) => {
    const isValid = input.password === "lotus-admin";
    if (!isValid) {
      return { ok: false, error: "Invalid admin credentials. Use password: lotus-admin" };
    }

    persistSession({ role: "admin", adminName: input.adminName.trim() || "Operations Admin" });
    return { ok: true };
  };

  const logout = () => {
    window.localStorage.removeItem(SESSION_KEY);
    setSession(guestSession);
  };

  const contextValue = useMemo(
    () => ({ isHydrated, session, loginCustomer, loginAdmin, logout }),
    [isHydrated, session]
  );

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
}
