'use client';

import React from 'react';
import { OrderStatus } from '@/types';
import { Check, Clock, RefreshCw, CheckCircle2, PackageCheck } from 'lucide-react';

interface StatusTimelineProps {
  currentStatus: OrderStatus;
  createdAt?: string;
  updatedAt?: string;
}

const STEPS: { key: OrderStatus; title: string; description: string; icon: React.ElementType }[] = [
  {
    key: 'PENDING',
    title: 'Order Placed',
    description: 'Order registered and awaiting laundry pickup',
    icon: Clock,
  },
  {
    key: 'WASHING',
    title: 'Washing',
    description: 'Clothes are being washed and dried in machine',
    icon: RefreshCw,
  },
  {
    key: 'READY',
    title: 'Ready for Pickup',
    description: 'Items are cleaned, ironed, and ready',
    icon: CheckCircle2,
  },
  {
    key: 'DELIVERED',
    title: 'Delivered',
    description: 'Returned to student successfully',
    icon: PackageCheck,
  },
];

const STATUS_ORDER: OrderStatus[] = ['PENDING', 'WASHING', 'READY', 'DELIVERED'];

export function StatusTimeline({ currentStatus, createdAt, updatedAt }: StatusTimelineProps) {
  const currentIndex = STATUS_ORDER.indexOf(currentStatus);

  return (
    <div className="py-4">
      <div className="relative">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
          {STEPS.map((step, index) => {
            const isCompleted = index <= currentIndex;
            const isCurrent = index === currentIndex;
            const Icon = step.icon;

            return (
              <div key={step.key} className="flex md:flex-col items-start md:items-center relative">
                {/* Horizontal line connector for desktop */}
                {index < STEPS.length - 1 && (
                  <div
                    className={`hidden md:block absolute top-5 left-1/2 w-full h-0.5 -z-0 ${
                      index < currentIndex ? 'bg-blue-600' : 'bg-slate-200'
                    }`}
                  />
                )}

                {/* Step Circle */}
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center border-2 z-10 transition-colors ${
                    isCurrent
                      ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                      : isCompleted
                      ? 'bg-blue-50 text-blue-700 border-blue-600'
                      : 'bg-white text-slate-400 border-slate-200'
                  }`}
                >
                  {isCompleted && !isCurrent ? (
                    <Check className="w-5 h-5 text-blue-700" />
                  ) : (
                    <Icon className="w-5 h-5" />
                  )}
                </div>

                {/* Step Text */}
                <div className="ml-4 md:ml-0 md:mt-3 md:text-center">
                  <p
                    className={`text-sm font-semibold ${
                      isCurrent ? 'text-blue-900 font-bold' : isCompleted ? 'text-slate-900' : 'text-slate-500'
                    }`}
                  >
                    {step.title}
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5 max-w-[180px]">
                    {step.description}
                  </p>
                  {isCurrent && (
                    <span className="inline-block mt-1 px-2 py-0.5 bg-blue-100 text-blue-800 text-[10px] font-semibold rounded uppercase tracking-wider">
                      Current Stage
                    </span>
                  )}
                  {step.key === 'PENDING' && createdAt && (
                    <p className="text-[11px] text-slate-400 mt-1">
                      {new Date(createdAt).toLocaleDateString('en-IN', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  )}
                  {isCurrent && updatedAt && step.key !== 'PENDING' && (
                    <p className="text-[11px] text-slate-400 mt-1">
                      Updated: {new Date(updatedAt).toLocaleDateString('en-IN', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
