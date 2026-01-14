import React from 'react';
import { X, MapPin, Calendar, User as UserIcon, Droplet, CheckCircle2, Navigation, Info, TreePine, Map as MapIcon } from 'lucide-react';
import { Spring, SpringStatus } from '../types';
import CommentSection from './CommentSection';

interface SpringDetailModalProps {
  spring: Spring;
  onClose: () => void;
  onAddComment: (springId: string, text: string) => void;
}

const getStatusStyles = (status: SpringStatus) => {
  switch (status) {
    case SpringStatus.EXCELLENT: return { color: 'text-sky-400', bg: 'bg-sky-50 dark:bg-sky-950/30', border: 'border-sky-100 dark:border-sky-900/30', accent: 'bg-sky-400' };
    case SpringStatus.GOOD: return { color: 'text-sky-600 dark:text-sky-400', bg: 'bg-sky-50 dark:bg-sky-950/30', border: 'border-sky-100 dark:border-sky-900/30', accent: 'bg-sky-600' };
    case SpringStatus.FAIR: return { color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-950/30', border: 'border-blue-100 dark:border-blue-900/30', accent: 'bg-blue-600' };
    case SpringStatus.POOR: return { color: 'text-blue-800 dark:text-blue-500', bg: 'bg-blue-50 dark:bg-blue-950/30', border: 'border-blue-200 dark:border-blue-900/30', accent: 'bg-blue-800' };
    case SpringStatus.THREATENED: return { color: 'text-slate-900 dark:text-slate-200', bg: 'bg-slate-100 dark:bg-slate-800/50', border: 'border-slate-200 dark:border-slate-700', accent: 'bg-slate-900' };
    default: return { color: 'text-slate-600 dark:text-slate-400', bg: 'bg-slate-50 dark:bg-slate-900/50', border: 'border-slate-100 dark:border-slate-800', accent: 'bg-slate-500' };
  }
};

const SpringDetailModal: React.FC<SpringDetailModalProps> = ({ spring, onClose, onAddComment }) => {
  const styles = getStatusStyles(spring.status);

  return (
    <div className="fixed inset-0 bg-slate-900/20 dark:bg-black/30 z-[3000] flex items-center justify-center p-4 sm:p-6 animate-fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] border border-white/20 dark:border-slate-800 transition-colors duration-500">
        {/* Header */}
        <div className="relative bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-800 dark:to-blue-900 p-6 sm:p-8">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-3 bg-white/20 hover:bg-white/30 backdrop-blur-xl text-white rounded-full transition-all border border-white/20 shadow-lg"
          >
            <X size={24} />
          </button>
          
          <div className="text-white">
            <div className="flex items-center gap-3 mb-4">
              <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] ${styles.bg} ${styles.color} shadow-sm border ${styles.border}`}>
                Kondisi: {spring.status}
              </span>
              <span className="px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] bg-white/20 backdrop-blur-md text-white border border-white/20">
                <Droplet size={10} className="inline mr-1" /> {spring.flowRate || '8.5 L/s'}
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black mb-3 tracking-tighter leading-tight">{spring.name}</h2>
            <div className="flex flex-wrap items-center gap-6 text-xs font-bold text-white/80 uppercase tracking-widest">
              <span className="flex items-center gap-2"><MapPin size={16} /> {spring.desa ? `${spring.desa}, ` : ''}{spring.kecamatan || 'Bojonegoro'}</span>
              <span className="flex items-center gap-2"><Calendar size={16} /> Terdata {spring.createdAt}</span>
            </div>
          </div>
        </div>

        {/* Dynamic Content */}
        <div className="p-6 sm:p-8 overflow-y-auto custom-scrollbar bg-slate-50/30 dark:bg-slate-900/30">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-6">
              <section>
                <div className="flex items-center gap-2 mb-4">
                  <div className={`w-1.5 h-6 rounded-full ${styles.accent}`}></div>
                  <h4 className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.25em]">Lokasi Sumber</h4>
                </div>
                <div className="space-y-3">
                  <div className="p-4 bg-white dark:bg-slate-800/40 rounded-2xl border border-slate-100 dark:border-slate-800">
                    <p className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">Desa</p>
                    <p className="text-sm font-black text-slate-800 dark:text-white">{spring.desa}</p>
                  </div>
                  <div className="p-4 bg-white dark:bg-slate-800/40 rounded-2xl border border-slate-100 dark:border-slate-800">
                    <p className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">Kecamatan</p>
                    <p className="text-sm font-black text-slate-800 dark:text-white">{spring.kecamatan}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-4 bg-white dark:bg-slate-800/40 rounded-2xl border border-slate-100 dark:border-slate-800">
                      <p className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">Latitude</p>
                      <p className="text-sm font-black text-slate-800 dark:text-white">{spring.location.lat.toFixed(4)}</p>
                    </div>
                    <div className="p-4 bg-white dark:bg-slate-800/40 rounded-2xl border border-slate-100 dark:border-slate-800">
                      <p className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">Longitude</p>
                      <p className="text-sm font-black text-slate-800 dark:text-white">{spring.location.lng.toFixed(4)}</p>
                    </div>
                  </div>
                </div>
              </section>

              {spring.recommendations && spring.recommendations.length > 0 && (
                <section className={`p-6 rounded-2xl border ${styles.border} ${styles.bg} relative overflow-hidden shadow-sm`}>
                  <TreePine className={`absolute -right-4 -bottom-4 ${styles.color} opacity-10 w-32 h-32`} />
                  <h4 className={`text-sm font-black ${styles.color} uppercase tracking-[0.15em] mb-6 flex items-center gap-3`}>
                    <CheckCircle2 size={22} /> Rencana Aksi Konservasi
                  </h4>
                  <ul className="space-y-4 relative z-10">
                    {spring.recommendations.map((rec, i) => (
                      <li key={i} className="flex gap-4 text-sm text-slate-700 dark:text-slate-200 font-bold items-start group">
                        <span className={`mt-1.5 w-2 h-2 rounded-full flex-shrink-0 ${styles.accent} group-hover:scale-150 transition-transform`}></span>
                        {rec}
                      </li>
                    ))}
                  </ul>
                </section>
              )}
            </div>

            <div className="space-y-6">
              <div className="p-6 bg-white dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm group hover:shadow-xl transition-all duration-500">
                <div className="flex items-center justify-between mb-4">
                   <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Kontributor</p>
                   <UserIcon size={14} className="text-slate-300 dark:text-slate-600" />
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-400 dark:text-slate-400 font-black text-xs uppercase">
                    {spring.contributor.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-black text-slate-800 dark:text-white">{spring.contributor}</p>
                    <p className="text-[10px] text-blue-600 dark:text-blue-400 font-bold uppercase">Relawan Aktif</p>
                  </div>
                </div>
              </div>
              
              <div className="p-6 bg-white dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-16 h-16 bg-sky-50 dark:bg-sky-900/20 rounded-bl-3xl opacity-50 group-hover:scale-110 transition-transform"></div>
                <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-6 flex items-center gap-2">
                  <Navigation size={12} /> Panduan Jalan
                </p>
                <div className="aspect-video bg-slate-100 dark:bg-slate-900 rounded-2xl overflow-hidden mb-6 relative">
                  <div className="absolute inset-0 bg-blue-500/5 flex items-center justify-center">
                    <MapIcon size={32} className="text-slate-300 dark:text-slate-700" />
                  </div>
                </div>
                <a 
                  href={`https://www.google.com/maps/search/?api=1&query=${spring.location.lat},${spring.location.lng}`}
                  target="_blank"
                  rel="noreferrer"
                  className="block text-center py-4 bg-slate-900 dark:bg-blue-600 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-blue-600 dark:hover:bg-blue-700 transition-all shadow-lg hover:shadow-blue-200 dark:hover:shadow-blue-900/20"
                >
                  Navigasi Presisi
                </a>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <CommentSection 
              comments={spring.comments} 
              onAddComment={(text) => onAddComment(spring.id, text)} 
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpringDetailModal;