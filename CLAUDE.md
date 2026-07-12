# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this repo is

An **SDE2/SDE3 interview-prep playbook**, not a deployable product. It spans four largely independent surfaces that share content but not runtime code:

1. **Java LLD playbook** (`src/`) — ~50 self-contained low-level-design problems, each a mini-codebase demonstrating specific patterns. This is the core; most work happens here.
2. **Docsify site** (`docs/`) — the published GitHub Pages site ("Interview Playbook — LLD, HLD, DSA & AI"). Hand-authored HTML cheat sheets, no build step.
3. **Next.js web app** (`web/`) — a separate problem-browser UI deployed to Vercel.
4. **Content-generation pipeline** (root `*.py`/`*.sh` + `scripts/`) — generators that emit the cheat sheets, DSA practice, and AI content.

When a task refers to "the code," it almost always means surface 1. Confirm which surface if ambiguous — they have different toolchains.

## Surface 1 — Java LLD playbook

Maven (Java 8) build, JUnit 5 (Jupiter) tests.

```bash
mvn -q test                                              # run all tests
mvn -q test -Dtest=ParkingLotTest                        # single test class
mvn -q test -Dtest=ParkingLotTest#allocatesNearestSpace  # single test method
mvn -q compile                                           # compile only
mvn -q package                                           # build jar
# run a <Problem>Demo.java main class (every problem's demo is at its folder root):
mvn -q compile exec:java -Dexec.mainClass="com.you.lld.problems.parkinglot.ParkingLotDemo"
```

### Standard package layout (every problem)

Every problem under `src/main/java/com/you/lld/problems/<problem>/` conforms to this. Match it when refactoring or adding problems:

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

The top-20 priority problems (tracked in `.cursor/rules/lld-study-plan.mdc`) also carry an `INTERVIEW.md` — a full 70-100 min SDE2/SDE3 walkthrough — and a folder `README.md` reference card.

### Other Java source roots

- `com.you.lld.common/` — shared utilities (e.g. `Money`).
- `com.you.lld.examples/` — teaching examples tied to curriculum days (e.g. `examples/day2/` SOLID refactors).
- `com.you.lld.patterns/{creational,structural,behavioral}/` — reusable pattern implementations referenced by curriculum docs (the Rate Limiter lives here under `behavioral/ratelimiter/`, not under `problems/`).
- `com.you.lld.designpatterns/` — additional pattern catalog code.

### Java 8 constraint (hard rule)

Do NOT use `String.isBlank()`, `Map.of()`, `List.of()`, records, pattern matching, or `var`. Use `s.trim().isEmpty()`, `new HashMap<>()` + `put`, explicit classes. `pom.xml` pins `maven.compiler.source/target` to 1.8.

### Quality bar

Interview-quality, not production. Each problem is judged on: correctly applied patterns (State / Observer / Strategy / Composite / Decorator / Factory), thread-safety reasoned explicitly, no dead code, and a runnable `*Demo.java` covering realistic scenarios.

## Surface 2 — Docsify site (`docs/`)

Static docsify site with **no build/compile step** — `docs/index.html` loads docsify + `playbook.css`/`playbook-paths.js` and renders Markdown/HTML at runtime. Serve it locally with:

```bash
./serve-docs.sh          # npx serve (or python http.server) on :3000
```

- **Curriculum** (`docs/week{1..4}/day{N}/`) — the 4-week study plan: `README.md`, often `EXERCISES.md` + `EXERCISE_SOLUTIONS.md`, and a `diagrams/` folder of paired `.mmd` + `.png` files. Weekend folders host the larger projects (Parking Lot, Elevator, BookMyShow, Capstone). See top-level `README.md` for the full table.
- **Cheat sheets** (`docs/cheatsheets/{lld,hld,dsa,dsa-practice,ai,concepts}/`) — hand-authored single-file HTML pages. Each category follows a strict skeleton documented in its template (`docs/cheatsheets/hld/HLD_TEMPLATE.md`, `docs/cheatsheets/ai/AI_TEMPLATE.md`). When adding one, copy the CSS `<style>` block and lightbox snippet verbatim from an existing sibling page and follow the template's numbered section order — cross-page consistency is the whole point.

## Surface 3 — Next.js web app (`web/`)

Independent Next.js 16 / React 19 / TypeScript / Tailwind app, deployed to Vercel. Its own `node_modules` and toolchain — unrelated to the Maven build.

```bash
cd web && npm run dev      # local dev server
cd web && npm run build    # production build
cd web && npm run lint     # eslint
```

## Surface 4 — Content generators & archive

- `scripts/*.py` / `scripts/*.sh` generate cheat-sheet HTML, code-listing Markdown, AI content, and DSA practice (`scripts/dsa_practice/`). They are one-shot batch tooling, not a maintained library — read the specific script before rerunning (run from the repo root, e.g. `python scripts/generate_code_md.py`), since many were written for a single content batch.
- `archive/` holds **historical, non-authoritative** files kept only for reference: `archive/status-reports/` (old `*_COMPLETE.md`/`*_STATUS.md` progress reports) and `archive/manifests/` (generator/subagent handoff notes). Do NOT treat anything under `archive/` as current spec.
- `scratch/` is gitignored throwaway (LeetCode-style C++ experiments); unrelated to the playbook.

## Overhaul workflow (when the user says "move <problem> to SDE3 quality" or similar)

`.cursor/rules/lld-study-plan.mdc` defines the mandatory workflow and tracks the top-20 priority order and which problems are already done — **consult it before picking what to work on next.** Summary:

1. **Audit** the existing impl end-to-end — list flaws, dead code, concurrency gaps.
2. **Plan** the overhaul naming specific patterns and why (vs alternatives).
3. **Refactor** to the standard package layout above. Delete dead code.
4. **Verify** with `mvn compile` and run the demo.
5. **Diagrams**: class diagram (Mermaid) + state diagram if applicable.
6. **Interview presentation** (mandatory): full SDE2/SDE3 walkthrough — clarifying questions, functional + non-functional requirements, core entities (layer + internal summary), relationships, patterns (with rationale vs alternatives), 2-3 critical implementation details, likely follow-ups, trade-offs.
7. **README.md** inside the problem folder — interview-ready reference card: one-line statement, package structure, patterns, inline Mermaid class/state diagrams, demo run command, 3-5 talking points.
8. Commit + push on `master`, then mark ✅ done in `.cursor/rules/lld-study-plan.mdc`.
