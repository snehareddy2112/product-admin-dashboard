'use client';

import React from 'react';
import { ProductReview } from '@/types/product';
import { StarRating } from '@/components/ui/StarRating';
import { formatDate } from '@/lib/utils';
import { MessageSquare, ShieldCheck } from 'lucide-react';

export interface ProductReviewListProps {
  reviews?: ProductReview[];
  averageRating?: number;
}

export function ProductReviewList({ reviews = [], averageRating = 4.5 }: ProductReviewListProps) {
  if (reviews.length === 0) {
    return (
      <div className="p-8 text-center rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/30">
        <MessageSquare className="w-8 h-8 mx-auto text-slate-400 mb-2" />
        <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">No customer reviews yet</p>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Be the first to leave a feedback on this product.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Overall score summary */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between p-5 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/50 gap-4">
        <div className="flex items-center gap-4">
          <div className="text-4xl font-extrabold text-indigo-600 dark:text-indigo-400">
            {averageRating.toFixed(1)}
          </div>
          <div>
            <StarRating rating={averageRating} size="md" />
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
              Based on {reviews.length} verified customer reviews
            </p>
          </div>
        </div>
      </div>

      {/* Reviews list */}
      <div className="divide-y divide-slate-100 dark:divide-slate-800/80">
        {reviews.map((rev, idx) => (
          <div key={idx} className="py-4 first:pt-0 last:pb-0 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 flex items-center justify-center font-bold text-xs">
                  {rev.reviewerName?.[0] || 'U'}
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                      {rev.reviewerName || 'Anonymous Buyer'}
                    </span>
                    <span className="flex items-center gap-0.5 text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
                      <ShieldCheck className="w-3 h-3" /> Verified
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400">
                    {formatDate(rev.date)}
                  </div>
                </div>
              </div>
              <StarRating rating={rev.rating} size="sm" showScore={false} />
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed italic">
              &ldquo;{rev.comment}&rdquo;
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}