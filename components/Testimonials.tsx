"use client";

import { Star, Quote, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useCallback } from "react";
import Image from "next/image";

const TESTIMONIALS = [
  {
    name: "Emeka Obi",
    location: "Lagos",
    quote: "Finally found a reliable energy marketplace. The installation for my Sparta system was seamless, and the backup power has been consistent during outages.",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1974&auto=format&fit=crop",
  },
  {
    name: "Aisha Mohammed",
    location: "Abuja",
    quote: "Purchased a portable power station for my home office. Excellent quality and the 15% markup is very fair compared to local physical stores. Highly recommend!",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1974&auto=format&fit=crop",
  },
  {
    name: "Olawale Johnson",
    location: "Ibadan",
    quote: "The installment payment plan made it possible for me to get a full solar kit for my business. Great support team and quality products.",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1974&auto=format&fit=crop",
  },
  {
    name: "Chinelo Eze",
    location: "Enugu",
    quote: "Clean, professional, and trustworthy. The Power Tank essential backup is working perfectly. Fast delivery to Enugu as promised.",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?q=80&w=1974&auto=format&fit=crop",
  },
  {
    name: "Babatunde R.",
    location: "Kano",
    quote: "Superior customer service. They guided me on the right inverter size for my home. Very satisfied with the efficiency and warranty support.",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1522529599102-193c0d76b5b6?q=80&w=2070&auto=format&fit=crop",
  },
  {
    name: "Funmi A.",
    location: "Port Harcourt",
    quote: "Energy independence at its finest. No more noise pollution from generators. Global 7CS is the real deal for quality solar panels.",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?q=80&w=1974&auto=format&fit=crop",
  },
];

const Testimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const slideNext = useCallback(() => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % TESTIMONIALS.length);
  }, []);

  const slidePrev = useCallback(() => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);
  }, []);

  useEffect(() => {
    const timer = setInterval(slideNext, 8000);
    return () => clearInterval(timer);
  }, [slideNext]);

  return (
    <section className="bg-[color:var(--secondary)]/30 py-24">
      <div className="mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8">
        <div className="mb-20 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-[color:var(--foreground)] sm:text-4xl lg:text-5xl">
            What Our Customers Say
          </h2>
          <p className="mt-4 text-lg text-[color:var(--muted-foreground)] max-w-2xl mx-auto">
            Join hundreds of satisfied customers across Nigeria who have achieved reliable power with Global 7CS.
          </p>
        </div>

        <div className="relative mx-auto max-w-4xl">
          <AnimatePresence initial={false} custom={direction}>
            <motion.div
              key={currentIndex}
              custom={direction}
              initial={{ opacity: 0, x: direction > 0 ? 100 : -100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: direction > 0 ? -100 : 100 }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="flex flex-col items-center text-center"
            >
              <div className="relative mb-12 h-24 w-24 overflow-hidden rounded-full border-4 border-[color:var(--primary)]/20 p-1">
                <Image 
                  src={TESTIMONIALS[currentIndex].avatar} 
                  alt={TESTIMONIALS[currentIndex].name} 
                  fill 
                  className="rounded-full object-cover"
                />
              </div>
              
              <div className="mb-8 flex gap-1">
                {Array.from({ length: TESTIMONIALS[currentIndex].rating }).map((_, i) => (
                  <Star key={i} className="h-6 w-6 fill-[color:var(--primary)] text-[color:var(--primary)]" />
                ))}
              </div>

              <div className="relative mb-12">
                <Quote className="absolute -top-8 -left-8 h-16 w-16 text-[color:var(--primary)]/10" />
                <p className="relative z-10 text-2xl font-medium italic text-[color:var(--foreground)] leading-relaxed md:text-3xl">
                  &quot;{TESTIMONIALS[currentIndex].quote}&quot;
                </p>
              </div>

              <div>
                <h4 className="text-xl font-bold text-[color:var(--foreground)]">
                  {TESTIMONIALS[currentIndex].name}
                </h4>
                <p className="text-sm font-black uppercase tracking-[0.2em] text-[color:var(--primary)] mt-2">
                  {TESTIMONIALS[currentIndex].location}, Nigeria
                </p>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation Controls */}
          <div className="mt-16 flex items-center justify-center gap-6">
            <button 
              onClick={slidePrev}
              className="flex h-12 w-12 cursor-pointer items-center justify-center rounded-full border border-[color:var(--border)] bg-[color:var(--card)] text-[color:var(--foreground)] transition-all hover:border-[color:var(--primary)] hover:text-[color:var(--primary)] active:scale-90"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            
            <div className="flex gap-3">
              {TESTIMONIALS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setDirection(i > currentIndex ? 1 : -1);
                    setCurrentIndex(i);
                  }}
                  className={`h-2.5 rounded-full transition-all duration-300 ${
                    i === currentIndex ? "w-10 bg-[color:var(--primary)]" : "w-2.5 bg-[color:var(--border)]"
                  }`}
                />
              ))}
            </div>

            <button 
              onClick={slideNext}
              className="flex h-12 w-12 cursor-pointer items-center justify-center rounded-full border border-[color:var(--border)] bg-[color:var(--card)] text-[color:var(--foreground)] transition-all hover:border-[color:var(--primary)] hover:text-[color:var(--primary)] active:scale-90"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
