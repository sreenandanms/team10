'use client';

import React from 'react';
import { OrderStatus } from '@/types';
import { Clock, RefreshCw, CheckCircle2, PackageCheck } from 'lucide-react';

interface StatusBadgeProps {
  status: OrderStatus;
  showIcon?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function StatusBadge({ status, showIcon = true, size = 'md' }: StatusBadgeProps) {
  const config = {
    PENDING: {
      label: 'Pending',
      bg: 'bg-amber-50',
      text: 'text-amber-800',
      border: 'border-amber-200',
      dot: 'bg-amber-500',
      icon: Clock,
    },
    WASHING: {
      label: 'Washing',
      bg: 'bg-blue-50',
      text: 'text-blue-800',
      border: 'border-blue-200',
      dot: 'bg-blue-500',
      icon: RefreshCw,
    },
    READY: {
      label: 'Ready',
      bg: 'bg-emerald-50',
      text: 'text-emerald-800',
      border: 'border-emerald-200',
      dot: 'bg-emerald-500',
      icon: CheckCircle2,
    },
    DELIVERED: {
      label: 'Delivered',
      bg: 'bg-slate-100',
      text: 'text-slate-700',
      border: 'border-slate-300',
      dot: 'bg-slate-500',
      icon: PackageCheck,
    },
  }[status] || {
    label: status,
    bg: 'bg-gray-50',
    text: 'text-gray-700',
    border: 'border-gray-200',
    dot: 'bg-gray-400',
    icon: Clock,
  };

  const Icon = config.icon;
  const isWashing = status === 'WASHING';
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs gap-1',
    md: 'px-2.5 py-1 text-xs gap-1.5 font-medium',
    lg: 'px-3 py-1.5 text-sm gap-2 font-medium',
  }[size];

  return (
    <span
      className={`inline-flex items-center rounded-full border transition-all duration-200 ${config.bg} ${config.text} ${config.border} ${sizeClasses}`}
    >
      {showIcon && (
        <Icon className={`${size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5'} ${isWashing ? 'animate-spin' : ''}`} />
      )}
      <span>{config.label}</span>
    </span>
  );
}
