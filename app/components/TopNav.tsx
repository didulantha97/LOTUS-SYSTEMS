"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Products" },
  { href: "/plans", label: "Plans" },
  { href: "/checkout", label: "Checkout" },
  { href: "/provisioning", label: "Provisioning" },
  { href: "/admin", label: "Admin" },
  { href: "/portal", label: "Client Portal" }
];

export function TopNav() {
  const pathname = usePathname();

  return (
    <header className="border-b border-lotus-ink/10 bg-white/75 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-4">
        <div>
          <div className="text-xs font-semibold uppercase tracking-[0.3em] text-lotus-ink/60">Lotus Systems</div>
          <div className="text-xl font-bold">Marketplace + Provisioning Platform</div>
        </div>
        <nav className="flex flex-wrap gap-2 sm:gap-3">
          {links.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-xl px-3 py-2 text-sm font-medium transition ${
                  active
                    ? "bg-lotus-ink text-white"
                    : "border border-lotus-ink/20 text-lotus-ink/75 hover:text-lotus-ink"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
