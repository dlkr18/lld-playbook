# Learning Platform (Coursera-style) — SDE2/SDE3 Interview Walkthrough

A full 70–100 minute walkthrough: clarify → requirements → entities →
relationships → patterns (with rationale) → key implementations → follow-ups →
trade-offs.

> Three defects that all share one root: **state nobody validated.** Assessments
> returned `Math.random()`, `completeLesson` accepted any two strings and returned
> `true`, and three of four `EnrollmentStatus` values were unreachable. Each made
> the system *look* like it worked.

---

## 1. Clarifying Questions (first 5 minutes)

1. **What's actually graded?** Auto-graded multiple choice here. Free-text and peer
   review are different problems (a grading queue, rubrics, human workflow).
2. **Is grading deterministic?** It must be — same answers, same score, every time.
   Sounds obvious; it wasn't true (§7.1).
3. **Can a student progress in a course they aren't enrolled in?** No, and that has
   to be *enforced*, not assumed (§7.2).
4. **What's the enrollment lifecycle?** Enrolled → dropped, or → completed. If a
   status can't be reached through the API, it isn't a lifecycle, it's decoration
   (§7.3).
5. **Course capacity?** Optional cap, and a drop must free a seat.
6. **What counts as course completion?** All lessons done. Whether quizzes must be
   *passed* too is a policy question worth asking.
7. **Can a student retake a quiz?** Yes here, unlimited, best-effort recorded. Real
   platforms cap attempts.

---

## 2. Functional Requirements

- Create courses with lessons, an instructor, and an optional capacity.
- Enroll a student; reject duplicates and over-capacity enrollment.
- Mark lessons complete; report percentage progress.
- Register quizzes and **grade submissions against an answer key**.
- Drop an enrollment (freeing a seat); complete a course once all lessons are done.
- Search courses by keyword.

## 3. Non-Functional Requirements

- **Grading is deterministic and derived from the submitted answers.**
- **No progress without an active enrollment.**
- Every `EnrollmentStatus` reachable through the API, or removed.
- Capacity respected under concurrent enrollment.
- Answer keys never exposed to student-facing callers.

---

## 4. Core Entities

| Entity | Layer | Internal summary |
|--------|-------|------------------|
| `Course` | model | `id`, title, description, instructor, ordered `Lesson`s, `maxCapacity` (−1 = unlimited). |
| `Lesson` | model | `id`, title — the unit of progress. |
| `Question` | model | Text, options, and **its own answer key**. Validates that the key is one of the options. `getCorrectAnswer()` is package-private so it can't leak. |
| `Quiz` | model | `quizId`, `courseId`, ordered `Question`s, `passPercent`. Owns `grade(studentId, answers)`. |
| `AssessmentResult` | model | Student, assessment, score, passed, timestamp. |
| `Enrollment` | model | Student, course, `enrolledAt`, `EnrollmentStatus`. |
| `EnrollmentStatus` | model (enum) | `ACTIVE`, `COMPLETED`, `DROPPED`, `SUSPENDED`. |
| `Student` / `Instructor` | model | Participants. |
| `LearningPlatformService` | service (interface) | The contract. |
| `InMemoryLearningPlatformService` | service/impl | Registries, validation, lifecycle. |
| `LearningPlatform` | root | Facade. |

**Deleted as dead code:** `Assignment` — an id-only stub with zero references.

---

## 5. Relationships

- `Course` **owns** its `Lesson`s; a `Quiz` **references** a course by id.
- `Enrollment` is the **join entity** between student and course, and it is where
  the lifecycle lives — not a boolean on either side.
- The service keeps four indexes: `courses`, `enrollments` (id → enrollment),
  `studentEnrollments` (student → enrollment ids), `lessonProgress`
  (student → lesson → done), plus `quizzes`.
- **`Quiz` owns grading, not the service.** The answer key and the scoring rule sit
  together on the object that has the data — the service only resolves ids and checks
  authorization.
- **Progress is derived**, not stored: `completed lessons / total lessons`. A stored
  percentage would drift the moment a lesson is added to the course.

---

## 6. Design Patterns (name + why vs alternatives)

- **Information Expert (GRASP) — `Quiz.grade()`.** The object holding the answer key
  computes the score. *Alternative:* grading logic in the service, reaching into the
  quiz for its key — rejected: it forces the key to be public, and the key is the one
  thing that must not escape.
- **Derived state — progress.** Same principle as `cricinfo`'s ball-by-ball scoring:
  compute from the source of truth so the two cannot disagree.
- **Join entity — `Enrollment`.** Carries the relationship *and* its state
  (`enrolledAt`, status). *Alternative:* a `Set<String> enrolledCourses` on
  `Student` — rejected: nowhere to hang the status or the timestamp.
- **Facade — `LearningPlatform`.**
- **Guarded state transitions** — `completeCourse` refuses below 100%, so
  `COMPLETED` means something.
- *(Considered, not built)* **Strategy for grading** — free-text, partial credit, and
  negative marking are the obvious variants, and `Quiz.grade` is the seam. Not built
  because there is one grading rule today and an interface with one implementation is
  the pattern this playbook keeps deleting.
- *(Considered, not built)* **Observer** for completion certificates / notifications
  on `completeCourse`.

---

## 7. Key Implementation Details

### 7.1 Assessments returned a random score (the headline)

```java
public AssessmentResult submitAssessment(String studentId, String assessmentId, List<String> answers) {
    // Simplified assessment logic
    int score = (int) (Math.random() * 100);
    boolean passed = score >= 60;
    return new AssessmentResult(studentId, assessmentId, score, passed);
}
```

The `answers` parameter is accepted and **never read**. The same student submitting
the same answers twice got different marks; a blank submission passed 40% of the
time; a perfect submission failed 60% of the time.

It couldn't have worked, because `Quiz` was a stub holding nothing but an id — there
was no answer key anywhere in the model. So the fix is a model fix first:

```java
public AssessmentResult grade(String studentId, List<String> answers) {
    int correct = 0;
    for (int i = 0; i < questions.size(); i++) {
        String answer = i < given.size() ? given.get(i) : null;
        if (questions.get(i).isCorrect(answer)) correct++;
    }
    int score = (int) Math.round((correct * 100.0) / questions.size());
    return new AssessmentResult(studentId, quizId, score, score >= passPercent);
}
```

Verified:

| submission | score | passed |
|---|---|---|
| all 4 correct | 100 | true |
| **same answers again** | **100** | deterministic |
| 2 of 4 | 50 | false |
| blank | 0 | false |

Two decisions in `grade` worth defending out loud:

- **A short submission is graded, not rejected** — an unanswered question is simply
  wrong. That matches how a real quiz behaves.
- **A submission with *more* answers than questions throws.** Silently ignoring the
  extras would hide a client bug, and the asymmetry is deliberate: missing data is a
  student's choice, excess data is a defect.

`Question` validates that its correct answer is one of its own options, so a quiz
with an ungradeable question can't be constructed. And `getCorrectAnswer()` is
package-private — the key is reachable by `Quiz` for grading and by nothing else.

### 7.2 `completeLesson` validated nothing

```java
public boolean completeLesson(String studentId, String lessonId) {
    lessonProgress.computeIfAbsent(studentId, k -> new ConcurrentHashMap<>()).put(lessonId, true);
    return true;                                    // always
}
```

Any two strings were accepted. A student who had never enrolled could complete
lessons; a typo'd lesson id was recorded as progress against a lesson that doesn't
exist. `getProgress` then counted those phantom completions as real.

The `return true` is the tell: **a boolean return that is always `true` is not a
result, it's decoration.** It gives callers the *shape* of error handling with none
of the substance.

Now it resolves the lesson to its owning course and requires an active enrollment:

```
completeLesson("ghost", "L1")            -> Student ghost has no active enrollment in course C1
completeLesson("stu1", "no-such-lesson") -> Lesson not found: no-such-lesson
ghost progress                            -> 0.0%
```

### 7.3 Three of four enrollment statuses were unreachable

`EnrollmentStatus` declared `ACTIVE`, `COMPLETED`, `DROPPED`, `SUSPENDED`.
`Enrollment` had a `setStatus`. But **no service method ever called it** — every
enrollment was created `ACTIVE` and stayed `ACTIVE` forever. There was no way to
drop a course.

That's worse than not having the enum: the type advertises a lifecycle that the
system does not implement, so a reader reasonably assumes drops are handled.

Added `dropEnrollment` and `completeCourse`, with `COMPLETED` guarded on real
progress:

```java
double progress = getProgress(studentId, courseId);
if (progress < 100.0) throw new IllegalStateException("Course is only " + ... + "% complete");
```

And dropping genuinely frees a seat — the capacity check counts only `ACTIVE`
enrollments:

```
capacity 1: s1 enrolls, s2 refused
s1 drops -> s2 enrolls OK, s1 = DROPPED
```

`SUSPENDED` remains unreachable. I left the constant rather than inventing a
suspension workflow nobody asked for — but that's a decision to state, not to leave
implicit. The honest options are "implement it" or "delete it"; the one thing not to
do is leave it looking supported.

### 7.4 Smaller corrections

- `createCourse` used `put`, silently overwriting an existing course (and orphaning
  every enrollment pointing at it). Now `putIfAbsent` + throw.
- `getEnrolledCourses` returned courses for *dropped* enrollments too, since it never
  filtered on status.
- `submitAssessment` now also checks the student is enrolled in the quiz's course.

---

## 8. Likely Follow-ups (with concise answers)

- **Capacity under concurrent enrollment?** `enrollStudent` is `synchronized`, so the
  count-then-insert is atomic — the same check-then-act shape as `restaurant`'s
  double-seating. It's also O(all enrollments) per call, since it streams the whole
  map filtering by course; a per-course `AtomicInteger` of active enrollments would
  make it O(1). Worth naming as the first thing to fix at scale.
- **Retake limits and best-score policy?** Store `AssessmentResult`s per
  (student, quiz) rather than returning and discarding them, then apply a policy:
  best, latest, or first-N-attempts. Currently results aren't persisted at all.
- **Should passing a quiz be required to complete a course?** Today only lessons
  count. Making it `all lessons done AND all required quizzes passed` is a one-line
  change to `completeCourse` — and exactly the sort of policy to confirm rather than
  assume.
- **Free-text / peer-graded answers?** `Quiz.grade` becomes a Strategy; free-text
  needs a grading queue and human workflow, which is a different system.
- **Ordered prerequisites?** Lessons are a list but any lesson can be completed at
  any time. Enforcing order means checking that all prior lessons are done — or a
  DAG if prerequisites are non-linear.
- **Cheating / key exposure?** The key never leaves `Quiz` (package-private
  accessor), but a real system also shuffles options, times submissions, and never
  ships the key to the client.
- **Scale?** `courseOwningLesson` scans every course's lessons — fine in memory,
  wrong at scale. A `lessonId → courseId` index makes it O(1); the scan is the honest
  simple version and the index is the obvious follow-up.
- **How would you test it?** The harness used here: identical answers score
  identically (determinism), a blank submission scores 0, a non-enrolled student
  can't complete a lesson, `completeCourse` fails below 100%, and a drop frees a
  capacity slot.

---

## 9. Trade-offs

- **Grading on `Quiz` vs a grading service:** keeps the answer key encapsulated, at
  the cost of `Quiz` doing more than hold data. The alternative forces the key
  public, which is worse.
- **Positional answer matching:** simple and matches the existing `List<String>` API,
  but brittle — a client that reorders questions silently mis-grades. Answer *maps*
  keyed by question id would be robust; positional is the simpler contract and the
  one the existing signature implies.
- **Derived progress:** always consistent with completions, at O(lessons) per query.
  A cached count would be O(1) and would need invalidating whenever a course changes.
- **`courseOwningLesson` linear scan:** correct and trivially obviously so; O(courses
  × lessons). An index is the fix, deferred deliberately rather than pre-built.
- **Capacity counted by streaming all enrollments:** no extra state to keep
  consistent, but O(n) per enrollment. The counter is faster and is one more thing
  that can drift.
- **`SUSPENDED` left unreachable:** documented rather than silently tolerated. I'd
  rather flag a known gap than invent a workflow to justify an enum constant.
- **Unlimited retakes, results not persisted:** simplest possible thing, and clearly
  wrong for a real platform — both are named in §8 instead of being hidden behind a
  passing demo.
