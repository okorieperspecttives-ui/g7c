import { Suspense } from "react";
import { Metadata } from "next";
import ShopClient from "./ShopClient";

export const metadata: Metadata = {
  title: "Shop Alternative Energy Products - Inverters, Batteries & More",
  description: "Browse our wide range of high-quality energy solutions. From solar panels to deep-cycle batteries, find everything you need for energy independence.",
};

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background flex items-center justify-center">Loading Marketplace...</div>}>
      <ShopClient />
    </Suspense>
  );
}
