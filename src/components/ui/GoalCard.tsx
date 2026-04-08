import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, Target } from 'lucide-react';
import { Card } from './Card';
import { ProgressBar } from './ProgressBar';
import { cn } from '../../utils/cn';
import { useResponsive } from '../../hooks/useResponsive';

export interface GoalCardProps {
  title: string;
  targetAmount: number;
  currentAmount: number;
  deadline: Date;
  icon?: React.ReactNode;
  isAmountHidden?: boolean;
  onPress?: () => void;
  onReveal?: () => void;
  className?: string;
}

export function GoalCard({
  title,
  targetAmount,
  currentAmount,
  deadline,
  icon,
  isAmountHidden = true,
  onPress,
  onReveal,
  className,
}: GoalCardProps) {
  const { isTablet, isDesktop } = useResponsive();
  const progress = Math.min(100, Math.round((currentAmount / targetAmount) * 100));
  const isCompleted = progress >= 100;

  return (
    <Card
      variant="default"
      padding="md"
      onPress={onPress}
      className={cn(
        'relative overflow-hidden group h-full',
        isCompleted ? 'border-accent/30 bg-accent/5' : '',
        className
      )}
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <div className={cn(
            'rounded-xl flex items-center justify-center border transition-all duration-300',
            isTablet || isDesktop ? 'w-14 h-14' : 'w-12 h-12',
            isCompleted ? 'bg-accent/20 text-accent border-accent/30' : 'bg-black/5 dark:bg-white/5 text-black dark:text-white border-black/10 dark:border-white/10'
          )}>
            <Target size={isTablet || isDesktop ? 28 : 24} />
          </div>
          <div>
            <h3 className={cn(
              "font-medium transition-all duration-300",
              isTablet || isDesktop ? "text-base" : "text-sm",
              isCompleted ? "text-accent" : "text-black dark:text-white"
            )}>
              {title}
            </h3>
            <p className="text-black/40 dark:text-white/40 text-xs mt-0.5">
              Échéance: {new Date(deadline).toLocaleDateString('fr-FR')}
            </p>
          </div>
        </div>
        <div className="text-right flex items-center gap-2">
          <span className={cn(
            'font-medium transition-all duration-300',
            isTablet || isDesktop ? 'text-xl' : 'text-lg',
            isCompleted ? 'text-accent' : 'text-black dark:text-white'
          )}>
            {progress}%
          </span>
          <ChevronRight size={16} className="text-black/30 dark:text-white/30" />
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-xs font-medium">
          <span className="text-black/70 dark:text-white/70">
            {isAmountHidden ? '***' : new Intl.NumberFormat('fr-BJ', { style: 'currency', currency: 'XOF', maximumFractionDigits: 0 }).format(currentAmount)}
          </span>
          <span className="text-black/40 dark:text-white/40">
            {new Intl.NumberFormat('fr-BJ', { style: 'currency', currency: 'XOF', maximumFractionDigits: 0 }).format(targetAmount)}
          </span>
        </div>
        <ProgressBar 
          progress={progress} 
          height="md" 
          color={isCompleted ? 'blue' : 'black'} 
        />
      </div>
    </Card>
  );
}
