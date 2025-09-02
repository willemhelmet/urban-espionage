function App() {
  return (
    <>
      <h1 className="text-3xl font-bold underline">Urban Espionage</h1>
      <ul className="list-disc list-inside">
        <li>
          <a href="/title">Title</a>
        </li>
        <li>
          <a href="/settings">Settings</a>
        </li>
        <li>
          <a href="/lobby">Lobby</a>
        </li>
        <li>
          <a href="/game-start">Game Start</a>
        </li>
        <li>
          <a href="/game">Game</a>
        </li>
        <li>
          <a href="/game-end">Game End</a>
        </li>
      </ul>
    </>
  );
}

export default App;
