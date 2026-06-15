# Learning Platform — LLD

Design Coursera-like courses: enrollment, lesson progress, assessments, search.

## Package Structure

```
learningplatform/
  model/          Course, Lesson, Enrollment, Progress, Quiz, Student, Instructor
  service/        LearningPlatformService
  service/impl/   InMemoryLearningPlatformService
  LearningPlatform.java   Facade
  LearningPlatformDemo.java
```

## Design Patterns

| Pattern | Where | Why |
|---------|-------|-----|
| **Facade** | `LearningPlatform` | Single interview entry for enroll → progress → assess flow. |
| **Repository-style** | In-memory course/enrollment maps | Swap for DB without changing facade contract. |

## Run Demo

```bash
mvn -q compile exec:java -Dexec.mainClass="com.you.lld.problems.learningplatform.LearningPlatformDemo"
```

## Key Talking Points

- **Progress = completedLessons / totalLessons** — percentage per enrollment.
- **Enrollment guard** — reject duplicate enroll; validate course exists.
- **Assessment** decoupled from lessons — quiz ID lookup, answer validation.
