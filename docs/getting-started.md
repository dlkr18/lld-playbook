# Getting Started

## Prerequisites

- Java 11+ installed
- Maven 3.6+ installed
- IDE (IntelliJ IDEA recommended)
- Git

---

## Quick Setup

```bash
git clone <repo-url>
cd lld-playbook

mvn clean compile
mvn test

cd docs && npx serve .
```

---

## Project Structure

```
lld-playbook/
├── docs/ # Documentation (you are here)
│ ├── week1-4/ # Weekly curriculum
│ ├── problems/ # 44 LLD problem docs
│ ├── cheatsheets/ # Visual quick-reference sheets
│ └── foundations/ # Design patterns catalog
│
├── src/main/java/ # Java source code
│ └── com/you/lld/
│ ├── common/ # Shared utilities
│ ├── examples/ # Learning examples
│ ├── patterns/ # Pattern implementations
│ └── problems/ # LLD solutions
│
└── src/test/java/ # Tests
```

---

## Study Path

### Week 1 — Foundations

- Day 1-2: Design principles (read + understand)
- Day 3-5: Hands-on with diagrams and value objects
- Weekend: Complete Parking Lot project

### Week 2 — Design Patterns

- Study each pattern category
- Implement examples yourself first
- Compare with provided solutions

### Week 3 — Infrastructure

- Focus on real-world services
- Pay attention to concurrency
- Complete BookMyShow project

### Week 4 — Advanced + Interview

- Complex problem solving
- Practice mock interviews
- Complete capstone project

---

## Running Examples

```bash
mvn -Dtest=TokenBucketRateLimiterTest test

mvn -Dtest="com.you.lld.problems.vendingmachine.**" test

mvn test -X
```

---

## Tips

**For each day:** Read the README first, try exercises before looking at solutions, draw diagrams by hand, implement code yourself, then compare.

**For weekend projects:** Spend 2-4 hours minimum. Start with domain models, add features incrementally, write tests as you go, refactor at the end.

---

## Next Steps

Start your journey: [Week 1 — Day 1](week1/day1/README)
