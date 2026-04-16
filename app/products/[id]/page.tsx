import { createServerSupabaseClient } from '@/lib/supabase/server'
import { ProductDetails } from '@/components/products/ProductDetails'
import { ProductSpecifications } from '@/components/products/ProductSpecifications'
import { ProductBanners } from '@/components/products/ProductBanners'
import { RelatedProducts } from '@/components/products/RelatedProducts'
import { BestSellingProducts } from '@/components/products/BestSellingProducts'
import { Product, ProductSpecification, ProductBanner } from '@/lib/types/database'
import { notFound } from 'next/navigation'
import { ChevronRight, ShieldCheck, Truck, RotateCcw } from 'lucide-react'
import Link from 'next/link'

interface ProductPageProps {
  params: {
    id: string
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const supabase = createServerSupabaseClient()

  // Fetch product data
  const [productResponse, imagesResponse, specificationsResponse, bannersResponse] = await Promise.all([
    supabase
      .from('products')
      .select('*')
      .eq('id', params.id)
      .eq('is_active', true)
      .single(),
    supabase
      .from('product_images')
      .select('*')
      .eq('product_id', params.id)
      .order('position'),
    supabase
      .from('product_specifications')
      .select('*')
      .eq('product_id', params.id)
      .order('display_order', { ascending: true }),
    supabase
      .from('product_banners')
      .select('*')
      .eq('product_id', params.id)
      .eq('is_active', true)
      .order('display_order', { ascending: true })
  ])

  const product = productResponse.data
  const productImages = imagesResponse.data || []
  const specifications = specificationsResponse.data || []
  const banners = bannersResponse.data || []

  if (productResponse.error || !product) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-slate-50/50 pb-24">
      {/* Dynamic Background Glow */}
      <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-brand-accent/5 to-transparent pointer-events-none" />

      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        
        {/* Modern Breadcrumbs */}
        <nav className="flex items-center space-x-2 text-sm font-medium text-slate-400 mb-8 overflow-x-auto whitespace-nowrap pb-2">
          <Link href="/" className="hover:text-brand-accent transition-colors">Home</Link>
          <ChevronRight className="h-4 w-4 flex-shrink-0" />
          <Link href="/products" className="hover:text-brand-accent transition-colors">Shop</Link>
          <ChevronRight className="h-4 w-4 flex-shrink-0" />
          <span className="text-slate-900 truncate">{product.name}</span>
        </nav>

        {/* Main Product Section */}
        <div className="bg-white rounded-[3rem] shadow-xl shadow-slate-200/60 border border-slate-100 overflow-hidden">
          <ProductDetails 
            product={product as Product} 
            images={productImages || []} 
          />
        </div>

        {/* Product Banners Section */}
        {banners && banners.length > 0 && (
          <div className="mt-12">
            <ProductBanners banners={banners as ProductBanner[]} />
          </div>
        )}

        {/* Product Specifications Section */}
        {specifications && specifications.length > 0 && (
          <div className="mt-12 bg-white rounded-[3rem] shadow-xl shadow-slate-200/60 border border-slate-100 overflow-hidden p-8">
            <ProductSpecifications specifications={specifications as ProductSpecification[]} />
          </div>
        )}

        {/* Bottom Utility Bar (Trust Signals) */}
        <div className="mt-12 bg-white rounded-[3rem] shadow-xl shadow-slate-200/60 border border-slate-100 overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-3 border-t border-slate-100 bg-slate-50/50">
            <div className="flex items-center gap-4 p-8 border-r border-slate-100 group">
              <div className="p-3 bg-white rounded-2xl text-emerald-600 shadow-sm group-hover:scale-110 transition-transform">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm">2-Year Warranty</h4>
                <p className="text-xs text-slate-500">Full coverage for any defects</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4 p-8 border-r border-slate-100 group">
              <div className="p-3 bg-white rounded-2xl text-blue-600 shadow-sm group-hover:scale-110 transition-transform">
                <Truck className="h-6 w-6" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm">Express Shipping</h4>
                <p className="text-xs text-slate-500">Free delivery on orders over $150</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-8 group">
              <div className="p-3 bg-white rounded-2xl text-purple-600 shadow-sm group-hover:scale-110 transition-transform">
                <RotateCcw className="h-6 w-6" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm">30-Day Returns</h4>
                <p className="text-xs text-slate-500">Hassle-free money back guarantee</p>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products Section */}
        <div className="mt-20">
          <RelatedProducts currentProductId={params.id} category={product.name} />
        </div>

        {/* Best Selling Products Section */}
        <div className="mt-20">
          <BestSellingProducts currentProductId={params.id} />
        </div>
      </div>
    </div>
  )
}