
import React from 'react';
import { Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { ExternalLink } from 'lucide-react';
import { Spring, SpringStatus } from '../types';
import './SpringMarker.css';

interface SpringMarkerProps {
  spring: Spring;
  onOpenDetail: (spring: Spring) => void;
}

const getStatusColor = (status: SpringStatus) => {
  switch (status) {
    case SpringStatus.EXCELLENT: return '#7dd3fc'; // Sky 300 (Lighter)
    case SpringStatus.GOOD: return '#0ea5e9';      // Sky 500
    case SpringStatus.FAIR: return '#2563eb';      // Blue 600
    case SpringStatus.POOR: return '#1e40af';      // Blue 800
    case SpringStatus.THREATENED: return '#172554'; // Blue 950 (Darker)
    default: return '#64748b';
  }
};

const SpringMarker: React.FC<SpringMarkerProps> = ({ spring, onOpenDetail }) => {
  const markerColor = getStatusColor(spring.status);
  
  // Custom icon with pulsing animation
  const icon = L.divIcon({
    className: 'spring-marker-wrapper',
    html: `
      <div class="spring-marker-pulse" style="--marker-color: ${markerColor};">
        <div class="spring-marker-ripple"></div>
        <div class="spring-marker-ripple" style="animation-delay: 0.4s;"></div>
        <div class="spring-marker-core" style="background-color: ${markerColor};"></div>
      </div>
    `,
    iconSize: [50, 50],
    iconAnchor: [25, 25],
  });

  // Casting components to any to resolve IntrinsicAttributes errors where standard Leaflet props are missing in the type definitions
  const MarkerAny = Marker as any;
  const PopupAny = Popup as any;

  return (
    <MarkerAny position={[spring.location.lat, spring.location.lng]} icon={icon}>
      <PopupAny className="spring-popup">
        <div className="w-56 p-0 overflow-hidden bg-white dark:bg-slate-900 transition-colors">
          <div className="px-3 py-3 space-y-2">
            <div>
              <h3 className="font-black text-slate-800 dark:text-slate-100 text-sm leading-tight">{spring.name}</h3>
              <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">{spring.contributor} • {spring.createdAt}</p>
            </div>
            
            <div className="flex justify-between items-center pt-1">
              <span className="text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-tighter" style={{ backgroundColor: `${markerColor}15`, color: markerColor }}>
                {spring.status}
              </span>
              <button 
                onClick={() => onOpenDetail(spring)}
                className="flex items-center gap-1 text-[10px] font-black text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors uppercase"
              >
                Detail <ExternalLink size={10} />
              </button>
            </div>
          </div>
        </div>
      </PopupAny>
    </MarkerAny>
  );
};

export default SpringMarker;
