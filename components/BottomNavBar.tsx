import React from 'react';
import { Map, LayoutGrid, Search, Settings } from 'lucide-react';

interface BottomNavBarProps {
  activeTab: 'map' | 'dashboard';
  onTabChange: (tab: 'map' | 'dashboard') => void;
  onSearchClick: () => void;
}

const BottomNavBar: React.FC<BottomNavBarProps> = ({ activeTab, onTabChange, onSearchClick }) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-700 md:hidden z-40">
      <div className="flex items-center justify-around h-16 max-w-md mx-auto">
        {/* Map Tab */}
        <button
          onClick={() => onTabChange('map')}
          className={`flex flex-col items-center justify-center flex-1 h-full transition-colors active:scale-95 ${
            activeTab === 'map'
              ? 'text-blue-600 dark:text-blue-400'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
        >
          <Map size={24} />
          <span className="text-xs mt-1 font-medium">Peta</span>
        </button>

        {/* Search Tab */}
        <button
          onClick={onSearchClick}
          className="flex flex-col items-center justify-center flex-1 h-full text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 transition-colors active:scale-95"
        >
          <Search size={24} />
          <span className="text-xs mt-1 font-medium">Cari</span>
        </button>

        {/* Dashboard Tab */}
        <button
          onClick={() => onTabChange('dashboard')}
          className={`flex flex-col items-center justify-center flex-1 h-full transition-colors active:scale-95 ${
            activeTab === 'dashboard'
              ? 'text-blue-600 dark:text-blue-400'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
        >
          <LayoutGrid size={24} />
          <span className="text-xs mt-1 font-medium">Dashboard</span>
        </button>

        {/* Settings Tab */}
        <button
          className="flex flex-col items-center justify-center flex-1 h-full text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 transition-colors active:scale-95"
        >
          <Settings size={24} />
          <span className="text-xs mt-1 font-medium">Setelan</span>
        </button>
      </div>
    </div>
  );
};

export default BottomNavBar;
