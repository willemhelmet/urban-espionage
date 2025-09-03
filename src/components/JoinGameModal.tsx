import { useState } from "react";
import Button from "./button";

interface JoinGameModalProps {
  isOpen: boolean;
  onClose: () => void;
  onJoin: (code: string, playerName: string) => Promise<void>;
  isLoading?: boolean;
  error?: string | null;
}

export default function JoinGameModal({
  isOpen,
  onClose,
  onJoin,
  isLoading = false,
  error = null,
}: JoinGameModalProps) {
  const [gameCode, setGameCode] = useState("");
  const [playerName, setPlayerName] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (gameCode.length === 6 && playerName.trim()) {
      await onJoin(gameCode.toUpperCase(), playerName.trim());
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md">
        <h2 className="text-2xl font-bold text-white mb-4">Join Game</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="playerName" className="block text-sm font-medium text-gray-300 mb-2">
              Your Name
            </label>
            <input
              id="playerName"
              type="text"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              placeholder="Enter your name"
              className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400"
              disabled={isLoading}
              required
            />
          </div>

          <div>
            <label htmlFor="gameCode" className="block text-sm font-medium text-gray-300 mb-2">
              Game Code
            </label>
            <input
              id="gameCode"
              type="text"
              value={gameCode}
              onChange={(e) => setGameCode(e.target.value.toUpperCase().slice(0, 6))}
              placeholder="XXXXXX"
              className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg font-mono text-xl tracking-wider focus:outline-none focus:ring-2 focus:ring-cyan-400"
              disabled={isLoading}
              pattern="[A-Z0-9]{6}"
              maxLength={6}
              required
            />
            <p className="text-xs text-gray-400 mt-1">Enter the 6-character game code</p>
          </div>

          {error && (
            <div className="bg-red-900/50 border border-red-500 text-red-200 px-4 py-2 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <Button
              type="submit"
              variant="primary"
              disabled={isLoading || gameCode.length !== 6 || !playerName.trim()}
              className="flex-1"
            >
              {isLoading ? "Joining..." : "Join Game"}
            </Button>
            <Button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}