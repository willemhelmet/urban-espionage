import api from "./api";
import type { Game, Player, Coordinates } from "../types";

// API-specific interfaces for requests
export interface GameConfigRequest {
  maxPlayers?: number;
  gameDuration?: number;
  mapRadius?: number;
  redTeamRatio?: number;
  tasksToWin?: number;
  failuresToLose?: number;
}

export interface CreateGameData {
  homeBaseLat: number;
  homeBaseLng: number;
  config?: GameConfigRequest;
}

// API response types - these represent what the backend actually sends
export interface GameApiResponse {
  id: string;
  code: string;
  hostId: string;
  status: "lobby" | "active" | "completed";
  homeBaseLat: number;
  homeBaseLng: number;
  mapRadius: number;
  maxPlayers: number;
  gameDuration: number;
  redTeamRatio: number;
  tasksToWin: number;
  failuresToLose: number;
  tasksCompleted: number;
  tasksFailed: number;
  winner?: "blue" | "red";
  createdAt: string;
  startedAt?: string;
  endedAt?: string;
  players?: PlayerApiResponse[];
}

export interface PlayerApiResponse {
  id: string;
  name: string;
  avatarUrl?: string;
  team?: "blue" | "red";
  isAlive: boolean;
  isOnline: boolean;
  visibility: "active" | "recent" | "dark";
  positionLat?: number;
  positionLng?: number;
  joinedAt: string;
}

// Helper functions to transform API responses to domain types
export function mapApiPlayerToPlayer(apiPlayer: PlayerApiResponse): Player {
  const position: Coordinates = {
    latitude: apiPlayer.positionLat || 0,
    longitude: apiPlayer.positionLng || 0,
    timestamp: new Date(),
  };

  return {
    id: apiPlayer.id,
    name: apiPlayer.name,
    avatarUrl: apiPlayer.avatarUrl,
    team: apiPlayer.team || "blue",
    isAlive: apiPlayer.isAlive,
    statusEffects: [],
    isOnline: apiPlayer.isOnline,
    position,
    lastSeen: new Date(),
    visibility: apiPlayer.visibility,
    currentItem: null,
  };
}

export function mapApiGameToGame(apiGame: GameApiResponse): Game {
  return {
    id: apiGame.id,
    code: apiGame.code,
    hostId: apiGame.hostId,
    status: apiGame.status,
    homeBase: {
      id: "home-base",
      type: "home_base",
      position: {
        latitude: apiGame.homeBaseLat,
        longitude: apiGame.homeBaseLng,
        timestamp: new Date(),
      },
      radius: 50, // Default radius
    },
    players: apiGame.players?.map(mapApiPlayerToPlayer) || [],
    tasks: [],
    items: [],
    deployedItems: [],
    config: {
      maxPlayers: apiGame.maxPlayers,
      gameDuration: apiGame.gameDuration,
      mapRadius: apiGame.mapRadius,
      redTeamRatio: apiGame.redTeamRatio,
      winConditions: {
        tasksToWin: apiGame.tasksToWin,
        failuresToLose: apiGame.failuresToLose,
      },
    },
    startTime: apiGame.startedAt ? new Date(apiGame.startedAt) : undefined,
    endTime: apiGame.endedAt ? new Date(apiGame.endedAt) : undefined,
    winner: apiGame.winner,
    stats: {
      tasksCompleted: apiGame.tasksCompleted,
      tasksFailed: apiGame.tasksFailed,
      itemsCollected: {},
      itemsUsed: {},
      kills: {},
      deaths: {},
      distanceTraveled: {},
    },
  };
}

class GameService {
  // Create a new game
  async createGame(data: CreateGameData): Promise<Game> {
    const response = await api.post<GameApiResponse>("/api/games/", {
      home_base_lat: data.homeBaseLat,
      home_base_lng: data.homeBaseLng,
      ...data.config,
    });
    return mapApiGameToGame(response.data);
  }

  // Join a game with code
  async joinGame(
    code: string,
    playerName: string,
  ): Promise<{ game: Game; player: Player }> {
    const response = await api.post<{
      game: GameApiResponse;
      player: PlayerApiResponse;
    }>(`/api/games/${code}/join/`, { name: playerName });
    return {
      game: mapApiGameToGame(response.data.game),
      player: mapApiPlayerToPlayer(response.data.player),
    };
  }

  // Get game details
  async getGame(code: string): Promise<Game> {
    const response = await api.get<GameApiResponse>(`/api/games/${code}/`);
    return mapApiGameToGame(response.data);
  }

  // Get players in game
  async getPlayers(code: string): Promise<Player[]> {
    const response = await api.get<PlayerApiResponse[]>(
      `/api/games/${code}/players/`,
    );
    return response.data.map(mapApiPlayerToPlayer);
  }

  // Start game (host only)
  async startGame(code: string): Promise<Game> {
    const response = await api.post<GameApiResponse>(
      `/api/games/${code}/start/`,
    );
    return mapApiGameToGame(response.data);
  }

  // Leave game
  async leaveGame(code: string): Promise<void> {
    await api.delete(`/api/games/${code}/leave/`);
  }

  // Update player position
  async updatePosition(
    code: string,
    lat: number,
    lng: number,
    accuracy?: number,
  ): Promise<void> {
    await api.post(`/api/games/${code}/position/`, {
      lat,
      lng,
      accuracy,
    });
  }
}

export const gameService = new GameService();

