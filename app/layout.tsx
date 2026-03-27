import type { Metadata } from "next";

import { AuthProvider } from "@/app/components/AuthProvider";

import "./globals.css";

export const metadata: Metadata = {
  title: "Lotus Systems | Marketplace + Provisioning Platform",
  description:
    "Multi-product provisioning platform starter for isolated customer deployments."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
