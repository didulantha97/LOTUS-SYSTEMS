"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

import { TopNav } from "@/app/components/TopNav";

type Product = {
  key: string;
  name: string;
  status: string;
  startingPrice: string;
};

type HealthStatus = {
  service: string;
  status: string;
  timestamp: string;
};

type ProvisioningResponse = {
  jobId: string;
  status: string;
  message: string;
};

const productDescriptions: Record<string, string> = {
  "smart-pos": "Sell, manage inventory, sync orders, and connect optional Salesforce workflows.",
  "booking-platform": "Reservations, customer records, and operational dashboards for service businesses.",
  "inventory-control": "Stock movement, supplier visibility, reorder levels, and reporting."
};

const stats = [
  ["Products", "3"],
  ["Active Tenants", "128"],
  ["Provisioning Jobs", "12"],
  ["Monthly Revenue", "$18.4K"]
];

const provisioningSteps = [
  "Choose product and plan",
  "Select or connect domain",
  "Select dedicated database",
  "Complete billing",
  "Provision isolated environment",
  "Send launch access to customer"
];

const jobs = [
  {
    customer: "Cinnamon Retail",
    product: "Smart POS",
    domain: "pos.cinnamonretail.com",
    db: "Dedicated PostgreSQL",
    status: "Provisioning"
  },
  {
    customer: "Lotus Mart",
    product: "Smart POS",
    domain: "lotusmartpos.com",
    db: "Customer Managed DB",
    status: "Domain Verification"
  },
  {
    customer: "Blue Orchid Foods",
    product: "Booking Platform",
    domain: "app.blueorchidfoods.com",
    db: "Dedicated PostgreSQL",
    status: "Active"
  }
];

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [health, setHealth] = useState<HealthStatus | null>(null);
  const [pageError, setPageError] = useState<string | null>(null);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [provisioningResult, setProvisioningResult] = useState<ProvisioningResponse | null>(null);
  const [isProvisioning, setIsProvisioning] = useState(false);

  useEffect(() => {
    const loadPageData = async () => {
      try {
        setPageError(null);
        const [productsRes, healthRes] = await Promise.all([
          fetch("/api/catalog/products", { cache: "no-store" }),
          fetch("/api/support/status", { cache: "no-store" })
        ]);

        if (!productsRes.ok) {
          throw new Error("Unable to load product catalog");
        }

        if (!healthRes.ok) {
          throw new Error("Control plane health check failed");
        }

        const [productsData, healthData]: [Product[], HealthStatus] = await Promise.all([
          productsRes.json(),
          healthRes.json()
        ]);

        setProducts(productsData);
        setHealth(healthData);
      } catch (error) {
        const message = error instanceof Error ? error.message : "Unexpected error while loading data";
        setPageError(message);
      } finally {
        setLoadingProducts(false);
      }
    };

    void loadPageData();
  }, []);

  const displayedStats = useMemo(() => {
    return stats.map(([label, value]) => {
      if (label === "Products") {
        return [label, String(products.length || value)];
      }
      return [label, value];
    });
  }, [products]);

  const startProvisioning = async () => {
    setIsProvisioning(true);
    setProvisioningResult(null);
    setPageError(null);

    try {
      const defaultProduct = products[0] ?? { key: "smart-pos" };
      const response = await fetch("/api/provisioning/jobs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          customerId: "demo-customer-001",
          productKey: defaultProduct.key,
          planKey: "growth",
          domainOption: "BUY_NEW",
          databaseOption: "DEDICATED"
        })
      });

      const responseBody = await response.json();

      if (!response.ok) {
        throw new Error(responseBody?.error ?? "Failed to create provisioning job");
      }

      setProvisioningResult(responseBody as ProvisioningResponse);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unexpected provisioning error";
      setPageError(message);
    } finally {
      setIsProvisioning(false);
    }
  };

  return (
    <div className="min-h-screen text-lotus-ink">
      <TopNav />

      <main className="mx-auto max-w-7xl space-y-8 px-6 py-8">
        <section className="hero-grid fade-rise grid gap-6 rounded-3xl p-1 lg:grid-cols-[1.3fr_0.7fr]">
          <div className="rounded-3xl bg-white p-8 shadow-panel ring-1 ring-lotus-ink/10">
            <div className="mb-3 inline-flex rounded-full border border-lotus-ink/15 bg-lotus-sand px-3 py-1 text-xs font-medium text-lotus-ink/75">
              Main Marketplace Website
            </div>
            <h1 className="max-w-3xl text-4xl font-bold tracking-tight">
              Sell software products, let customers choose their domain and database, and launch isolated deployments.
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-lotus-ink/70">
              A production-oriented starter for Lotus Systems with a product marketplace, a guided onboarding wizard,
              and an internal control dashboard for provisioning and support.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <button
                className="rounded-2xl bg-lotus-ink px-5 py-3 text-sm font-semibold text-white disabled:opacity-60"
                onClick={startProvisioning}
                disabled={isProvisioning}
                type="button"
              >
                {isProvisioning ? "Starting..." : "Start Free Demo"}
              </button>
              <Link href="/products" className="rounded-2xl border border-lotus-ink/25 px-5 py-3 text-sm font-semibold text-lotus-ink">
                View Products
              </Link>
            </div>
            {(pageError || provisioningResult || health) && (
              <div className="mt-4 space-y-2 text-sm">
                {pageError && <div className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-rose-700">{pageError}</div>}
                {provisioningResult && (
                  <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-emerald-800">
                    Job {provisioningResult.jobId} created with status {provisioningResult.status}.
                  </div>
                )}
                {health && (
                  <div className="rounded-xl border border-lotus-ink/10 bg-lotus-sand/50 px-3 py-2 text-lotus-ink/80">
                    Control plane {health.service} is {health.status}.
                  </div>
                )}
              </div>
            )}
            <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {displayedStats.map(([label, value], index) => (
                <div key={label} className="rounded-2xl border border-lotus-ink/10 bg-white p-4 fade-rise" style={{ animationDelay: `${index * 80}ms` }}>
                  <div className="text-sm text-lotus-ink/60">{label}</div>
                  <div className="mt-2 text-2xl font-bold">{value}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl bg-gradient-to-br from-lotus-ink to-lotus-jade p-8 text-white shadow-panel">
            <div className="text-sm font-semibold uppercase tracking-[0.24em] text-white/75">Checkout Summary</div>
            <div className="mt-6 rounded-2xl bg-white/10 p-5">
              <div className="text-sm text-white/80">Selected Product</div>
              <div className="mt-1 text-xl font-semibold">Smart POS · Growth Plan</div>
            </div>
            <div className="mt-4 space-y-3 text-sm text-white/90">
              <div className="flex justify-between"><span>Domain</span><span>Buy new domain</span></div>
              <div className="flex justify-between"><span>Database</span><span>Dedicated DB</span></div>
              <div className="flex justify-between"><span>Provisioning</span><span>Isolated deploy</span></div>
              <div className="flex justify-between border-t border-white/20 pt-3 font-semibold text-white"><span>Total</span><span>$149/mo</span></div>
            </div>
          </div>
        </section>

        <section className="rounded-3xl bg-white p-8 shadow-panel ring-1 ring-lotus-ink/10">
          <div className="mb-6 flex items-end justify-between gap-4">
            <div>
              <div className="text-sm font-semibold uppercase tracking-[0.24em] text-lotus-ink/60">Products Section</div>
              <h2 className="mt-2 text-3xl font-bold">Product cards for the marketplace homepage</h2>
            </div>
            <Link href="/admin" className="rounded-2xl border border-lotus-ink/20 px-4 py-2 text-sm font-semibold">Manage Catalog</Link>
          </div>
          <div className="grid gap-5 lg:grid-cols-3">
            {loadingProducts && (
              <div className="rounded-2xl border border-lotus-ink/10 bg-lotus-sand/35 p-6 text-sm text-lotus-ink/70">
                Loading catalog from control plane...
              </div>
            )}
            {!loadingProducts && products.length === 0 && (
              <div className="rounded-2xl border border-lotus-ink/10 bg-lotus-sand/35 p-6 text-sm text-lotus-ink/70">
                No products returned by control plane.
              </div>
            )}
            {!loadingProducts && products.map((product, index) => (
              <div key={product.name} className="rounded-3xl border border-lotus-ink/10 bg-lotus-sand/35 p-6 fade-rise" style={{ animationDelay: `${index * 60}ms` }}>
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold">{product.name}</h3>
                  <span className="rounded-full bg-white px-3 py-1 text-xs font-medium text-lotus-ink/70">{product.status.toLowerCase()}</span>
                </div>
                <p className="mt-4 text-sm leading-6 text-lotus-ink/70">{productDescriptions[product.key] ?? "Managed product listing"}</p>
                <div className="mt-6 text-lg font-bold">From ${product.startingPrice}</div>
                <button className="mt-5 w-full rounded-2xl bg-lotus-ink/10 px-4 py-3 text-sm font-semibold text-lotus-ink">
                  View details
                </button>
              </div>
            ))}
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-3xl bg-white p-8 shadow-panel ring-1 ring-lotus-ink/10">
            <div className="text-sm font-semibold uppercase tracking-[0.24em] text-lotus-ink/60">Onboarding Wizard</div>
            <h2 className="mt-2 text-3xl font-bold">Customer signup and provisioning flow</h2>
            <div className="mt-6 space-y-4">
              {provisioningSteps.map((step, index) => (
                <div key={step} className="flex items-start gap-4 rounded-2xl border border-lotus-ink/10 p-4">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-lotus-ink text-sm font-bold text-white">
                    {index + 1}
                  </div>
                  <div>
                    <div className="font-semibold">{step}</div>
                    <div className="text-sm text-lotus-ink/60">Clear sequential onboarding for customer-specific deployments.</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl bg-white p-8 shadow-panel ring-1 ring-lotus-ink/10">
            <div className="text-sm font-semibold uppercase tracking-[0.24em] text-lotus-ink/60">Admin Dashboard</div>
            <h2 className="mt-2 text-3xl font-bold">Provisioning jobs and tenant control view</h2>
            <div className="mt-6 overflow-hidden rounded-2xl border border-lotus-ink/10">
              <table className="min-w-full text-left text-sm">
                <thead className="bg-lotus-sand text-lotus-ink/80">
                  <tr>
                    <th className="px-4 py-3 font-semibold">Customer</th>
                    <th className="px-4 py-3 font-semibold">Product</th>
                    <th className="px-4 py-3 font-semibold">Domain</th>
                    <th className="px-4 py-3 font-semibold">Database</th>
                    <th className="px-4 py-3 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {jobs.map((job) => (
                    <tr key={job.customer} className="border-t border-lotus-ink/10">
                      <td className="px-4 py-3 font-medium">{job.customer}</td>
                      <td className="px-4 py-3">{job.product}</td>
                      <td className="px-4 py-3">{job.domain}</td>
                      <td className="px-4 py-3">{job.db}</td>
                      <td className="px-4 py-3">
                        <span className="rounded-full bg-lotus-ink/10 px-3 py-1 text-xs font-medium text-lotus-ink/85">{job.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
