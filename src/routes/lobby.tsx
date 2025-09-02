import Button from "../components/button.tsx";

export default function Lobby() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-8">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-2">Game Lobby</h1>
          <div className="bg-gray-800 rounded-lg px-6 py-3 inline-block mt-4">
            <p className="text-gray-400 text-sm">Invite Code</p>
            <p className="text-2xl font-mono text-cyan-400">XKCD-4521</p>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-6 mb-6">
          <h3 className="text-white font-semibold mb-4">Players (4/8)</h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
              <span className="text-white">You</span>
              <span className="text-cyan-400 text-sm">Host</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
              <span className="text-white">Player 2</span>
              <span className="text-green-400 text-sm">Ready</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
              <span className="text-white">Player 3</span>
              <span className="text-yellow-400 text-sm">Waiting</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
              <span className="text-white">Player 4</span>
              <span className="text-green-400 text-sm">Ready</span>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <Button variant="primary" href="/game">
            Start Game
          </Button>

          <Button href="/title">Leave Lobby</Button>
        </div>
      </div>
    </div>
  );
}
