import Button from "../components/button.tsx";

export default function GameEnd() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-8">
      <div className="w-full max-w-2xl text-center">
        {/* Victory/Defeat Banner */}
        <div className="mb-12">
          <h1 className="text-6xl font-bold text-cyan-400 mb-4">VICTORY</h1>
          <p className="text-2xl text-white">Blue Team Wins!</p>
        </div>

        {/* Team Reveal */}
        <div className="bg-gray-800 rounded-lg p-6 mb-8">
          <h3 className="text-white font-semibold mb-4">Team Reveal</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="text-blue-400 font-semibold mb-2">Blue Team</h4>
              <div className="space-y-1">
                <p className="text-gray-300">You</p>
                <p className="text-gray-300">Alex Chen</p>
                <p className="text-gray-300">Jordan Lee</p>
              </div>
            </div>
            <div>
              <h4 className="text-red-400 font-semibold mb-2">Red Team</h4>
              <div className="space-y-1">
                <p className="text-gray-300">Taylor Martinez</p>
                <p className="text-gray-300">Morgan Davis</p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="bg-gray-800 rounded-lg p-6 mb-8">
          <h3 className="text-white font-semibold mb-4">Game Stats</h3>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-3xl font-bold text-cyan-400">5</p>
              <p className="text-gray-400 text-sm">Tasks Completed</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-cyan-400">2.3km</p>
              <p className="text-gray-400 text-sm">Distance Traveled</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-cyan-400">23:45</p>
              <p className="text-gray-400 text-sm">Game Duration</p>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="space-y-4">
          <Button variant="primary" href="/title">
            Return to Title
          </Button>
        </div>
      </div>
    </div>
  );
}
