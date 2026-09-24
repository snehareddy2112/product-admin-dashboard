import React from 'react';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface StarRatingProps {
  rating: number;
  max?: number;
  showScore?: boolean;
  reviewsCount?: number;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function StarRating({
  rating,
  max = 5,
  showScore = true,
  reviewsCount,
  size = 'md',
  className,
}: StarRatingProps) {
  const normalizedRating = Math.max(0, Math.min(max, rating || 0));

  const sizeClasses = {
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  const textSizes = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  };

  return (
    <div className={cn('inline-flex items-center gap-1.5', className)}>
      <div className="flex items-center">
        {Array.from({ length: max }).map((_, index) => {
          const fillPercentage = Math.max(0, Math.min(100, (normalizedRating - index) * 100));

          return (
            <div key={index} className="relative inline-block text-slate-300 dark:text-slate-700">
              <Star className={cn(sizeClasses[size], 'fill-current')} />
              {fillPercentage > 0 && (
                <div
                  className="absolute top-0 left-0 overflow-hidden text-amber-400 dark:text-amber-400"
                  style={{ width: fillPercentage + '%' }}
                >
                  <Star className={cn(sizeClasses[size], 'fill-current')} />
                </div>
              )}
            </div>
          );
        })}
      </div>
      {showScore && (
        <span className={cn('font-semibold text-slate-700 dark:text-slate-300', textSizes[size])}>
          {normalizedRating.toFixed(1)}
        </span>
      )}
      {reviewsCount !== undefined && (
        <span className={cn('text-slate-400 dark:text-slate-500', textSizes[size])}>
          ({reviewsCount})
        </span>
      )}
    </div>
  );
}
