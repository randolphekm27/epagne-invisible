import React from 'react';
import { Star } from 'lucide-react';
import { cn } from '../../utils/cn';

export const PremiumBadge = ({ className }: { className?: string }) => {
  return (
    <div className={cn("absolute -top-2 -right-2 bg-[#0047AB] text-white p-1 rounded-full animate-pulse", className)}>
      <Star size={12} fill="currentColor" />
    </div>
  );
};
