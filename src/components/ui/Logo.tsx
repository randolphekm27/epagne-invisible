import React from 'react';
import { cn } from '../../utils/cn';

interface LogoProps {
  className?: string;
  size?: number;
}

export const Logo = ({ className, size = 40 }: LogoProps) => {
  return (
    <div 
      className={cn("flex items-center justify-center rounded-full bg-black border border-white/10", className)}
      style={{ width: size, height: size }}
    >
      <svg 
        width={size * 0.6} 
        height={size * 0.6} 
        viewBox="0 0 100 100" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle 
          cx="50" 
          cy="50" 
          r="45" 
          stroke="white" 
          strokeWidth="6" 
          strokeDasharray="12 12" 
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
};
