# Java Code Examples Index 💻

Complete, production-ready Java implementations for all design patterns and principles covered in this LLD playbook.

---

## 📋 **Quick Navigation**

| Topic | Code Examples Available | View |
|-------|------------------------|------|
| **SOLID Principles** | SRP, OCP, LSP, ISP, DIP | [View Examples](week1/day2/SOLID_CODE_EXAMPLES.md) |
| **God Class Refactoring** | Before/After Refactoring | [View Example](week1/day2/GOD_CLASS_REFACTORING.md) |
| **Vending Machine** | State Pattern Implementation | [View Example](problems/vendingmachine/CODE.md) |
| **Builder Pattern** | Complete User Builder | [View Example](week2/day6/BUILDER_PATTERN_CODE.md) |
| **Factory Pattern** | Payment Processor Factory | Coming Soon |
| **Prototype Pattern** | Game Character Cloning | Coming Soon |

---

## 🎯 **By Week**

### **Week 1: Foundations**

#### **Day 2: SOLID Principles**
- ✅ [**SOLID Code Examples**](week1/day2/SOLID_CODE_EXAMPLES.md)
  - Single Responsibility Principle (SRP)
  - UserService, EmailService, PasswordService
  - Before/After comparisons

- ✅ [**God Class Refactoring**](week1/day2/GOD_CLASS_REFACTORING.md)
  - 150+ line God Class → 5 focused classes
  - Complete refactoring walkthrough
  - SOLID & GRASP principles applied

### **Week 2: Design Patterns**

#### **Day 6: Creational Patterns**
- ✅ [**Builder Pattern**](week2/day6/BUILDER_PATTERN_CODE.md)
  - Complete User class with Builder
  - Fluent API, validation, immutability
  - Production-ready implementation

- ⏳ **Factory Pattern** (Coming Soon)
  - Payment processor factory
  - Multiple payment methods
  - Strategy selection

- ⏳ **Prototype Pattern** (Coming Soon)
  - Game character cloning
  - Deep vs shallow copy
  - Registry pattern

---

## 📂 **LLD Problem Solutions**

All complete implementations with detailed code walkthroughs:

### **Data Structures & Algorithms:**
- ✅ [**LRU Cache**](problems/lrucache/CODE.md) - O(1) cache with HashMap + Doubly Linked List
- ✅ [**Rate Limiter**](problems/ratelimiter/CODE.md) - Token Bucket, Sliding Window algorithms
- ✅ [**URL Shortener**](problems/urlshortener/CODE.md) - Base62 encoding, counter-based IDs

### **E-Commerce & Booking Systems:**
- ✅ [**Inventory Management**](problems/inventory/CODE.md) - Complete e-commerce with 25+ classes
- ✅ [**Splitwise**](problems/splitwise/CODE.md) - Expense splitting with settlement logic
- ✅ [**BookMyShow**](problems/bookmyshow/CODE.md) - Seat reservation with concurrency control
- ✅ [**Parking Lot**](problems/parkinglot/CODE.md) - Multi-level parking with pricing strategies

### **System Design Problems:**
- ✅ [**Elevator System**](problems/elevator/CODE.md) - SCAN/SSTF scheduling algorithms
- ✅ [**Vending Machine**](problems/vendingmachine/CODE.md) - State pattern implementation

### **Social & Communication:**
- ✅ [**WhatsApp**](problems/whatsapp/CODE.md) - Messaging with 23 Java files
- ✅ [**Stack Overflow**](problems/stackoverflow/CODE.md) - Q&A platform with reputation system
- ✅ [**Spotify**](problems/spotify/CODE.md) - Music streaming with 18 Java files

### **Game Engines:**
- ✅ [**TicTacToe**](problems/tictactoe/CODE.md) - Complete game with undo/redo
- ✅ [**Chess**](problems/chess/CODE.md) - Rules engine with AI (Minimax)

### **Infrastructure Services:**
- ✅ [**Notification Service**](problems/notification/CODE.md) - Multi-channel with retries
- ✅ [**KV Store**](problems/kvstore/CODE.md) - In-memory with WAL & snapshots
- ✅ [**Feature Flags**](problems/featureflags/CODE.md) - Configuration with gradual rollouts
- ✅ [**Logging Library**](problems/logging/CODE.md) - Structured logging with MDC
- ✅ [**Search/Index**](problems/search/CODE.md) - Inverted index with TF-IDF

---

## 📂 **Examples Directory Structure**

```
src/main/java/com/you/lld/
├── examples/                 # Learning examples
│   ├── day2/solid/srp/      # SOLID principles
│   ├── day2/refactoring/    # God Class refactoring
│   └── week2/day6/          # Design patterns
└── problems/                 # Complete LLD solutions
    ├── lrucache/            # LRU Cache implementation
    ├── ratelimiter/         # Rate limiting algorithms
    ├── inventory/           # E-commerce system (25 files)
    ├── parkinglot/          # Parking lot (20 files)
    ├── whatsapp/            # Messaging (23 files)
    ├── spotify/             # Music streaming (18 files)
    ├── stackoverflow/       # Q&A platform (11 files)
    └── ... (15+ more problems)
```

---

## 🎓 **How to Use These Examples**

### **1. Read the Documentation**
Each code example page includes:
- ✅ Complete, runnable Java code
- ✅ Detailed explanations
- ✅ Before/After comparisons
- ✅ Common mistakes to avoid
- ✅ Practice exercises

### **2. View in IDE**
All source code is available in:
```
src/main/java/com/you/lld/examples/
```

### **3. Run the Code**
```bash
# Compile
javac -d target/classes src/main/java/com/you/lld/examples/**/*.java

# Run demos
java -cp target/classes com.you.lld.examples.week2.day6.CreationalPatternsDemo
```

---

## 📊 **Coverage Overview**

| Pattern/Principle | Documentation | Code | Tests | Status |
|-------------------|---------------|------|-------|--------|
| **SRP** | ✅ | ✅ | ✅ | Complete |
| **God Class Refactoring** | ✅ | ✅ | ✅ | Complete |
| **Builder** | ✅ | ✅ | ⏳ | Documented |
| **Factory** | ⏳ | ✅ | ⏳ | In Progress |
| **Prototype** | ⏳ | ✅ | ⏳ | In Progress |
| **OCP** | ⏳ | ⏳ | ⏳ | Planned |
| **LSP** | ⏳ | ⏳ | ⏳ | Planned |
| **ISP** | ⏳ | ⏳ | ⏳ | Planned |
| **DIP** | ⏳ | ⏳ | ⏳ | Planned |

---

## 🎯 **Learning Path**

### **Beginner**
1. Start with [SOLID Code Examples](week1/day2/SOLID_CODE_EXAMPLES.md)
2. Study [God Class Refactoring](week1/day2/GOD_CLASS_REFACTORING.md)
3. Practice with exercises in each guide

### **Intermediate**
1. Learn [Builder Pattern](week2/day6/BUILDER_PATTERN_CODE.md)
2. Implement your own builders
3. Move to Factory and Prototype patterns

### **Advanced**
1. Combine multiple patterns
2. Apply to real-world problems
3. Review [Weekend Projects](week1/weekend/README.md)

---

## 💡 **Why Embedded Code?**

**All code is embedded directly in the documentation** for:

✅ **Easy Learning** - Read code without switching to IDE  
✅ **Complete Context** - See full implementations, not snippets  
✅ **Copy-Paste Ready** - Use code directly in your projects  
✅ **Searchable** - Find examples quickly in browser  
✅ **Self-Contained** - Each page has everything you need  

---

## 🔗 **Related Resources**

- [Main README](README.md) - Project overview
- [SOLID Principles Guide](week1/day2/DAY2_SOLID_PRINCIPLES.md) - Theory
- [GRASP Principles](week1/day2/DAY2_GRASP_PRINCIPLES.md) - Design principles
- [Design Patterns Catalog](foundations/DESIGN_PATTERNS_CATALOG.md) - All 23 GoF patterns

---

## 📝 **Contributing**

Want to add more code examples?

1. Create Java implementation in `src/main/java/com/you/lld/examples/`
2. Add comprehensive documentation in `docs/`
3. Include usage examples and common mistakes
4. Update this index page

---

**Ready to dive into code?** Start with [SOLID Examples](week1/day2/SOLID_CODE_EXAMPLES.md)! 🚀

