'use client';

import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Package } from 'lucide-react';

export interface ProductImageGalleryProps {
  images: string[];
  thumbnail: string;
  title: string;
}

export function ProductImageGallery({ images, thumbnail, title }: ProductImageGalleryProps) {
  // Consolidate images list and deduplicate
  const allImages = Array.from(new Set([thumbnail, ...(images || [])])).filter(Boolean);
  const [selectedImage, setSelectedImage] = useState<string>(allImages[0] || thumbnail || '');

  return (
    <div className="flex flex-col gap-4">
      {/* Primary Image Display */}
      <div className="relative w-full aspect-square max-h-[480px] rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden flex items-center justify-center group shadow-xs">
        {selectedImage ? (
          <img
            src={selectedImage}
            alt={title}
            className="w-full h-full object-contain p-4 transition-transform duration-300 group-hover:scale-105"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://placehold.co/600x600/png?text=Product';
            }}
          />
        ) : (
          <div className="text-slate-400 flex flex-col items-center gap-2">
            <Package className="w-12 h-12" />
            <span className="text-xs">No image available</span>
          </div>
        )}
      </div>

      {/* Thumbnails Row */}
      {allImages.length > 1 && (
        <div className="grid grid-cols-4 sm:grid-cols-6 gap-2.5">
          {allImages.map((img, idx) => {
            const isSelected = img === selectedImage;
            return (
              <button
                key={idx}
                onClick={() => setSelectedImage(img)}
                className={cn(
                  'relative aspect-square rounded-xl overflow-hidden border-2 bg-white dark:bg-slate-900 transition-all p-1 cursor-pointer',
                  isSelected
                    ? 'border-indigo-600 ring-2 ring-indigo-500/20'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-400 opacity-70 hover:opacity-100'
                )}
                aria-label={`Select product image ${idx + 1}`}
              >
                <img
                  src={img}
                  alt={`${title} - Thumbnail ${idx + 1}`}
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://placehold.co/100x100/png?text=Thumb';
                  }}
                />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}