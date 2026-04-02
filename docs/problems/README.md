# LLD Problems

A collection of complete Low-Level Design problem solutions with comprehensive documentation, diagrams, and implementations.

## Problem List

| Problem | Difficulty | Key Concepts | Status |
|---------|-----------|--------------|--------|
| [LRU Cache](lru-cache/README.md) | Medium | HashMap, Doubly Linked List, O(1) Operations | Complete |
| [Stack Overflow](stackoverflow/README.md) | Hard | Domain-Driven Design, Aggregates, Voting System | Complete |
| [URL Shortener](url-shortener/README.md) | Medium | Base62 Encoding, Hash Maps, Analytics | Complete |
| [Spotify (Music Streaming)](spotify/README.md) | Hard | Complex Domain Model, Playlists, Playback | Complete |
| [WhatsApp (Chat Application)](whatsapp/README.md) | Hard | Composite Pattern, Observer, Message Status | Complete |

## Problem Categories

### Data Structures & Algorithms
- **LRU Cache**: Constant-time cache with LRU eviction
- **URL Shortener**: Base62 encoding with O(1) lookups
- ⏳ **LFU Cache**: Least Frequently Used eviction policy (Coming Soon)
- ⏳ **Time-based Cache**: TTL expiration (Coming Soon)

### System Design Components
- ⏳ **Rate Limiter**: Token bucket, sliding window (Coming Soon)
- ⏳ **Consistent Hashing**: Distributed cache (Coming Soon)
- ⏳ **Distributed Lock**: Coordination primitive (Coming Soon)

### Domain-Driven Design
- **Stack Overflow**: Q&A platform with voting and reputation
- ⏳ **Parking Lot**: Multi-floor parking system (Coming Soon)
- ⏳ **Elevator System**: Scheduling algorithms (Coming Soon)
- ⏳ **Library Management**: Book checkout system (Coming Soon)

### E-commerce & Booking
- ⏳ **Inventory Management**: Stock reservation (Coming Soon)
- ⏳ **BookMyShow**: Seat reservation (Coming Soon)
- ⏳ **Hotel Booking**: Room allocation (Coming Soon)

### Social & Media Platforms
- **Spotify (Music Streaming)**: Playlists, playback, user library
- **WhatsApp (Chat Application)**: Direct & group chats, message status, typing indicators
- ⏳ **Splitwise**: Expense sharing (Coming Soon)
- ⏳ **Calendar System**: Meeting scheduling (Coming Soon)

### Games
- ⏳ **Chess**: Complete chess game engine (Coming Soon)
- ⏳ **TicTacToe**: Game state management (Coming Soon)
- ⏳ **Snake & Ladder**: Turn-based game (Coming Soon)

## How to Use

Each problem includes:

1. **README.md**: Complete problem documentation
   - Requirements (functional & NFRs)
   - Domain model
   - Diagrams (class, sequence, state)
   - API design
   - Testing strategy
   - Trade-offs & ADRs

2. **Implementation**: Production-quality Java code
   - Interface definitions
   - Multiple implementations (if applicable)
   - Thread-safe variants
   - Extensions and variations

3. **Tests**: Comprehensive test coverage
   - Unit tests
   - Integration tests
   - Property-based tests
   - Performance tests

4. **Diagrams**: Visual documentation
   - Mermaid source files (.mmd)
   - Rendered images (.jpg)

## Getting Started

1. **Choose a problem** from the list above
2. **Try solving it yourself** first (30-45 minutes)
3. **Review the documentation** to understand requirements
4. **Study the implementation** to learn design patterns
5. **Run the tests** to verify understanding
6. **Extend the solution** with your own variations

## Study Tips

### For Interview Preparation
1. **Understand the problem** deeply before coding
2. **Discuss trade-offs** explicitly
3. **Write clean, tested code**
4. **Consider edge cases**
5. **Optimize for the common case**

### For Learning
1. **Start with simpler problems** (LRU Cache, TicTacToe)
2. **Progress to complex domains** (Splitwise, BookMyShow)
3. **Study design patterns** in context
4. **Compare multiple implementations**
5. **Practice explaining your design choices**

## Code Structure

```
lld-playbook/
├── docs/problems/ # Documentation
│ ├── README.md # This file
│ ├── lru-cache/
│ │ ├── README.md # Problem documentation
│ │ └── diagrams/ # Mermaid diagrams
│ └── <problem-name>/ # Other problems
├── src/main/java/com/you/lld/problems/
│ ├── lrucache/ # LRU Cache implementation
│ │ ├── LRUCache.java # Interface
│ │ ├── LRUCacheImpl.java # Main implementation
│ │ └── ConcurrentLRUCache.java # Thread-safe version
│ └── <problem>/ # Other implementations
└── src/test/java/com/you/lld/problems/
    ├── lrucache/ # LRU Cache tests
    │ ├── LRUCacheTest.java
    │ └── ConcurrentLRUCacheTest.java
    └── <problem>/ # Other tests
```

## Complexity Reference

| Problem | Time (Get) | Time (Put) | Space |
|---------|-----------|-----------|-------|
| LRU Cache | O(1) | O(1) | O(capacity) |

## Related Resources

- [Main README](README.md) - Project overview
- [LLD Process Guide](week1/day1/README.md) - Systematic design approach
- [SOLID Principles](week1/day2/README.md) - Design principles
- [Design Patterns](week2/day6/README.md) - Common patterns

## Contributing

To add a new problem:

1. Create folder: `docs/problems/<problem-name>/`
2. Follow template: `docs/TEMPLATES/PROBLEM_README_TEMPLATE.md`
3. Add diagrams in Mermaid format
4. Implement solution with tests
5. Update this README with problem entry

---

**Ready to master LLD?** Start with [LRU Cache](lru-cache/README.md)!

