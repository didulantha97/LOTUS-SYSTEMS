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

type ProductUpdate = {
  productKey: string;
  subscriptionId: string;
  latestVersion: string;
  status: string;
};

type Documentation = {
  productKey: string;
  subscriptionId: string;
  documentationUrl: string;
  repositoryUrl: string;
};

type BillingRecord = {
  invoiceId: string;
  subscriptionId: string;
  amount: string;
  billingStatus: string;
  latestVersion: string;
  downloadUrl: string;
};

type SupportTicket = {
  ticketId: string;
  productKey: string;
  priority: string;
  status: string;
  contact: string;
};

export default function PortalPage() {
  const [customerId, setCustomerId] = useState("demo-customer-001");
  const [profile, setProfile] = useState<CustomerProfile | null>(null);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [environments, setEnvironments] = useState<Environment[]>([]);
  const [updates, setUpdates] = useState<ProductUpdate[]>([]);
  const [documentation, setDocumentation] = useState<Documentation[]>([]);
  const [billing, setBilling] = useState<BillingRecord[]>([]);
  const [support, setSupport] = useState<SupportTicket[]>([]);
  const [error, setError] = useState<string | null>(null);

  const loadPortal = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);

    try {
      const encodedCustomerId = encodeURIComponent(customerId);
      const [profileRes, subRes, envRes, updatesRes, docsRes, billingRes, supportRes] = await Promise.all([
        fetch(`/api/portal/me?customerId=${encodedCustomerId}`, { cache: "no-store" }),
        fetch(`/api/portal/subscriptions?customerId=${encodedCustomerId}`, { cache: "no-store" }),
        fetch(`/api/portal/environments?customerId=${encodedCustomerId}`, { cache: "no-store" }),
        fetch(`/api/portal/updates?customerId=${encodedCustomerId}`, { cache: "no-store" }),
        fetch(`/api/portal/documentation?customerId=${encodedCustomerId}`, { cache: "no-store" }),
        fetch(`/api/portal/billing?customerId=${encodedCustomerId}`, { cache: "no-store" }),
        fetch(`/api/portal/support?customerId=${encodedCustomerId}`, { cache: "no-store" })
      ]);

      if (!profileRes.ok || !subRes.ok || !envRes.ok || !updatesRes.ok || !docsRes.ok || !billingRes.ok || !supportRes.ok) {
        throw new Error("Failed to load portal data for this customer");
      }

      setProfile((await profileRes.json()) as CustomerProfile);
      setSubscriptions((await subRes.json()) as Subscription[]);
      setEnvironments((await envRes.json()) as Environment[]);
      setUpdates((await updatesRes.json()) as ProductUpdate[]);
      setDocumentation((await docsRes.json()) as Documentation[]);
      setBilling((await billingRes.json()) as BillingRecord[]);
      setSupport((await supportRes.json()) as SupportTicket[]);
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
          <p className="mt-2 text-lotus-ink/70">Purchased products, updates, docs access, billing + downloads, and support from control-plane APIs.</p>
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
            <h2 className="text-xl font-semibold">Purchased Products</h2>
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

          <article className="rounded-3xl border border-lotus-ink/10 bg-white p-6 shadow-panel">
            <h2 className="text-xl font-semibold">Product Updates</h2>
            <div className="mt-3 space-y-3 text-sm">
              {updates.map((item) => (
                <div key={item.subscriptionId} className="rounded-xl border border-lotus-ink/10 p-3">
                  <div className="font-semibold">{item.productKey}</div>
                  <div className="text-lotus-ink/70">Subscription: {item.subscriptionId}</div>
                  <div className="text-lotus-ink/70">Latest version: {item.latestVersion}</div>
                </div>
              ))}
            </div>
          </article>

          <article className="rounded-3xl border border-lotus-ink/10 bg-white p-6 shadow-panel">
            <h2 className="text-xl font-semibold">Documentation Access</h2>
            <div className="mt-3 space-y-3 text-sm">
              {documentation.map((item) => (
                <div key={item.subscriptionId} className="rounded-xl border border-lotus-ink/10 p-3">
                  <div className="font-semibold">{item.productKey}</div>
                  <a className="block text-lotus-jade underline" href={item.documentationUrl} target="_blank" rel="noreferrer">Documentation</a>
                  <a className="block text-lotus-jade underline" href={item.repositoryUrl} target="_blank" rel="noreferrer">Repository</a>
                </div>
              ))}
            </div>
          </article>

          <article className="rounded-3xl border border-lotus-ink/10 bg-white p-6 shadow-panel">
            <h2 className="text-xl font-semibold">Billing & Downloads</h2>
            <div className="mt-3 space-y-3 text-sm">
              {billing.map((item) => (
                <div key={item.invoiceId} className="rounded-xl border border-lotus-ink/10 p-3">
                  <div className="font-semibold">Invoice {item.invoiceId}</div>
                  <div className="text-lotus-ink/70">Subscription: {item.subscriptionId}</div>
                  <div className="text-lotus-ink/70">Amount: {item.amount} • Status: {item.billingStatus}</div>
                  <a className="block text-lotus-jade underline" href={item.downloadUrl} target="_blank" rel="noreferrer">Download {item.latestVersion}</a>
                </div>
              ))}
            </div>
          </article>

          <article className="rounded-3xl border border-lotus-ink/10 bg-white p-6 shadow-panel">
            <h2 className="text-xl font-semibold">Support</h2>
            <div className="mt-3 space-y-3 text-sm">
              {support.map((item) => (
                <div key={item.ticketId} className="rounded-xl border border-lotus-ink/10 p-3">
                  <div className="font-semibold">{item.ticketId} • {item.productKey}</div>
                  <div className="text-lotus-ink/70">Priority: {item.priority} • Status: {item.status}</div>
                  <div className="text-lotus-ink/70">Contact: {item.contact}</div>
                </div>
              ))}
            </div>
          </article>
        </section>
      </main>
    </div>
  );
}
