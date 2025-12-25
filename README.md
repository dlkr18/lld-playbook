# LLD Playbook (Java) — SDE-2 Prep 🎯

A comprehensive **4-week, end-to-end preparation plan** for Low-Level Design interviews in Java. Focuses on systematic design thinking, clean APIs, design patterns, and real-world system implementation.

---

## 🚀 **Quick Start**

```bash
# Clone and explore
git clone <repo-url>
cd lld-playbook

# Run tests
mvn -q test

# Start learning
open docs/week1/README.md
```

---

## 📅 **Complete 4-Week Curriculum**

### **Week 1: Foundations & OO Modeling** ✅
| Day | Topic | Documentation | Exercises | Status |
|-----|-------|---------------|-----------|--------|
| Day 1 | LLD Process & Fundamentals | [Guide](docs/week1/day1/README.md) | [Exercises](docs/week1/day1/EXERCISES.md) | ✅ |
| Day 2 | SOLID, GRASP, Cohesion/Coupling | [Guide](docs/week1/day2/README.md) | [Examples](src/main/java/com/you/lld/examples/day2/) | ✅ |
| Day 3 | UML Diagrams (Class/Sequence/State) | [Guide](docs/week1/day3/README.md) | [Exercises](docs/week1/day3/EXERCISES.md) | ✅ |
| Day 4 | Value Objects & Domain Types | [Guide](docs/week1/day4/README.md) | [Exercises](docs/week1/day4/EXERCISES.md) | ✅ |
| Day 5 | Error Modeling & Validation | [Guide](docs/week1/day5/README.md) | [Exercises](docs/week1/day5/EXERCISES.md) | ✅ |
| Weekend | **Parking Lot System** | [Project](docs/week1/weekend/README.md) | [Full Project](docs/week1/weekend/EXERCISES.md) | ✅ |

### **Week 2: Patterns & Persistence** ✅
| Day | Topic | Documentation | Exercises | Status |
|-----|-------|---------------|-----------|--------|
| Day 6 | Creational Patterns | [Guide](docs/week2/day6/README.md) | [Examples](src/main/java/com/you/lld/examples/week2/day6/) | ✅ |
| Day 7 | Structural Patterns | [Guide](docs/week2/day7/README.md) | [Exercises](docs/week2/day7/EXERCISES.md) | ✅ |
| Day 8 | Behavioral Patterns | [Guide](docs/week2/day8/README.md) | Included | ✅ |
| Day 9 | Repository, UoW, Specification | [Guide](docs/week2/day9/README.md) | Included | ✅ |
| Day 10 | Caching (LRU/LFU/TTL) | [Guide](docs/week2/day10/README.md) | Included | ✅ |
| Weekend | **Elevator System** | [Project](docs/week2/weekend/README.md) | Included | ✅ |

### **Week 3: Services & Infrastructure** ✅
| Day | Topic | Documentation | Exercises | Status |
|-----|-------|---------------|-----------|--------|
| Day 11 | Rate Limiter | [Guide](docs/week3/day11/README.md) | [Exercises](docs/week3/day11/EXERCISES.md) | ✅ |
| Day 12 | Notification Service | [Guide](docs/week3/day12/README.md) | Included | ✅ |
| Day 13 | Feature Flags & Config | [Guide](docs/week3/day13/README.md) | Included | ✅ |
| Day 14 | In-Memory KV Store with WAL | [Guide](docs/week3/day14/README.md) | Included | ✅ |
| Day 15 | Search & Indexing | [Guide](docs/week3/day15/README.md) | Included | ✅ |
| Weekend | **BookMyShow** | [Project](docs/week3/weekend/README.md) | Included | ✅ |

### **Week 4: Advanced Cases & Interview Drills** ✅
| Day | Topic | Documentation | Exercises | Status |
|-----|-------|---------------|-----------|--------|
| Day 16 | Splitwise (Expense Sharing) | [Guide](docs/week4/day16/README.md) | [Exercises](docs/week4/day16/EXERCISES.md) | ✅ |
| Day 17 | Chess/TicTacToe (Game Engine) | [Guide](docs/week4/day17/README.md) | [Exercises](docs/week4/day17/EXERCISES.md) | ✅ |
| Day 18 | Logging & Metrics Library | [Guide](docs/week4/day18/README.md) | Included | ✅ |
| Day 19 | Review & Refactor | [Guide](docs/week4/day19/README.md) | Included | ✅ |
| Day 20 | Mock Interviews | [Guide](docs/week4/day20/README.md) | Included | ✅ |
| Weekend | **Capstone Project** | [Project](docs/week4/weekend/README.md) | Included | ✅ |

---

## 🗺️ **Navigation**

### **By Week**
- 📘 [Week 1: Foundations](docs/week1/README.md) - OO modeling, SOLID, UML
- 📗 [Week 2: Patterns](docs/week2/README.md) - Design patterns, persistence
- 📙 [Week 3: Infrastructure](docs/week3/README.md) - Rate limiting, caching, notifications
- 📕 [Week 4: Advanced](docs/week4/README.md) - Complex systems, interview prep

### **By Topic**
| Category | Topics |
|----------|--------|
| **Design Principles** | [SOLID](docs/week1/day2/DAY2_SOLID_PRINCIPLES.md), [GRASP](docs/week1/day2/DAY2_GRASP_PRINCIPLES.md), [Cohesion/Coupling](docs/week1/day2/COHESION_COUPLING.md) |
| **UML Diagrams** | [Class Diagrams](docs/foundations/JAVA_CLASS_DIAGRAM_GUIDELINES.md), [Component Diagrams](docs/foundations/COMPONENT_DIAGRAMS_GUIDE.md), [Relationships](docs/foundations/ASSOCIATION_AGGREGATION_COMPOSITION.md) |
| **Design Patterns** | [Catalog](docs/foundations/DESIGN_PATTERNS_CATALOG.md), [Creational](docs/week2/day6/README.md), [Structural](docs/week2/day7/README.md), [Behavioral](docs/week2/day8/README.md) |
| **Infrastructure** | [Rate Limiting](docs/week3/day11/README.md), [Caching](docs/week2/day10/README.md), [KV Store](docs/week3/day14/README.md) |

### **LLD Problems**
| Problem | Difficulty | Guide | Code |
|---------|------------|-------|------|
| Vending Machine | Medium | [Day 3](docs/week1/day3/README.md) | [`vendingmachine/`](src/main/java/com/you/lld/problems/vendingmachine/) |
| Parking Lot | Medium | [Weekend 1](docs/week1/weekend/README.md) | [`parkinglot/`](src/main/java/com/you/lld/problems/parkinglot/) |
| LRU Cache | Medium | [Day 10](docs/week2/day10/README.md) | [`lrucache/`](src/main/java/com/you/lld/problems/lrucache/) |
| Rate Limiter | Medium | [Day 11](docs/week3/day11/README.md) | [`patterns/ratelimiter/`](src/main/java/com/you/lld/patterns/behavioral/ratelimiter/) |
| Elevator System | Hard | [Weekend 2](docs/week2/weekend/README.md) | [`elevator/`](src/main/java/com/you/lld/problems/elevator/) |
| BookMyShow | Hard | [Weekend 3](docs/week3/weekend/README.md) | [`bookmyshow/`](src/main/java/com/you/lld/problems/bookmyshow/) |
| Splitwise | Hard | [Day 16](docs/week4/day16/README.md) | [`splitwise/`](src/main/java/com/you/lld/problems/splitwise/) |
| Chess/TicTacToe | Hard | [Day 17](docs/week4/day17/README.md) | [`tictactoe/`](src/main/java/com/you/lld/problems/tictactoe/) |

---

## 🏗️ **Project Structure**

```
lld-playbook/
├── README.md                              # This file
├── pom.xml                                # Maven configuration
│
├── docs/                                  # 📚 Documentation
│   ├── PLAN.md                            # 4-week curriculum overview
│   │
│   ├── week1/                             # Week 1: Foundations
│   │   ├── README.md                      # Week overview
│   │   ├── day1/                          # LLD Process
│   │   │   ├── README.md
│   │   │   ├── EXERCISES.md
│   │   │   ├── EXERCISE_SOLUTIONS.md
│   │   │   └── diagrams/                  # .mmd + .png files
│   │   ├── day2/                          # SOLID & GRASP
│   │   ├── day3/                          # UML Diagrams
│   │   ├── day4/                          # Value Objects
│   │   ├── day5/                          # Error Modeling
│   │   └── weekend/                       # Parking Lot Project
│   │
│   ├── week2/                             # Week 2: Patterns
│   ├── week3/                             # Week 3: Infrastructure
│   ├── week4/                             # Week 4: Advanced
│   │
│   ├── problems/                          # Problem-specific docs
│   │   ├── inventory/                     # E-commerce system
│   │   ├── parkinglot/                    # Parking lot
│   │   ├── lru-cache/                     # LRU Cache
│   │   └── ...
│   │
│   └── foundations/                       # Reference guides
│       ├── DESIGN_PATTERNS_CATALOG.md
│       ├── JAVA_CLASS_DIAGRAM_GUIDELINES.md
│       └── ASSOCIATION_AGGREGATION_COMPOSITION.md
│
├── src/main/java/com/you/lld/
│   ├── common/                            # Shared utilities (Money, etc.)
│   │
│   ├── examples/                          # Learning examples by day
│   │   ├── day2/                          # SOLID & refactoring examples
│   │   └── week2/day6/                    # Creational pattern examples
│   │
│   ├── patterns/                          # Reusable pattern implementations
│   │   ├── creational/
│   │   ├── structural/
│   │   └── behavioral/
│   │       └── ratelimiter/               # Rate limiter patterns
│   │
│   └── problems/                          # Complete LLD implementations
│       ├── vendingmachine/                # Vending Machine (State Pattern)
│       ├── parkinglot/                    # Parking Lot
│       ├── inventory/                     # E-commerce Inventory
│       ├── lrucache/                      # LRU Cache
│       ├── splitwise/                     # Expense Sharing
│       ├── tictactoe/                     # TicTacToe Game
│       ├── elevator/                      # Elevator System
│       ├── bookmyshow/                    # Ticket Booking
│       └── ...                            # More problems
│
└── src/test/java/                         # Comprehensive tests
```

---

## 📋 **Exercises & Solutions**

### **Available Exercises**
| Day | Topic | Exercises | Solutions |
|-----|-------|-----------|-----------|
| Day 1 | LLD Process | [EXERCISES.md](docs/week1/day1/EXERCISES.md) | [SOLUTIONS.md](docs/week1/day1/EXERCISE_SOLUTIONS.md) |
| Day 3 | UML Diagrams | [EXERCISES.md](docs/week1/day3/EXERCISES.md) | [SOLUTIONS.md](docs/week1/day3/EXERCISE_SOLUTIONS.md) |
| Day 4 | Value Objects | [EXERCISES.md](docs/week1/day4/EXERCISES.md) | [SOLUTIONS.md](docs/week1/day4/EXERCISE_SOLUTIONS.md) |
| Day 5 | Error Handling | [EXERCISES.md](docs/week1/day5/EXERCISES.md) | [SOLUTIONS.md](docs/week1/day5/EXERCISE_SOLUTIONS.md) |
| Day 7 | Structural Patterns | [EXERCISES.md](docs/week2/day7/EXERCISES.md) | In progress |
| Day 11 | Rate Limiter | [EXERCISES.md](docs/week3/day11/EXERCISES.md) | In progress |
| Day 16 | Splitwise | [EXERCISES.md](docs/week4/day16/EXERCISES.md) | In progress |
| Day 17 | Chess/TicTacToe | [EXERCISES.md](docs/week4/day17/EXERCISES.md) | In progress |
| Weekend 1 | Parking Lot | [EXERCISES.md](docs/week1/weekend/EXERCISES.md) | Full Implementation |

### **Diagrams**
All `.mmd` (Mermaid) diagrams have corresponding `.png` files:
- **22 PNG diagrams** across all topics
- Class diagrams, Sequence diagrams, State diagrams
- Located in `diagrams/` folders within each day

---

## 🎯 **What You'll Master**

### **Core Skills**
- ✅ **Systematic LLD Process**: Requirements → Domain → APIs → Implementation
- ✅ **Design Principles**: SOLID, GRASP, Cohesion/Coupling
- ✅ **Design Patterns**: 23 GoF patterns with real examples
- ✅ **UML Diagrams**: Class, Sequence, State, Component
- ✅ **Clean APIs**: Interface design, error handling
- ✅ **Production Quality**: Testing, documentation, ADRs

### **Systems Implemented**
- 🚗 Parking Lot with pricing strategies
- 🛗 Elevator with scheduling algorithms
- 🎬 BookMyShow with seat reservation
- 💰 Splitwise with debt simplification
- ♟️ Chess/TicTacToe with rules engine
- 📊 Logging library with MDC
- 🚦 Rate limiter (Token/Leaky/Sliding Window)
- 📬 Notification service with retries
- 🗄️ KV Store with WAL

---

## 💡 **Tips for Success**

1. **Follow the sequence**: Each day builds on previous concepts
2. **Practice exercises**: Complete exercises before viewing solutions
3. **Implement first**: Code before reading implementations
4. **Draw diagrams**: Visual understanding accelerates learning
5. **Mock interviews**: Practice with the Day 20 scenarios

---

## 🎓 **Ready to Start?**

**Begin your journey**: [Week 1 - Foundations](docs/week1/README.md) 🚀

---

## 📖 **Additional Resources**

- "Design Patterns" by Gang of Four
- "Clean Code" by Robert C. Martin
- "Head First Design Patterns"
- "Grokking the Object-Oriented Design Interview"

---

**Good luck with your LLD preparation!** 🏆