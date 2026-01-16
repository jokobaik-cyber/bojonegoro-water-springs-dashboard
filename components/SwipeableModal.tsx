import React, { useState, useRef } from 'react';
import { X } from 'lucide-react';

interface SwipeableModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  showHandle?: boolean;
}

const SwipeableModal: React.FC<SwipeableModalProps> = ({
  isOpen,
  onClose,
  children,
  title,
  showHandle = true,
}) => {
  const [startY, setStartY] = useState(0);
  const modalRef = useRef<HTMLDivElement>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    setStartY(e.touches[0].clientY);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const endY = e.changedTouches[0].clientY;
    const diff = endY - startY;

    // Swipe down > 50px to close
    if (diff > 50) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 md:flex md:items-center md:justify-center p-4">
      <div
        ref={modalRef}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        className="bg-white dark:bg-slate-900 rounded-t-3xl md:rounded-2xl max-h-[90vh] overflow-y-auto md:max-h-[80vh] md:max-w-2xl w-full mt-auto md:mt-0 shadow-2xl"
      >
        {/* Swipe Handle */}
        {showHandle && (
          <div className="flex justify-center pt-3 pb-2 md:hidden">
            <div className="w-12 h-1 bg-slate-300 dark:bg-slate-600 rounded-full"></div>
          </div>
        )}

        {/* Title */}
        {title && (
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-700 md:hidden sticky top-0 bg-white dark:bg-slate-900 z-10">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">{title}</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            >
              <X size={20} className="text-slate-600 dark:text-slate-400" />
            </button>
          </div>
        )}

        {/* Content */}
        <div className="p-4 md:p-6">{children}</div>
      </div>
    </div>
  );
};

export default SwipeableModal;
