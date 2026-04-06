"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

const HERO_IMAGES = [
  {
    url: "/assets/hero-1.png",
    title: "Endless Energy",
    subtitle: "High-performance power solutions for your home and office.",
  },
  {
    url: "/assets/hero-2.jpg",
    title: "Solar Efficiency",
    subtitle: "Harness the sun with our premium solar panels and inverters.",
  },
  {
    url: "/assets/hero-3.png",
    title: "Power Anywhere",
    subtitle: "Portable power banks and backup systems for life on the go.",
  },
];

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % HERO_IMAGES.length);
  }, []);

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + HERO_IMAGES.length) % HERO_IMAGES.length);
  };

  useEffect(() => {
    const timer = setInterval(nextSlide, 4000);
    return () => clearInterval(timer);
  }, [nextSlide]);

  const scrollToShop = () => {
    const shopSection = document.getElementById("shop-section");
    if (shopSection) {
      shopSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative h-[80vh] w-full overflow-hidden bg-[color:var(--background)]">
      {/* Slides */}
      {HERO_IMAGES.map((slide, index) => (
        <div
          key={slide.url}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === currentSlide ? "opacity-100" : "opacity-0"
          }`}
        >
          <Image
            src={slide.url}
            alt={slide.title}
            fill
            className="object-cover brightness-[0.4]"
            priority={index === 0}
            quality={95}
            sizes="100vw"
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center">
            <h1 className="mb-4 max-w-4xl text-4xl font-bold tracking-tight text-[#ffffff] sm:text-6xl md:text-7xl">
              {slide.title}
            </h1>
            <p className="mb-8 max-w-2xl text-lg text-[#ededed] sm:text-xl">
              {slide.subtitle}
            </p>
            <button
              onClick={scrollToShop}
              className="group flex items-center gap-2 rounded-full bg-[color:var(--primary)] px-8 py-3 text-sm font-bold text-[color:var(--primary-foreground)] transition-all hover:scale-105 active:scale-95"
            >
              Scroll to Shop
              <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        </div>
      ))}

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-black/20 p-2 text-[#ffffff] backdrop-blur-sm transition-colors hover:bg-black/40"
        aria-label="Previous slide"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-black/20 p-2 text-[#ffffff] backdrop-blur-sm transition-colors hover:bg-black/40"
        aria-label="Next slide"
      >
        <ChevronRight className="h-6 w-6" />
      </button>

      {/* Dots */}
      <div className="absolute bottom-8 left-1/2 flex -translate-x-1/2 gap-3">
        {HERO_IMAGES.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`h-2 w-2 rounded-full transition-all ${
              index === currentSlide ? "w-8 bg-[color:var(--primary)]" : "bg-white/30"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
};

export default Hero;
