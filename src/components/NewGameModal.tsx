import { useState } from "react";
import Button from "./button";

interface NewGameModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (playerName: string) => Promise<void>;
  isLoading?: boolean;
  error?: string | null;
}

export default function NewGameModal({
  isOpen,
  onClose,
  onCreate,
  isLoading = false,
  error = null,
}: NewGameModalProps) {
  const [playerName, setPlayerName] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (playerName.trim()) {
      await onCreate(playerName.trim());
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md">
        <h2 className="text-2xl font-bold text-white mb-4">Create New Game</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="hostName" className="block text-sm font-medium text-gray-300 mb-2">
              Your Name
            </label>
            <input
              id="hostName"
              type="text"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              placeholder="Enter your name"
              className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400"
              disabled={isLoading}
              required
              autoFocus
            />
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
              disabled={isLoading || !playerName.trim()}
              className="flex-1"
            >
              {isLoading ? "Creating..." : "Create Game"}
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