import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Link } from 'lucide-react';
import { Card } from './Card';
import { Button } from './Button';
import { cn } from '../../utils/cn';
import { useResponsive } from '../../hooks/useResponsive';

export interface OperatorCardProps {
  operator: 'mtn' | 'wave' | 'moov';
  connected: boolean;
  onConnect?: () => void;
  onDisconnect?: () => void;
  className?: string;
}

export function OperatorCard({
  operator,
  connected,
  onConnect,
  onDisconnect,
  className,
}: OperatorCardProps) {
  const { isTablet, isDesktop } = useResponsive();
  const operators = {
    mtn: { name: 'MTN MoMo', color: 'bg-yellow-400', textColor: 'text-black' },
    wave: { name: 'Wave', color: 'bg-blue-400', textColor: 'text-white' },
    moov: { name: 'Moov Money', color: 'bg-blue-800', textColor: 'text-white' },
  };

  const op = operators[operator];

  return (
    <Card
      variant="glass"
      padding="md"
      className={cn(
        'flex items-center justify-between group hover:bg-white/10 transition-all duration-300',
        connected ? 'border-accent/50 bg-accent/5' : '',
        className
      )}
    >
      <div className="flex items-center gap-4">
        <div className={cn(
          "rounded-lg flex items-center justify-center font-bold transition-all duration-300",
          (isTablet || isDesktop) ? "w-14 h-14 text-sm" : "w-12 h-12 text-xs",
          op.color,
          op.textColor
        )}>
          {op.name.split(' ')[0]}
        </div>
        <span className={cn(
          "font-medium text-black dark:text-white transition-all duration-300",
          (isTablet || isDesktop) ? "text-lg" : "text-base"
        )}>
          {op.name}
        </span>
      </div>
      
      {connected ? (
        <div className="flex items-center gap-2">
          <CheckCircle2 size={isTablet || isDesktop ? 24 : 20} className="text-accent" />
          <span className={cn(
            "text-accent font-medium",
            (isTablet || isDesktop) ? "text-base" : "text-sm"
          )}>
            Connecté
          </span>
          {onDisconnect && (
            <button 
              onClick={(e) => { e.stopPropagation(); onDisconnect(); }}
              className="ml-2 text-black/30 dark:text-white/30 hover:text-red-500 transition-colors text-xs underline"
            >
              Déconnecter
            </button>
          )}
        </div>
      ) : (
        <Button
          variant="secondary"
          size={(isTablet || isDesktop) ? "md" : "sm"}
          onClick={(e: any) => { e.stopPropagation(); if (onConnect) onConnect(); }}
          icon={<Link size={16} />}
        >
          Connecter
        </Button>
      )}
    </Card>
  );
}
