import { create } from "zustand";
import {
  type Game,
  type Player,
  type Coordinates,
  type Zone,
  type Item,
  type Event,
} from "./types";

interface GameState {
  // Current game
  currentGame: Game | null;
  currentPlayer: Player | null;

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
  joinGame: (inviteCode: string) => Promise<void>;
  updatePosition: (position: Coordinates) => void;
  pickupItem: (itemId: string) => Promise<void>;
  useItem: (targetId?: string) => Promise<void>;
  dropItem: () => Promise<void>;
}
export const useStore = create<GameState>((set) => ({
  // Current game
  currentGame: null,
  currentPlayer: null,
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
  joinGame: async (inviteCode: string): Promise<void> => {
    // TODO: Implement API call to join game
    console.log("joining game with code: ", inviteCode);
  },
  updatePosition: (position: Coordinates): void => {
    set({ mapCenter: position });
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
}));
