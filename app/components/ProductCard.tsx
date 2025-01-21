'use client';

import Image from 'next/image';
import { Star, Heart } from 'lucide-react';
import { Product } from '../types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useFavorites } from '../context/FavoriteContext';
import { cn } from '@/lib/utils';

interface ProductCardProps {
  product: Product;
  onClick: (product: Product) => void;
}

export function ProductCard({ product, onClick }: ProductCardProps) {
  const { toggleFavorite, isFavorite } = useFavorites();
  const isProductFavorite = isFavorite(product.id);

  return (
    <Card className="h-full group hover:shadow-lg transition-all duration-300 relative">
      <CardContent className="p-4">
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "absolute top-2 right-2 z-10 transition-all duration-300",
            isProductFavorite ? "opacity-100" : "opacity-0 group-hover:opacity-100"
          )}
          onClick={(e) => {
            e.stopPropagation();
            toggleFavorite(product);
          }}
        >
          <Heart
            className={cn(
              "h-5 w-5 transition-colors",
              isProductFavorite && "fill-red-500 text-red-500"
            )}
          />
        </Button>
        <div
          className="relative w-full aspect-square mb-4 cursor-pointer"
          onClick={() => onClick(product)}
        >
          <Image
            src={product.image}
            alt={product.title}
            fill
            className="object-contain hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        </div>
        <div onClick={() => onClick(product)} className="cursor-pointer">
          <h3 className="font-semibold text-lg line-clamp-2 mb-2 hover:text-primary transition-colors">
            {product.title}
          </h3>
          <div className="flex items-center justify-between">
            <span className="text-lg font-bold">${product.price.toFixed(2)}</span>
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span>{product.rating.rate}</span>
            </div>
          </div>
          <div className="mt-2">
            <span className="inline-block bg-secondary px-2 py-1 rounded-full text-sm">
              {product.category}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}