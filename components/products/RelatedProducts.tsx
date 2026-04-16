'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import { Product } from '@/lib/types/database';
import { ProductGrid } from './ProductGrid';
import Link from 'next/link';

interface RelatedProductsProps {
  currentProductId: string;
  category: string;
}

export function RelatedProducts({ currentProductId, category }: RelatedProductsProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRelatedProducts = async () => {
      // Extract keywords from category name
      const keywords = category.toLowerCase().split(' ');
      
      let query = supabase
        .from('products')
        .select('*')
        .eq('is_active', true)
        .neq('id', currentProductId)
        .limit(8);

      // Try to find related products by name similarity
      if (keywords.length > 0) {
        const orConditions = keywords.map(keyword => 
          `name.ilike.%${keyword}%`
        ).join(',');
        query = query.or(orConditions);
      }

      const { data, error } = await query;
      
      if (!error && data) {
        setProducts(data);
      }
      setLoading(false);
    };

    fetchRelatedProducts();
  }, [currentProductId, category]);

  if (loading) {
    return (
      <div>
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-2xl font-black text-slate-900">You might also like</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-80 bg-slate-200 animate-pulse rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  if (products.length === 0) return null;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-2xl font-black text-slate-900">You might also like</h3>
        <Link href="/products" className="text-sm font-bold text-brand-accent hover:underline">
          View all products
        </Link>
      </div>
      <ProductGrid products={products} />
    </div>
  );
}