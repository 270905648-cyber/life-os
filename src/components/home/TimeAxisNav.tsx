'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { TIME_PERIODS, type TimePeriod } from '@/types';
import { useTimePeriodStore } from '@/stores/app-store';
import { cn } from '@/lib/utils';

export function TimeAxisNav() {
  const { currentPeriod, setPeriod } = useTimePeriodStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  // 使用 useMemo 缓存渲染内容
  const content = useMemo(() => (
    <div className="relative">
      <div className="flex items-center gap-1 p-1 bg-muted/50 rounded-full">
        {TIME_PERIODS.map((period) => (
          <button
            key={period.code}
            onClick={() => setPeriod(period.code)}
            className={cn(
              "relative px-4 py-2 text-sm font-medium rounded-full transition-colors",
              currentPeriod === period.code
                ? "text-primary-foreground"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {currentPeriod === period.code && (
              <motion.div
                layoutId="period-indicator"
                className="absolute inset-0 bg-primary rounded-full"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
            <span className="relative z-10">{period.name}</span>
          </button>
        ))}
      </div>
    </div>
  ), [currentPeriod, setPeriod]);

  if (!mounted) return null;

  return content;
}
