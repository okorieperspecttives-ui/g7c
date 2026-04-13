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
    subtitle: "Portable power stations and backup systems for life on the go.",
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
    <section className="relative h-[80vh] w-full overflow-hidden bg-background">
      {/* Slides */}
      {HERO_IMAGES.map((slide, index) => (
        <div
          key={slide.url}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0"
          }`}
        >
          {/* Proper Image Component */}
          <div className="relative h-full w-full">
            <Image
              src={slide.url}
              alt={slide.title}
              fill
              className="object-cover"
              priority={index === 0}
              quality={95}
              sizes="100vw"
            />
            {/* Subtle dark overlay/gradient at the bottom for readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          </div>

          {/* Content Positioned Bottom-Left */}
          <div className="absolute bottom-0 left-0 w-full p-8 sm:p-12 md:p-16 lg:p-24 text-left">
            <div className="max-w-4xl space-y-4 sm:space-y-6">
              <h1 className="text-4xl font-black tracking-tight text-white sm:text-6xl md:text-7xl lg:text-8xl drop-shadow-lg">
                {slide.title}
              </h1>
              <p className="max-w-2xl text-lg font-bold text-white/90 sm:text-xl md:text-2xl drop-shadow-md">
                {slide.subtitle}
              </p>
              <div className="pt-4 sm:pt-6">
                <button
                  onClick={scrollToShop}
                  className="group flex items-center gap-3 rounded-full bg-primary px-8 py-4 text-sm font-black uppercase tracking-widest text-primary-foreground shadow-xl shadow-primary/20 transition-all hover:scale-105 active:scale-95"
                >
                  Shop Now
                  <ChevronRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Arrows */}
      <div className="absolute right-8 bottom-8 z-20 flex gap-4 sm:right-12 sm:bottom-12 md:right-16 md:bottom-16">
        <button
          onClick={prevSlide}
          className="rounded-full border border-white/20 bg-black/20 p-3 text-white backdrop-blur-md transition-all hover:bg-black/40 hover:border-white/40 active:scale-95"
          aria-label="Previous slide"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
        <button
          onClick={nextSlide}
          className="rounded-full border border-white/20 bg-black/20 p-3 text-white backdrop-blur-md transition-all hover:bg-black/40 hover:border-white/40 active:scale-95"
          aria-label="Next slide"
        >
          <ChevronRight className="h-6 w-6" />
        </button>
      </div>

      {/* Dots (Positioned near the arrows) */}
      <div className="absolute bottom-24 right-8 z-20 flex flex-col gap-3 sm:right-12 sm:bottom-32 md:right-16 md:bottom-36">
        {HERO_IMAGES.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`h-2 rounded-full transition-all ${
              index === currentSlide ? "h-8 bg-primary" : "h-2 bg-white/30"
            } w-2`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
};

export default Hero;
