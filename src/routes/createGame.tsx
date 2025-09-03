import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import Button from "../components/button";
import { useStore } from "../store";
import type { Coordinates } from "../types";

// Custom home base icon
const homeBaseIcon = L.divIcon({
  html: `
    <div class="relative">
      <div class="absolute -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-cyan-500 rounded-full border-4 border-white shadow-lg animate-pulse flex items-center justify-center">
        <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      </div>
    </div>
  `,
  className: "home-base-marker",
  iconSize: [48, 48],
  iconAnchor: [24, 24],
});

function LocationSelector({
  position,
  onPositionChange,
}: {
  position: Coordinates | null;
  onPositionChange: (pos: Coordinates) => void;
}) {
  const MapEvents = () => {
    useMapEvents({
      click(e) {
        onPositionChange({
          latitude: e.latlng.lat,
          longitude: e.latlng.lng,
        });
      },
    });
    return null;
  };

  return (
    <>
      <MapEvents />
      {position && (
        <Marker
          position={[position.latitude, position.longitude]}
          icon={homeBaseIcon}
        />
      )}
    </>
  );
}

export default function CreateGame() {
  const navigate = useNavigate();
  const { createGame, gameCode } = useStore();

  const [playerName, setPlayerName] = useState("");
  const [homeBase, setHomeBase] = useState<Coordinates | null>(null);
  const [currentLocation, setCurrentLocation] = useState<Coordinates>({
    latitude: 37.7749,
    longitude: -122.4194,
  });

  // Game configuration
  const [maxPlayers, setMaxPlayers] = useState(20);
  const [gameDuration, setGameDuration] = useState(60);
  const [mapRadius, setMapRadius] = useState(1000);
  const [redTeamRatio, setRedTeamRatio] = useState(0.3);
  const [tasksToWin, setTasksToWin] = useState(5);
  const [failuresToLose, setFailuresToLose] = useState(2);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get user's current location
  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          };
          setCurrentLocation(coords);
          setHomeBase(coords); // Default home base to current location
        },
        (error) => {
          console.error("Error getting location:", error);
        },
      );
    }
  }, []);

  const handleCreateGame = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!homeBase) {
      setError("Please select a home base location on the map");
      return;
    }

    if (!playerName.trim()) {
      setError("Please enter your name");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await createGame(homeBase, playerName.trim(), {
        maxPlayers,
        gameDuration,
        mapRadius,
        redTeamRatio,
        tasksToWin,
        failuresToLose,
      });
      // Get the game code from the store after creation
      const store = useStore.getState();
      if (store.gameCode) {
        navigate(`/lobby/${store.gameCode}`);
      } else {
        throw new Error("Failed to get game code");
      }
    } catch (err) {
      console.error("Failed to create game:", err);
      setError(err instanceof Error ? err.message : "Failed to create game");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="max-w-7xl mx-auto p-4">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-white">Create New Game</h1>
          <Button onClick={() => navigate("/title")} variant="secondary">
            Cancel
          </Button>
        </div>

        <form onSubmit={handleCreateGame} className="grid lg:grid-cols-2 gap-6">
          {/* Left Column - Configuration */}
          <div className="space-y-6">
            {/* Player Name */}
            <div className="bg-gray-800 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-white mb-4">
                Host Information
              </h2>
              <div>
                <label
                  htmlFor="playerName"
                  className="block text-sm font-medium text-gray-300 mb-2"
                >
                  Your Name
                </label>
                <input
                  id="playerName"
                  type="text"
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  placeholder="Enter your name"
                  className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400"
                  required
                />
              </div>
            </div>

            {/* Game Settings */}
            <div className="bg-gray-800 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-white mb-4">
                Game Settings
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Max Players: {maxPlayers}
                  </label>
                  <input
                    type="range"
                    min="6"
                    max="30"
                    value={maxPlayers}
                    onChange={(e) => setMaxPlayers(Number(e.target.value))}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Game Duration: {gameDuration} minutes
                  </label>
                  <input
                    type="range"
                    min="15"
                    max="120"
                    step="15"
                    value={gameDuration}
                    onChange={(e) => setGameDuration(Number(e.target.value))}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Map Radius: {mapRadius}m
                  </label>
                  <input
                    type="range"
                    min="500"
                    max="3000"
                    step="100"
                    value={mapRadius}
                    onChange={(e) => setMapRadius(Number(e.target.value))}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Red Team Size: {Math.round(redTeamRatio * 100)}%
                  </label>
                  <input
                    type="range"
                    min="20"
                    max="40"
                    value={redTeamRatio * 100}
                    onChange={(e) =>
                      setRedTeamRatio(Number(e.target.value) / 100)
                    }
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Tasks to Win: {tasksToWin}
                  </label>
                  <input
                    type="range"
                    min="3"
                    max="10"
                    value={tasksToWin}
                    onChange={(e) => setTasksToWin(Number(e.target.value))}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Failures to Lose: {failuresToLose}
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    value={failuresToLose}
                    onChange={(e) => setFailuresToLose(Number(e.target.value))}
                    className="w-full"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Map */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-white mb-4">
              Select Home Base Location
            </h2>
            <p className="text-sm text-gray-400 mb-4">
              Click on the map to set the home base location for your game
            </p>

            <div className="h-[500px] rounded-lg overflow-hidden">
              <MapContainer
                center={[currentLocation.latitude, currentLocation.longitude]}
                zoom={15}
                className="h-full w-full"
              >
                <TileLayer
                  url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                />
                <LocationSelector
                  position={homeBase}
                  onPositionChange={setHomeBase}
                />
              </MapContainer>
            </div>

            {homeBase && (
              <div className="mt-4 text-sm text-gray-400">
                Home Base: {homeBase.latitude.toFixed(6)},{" "}
                {homeBase.longitude.toFixed(6)}
              </div>
            )}
          </div>
        </form>

        {/* Error Message */}
        {error && (
          <div className="mt-6 bg-red-900/50 border border-red-500 text-red-200 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Action Buttons */}
        <div className="mt-6 flex gap-4 justify-end">
          <Button
            onClick={() => navigate("/")}
            variant="secondary"
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleCreateGame}
            variant="primary"
            disabled={isLoading || !playerName || !homeBase}
          >
            {isLoading ? "Creating..." : "Create Game"}
          </Button>
        </div>
      </div>
    </div>
  );
}

