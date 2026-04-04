"use client";

import { MessageSquare, Search, CreditCard, Truck, Zap } from "lucide-react";


const STEPS = [
  {
    icon: Search,
    title: "Browse Quality Power Products",
    description: "Discover a curated range of reliable inverters, batteries, and solar kits tailored for your energy needs.",
  },
  {
    icon: CreditCard,
    title: "Choose Flexible Payment",
    description: "Pay with ease using multiple options: secure cash, direct transfer, or flexible installment plans.",
  },
  {
    icon: Truck,
    title: "Delivery & Installation",
    description: "Get your products delivered quickly and professionally installed by our expert technician network.",
  },
  {
    icon: Zap,
    title: "Enjoy Reliable Backup Power",
    description: "Experience consistent, clean energy for your home or business with premium performance you can trust.",
  },
];

const HowItWorks = () => {
  return (
    <section className="mx-auto max-w-screen-2xl px-4 py-20 sm:px-6 lg:px-8">
      <div className="mb-20 text-center">
        <h2 className="text-3xl font-bold tracking-tight text-[color:var(--foreground)] sm:text-4xl">
          How It Works
        </h2>
        <p className="mt-4 text-lg text-[color:var(--muted-foreground)]">
          Four simple steps to energy independence.
        </p>
      </div>

      <div className="relative">
        {/* Connector Line (Desktop Only) */}
        <div className="absolute top-1/2 left-0 hidden h-0.5 w-full -translate-y-1/2 bg-[color:var(--border)] lg:block" />

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-4">
          {STEPS.map((step, index) => (
            <div key={step.title} className="group relative flex flex-col items-center text-center">
              <div className="relative z-10 mb-8 flex h-20 w-20 items-center justify-center rounded-full bg-[color:var(--background)] border-4 border-[color:var(--border)] text-[color:var(--primary)] transition-all duration-300 group-hover:border-[color:var(--primary)] group-hover:scale-110">
                <step.icon className="h-10 w-10" />
                <span className="absolute -top-2 -right-2 flex h-8 w-8 items-center justify-center rounded-full bg-[color:var(--primary)] text-sm font-bold text-[color:var(--primary-foreground)]">
                  {index + 1}
                </span>
              </div>
              <h3 className="mb-4 text-xl font-bold text-[color:var(--foreground)]">
                {step.title}
              </h3>
              <p className="text-[color:var(--muted-foreground)] leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* WhatsApp Support CTA */}
      <div className="mt-20 flex flex-col items-center justify-center rounded-3xl bg-[color:var(--primary)]/10 p-12 text-center">
        <h4 className="mb-4 text-2xl font-bold text-[color:var(--foreground)]">
          Need Expert Advice?
        </h4>
        <p className="mb-8 max-w-xl text-lg text-[color:var(--muted-foreground)]">
          Our team is available to help you choose the right power system for your requirements.
        </p>
        <button className="flex cursor-pointer items-center gap-3 rounded-full bg-[color:var(--primary)] px-8 py-4 text-lg font-bold text-[color:var(--primary-foreground)] transition-all hover:scale-105 active:scale-95">
          <MessageSquare className="h-6 w-6" />
          Chat with an Expert on WhatsApp
        </button>
      </div>
    </section>
  );
};

export default HowItWorks;
