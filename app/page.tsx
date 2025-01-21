'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { Product, FilterState } from './types';
import { ProductCard } from './components/ProductCard';
import { ProductModal } from './components/ProductModal';
import { FilterBar } from './components/FilterBar';
import { Navbar } from './components/Navbar';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Loader2 } from 'lucide-react';

const ITEMS_PER_PAGE = 8;

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [visibleProducts, setVisibleProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [page, setPage] = useState(1);
  const [maxPrice, setMaxPrice] = useState(1000);
  const [searchQuery, setSearchQuery] = useState('');
  const [loadingMore, setLoadingMore] = useState(false);
  const observer = useRef<IntersectionObserver | null>(null);
  const currentFilters = useRef<FilterState>({
    category: 'all',
    minPrice: 0,
    maxPrice: 1000,
    minRating: 0,
    sortBy: 'price-asc',
  });

  // Fetch products only once when component mounts
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('https://fakestoreapi.com/products');
        if (!response.ok) throw new Error('Failed to fetch products');
        const data = await response.json();
        setProducts(data);
        
        const uniqueCategories = [...new Set(data.map((p: Product) => p.category))];
        setCategories(uniqueCategories);
        
        const highestPrice = Math.max(...data.map((p: Product) => p.price));
        setMaxPrice(Math.ceil(highestPrice));
        
        setFilteredProducts(data);
        setVisibleProducts(data.slice(0, ITEMS_PER_PAGE));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const loadMore = useCallback(() => {
    if (loadingMore || visibleProducts.length >= filteredProducts.length) return;
    
    setLoadingMore(true);
    const nextPage = page + 1;
    const start = 0;
    const end = nextPage * ITEMS_PER_PAGE;
    
    setTimeout(() => {
      setVisibleProducts(filteredProducts.slice(start, end));
      setPage(nextPage);
      setLoadingMore(false);
    }, 0);
  }, [loadingMore, page, visibleProducts.length, filteredProducts]);

  const lastProductRef = useCallback(
    (node: HTMLDivElement) => {
      if (loading || loadingMore) return;
      
      if (observer.current) observer.current.disconnect();
      
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && visibleProducts.length < filteredProducts.length) {
          loadMore();
        }
      }, {
        rootMargin: '100px',
      });
      
      if (node) observer.current.observe(node);
    },
    [loading, loadingMore, visibleProducts.length, filteredProducts.length, loadMore]
  );

  const applyFilters = useCallback((filters: FilterState, query: string) => {
    let filtered = [...products];

    // Apply search filter
    if (query) {
      const searchTerm = query.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.title.toLowerCase().includes(searchTerm) ||
          p.description.toLowerCase().includes(searchTerm) ||
          p.category.toLowerCase().includes(searchTerm)
      );
    }

    // Apply category filter
    if (filters.category !== 'all') {
      filtered = filtered.filter((p) => p.category === filters.category);
    }

    // Apply price filter
    filtered = filtered.filter(
      (p) => p.price >= filters.minPrice && p.price <= filters.maxPrice
    );

    // Apply rating filter
    filtered = filtered.filter((p) => p.rating.rate >= filters.minRating);

    // Apply sorting
    filtered.sort((a, b) => {
      switch (filters.sortBy) {
        case 'price-asc':
          return a.price - b.price;
        case 'price-desc':
          return b.price - a.price;
        case 'rating-desc':
          return b.rating.rate - a.rating.rate;
        default:
          return 0;
      }
    });

    setFilteredProducts(filtered);
    setPage(1);
    setVisibleProducts(filtered.slice(0, ITEMS_PER_PAGE));
  }, [products]);

  const handleFilterChange = useCallback((filters: FilterState) => {
    currentFilters.current = filters;
    applyFilters(filters, searchQuery);
  }, [searchQuery, applyFilters]);

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
    applyFilters(currentFilters.current, query);
  }, [applyFilters]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar onSearch={handleSearch} />
      
      <main className="container mx-auto p-4">
        <h1 className="text-4xl font-bold mb-8">Product Catalog</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            <FilterBar
              categories={categories}
              onFilterChange={handleFilterChange}
              maxPrice={maxPrice}
            />
          </div>
          
          <div className="lg:col-span-3">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {visibleProducts.map((product, index) => (
                <div
                  key={product.id}
                  ref={
                    index === visibleProducts.length - 1 ? lastProductRef : undefined
                  }
                >
                  <ProductCard
                    product={product}
                    onClick={setSelectedProduct}
                  />
                </div>
              ))}
            </div>
            
            {loadingMore && (
              <div className="flex justify-center mt-8">
                <Loader2 className="w-6 h-6 animate-spin" />
              </div>
            )}

            {visibleProducts.length === 0 && (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No products match your filters.</p>
              </div>
            )}
          </div>
        </div>

        <ProductModal
          product={selectedProduct}
          isOpen={!!selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      </main>
    </div>
  );
}