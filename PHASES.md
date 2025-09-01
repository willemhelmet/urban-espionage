# Urban Espionage Development Phases

## Phase 1: Core Foundation (1-2 weeks)

**Goal:** See yourself move on a map

Start with just a map and your location:

- Basic React app with routes (Title � Game screen)
- Leaflet map showing your current position
- Mock "other players" as static dots
- Simple Zustand store for game state
- No backend yet - just local state

### Tasks

- [x] Set up React Router with basic routes
- [x] Install and configure Tailwind CSS
- [x] Add Leaflet map to game screen
- [x] Implement location tracking with GPS
- [x] Add mock players on map
  - [x] Create Player componennt
  - [x] Generate 5-8 mock players within ~500m radius
  - [x] Create PlayerMarker component with icon and name
  - [x] Show different visual states (active/recent/dark)
  - [x] Add click interaction to show player details
  - [x] Display item indicator for players with items
  - [x] Ensure visual distinction from own marker
- [x] Create basic Zustand store
- [ ] Style the UI with Tailwind

## Phase 2: Game Lobby (1 week)

**Goal:** Multiple people can join same lobby

Add multiplayer basics:

- Create game screen (just set home base)
- Join game with code
- Player list showing who's in
- Simple Firebase/Supabase setup
- Store games and players in database

### Tasks

- [ ] Set up Firebase/Supabase
- [ ] Create game creation flow
- [ ] Generate and display invite codes
- [ ] Implement join game by code
- [ ] Show player list in lobby
- [ ] Add "Start Game" for host

## Phase 3: Real-time Updates (1 week)

**Goal:** See other players move in real-time

Make it live:

- Add Socket.io or Firebase Realtime
- Show other players' actual positions
- Basic "visibility" system (active/inactive)
- Simple event log

### Tasks

- [ ] Set up WebSocket connections
- [ ] Broadcast player positions
- [ ] Implement visibility states
- [ ] Create event log component
- [ ] Handle player disconnect/reconnect

## Phase 4: Items System (1-2 weeks)

**Goal:** Pick up and use one item type

Add ONE item type first:

- Spawn items on map
- Pickup when nearby
- Single inventory slot
- Use item (start with something simple like "invisibility cloak")

### Tasks

- [ ] Create item spawn system
- [ ] Implement proximity detection
- [ ] Add inventory slot to UI
- [ ] Create item use mechanics
- [ ] Add visual feedback for item effects

## Phase 5: Tasks (1 week)

**Goal:** Complete a simple collaborative task

Implement ONE task type:

- "Capture objective" - just hold finger on screen
- Task zones on map
- Progress tracking
- Success/fail states

### Tasks

- [ ] Create task zones on map
- [ ] Implement task launching from home base
- [ ] Add progress bar UI
- [ ] Handle multiple players on same task
- [ ] Create success/failure notifications

## Phase 6: Win Conditions (3-4 days)

**Goal:** Play a complete round

Make it a game:

- Team assignment (blue/red)
- Task counter
- Game end screen
- Basic stats

### Tasks

- [ ] Implement team assignment on game start
- [ ] Add team reveal modal
- [ ] Create win condition logic
- [ ] Build post-game screen
- [ ] Display game statistics

## Future Phases (Post-MVP)

### Phase 7: Full Items Arsenal

- Implement all item types from spec
- Item respawn system
- Death and dogtag mechanics

### Phase 8: Advanced Tasks

- Add all task types
- Task rotation system
- Difficulty scaling

### Phase 9: Polish & Features

- Animations and transitions
- Sound effects
- Push notifications
- Tutorial system
- Profile customization

### Phase 10: Production Ready

- Security and anti-cheat
- Performance optimization
- Analytics
- Monetization (if applicable)

## Current Status

- **Active Phase:** Phase 1 - Core Foundation
- **Completed:** Basic routing, Tailwind setup, Leaflet map, GPS location
- **Next Steps:** Add mock players, create Zustand store
