import { MapContainer, TileLayer } from "react-leaflet";
import { type ReactNode } from "react";
import { LatLng } from "leaflet";

interface MapProps {
  children?: ReactNode;
}

export default function Map({ children }: MapProps) {
  const position = new LatLng(40.654231, -73.986683);
  return (
    <>
      <MapContainer
        center={position ? [position.lat, position.lng] : [0, 0]}
        zoom={13}
        scrollWheelZoom={true}
        className="h-full w-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {children}
      </MapContainer>
    </>
  );
}
