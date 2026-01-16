export const useHapticFeedback = () => {
  const trigger = async (type: 'light' | 'medium' | 'heavy' = 'light') => {
    try {
      const duration = type === 'light' ? 50 : type === 'medium' ? 100 : 200;

      // Try Capacitor haptics first (Android)
      if (typeof window !== 'undefined' && (window as any).Capacitor) {
        try {
          const { Haptics } = await import('@capacitor/haptics');
          await Haptics.vibrate({ duration });
          return;
        } catch (error) {
          console.log('Capacitor haptics not available');
        }
      }

      // Fallback to navigator.vibrate API (browser)
      if (navigator.vibrate) {
        navigator.vibrate(duration);
      }
    } catch (error) {
      // Silently fail - haptics not available
      console.log('Haptic feedback not available');
    }
  };

  return { trigger };
};
