import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/button.tsx";
import JoinGameModal from "../components/JoinGameModal.tsx";
import { useStore } from "../store.ts";

export default function Title() {
  const navigate = useNavigate();
  const { joinGame, gameCode } = useStore();
  
  const [showJoinGameModal, setShowJoinGameModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleJoinGame = async (code: string, playerName: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      await joinGame(code, playerName);
      setShowJoinGameModal(false);
      navigate(`/lobby/${code}`);
    } catch (err) {
      console.error("Failed to join game:", err);
      if (err instanceof Error) {
        if (err.message.includes("404")) {
          setError("Game not found. Please check the code and try again.");
        } else if (err.message.includes("400")) {
          setError("Invalid game code or game is full.");
        } else {
          setError(err.message);
        }
      } else {
        setError("Failed to join game. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-16">
          <h1 className="text-6xl font-bold text-white mb-2 tracking-tight">
            URBAN
          </h1>
          <h2 className="text-5xl font-light text-cyan-400 tracking-wider">
            ESPIONAGE
          </h2>
        </div>

        <div className="space-y-4">
          <Button 
            variant="primary" 
            onClick={() => navigate("/create-game")}
          >
            New Game
          </Button>

          <Button onClick={() => setShowJoinGameModal(true)}>
            Join Game
          </Button>

          {gameCode && (
            <Button href={`/lobby/${gameCode}`}>Continue</Button>
          )}

          <Button href="/settings">Settings</Button>
        </div>
      </div>

      {/* New Game Modal removed - now using dedicated create game screen */}

      <JoinGameModal
        isOpen={showJoinGameModal}
        onClose={() => {
          setShowJoinGameModal(false);
          setError(null);
        }}
        onJoin={handleJoinGame}
        isLoading={isLoading}
        error={error}
      />
    </div>
  );
}
