# Week 1: Foundations & OO Modeling 📘

Master the fundamentals of Low-Level Design through systematic process, design principles, and UML diagrams.

---

## 📅 **Weekly Overview**

| Day | Topic | Key Concepts |
|-----|-------|--------------|
| [Day 1](week1/day1/README.md) | LLD Process & Fundamentals | Requirements gathering, domain modeling, API design |
| [Day 2](week1/day2/README.md) | SOLID & GRASP | Design principles, cohesion, coupling |
| [Day 3](week1/day3/README.md) | UML Diagrams | Class, Sequence, State diagrams |
| [Day 4](week1/day4/README.md) | Value Objects & Domain Types | Immutability, Money, DateRange, Email |
| [Day 5](week1/day5/README.md) | Error Modeling & Validation | Exceptions, Result types, Validators |
| [Weekend](week1/weekend/README.md) | **Parking Lot** | End-to-end implementation |

---

## 🎯 **Learning Objectives**

By the end of Week 1, you will be able to:

1. **Apply a systematic LLD process** from requirements to implementation
2. **Design clean APIs** following SOLID and GRASP principles
3. **Create professional UML diagrams** (Class, Sequence, State)
4. **Implement robust domain models** with proper value objects
5. **Handle errors gracefully** with custom exceptions and validation

---

## 📂 **Day-by-Day Content**

### Day 1: LLD Process & Fundamentals
- **Guide**: [README.md](week1/day1/README.md)
- **Exercises**: [EXERCISES.md](week1/day1/EXERCISES.md) | [Solutions](week1/day1/EXERCISE_SOLUTIONS.md)
- **Diagrams**: View in `docs/week1/day1/diagrams/` (PNG + Mermaid)

**Key Topics**:
- Requirements clarification techniques
- Domain entity identification
- API contract design
- Professional use case specification

### Day 2: SOLID & GRASP Principles
- **Guide**: [README.md](week1/day2/README.md)
- **SOLID**: [DAY2_SOLID_PRINCIPLES.md](week1/day2/DAY2_SOLID_PRINCIPLES.md)
- **GRASP**: [DAY2_GRASP_PRINCIPLES.md](week1/day2/DAY2_GRASP_PRINCIPLES.md)
- **Examples**: [View Code Examples](day2/CODE) 

**Key Topics**:
- Single Responsibility Principle
- Open/Closed Principle
- Liskov Substitution
- Interface Segregation
- Dependency Inversion
- GRASP patterns (Creator, Expert, Controller)

### Day 3: UML Diagrams
- **Guide**: [README.md](week1/day3/README.md)
- **Exercises**: [EXERCISES.md](week1/day3/EXERCISES.md) | [Solutions](week1/day3/EXERCISE_SOLUTIONS.md)
- **Diagrams**: View in `docs/week1/day3/diagrams/`
- **Implementation**: [Vending Machine](/problems/vendingmachine/README) 

**Key Topics**:
- Class diagrams with relationships
- Sequence diagrams with alt/opt fragments
- State diagrams with transitions
- Vending Machine implementation

### Day 4: Value Objects & Domain Types
- **Guide**: [README.md](week1/day4/README.md)
- **Exercises**: [EXERCISES.md](week1/day4/EXERCISES.md) | [Solutions](week1/day4/EXERCISE_SOLUTIONS.md)

**Key Topics**:
- Immutable value objects
- Money, Percentage, DateRange
- Entity vs Value Object
- Builder pattern for construction

### Day 5: Error Modeling & Validation
- **Guide**: [README.md](week1/day5/README.md)
- **Exercises**: [EXERCISES.md](week1/day5/EXERCISES.md) | [Solutions](week1/day5/EXERCISE_SOLUTIONS.md)

**Key Topics**:
- Custom exception hierarchies
- Result<T, E> type for functional error handling
- Fluent validation framework
- API error contracts

### Weekend Project: Parking Lot System
- **Guide**: [README.md](week1/weekend/README.md)
- **Project Breakdown**: [EXERCISES.md](week1/weekend/EXERCISES.md)
- **Implementation**: [Parking Lot](/problems/parkinglot/README) 

**Covers**:
- Multi-floor parking
- Multiple vehicle types
- Pricing strategies (hourly, tiered, peak hours)
- Space allocation algorithms
- Payment processing
- Concurrent operations

---

## 📊 **Diagrams Available**

| Diagram | Location |
|---------|----------|
| LLD Process Flow | [day1/diagrams/lld-process-flow.jpg](day1/diagrams/lld-process-flow.jpg) |
| Library Class Diagram | [day1/diagrams/library-class-example.jpg](day1/diagrams/library-class-example.jpg) |
| Library Sequence Diagram | [day1/diagrams/library-sequence-example.jpg](day1/diagrams/library-sequence-example.jpg) |
| Library State Diagram | [day1/diagrams/library-state-example.jpg](day1/diagrams/library-state-example.jpg) |
| Vending Machine Class | [day3/diagrams/vending-machine-class.jpg](day3/diagrams/vending-machine-class.jpg) |
| Vending Machine Sequence | [day3/diagrams/vending-machine-sequence.jpg](day3/diagrams/vending-machine-sequence.jpg) |

---

## ✅ **Progress Checklist**

- [ ] Complete Day 1 exercises (LLD Process)
- [ ] Complete Day 2 SOLID examples
- [ ] Draw UML diagrams for a new system
- [ ] Implement 3 value objects
- [ ] Create custom exception hierarchy
- [ ] Complete Parking Lot weekend project

---

## ➡️ **Next Steps**

After completing Week 1, proceed to:
- [Week 2: Patterns & Persistence](week2/README.md)