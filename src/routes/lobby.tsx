import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Button from "../components/button.tsx";
import { useStore as useGameStore } from "../store.ts";
import { gameService, type GameApiResponse } from "../services/gameService.ts";
import { wsService } from "../services/websocket.ts";

export default function Lobby() {
  const { gameCode } = useParams();
  const navigate = useNavigate();
  const { currentPlayer, isHost } = useGameStore();
  
  const [game, setGame] = useState<GameApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [wsConnected, setWsConnected] = useState(false);
  const [startingGame, setStartingGame] = useState(false);

  // Fetch game data
  const fetchGame = async () => {
    if (!gameCode) {
      setError("No game code provided");
      setLoading(false);
      return;
    }

    try {
      const gameData = await gameService.getGame(gameCode);
      setGame(gameData);
      setError(null);
    } catch (err) {
      console.error("Failed to fetch game:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch game");
    } finally {
      setLoading(false);
    }
  };

  // Set up WebSocket connection and listeners
  useEffect(() => {
    if (!gameCode || !currentPlayer?.id) return;

    // Connect to WebSocket
    wsService.connect(gameCode, currentPlayer.id)
      .then(() => {
        setWsConnected(true);
        console.log("WebSocket connected for lobby");
      })
      .catch((err) => {
        console.error("WebSocket connection failed:", err);
        // Continue without WebSocket - will use polling
      });

    // Set up WebSocket event listeners
    const unsubscribeJoined = wsService.on("player_joined", () => {
      fetchGame(); // Refresh when player joins
    });

    const unsubscribeLeft = wsService.on("player_left", () => {
      fetchGame(); // Refresh when player leaves
    });

    const unsubscribeStarted = wsService.on("game_started", () => {
      navigate("/game"); // Navigate to game when started
    });

    // Initial fetch
    fetchGame();

    // Polling fallback if WebSocket not connected
    const pollInterval = !wsConnected ? setInterval(fetchGame, 3000) : null;

    return () => {
      unsubscribeJoined();
      unsubscribeLeft();
      unsubscribeStarted();
      if (pollInterval) clearInterval(pollInterval);
      wsService.disconnect();
    };
  }, [gameCode, currentPlayer?.id, wsConnected, navigate]);

  const handleStartGame = async () => {
    if (!gameCode || !isHost || startingGame) return;
    
    setStartingGame(true);
    setError(null);
    
    try {
      await gameService.startGame(gameCode);
      // Don't navigate immediately - wait for WebSocket event
      // The game_started event will trigger navigation for all players
    } catch (err) {
      console.error("Failed to start game:", err);
      setError(err instanceof Error ? err.message : "Failed to start game");
      setStartingGame(false);
    }
  };

  const handleLeaveGame = async () => {
    if (!gameCode || !currentPlayer?.id) return;

    try {
      await gameService.leaveGame(gameCode, currentPlayer.id);
      navigate("/title");
    } catch (err) {
      console.error("Failed to leave game:", err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading game...</div>
      </div>
    );
  }

  if (error || !game) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-8">
        <div className="text-center">
          <div className="bg-red-900/50 border border-red-500 text-red-200 px-6 py-4 rounded-lg mb-4">
            {error || "Game not found"}
          </div>
          <Button href="/title">Back to Home</Button>
        </div>
      </div>
    );
  }

  const playerCount = game.players?.length || 0;
  const maxPlayers = game.maxPlayers || 12;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-8">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-2">Game Lobby</h1>
          <div className="bg-gray-800 rounded-lg px-6 py-3 inline-block mt-4">
            <p className="text-gray-400 text-sm">Invite Code</p>
            <p className="text-2xl font-mono text-cyan-400">{game.code}</p>
          </div>
          {!wsConnected && (
            <p className="text-yellow-400 text-sm mt-2">
              Live updates unavailable - refreshing every 3 seconds
            </p>
          )}
        </div>

        <div className="bg-gray-800 rounded-lg p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-white font-semibold">
              Players ({playerCount}/{maxPlayers})
            </h3>
            <span className={`text-sm px-2 py-1 rounded ${
              game.status === 'lobby' ? 'bg-yellow-600 text-yellow-100' :
              game.status === 'active' ? 'bg-green-600 text-green-100' :
              'bg-gray-600 text-gray-100'
            }`}>
              {game.status.replace('_', ' ').toUpperCase()}
            </span>
          </div>
          
          <div className="space-y-2">
            {game.players?.map((player) => (
              <div 
                key={player.id} 
                className="flex items-center justify-between p-3 bg-gray-700 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <span className="text-white">
                    {player.name}
                    {player.id === currentPlayer?.id && " (You)"}
                  </span>
                  {player.isOnline && (
                    <span className="w-2 h-2 bg-green-400 rounded-full" title="Online" />
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {player.id === game.hostId && (
                    <span className="text-cyan-400 text-sm">Host</span>
                  )}
                  <span className={`text-sm ${
                    player.isOnline ? 'text-green-400' : 'text-gray-400'
                  }`}>
                    {player.isOnline ? 'READY' : 'OFFLINE'}
                  </span>
                </div>
              </div>
            ))}
            
            {playerCount === 0 && (
              <div className="text-center text-gray-400 py-4">
                No players in lobby yet
              </div>
            )}
          </div>
        </div>

        <div className="space-y-4">
          {isHost && game.status === 'lobby' && (
            <Button 
              variant="primary" 
              onClick={handleStartGame}
              disabled={playerCount < 2 || startingGame}
            >
              {startingGame ? "Starting..." : 
               playerCount < 2 ? "Need at least 2 players" : "Start Game"}
            </Button>
          )}

          {!isHost && game.status === 'lobby' && (
            <div className="text-center text-gray-400 py-4">
              Waiting for host to start the game...
            </div>
          )}

          <Button onClick={handleLeaveGame}>Leave Lobby</Button>
        </div>
      </div>
    </div>
  );
}
