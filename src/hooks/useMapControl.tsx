import { createContext, useContext, useState, type ReactNode } from "react";
import { type Map as LeafletMap } from "leaflet";
import { LatLng } from "leaflet";

interface MapControlContextType {
  map: LeafletMap | null;
  setMap: (map: LeafletMap | null) => void;
  userPosition: LatLng | null;
  setUserPosition: (position: LatLng | null) => void;
  recenterMap: () => void;
}

const MapControlContext = createContext<MapControlContextType | undefined>(undefined);

export function MapControlProvider({ children }: { children: ReactNode }) {
  const [map, setMap] = useState<LeafletMap | null>(null);
  const [userPosition, setUserPosition] = useState<LatLng | null>(null);

  const recenterMap = () => {
    if (map && userPosition) {
      map.flyTo(userPosition, map.getZoom());
    } else if (map) {
      // Try to get current location if we don't have it
      map.locate({ enableHighAccuracy: true });
    }
  };

  return (
    <MapControlContext.Provider
      value={{ map, setMap, userPosition, setUserPosition, recenterMap }}
    >
      {children}
    </MapControlContext.Provider>
  );
}

export function useMapControl() {
  const context = useContext(MapControlContext);
  if (!context) {
    throw new Error("useMapControl must be used within MapControlProvider");
  }
  return context;
}