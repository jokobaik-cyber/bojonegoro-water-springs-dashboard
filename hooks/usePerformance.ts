import { useEffect } from 'react';

export const usePerformance = () => {
  useEffect(() => {
    // Log performance metrics
    if (performance.getEntriesByType) {
      const navigationTiming = performance.getEntriesByType('navigation')[0] as any;
      if (navigationTiming) {
        const pageLoadTime = navigationTiming.loadEventEnd - navigationTiming.loadEventStart;
        const connectTime = navigationTiming.responseEnd - navigationTiming.requestStart;
        console.log('📊 Page Load Time:', pageLoadTime.toFixed(2), 'ms');
        console.log('📊 Connect Time:', connectTime.toFixed(2), 'ms');
      }
    }

    // Monitor memory usage on Android
    if ((performance as any).memory) {
      console.log('💾 Memory Usage:', {
        usedJSHeapSize: ((performance as any).memory.usedJSHeapSize / 1048576).toFixed(2) + ' MB',
        totalJSHeapSize: ((performance as any).memory.totalJSHeapSize / 1048576).toFixed(2) + ' MB',
      });
    }
  }, []);
};
