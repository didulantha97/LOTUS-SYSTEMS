"use client";

import { FormEvent, useState } from "react";

import { TopNav } from "@/app/components/TopNav";

type CustomerProfile = {
  customerId: string;
  companyName: string;
  email: string;
  lifecycleStatus: string;
};

type Subscription = {
  subscriptionId: string;
  productKey: string;
  planKey: string;
  status: string;
  domain: string;
  environmentStatus: string;
};

type Environment = {
  environmentId: string;
  productKey: string;
  status: string;
  domain: string;
};

export default function PortalPage() {
  const [customerId, setCustomerId] = useState("demo-customer-001");
  const [profile, setProfile] = useState<CustomerProfile | null>(null);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [environments, setEnvironments] = useState<Environment[]>([]);
  const [error, setError] = useState<string | null>(null);

  const loadPortal = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);

    try {
      const [profileRes, subRes, envRes] = await Promise.all([
        fetch(`/api/portal/me?customerId=${encodeURIComponent(customerId)}`, { cache: "no-store" }),
        fetch(`/api/portal/subscriptions?customerId=${encodeURIComponent(customerId)}`, { cache: "no-store" }),
        fetch(`/api/portal/environments?customerId=${encodeURIComponent(customerId)}`, { cache: "no-store" })
      ]);

      if (!profileRes.ok || !subRes.ok || !envRes.ok) {
        throw new Error("Failed to load portal data for this customer");
      }

      setProfile((await profileRes.json()) as CustomerProfile);
      setSubscriptions((await subRes.json()) as Subscription[]);
      setEnvironments((await envRes.json()) as Environment[]);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unexpected portal error";
      setError(message);
    }
  };

  return (
    <div className="min-h-screen text-lotus-ink">
      <TopNav />
      <main className="mx-auto max-w-7xl px-6 py-8">
        <section className="rounded-3xl border border-lotus-ink/10 bg-white p-6 shadow-panel">
          <h1 className="text-3xl font-bold">Client Portal</h1>
          <p className="mt-2 text-lotus-ink/70">Load customer profile, subscriptions, and environments from control-plane APIs.</p>
          <form className="mt-4 flex flex-wrap gap-3" onSubmit={loadPortal}>
            <input value={customerId} onChange={(e) => setCustomerId(e.target.value)} className="rounded-xl border border-lotus-ink/20 px-3 py-2" placeholder="customerId" />
            <button type="submit" className="rounded-xl bg-lotus-ink px-4 py-2 text-white">Load My Portal</button>
          </form>
          {error && <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</div>}
        </section>

        {profile && (
          <section className="mt-6 rounded-3xl border border-lotus-ink/10 bg-white p-6 shadow-panel">
            <h2 className="text-xl font-semibold">Profile</h2>
            <div className="mt-3 text-sm">{profile.companyName} ({profile.customerId}) • {profile.email} • {profile.lifecycleStatus}</div>
          </section>
        )}

        <section className="mt-6 grid gap-6 lg:grid-cols-2">
          <article className="rounded-3xl border border-lotus-ink/10 bg-white p-6 shadow-panel">
            <h2 className="text-xl font-semibold">Subscriptions</h2>
            <div className="mt-3 space-y-3 text-sm">
              {subscriptions.map((sub) => (
                <div key={sub.subscriptionId} className="rounded-xl border border-lotus-ink/10 p-3">
                  <div className="font-semibold">{sub.productKey} • {sub.planKey}</div>
                  <div className="text-lotus-ink/70">{sub.subscriptionId} • {sub.status}</div>
                  <div className="text-lotus-ink/70">Domain: {sub.domain}</div>
                </div>
              ))}
            </div>
          </article>

          <article className="rounded-3xl border border-lotus-ink/10 bg-white p-6 shadow-panel">
            <h2 className="text-xl font-semibold">Environments</h2>
            <div className="mt-3 space-y-3 text-sm">
              {environments.map((env) => (
                <div key={env.environmentId} className="rounded-xl border border-lotus-ink/10 p-3">
                  <div className="font-semibold">{env.environmentId}</div>
                  <div className="text-lotus-ink/70">{env.productKey} • {env.status}</div>
                  <div className="text-lotus-ink/70">Domain: {env.domain}</div>
                </div>
              ))}
            </div>
          </article>
        </section>
      </main>
    </div>
  );
}
