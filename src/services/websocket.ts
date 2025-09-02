import { io, Socket } from "socket.io-client";
import type { Player, Game } from "../types";
import type { PlayerApiResponse, GameApiResponse } from "./gameService";
import { mapApiPlayerToPlayer, mapApiGameToGame } from "./gameService";

const WS_URL = import.meta.env.VITE_WS_URL || "wss://urban-espionage.rcdis.co";

export interface GameEvent {
  type:
    | "player_joined"
    | "player_left"
    | "game_started"
    | "player_moved"
    | "player_updated";
  player?: Player;
  game?: Game;
  data?: Record<string, unknown>;
  message?: string;
  timestamp: string;
}

interface WebSocketEventData {
  player?: PlayerApiResponse;
  game?: GameApiResponse;
  [key: string]: unknown;
}

class WebSocketService {
  private socket: Socket | null = null;
  private gameCode: string | null = null;
  private eventHandlers: Map<string, Set<(event: GameEvent) => void>> =
    new Map();

  connect(gameCode: string, playerId?: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.socket?.connected && this.gameCode === gameCode) {
        resolve();
        return;
      }

      this.disconnect();
      this.gameCode = gameCode;

      this.socket = io(WS_URL, {
        path: "/ws/socket.io/",
        transports: ["websocket"],
        query: {
          game_code: gameCode,
          player_id: playerId,
        },
      });

      this.socket.on("connect", () => {
        console.log("WebSocket connected");
        this.socket?.emit("join_game", { code: gameCode });
        resolve();
      });

      this.socket.on("connect_error", (error) => {
        console.error("WebSocket connection error:", error);
        reject(error);
      });

      // Handle game events
      this.socket.on("game_event", (event: GameEvent) => {
        this.notifyHandlers(event.type, event);
      });

      this.socket.on("player_joined", (data: WebSocketEventData) => {
        if (data.player) {
          const player = mapApiPlayerToPlayer(data.player);
          this.notifyHandlers("player_joined", {
            type: "player_joined",
            player,
            message: `${player.name} joined the game`,
            timestamp: new Date().toISOString(),
          });
        }
      });

      this.socket.on("player_left", (data: WebSocketEventData) => {
        if (data.player) {
          const player = mapApiPlayerToPlayer(data.player);
          this.notifyHandlers("player_left", {
            type: "player_left",
            player,
            message: `${player.name} left the game`,
            timestamp: new Date().toISOString(),
          });
        }
      });

      this.socket.on("game_started", (data: WebSocketEventData) => {
        if (data.game) {
          const game = mapApiGameToGame(data.game);
          this.notifyHandlers("game_started", {
            type: "game_started",
            game,
            message: "Game has started!",
            timestamp: new Date().toISOString(),
          });
        }
      });

      this.socket.on("player_moved", (data: WebSocketEventData) => {
        if (data.player) {
          const player = mapApiPlayerToPlayer(data.player);
          this.notifyHandlers("player_moved", {
            type: "player_moved",
            player,
            timestamp: new Date().toISOString(),
          });
        }
      });
    });
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.gameCode = null;
    }
  }

  // Subscribe to specific event types
  on(eventType: string, handler: (event: GameEvent) => void): () => void {
    if (!this.eventHandlers.has(eventType)) {
      this.eventHandlers.set(eventType, new Set());
    }
    this.eventHandlers.get(eventType)!.add(handler);

    // Return unsubscribe function
    return () => {
      this.eventHandlers.get(eventType)?.delete(handler);
    };
  }

  // Emit events to the server
  emit(event: string, data: Record<string, unknown>): void {
    if (this.socket?.connected) {
      this.socket.emit(event, data);
    } else {
      console.warn("WebSocket not connected, cannot emit event:", event);
    }
  }

  // Update player position
  updatePosition(lat: number, lng: number, accuracy?: number): void {
    this.emit("update_position", {
      gameCode: this.gameCode,
      lat,
      lng,
      accuracy,
      appState: "active",
    });
  }

  // Notify all handlers for a specific event type
  private notifyHandlers(eventType: string, event: GameEvent): void {
    this.eventHandlers.get(eventType)?.forEach((handler) => handler(event));
  }

  isConnected(): boolean {
    return this.socket?.connected ?? false;
  }
}

export const wsService = new WebSocketService();

