import { useState, useEffect } from "react";
import { Marker, Popup, useMapEvents } from "react-leaflet";
import { LatLng } from "leaflet";
import L from "leaflet";
import { type Player as PlayerType } from "../types";

interface PlayerProps {
  player?: PlayerType;
  isSelf?: boolean;
}

// Custom icon for the current player
const selfIcon = L.divIcon({
  html: `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><!-- Icon from Material Symbols by Google - https://github.com/google/material-design-icons/blob/master/LICENSE --><path fill="currentColor" d="M5.85 17.1q1.275-.975 2.85-1.537T12 15t3.3.563t2.85 1.537q.875-1.025 1.363-2.325T20 12q0-3.325-2.337-5.663T12 4T6.337 6.338T4 12q0 1.475.488 2.775T5.85 17.1M12 13q-1.475 0-2.488-1.012T8.5 9.5t1.013-2.488T12 6t2.488 1.013T15.5 9.5t-1.012 2.488T12 13m0 9q-2.075 0-3.9-.788t-3.175-2.137T2.788 15.9T2 12t.788-3.9t2.137-3.175T8.1 2.788T12 2t3.9.788t3.175 2.137T21.213 8.1T22 12t-.788 3.9t-2.137 3.175t-3.175 2.138T12 22"/></svg>`,
  className: "self-marker",
  iconSize: [24, 24],
  iconAnchor: [12, 12],
});

const otherPlayerIcon = L.divIcon({
  html: `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 512 512"><!-- Icon from Game Icons by GameIcons - https://github.com/game-icons/icons/blob/master/license.txt --><path fill="currentColor" d="M218 19c-1 0-2.76.52-5.502 3.107c-2.742 2.589-6.006 7.021-9.191 12.76c-6.37 11.478-12.527 28.033-17.666 45.653c-4.33 14.844-7.91 30.457-10.616 44.601c54.351 24.019 107.599 24.019 161.95 0c-2.706-14.144-6.286-29.757-10.616-44.601c-5.139-17.62-11.295-34.175-17.666-45.653c-3.185-5.739-6.45-10.171-9.191-12.76C296.76 19.52 295 19 294 19c-6.5 0-9.092 1.375-10.822 2.85c-1.73 1.474-3.02 3.81-4.358 7.34s-2.397 8.024-5.55 12.783C270.116 46.73 263.367 51 256 51c-7.433 0-14.24-4.195-17.455-8.988c-3.214-4.794-4.26-9.335-5.576-12.881s-2.575-5.867-4.254-7.315C227.035 20.37 224.5 19 218 19m-46.111 124.334c-1.41 9.278-2.296 17.16-2.57 22.602c6.61 5.087 17.736 10.007 31.742 13.302C217.18 183.031 236.6 185 256 185s38.82-1.969 54.94-5.762c14.005-3.295 25.13-8.215 31.742-13.302c-.275-5.443-1.161-13.324-2.57-22.602c-55.757 23.332-112.467 23.332-168.223 0M151.945 155.1c-19.206 3.36-36.706 7.385-51.918 11.63c-19.879 5.548-35.905 11.489-46.545 16.57c-5.32 2.542-9.312 4.915-11.494 6.57c-.37.28-.247.306-.445.546c.333.677.82 1.456 1.73 2.479c1.973 2.216 5.564 4.992 10.627 7.744c10.127 5.504 25.944 10.958 45.725 15.506C139.187 225.24 194.703 231 256 231s116.813-5.76 156.375-14.855c19.78-4.548 35.598-10.002 45.725-15.506c5.063-2.752 8.653-5.528 10.627-7.744c.91-1.023 1.397-1.802 1.73-2.479c-.198-.24-.075-.266-.445-.547c-2.182-1.654-6.174-4.027-11.494-6.568c-10.64-5.082-26.666-11.023-46.545-16.57c-15.212-4.246-32.712-8.272-51.918-11.631c.608 5.787.945 10.866.945 14.9v3.729l-2.637 2.634c-10.121 10.122-25.422 16.191-43.302 20.399C297.18 200.969 276.6 203 256 203s-41.18-2.031-59.06-6.238s-33.182-10.277-43.303-20.399L151 173.73V170c0-4.034.337-9.113.945-14.9m1.094 88.205C154.558 308.17 200.64 359 256 359s101.442-50.83 102.96-115.695a749 749 0 0 1-19.284 2.013c-1.33 5.252-6.884 25.248-15.676 30.682c-13.61 8.412-34.006 7.756-48 0c-7.986-4.426-14.865-19.196-18.064-27.012c-.648.002-1.287.012-1.936.012c-.65 0-1.288-.01-1.936-.012c-3.2 7.816-10.078 22.586-18.064 27.012c-13.994 7.756-34.39 8.412-48 0c-8.792-5.434-14.346-25.43-15.676-30.682a749 749 0 0 1-19.285-2.013M137.4 267.209c-47.432 13.23-77.243 32.253-113.546 61.082c42.575 4.442 67.486 21.318 101.265 48.719l16.928 13.732l-21.686 2.211c-13.663 1.393-28.446 8.622-39.3 17.3c-5.925 4.738-10.178 10.06-12.957 14.356c44.68 5.864 73.463 10.086 98.011 20.147c18.603 7.624 34.81 18.89 53.737 35.781l5.304-23.576c-1.838-9.734-4.134-19.884-6.879-30.3c-5.12-7.23-9.698-14.866-13.136-22.007C201.612 397.326 199 391 199 384c0-3.283.936-6.396 2.428-9.133a480 480 0 0 0-6.942-16.863c-29.083-19.498-50.217-52.359-57.086-90.795m237.2 0c-6.87 38.436-28.003 71.297-57.086 90.795a481 481 0 0 0-6.942 16.861c1.493 2.737 2.428 5.851 2.428 9.135c0 7-2.612 13.326-6.14 20.654c-3.44 7.142-8.019 14.78-13.14 22.01c-2.778 10.547-5.099 20.82-6.949 30.666l5.14 23.42c19.03-17.01 35.293-28.338 53.974-35.994c24.548-10.06 53.33-14.283 98.011-20.147c-2.78-4.297-7.032-9.618-12.957-14.355c-10.854-8.679-25.637-15.908-39.3-17.3l-21.686-2.212l16.928-13.732c33.779-27.4 58.69-44.277 101.265-48.719c-36.303-28.829-66.114-47.851-113.546-61.082M256 377c-8 0-19.592.098-28.234 1.826c-4.321.864-7.8 2.222-9.393 3.324c-1.592 1.103-1.373.85-1.373 1.85s1.388 6.674 4.36 12.846c2.971 6.172 7.247 13.32 11.964 19.924s9.925 12.699 14.465 16.806c4.075 3.687 7.842 5.121 8.211 5.377c.37-.256 4.136-1.69 8.21-5.377c4.54-4.107 9.749-10.202 14.466-16.806s8.993-13.752 11.965-19.924S295 385 295 384s.22-.747-1.373-1.85c-1.593-1.102-5.072-2.46-9.393-3.324C275.592 377.098 264 377 256 377m0 61.953c-.042.03-.051.047 0 .047s.042-.018 0-.047m-11.648 14.701L235.047 495h41.56l-9.058-41.285C264.162 455.71 260.449 457 256 457c-4.492 0-8.235-1.316-11.648-3.346"/></svg>`,
  className: "self-marker",
  iconSize: [24, 24],
  iconAnchor: [12, 12],
});

const deadPlayerIcon = L.divIcon({
  html: `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><!-- Icon from Material Design Icons by Pictogrammers - https://github.com/Templarian/MaterialDesign/blob/master/LICENSE --><path fill="currentColor" d="M10 2h4c3.31 0 5 2.69 5 6v10.66C16.88 17.63 15.07 17 12 17s-4.88.63-7 1.66V8c0-3.31 1.69-6 5-6M8 8v1.5h8V8zm1 4v1.5h6V12zM3 22v-.69c2.66-1.69 10.23-5.47 18-.06V22z"/></svg>`,
  className: "self-marker",
  iconSize: [24, 24],
  iconAnchor: [12, 12],
});

export default function Player({ player, isSelf = false }: PlayerProps) {
  const [selfPosition, setSelfPosition] = useState<LatLng | null>(null);

  // Only use map events if this is the self player
  const map = useMapEvents({
    click() {
      if (isSelf) {
        map.locate({ enableHighAccuracy: true });
      }
    },
    locationfound(e) {
      if (isSelf) {
        setSelfPosition(e.latlng);
        map.flyTo(e.latlng, map.getZoom());
      }
    },
  });

  // Auto-locate on mount for self player
  useEffect(() => {
    if (isSelf) {
      map.locate({ enableHighAccuracy: true });
    }
  }, [map, isSelf]);

  // Determine position based on whether this is self or other player
  const position = isSelf
    ? selfPosition
    : player?.position
      ? new LatLng(player.position.latitude, player.position.longitude)
      : null;

  // Don't render if no position
  if (!position) {
    return null;
  }

  // For self player, create a mock player object
  const displayPlayer = isSelf
    ? {
        id: "self",
        name: "You",
        team: "blue" as const,
        isAlive: true,
        statusEffects: [],
        isOnline: true,
        position: {
          latitude: position.lat,
          longitude: position.lng,
          timestamp: new Date(),
        },
        lastSeen: new Date(),
        visibility: "active" as const,
        currentItem: null,
      }
    : player!;

  // Determine opacity based on visibility (only for other players)
  const opacity = isSelf
    ? 1.0
    : displayPlayer.visibility === "active"
      ? 1.0
      : displayPlayer.visibility === "recent"
        ? 0.6
        : 0.3; // dark

  // Calculate time since last seen
  const timeSinceLastSeen = Date.now() - displayPlayer.lastSeen.getTime();
  const minutesAgo = Math.floor(timeSinceLastSeen / 60000);

  // Choose icon based on player state
  const icon = isSelf
    ? selfIcon
    : !displayPlayer.isAlive
      ? deadPlayerIcon
      : otherPlayerIcon;

  return (
    <Marker position={position} opacity={opacity} icon={icon}>
      <Popup>
        <div className="text-sm">
          <div
            className={`font-bold text-base ${isSelf ? "text-blue-600" : ""}`}
          >
            {displayPlayer.name}
          </div>

          {/* Status line */}
          <div className="text-gray-600">
            {displayPlayer.isAlive ? (
              <>
                {displayPlayer.visibility === "active"
                  ? "🟢 Active"
                  : displayPlayer.visibility === "recent"
                    ? "🟡 " + minutesAgo + " min ago"
                    : "⚫ Dark (" + minutesAgo + " min)"}
              </>
            ) : (
              <span className="text-red-600">💀 Dead</span>
            )}
          </div>

          {/* Item indicator */}
          {displayPlayer.currentItem ? (
            <div className="mt-1 text-blue-600">
              🎒 {displayPlayer.currentItem.type.replace("_", " ")}
            </div>
          ) : (
            <div className="mt-1 text-gray-500">🎒 No item</div>
          )}

          {/* Status effects */}
          {displayPlayer.statusEffects.length > 0 && (
            <div className="mt-1">
              {displayPlayer.statusEffects.map((effect, idx) => (
                <span key={idx} className="text-purple-600">
                  {effect.type === "poisoned" ? "☠️ Poisoned" : "🎭 Masked"}
                </span>
              ))}
            </div>
          )}

          {/* Death location indicator */}
          {!displayPlayer.isAlive && displayPlayer.deathPosition && (
            <div className="mt-1 text-xs text-gray-500">Dogtag here</div>
          )}

          {/* Self-specific elements */}
          {isSelf && (
            <>
              <div className="mt-1 text-xs text-gray-500">📍 GPS Active</div>
              <div className="mt-2 pt-2 border-t text-xs text-gray-600">
                Click map to update location
              </div>
            </>
          )}
        </div>
      </Popup>
    </Marker>
  );
}
