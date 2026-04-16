'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import { Product } from '@/lib/types/database';
import { ProductGrid } from './ProductGrid';
import Link from 'next/link';

interface BestSellingProductsProps {
  currentProductId: string;
}

interface OrderItemWithProduct {
  product_id: string;
  quantity: number;
  product: Product;
}

export function BestSellingProducts({ currentProductId }: BestSellingProductsProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBestSellingProducts = async () => {
      // Calculate date 30 days ago
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      // Fetch order items from last 30 days with product details
      const { data: orderItems, error } = await supabase
        .from('order_items')
        .select(`
          product_id,
          quantity,
          product:products(*)
        `)
        .eq('products.is_active', true)
        .neq('product_id', currentProductId)
        .gte('created_at', thirtyDaysAgo.toISOString());

      if (!error && orderItems) {
        // Aggregate quantities per product
        const productSales = new Map<string, { product: Product; totalQuantity: number }>();
        
        (orderItems as any[]).forEach((item: any) => {
          if (item.product && item.product_id) {
            const existing = productSales.get(item.product_id);
            if (existing) {
              existing.totalQuantity += item.quantity;
            } else {
              productSales.set(item.product_id, {
                product: item.product,
                totalQuantity: item.quantity,
              });
            }
          }
        });

        // Convert to array and sort by total quantity (best selling first)
        const sortedProducts = Array.from(productSales.values())
          .sort((a, b) => b.totalQuantity - a.totalQuantity)
          .slice(0, 8)
          .map(item => item.product);

        setProducts(sortedProducts);
      }
      setLoading(false);
    };

    fetchBestSellingProducts();
  }, [currentProductId]);

  if (loading) {
    return (
      <div>
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-2xl font-black text-slate-900">Best Sellers</h3>
          <div className="h-4 w-24 bg-slate-200 animate-pulse rounded" />
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
        <div>
          <h3 className="text-2xl font-black text-slate-900">Best Sellers</h3>
          <p className="text-sm text-slate-500 mt-1">Most popular products in the last 30 days</p>
        </div>
        <Link href="/products?sort=best-selling" className="text-sm font-bold text-brand-accent hover:underline">
          View all
        </Link>
      </div>
      <ProductGrid products={products} />
    </div>
  );
}