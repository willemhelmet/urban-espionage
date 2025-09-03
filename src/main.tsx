import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import App from "./app.tsx";
import ErrorPage from "./routes/error-page.tsx";
import Title from "./routes/title.tsx";
import Settings from "./routes/settings.tsx";
import Lobby from "./routes/lobby.tsx";
import GameStart from "./routes/game-start.tsx";
import Game from "./routes/game.tsx";
import GameEnd from "./routes/game-end.tsx";
import Admin from "./routes/admin.tsx";
import CreateGame from "./routes/createGame.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/title",
    element: <Title />,
  },
  {
    path: "/settings",
    element: <Settings />,
  },
  {
    path: "/lobby/:gameCode",
    element: <Lobby />,
  },
  {
    path: "/game-start",
    element: <GameStart />,
  },
  {
    path: "/game",
    element: <Game />,
  },
  {
    path: "/game-end",
    element: <GameEnd />,
  },
  {
    path: "/admin",
    element: <Admin />,
  },
  {
    path: "/create-game",
    element: <CreateGame />,
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
