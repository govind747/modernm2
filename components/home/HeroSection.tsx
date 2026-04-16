// components/home/HeroSection.tsx
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, PawPrint } from 'lucide-react';
import { HeroImage } from '@/lib/types/database';

interface HeroSectionProps {
  heroImages: HeroImage[];
}

export default function HeroSection({ heroImages }: HeroSectionProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (heroImages.length > 1) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % heroImages.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [heroImages.length]);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % heroImages.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + heroImages.length) % heroImages.length);
  };

  if (!heroImages.length) {
    return (
      <div className="relative h-[60vh] md:h-[70vh] bg-gradient-to-r from-amber-100 to-orange-100 flex items-center justify-center">
        <div className="text-center">
          <PawPrint className="w-16 h-16 text-brand-accent mx-auto mb-4" />
          <h1 className="text-3xl md:text-5xl font-black text-gray-900">Welcome to PetShop</h1>
          <p className="text-gray-600 mt-2">Everything for your furry friends</p>
        </div>
      </div>
    );
  }

  const currentHero = heroImages[currentIndex];

  return (
    <div className="relative h-[60vh] md:h-[70vh] overflow-hidden group">
      {/* Hero Image */}
      <div className="relative w-full h-full">
        <Image
          src={currentHero.image_url}
          alt={currentHero.main_heading}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/30" />
      </div>

      {/* Content Overlay */}
      <div className="absolute inset-0 flex items-center">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white mb-4 animate-fade-in">
              {currentHero.main_heading}
            </h1>
            {currentHero.subheading && (
              <p className="text-lg md:text-xl text-white/90 mb-8 animate-fade-in-up">
                {currentHero.subheading}
              </p>
            )}
            <Link
              href={currentHero.redirect_url}
              className="inline-flex items-center gap-2 px-6 py-3 md:px-8 md:py-4 bg-brand-accent text-white font-bold rounded-full hover:bg-opacity-90 transition-all transform hover:scale-105 shadow-lg"
            >
              Shop Now
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* Navigation Buttons */}
      {heroImages.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-black/50 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-black/50 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </>
      )}

      {/* Dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {heroImages.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`h-2 rounded-full transition-all ${
              idx === currentIndex ? 'w-8 bg-brand-accent' : 'w-2 bg-white/50'
            }`}
          />
        ))}
      </div>
    </div>
  );
}