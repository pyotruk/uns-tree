# UNS Tree

## Run

- `npm i`
- `npm run build`
- `npm run preview`
- open http://localhost:4173/


## Walkthrough

[Screen recording (Loom)](https://www.loom.com/share/cf39f69976694ad1b36aa935d025e7b7?sid=b62026ed-195e-4f1b-b50c-50eb5cab5ffd)


## Tech Stack

- typescript
- react
- mobx
- mui
- react-flow


## Features

- tree viewer & editor (create, edit, delete, reorder)
- displaying full path of edited / created node
- visualization (ReactFlow chart)
- filtering by node label
- drag-n-drop functionality (changing parent and reordering)


## Architecture

- **MobX state management** for reactive data flow
- **Service layer** for API communication and real-time updates
- **TreeStore**: Manages tree data, search, and node operations
- **FormStore**: Handles form state for creating/editing nodes
- **Reactive updates**: Real-time synchronization via service subscriptions


## Key decisions and trade-offs

### Data Storage
- **Flattened map structure** over nested objects
  - ✅ Easier CRUD operations
  - ✅ Better performance for large trees
  - ✅ Simpler state management
  - ❌ Requires parent-child relationship traversal

### Node Relationships
- **parentId field** for upward navigation
- **No childrenIds field** to avoid data duplication
  - ✅ Single source of truth
  - ✅ Easier updates (no need to update multiple arrays)
  - ❌ Requires filtering to find children

### Type System
- **No explicit "type" field** in base Node
  - ✅ Simpler base structure
  - ✅ TypeScript discriminated unions for type safety
  - ❌ Requires type guards for runtime checks

### State Management
- **MobX over Redux**
  - ✅ Less boilerplate
  - ✅ Automatic reactivity
  - ✅ Fits well considering UNS pattern is events-based (can simply subscribe to events in stores, without a listener middleware boilerplate)
  - ❌ Less predictable state changes

### Component Architecture
- **Observer pattern** for reactive updates
- **Store injection** rather than context
  - ✅ Explicit dependencies
  - ✅ Easier testing
  - ❌ More prop drilling
