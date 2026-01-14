import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { Plus, Search, LayoutDashboard, Info, Layers, Waves, Compass, X as CloseIcon, MapPin, Sun, Moon, Check } from 'lucide-react';
import { Spring, Comment } from './types';
import { MOCK_SPRINGS, MAP_LAYERS } from './constants';
import AddSpringModal from './components/AddSpringModal';
import DashboardStats from './components/DashboardStats';
import SpringDetailModal from './components/SpringDetailModal';
import MapView from './components/MapView';

const App: React.FC = () => {
  const [springs, setSprings] = useState<Spring[]>(MOCK_SPRINGS);
  const [selectedCoords, setSelectedCoords] = useState<[number, number] | null>(null);
  const [mapFocus, setMapFocus] = useState<{ center: [number, number], zoom: number } | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [detailSpring, setDetailSpring] = useState<Spring | null>(null);
  const [activeTab, setActiveTab] = useState<'map' | 'dashboard'>('map');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [activeLayer, setActiveLayer] = useState<keyof typeof MAP_LAYERS>('standard');
  const [showLayerMenu, setShowLayerMenu] = useState(false);

  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

  const handleMapClick = useCallback((lat: number, lng: number) => {
    setSelectedCoords([lat, lng]);
    setShowAddModal(true);
  }, []);

  const handleAddSpring = (newSpring: Spring) => {
    setSprings(prev => [newSpring, ...prev]);
  };

  const handleAddComment = (springId: string, text: string) => {
    const newComment: Comment = {
      id: Date.now().toString(),
      user: 'Warga Peduli',
      text,
      createdAt: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
    };

    setSprings(prev => {
      const updated = prev.map(s => {
        if (s.id === springId) {
          return { ...s, comments: [...(s.comments || []), newComment] };
        }
        return s;
      });

      if (detailSpring && detailSpring.id === springId) {
        setDetailSpring(updated.find(u => u.id === springId) || null);
      }
      return updated;
    });
  };

  const filteredSprings = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return springs;
    return springs.filter(s =>
      s.name.toLowerCase().includes(query) ||
      s.kecamatan?.toLowerCase().includes(query) ||
      s.desa?.toLowerCase().includes(query)
    );
  }, [springs, searchQuery]);

  const handleSelectSearchResult = (spring: Spring) => {
    setSearchQuery(spring.name);
    setShowSearchResults(false);
    setActiveTab('map');
    setMapFocus({ center: [spring.location.lat, spring.location.lng], zoom: 16 });
    setTimeout(() => setDetailSpring(spring), 600);
  };

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950 overflow-hidden font-sans transition-colors duration-500">
      {/* Sleek Minimalist Sidebar */}
      <aside className="w-20 lg:w-72 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col py-8 z-[1001] transition-all">
        <div className="px-6 mb-12">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
              <Waves size={24} />
            </div>
            <div className="hidden lg:block">
              <h1 className="font-bold text-sm tracking-tight text-slate-900 dark:text-white leading-none">MATA AIR</h1>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">BOJONEGORO</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 space-y-1 px-3">
          <NavItem
            active={activeTab === 'map'}
            onClick={() => setActiveTab('map')}
            icon={<Compass size={20} />}
            label="Eksplorasi Peta"
          />
          <NavItem
            active={activeTab === 'dashboard'}
            onClick={() => setActiveTab('dashboard')}
            icon={<LayoutDashboard size={20} />}
            label="Analisa Data"
          />
        </nav>

        <div className="mt-auto px-4 space-y-4">
          <button
            onClick={toggleDarkMode}
            className="w-full flex items-center justify-center lg:justify-start gap-3 px-4 py-3 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
          >
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            <span className="hidden lg:block text-xs font-semibold">Mode {isDarkMode ? 'Terang' : 'Gelap'}</span>
          </button>

          <div className="hidden lg:block p-5 bg-slate-900 dark:bg-slate-800 rounded-2xl text-white relative overflow-hidden">
            <div className="relative z-10">
              <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest mb-2">Bojonegoro Institute ©™®</p>
              <p className="text-xs text-slate-300 leading-relaxed">Membangun ekosistem air yang berkelanjutan di Bojonegoro.</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Container */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        {/* Harmonized Header */}
        <header className="h-20 bg-white/70 dark:bg-slate-900/70 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-8 z-[1000]">
          <div className="flex-1 max-w-xl relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              value={searchQuery}
              onFocus={() => setShowSearchResults(true)}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowSearchResults(true);
              }}
              placeholder="Cari sumber air, desa, atau kecamatan..."
              className="w-full bg-slate-100 dark:bg-slate-800/50 border-none rounded-xl py-2.5 pl-11 pr-10 outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white dark:focus:bg-slate-800 transition-all text-sm font-medium dark:text-white"
            />
            {searchQuery && (
              <button
                onClick={() => { setSearchQuery(''); setShowSearchResults(false); }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
              >
                <CloseIcon size={16} />
              </button>
            )}

            {/* Results Dropdown */}
            {showSearchResults && searchQuery.trim().length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-slide-in max-h-96 overflow-y-auto">
                {filteredSprings.length > 0 ? (
                  <div className="p-2">
                    {filteredSprings.slice(0, 8).map(spring => (
                      <button
                        key={spring.id}
                        onClick={() => handleSelectSearchResult(spring)}
                        className="w-full flex items-center gap-4 p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-all text-left"
                      >
                        <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-600 flex items-center justify-center flex-shrink-0">
                          <MapPin size={20} />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-bold text-slate-800 dark:text-slate-100 truncate">{spring.name}</p>
                          <p className="text-[10px] text-slate-400 font-bold uppercase truncate mt-0.5">{spring.kecamatan} • {spring.desa}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="p-8 text-center">
                    <p className="text-sm font-medium text-slate-400">Tidak ada hasil ditemukan</p>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="flex items-center gap-4 ml-6 relative">
            <button
              onClick={() => setShowLayerMenu(!showLayerMenu)}
              className={`hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl transition-all font-bold text-xs uppercase tracking-wider ${showLayerMenu
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
            >
              <Layers size={18} /> Lapisan
            </button>

            {/* Layers Switcher Menu */}
            {showLayerMenu && (
              <div className="absolute top-full right-0 mt-3 w-64 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden z-[1002] animate-slide-in p-2">
                <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest px-4 py-3 border-b border-slate-100 dark:border-slate-800 mb-1">Pilih Sumber Peta</p>
                <div className="space-y-1">
                  {(Object.keys(MAP_LAYERS) as Array<keyof typeof MAP_LAYERS>).map((key) => (
                    <button
                      key={key}
                      onClick={() => {
                        setActiveLayer(key);
                        setShowLayerMenu(false);
                      }}
                      className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all text-left ${activeLayer === key
                        ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                        }`}
                    >
                      <span className="text-xs font-bold uppercase tracking-wide">{MAP_LAYERS[key].name}</span>
                      {activeLayer === key && <Check size={16} />}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-bold text-xs transition-all shadow-md shadow-blue-500/20 uppercase tracking-wider"
            >
              <Plus size={18} />
              <span className="hidden lg:inline">Lapor Titik</span>
            </button>
          </div>
        </header>

        {/* Backdrop for menus */}
        {(showSearchResults || showLayerMenu) && (
          <div className="fixed inset-0 z-[999] bg-black/5" onClick={() => { setShowSearchResults(false); setShowLayerMenu(false); }} />
        )}

        {/* Content Container */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {activeTab === 'map' ? (
            <div className="flex-1 w-full overflow-hidden">
              {/* Map container - full viewport */}
              <MapView
                activeLayer={activeLayer}
                filteredSprings={filteredSprings}
                mapFocus={mapFocus}
                onMapClick={handleMapClick}
                onSpringClick={(s) => setDetailSpring(s)}
              />
            </div>
          ) : (
            <div className="overflow-y-auto h-full custom-scrollbar">
              <div className="max-w-6xl mx-auto w-full animate-slide-in pb-12 p-8">
                <div className="mb-10">
                  <h2 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight mb-2">Laporan Kondisi</h2>
                  <p className="text-slate-500 dark:text-slate-400 font-medium text-sm">Pemantauan ekosistem mata air di Kabupaten Bojonegoro secara real-time.</p>
                </div>

                <DashboardStats springs={springs} />

                <div className="grid lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800">
                    <div className="flex items-center justify-between mb-8">
                      <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">Daftar Mata Air Terkini</h3>
                      <button className="text-xs font-bold text-blue-600 hover:text-blue-700 uppercase tracking-widest">Lihat Semua</button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {filteredSprings.slice(0, 10).map(spring => (
                        <div
                          key={spring.id}
                          onClick={() => setDetailSpring(spring)}
                          className="glass-card flex flex-col gap-3 p-4 rounded-2xl cursor-pointer group"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1 min-w-0">
                              <h4 className="font-bold text-slate-800 dark:text-slate-100 group-hover:text-blue-600 transition-colors truncate text-sm">{spring.name}</h4>
                              <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest mt-1">{spring.kecamatan}</p>
                            </div>
                            <div className={`flex-shrink-0 w-6 h-6 rounded-full border-2 border-white dark:border-slate-800 ml-2 ${spring.status === 'Excellent' ? 'bg-sky-400' : spring.status === 'Good' ? 'bg-green-400' : spring.status === 'Fair' ? 'bg-yellow-400' : 'bg-red-400'}`}></div>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="flex -space-x-1.5">
                              {[1, 2].map(i => <div key={i} className="w-4 h-4 rounded-full border border-white dark:border-slate-800 bg-slate-100 dark:bg-slate-700"></div>)}
                            </div>
                            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500">+{spring.comments?.length || 0} Tanggapan</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-8">
                    <div className="bg-blue-600 p-8 rounded-3xl text-white shadow-lg shadow-blue-500/20 relative overflow-hidden group">
                      <Waves className="absolute -right-8 -bottom-8 text-white/10 w-40 h-40 group-hover:scale-110 transition-transform duration-1000" />
                      <h3 className="text-xl font-bold mb-3 leading-tight">Kontribusi Warga</h3>
                      <p className="text-blue-100 text-xs mb-8 leading-relaxed font-medium">Bantu kami menjaga kelestarian air dengan melaporkan kondisi titik air di sekitar Anda.</p>
                      <button
                        onClick={() => setShowAddModal(true)}
                        className="w-full bg-white text-blue-600 px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-widest hover:shadow-lg transition-all"
                      >
                        Lapor Titik Baru
                      </button>
                    </div>

                    <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800">
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                        <Info size={18} className="text-blue-500" /> Tips Konservasi
                      </h3>
                      <div className="space-y-4">
                        <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border-l-4 border-blue-500">
                          <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest mb-1">Vegetasi</p>
                          <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">Tanam pohon di area hulu untuk menjaga debit air.</p>
                        </div>
                        <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border-l-4 border-slate-400">
                          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Resapan</p>
                          <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">Hindari penggunaan beton di area sekitar sumber.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Modals */}
      {showAddModal && (
        <AddSpringModal
          onClose={() => { setShowAddModal(false); setSelectedCoords(null); }}
          onAdd={handleAddSpring}
          selectedCoords={selectedCoords}
        />
      )}

      {detailSpring && (
        <SpringDetailModal
          spring={detailSpring}
          onClose={() => setDetailSpring(null)}
          onAddComment={handleAddComment}
        />
      )}
    </div>
  );
};

interface NavItemProps {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}

const NavItem: React.FC<NavItemProps> = ({ active, onClick, icon, label }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all group ${active
      ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
      : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
      }`}
  >
    <div className="flex-shrink-0">{icon}</div>
    <span className={`hidden lg:block text-xs font-bold uppercase tracking-wider ${active ? 'opacity-100' : 'opacity-70'}`}>
      {label}
    </span>
  </button>
);

export default App;
