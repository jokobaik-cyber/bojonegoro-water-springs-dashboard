import React from 'react';
import { ShieldCheck, Sparkles, Activity, Globe } from 'lucide-react';
import { Spring, SpringStatus } from '../types';

interface DashboardStatsProps {
  springs: Spring[];
}

const DashboardStats: React.FC<DashboardStatsProps> = ({ springs }) => {
  const stats = {
    total: springs.length,
    healthy: springs.filter(s => s.status === SpringStatus.EXCELLENT || s.status === SpringStatus.GOOD).length,
    threatened: springs.filter(s => s.status === SpringStatus.THREATENED || s.status === SpringStatus.POOR).length,
    voters: springs.reduce((acc, s) => acc + (s.comments?.length || 0), 0)
  };

  const cards = [
    { 
      label: 'Total Titik', 
      value: stats.total, 
      icon: Globe, 
      color: 'text-blue-600',
      bg: 'bg-blue-50 dark:bg-blue-900/20'
    },
    { 
      label: 'Kondisi Baik', 
      value: stats.healthy, 
      icon: ShieldCheck, 
      color: 'text-emerald-600',
      bg: 'bg-emerald-50 dark:bg-emerald-900/20'
    },
    { 
      label: 'Status Kritis', 
      value: stats.threatened, 
      icon: Activity, 
      color: 'text-rose-600',
      bg: 'bg-rose-50 dark:bg-rose-900/20'
    },
    { 
      label: 'Tanggapan', 
      value: stats.voters, 
      icon: Sparkles, 
      color: 'text-amber-600',
      bg: 'bg-amber-50 dark:bg-amber-900/20'
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
      {cards.map((card, i) => (
        <div key={i} className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm flex items-center gap-5 transition-all hover:shadow-md">
          <div className={`w-12 h-12 rounded-xl ${card.bg} ${card.color} flex items-center justify-center`}>
            <card.icon size={24} />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-0.5">{card.label}</p>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight leading-none">{card.value}</h3>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DashboardStats;