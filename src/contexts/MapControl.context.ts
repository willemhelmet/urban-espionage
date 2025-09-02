import { createContext } from "react";
import { type Map as LeafletMap } from "leaflet";
import { LatLng } from "leaflet";

export interface MapControlContextType {
  map: LeafletMap | null;
  setMap: (map: LeafletMap | null) => void;
  userPosition: LatLng | null;
  setUserPosition: (position: LatLng | null) => void;
  recenterMap: () => void;
}

export const MapControlContext = createContext<MapControlContextType | undefined>(undefined);