'use client';

import { useEffect, useState } from 'react';
import { FilterState } from '../types';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { RotateCcw } from 'lucide-react';

interface FilterBarProps {
  categories: string[];
  onFilterChange: (filters: FilterState) => void;
  maxPrice: number;
}

export function FilterBar({ categories, onFilterChange, maxPrice }: FilterBarProps) {
  const defaultFilters: FilterState = {
    category: 'all',
    minPrice: 0,
    maxPrice: maxPrice,
    minRating: 0,
    sortBy: 'price-asc',
  };

  const [filters, setFilters] = useState<FilterState>(defaultFilters);

  useEffect(() => {
    onFilterChange(filters);
  }, [filters, onFilterChange]);

  const handleReset = () => {
    setFilters(defaultFilters);
  };

  return (
    <div className="space-y-6 p-4 bg-card rounded-lg">
      <div className="flex justify-between items-center">
        <h2 className="font-semibold text-lg">Filters</h2>
        <Button
          variant="outline"
          size="sm"
          onClick={handleReset}
          className="text-muted-foreground hover:text-foreground"
        >
          <RotateCcw className="h-4 w-4 mr-2" />
          Reset
        </Button>
      </div>

      <div className="space-y-2">
        <Label>Category</Label>
        <Select
          value={filters.category}
          onValueChange={(value) => setFilters({ ...filters, category: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category} value={category}>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Price Range (${filters.minPrice.toFixed(0)} - ${filters.maxPrice.toFixed(0)})</Label>
        <Slider
          min={0}
          max={maxPrice}
          step={1}
          value={[filters.minPrice, filters.maxPrice]}
          onValueChange={([min, max]) =>
            setFilters({ ...filters, minPrice: min, maxPrice: max })
          }
        />
      </div>

      <div className="space-y-2">
        <Label>Minimum Rating</Label>
        <Slider
          min={0}
          max={5}
          step={0.5}
          value={[filters.minRating]}
          onValueChange={([value]) =>
            setFilters({ ...filters, minRating: value })
          }
        />
      </div>

      <div className="space-y-2">
        <Label>Sort By</Label>
        <Select
          value={filters.sortBy}
          onValueChange={(value: FilterState['sortBy']) =>
            setFilters({ ...filters, sortBy: value })
          }
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="price-asc">Price: Low to High</SelectItem>
            <SelectItem value="price-desc">Price: High to Low</SelectItem>
            <SelectItem value="rating-desc">Highest Rated</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}