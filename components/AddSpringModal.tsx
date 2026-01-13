import React, { useState, useRef } from 'react';
import { X, Upload, MapPin, Sparkles, Loader2 } from 'lucide-react';
import { analyzeSpringData } from '../services/geminiService';
import { Spring, SpringStatus } from '../types';

interface AddSpringModalProps {
  onClose: () => void;
  onAdd: (spring: Spring) => void;
  selectedCoords: [number, number] | null;
}

const AddSpringModal: React.FC<AddSpringModalProps> = ({ onClose, onAdd, selectedCoords }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async () => {
    if (!description) return;
    setIsAnalyzing(true);
    const result = await analyzeSpringData(description, image || undefined);
    if (result) {
      setAiAnalysis(result);
      setDescription(result.refinedDescription);
    }
    setIsAnalyzing(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCoords) return;

    const newSpring: Spring = {
      id: Date.now().toString(),
      name,
      description,
      location: { lat: selectedCoords[0], lng: selectedCoords[1] },
      status: (aiAnalysis?.suggestedStatus as SpringStatus) || SpringStatus.GOOD,
      imageUrl: image || 'https://picsum.photos/seed/' + Math.random() + '/800/600',
      contributor: 'Warga Publik',
      createdAt: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
      flowRate: 'Dalam Analisis',
      comments: [],
      recommendations: aiAnalysis?.recommendations || [],
      kecamatan: 'Manual Input', 
      desa: 'Manual Input'      
    };

    onAdd(newSpring);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[2000] flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] border border-slate-200 dark:border-slate-800 animate-slide-in">
        <div className="px-8 py-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-slate-800 dark:text-white">Lapor Titik Baru</h2>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Kontribusi Kelestarian Air</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors">
            <X size={20} className="text-slate-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 overflow-y-auto space-y-6 custom-scrollbar">
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Nama Sumber</label>
            <input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all font-semibold text-sm dark:text-white"
              placeholder="Contoh: Sendang Grogolan"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Lokasi GPS</label>
            <div className="flex items-center gap-3 text-xs font-bold text-blue-600 bg-blue-50 dark:bg-blue-900/20 px-4 py-3 rounded-xl border border-blue-100 dark:border-blue-800/50">
              <MapPin size={16} />
              {selectedCoords ? `${selectedCoords[0].toFixed(5)}, ${selectedCoords[1].toFixed(5)}` : 'Klik pada peta'}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Keterangan Kondisi</label>
            <textarea
              required
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all font-medium text-sm text-slate-600 dark:text-slate-300 resize-none"
              placeholder="Deskripsikan kejernihan air, masalah, atau keunikan..."
            />
            <div className="flex justify-between items-center mt-1">
              <button
                type="button"
                onClick={handleAnalyze}
                disabled={isAnalyzing || !description}
                className="flex items-center gap-2 text-[10px] font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 disabled:opacity-50 transition-colors uppercase tracking-widest"
              >
                {isAnalyzing ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />}
                Analisis Kualitas AI
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Foto Dokumentasi</label>
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl p-6 flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-blue-500 dark:hover:border-blue-500 transition-all bg-slate-50 dark:bg-slate-800/50"
            >
              {image ? (
                <div className="relative w-full">
                  <img src={image} alt="Preview" className="w-full h-32 object-cover rounded-xl shadow-md" />
                </div>
              ) : (
                <>
                  <Upload className="text-slate-400" size={24} />
                  <div className="text-center">
                    <p className="text-xs font-bold text-slate-600 dark:text-slate-300">Pilih berkas foto</p>
                    <p className="text-[10px] text-slate-400">JPG, PNG (Maks 5MB)</p>
                  </div>
                </>
              )}
              <input type="file" hidden ref={fileInputRef} accept="image/*" onChange={handleImageChange} />
            </div>
          </div>

          {aiAnalysis && (
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/50 p-4 rounded-xl space-y-3">
              <h4 className="text-[10px] font-bold text-blue-600 dark:text-blue-400 flex items-center gap-2 uppercase tracking-widest">
                <Sparkles size={12} /> Ringkasan AI
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[8px] text-blue-400 uppercase font-bold tracking-widest mb-0.5">Kondisi</p>
                  <p className="text-sm font-bold text-blue-800 dark:text-blue-200">{aiAnalysis.suggestedStatus}</p>
                </div>
                <div>
                  <p className="text-[8px] text-blue-400 uppercase font-bold tracking-widest mb-0.5">Saran</p>
                  <p className="text-[10px] font-medium text-blue-800 dark:text-blue-200 leading-tight">{aiAnalysis.recommendations[0]}</p>
                </div>
              </div>
            </div>
          )}

          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-slate-200 dark:border-slate-700 rounded-xl font-bold text-xs uppercase tracking-widest text-slate-500 hover:bg-slate-50 transition-all"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={!selectedCoords}
              className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-blue-700 transition-all disabled:opacity-50 shadow-md shadow-blue-500/20"
            >
              Simpan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddSpringModal;