# LLD Playbook

<p class="hero-lead">Interview-ready low-level design — Java implementations, design patterns, and searchable cheat sheets for SDE2/SDE3 rounds.</p>

<div class="hub-cards">

<a class="hub-card accent-lld" href="cheatsheets/lld/index.html">
<span class="hub-label">45 problems</span>
<strong>LLD Cheat Sheets</strong>
<p>State, Strategy, Observer — parking lot to rate limiter</p>
</a>

<a class="hub-card accent-hld" href="cheatsheets/hld/hub.html">
<span class="hub-label">63 topics</span>
<strong>HLD Cheat Sheets</strong>
<p>Systems, concepts, Kafka, sharding, CAP</p>
</a>

<a class="hub-card accent-dsa" href="cheatsheets/dsa/index.html">
<span class="hub-label">23 topics</span>
<strong>DSA Cheat Sheets</strong>
<p>Patterns, templates, complexity quick reference</p>
</a>

<a class="hub-card accent-ai" href="cheatsheets/ai/index.html">
<span class="hub-label">45 topics</span>
<strong>AI / LLMs / Agents</strong>
<p>RAG, LangGraph, vector DBs, fine-tuning</p>
</a>

</div>

<div class="stat-grid">
<div class="stat-chip"><span class="stat-num">44</span><span class="stat-label">Java problems</span></div>
<div class="stat-chip"><span class="stat-num">170+</span><span class="stat-label">Cheat sheets</span></div>
<div class="stat-chip"><span class="stat-num">23</span><span class="stat-label">Patterns</span></div>
<div class="stat-chip"><span class="stat-num">4 wk</span><span class="stat-label">Curriculum</span></div>
</div>

## Start here

| Step | What to do | Go |
|:--:|------------|-----|
| 1 | Clone repo, run demos, understand layout | [Getting Started](getting-started) |
| 2 | Follow the structured study plan | [4-Week Plan](PLAN) → [Week 1](week1/day1/README) |
| 3 | Read code walkthroughs for all problems | [Master Guide](problems/ALL_PROBLEMS_MASTER_GUIDE) |
| 4 | Quick visual reference before interviews | [Cheat Sheets](cheatsheets/index.html ':ignore') |

## Priority problems

Study these first — patterns compound. Full list in the [Master Guide](problems/ALL_PROBLEMS_MASTER_GUIDE).

| Problem | Pattern | Code | Sheet |
|---------|---------|:----:|:-----:|
| Parking Lot | Composite + Strategy | [README](problems/parkinglot/README) | [LLD](cheatsheets/parkinglot.html ':ignore') |
| Vending Machine | State | [CODE](problems/vendingmachine/CODE) | [LLD](cheatsheets/vendingmachine.html ':ignore') |
| LRU Cache | HashMap + DLL | [README](problems/lrucache/README) | [LLD](cheatsheets/lrucache.html ':ignore') |
| Rate Limiter | Token bucket | [CODE](problems/ratelimiter/CODE) | [LLD](cheatsheets/ratelimiter.html ':ignore') |
| ATM | State + Chain | [CODE](problems/atm/CODE) | [LLD](cheatsheets/atm.html ':ignore') |
| BookMyShow | Concurrency + TTL | [README](problems/bookmyshow/README) | [LLD](cheatsheets/bookmyshow.html ':ignore') |
| Pub/Sub | Observer | [CODE](problems/pubsub/CODE) | [LLD](cheatsheets/pubsub.html ':ignore') |
| Elevator | SCAN scheduling | [weekend](week2/weekend/README) | [LLD](cheatsheets/elevator.html ':ignore') |
| Splitwise | Graph + money | [day16](week4/day16/README) | [LLD](cheatsheets/splitwise.html ':ignore') |
| Stack Overflow | Strategy + Observer | [README](problems/stackoverflow/README) | [LLD](cheatsheets/stackoverflow.html ':ignore') |

## 4-week path

| Week | Focus | Start | Weekend project |
|:--:|-------|-------|-----------------|
| **1** | SOLID, UML, domain modeling | [Week 1](week1/README) | [Parking Lot](week1/weekend/README) |
| **2** | Creational, structural, behavioral patterns | [Week 2](week2/README) | [Elevator](week2/weekend/README) |
| **3** | Rate limiter, KV store, search, notifications | [Week 3](week3/README) | [BookMyShow](week3/weekend/README) |
| **4** | Splitwise, chess, mocks, capstone | [Week 4](week4/README) | [Capstone](week4/weekend/README) |

## Reference

- [Design Patterns Catalog](foundations/DESIGN_PATTERNS_CATALOG) — all 23 patterns with Java examples
- [Java Class Diagram Guidelines](foundations/JAVA_CLASS_DIAGRAM_GUIDELINES) — what to draw on the whiteboard

<p class="page-footer">Built for interview prep. Run <code>mvn -q compile</code> in the repo to verify any problem.</p>
