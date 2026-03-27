"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";

import { TopNav } from "@/app/components/TopNav";
import { useAuth } from "@/app/components/AuthProvider";

type Product = {
  key: string;
  name: string;
  status: string;
  startingPrice: string;
  description?: string;
  repositoryUrl?: string;
  documentationUrl?: string;
  latestVersion?: string;
  downloadUrl?: string;
};

type Customer = {
  customerId: string;
  companyName: string;
  email: string;
  lifecycleStatus: string;
};

type StripeConfig = {
  configured: boolean;
  publishableKey: string;
  webhookSecretConfigured: string;
};

export default function AdminPage() {
  const { isHydrated, session } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [stripeConfig, setStripeConfig] = useState<StripeConfig | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [newProduct, setNewProduct] = useState<Product>({
    key: "",
    name: "",
    status: "PLANNED",
    startingPrice: "99/mo",
    description: "",
    repositoryUrl: "",
    documentationUrl: "",
    latestVersion: "",
    downloadUrl: ""
  });

  const [newCustomer, setNewCustomer] = useState<Customer>({
    customerId: "",
    companyName: "",
    email: "",
    lifecycleStatus: "ONBOARDING"
  });

  const [stripeForm, setStripeForm] = useState({
    publishableKey: "",
    secretKey: "",
    webhookSecret: ""
  });

  const load = async () => {
    try {
      setError(null);
      const [productsRes, customersRes, stripeRes] = await Promise.all([
        fetch("/api/admin/products", { cache: "no-store" }),
        fetch("/api/admin/customers", { cache: "no-store" }),
        fetch("/api/admin/stripe/config", { cache: "no-store" })
      ]);

      if (!productsRes.ok || !customersRes.ok || !stripeRes.ok) {
        throw new Error("Failed to load admin resources");
      }

      setProducts((await productsRes.json()) as Product[]);
      setCustomers((await customersRes.json()) as Customer[]);
      const cfg = (await stripeRes.json()) as StripeConfig;
      setStripeConfig(cfg);
      setStripeForm((current) => ({
        ...current,
        publishableKey: cfg.publishableKey ?? ""
      }));
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unexpected admin page error";
      setError(message);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const saveProduct = async (event: FormEvent) => {
    event.preventDefault();
    const response = await fetch("/api/admin/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newProduct)
    });

    if (!response.ok) {
      setError("Failed to save product");
      return;
    }

    setNewProduct({
      key: "",
      name: "",
      status: "PLANNED",
      startingPrice: "99/mo",
      description: "",
      repositoryUrl: "",
      documentationUrl: "",
      latestVersion: "",
      downloadUrl: ""
    });
    await load();
  };

  const toggleProductStatus = async (product: Product) => {
    const nextStatus = product.status === "LIVE" ? "PAUSED" : "LIVE";
    const response = await fetch(`/api/admin/products/${product.key}/status`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: nextStatus })
    });

    if (!response.ok) {
      setError("Failed to update product status");
      return;
    }

    await load();
  };

  const saveCustomer = async (event: FormEvent) => {
    event.preventDefault();
    const response = await fetch("/api/admin/customers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newCustomer)
    });

    if (!response.ok) {
      setError("Failed to save customer");
      return;
    }

    setNewCustomer({ customerId: "", companyName: "", email: "", lifecycleStatus: "ONBOARDING" });
    await load();
  };

  const saveStripeConfig = async (event: FormEvent) => {
    event.preventDefault();

    const response = await fetch("/api/admin/stripe/config", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(stripeForm)
    });

    if (!response.ok) {
      setError("Failed to save stripe config");
      return;
    }

    await load();
  };


  if (isHydrated && session.role !== "admin") {
    return (
      <div className="min-h-screen text-lotus-ink">
        <TopNav />
        <main className="mx-auto max-w-3xl px-6 py-8">
          <section className="rounded-3xl border border-lotus-ink/10 bg-white p-6 shadow-panel">
            <h1 className="text-3xl font-bold">Admin access required</h1>
            <p className="mt-2 text-lotus-ink/70">Sign in as an admin to manage products, customers, and Stripe configuration.</p>
            <Link href="/login?role=admin&redirect=%2Fadmin" className="mt-5 inline-flex rounded-xl bg-lotus-ink px-4 py-2 font-semibold text-white">
              Go to Admin Login
            </Link>
          </section>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-lotus-ink">
      <TopNav />
      <main className="mx-auto grid max-w-7xl gap-6 px-6 py-8 lg:grid-cols-2">
        {error && <div className="lg:col-span-2 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</div>}

        <section className="rounded-3xl border border-lotus-ink/10 bg-white p-6 shadow-panel">
          <h1 className="text-2xl font-bold">Manage Products</h1>
          <div className="mt-4 space-y-3">
            {products.map((product) => (
              <div key={product.key} className="flex items-center justify-between rounded-xl border border-lotus-ink/10 p-3 text-sm">
                <div>
                  <div className="font-semibold">{product.name}</div>
                  <div className="text-lotus-ink/65">{product.key} • {product.startingPrice}</div>
                  <div className="text-lotus-ink/65">Latest: {product.latestVersion ?? "n/a"}</div>
                </div>
                <button type="button" className="rounded-xl bg-lotus-ink px-3 py-2 text-white" onClick={() => toggleProductStatus(product)}>
                  {product.status === "LIVE" ? "Pause" : "Go Live"}
                </button>
              </div>
            ))}
          </div>

          <form className="mt-5 grid gap-3" onSubmit={saveProduct}>
            <input value={newProduct.key} onChange={(e) => setNewProduct({ ...newProduct, key: e.target.value })} className="rounded-xl border border-lotus-ink/20 px-3 py-2" placeholder="product key" required />
            <input value={newProduct.name} onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })} className="rounded-xl border border-lotus-ink/20 px-3 py-2" placeholder="name" required />
            <input value={newProduct.startingPrice} onChange={(e) => setNewProduct({ ...newProduct, startingPrice: e.target.value })} className="rounded-xl border border-lotus-ink/20 px-3 py-2" placeholder="starting price" required />
            <textarea value={newProduct.description} onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })} className="rounded-xl border border-lotus-ink/20 px-3 py-2" placeholder="description" required />
            <input value={newProduct.latestVersion} onChange={(e) => setNewProduct({ ...newProduct, latestVersion: e.target.value })} className="rounded-xl border border-lotus-ink/20 px-3 py-2" placeholder="latest version (e.g. v1.0.0)" />
            <input value={newProduct.repositoryUrl} onChange={(e) => setNewProduct({ ...newProduct, repositoryUrl: e.target.value })} className="rounded-xl border border-lotus-ink/20 px-3 py-2" placeholder="repository URL" />
            <input value={newProduct.documentationUrl} onChange={(e) => setNewProduct({ ...newProduct, documentationUrl: e.target.value })} className="rounded-xl border border-lotus-ink/20 px-3 py-2" placeholder="documentation URL" />
            <input value={newProduct.downloadUrl} onChange={(e) => setNewProduct({ ...newProduct, downloadUrl: e.target.value })} className="rounded-xl border border-lotus-ink/20 px-3 py-2" placeholder="download URL" />
            <button type="submit" className="rounded-xl bg-lotus-jade px-4 py-2 text-white">Save Product</button>
          </form>
        </section>

        <section className="rounded-3xl border border-lotus-ink/10 bg-white p-6 shadow-panel">
          <h2 className="text-2xl font-bold">Configure Stripe</h2>
          <div className="mt-3 rounded-xl border border-lotus-ink/10 bg-lotus-sand/40 px-3 py-2 text-sm">
            Configured: {stripeConfig?.configured ? "YES" : "NO"} | Webhook secret configured: {stripeConfig?.webhookSecretConfigured ?? "NO"}
          </div>
          <form className="mt-4 grid gap-3" onSubmit={saveStripeConfig}>
            <input value={stripeForm.publishableKey} onChange={(e) => setStripeForm({ ...stripeForm, publishableKey: e.target.value })} className="rounded-xl border border-lotus-ink/20 px-3 py-2" placeholder="publishable key" />
            <input value={stripeForm.secretKey} onChange={(e) => setStripeForm({ ...stripeForm, secretKey: e.target.value })} className="rounded-xl border border-lotus-ink/20 px-3 py-2" placeholder="secret key" />
            <input value={stripeForm.webhookSecret} onChange={(e) => setStripeForm({ ...stripeForm, webhookSecret: e.target.value })} className="rounded-xl border border-lotus-ink/20 px-3 py-2" placeholder="webhook secret" />
            <button type="submit" className="rounded-xl bg-lotus-jade px-4 py-2 text-white">Save Stripe Config</button>
          </form>

          <h3 className="mt-8 text-xl font-semibold">Manage Customers</h3>
          <div className="mt-3 space-y-2 text-sm">
            {customers.map((customer) => (
              <div key={customer.customerId} className="rounded-xl border border-lotus-ink/10 p-3">
                <div className="font-semibold">{customer.companyName}</div>
                <div className="text-lotus-ink/65">{customer.customerId} • {customer.email} • {customer.lifecycleStatus}</div>
              </div>
            ))}
          </div>

          <form className="mt-5 grid gap-3" onSubmit={saveCustomer}>
            <input value={newCustomer.customerId} onChange={(e) => setNewCustomer({ ...newCustomer, customerId: e.target.value })} className="rounded-xl border border-lotus-ink/20 px-3 py-2" placeholder="customer id" required />
            <input value={newCustomer.companyName} onChange={(e) => setNewCustomer({ ...newCustomer, companyName: e.target.value })} className="rounded-xl border border-lotus-ink/20 px-3 py-2" placeholder="company name" required />
            <input value={newCustomer.email} onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })} className="rounded-xl border border-lotus-ink/20 px-3 py-2" placeholder="email" required />
            <select value={newCustomer.lifecycleStatus} onChange={(e) => setNewCustomer({ ...newCustomer, lifecycleStatus: e.target.value })} className="rounded-xl border border-lotus-ink/20 px-3 py-2">
              <option value="ONBOARDING">ONBOARDING</option>
              <option value="ACTIVE">ACTIVE</option>
              <option value="SUSPENDED">SUSPENDED</option>
            </select>
            <button type="submit" className="rounded-xl bg-lotus-ink px-4 py-2 text-white">Save Customer</button>
          </form>
        </section>
      </main>
    </div>
  );
}
