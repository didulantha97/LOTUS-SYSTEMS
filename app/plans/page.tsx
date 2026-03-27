"use client";

import { useEffect, useMemo, useState } from "react";

import { TopNav } from "@/app/components/TopNav";

type Product = {
  key: string;
  name: string;
  startingPrice: string;
};

const planDefinitions = [
  { key: "starter", multiplier: 1, features: "Core workflows, onboarding, and support email" },
  { key: "growth", multiplier: 1.6, features: "Advanced reporting, integrations, and SLA support" },
  { key: "enterprise", multiplier: 2.5, features: "White-labeling, premium support, and ops runbooks" }
];

function monthlyValue(raw: string): number {
  const parsed = Number(raw.replace("/mo", ""));
  return Number.isNaN(parsed) ? 99 : parsed;
}

export default function PlansPage() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const load = async () => {
      const response = await fetch("/api/catalog/products", { cache: "no-store" });
      if (!response.ok) {
        return;
      }
      setProducts((await response.json()) as Product[]);
    };

    void load();
  }, []);

  const rows = useMemo(() => {
    return products.flatMap((product) => {
      const base = monthlyValue(product.startingPrice);
      return planDefinitions.map((plan) => ({
        id: `${product.key}-${plan.key}`,
        productName: product.name,
        planName: plan.key,
        features: plan.features,
        monthly: `$${Math.round(base * plan.multiplier)}/mo`
      }));
    });
  }, [products]);

  return (
    <div className="min-h-screen text-lotus-ink">
      <TopNav />
      <main className="mx-auto max-w-7xl px-6 py-8">
        <h1 className="text-3xl font-bold">Plans</h1>
        <p className="mt-2 text-lotus-ink/70">Generated from live products so plan selection remains aligned with catalog changes.</p>
        <div className="mt-6 overflow-hidden rounded-2xl border border-lotus-ink/10 bg-white shadow-panel">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-lotus-sand">
              <tr>
                <th className="px-4 py-3">Product</th>
                <th className="px-4 py-3">Plan</th>
                <th className="px-4 py-3">Monthly Price</th>
                <th className="px-4 py-3">Features</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id} className="border-t border-lotus-ink/10">
                  <td className="px-4 py-3 font-medium">{row.productName}</td>
                  <td className="px-4 py-3 uppercase">{row.planName}</td>
                  <td className="px-4 py-3">{row.monthly}</td>
                  <td className="px-4 py-3">{row.features}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
