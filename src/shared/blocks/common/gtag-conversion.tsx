'use client';

import { useEffect } from 'react';

export function GtagConversion({
  sendTo,
  value = 1.0,
  currency = 'USD',
}: {
  sendTo: string;
  value?: number;
  currency?: string;
}) {
  useEffect(() => {
    if (typeof window !== 'undefined' && typeof (window as any).gtag === 'function') {
      (window as any).gtag('event', 'conversion', { send_to: sendTo, value, currency });
    }
  }, []);

  return null;
}
