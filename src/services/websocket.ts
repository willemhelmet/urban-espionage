import type { Player, Game } from "../types";
import type { PlayerApiResponse, GameApiResponse } from "./gameService";
import { mapApiPlayerToPlayer, mapApiGameToGame } from "./gameService";

// Auto-detect environment and use appropriate WebSocket URL
const getWebSocketUrl = () => {
  // If explicitly set in environment, use that
  if (import.meta.env.VITE_WS_URL) {
    return import.meta.env.VITE_WS_URL;
  }
  
  // Check if running locally
  const hostname = window.location.hostname;
  if (hostname === 'localhost' || hostname === '127.0.0.1' || hostname.startsWith('192.168')) {
    return 'ws://localhost:8001';
  }
  
  // Production URL
  return 'wss://urban-espionage.rcdis.co';
};

const WS_URL = getWebSocketUrl();

export interface GameEvent {
  type:
    | "player_joined"
    | "player_left"
    | "game_started"
    | "player_moved"
    | "player_updated"
    | "player_online"
    | "player_offline";
  player?: Player;
  playerId?: string;
  game?: Game;
  data?: Record<string, unknown>;
  message?: string;
  timestamp: string;
}

interface WebSocketEventData {
  type: string;
  player?: PlayerApiResponse;
  game?: GameApiResponse;
  [key: string]: unknown;
}

class WebSocketService {
  private socket: WebSocket | null = null;
  private gameCode: string | null = null;
  private playerId: string | null = null;
  private eventHandlers: Map<string, Set<(event: GameEvent) => void>> =
    new Map();
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;

  connect(gameCode: string, playerId?: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.socket?.readyState === WebSocket.OPEN && this.gameCode === gameCode) {
        resolve();
        return;
      }

      this.disconnect();
      this.gameCode = gameCode;
      this.playerId = playerId || null;

      // Django Channels WebSocket URL format: wss://domain/ws/game/<game_code>/
      // Django requires trailing slash for WebSocket URLs
      const wsUrl = `${WS_URL}/ws/game/${gameCode}/`;
      console.log("Connecting to WebSocket:", wsUrl);

      try {
        this.socket = new WebSocket(wsUrl);

        this.socket.onopen = () => {
          console.log("WebSocket connected");
          this.reconnectAttempts = 0;
          
          // Send initial authentication message (Django backend expects "authenticate")
          if (playerId) {
            this.send({
              type: "authenticate",
              player_id: playerId,
            });
          }
          
          resolve();
        };

        this.socket.onerror = (error) => {
          console.error("WebSocket connection error:", error);
          reject(new Error("WebSocket connection failed"));
        };

        this.socket.onclose = (event) => {
          console.log("WebSocket closed:", event.code, event.reason);
          
          // Attempt to reconnect if not intentionally closed
          if (event.code !== 1000 && this.reconnectAttempts < this.maxReconnectAttempts) {
            this.attemptReconnect();
          }
        };

        this.socket.onmessage = (event) => {
          try {
            const data: WebSocketEventData = JSON.parse(event.data);
            this.handleMessage(data);
          } catch (error) {
            console.error("Failed to parse WebSocket message:", error);
          }
        };
      } catch (error) {
        console.error("Failed to create WebSocket:", error);
        reject(error);
      }
    });
  }

  private attemptReconnect(): void {
    this.reconnectAttempts++;
    console.log(`Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})...`);
    
    setTimeout(() => {
      if (this.gameCode && this.playerId) {
        this.connect(this.gameCode, this.playerId).catch((error) => {
          console.error("Reconnection failed:", error);
        });
      }
    }, this.reconnectDelay * this.reconnectAttempts);
  }

  private handleMessage(data: WebSocketEventData): void {
    const { type, player, game, ...rest } = data;
    
    switch (type) {
      case "player_joined":
        if (player) {
          const mappedPlayer = mapApiPlayerToPlayer(player);
          this.notifyHandlers("player_joined", {
            type: "player_joined",
            player: mappedPlayer,
            message: `${mappedPlayer.name} joined the game`,
            timestamp: new Date().toISOString(),
          });
        }
        break;
        
      case "player_left":
        // Backend sends player_id, not full player object
        this.notifyHandlers("player_left", {
          type: "player_left",
          playerId: data.player_id as string,
          timestamp: new Date().toISOString(),
        });
        break;
        
      case "game_started":
        if (game) {
          const mappedGame = mapApiGameToGame(game);
          this.notifyHandlers("game_started", {
            type: "game_started",
            game: mappedGame,
            message: "Game has started!",
            timestamp: new Date().toISOString(),
          });
        }
        break;
        
      case "player_moved":
        if (player) {
          const mappedPlayer = mapApiPlayerToPlayer(player);
          this.notifyHandlers("player_moved", {
            type: "player_moved",
            player: mappedPlayer,
            timestamp: new Date().toISOString(),
          });
        }
        break;
        
      case "player_updated":
        if (player) {
          const mappedPlayer = mapApiPlayerToPlayer(player);
          this.notifyHandlers("player_updated", {
            type: "player_updated",
            player: mappedPlayer,
            timestamp: new Date().toISOString(),
          });
        }
        break;
        
      case "player_online":
        this.notifyHandlers("player_online", {
          type: "player_online",
          playerId: data.player_id as string,
          timestamp: new Date().toISOString(),
        });
        break;
        
      case "player_offline":
        this.notifyHandlers("player_offline", {
          type: "player_offline",
          playerId: data.player_id as string,
          timestamp: new Date().toISOString(),
        });
        break;
        
      default:
        console.log("Unhandled WebSocket message type:", type, rest);
    }
  }

  disconnect(): void {
    if (this.socket) {
      // Close with code 1000 (normal closure) to prevent reconnection attempts
      this.socket.close(1000, "Client disconnect");
      this.socket = null;
      this.gameCode = null;
      this.playerId = null;
      this.reconnectAttempts = 0;
    }
  }

  // Send data through WebSocket
  send(data: Record<string, unknown>): void {
    if (this.socket?.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(data));
    } else {
      console.warn("WebSocket not connected, cannot send:", data);
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

  // Emit events to the server (compatibility wrapper for send)
  emit(event: string, data: Record<string, unknown>): void {
    this.send({
      type: event,
      ...data,
    });
  }

  // Update player position
  updatePosition(lat: number, lng: number, accuracy?: number): void {
    this.send({
      type: "position_update",
      lat,
      lng,
      accuracy,
    });
  }

  // Notify all handlers for a specific event type
  private notifyHandlers(eventType: string, event: GameEvent): void {
    this.eventHandlers.get(eventType)?.forEach((handler) => handler(event));
  }

  isConnected(): boolean {
    return this.socket?.readyState === WebSocket.OPEN;
  }
}

export const wsService = new WebSocketService();