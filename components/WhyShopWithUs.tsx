"use client";

import { motion } from "framer-motion";
import { 
  Truck, 
  Settings, 
  ShieldCheck, 
  CreditCard, 
  Lock 
} from "lucide-react";

const REASONS = [
  {
    title: "Fast Nationwide Delivery",
    description: "Reliable delivery to all 36 states in Nigeria within 2–5 business days.",
    icon: Truck,
  },
  {
    title: "Professional Installation",
    description: "Expert installation support from our network of certified energy technicians.",
    icon: Settings,
  },
  {
    title: "Genuine Products",
    description: "Every product in our marketplace comes with a verifiable manufacturer warranty.",
    icon: ShieldCheck,
  },
  {
    title: "Flexible Payments",
    description: "Pay via Bank Transfer, Cash on Delivery, or easy Installment plans.",
    icon: CreditCard,
  },
  {
    title: "Secure Checkout",
    description: "Your data is protected with industry-standard encryption and security.",
    icon: Lock,
  },
];

const WhyShopWithUs = () => {
  return (
    <section className="py-24 bg-[color:var(--background)]">
      <div className="mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8">
        <div className="mb-16 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-[color:var(--foreground)] sm:text-4xl lg:text-5xl">
            Why Shop With Us
          </h2>
          <p className="mt-4 text-lg text-[color:var(--muted-foreground)] max-w-2xl mx-auto">
            We are building Nigeria&apos;s most trusted marketplace for alternative energy solutions.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {REASONS.map((reason, i) => (
            <motion.div
              key={reason.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group rounded-[2.5rem] border border-[color:var(--border)] bg-[color:var(--card)] p-10 transition-all duration-300 hover:border-[color:var(--primary)] hover:shadow-2xl hover:shadow-[color:var(--primary)]/5"
            >
              <div className="mb-8 flex h-16 w-16 items-center justify-center rounded-2xl bg-[color:var(--primary)]/10 text-[color:var(--primary)] transition-colors group-hover:bg-[color:var(--primary)] group-hover:text-[color:var(--primary-foreground)]">
                <reason.icon className="h-8 w-8" />
              </div>
              <h3 className="mb-4 text-xl font-bold text-[color:var(--foreground)]">
                {reason.title}
              </h3>
              <p className="text-[color:var(--muted-foreground)] leading-relaxed">
                {reason.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyShopWithUs;
