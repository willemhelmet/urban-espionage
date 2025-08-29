# Urban Espionage

🎮 **[Play Live Demo](https://willemhelmet.github.io/urban-espionage/)**

An augmented reality game where players turn their neighborhood into a real-world board game of espionage and deception.

## Game Concept

Urban Espionage is a location-based multiplayer game where players are secretly divided into two teams:
- **Blue Team**: Complete missions to win
- **Red Team**: Infiltrate and sabotage without getting caught

Players use their phones to navigate the real world, collect items, complete tasks, and engage in strategic gameplay - all while trying to figure out who they can trust.

## Key Features

### Real-World Gameplay
- Use your actual location as the game board
- Set up a "home base" at any central location (office, school, gym, etc.)
- Items and task zones spawn around your neighborhood

### Items & Equipment
- Single inventory slot system for strategic choices
- Deployable items: EMP zones, cameras, mines, motion sensors
- Offensive items: Daggers, poison, time bombs
- Defensive items: Armor, invisibility cloak, masks

### Dynamic Tasks
- Launch collaborative missions from home base
- Task types include capture objectives, defuse bombs, collect intel
- Multiple players can work together (but beware of saboteurs!)

### Trust No One
- Red team members appear as blue team to everyone
- Use deception and psychology to achieve your goals
- Death and revival mechanics add stakes to every encounter

## Tech Stack

- **Frontend**: React, TypeScript, Tailwind CSS
- **Maps**: Leaflet with OpenStreetMap
- **Real-time**: Socket.io for live player tracking
- **State**: Zustand for game state management
- **Build**: Vite

## Development Status

Currently in Phase 1 of development - building core map functionality and player tracking. See [PHASES.md](./PHASES.md) for the development roadmap.

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Deploy to GitHub Pages
npm run deploy
```

## Documentation

- [Full Game Specification](./SPEC.md) - Complete game design document
- [Development Phases](./PHASES.md) - Implementation roadmap
- [API Documentation](./SPEC.md#api) - Technical interfaces and backend design

## Contributing

This is an active development project. Check the current phase in PHASES.md to see what's being worked on.

## License

[Your License Here]
