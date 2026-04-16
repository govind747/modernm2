// components/products/ProductCarousel.tsx
'use client';

import { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, ShoppingBag } from 'lucide-react';
import { Product } from '@/lib/types/database';

interface ProductCarouselProps {
  title: string;
  subtitle?: string;
  products: Product[];
  variant?: 'gaming' | 'free-shipping' | 'rewards' | 'tech' | 'discount';
  bgColor?: string;
}

const variantStyles = {
  gaming: { border: 'border-purple-200', badge: 'bg-purple-600', badgeText: '🎮 Gaming', button: 'bg-purple-600' },
  'free-shipping': { border: 'border-blue-200', badge: 'bg-blue-600', badgeText: '🚚 Free Ship', button: 'bg-blue-600' },
  rewards: { border: 'border-emerald-200', badge: 'bg-emerald-600', badgeText: '⭐ 5% Rewards', button: 'bg-emerald-600' },
  tech: { border: 'border-slate-200', badge: 'bg-slate-600', badgeText: '💻 Tech', button: 'bg-slate-600' },
  discount: { border: 'border-rose-200', badge: 'bg-rose-600', badgeText: '🎉 15% OFF', button: 'bg-rose-600' },
};

export default function ProductCarousel({ title, subtitle, products, variant = 'gaming', bgColor = 'bg-white' }: ProductCarouselProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);
  const styles = variantStyles[variant];

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === 'left' ? -400 : 400;
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const checkScrollPosition = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setShowLeftArrow(scrollLeft > 0);
      setShowRightArrow(scrollLeft + clientWidth < scrollWidth - 10);
    }
  };

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', checkScrollPosition);
      checkScrollPosition();
      return () => container.removeEventListener('scroll', checkScrollPosition);
    }
  }, [products]);

  if (products.length === 0) return null;

  return (
    <section className={`py-12 ${bgColor}`}>
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-4xl font-black text-gray-900 mb-2">{title}</h2>
          {subtitle && <p className="text-gray-600">{subtitle}</p>}
        </div>

        <div className="relative">
          {showLeftArrow && (
            <button onClick={() => scroll('left')} className="absolute -left-4 top-1/2 -translate-y-1/2 z-10 p-2 bg-white shadow-lg rounded-full hover:bg-gray-100 border border-gray-200">
              <ChevronLeft className="w-5 h-5" />
            </button>
          )}

          <div ref={scrollContainerRef} className="flex overflow-x-auto scroll-smooth gap-5 pb-4 hide-scrollbar" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            {products.map((product) => (
              <Link key={product.id} href={`/products/${product.id}`} className="flex-shrink-0 w-64 group">
                <div className={`bg-white rounded-xl overflow-hidden border ${styles.border} transition-all duration-300 hover:shadow-xl hover:-translate-y-1`}>
                  <div className="relative h-48 overflow-hidden bg-gray-100">
                    {product.image_url ? (
                      <Image src={product.image_url} alt={product.name} fill className="object-cover group-hover:scale-110 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center"><ShoppingBag className="w-8 h-8 text-gray-300" /></div>
                    )}
                    <div className={`absolute top-2 left-2 px-2 py-1 ${styles.badge} text-white text-xs font-bold rounded-full`}>{styles.badgeText}</div>
                    {product.discount && product.discount > 0 && (
                      <div className="absolute top-2 right-2 px-2 py-1 bg-red-500 text-white text-xs font-bold rounded-full">-{product.discount}%</div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-gray-900 mb-1 line-clamp-1">{product.name}</h3>
                    <p className="text-xs text-gray-500 mb-2 line-clamp-2">{product.description}</p>
                    <div className="flex items-center justify-between">
                      <div><span className="text-xl font-bold text-brand-primary">${product.final_mrp}</span>
                      {product.mrp > product.final_mrp && <span className="ml-2 text-xs text-gray-400 line-through">${product.mrp}</span>}</div>
                      <button className={`p-2 rounded-full ${styles.button} text-white transition-colors`}><ShoppingBag className="w-4 h-4" /></button>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
            <Link href={`/products?reward=${variant}`} className="flex-shrink-0 w-64">
              <div className="h-full bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl flex flex-col items-center justify-center p-6 text-center transition-all hover:scale-105 hover:shadow-xl border-2 border-dashed border-gray-300">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-4 shadow-md"><ChevronRight className="w-8 h-8 text-brand-accent" /></div>
                <h3 className="font-bold text-xl text-gray-900 mb-2">See All</h3>
                <p className="text-gray-500 text-sm">View all {title.toLowerCase()}</p>
              </div>
            </Link>
          </div>

          {showRightArrow && (
            <button onClick={() => scroll('right')} className="absolute -right-4 top-1/2 -translate-y-1/2 z-10 p-2 bg-white shadow-lg rounded-full hover:bg-gray-100 border border-gray-200">
              <ChevronRight className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
      <style jsx>{`.hide-scrollbar::-webkit-scrollbar { display: none; }`}</style>
    </section>
  );
}