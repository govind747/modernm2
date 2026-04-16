'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { ProductBanner } from '@/lib/types/database';

interface ProductBannersProps {
  banners: ProductBanner[];
}

export function ProductBanners({ banners }: ProductBannersProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % banners.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length);
  };

  if (banners.length === 0) return null;

  return (
    <div className="relative overflow-hidden rounded-3xl bg-white shadow-xl border border-slate-100">
      <div className="relative h-[300px] md:h-[400px]">
        <Image
          src={banners[currentIndex].image_url}
          alt={banners[currentIndex].title || 'Product banner'}
          fill
          className="object-cover"
        />
        
        {/* Overlay Content */}
        {(banners[currentIndex].title || banners[currentIndex].subtitle) && (
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent flex items-center">
            <div className="px-8 md:px-12 max-w-lg">
              {banners[currentIndex].title && (
                <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">
                  {banners[currentIndex].title}
                </h3>
              )}
              {banners[currentIndex].subtitle && (
                <p className="text-white/90 text-sm md:text-base">
                  {banners[currentIndex].subtitle}
                </p>
              )}
            </div>
          </div>
        )}
        
        {/* Navigation Buttons */}
        {banners.length > 1 && (
          <>
            <button
              onClick={prevSlide}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </>
        )}
        
        {/* Dots Indicator */}
        {banners.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {banners.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`h-2 rounded-full transition-all ${
                  idx === currentIndex ? 'w-8 bg-white' : 'w-2 bg-white/50'
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}