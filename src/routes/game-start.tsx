import { useStore as useGameStore } from "../store";

export default function GameStart() {
  const { gameCode } = useGameStore();
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-8">
      <div className="w-full max-w-lg text-center">
        <div className="mb-12">
          <h1 className="text-5xl font-bold text-white mb-6">Mission Briefing</h1>
          
          <div className="bg-blue-900 bg-opacity-50 border-2 border-blue-500 rounded-lg p-8 mb-8">
            <h2 className="text-3xl font-bold text-blue-400 mb-4">BLUE TEAM</h2>
            <p className="text-white text-lg leading-relaxed">
              Complete 5 tasks to secure victory.
              <br />
              Trust no one.
            </p>
          </div>
          
          <div className="space-y-4">
            <p className="text-gray-400">Game starts in</p>
            <p className="text-6xl font-mono text-cyan-400">0:15</p>
          </div>
        </div>
        
        <div className="space-y-4">
          <a 
            href="/game" 
            className="block w-full py-4 px-6 bg-cyan-500 hover:bg-cyan-400 text-gray-900 font-semibold text-lg text-center rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg"
          >
            Begin Mission
          </a>
          
          <a 
            href={gameCode ? `/lobby/${gameCode}` : "/title"} 
            className="block text-gray-400 hover:text-cyan-400 text-sm transition-colors duration-200"
          >
            {gameCode ? "Back to Lobby" : "Back to Home"}
          </a>
        </div>
      </div>
    </div>
  );
}
