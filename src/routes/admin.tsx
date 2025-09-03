import { useState, useEffect } from "react";
import api from "../services/api";
import type { GameApiResponse } from "../services/gameService";
import Button from "../components/button";

export default function Admin() {
  const [games, setGames] = useState<GameApiResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchGames = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get<{
        count: number;
        next: string | null;
        previous: string | null;
        results: GameApiResponse[];
      }>("/api/games/");
      setGames(response.data.results);
    } catch (err) {
      console.error("Failed to fetch games:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch games");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGames();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">Active Games</h1>
          <div className="flex gap-4">
            <Button variant="small" onClick={fetchGames}>
              Refresh
            </Button>
            <Button variant="small" href="/">
              Back to Home
            </Button>
          </div>
        </div>

        {loading && (
          <div className="text-center text-gray-400 py-8">Loading games...</div>
        )}

        {error && (
          <div className="bg-red-900/50 border border-red-500 text-red-200 px-4 py-3 rounded-lg mb-4">
            Error: {error}
          </div>
        )}

        {!loading && !error && games.length === 0 && (
          <div className="text-center text-gray-400 py-8">No active games</div>
        )}

        {!loading && games.length > 0 && (
          <div className="grid gap-4">
            {games.map((game) => (
              <div key={game.id} className="bg-gray-800 rounded-lg p-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-gray-400 text-sm">Code</p>
                    <p className="text-xl font-mono text-cyan-400">
                      {game.code}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Status</p>
                    <p className="text-white capitalize">{game.status}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Players</p>
                    <p className="text-white">
                      {game.players?.length || 0} / {game.maxPlayers}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Created</p>
                    <p className="text-white text-sm">
                      {new Date(game.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>

                {game.players && game.players.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-gray-700">
                    <p className="text-gray-400 text-sm mb-2">Players:</p>
                    <div className="flex flex-wrap gap-2">
                      {game.players.map((player) => (
                        <span
                          key={player.id}
                          className="px-3 py-1 bg-gray-700 rounded-full text-sm text-white"
                        >
                          {player.name}
                          {player.id === game.hostId && (
                            <span className="text-cyan-400 ml-1">(Host)</span>
                          )}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

