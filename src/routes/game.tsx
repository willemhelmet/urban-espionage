import Player from "../components/player.tsx";
import Map from "../components/map.tsx";
import Button from "../components/button.tsx";
import { type Player as PlayerType } from "../types";
import { MapControlProvider } from "../contexts/MapControlContext";
import { useMapControl } from "../hooks/useMapControl";

function GameContent() {
  const { recenterMap } = useMapControl();
  // Generate mock players around Brooklyn area
  const mockPlayers: PlayerType[] = [
    {
      id: "player-1",
      name: "Alex Chen",
      team: "blue",
      isAlive: true,
      statusEffects: [],
      isOnline: true,
      position: {
        latitude: 40.664787,
        longitude: -73.967394,
        timestamp: new Date(),
      },
      lastSeen: new Date(),
      visibility: "active",
      currentItem: null,
    },
    {
      id: "player-2",
      name: "Jordan Lee",
      team: "blue",
      isAlive: false,
      statusEffects: [],
      isOnline: false,
      position: {
        latitude: 40.687179,
        longitude: -73.946469,
        timestamp: new Date(),
      },
      lastSeen: new Date(Date.now() - 10 * 60 * 1000), // 10 mins ago
      visibility: "dark",
      currentItem: null,
      deathTime: new Date(Date.now() - 5 * 60 * 1000),
      deathPosition: {
        latitude: 40.687179,
        longitude: -73.946469,
        timestamp: new Date(),
      },
    },
    {
      id: "player-3",
      name: "Taylor Martinez",
      team: "blue",
      isAlive: true,
      statusEffects: [
        {
          type: "poisoned",
          expiresAt: new Date(Date.now() + 5 * 60 * 1000),
          sourcePlayerId: "player-2",
        },
      ],
      isOnline: true,
      position: {
        latitude: 40.68015,
        longitude: -73.97031,
        timestamp: new Date(),
      },
      lastSeen: new Date(),
      visibility: "active",
      currentItem: {
        id: "item-2",
        type: "armor",
        ownerId: "player-4",
      },
    },
    {
      id: "player-4",
      name: "Morgan Davis",
      team: "blue",
      isAlive: true,
      statusEffects: [],
      isOnline: true,
      position: {
        latitude: 40.659231,
        longitude: -73.981683,
        timestamp: new Date(),
      },
      lastSeen: new Date(Date.now() - 4 * 60 * 1000), // 4 mins ago
      visibility: "recent",
      currentItem: {
        id: "item-3",
        type: "invisibility_cloak",
        ownerId: "player-5",
      },
    },
  ];

  return (
    <div className="h-screen bg-gray-900 relative overflow-hidden">
      {/* Map takes full screen */}
      <div className="absolute inset-0">
        <Map>
          {/* Render the current player (you) */}
          <Player isSelf={true} />

          {/* Render all other players */}
          {mockPlayers.map((player) => (
            <Player key={player.id} player={player} />
          ))}
        </Map>
      </div>

      {/* Minimal HUD Overlay */}
      <div className="absolute top-0 left-0 right-0 z-[1000] p-4 pointer-events-none">
        <div className="flex justify-between items-start">
          {/* Left side - Player info */}
          <div className="bg-gray-800 bg-opacity-90 rounded-lg p-3 pointer-events-auto">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-cyan-500 rounded-full flex items-center justify-center">
                <span className="text-gray-900 font-bold">Y</span>
              </div>
              <div>
                <p className="text-white font-semibold">You</p>
                <p className="text-cyan-400 text-xs">Team Blue</p>
              </div>
            </div>
          </div>

          {/* Right side - Game status */}
          <div className="bg-gray-800 bg-opacity-90 rounded-lg p-3 pointer-events-auto">
            <p className="text-gray-400 text-xs">Tasks Completed</p>
            <p className="text-white font-bold text-xl">2 / 5</p>
          </div>
        </div>
      </div>

      {/* Bottom controls */}
      <div className="absolute bottom-0 left-0 right-0 z-[1000] p-4 pointer-events-none">
        <div className="flex justify-between items-end">
          {/* Inventory slot */}
          <div className="bg-gray-800 bg-opacity-90 rounded-lg p-4 pointer-events-auto">
            <p className="text-gray-400 text-xs mb-1">Inventory</p>
            <div className="w-16 h-16 bg-gray-700 rounded-lg border-2 border-gray-600 flex items-center justify-center">
              <span className="text-gray-500">Empty</span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col space-y-2 pointer-events-auto">
            <Button
              variant="small"
              className="bg-cyan-500 hover:bg-cyan-400 text-gray-900"
              onClick={recenterMap}
            >
              Recenter
            </Button>
            <Button variant="small" href="/game-end" className="bg-green-600 hover:bg-green-500">
              End Game (Dev)
            </Button>
            <Button variant="small" href="/title">
              Exit Game
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Game() {
  return (
    <MapControlProvider>
      <GameContent />
    </MapControlProvider>
  );
}
