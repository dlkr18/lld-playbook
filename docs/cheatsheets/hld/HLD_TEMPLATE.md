# HLD Cheatsheet Template & Structure

This is the canonical structure we follow for every HLD cheatsheet in this
repository. Use it as the skeleton when adding a new topic.

It's a **superset of the Hello-Interview format** (Requirements → Core Entities
→ API → HLD → Deep Dives) with additional sections (Estimation, Why-It's-Hard,
Scaling, Edge Cases, Real-World, Interview Q&A) that separate a passing answer
from a senior-staff-level answer.

---

## 1. Master Section Skeleton

Numbering is intentional: the `01a`, `01b` suffixes let us insert sections
without renumbering the rest. Adopt this exact order:

```
01   Requirements                  (Functional + Non-Functional)
01a  Core Entities                 (table: object → key fields → notes)        ← Hello-Interview
01b  API Design                    (REST + internal + WS / library APIs)       ← Hello-Interview
02   Estimation                    (back-of-envelope: users, QPS, storage)
03   Why It's Hard                 (one paragraph naming the actual challenges)
04   Architecture                  (high-level ASCII box diagram + main image)
05+  Deep Dives                    (problem-specific; 4–8 sections)
N-3  Scaling                       (1× → 10× → 100×)
N-2  Edge Cases                    (failure modes, corners, ugly realities)
N-1  Real-World                    (which company does what)
N    Interview Q&A                 (10–12 expandable <details>)
```

## 2. Section purpose

| # | Section | Purpose |
|---|---|---|
| 01 | **Requirements** | Pin down scope; functional + non-functional. |
| 01a | **Core Entities** | The *nouns* of the system: domain modeling table. |
| 01b | **API Design** | The *verbs*: idempotency keys, pagination, WS shapes, delivery semantics. |
| 02 | **Estimation** | Numbers that drive design choices ("1M w/s ⇒ no Postgres"). |
| 03 | **Why It's Hard** | Names the actual challenges; one paragraph. |
| 04 | **Architecture** | The high-level box diagram + main whiteboard image. The "draw it" answer. |
| 05+ | **Deep Dives** | Interview-defining sections: a data structure, hot path, consistency story, state machine, fan-out, backpressure. |
| N-3 | **Scaling** | Sharding, replication, geo, autoscaling specific to this system. |
| N-2 | **Edge Cases** | Crashes, network flap, hot keys, clock skew, abuse, partial outages. |
| N-1 | **Real-World** | Maps to actual companies/products (anchors theory in practice). |
| N | **Interview Q&A** | 10–12 expandable follow-ups an interviewer would actually ask. |

## 3. Diagram convention

Every cheatsheet ships **three whiteboard-style diagrams**:

| File pattern | Where it goes | What it shows |
|---|---|---|
| `img/{topic}-hld.png` | Right after the hero, before section 01 | Dense main HLD covering all components |
| `img/{topic}-{concept-1}-zoom.png` | Inside the deep-dive section for concept 1 | Zoom on the hardest data structure or hot path |
| `img/{topic}-{concept-2}-zoom.png` | Inside the deep-dive section for concept 2 | Zoom on the second-hardest concept (state machine, sharding, etc.) |

**Style guide** for the `GenerateImage` prompt:
- White background, dark blue/black ink
- Colored highlights: blue, orange, green, pink, purple boxes
- Hand-drawn arrows, dashed boxes, sticky-note callouts
- Explicit numbered flow circles where there's a sequence
- A small legend at bottom for non-obvious notation
- Throughput / SLO numbers as sticky notes in the corners

Use `<div class="diagram"><img ...></div>` followed by a
`<p class="diagram-caption">...</p>` describing what's in the image.

## 4. Visual layout (rendered)

```
┌────────────────────┬─────────────────────────────────────┐
│ Fixed left nav     │ Hero (title // tags // summary)     │
│ (scroll-spy)       │                                     │
│                    │ [main HLD diagram image]            │
│ 01  Requirements   │                                     │
│ 01a Core Entities  │ 01  Requirements                    │
│ 01b API Design     │   - card: Functional                │
│ 02  Estimation     │   - card: Non-Functional            │
│ 03  Why It's Hard  │ 01a Core Entities                   │
│ 04  Architecture   │   - card: <table> entity rows       │
│ 05  Deep Dive A    │ 01b API Design                      │
│ 06  Deep Dive B    │   - card: REST + internal + WS      │
│ ...                │   - blockquote: the gotcha          │
│ Scaling            │ 02  Estimation                      │
│ Edge Cases         │   - <pre> back-of-envelope          │
│ Real-World         │ ... etc ...                         │
│ Interview Q&A      │ [zoom diagram inside its dive]      │
│                    │ N  Interview Q&A                    │
│                    │   - <details> Q1                    │
│                    │   - <details> Q2 ...                │
└────────────────────┴─────────────────────────────────────┘
```

## 5. HTML conventions

- Single self-contained `.html` per topic in `docs/cheatsheets/hld/`
- Inline `<style>` block (one minified line); shared design tokens via CSS vars
- `--accent` / `--accent2..5` colors; `--bg`, `--bg-card`, `--bg-code`, etc.
- Use existing files as the template (e.g. copy `job-scheduler.html` and edit)
- Standard component classes:
  - `.hero` — title block at the top
  - `.tag`, `.tag.orange/green/pink/purple` — pills under the title
  - `.card`, `.card.highlight` — section cards
  - `.diagram`, `.diagram-caption` — images and captions
  - `.flow > .step[data-num="N"]` — numbered sequential flow rendering
  - `<details><summary>...</summary><div class="answer">...</div></details>` — Q&A
  - `<table>` — entity/comparison tables
  - `<pre><code>` — code, ASCII diagrams, schemas

## 6. Workflow for adding a new topic

1. **Outline** against this skeleton. Decide the 4–8 deep-dive sections.
2. **Estimate** (numbers; back-of-envelope) — these drive most architecture decisions.
3. **Generate diagrams** (`GenerateImage`):
   - Main HLD
   - Two deep-dive zooms (the two most interview-worthy concepts)
4. **Copy diagrams** into `docs/cheatsheets/hld/img/`.
5. **Stamp HTML**: copy an existing cheatsheet (e.g. `job-scheduler.html`) and
   edit. Keep the section ordering and class conventions identical.
6. **Register** the new card on both index pages:
   - `docs/cheatsheets/hld/index.html` (HLD index)
   - `docs/cheatsheets/index.html` (master index)
   - Bump the `<span class="count">N topics</span>` count
   - Add a `.card.{topic}::before` gradient
7. **Commit** to `master` and **push**.
8. **Sync** to the `github-pages-deploy` worktree at
   `/Users/likhith.r/.cursor/worktrees/lld-playbook/gbe`, commit there, push.

## 7. Light Section template (paste-ready snippets)

### Core Entities

```html
<section id="coreentities">
  <h2>01a &mdash; Core Entities</h2>
  <div class="card">
    <table>
      <tr><th>Entity</th><th>Key Fields</th><th>Notes</th></tr>
      <tr><td><strong>Foo</strong></td><td>foo_id, ...</td><td>Why it matters.</td></tr>
      <!-- 6-10 rows is the sweet spot -->
    </table>
  </div>
</section>
```

### API Design

```html
<section id="api">
  <h2>01b &mdash; API Design</h2>
  <div class="card">
    <h3>Hot-path endpoint</h3>
    <pre>POST /resources
     Idempotency-Key: ...
     body: { ... }
     -&gt; 201 { ... }</pre>

    <h3>Admin / control plane</h3>
    <pre>GET    /resources/{id}
PATCH  /resources/{id}
DELETE /resources/{id}</pre>

    <blockquote>The non-obvious contract: idempotency keys / pagination cursors / response headers / delivery semantics.</blockquote>
  </div>
</section>
```

### Q&A entry

```html
<details>
  <summary>Question that an interviewer would actually ask?</summary>
  <div class="answer">Tight, opinionated 3–5 sentence answer with at least one number or specific tech name.</div>
</details>
```

## 8. Differences from Hello Interview

| Aspect | Hello Interview | Our cheatsheets |
|---|---|---|
| Requirements | ✓ | ✓ |
| Core Entities | ✓ | ✓ |
| API | ✓ | ✓ |
| HLD | ✓ | ✓ (called "Architecture") |
| Deep Dives | ✓ | ✓ (4–8 per topic) |
| Estimation | mixed into NFRs | dedicated section |
| Why It's Hard | implicit | explicit section |
| Scaling | inside deep dives | dedicated section |
| Edge Cases | informal | dedicated section |
| Real-World mapping | informal | dedicated section |
| Interview Q&A | the live interview | dedicated section (10–12 written follow-ups) |

The added sections are what separate "passes the bar" from "could lead the
project" in senior interviews.

## 9. Algorithmic topics

For purely algorithmic topics (e.g. Consistent Hashing), **skip Core Entities
and API Design** — they aren't natural framings for a hash function. Keep the
rest. We've already done this for `consistent-hashing.html`.

## 10. Naming conventions

- File: kebab-case, descriptive: `fb-live-comments.html`, `job-scheduler.html`
- Images: `{file-stem}-hld.png`, `{file-stem}-{concept}-zoom.png`
- Section IDs: lowercase, no spaces, semantic: `requirements`, `coreentities`,
  `api`, `estimation`, `architecture`, `interview`, etc.
- Card gradient class: `.card.{short-topic}::before` with a 2-color
  `linear-gradient(90deg, ..., ...)`
