"use client";

import { useEffect, useState } from "react";

import { TopNav } from "@/app/components/TopNav";

type Product = {
  key: string;
  name: string;
  status: string;
  startingPrice: string;
};

export default function ProductsPage() {
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
        <p className="mt-2 text-lotus-ink/70">Live data from control plane catalog API.</p>
        {error && <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-rose-700">{error}</div>}
        <div className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <article key={product.key} className="rounded-3xl border border-lotus-ink/10 bg-white p-6 shadow-panel">
              <div className="flex items-center justify-between gap-4">
                <h2 className="text-xl font-semibold">{product.name}</h2>
                <span className="rounded-full bg-lotus-sand px-3 py-1 text-xs font-medium">{product.status}</span>
              </div>
              <p className="mt-4 text-sm text-lotus-ink/70">SKU: {product.key}</p>
              <p className="mt-3 text-lg font-bold">From ${product.startingPrice}</p>
            </article>
          ))}
        </div>
      </main>
    </div>
  );
}
