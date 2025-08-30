export interface Player {
  id: string;
  name: string;
  avatarUrl?: string;
  team: "blue" | "red";
  isAlive: boolean;
  statusEffects: StatusEffect[];
  isOnline: boolean;
  position: Coordinates;
  lastSeen: Date; // When position was last updated
  visibility: "active" | "recent" | "dark"; // active: <2min, recent: 2-5min, dark: >5min; invisibility cloak prevents 'active'
  currentItem: Item | null; // Single inventory slot
  deathTime?: Date;
  deathPosition?: Coordinates; // Where player died (for dogtag location)
}

export interface Coordinates {
  latitude: number;
  longitude: number;
  accuracy?: number;
  timestamp: Date;
}

export interface Zone {
  id: string;
  type: "home_base" | "task" | "item_spawn" | "reviver" | "emp_field";
  position: Coordinates;
  radius: number; // in meters
  metadata?: ZoneMetadata;
}

export interface ZoneMetadata {
  createdBy?: string; // for EMP fields
  expiresAt?: Date; // for temporary zones like EMP fields
}

export type ItemType =
  | "emp"
  | "camera"
  | "time_bomb"
  | "land_mine"
  | "dagger"
  | "mask"
  | "armor"
  | "invisibility_cloak"
  | "poison"
  | "motion_sensor"
  | "decoy"
  | "dogtag";

export interface Item {
  id: string;
  type: ItemType;
  ownerId?: string;
  usedAt?: Date;
  metadata?: ItemMetadata;
}

export interface ItemMetadata {
  targetPlayerId?: string; // for mask
  detonationTime?: Date; // for time_bomb
  triggerRadius?: number; // for land_mine, motion_sensor
  duration?: number; // for temporary effects
  dogtagOwnerId?: string; // for dogtag - whose dogtag this is
}

export interface ItemSpawn {
  id: string;
  type: ItemType;
  position: Coordinates;
  pickupRadius: number; // in meters
  available: boolean;
  collectedBy?: string;
  collectedAt?: Date;
  droppedBy?: string; // for player-dropped items (including death drops)
}

export interface DeployedItem {
  id: string;
  type: ItemType;
  position: Coordinates;
  deployedBy: string;
  deployedAt: Date;
  active: boolean;
  metadata?: ItemMetadata;
}

export interface StatusEffect {
  type: "poisoned" | "masked";
  expiresAt: Date;
  sourcePlayerId?: string; // who applied the effect
}

export interface Task {
  id: string;
  type:
    | "capture_intel"
    | "defuse_bomb"
    | "capture_objective"
    | "password_chain";
  zoneIds: string[];
  status: "pending" | "in_progress" | "completed" | "failed";
  participatingPlayers: string[]; // players currently working on this task
  progress: number; // 0-100
  metadata?: TaskMetadata;
}

export interface TaskMetadata {
  passwordFragments?: string[];
  bombCode?: string;
  briefcaseId?: string;
  timeLimit?: number;
}

export interface Game {
  id: string;
  hostId: string;
  status: "lobby" | "active" | "completed";
  homeBase: Zone;
  players: Player[];
  tasks: Task[];
  items: ItemSpawn[];
  deployedItems: DeployedItem[];
  config: GameConfig;
  startTime?: Date;
  endTime?: Date;
  winner?: "blue" | "red";
  stats?: GameStats;
}

export interface GameConfig {
  maxPlayers: number;
  gameDuration: number; // in minutes
  mapRadius: number; // in meters from home base
  redTeamRatio: number; // e.g., 0.25 for 25% red team
  winConditions: {
    tasksToWin: number; // default 5
    failuresToLose: number; // default 2
  };
}

export interface GameStats {
  tasksCompleted: number;
  tasksFailed: number;
  itemsCollected: Record<string, number>; // by player id
  itemsUsed: Record<string, number>;
  kills: Record<string, number>;
  deaths: Record<string, number>;
  distanceTraveled: Record<string, number>; // in meters
}

export type EventType =
  | "player_joined"
  | "player_left"
  | "game_started"
  | "player_moved"
  | "item_picked"
  | "item_used"
  | "task_started"
  | "task_progress"
  | "task_completed"
  | "task_failed"
  | "player_killed"
  | "game_ended"
  | "motion_detected"
  | "explosion"
  | "item_respawn";

export interface Event {
  id: string;
  gameId: string;
  type: EventType;
  visibility: "public" | "private" | "team"; // who can see this
  recipientIds?: string[]; // for private events
  message: string;
  timestamp: Date;
  position?: Coordinates;
}
