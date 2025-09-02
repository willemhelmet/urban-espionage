export default function Settings() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-2">Settings</h1>
          <p className="text-gray-400">Configure your experience</p>
        </div>
        
        <div className="space-y-4">
          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-white font-semibold mb-4">Game Settings</h3>
            <div className="space-y-3">
              <label className="flex items-center justify-between">
                <span className="text-gray-300">Sound Effects</span>
                <input type="checkbox" className="w-5 h-5" />
              </label>
              <label className="flex items-center justify-between">
                <span className="text-gray-300">Notifications</span>
                <input type="checkbox" className="w-5 h-5" />
              </label>
              <label className="flex items-center justify-between">
                <span className="text-gray-300">High Accuracy GPS</span>
                <input type="checkbox" className="w-5 h-5" />
              </label>
            </div>
          </div>
          
          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-white font-semibold mb-4">Profile</h3>
            <div className="space-y-3">
              <input 
                type="text" 
                placeholder="Player Name"
                className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>
          </div>
        </div>
        
        <div className="mt-12 text-center">
          <a 
            href="/title" 
            className="text-gray-400 hover:text-cyan-400 text-sm transition-colors duration-200"
          >
            Back to Title
          </a>
        </div>
      </div>
    </div>
  );
}
