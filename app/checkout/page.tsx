"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";

import { TopNav } from "@/app/components/TopNav";
import { useAuth } from "@/app/components/AuthProvider";

type CheckoutResponse = {
  sessionId: string;
  status: string;
  checkoutUrl: string;
  instruction: string;
};

type WebhookResponse = {
  status: string;
  message: string;
  sessionId?: string;
};

type ProvisioningResponse = {
  jobId: string;
  status: string;
  message: string;
};

export default function CheckoutPage() {
  const { session } = useAuth();

  const [customerId, setCustomerId] = useState(session.customerId ?? "guest-customer-001");
  const [productKey, setProductKey] = useState("smart-pos");
  const [planKey, setPlanKey] = useState("growth");
  const [domainOption, setDomainOption] = useState("BUY_NEW");
  const [databaseOption, setDatabaseOption] = useState("DEDICATED");
  const [checkout, setCheckout] = useState<CheckoutResponse | null>(null);
  const [webhook, setWebhook] = useState<WebhookResponse | null>(null);
  const [provisioning, setProvisioning] = useState<ProvisioningResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setCustomerId(params.get("customerId") ?? session.customerId ?? "guest-customer-001");
    setProductKey(params.get("productKey") ?? "smart-pos");
    setPlanKey(params.get("planKey") ?? "growth");
  }, [session.customerId]);

  const createSession = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);
    setWebhook(null);
    setProvisioning(null);

    try {
      const response = await fetch("/api/checkout/session", {
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

      const body = (await response.json()) as CheckoutResponse | { error?: string };
      if (!response.ok || "error" in body) {
        throw new Error((body as { error?: string }).error ?? "Failed to create checkout session");
      }

      setCheckout(body as CheckoutResponse);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unexpected checkout error";
      setError(message);
    }
  };

  const completePayment = async () => {
    if (!checkout) {
      return;
    }

    setError(null);

    try {
      const webhookResponse = await fetch("/api/webhooks/stripe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventType: "checkout.session.completed",
          sessionId: checkout.sessionId
        })
      });

      const webhookBody = (await webhookResponse.json()) as WebhookResponse | { error?: string };
      if (!webhookResponse.ok || "error" in webhookBody) {
        throw new Error((webhookBody as { error?: string }).error ?? "Failed to process webhook event");
      }

      setWebhook(webhookBody as WebhookResponse);

      const provisioningResponse = await fetch("/api/provisioning/jobs", {
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

      const provisioningBody = (await provisioningResponse.json()) as ProvisioningResponse | { error?: string };
      if (!provisioningResponse.ok || "error" in provisioningBody) {
        throw new Error((provisioningBody as { error?: string }).error ?? "Payment succeeded but provisioning failed");
      }

      setProvisioning(provisioningBody as ProvisioningResponse);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unexpected webhook error";
      setError(message);
    }
  };

  return (
    <div className="min-h-screen text-lotus-ink">
      <TopNav />
      <main className="mx-auto grid max-w-7xl gap-6 px-6 py-8 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="rounded-3xl border border-lotus-ink/10 bg-white p-6 shadow-panel">
          <h1 className="text-3xl font-bold">Checkout to Provisioning Journey</h1>
          <p className="mt-2 text-lotus-ink/70">Selected product flows through checkout, payment webhook, then provisioning job creation.</p>

          <form className="mt-6 grid gap-4" onSubmit={createSession}>
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
            <button type="submit" className="rounded-xl bg-lotus-ink px-4 py-3 text-sm font-semibold text-white">Create Checkout Session</button>
          </form>
        </section>

        <section className="rounded-3xl border border-lotus-ink/10 bg-white p-6 shadow-panel">
          <h2 className="text-xl font-semibold">Session + Payment + Provisioning Status</h2>
          {error && <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</div>}

          {checkout && (
            <div className="mt-4 space-y-3 rounded-2xl border border-lotus-ink/10 bg-lotus-sand/40 p-4 text-sm">
              <div><strong>Session:</strong> {checkout.sessionId}</div>
              <div><strong>Status:</strong> {checkout.status}</div>
              <div><strong>Checkout URL:</strong> <a className="text-lotus-jade underline" href={checkout.checkoutUrl} target="_blank" rel="noreferrer">Open hosted checkout</a></div>
              <div className="text-lotus-ink/70">{checkout.instruction}</div>
              <button type="button" onClick={completePayment} className="rounded-xl bg-lotus-jade px-4 py-2 font-semibold text-white">Simulate Payment + Provisioning</button>
            </div>
          )}

          {webhook && (
            <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
              {webhook.status}: {webhook.message}
            </div>
          )}

          {provisioning && (
            <div className="mt-4 space-y-3 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-3 text-sm text-emerald-800">
              <div>
                Provisioning job {provisioning.jobId} - {provisioning.status}: {provisioning.message}
              </div>
              <div className="flex flex-wrap gap-2">
                <Link href={session.role === "customer" ? `/portal?customerId=${encodeURIComponent(customerId)}` : "/products"} className="rounded-lg bg-white px-3 py-2 font-semibold text-lotus-ink">
                  {session.role === "customer" ? "Open Customer Portal" : "Back to Products"}
                </Link>
                <Link href="/provisioning" className="rounded-lg border border-emerald-700/30 bg-white px-3 py-2 font-semibold text-lotus-ink">
                  View Provisioning Console
                </Link>
              </div>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
