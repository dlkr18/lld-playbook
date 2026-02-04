# Week 3: Services and Infrastructure Components 🏗️

**Focus**: Build production-ready infrastructure components and services.

---

## 📅 **Week Overview**

| Day | Topic | Key Concepts |
|-----|-------|--------------|
| [Day 11](week3/day11/README.md) | Rate Limiter | Token/Leaky/Sliding Window algorithms |
| [Day 12](week3/day12/README.md) | Notification Service | Multi-channel, retries, templates |
| [Day 13](week3/day13/README.md) | Feature Flags | Config management, rollout strategies |
| [Day 14](week3/day14/README.md) | KV Store | WAL, snapshots, compaction |
| [Day 15](week3/day15/README.md) | Search/Index | Indexing strategies, E2EE considerations |
| [Weekend](week3/weekend/README.md) | BookMyShow | Seat holds, overbooking prevention |

---

## 🎯 **Learning Goals**

By the end of Week 3, you will:
- Build **rate limiting** systems for API protection
- Design **notification services** with retry and templating
- Implement **feature flag** systems for safe rollouts
- Create **key-value stores** with durability guarantees
- Understand **search/indexing** trade-offs
- Build a complete **booking system** with concurrency handling

---

## 🏗️ **Architecture Themes**

### **Reliability**
- Retry mechanisms with exponential backoff
- Circuit breakers for fault isolation
- Graceful degradation strategies

### **Scalability**
- Horizontal scaling patterns
- Distributed state management
- Sharding and partitioning

### **Durability**
- Write-ahead logging
- Snapshots and checkpoints
- Recovery mechanisms

---

## 📁 **Code Examples**

All implementations are available in [Problems Section](/problems/):
- [Rate Limiter](/problems/ratelimiter/README)
- [Notification System](/problems/notification/README)
- [Feature Flags](/problems/featureflags/README)
- [KV Store](/problems/kvstore/README)
- [Search Engine](/problems/search/README)
- `[View BookMyShow Implementation](/problems/bookmyshow/README)`

---

**Next Week**: [Week 4 - Advanced Cases and Interview Drills](week4/README.md) →
