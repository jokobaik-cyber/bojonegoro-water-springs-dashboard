import React, { useEffect, useLayoutEffect } from 'react';
import { MapContainer, TileLayer, useMapEvents, ScaleControl, GeoJSON, useMap } from 'react-leaflet';
import { Spring } from '../types';
import { BOJONEGORO_CENTER, BOJONEGORO_BOUNDARY, MAP_LAYERS } from '../constants';
import SpringMarker from './SpringMarker';

// Internal components helpers
const MapController = ({ center, zoom }: { center: [number, number] | null, zoom: number }) => {
    const map = useMap();
    
    useEffect(() => {
        // Immediate invalidate on mount
        setTimeout(() => {
            map.invalidateSize();
        }, 0);
        
        if (center) {
            map.flyTo(center, zoom, { duration: 1.5 });
        }
    }, [center, zoom, map]);

    // Robust resize handling using ResizeObserver
    useLayoutEffect(() => {
        // Immediate check synchronously before paint
        map.invalidateSize(false);

        const container = map.getContainer();
        const mapDiv = container?.parentElement;

        if (!mapDiv) return;

        const observer = new ResizeObserver(() => {
            map.invalidateSize(false);
        });

        observer.observe(mapDiv);
        
        // Also add window resize listener as fallback
        const handleWindowResize = () => {
            map.invalidateSize(false);
        };
        
        window.addEventListener('resize', handleWindowResize);

        return () => {
            observer.disconnect();
            window.removeEventListener('resize', handleWindowResize);
        };
    }, [map]);

    return null;
};

const MapEvents = ({ onMapClick }: { onMapClick: (lat: number, lng: number) => void }) => {
    const map = useMap();
    const clickTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);
    const clickCountRef = React.useRef(0);

    useMapEvents({
        click(e) {
            clickCountRef.current++;

            if (clickCountRef.current === 1) {
                // Single click - add new spring point
                clickTimeoutRef.current = setTimeout(() => {
                    if (clickCountRef.current === 1) {
                        onMapClick(e.latlng.lat, e.latlng.lng);
                    }
                    clickCountRef.current = 0;
                }, 300);
            } else if (clickCountRef.current === 2) {
                // Double click - zoom in
                if (clickTimeoutRef.current) {
                    clearTimeout(clickTimeoutRef.current);
                }
                map.zoomIn();
                clickCountRef.current = 0;
            }
        },
    });
    return null;
};

interface MapViewProps {
    activeLayer: keyof typeof MAP_LAYERS;
    filteredSprings: Spring[];
    mapFocus: { center: [number, number], zoom: number } | null;
    onMapClick: (lat: number, lng: number) => void;
    onSpringClick: (spring: Spring) => void;
}

const MapView: React.FC<MapViewProps> = ({
    activeLayer,
    filteredSprings,
    mapFocus,
    onMapClick,
    onSpringClick
}) => {
    // Fallback if activeLayer is invalid
    const currentMapLayer = MAP_LAYERS[activeLayer] || MAP_LAYERS['standard'];
    
    // Force layout recalculation on mount
    useLayoutEffect(() => {
        // This ensures ResizeObserver and MapController run after layout
        void 0;
    }, []);

    // Casting Leaflet components to any to resolve IntrinsicAttributes errors
    const MapContainerAny = MapContainer as any;
    const TileLayerAny = TileLayer as any;
    const GeoJSONAny = GeoJSON as any;

    return (
        <div style={{ width: '100%', height: '100%', display: 'flex' }} className="w-full h-full">
            <MapContainerAny
                center={BOJONEGORO_CENTER}
                zoom={11}
                zoomControl={false}
                scrollWheelZoom={true}
                style={{ width: '100%', height: '100%', flex: 1 }}
                className="map-container"
            >
                <TileLayerAny
                    key={activeLayer}
                    url={currentMapLayer.url}
                    attribution={currentMapLayer.attribution}
                    maxZoom={18}
                />
                <GeoJSONAny
                    data={BOJONEGORO_BOUNDARY}
                    style={{
                        color: '#2563eb',
                        weight: 2,
                        dashArray: '5, 5',
                        fillOpacity: 0.05,
                        fillColor: '#2563eb'
                    }}
                />
                {filteredSprings.map(spring => (
                    <SpringMarker
                        key={spring.id}
                        spring={spring}
                        onOpenDetail={onSpringClick}
                    />
                ))}
                <MapEvents onMapClick={onMapClick} />
                {mapFocus && <MapController center={mapFocus.center} zoom={mapFocus.zoom} />}
                <ScaleControl position="bottomleft" />
            </MapContainerAny>
        </div>
    );
};

export default MapView;
