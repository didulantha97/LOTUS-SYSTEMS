"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { TopNav } from "@/app/components/TopNav";
import { useAuth } from "@/app/components/AuthProvider";
import type { UserRole } from "@/app/types/auth";

export default function LoginPage() {
  const router = useRouter();
  const { loginAdmin, loginCustomer } = useAuth();

  const [activeRole, setActiveRole] = useState<UserRole>("customer");
  const [customerId, setCustomerId] = useState("demo-customer-001");
  const [companyName, setCompanyName] = useState("Demo Customer");
  const [email, setEmail] = useState("owner@demo-customer.com");
  const [adminName, setAdminName] = useState("Operations Admin");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const [redirectTarget, setRedirectTarget] = useState("/");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const roleFromUrl = (params.get("role") as UserRole | null) ?? "customer";
    setActiveRole(roleFromUrl === "admin" ? "admin" : "customer");
    setRedirectTarget(params.get("redirect") ?? "/");
  }, []);

  const submitCustomer = (event: FormEvent) => {
    event.preventDefault();
    setError(null);
    loginCustomer({ customerId, companyName, email });
    router.push(redirectTarget || "/products");
  };

  const submitAdmin = (event: FormEvent) => {
    event.preventDefault();
    setError(null);
    const result = loginAdmin({ adminName, password });
    if (!result.ok) {
      setError(result.error ?? "Invalid admin login");
      return;
    }

    router.push(redirectTarget || "/admin");
  };

  return (
    <div className="min-h-screen text-lotus-ink">
      <TopNav />
      <main className="mx-auto max-w-3xl px-6 py-8">
        <section className="rounded-3xl border border-lotus-ink/10 bg-white p-6 shadow-panel">
          <h1 className="text-3xl font-bold">Sign in to continue</h1>
          <p className="mt-2 text-lotus-ink/70">Use customer login for purchasing journey, or admin login for operations.</p>

          <div className="mt-5 flex gap-3">
            <button
              type="button"
              className={`rounded-xl px-4 py-2 text-sm font-semibold ${
                activeRole === "customer" ? "bg-lotus-ink text-white" : "border border-lotus-ink/20"
              }`}
              onClick={() => setActiveRole("customer")}
            >
              Customer Login
            </button>
            <button
              type="button"
              className={`rounded-xl px-4 py-2 text-sm font-semibold ${
                activeRole === "admin" ? "bg-lotus-ink text-white" : "border border-lotus-ink/20"
              }`}
              onClick={() => setActiveRole("admin")}
            >
              Admin Login
            </button>
          </div>

          {error && <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</div>}

          {activeRole === "customer" ? (
            <form className="mt-6 grid gap-3" onSubmit={submitCustomer}>
              <input value={customerId} onChange={(event) => setCustomerId(event.target.value)} className="rounded-xl border border-lotus-ink/20 px-3 py-2" placeholder="customer id" required />
              <input value={companyName} onChange={(event) => setCompanyName(event.target.value)} className="rounded-xl border border-lotus-ink/20 px-3 py-2" placeholder="company name" required />
              <input value={email} onChange={(event) => setEmail(event.target.value)} className="rounded-xl border border-lotus-ink/20 px-3 py-2" placeholder="work email" required />
              <button type="submit" className="rounded-xl bg-lotus-jade px-4 py-2 text-white">Continue as Customer</button>
            </form>
          ) : (
            <form className="mt-6 grid gap-3" onSubmit={submitAdmin}>
              <input value={adminName} onChange={(event) => setAdminName(event.target.value)} className="rounded-xl border border-lotus-ink/20 px-3 py-2" placeholder="admin name" required />
              <input value={password} onChange={(event) => setPassword(event.target.value)} className="rounded-xl border border-lotus-ink/20 px-3 py-2" placeholder="password" type="password" required />
              <div className="text-xs text-lotus-ink/60">Demo password: lotus-admin</div>
              <button type="submit" className="rounded-xl bg-lotus-jade px-4 py-2 text-white">Continue as Admin</button>
            </form>
          )}
        </section>
      </main>
    </div>
  );
}
