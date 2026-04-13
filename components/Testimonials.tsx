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
    <section className="bg-secondary/30 py-24 overflow-hidden">
      <div className="mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8">
        <div className="mb-20 text-center">
          <h2 className="text-3xl font-black tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            What Our <span className="text-primary italic">Customers</span> Say
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto font-medium">
            Join hundreds of satisfied customers across Nigeria who have achieved reliable power with Global 7CS.
          </p>
        </div>

        <div className="relative mx-auto max-w-4xl">
          <div className="relative min-h-[450px] sm:min-h-[400px]">
            <AnimatePresence initial={false} custom={direction} mode="wait">
              <motion.div
                key={currentIndex}
                custom={direction}
                initial={{ opacity: 0, x: direction > 0 ? 200 : -200 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: direction > 0 ? -200 : 200 }}
                transition={{ 
                  x: { type: "spring", stiffness: 300, damping: 30 },
                  opacity: { duration: 0.3 }
                }}
                className="absolute inset-0 flex flex-col items-center text-center"
              >
                <div className="relative mb-10 h-24 w-24 overflow-hidden rounded-full border-4 border-primary/20 p-1 shadow-xl shadow-primary/10">
                  <Image 
                    src={TESTIMONIALS[currentIndex].avatar} 
                    alt={TESTIMONIALS[currentIndex].name} 
                    fill 
                    className="rounded-full object-cover"
                  />
                </div>
                
                <div className="mb-8 flex gap-1.5">
                  {Array.from({ length: TESTIMONIALS[currentIndex].rating }).map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-primary text-primary" />
                  ))}
                </div>

                <div className="relative mb-10 px-4">
                  <Quote className="absolute -top-6 -left-2 h-12 w-12 text-primary/10 sm:-left-8 sm:h-16 sm:w-16" />
                  <p className="relative z-10 text-xl font-bold italic text-foreground leading-relaxed sm:text-2xl md:text-3xl">
                    &quot;{TESTIMONIALS[currentIndex].quote}&quot;
                  </p>
                </div>

                <div className="mt-auto">
                  <h4 className="text-xl font-black text-foreground">
                    {TESTIMONIALS[currentIndex].name}
                  </h4>
                  <p className="text-xs font-black uppercase tracking-[0.2em] text-primary mt-2">
                    {TESTIMONIALS[currentIndex].location}, Nigeria
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation Controls */}
          <div className="mt-12 flex items-center justify-center gap-6">
            <button 
              onClick={slidePrev}
              className="flex h-12 w-12 cursor-pointer items-center justify-center rounded-full border border-border bg-card text-foreground transition-all hover:scale-110 hover:border-primary hover:text-primary active:scale-90 shadow-sm"
              aria-label="Previous testimonial"
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
                  className={`h-2.5 rounded-full transition-all duration-500 ${
                    i === currentIndex ? "w-10 bg-primary shadow-lg shadow-primary/20" : "w-2.5 bg-border hover:bg-primary/30"
                  }`}
                  aria-label={`Go to testimonial ${i + 1}`}
                />
              ))}
            </div>

            <button 
              onClick={slideNext}
              className="flex h-12 w-12 cursor-pointer items-center justify-center rounded-full border border-border bg-card text-foreground transition-all hover:scale-110 hover:border-primary hover:text-primary active:scale-90 shadow-sm"
              aria-label="Next testimonial"
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
