"use client";

import { FormEvent, useState } from "react";

import { TopNav } from "@/app/components/TopNav";

type ProvisioningResponse = {
  jobId: string;
  status: string;
  message: string;
};

export default function ProvisioningPage() {
  const [customerId, setCustomerId] = useState("demo-customer-001");
  const [productKey, setProductKey] = useState("smart-pos");
  const [planKey, setPlanKey] = useState("growth");
  const [domainOption, setDomainOption] = useState("BUY_NEW");
  const [databaseOption, setDatabaseOption] = useState("DEDICATED");
  const [result, setResult] = useState<ProvisioningResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);

    try {
      const response = await fetch("/api/provisioning/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerId,
          productKey,
          planKey,
          domainOption,
          databaseOption
        })
      });

      const body = (await response.json()) as ProvisioningResponse | { error?: string };
      if (!response.ok || "error" in body) {
        throw new Error((body as { error?: string }).error ?? "Failed to start provisioning");
      }

      setResult(body as ProvisioningResponse);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unexpected provisioning error";
      setError(message);
    }
  };

  return (
    <div className="min-h-screen text-lotus-ink">
      <TopNav />
      <main className="mx-auto max-w-4xl px-6 py-8">
        <section className="rounded-3xl border border-lotus-ink/10 bg-white p-6 shadow-panel">
          <h1 className="text-3xl font-bold">Provisioning Jobs</h1>
          <p className="mt-2 text-lotus-ink/70">Run onboarding actions and create provisioning jobs from the control plane.</p>

          <form className="mt-6 grid gap-4" onSubmit={submit}>
            <input value={customerId} onChange={(e) => setCustomerId(e.target.value)} className="rounded-xl border border-lotus-ink/20 px-3 py-2" placeholder="customerId" />
            <input value={productKey} onChange={(e) => setProductKey(e.target.value)} className="rounded-xl border border-lotus-ink/20 px-3 py-2" placeholder="productKey" />
            <input value={planKey} onChange={(e) => setPlanKey(e.target.value)} className="rounded-xl border border-lotus-ink/20 px-3 py-2" placeholder="planKey" />
            <select value={domainOption} onChange={(e) => setDomainOption(e.target.value)} className="rounded-xl border border-lotus-ink/20 px-3 py-2">
              <option value="BUY_NEW">Buy New Domain</option>
              <option value="CONNECT_EXISTING">Connect Existing Domain</option>
            </select>
            <select value={databaseOption} onChange={(e) => setDatabaseOption(e.target.value)} className="rounded-xl border border-lotus-ink/20 px-3 py-2">
              <option value="DEDICATED">Dedicated DB</option>
              <option value="CUSTOMER_MANAGED">Customer Managed</option>
            </select>
            <button type="submit" className="rounded-xl bg-lotus-ink px-4 py-3 text-sm font-semibold text-white">Create Provisioning Job</button>
          </form>

          {error && <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</div>}
          {result && (
            <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
              {result.jobId} - {result.status}: {result.message}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
