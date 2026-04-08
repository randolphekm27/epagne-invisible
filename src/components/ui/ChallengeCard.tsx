import React from 'react';
import { motion } from 'framer-motion';
import { Star, CheckCircle2 } from 'lucide-react';
import { Card } from './Card';
import { ProgressBar } from './ProgressBar';
import { Button } from './Button';
import { cn } from '../../utils/cn';
import { useResponsive } from '../../hooks/useResponsive';

export interface ChallengeCardProps {
  title: string;
  description: string;
  progress: number;
  total?: number;
  reward: string | number;
  status?: 'available' | 'active' | 'completed';
  isActive?: boolean;
  icon?: React.ReactNode;
  onPress?: () => void;
  onStart?: () => void;
  onAction?: () => void;
  className?: string;
}

export function ChallengeCard({
  title,
  description,
  progress,
  total,
  reward,
  status,
  isActive,
  icon,
  onPress,
  onStart,
  onAction,
  className,
}: ChallengeCardProps) {
  const { isTablet, isDesktop } = useResponsive();
  const isCompleted = status === 'completed' || progress >= 100;
  const isCurrentlyActive = status === 'active' || isActive;

  return (
    <Card
      variant={isCompleted ? 'glass' : 'default'}
      padding="md"
      onPress={onPress}
      className={cn(
        'relative overflow-hidden group h-full',
        isCompleted ? 'border-accent/30 bg-accent/5' : '',
        className
      )}
    >
      {isCompleted && (
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <CheckCircle2 size={isTablet || isDesktop ? 140 : 100} className="text-accent" />
        </div>
      )}
      
      <div className="flex gap-4 relative z-10 h-full">
        <div className={cn(
          'rounded-xl flex items-center justify-center shrink-0 transition-all duration-300',
          isTablet || isDesktop ? 'w-14 h-14' : 'w-12 h-12',
          isCompleted ? 'bg-accent/20 text-accent' : 'bg-black/5 dark:bg-white/10 text-black/50 dark:text-white/50'
        )}>
          {isCompleted ? <CheckCircle2 size={isTablet || isDesktop ? 28 : 24} /> : <Star size={isTablet || isDesktop ? 28 : 24} />}
        </div>
        
        <div className="flex-1 flex flex-col">
          <div className="flex justify-between items-start gap-2">
            <h4 className={cn(
              'font-medium transition-all duration-300',
              isTablet || isDesktop ? 'text-base' : 'text-sm',
              isCompleted ? 'text-accent' : 'text-black dark:text-white'
            )}>
              {title}
            </h4>
            <div className="flex items-center gap-1 bg-yellow-400/10 px-2 py-1 rounded-full border border-yellow-400/20 shrink-0">
              <Star size={12} className="text-yellow-500 fill-yellow-500" />
              <span className="text-xs font-bold text-yellow-600 dark:text-yellow-400">{reward}</span>
            </div>
          </div>
          
          <p className={cn(
            "text-black/50 dark:text-white/50 mt-1 leading-relaxed flex-1",
            isTablet || isDesktop ? "text-sm" : "text-xs"
          )}>
            {description}
          </p>
          
          {isCurrentlyActive ? (
            <div className="mt-4 flex items-center gap-3">
              <ProgressBar 
                progress={progress} 
                height="sm" 
                color={isCompleted ? 'blue' : 'black'} 
                className="flex-1"
              />
              <span className={cn(
                'text-xs font-medium',
                isCompleted ? 'text-accent' : 'text-black/50 dark:text-white/50'
              )}>
                {total ? `${Math.round((progress / 100) * total)}/${total}` : `${Math.round(progress)}%`}
              </span>
            </div>
          ) : (
            <Button
              variant="secondary"
              size="sm"
              fullWidth
              className="mt-4"
              onClick={(e: any) => {
                e.stopPropagation();
                if (onStart) onStart();
              }}
            >
              Démarrer le défi
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}
