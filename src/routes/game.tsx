import { MapContainer, TileLayer } from "react-leaflet";
import LocationMarker from "../components/location-marker.tsx";

export default function Game() {
  return (
    <div className="h-screen flex flex-col">
      <h2 className="text-2xl font-bold underline p-4">Game</h2>
      <div className="flex-1">
        <MapContainer
          center={[51.505, -0.09]}
          zoom={13}
          scrollWheelZoom={true}
          className="h-full w-full"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <LocationMarker />
        </MapContainer>
      </div>
      <a href="/">Go Back</a>
    </div>
  );
}
