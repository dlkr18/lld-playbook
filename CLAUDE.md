# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

Maven (Java 8) is the build tool. JUnit 5 (Jupiter) is the test framework.

```bash
mvn -q test                                              # run all tests
mvn -q test -Dtest=ParkingLotTest                        # run a single test class
mvn -q test -Dtest=ParkingLotTest#allocatesNearestSpace  # single test method
mvn -q compile                                           # compile only
mvn -q package                                           # build jar
```

To run a `*Demo.java` main class:

```bash
mvn -q compile exec:java -Dexec.mainClass="com.you.lld.problems.parkinglot.ParkingLotDemo"
```

The repo also contains standalone C++ scratch files at the root (`bounds_comparison.cpp`, `russian_dolls_*.cpp`) — compile ad hoc with `g++ -std=c++17 <file>.cpp -o <out>`. These are unrelated to the Java playbook.

## Architecture

This is an **LLD interview-prep playbook**, not a deployable system. It is a collection of ~43 self-contained LLD problems, each one a mini-codebase demonstrating specific design patterns. Treat each problem folder as an independent design exercise — they don't share runtime code, only conventions.

### Standard package layout (every problem)

Every problem under `src/main/java/com/you/lld/problems/<problem>/` follows this layout. When refactoring or adding problems, conform to it:

```
<problem>/
  model/           — entities, value objects, enums. Immutable where possible.
                     No business logic beyond self-validation.
  service/         — interfaces only (one per concern).
  service/impl/    — concrete implementations; class name hints at the strategy
                     (e.g. LRUCache, HourlyPricing, InMemoryBankService).
  <Problem>.java   — root orchestrator / facade / state machine (the "god object"
                     an interviewer sees first).
  <Problem>Demo.java — interview-style demo with 4-5 scenarios, each proving one
                     design point.
```

For problems with ≤5 classes total, a flat package is acceptable — don't force three sub-packages for four files.

### Other source roots

- `com.you.lld.common/` — shared utilities (e.g. `Money`).
- `com.you.lld.examples/` — small teaching examples tied to specific curriculum days (e.g. `examples/day2/` for SOLID refactors).
- `com.you.lld.patterns/{creational,structural,behavioral}/` — reusable pattern implementations referenced by curriculum docs.
- `com.you.lld.designpatterns/` — additional pattern catalog code.
- `docs/week{1..4}/day{N}/` — curriculum docs, exercises, and Mermaid + PNG diagrams that pair with the code.

### Curriculum

`docs/` is structured as a 4-week study plan (Week 1 foundations → Week 4 capstone). Each day has a `README.md`, often an `EXERCISES.md` + `EXERCISE_SOLUTIONS.md`, and a `diagrams/` folder with `.mmd` and matching `.png` files. Weekend folders host the larger projects (Parking Lot, Elevator, BookMyShow, Capstone). See top-level `README.md` for the full table.

## Project-specific constraints

- **Java 8 only.** Do NOT use `String.isBlank()`, `Map.of()`, `List.of()`, records, pattern matching, or `var`. Use `s.trim().isEmpty()`, `new HashMap<>()` + `put`, explicit classes. The `pom.xml` pins `maven.compiler.source/target` to 1.8.
- **Interview-quality, not production.** Each problem is judged on: correctly applied patterns (State / Observer / Strategy / Composite / Decorator / Factory), thread-safety reasoned explicitly, no dead code, and a runnable `*Demo.java` covering realistic scenarios.

## Overhaul workflow (when user says "move <problem> to SDE3 quality" or similar)

The Cursor rule at `.cursor/rules/lld-study-plan.mdc` defines a mandatory workflow. Summary:

1. **Audit** existing impl end-to-end — list flaws, dead code, concurrency gaps.
2. **Plan** the overhaul naming specific patterns and why.
3. **Refactor** to the standard package layout above. Delete dead code.
4. **Verify** with `mvn compile` and run the demo.
5. **Diagrams**: class diagram (Mermaid) + state diagram if applicable.
6. **Interview presentation** (mandatory): a full 70-100 min SDE2/SDE3 walkthrough — clarifying questions, functional + non-functional requirements, core entities (with layer and internal summary), relationships, patterns used (with rationale vs alternatives), 2-3 critical implementation details, likely follow-ups, trade-offs.
7. **README.md** inside the problem folder — interview-ready reference card with one-line problem statement, package structure, patterns, inline Mermaid class/state diagrams, demo run command, and 3-5 talking points.
8. Commit + push on `master`, then mark ✅ done in `.cursor/rules/lld-study-plan.mdc`.

The study-plan rule file also tracks priority order of the top-20 problems and which have already been overhauled — consult it before picking what to work on next.
