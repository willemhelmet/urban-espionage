import Button from "../components/button.tsx";

export default function Title() {
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
          <Button variant="primary" href="/lobby">
            New Game
          </Button>

          <Button href="/game">Continue</Button>

          <Button href="/settings">Settings</Button>
        </div>
      </div>
    </div>
  );
}
