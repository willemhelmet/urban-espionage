import Player from "../components/player.tsx";
import Map from "../components/map.tsx";
import { type Player as PlayerType } from "../types";

export default function Game() {
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
    <div className="h-screen flex flex-col">
      <h2 className="text-2xl font-bold underline p-4">Game</h2>
      <div className="flex-1">
        <Map>
          {/* Render the current player (you) */}
          <Player isSelf={true} />

          {/* Render all other players */}
          {mockPlayers.map((player) => (
            <Player key={player.id} player={player} />
          ))}
        </Map>
        <a href="/">Go Back</a>
      </div>
    </div>
  );
}
