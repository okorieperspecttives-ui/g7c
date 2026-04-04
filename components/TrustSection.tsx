"use client";

import { Wallet, ShieldCheck, Zap, Truck, Headphones, BadgeCheck } from "lucide-react";

const TRUST_ITEMS = [
  {
    icon: Wallet,
    title: "Save Money on Energy",
    description: "Lower your monthly electricity bills with efficient alternative power systems.",
  },
  {
    icon: ShieldCheck,
    title: "Advanced Safety Features",
    description: "Our curated products feature multi-layer battery protection and fail-safes.",
  },
  {
    icon: Zap,
    title: "Reliable Performance",
    description: "Consistent backup power designed to handle Nigeria's unique energy demands.",
  },
  {
    icon: Truck,
    title: "Fast Nationwide Delivery",
    description: "Secure and timely shipping to every state in Nigeria.",
  },
  {
    icon: Headphones,
    title: "Professional Support",
    description: "Expert installation and after-sales support for your peace of mind.",
  },
  {
    icon: BadgeCheck,
    title: "Warranty Backed",
    description: "Quality-guaranteed products with standard manufacturer warranties.",
  },
];

const TrustSection = () => {
  return (
    <section className="bg-[color:var(--secondary)] py-20">
      <div className="mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8">
        <div className="mb-16 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-[color:var(--foreground)] sm:text-4xl">
            Why Choose Our Power Solutions?
          </h2>
          <p className="mt-4 text-lg text-[color:var(--muted-foreground)]">
            We provide reliable, clean energy solutions focused on quality and performance.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-3">
          {TRUST_ITEMS.map((item) => (
            <div key={item.title} className="flex flex-col items-center text-center">
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-[color:var(--primary)]/10 text-[color:var(--primary)]">
                <item.icon className="h-8 w-8" />
              </div>
              <h3 className="mb-3 text-xl font-bold text-[color:var(--foreground)]">
                {item.title}
              </h3>
              <p className="max-w-xs text-[color:var(--muted-foreground)] leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>

        {/* Certification Badges Placeholder */}
        <div className="mt-20 flex flex-wrap justify-center gap-12 opacity-50 grayscale transition-all hover:grayscale-0">
          {["SONCAP", "ROHS", "IEC", "CE", "UN38.3"].map((cert) => (
            <div key={cert} className="flex h-12 items-center justify-center text-xl font-black tracking-tighter text-[color:var(--muted-foreground)]">
              {cert}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustSection;
