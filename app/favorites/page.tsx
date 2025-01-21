'use client';

import { useFavorites } from '../context/FavoriteContext';
import { ProductCard } from '../components/ProductCard';
import { ProductModal } from '../components/ProductModal';
import { useState } from 'react';
import { Product } from '../types';
import { Navbar } from '../components/Navbar';

export default function FavoritesPage() {
  const { favorites } = useFavorites();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  return (
    <div className="min-h-screen">
      <Navbar onSearch={() => {}} />
      
      <main className="container mx-auto p-4">
        <h1 className="text-4xl font-bold mb-8">Favorites</h1>
        
        {favorites.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">No favorite products yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {favorites.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onClick={setSelectedProduct}
              />
            ))}
          </div>
        )}

        <ProductModal
          product={selectedProduct}
          isOpen={!!selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      </main>
    </div>
  );
}