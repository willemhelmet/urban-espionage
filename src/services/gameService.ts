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
  hostName: string;
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
      homeBaseLat: data.homeBaseLat,
      homeBaseLng: data.homeBaseLng,
      hostName: data.hostName,
      maxPlayers: data.config?.maxPlayers || 20,
      gameDuration: data.config?.gameDuration || 60,
      mapRadius: data.config?.mapRadius || 1000,
      redTeamRatio: data.config?.redTeamRatio || 0.3,
      tasksToWin: data.config?.tasksToWin || 5,
      failuresToLose: data.config?.failuresToLose || 2,
    });
    return mapApiGameToGame(response.data);
  }

  // Join a game with code
  async joinGame(
    code: string,
    playerName: string,
  ): Promise<{ game: Game; player: Player }> {
    // Join the game (returns player)
    const playerResponse = await api.post<PlayerApiResponse>(
      `/api/games/${code}/join/`, 
      { player_name: playerName }
    );
    
    // Get the full game details
    const gameResponse = await api.get<GameApiResponse>(`/api/games/${code}/`);
    
    return {
      game: mapApiGameToGame(gameResponse.data),
      player: mapApiPlayerToPlayer(playerResponse.data),
    };
  }

  // Get game details (returns domain model)
  async getGame(code: string): Promise<GameApiResponse> {
    const response = await api.get<GameApiResponse>(`/api/games/${code}/`);
    return response.data;
  }

  // Get game details mapped to domain model
  async getGameMapped(code: string): Promise<Game> {
    const response = await api.get<GameApiResponse>(`/api/games/${code}/`);
    return mapApiGameToGame(response.data);
  }

  // Get players in game (they're included in the game response)
  async getPlayers(code: string): Promise<Player[]> {
    const response = await api.get<GameApiResponse>(`/api/games/${code}/`);
    return response.data.players.map(mapApiPlayerToPlayer);
  }

  // Start game (host only)
  async startGame(code: string): Promise<Game> {
    const response = await api.post<GameApiResponse>(
      `/api/games/${code}/start/`,
    );
    return mapApiGameToGame(response.data);
  }

  // Leave game
  async leaveGame(code: string, playerId: string): Promise<void> {
    await api.post(`/api/games/${code}/leave/`, { player_id: playerId });
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

  // Get all games (admin/debug)
  async getAllGames(): Promise<Game[]> {
    const response = await api.get<GameApiResponse[]>("/api/games/");
    return response.data.map(mapApiGameToGame);
  }
}

export const gameService = new GameService();

