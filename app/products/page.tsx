// app/products/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { Search, SlidersHorizontal, X, LayoutGrid, List, Sparkles, Filter, ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ProductGrid } from '@/components/products/ProductGrid'
import { Badge } from '@/components/ui/badge'
import { supabase } from '@/lib/supabase/client'
import { Product } from '@/lib/types/database'

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState('name')
  const [priceRange, setPriceRange] = useState('all')
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(20)
  const [totalProducts, setTotalProducts] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  
  // Filter states
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const [selectedReward, setSelectedReward] = useState<string>('')
  const [inStockOnly, setInStockOnly] = useState(false)
  const [onSaleOnly, setOnSaleOnly] = useState(false)
  const [minPrice, setMinPrice] = useState<number | string>('')
  const [maxPrice, setMaxPrice] = useState<number | string>('')
  const [showMobileFilters, setShowMobileFilters] = useState(false)

  // Categories based on product names
  const categories = ['Dog', 'Cat', 'Bird', 'Fish', 'Small Pet', 'Reptile']
  
  // Exclusive reward options
  const rewardOptions = [
    'Gaming bundle',
    'Free shipping', 
    '5% rewards',
    'Tech essentials',
    '15% off next order'
  ]

  // Fetch total count for pagination
  const fetchTotalCount = async () => {
    let query = supabase.from('products').select('*', { count: 'exact', head: true }).eq('is_active', true)

    if (searchTerm) query = query.ilike('name', `%${searchTerm}%`)
    if (selectedCategory) query = query.ilike('name', `%${selectedCategory}%`)
    if (selectedReward) query = query.eq('exclusive_reward', selectedReward)
    if (inStockOnly) query = query.gt('stock_quantity', 0)
    if (onSaleOnly) query = query.gt('discount', 0)
    
    if (priceRange !== 'all') {
      const [min, max] = priceRange.split('-').map(Number)
      if (min) query = query.gte('final_mrp', min)
      if (max) query = query.lte('final_mrp', max)
    }
    
    if (minPrice !== '' && minPrice !== undefined) query = query.gte('final_mrp', Number(minPrice))
    if (maxPrice !== '' && maxPrice !== undefined) query = query.lte('final_mrp', Number(maxPrice))

    const { count, error } = await query
    if (!error && count !== null) {
      setTotalProducts(count)
      setTotalPages(Math.ceil(count / itemsPerPage))
    }
  }

  const fetchProducts = async () => {
    setLoading(true)
    
    const start = (currentPage - 1) * itemsPerPage
    const end = start + itemsPerPage - 1
    
    let query = supabase
      .from('products')
      .select('*')
      .eq('is_active', true)
      .range(start, end)

    if (searchTerm) query = query.ilike('name', `%${searchTerm}%`)
    if (selectedCategory) query = query.ilike('name', `%${selectedCategory}%`)
    if (selectedReward) query = query.eq('exclusive_reward', selectedReward)
    if (inStockOnly) query = query.gt('stock_quantity', 0)
    if (onSaleOnly) query = query.gt('discount', 0)

    if (priceRange !== 'all') {
      const [min, max] = priceRange.split('-').map(Number)
      if (min) query = query.gte('final_mrp', min)
      if (max) query = query.lte('final_mrp', max)
    }
    
    if (minPrice !== '' && minPrice !== undefined) query = query.gte('final_mrp', Number(minPrice))
    if (maxPrice !== '' && maxPrice !== undefined) query = query.lte('final_mrp', Number(maxPrice))

    if (sortBy === 'price-low') query = query.order('final_mrp', { ascending: true })
    else if (sortBy === 'price-high') query = query.order('final_mrp', { ascending: false })
    else if (sortBy === 'discount') query = query.order('discount', { ascending: false })
    else if (sortBy === 'name') query = query.order('name', { ascending: true })
    else if (sortBy === 'stock') query = query.order('stock_quantity', { ascending: false })
    else query = query.order('created_at', { ascending: false })

    const { data, error } = await query
    if (!error && data) {
      setProducts(data || [])
    }
    
    await fetchTotalCount()
    setLoading(false)
  }

  // Debounce search
  useEffect(() => {
    const handler = setTimeout(() => {
      setCurrentPage(1)
      fetchProducts()
    }, 300)
    return () => clearTimeout(handler)
  }, [searchTerm, sortBy, priceRange, selectedCategory, selectedReward, inStockOnly, onSaleOnly, minPrice, maxPrice, itemsPerPage])

  // Refetch when page changes
  useEffect(() => {
    fetchProducts()
  }, [currentPage])

  const clearFilters = () => {
    setSearchTerm('')
    setPriceRange('all')
    setSortBy('name')
    setSelectedCategory('')
    setSelectedReward('')
    setInStockOnly(false)
    setOnSaleOnly(false)
    setMinPrice('')
    setMaxPrice('')
    setCurrentPage(1)
  }

  const handleItemsPerPageChange = (value: string) => {
    setItemsPerPage(parseInt(value))
    setCurrentPage(1)
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const hasActiveFilters = searchTerm || priceRange !== 'all' || selectedCategory || selectedReward || inStockOnly || onSaleOnly || minPrice !== '' || maxPrice !== ''

  // Generate page numbers
  const getPageNumbers = () => {
    const pages = []
    const maxVisible = 5
    let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2))
    let endPage = Math.min(totalPages, startPage + maxVisible - 1)
    
    if (endPage - startPage + 1 < maxVisible) {
      startPage = Math.max(1, endPage - maxVisible + 1)
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i)
    }
    return pages
  }

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20">
      {/* Hero Header Area */}
      <div className="bg-[#020617] border-b border-slate-100 pt-16 pb-12 mb-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-brand-accent font-bold uppercase tracking-widest text-xs">
                <Sparkles className="h-4 w-4" /> Discover
              </div>
              <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">
                All <span className="text-brand-accent">Products</span>
              </h1>
              <p className="text-slate-400 max-w-md font-medium">
                Browse our premium collection of pet products and accessories.
              </p>
            </div>
            
            {/* Search Bar */}
            <div className="relative w-full md:w-96 group">
              <div className="absolute -inset-1 bg-gradient-to-r from-brand-accent/20 to-blue-500/20 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 h-5 w-5" />
                <Input
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-12 h-14 bg-white border-none shadow-xl rounded-2xl text-slate-900 placeholder:text-slate-400 focus-visible:ring-brand-accent"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Sidebar Filters - Desktop */}
          <aside className="hidden lg:block w-80 space-y-6 shrink-0">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900 flex items-center gap-2">
                <SlidersHorizontal className="h-4 w-4" /> Filters
              </h3>
              {hasActiveFilters && (
                <button onClick={clearFilters} className="text-xs text-rose-500 hover:text-rose-600 font-medium">
                  Clear All
                </button>
              )}
            </div>

            <div className="space-y-6">
              
              {/* Category Filter */}
              <div className="space-y-3">
                <label className="text-xs font-black uppercase tracking-widest text-slate-400">Pet Type</label>
                <div className="flex flex-wrap gap-2">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(selectedCategory === category ? '' : category)}
                      className={`px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                        selectedCategory === category 
                          ? 'bg-brand-accent text-white shadow-lg shadow-brand-accent/20' 
                          : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>

              {/* Exclusive Rewards Filter */}
              <div className="space-y-3">
                <label className="text-xs font-black uppercase tracking-widest text-slate-400">Exclusive Rewards</label>
                <div className="space-y-2">
                  {rewardOptions.map((reward) => (
                    <button
                      key={reward}
                      onClick={() => setSelectedReward(selectedReward === reward ? '' : reward)}
                      className={`w-full px-3 py-2 rounded-xl text-sm font-medium transition-all text-left ${
                        selectedReward === reward 
                          ? 'bg-brand-accent text-white shadow-lg shadow-brand-accent/20' 
                          : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                      }`}
                    >
                      {reward}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range Filter */}
              <div className="space-y-3">
                <label className="text-xs font-black uppercase tracking-widest text-slate-400">Price Range</label>
                <div className="flex flex-col gap-2">
                  {['all', '0-50', '50-100', '100-200', '200-'].map((range) => (
                    <button
                      key={range}
                      onClick={() => {
                        setPriceRange(range)
                        setMinPrice('')
                        setMaxPrice('')
                      }}
                      className={`text-left px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                        priceRange === range 
                          ? 'bg-brand-accent text-white shadow-lg shadow-brand-accent/20' 
                          : 'bg-white text-slate-500 hover:bg-slate-100 border border-slate-200'
                      }`}
                    >
                      {range === 'all' ? 'All Prices' : range.endsWith('-') ? `Over $${range.slice(0,-1)}` : `$${range.replace('-', ' - $')}`}
                    </button>
                  ))}
                </div>
                
                {/* Custom Price Range */}
                <div className="flex gap-2 mt-2">
                  <input
                    type="number"
                    placeholder="Min $"
                    value={minPrice}
                    onChange={(e) => {
                      const value = e.target.value
                      setMinPrice(value === '' ? '' : parseFloat(value))
                      setPriceRange('all')
                    }}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-accent"
                  />
                  <input
                    type="number"
                    placeholder="Max $"
                    value={maxPrice}
                    onChange={(e) => {
                      const value = e.target.value
                      setMaxPrice(value === '' ? '' : parseFloat(value))
                      setPriceRange('all')
                    }}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-accent"
                  />
                </div>
              </div>

              {/* Stock Status Filter */}
              <div className="space-y-3">
                <label className="text-xs font-black uppercase tracking-widest text-slate-400">Availability</label>
                <div className="space-y-2">
                  <button
                    onClick={() => setInStockOnly(!inStockOnly)}
                    className={`w-full px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center justify-between ${
                      inStockOnly 
                        ? 'bg-brand-accent text-white shadow-lg shadow-brand-accent/20' 
                        : 'bg-white text-slate-500 hover:bg-slate-100 border border-slate-200'
                    }`}
                  >
                    <span>In Stock Only</span>
                    {inStockOnly && <span>✓</span>}
                  </button>
                  
                  <button
                    onClick={() => setOnSaleOnly(!onSaleOnly)}
                    className={`w-full px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center justify-between ${
                      onSaleOnly 
                        ? 'bg-brand-accent text-white shadow-lg shadow-brand-accent/20' 
                        : 'bg-white text-slate-500 hover:bg-slate-100 border border-slate-200'
                    }`}
                  >
                    <span>On Sale Only</span>
                    {onSaleOnly && <span>✓</span>}
                  </button>
                </div>
              </div>

              {/* Active Filters Display */}
              {hasActiveFilters && (
                <div className="pt-4 border-t border-slate-200">
                  <p className="text-xs text-slate-500 mb-2">Active Filters:</p>
                  <div className="flex flex-wrap gap-2">
                    {searchTerm && (
                      <Badge className="bg-brand-accent/10 text-brand-accent border-none">
                        Search: {searchTerm}
                        <X className="ml-1 h-3 w-3 cursor-pointer" onClick={() => setSearchTerm('')} />
                      </Badge>
                    )}
                    {selectedCategory && (
                      <Badge className="bg-brand-accent/10 text-brand-accent border-none">
                        {selectedCategory}
                        <X className="ml-1 h-3 w-3 cursor-pointer" onClick={() => setSelectedCategory('')} />
                      </Badge>
                    )}
                    {selectedReward && (
                      <Badge className="bg-brand-accent/10 text-brand-accent border-none">
                        {selectedReward}
                        <X className="ml-1 h-3 w-3 cursor-pointer" onClick={() => setSelectedReward('')} />
                      </Badge>
                    )}
                    {priceRange !== 'all' && (
                      <Badge className="bg-brand-accent/10 text-brand-accent border-none">
                        {priceRange === '200-' ? 'Over $200' : `$${priceRange.replace('-', ' - $')}`}
                        <X className="ml-1 h-3 w-3 cursor-pointer" onClick={() => setPriceRange('all')} />
                      </Badge>
                    )}
                    {(minPrice !== '' || maxPrice !== '') && (
                      <Badge className="bg-brand-accent/10 text-brand-accent border-none">
                        ${minPrice || '0'} - ${maxPrice || '∞'}
                        <X className="ml-1 h-3 w-3 cursor-pointer" onClick={() => { setMinPrice(''); setMaxPrice(''); }} />
                      </Badge>
                    )}
                    {inStockOnly && (
                      <Badge className="bg-brand-accent/10 text-brand-accent border-none">
                        In Stock
                        <X className="ml-1 h-3 w-3 cursor-pointer" onClick={() => setInStockOnly(false)} />
                      </Badge>
                    )}
                    {onSaleOnly && (
                      <Badge className="bg-brand-accent/10 text-brand-accent border-none">
                        On Sale
                        <X className="ml-1 h-3 w-3 cursor-pointer" onClick={() => setOnSaleOnly(false)} />
                      </Badge>
                    )}
                  </div>
                </div>
              )}
            </div>
          </aside>

          {/* Mobile Filter Button */}
          <div className="lg:hidden mb-4">
            <Button 
              onClick={() => setShowMobileFilters(!showMobileFilters)}
              className="w-full bg-white text-slate-700 border border-slate-200 hover:bg-slate-50"
            >
              <Filter className="h-4 w-4 mr-2" />
              {showMobileFilters ? 'Hide Filters' : 'Show Filters'}
            </Button>
          </div>

          {/* Mobile Filters */}
          {showMobileFilters && (
            <div className="lg:hidden bg-white rounded-2xl p-4 mb-4 border border-slate-200">
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2 block">Pet Type</label>
                  <div className="flex flex-wrap gap-2">
                    {categories.map((category) => (
                      <button
                        key={category}
                        onClick={() => setSelectedCategory(selectedCategory === category ? '' : category)}
                        className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                          selectedCategory === category 
                            ? 'bg-brand-accent text-white' 
                            : 'bg-slate-50 text-slate-600'
                        }`}
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2 block">Rewards</label>
                  <div className="flex flex-wrap gap-2">
                    {rewardOptions.map((reward) => (
                      <button
                        key={reward}
                        onClick={() => setSelectedReward(selectedReward === reward ? '' : reward)}
                        className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                          selectedReward === reward 
                            ? 'bg-brand-accent text-white' 
                            : 'bg-slate-50 text-slate-600'
                        }`}
                      >
                        {reward}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2 block">Price</label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      placeholder="Min $"
                      value={minPrice}
                      onChange={(e) => {
                        const value = e.target.value
                        setMinPrice(value === '' ? '' : parseFloat(value))
                      }}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm"
                    />
                    <input
                      type="number"
                      placeholder="Max $"
                      value={maxPrice}
                      onChange={(e) => {
                        const value = e.target.value
                        setMaxPrice(value === '' ? '' : parseFloat(value))
                      }}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm"
                    />
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => setInStockOnly(!inStockOnly)}
                    className={`flex-1 px-3 py-2 rounded-xl text-sm font-medium ${
                      inStockOnly ? 'bg-brand-accent text-white' : 'bg-slate-50 text-slate-600'
                    }`}
                  >
                    In Stock
                  </button>
                  <button
                    onClick={() => setOnSaleOnly(!onSaleOnly)}
                    className={`flex-1 px-3 py-2 rounded-xl text-sm font-medium ${
                      onSaleOnly ? 'bg-brand-accent text-white' : 'bg-slate-50 text-slate-600'
                    }`}
                  >
                    On Sale
                  </button>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button onClick={fetchProducts} className="flex-1 bg-brand-accent text-white">
                    Apply Filters
                  </Button>
                  {hasActiveFilters && (
                    <Button onClick={clearFilters} variant="outline" className="flex-1">
                      Clear All
                    </Button>
                  )}
                </div>
              </div>
            </div>
          )}
          
          {/* Main Product Area */}
          <div className="flex-1 space-y-6">
            
            {/* Top Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-[1.5rem] shadow-sm border border-slate-100">
              <div className="flex items-center gap-2 flex-wrap">
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-[180px] border-none bg-slate-50 font-bold rounded-xl h-10">
                    <SelectValue placeholder="Sort By" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-slate-100 bg-white shadow-lg">
                    <SelectItem value="name">Alphabetical</SelectItem>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                    <SelectItem value="discount">Biggest Discount</SelectItem>
                    <SelectItem value="stock">Stock: High to Low</SelectItem>
                    <SelectItem value="created_at">Newest Arrivals</SelectItem>
                  </SelectContent>
                </Select>
                
                {/* Items Per Page Selector */}
                <Select value={itemsPerPage.toString()} onValueChange={handleItemsPerPageChange}>
                  <SelectTrigger className="w-[120px] border-none bg-slate-50 font-bold rounded-xl h-10">
                    <SelectValue placeholder="Show" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-slate-100 bg-white shadow-lg">
                    <SelectItem value="20">Show 20</SelectItem>
                    <SelectItem value="40">Show 40</SelectItem>
                    <SelectItem value="60">Show 60</SelectItem>
                    <SelectItem value="80">Show 80</SelectItem>
                    <SelectItem value="100">Show 100</SelectItem>
                  </SelectContent>
                </Select>
                
                {hasActiveFilters && (
                  <Badge className="bg-brand-accent/10 text-brand-accent border-none">
                    {totalProducts} products found
                  </Badge>
                )}
              </div>

              <div className="flex items-center gap-2 text-slate-400">
                <button className="p-2 hover:bg-slate-100 rounded-lg text-brand-accent bg-slate-50">
                  <LayoutGrid className="h-4 w-4" />
                </button>
                <button className="p-2 hover:bg-slate-100 rounded-lg">
                  <List className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Results Info */}
            <div className="flex items-center justify-between px-2 flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-slate-900">{products.length}</span>
                <span className="text-sm text-slate-500 font-medium">
                  of {totalProducts} Products
                </span>
              </div>
              <div className="text-sm text-slate-500">
                Page {currentPage} of {totalPages}
              </div>
            </div>

            {/* Products Grid */}
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 py-12">
                {[...Array(itemsPerPage > 12 ? 12 : itemsPerPage)].map((_, i) => (
                  <div key={i} className="h-80 bg-slate-200 animate-pulse rounded-[2.5rem]" />
                ))}
              </div>
            ) : products.length > 0 ? (
              <ProductGrid products={products} />
            ) : (
              <div className="text-center py-32 bg-white rounded-[3rem] border border-dashed border-slate-200">
                <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Search className="h-10 w-10 text-slate-300" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">No products found</h3>
                <p className="text-slate-500">Try adjusting your filters or search keywords.</p>
                <Button onClick={clearFilters} className="mt-6 bg-brand-accent text-white">
                  Clear All Filters
                </Button>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && !loading && products.length > 0 && (
              <div className="flex justify-center items-center gap-2 pt-8">
                <Button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  variant="outline"
                  className="rounded-xl"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>
                
                <div className="flex gap-2">
                  {getPageNumbers().map((page) => (
                    <Button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      variant={currentPage === page ? 'default' : 'outline'}
                      className={`rounded-xl w-10 h-10 ${
                        currentPage === page ? 'bg-brand-accent hover:bg-brand-accent/90' : ''
                      }`}
                    >
                      {page}
                    </Button>
                  ))}
                </div>
                
                <Button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  variant="outline"
                  className="rounded-xl"
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}