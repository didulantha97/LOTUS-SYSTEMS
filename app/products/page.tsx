"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { TopNav } from "@/app/components/TopNav";
import { useAuth } from "@/app/components/AuthProvider";

type Product = {
  key: string;
  name: string;
  status: string;
  startingPrice: string;
};

export default function ProductsPage() {
  const { session } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const response = await fetch("/api/catalog/products", { cache: "no-store" });
        if (!response.ok) {
          throw new Error("Failed to load products");
        }
        const data = (await response.json()) as Product[];
        setProducts(data);
      } catch (err) {
        const message = err instanceof Error ? err.message : "Unexpected error";
        setError(message);
      }
    };

    void load();
  }, []);

  return (
    <div className="min-h-screen text-lotus-ink">
      <TopNav />
      <main className="mx-auto max-w-7xl px-6 py-8">
        <h1 className="text-3xl font-bold">Product Catalog</h1>
        <p className="mt-2 text-lotus-ink/70">Choose your product and continue as guest, customer, or admin-assisted flow.</p>
        {error && <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-rose-700">{error}</div>}
        <div className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => {
            const checkoutUrl = `/checkout?productKey=${encodeURIComponent(product.key)}`;
            const customerCheckoutUrl = `${checkoutUrl}&customerId=${encodeURIComponent(session.customerId ?? "demo-customer-001")}&mode=customer`;
            const customerLoginUrl = `/login?role=customer&redirect=${encodeURIComponent(customerCheckoutUrl)}`;
            const adminLoginUrl = `/login?role=admin&redirect=${encodeURIComponent("/admin")}`;

            return (
              <article key={product.key} className="rounded-3xl border border-lotus-ink/10 bg-white p-6 shadow-panel">
                <div className="flex items-center justify-between gap-4">
                  <h2 className="text-xl font-semibold">{product.name}</h2>
                  <span className="rounded-full bg-lotus-sand px-3 py-1 text-xs font-medium">{product.status}</span>
                </div>
                <p className="mt-4 text-sm text-lotus-ink/70">SKU: {product.key}</p>
                <p className="mt-3 text-lg font-bold">From ${product.startingPrice}</p>

                <div className="mt-5 grid gap-2 text-sm">
                  <Link href={`${checkoutUrl}&mode=guest`} className="rounded-xl bg-lotus-ink px-4 py-2 text-center font-semibold text-white">
                    Continue as Guest
                  </Link>

                  {session.role === "customer" ? (
                    <Link href={customerCheckoutUrl} className="rounded-xl border border-lotus-ink/20 px-4 py-2 text-center font-semibold">
                      Continue as Customer
                    </Link>
                  ) : (
                    <Link href={customerLoginUrl} className="rounded-xl border border-lotus-ink/20 px-4 py-2 text-center font-semibold">
                      Customer Login + Continue
                    </Link>
                  )}

                  <Link href={adminLoginUrl} className="rounded-xl border border-lotus-ink/20 px-4 py-2 text-center font-semibold">
                    Admin Login
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      </main>
    </div>
  );
}
