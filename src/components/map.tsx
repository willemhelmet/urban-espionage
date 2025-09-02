import { MapContainer, TileLayer, useMapEvents } from "react-leaflet";
import { type ReactNode, useEffect } from "react";
import { LatLng } from "leaflet";
import { useMapControl } from "../hooks/useMapControl";

interface MapProps {
  children?: ReactNode;
}

function MapEventHandler() {
  const { setMap, setUserPosition } = useMapControl();
  
  const map = useMapEvents({
    locationfound(e) {
      setUserPosition(e.latlng);
      map.flyTo(e.latlng, map.getZoom());
    },
  });

  useEffect(() => {
    setMap(map);
    // Request location on mount
    map.locate({ enableHighAccuracy: true });
  }, [map, setMap]);

  return null;
}

export default function Map({ children }: MapProps) {
  const position = new LatLng(40.654231, -73.986683);
  
  return (
    <MapContainer
      center={position ? [position.lat, position.lng] : [0, 0]}
      zoom={13}
      scrollWheelZoom={true}
      className="h-full w-full"
      zoomControl={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MapEventHandler />
      {children}
    </MapContainer>
  );
}
