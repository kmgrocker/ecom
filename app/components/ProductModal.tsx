'use client';

import Image from 'next/image';
import { Star, ShoppingCart } from 'lucide-react';
import { Product } from '../types';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface ProductModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ProductModal({ product, isOpen, onClose }: ProductModalProps) {
  if (!product) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md sm:max-w-2xl h-[90vh] sm:h-auto overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl sm:text-2xl font-bold">{product.title}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="relative w-full aspect-square">
            <Image
              src={product.image}
              alt={product.title}
              fill
              className="object-contain"
              priority
            />
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold">${product.price.toFixed(2)}</span>
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                <span className="text-lg">
                  {product.rating.rate} ({product.rating.count} reviews)
                </span>
              </div>
            </div>
            <div>
              <span className="inline-block bg-secondary px-3 py-1 rounded-full text-sm">
                {product.category}
              </span>
            </div>
            <p className="text-gray-700 dark:text-gray-300">{product.description}</p>
            <div className="flex justify-between items-center pt-4">
              <span className="text-sm text-muted-foreground">
                {product.rating.count > 50 ? 'In Stock' : 'Low Stock'}
              </span>
              <Button className="w-full sm:w-auto">
                <ShoppingCart className="mr-2 h-4 w-4" />
                Add to Cart
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}