import { create } from "zustand";
import {
  type Game,
  type Player,
  type Coordinates,
  type Zone,
  type Item,
  type Event,
} from "./types";
import { gameService } from "./services/gameService";
import { wsService } from "./services/websocket";

interface GameState {
  // Current game
  currentGame: Game | null;
  currentPlayer: Player | null;
  gameCode: string | null;
  isHost: boolean;

  // Connection status
  isConnected: boolean;
  connectionError: string | null;

  // Players in lobby
  players: Player[];

  // UI State
  mapCenter: Coordinates;
  selectedPlayer: Player | null;
  selectedZone: Zone | null;

  // Inventory
  currentItem: Item | null;

  // Events feed
  events: Event[];
  unreadEvents: number;

  // Actions
  createGame: (homeBase: Coordinates, playerName: string, config?: {
    maxPlayers?: number;
    gameDuration?: number;
    mapRadius?: number;
    redTeamRatio?: number;
    tasksToWin?: number;
    failuresToLose?: number;
  }) => Promise<void>;
  joinGame: (inviteCode: string, playerName: string) => Promise<void>;
  leaveGame: () => Promise<void>;
  startGame: () => Promise<void>;
  updatePosition: (position: Coordinates) => void;
  pickupItem: (itemId: string) => Promise<void>;
  useItem: (targetId?: string) => Promise<void>;
  dropItem: () => Promise<void>;
  setPlayers: (players: Player[]) => void;
  addEvent: (event: Event) => void;
  setConnectionStatus: (isConnected: boolean, error?: string) => void;
}
export const useStore = create<GameState>((set, get) => ({
  // Current game
  currentGame: null,
  currentPlayer: null,
  gameCode: null,
  isHost: false,
  
  // Connection status
  isConnected: false,
  connectionError: null,
  
  // Players in lobby
  players: [],
  
  // UI State
  mapCenter: { latitude: 0, longitude: 0, timestamp: new Date() },
  selectedPlayer: null,
  selectedZone: null,
  
  // Inventory
  currentItem: null,
  
  // Events feed
  events: [],
  unreadEvents: 0,

  // Actions
  createGame: async (homeBase: Coordinates, playerName: string, config?: {
    maxPlayers?: number;
    gameDuration?: number;
    mapRadius?: number;
    redTeamRatio?: number;
    tasksToWin?: number;
    failuresToLose?: number;
  }): Promise<void> => {
    try {
      set({ connectionError: null });
      
      // Create game on backend (this also creates the host player)
      const game = await gameService.createGame({
        homeBaseLat: homeBase.latitude,
        homeBaseLng: homeBase.longitude,
        hostName: playerName,
        config,
      });
      
      // The backend creates the host player when creating the game
      const hostPlayer = game.players[0];
      
      // Update store first (so we can navigate even if WebSocket fails)
      set({
        currentGame: game,
        currentPlayer: hostPlayer,
        gameCode: game.code,
        isHost: true,
        players: game.players,
        isConnected: false, // Will be true if WebSocket connects
      });
      
      // Try to connect WebSocket (non-blocking)
      wsService.connect(game.code, hostPlayer.id)
        .then(() => {
          console.log("WebSocket connected successfully");
          set({ isConnected: true });
        })
        .catch((error) => {
          console.error("WebSocket connection failed:", error);
          // Game creation still succeeds, just without real-time updates
          set({ 
            connectionError: "Real-time updates unavailable. You can still play the game.",
            isConnected: false 
          });
        });
      
      // Listen for player updates
      wsService.on('player_joined', (event) => {
        const currentPlayers = get().players;
        if (event.player && !currentPlayers.find(p => p.id === event.player!.id)) {
          set({ players: [...currentPlayers, event.player] });
        }
      });
      
      wsService.on('player_left', (event) => {
        const currentPlayers = get().players;
        set({ players: currentPlayers.filter(p => p.id !== event.player?.id) });
      });
    } catch (error) {
      console.error('Failed to create game:', error);
      set({ connectionError: 'Failed to create game. Please try again.' });
      throw error;
    }
  },
  
  joinGame: async (inviteCode: string, playerName: string): Promise<void> => {
    try {
      set({ connectionError: null });
      
      // Join game on backend
      const { game, player } = await gameService.joinGame(inviteCode, playerName);
      
      // Get current players
      const players = await gameService.getPlayers(inviteCode);
      
      // Connect WebSocket
      await wsService.connect(inviteCode, player.id);
      
      // Update store
      set({
        currentGame: game,
        currentPlayer: player,
        gameCode: inviteCode,
        isHost: false,
        players: players,
        isConnected: true,
      });
      
      // Listen for updates
      wsService.on('player_joined', (event) => {
        const currentPlayers = get().players;
        if (event.player && !currentPlayers.find(p => p.id === event.player!.id)) {
          set({ players: [...currentPlayers, event.player] });
        }
      });
      
      wsService.on('player_left', (event) => {
        const currentPlayers = get().players;
        set({ players: currentPlayers.filter(p => p.id !== event.player?.id) });
      });
      
      wsService.on('game_started', () => {
        set((state) => ({
          currentGame: state.currentGame ? { ...state.currentGame, status: 'active' } : null,
        }));
      });
    } catch (error: any) {
      console.error('Failed to join game:', error);
      // Extract error message from backend response if available
      const errorMessage = error?.response?.data?.detail || 
                         error?.response?.data?.error || 
                         error?.response?.data?.message ||
                         'Failed to join game. Check the code and try again.';
      set({ connectionError: errorMessage });
      throw error;
    }
  },
  
  leaveGame: async (): Promise<void> => {
    const gameCode = get().gameCode;
    if (gameCode) {
      try {
        await gameService.leaveGame(gameCode);
        wsService.disconnect();
        set({
          currentGame: null,
          currentPlayer: null,
          gameCode: null,
          isHost: false,
          players: [],
          isConnected: false,
          events: [],
        });
      } catch (error) {
        console.error('Failed to leave game:', error);
      }
    }
  },
  
  startGame: async (): Promise<void> => {
    const gameCode = get().gameCode;
    const isHost = get().isHost;
    
    if (!gameCode || !isHost) {
      throw new Error('Only the host can start the game');
    }
    
    try {
      const game = await gameService.startGame(gameCode);
      set({ currentGame: game });
    } catch (error) {
      console.error('Failed to start game:', error);
      throw error;
    }
  },
  
  updatePosition: (position: Coordinates): void => {
    const gameCode = get().gameCode;
    set({ mapCenter: position });
    
    // Update position on backend if in game
    if (gameCode && wsService.isConnected()) {
      wsService.updatePosition(position.latitude, position.longitude, position.accuracy);
    }
  },
  
  pickupItem: async (itemId: string): Promise<void> => {
    // TODO: Implement API call to pickup item
    console.log("Picking up item:", itemId);
  },
  
  useItem: async (targetId?: string) => {
    // TODO: Implement API call to use item
    console.log("Using item on target:", targetId);
  },
  
  dropItem: async () => {
    // TODO: Implement API call to drop item
    set({ currentItem: null });
  },
  
  setPlayers: (players: Player[]) => {
    set({ players });
  },
  
  addEvent: (event: Event) => {
    set((state) => ({
      events: [...state.events, event],
      unreadEvents: state.unreadEvents + 1,
    }));
  },
  
  setConnectionStatus: (isConnected: boolean, error?: string) => {
    set({ isConnected, connectionError: error || null });
  },
}));
