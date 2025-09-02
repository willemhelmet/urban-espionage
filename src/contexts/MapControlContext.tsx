import { useState, type ReactNode } from "react";
import { type Map as LeafletMap } from "leaflet";
import { LatLng } from "leaflet";
import { MapControlContext } from "./MapControl.context";

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