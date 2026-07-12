# Getting Started 🚀

## Prerequisites

- Java 11+ installed
- Maven 3.6+ installed
- IDE (IntelliJ IDEA recommended)
- Git

---

## Quick Setup

```bash
# Clone the repository
git clone <repo-url>
cd lld-playbook

# Build the project
mvn clean compile

# Run all tests
mvn test

# Start documentation server
cd docs && npx serve .
# Or: python3 -m http.server 3000
```

---

## Project Structure

```
lld-playbook/
├── docs/                    # 📚 Documentation (you are here!)
│   ├── week1/               # Week 1 content
│   ├── week2/               # Week 2 content
│   ├── week3/               # Week 3 content
│   ├── week4/               # Week 4 content
│   ├── problems/            # LLD problem docs
│   └── foundations/         # Reference guides
│
├── src/main/java/           # ☕ Java source code
│   └── com/you/lld/
│       ├── common/          # Shared utilities
│       ├── examples/        # Learning examples
│       ├── patterns/        # Pattern implementations
│       └── problems/        # LLD solutions
│
└── src/test/java/           # 🧪 Tests
```

---

## Study Path

### Recommended Order

1. **Week 1** - Start with fundamentals
   - Day 1-2: Design principles (read + understand)
   - Day 3-5: Hands-on with diagrams and value objects
   - Weekend: Complete Parking Lot project

2. **Week 2** - Design patterns
   - Study each pattern category
   - Implement examples yourself first
   - Compare with provided solutions

3. **Week 3** - Infrastructure
   - Focus on real-world services
   - Pay attention to concurrency
   - Complete BookMyShow project

4. **Week 4** - Advanced + Interview
   - Complex problem solving
   - Practice mock interviews
   - Complete capstone project

---

## Running Examples

```bash
# Run a specific test class
mvn -Dtest=TokenBucketRateLimiterTest test

# Run tests in a package
mvn -Dtest="com.you.lld.problems.vendingmachine.**" test

# Run with verbose output
mvn test -X
```

---

## Tips

### For Each Day
1. Read the README first
2. Try exercises before solutions
3. Draw diagrams by hand
4. Implement code yourself
5. Compare with provided code

### For Weekend Projects
1. Spend 2-4 hours minimum
2. Start with domain models
3. Add features incrementally
4. Write tests as you go
5. Refactor at the end

---

## Next Steps

**Start your journey:** [Week 1 - Day 1](week1/day1/README.md)
