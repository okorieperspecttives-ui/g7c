"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus, HelpCircle } from "lucide-react";

const FAQS = [
  {
    question: "How long does delivery take?",
    answer: "For major cities like Lagos, Abuja, and Port Harcourt, delivery typically takes 2–3 business days. For other states, please allow 3–5 business days.",
  },
  {
    question: "Do you offer installation services?",
    answer: "Yes! We have a network of certified energy technicians across Nigeria. You can select 'Installation Support' during checkout or contact us via WhatsApp after your purchase.",
  },
  {
    question: "What is your warranty policy?",
    answer: "All products listed on our marketplace come with a minimum 12-month manufacturer warranty. High-end lithium batteries often carry 2–5 year warranties. We handle the warranty claim process for you.",
  },
  {
    question: "Are the products genuine/original?",
    answer: "Absolutely. We vet every vendor and product. We only list genuine equipment from reputable brands to ensure the safety and longevity of your energy system.",
  },
  {
    question: "Do you deliver to all states in Nigeria?",
    answer: "Yes, we provide nationwide delivery to all 36 states and the FCT through our reliable logistics partners.",
  },
  {
    question: "How does the installment plan work?",
    answer: "Our installment plan allows you to pay for your system over 3, 6, or 12 months. After a successful credit check and initial down payment, your products are shipped, and subsequent payments are automated.",
  },
  {
    question: "What if I have issues after purchase?",
    answer: "We offer dedicated after-sales support. You can reach out to our technical team via our support line or WhatsApp for troubleshooting and maintenance advice.",
  },
];

const FAQItem = ({ question, answer, isOpen, onClick }: { 
  question: string; 
  answer: string; 
  isOpen: boolean; 
  onClick: () => void;
}) => {
  return (
    <div className="border-b border-[color:var(--border)] last:border-none">
      <button
        onClick={onClick}
        className="flex w-full cursor-pointer items-center justify-between py-8 text-left focus:outline-none"
      >
        <span className="text-xl font-bold text-[color:var(--foreground)] pr-8">
          {question}
        </span>
        <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[color:var(--border)] transition-colors ${isOpen ? "bg-[color:var(--primary)] border-[color:var(--primary)] text-[color:var(--primary-foreground)]" : "text-[color:var(--muted-foreground)]"}`}>
          {isOpen ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
        </div>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <p className="pb-8 text-lg text-[color:var(--muted-foreground)] leading-relaxed max-w-3xl">
              {answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="py-24 bg-[color:var(--background)]">
      <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-12">
          {/* Header */}
          <div className="lg:col-span-4">
            <div className="sticky top-32">
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-[color:var(--primary)]/10 text-[color:var(--primary)]">
                <HelpCircle className="h-8 w-8" />
              </div>
              <h2 className="text-4xl font-bold tracking-tight text-[color:var(--foreground)] sm:text-5xl">
                Frequently Asked Questions
              </h2>
              <p className="mt-6 text-lg text-[color:var(--muted-foreground)]">
                Everything you need to know about our products, delivery, and services. Can&apos;t find the answer? <span className="text-[color:var(--primary)] font-bold cursor-pointer hover:underline">Contact our support.</span>
              </p>
            </div>
          </div>

          {/* Accordion */}
          <div className="lg:col-span-8">
            <div className="rounded-[3rem] border border-[color:var(--border)] bg-[color:var(--card)] px-8 sm:px-12">
              {FAQS.map((faq, i) => (
                <FAQItem
                  key={i}
                  question={faq.question}
                  answer={faq.answer}
                  isOpen={openIndex === i}
                  onClick={() => setOpenIndex(openIndex === i ? null : i)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
