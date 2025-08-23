# LLD Playbook (Java) — SDE-2 Prep

A comprehensive 4-week, end-to-end preparation plan for Low-Level Design interviews in Java. Focuses on systematic design thinking, clean APIs, design patterns, and real-world system implementation.

## 🚀 **Quick Start for Beginners**

### **New to LLD? Start here:**
1. **Read the Overview**: [`docs/PLAN.md`](docs/PLAN.md) - Understand the 4-week curriculum
2. **Begin Day 1**: [`docs/foundations/DAY1_LLD_PROCESS.md`](docs/foundations/DAY1_LLD_PROCESS.md) - Learn the systematic LLD process
3. **Track Progress**: Use the [Progress Tracker](#-progress-tracker) below
4. **Run Tests**: `mvn -q test` to verify everything works

### **Already familiar with LLD?**
- Jump to specific topics using the [Navigation Index](#-navigation-index)
- Explore complete implementations: [Inventory System](docs/inventory/), [Parking Lot](docs/parkinglot/)

---

## 📅 **Progress Tracker**

### **Week 1: Foundations & OO Modeling**
- [ ] **Day 1**: [LLD Process](docs/foundations/DAY1_LLD_PROCESS.md) + [Exercises](docs/foundations/EXERCISES.md)
- [ ] **Day 2**: SOLID, GRASP, cohesion/coupling *(Coming Soon)*
- [ ] **Day 3**: UML diagrams (class/sequence/state) *(Coming Soon)*
- [ ] **Day 4**: Value vs entity; immutability; Money/ID types *(Coming Soon)*  
- [ ] **Day 5**: Error modeling; validation; builders *(Coming Soon)*
- [ ] **Weekend**: [Parking Lot](src/main/java/com/you/lld/parkinglot/) end-to-end *(Ready)*

### **Week 2: Patterns & Persistence**
- [ ] **Day 6**: Creational patterns *(Coming Soon)*
- [ ] **Day 7**: Structural patterns *(Coming Soon)*
- [ ] **Day 8**: Behavioral patterns *(Coming Soon)*
- [ ] **Day 9**: Repository/UnitOfWork/Specification *(Coming Soon)*
- [ ] **Day 10**: Caching (LRU/LFU/TTL) *(Coming Soon)*
- [ ] **Weekend**: Elevator with schedulers *(Coming Soon)*

### **Week 3: Services & Infrastructure**
- [ ] **Day 11**: [Rate Limiter](src/main/java/com/you/lld/rateLimiter/) *(Ready)*
- [ ] **Day 12**: Notification service *(Coming Soon)*
- [ ] **Day 13**: Feature flags/config *(Coming Soon)*
- [ ] **Day 14**: In-memory KV store *(Coming Soon)*
- [ ] **Day 15**: Search/index *(Coming Soon)*
- [ ] **Weekend**: BMS (BookMyShow) *(Coming Soon)*

### **Week 4: Advanced Cases**
- [ ] **Day 16**: Splitwise *(Coming Soon)*
- [ ] **Day 17**: Chess/TicTacToe *(Coming Soon)*
- [ ] **Day 18**: Logging/metrics library *(Coming Soon)*
- [ ] **Day 19**: Review + refactor *(Coming Soon)*
- [ ] **Day 20**: Mock interviews *(Coming Soon)*
- [ ] **Weekend**: Capstone project *(Coming Soon)*

---

## 🗺️ **Navigation Index**

### **📚 Learning Materials**
| Topic | Guide | Exercises | Implementation |
|-------|-------|-----------|----------------|
| **LLD Process** | [Day 1 Guide](docs/foundations/DAY1_LLD_PROCESS.md) | [Exercises](docs/foundations/EXERCISES.md) + [Solutions](docs/foundations/EXERCISE_SOLUTIONS.md) | [Visual Flow](docs/foundations/diagrams/lld-process-flow.png) |
| **Java Class Diagrams** | [Complete Guidelines](docs/foundations/JAVA_CLASS_DIAGRAM_GUIDELINES.md) | [Professional Examples](docs/foundations/diagrams/) | [Library System Examples](docs/foundations/diagrams/) |
| **Component Diagrams** | [Architecture Guide](docs/foundations/COMPONENT_DIAGRAMS_GUIDE.md) | [Microservices Example](docs/foundations/diagrams/component-example.png) | [E-commerce Architecture](docs/foundations/diagrams/component-example.png) |
| **OOP Relationships** | [Association, Aggregation & Composition](docs/foundations/ASSOCIATION_AGGREGATION_COMPOSITION.md) | [Code Examples](docs/foundations/ASSOCIATION_AGGREGATION_COMPOSITION.md#code-examples-side-by-side) | [Decision Tree](docs/foundations/ASSOCIATION_AGGREGATION_COMPOSITION.md#real-world-decision-tree) |
| **Inventory System** | [Complete Guide](docs/inventory/README.md) | [End-to-End Tests](src/test/java/com/you/lld/inventory/EndToEndOrderTest.java) | [Source Code](src/main/java/com/you/lld/inventory/) |
| **Parking Lot** | [Requirements](src/main/java/com/you/lld/parkinglot/README.md) | [Day 1 Summary](docs/parkinglot/DAY1_SUMMARY.md) | [Source Code](src/main/java/com/you/lld/parkinglot/) |

### **🔧 Utilities**
- **Money Type**: [`src/main/java/com/you/lld/common/Money.java`](src/main/java/com/you/lld/common/Money.java)
- **Test Examples**: [`src/test/java/com/you/lld/common/MoneyTest.java`](src/test/java/com/you/lld/common/MoneyTest.java)
- **Build & Test**: `mvn -q test`

### **📊 UML Diagrams**
| System | Class Diagram | Sequence Diagrams | State Diagrams |
|--------|---------------|-------------------|----------------|
| **LLD Process** | - | - | [Process Flow](docs/foundations/diagrams/lld-process-flow.png) |
| **Inventory** | [Domain Model](docs/inventory/diagrams/class.png) | [Order Flow](docs/inventory/diagrams/sequence-order-flow.png), [Transfers](docs/inventory/diagrams/sequence-transfer.png) | [Reservations](docs/inventory/diagrams/state-reservation.png), [Orders](docs/inventory/diagrams/state-order.png) |
| **Parking Lot** | [Domain Model](docs/parkinglot/diagrams/class-diagram.png) | [Entry/Exit Flow](docs/parkinglot/diagrams/sequence-entry-exit.png) | *Coming Soon* |

---

## 🎯 **What You'll Learn**

### **Core Skills**
- **Systematic Design Process**: Requirements → NFRs → Domain → Diagrams → APIs
- **SOLID Principles**: Applied to real-world systems
- **Design Patterns**: When and how to use them effectively
- **Domain Modeling**: Entities, value objects, and relationships
- **Clean APIs**: Interface design and dependency management

### **Real Systems Implemented**
- **E-commerce Inventory**: Complete order management with payments, fulfillment
- **Parking Lot**: Multi-floor, multi-vehicle type system with pricing strategies
- **Rate Limiter**: Token bucket, leaky bucket, sliding window algorithms
- **And more**: Elevator, BMS, Splitwise, Chess, Notification systems

### **Interview Preparation**
- **Structured Approach**: Follow proven methodology used in top tech companies
- **Code Quality**: Production-ready implementations with comprehensive tests
- **Documentation**: UML diagrams, ADRs, and design rationale
- **Mock Interviews**: Practice sessions with realistic scenarios

---

## 🏗️ **Project Structure**
```
lld-playbook/
├── README.md                    # This file - start here!
├── docs/
│   ├── PLAN.md                 # Complete 4-week curriculum
│   ├── foundations/            # Day 1 learning materials
│   ├── inventory/              # E-commerce system docs
│   └── parkinglot/            # Parking system docs
├── src/main/java/com/you/lld/
│   ├── common/                 # Shared utilities (Money, etc.)
│   ├── inventory/              # Complete e-commerce implementation
│   ├── parkinglot/            # Parking system (Day 1 foundation)
│   └── rateLimiter/           # Rate limiting algorithms
└── src/test/java/             # Comprehensive test suite
```

## 🚦 **Getting Started Commands**
```bash
# Clone and setup
git clone <repo-url>
cd lld-playbook

# Run all tests
mvn -q test

# Start learning
open docs/foundations/DAY1_LLD_PROCESS.md

# View diagrams
open docs/foundations/diagrams/lld-process-flow.png
```

---

## 💡 **Tips for Success**
1. **Follow the sequence**: Each day builds on previous concepts
2. **Practice exercises**: Hands-on practice reinforces learning
3. **Implement solutions**: Code the exercises before looking at implementations
4. **Review diagrams**: Visual understanding accelerates learning
5. **Track progress**: Use the checkboxes above to stay motivated

**Ready to become an LLD expert?** Start with [Day 1](docs/foundations/DAY1_LLD_PROCESS.md)! 🚀
