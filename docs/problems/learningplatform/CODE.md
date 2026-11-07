# learningplatform - Complete Implementation

> Generated from `src/main/java/com/you/lld/problems/learningplatform/` on 2026-11-07. Re-run `python3 scripts/generate-code-md.py learningplatform`.

## Project Structure (16 files)

```
learningplatform/
├── LearningPlatformDemo.java
├── LearningPlatform.java
├── model/AssessmentResult.java
├── model/Course.java
├── model/Enrollment.java
├── model/EnrollmentStatus.java
├── model/Instructor.java
├── model/Lesson.java
├── model/Progress.java
├── model/Question.java
├── model/Quiz.java
├── model/Student.java
├── service/LearningPlatformService.java
├── service/impl/InMemoryLearningPlatformService.java
├── exceptions/CourseNotFoundException.java
├── exceptions/EnrollmentException.java
```

## Source Code

### `LearningPlatformDemo.java`

<details>
<summary>Click to view LearningPlatformDemo.java</summary>

```java
package com.you.lld.problems.learningplatform;

import com.you.lld.problems.learningplatform.model.*;
import com.you.lld.problems.learningplatform.model.Lesson;

/**
 * SDE3 demo: enrollment, progress tracking, course search, assessment submission.
 */
public class LearningPlatformDemo {

    public static void main(String[] args) {
        System.out.println("=== Learning Platform (SDE3) ===\n");
        LearningPlatform platform = new LearningPlatform();

        // 1. Course catalog
        System.out.println("--- 1. Course catalog ---");
        Course javaBasics = new Course("C1", "Java Basics");
        javaBasics.setDescription("Learn Java from scratch");
        javaBasics.setInstructorId("inst-1");
        javaBasics.addLesson(new Lesson("L1", "Variables"));
        javaBasics.addLesson(new Lesson("L2", "Control Flow"));
        javaBasics.addLesson(new Lesson("L3", "OOP"));

        Course patterns = new Course("C2", "Design Patterns");
        patterns.addLesson(new Lesson("L4", "Singleton"));
        patterns.addLesson(new Lesson("L5", "Factory"));

        String c1 = platform.createCourse(javaBasics);
        String c2 = platform.createCourse(patterns);
        System.out.println("Created: " + c1 + ", " + c2);

        // 2. Enrollment
        System.out.println("\n--- 2. Enrollment ---");
        platform.enrollStudent("student-1", c1);
        platform.enrollStudent("student-1", c2);
        platform.enrollStudent("student-2", c1);
        System.out.println("student-1 courses: " + platform.getEnrolledCourses("student-1").size());

        // 3. Progress tracking
        System.out.println("\n--- 3. Progress ---");
        platform.completeLesson("student-1", "L1");
        platform.completeLesson("student-1", "L2");
        System.out.printf("Progress after 2/3 lessons: %.0f%%%n",
                platform.getProgress("student-1", c1));
        platform.completeLesson("student-1", "L3");
        System.out.printf("Progress complete: %.0f%%%n",
                platform.getProgress("student-1", c1));

        // 4. Search
        System.out.println("\n--- 4. Search ---");
        for (Course c : platform.searchCourses("Pattern")) {
            System.out.println("  Found: " + c.getTitle());
        }

        // 5. Assessment — graded against a real answer key
        System.out.println("\n--- 5. Assessment (graded, not random) ---");
        Quiz quiz = new Quiz("quiz-1", c1, java.util.Arrays.asList(
                new Question("q1", "Money in Java?",
                        java.util.Arrays.asList("double", "BigDecimal"), "BigDecimal"),
                new Question("q2", "One implementation needs an interface?",
                        java.util.Arrays.asList("yes", "no"), "no"),
                new Question("q3", "Bloom filter supports delete?",
                        java.util.Arrays.asList("yes", "no"), "no"),
                new Question("q4", "Best structure for prefix search?",
                        java.util.Arrays.asList("Trie", "LinkedList"), "Trie")));
        platform.addQuiz(quiz);

        AssessmentResult perfect = platform.submitAssessment("student-1", "quiz-1",
                java.util.Arrays.asList("BigDecimal", "no", "no", "Trie"));
        AssessmentResult partial = platform.submitAssessment("student-1", "quiz-1",
                java.util.Arrays.asList("double", "no", "yes", "Trie"));
        AssessmentResult blank = platform.submitAssessment("student-1", "quiz-1",
                java.util.Collections.<String>emptyList());
        System.out.println("  all correct: " + perfect.getScore() + "% passed=" + perfect.isPassed());
        System.out.println("  2 of 4:      " + partial.getScore() + "% passed=" + partial.isPassed());
        System.out.println("  blank:       " + blank.getScore() + "% passed=" + blank.isPassed());
        System.out.println("  resubmitting the same answers scores "
                + platform.submitAssessment("student-1", "quiz-1",
                        java.util.Arrays.asList("BigDecimal", "no", "no", "Trie")).getScore()
                + "% again (deterministic)");

        // 6. Enrollment lifecycle
        System.out.println("\n--- 6. Enrollment lifecycle ---");
        System.out.println("  status: " + platform.getEnrollmentStatus("student-1", c1));
        try {
            platform.completeCourse("student-1", c2);
        } catch (RuntimeException e) {
            System.out.println("  completeCourse before finishing: " + e.getMessage());
        }
        platform.dropEnrollment("student-1", c2);
        System.out.println("  after drop: " + platform.getEnrollmentStatus("student-1", c2));

        System.out.println("\n=== Demo complete ===");
    }
}
```

</details>

### `LearningPlatform.java`

<details>
<summary>Click to view LearningPlatform.java</summary>

```java
package com.you.lld.problems.learningplatform;

import com.you.lld.problems.learningplatform.model.AssessmentResult;
import com.you.lld.problems.learningplatform.model.EnrollmentStatus;
import com.you.lld.problems.learningplatform.model.Quiz;
import com.you.lld.problems.learningplatform.model.Course;
import com.you.lld.problems.learningplatform.service.LearningPlatformService;
import com.you.lld.problems.learningplatform.service.impl.InMemoryLearningPlatformService;

import java.util.List;

/** Facade for online courses — enrollment, progress, assessments. */
public class LearningPlatform {
    private final LearningPlatformService service;

    public LearningPlatform() {
        this(new InMemoryLearningPlatformService());
    }

    public LearningPlatform(LearningPlatformService service) {
        this.service = service;
    }

    public String createCourse(Course course) {
        return service.createCourse(course);
    }

    public void enrollStudent(String studentId, String courseId) {
        service.enrollStudent(studentId, courseId);
    }

    public void completeLesson(String studentId, String lessonId) {
        service.completeLesson(studentId, lessonId);
    }

    public double getProgress(String studentId, String courseId) {
        return service.getProgress(studentId, courseId);
    }

    public void addQuiz(Quiz quiz) {
        service.addQuiz(quiz);
    }

    public void dropEnrollment(String studentId, String courseId) {
        service.dropEnrollment(studentId, courseId);
    }

    public void completeCourse(String studentId, String courseId) {
        service.completeCourse(studentId, courseId);
    }

    public EnrollmentStatus getEnrollmentStatus(String studentId, String courseId) {
        return service.getEnrollmentStatus(studentId, courseId);
    }

    public AssessmentResult submitAssessment(String studentId, String quizId,
                                             List<String> answers) {
        return service.submitAssessment(studentId, quizId, answers);
    }

    public List<Course> getEnrolledCourses(String studentId) {
        return service.getEnrolledCourses(studentId);
    }

    public List<Course> searchCourses(String keyword) {
        return service.searchCourses(keyword);
    }
}
```

</details>

### `model/AssessmentResult.java`

<details>
<summary>Click to view model/AssessmentResult.java</summary>

```java
package com.you.lld.problems.learningplatform.model;

import java.time.LocalDateTime;

/**
 * Represents the result of an assessment submission.
 */
public class AssessmentResult {
    private final String studentId;
    private final String assessmentId;
    private final int score;
    private final boolean passed;
    private final LocalDateTime submittedAt;
    
    public AssessmentResult(String studentId, String assessmentId, int score, boolean passed) {
        this.studentId = studentId;
        this.assessmentId = assessmentId;
        this.score = score;
        this.passed = passed;
        this.submittedAt = LocalDateTime.now();
    }
    
    public String getStudentId() {
        return studentId;
    }
    
    public String getAssessmentId() {
        return assessmentId;
    }
    
    public int getScore() {
        return score;
    }
    
    public boolean isPassed() {
        return passed;
    }
    
    public LocalDateTime getSubmittedAt() {
        return submittedAt;
    }
}
```

</details>

### `model/Course.java`

<details>
<summary>Click to view model/Course.java</summary>

```java
package com.you.lld.problems.learningplatform.model;

import java.time.LocalDateTime;
import java.util.*;

/**
 * Represents a course in the learning platform.
 */
public class Course {
    private final String id;
    private String title;
    private String description;
    private String instructorId;
    private List<Lesson> lessons;
    private LocalDateTime createdAt;
    private int maxCapacity; // -1 means unlimited
    
    public Course(String id, String title) {
        this.id = id;
        this.title = title;
        this.lessons = new ArrayList<>();
        this.createdAt = LocalDateTime.now();
        this.maxCapacity = -1; // unlimited by default
    }
    
    public String getId() {
        return id;
    }
    
    public String getTitle() {
        return title;
    }
    
    public void setTitle(String title) {
        this.title = title;
    }
    
    public String getDescription() {
        return description;
    }
    
    public void setDescription(String description) {
        this.description = description;
    }
    
    public String getInstructorId() {
        return instructorId;
    }
    
    public void setInstructorId(String instructorId) {
        this.instructorId = instructorId;
    }
    
    public List<Lesson> getLessons() {
        return new ArrayList<>(lessons);
    }
    
    public void addLesson(Lesson lesson) {
        lessons.add(lesson);
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public int getMaxCapacity() {
        return maxCapacity;
    }
    
    public void setMaxCapacity(int maxCapacity) {
        this.maxCapacity = maxCapacity;
    }
}
```

</details>

### `model/Enrollment.java`

<details>
<summary>Click to view model/Enrollment.java</summary>

```java
package com.you.lld.problems.learningplatform.model;

import java.time.LocalDateTime;

/**
 * Represents a student's enrollment in a course.
 */
public class Enrollment {
    private final String id;
    private final String studentId;
    private final String courseId;
    private final LocalDateTime enrolledAt;
    private EnrollmentStatus status;
    
    public Enrollment(String id, String studentId, String courseId) {
        this.id = id;
        this.studentId = studentId;
        this.courseId = courseId;
        this.enrolledAt = LocalDateTime.now();
        this.status = EnrollmentStatus.ACTIVE;
    }
    
    public String getId() {
        return id;
    }
    
    public String getStudentId() {
        return studentId;
    }
    
    public String getCourseId() {
        return courseId;
    }
    
    public LocalDateTime getEnrolledAt() {
        return enrolledAt;
    }
    
    public EnrollmentStatus getStatus() {
        return status;
    }
    
    public void setStatus(EnrollmentStatus status) {
        this.status = status;
    }
}
```

</details>

### `model/EnrollmentStatus.java`

<details>
<summary>Click to view model/EnrollmentStatus.java</summary>

```java
package com.you.lld.problems.learningplatform.model;

/**
 * Status of a student's enrollment.
 */
public enum EnrollmentStatus {
    ACTIVE,
    COMPLETED,
    DROPPED,
    SUSPENDED
}
```

</details>

### `model/Instructor.java`

<details>
<summary>Click to view model/Instructor.java</summary>

```java
package com.you.lld.problems.learningplatform.model;
import java.util.*;
public
class Instructor  {
    private String instructorId;
    public Instructor(String id)  {
        instructorId=id;
    }
    public String getInstructorId()  {
        return instructorId;
    }
}
```

</details>

### `model/Lesson.java`

<details>
<summary>Click to view model/Lesson.java</summary>

```java
package com.you.lld.problems.learningplatform.model;

import java.time.Duration;

/**
 * Represents a lesson within a course.
 */
public class Lesson {
    private final String id;
    private String title;
    private String content;
    private String videoUrl;
    private Duration duration;
    private int orderIndex;
    
    public Lesson(String id, String title) {
        this.id = id;
        this.title = title;
    }
    
    public String getId() {
        return id;
    }
    
    public String getTitle() {
        return title;
    }
    
    public void setTitle(String title) {
        this.title = title;
    }
    
    public String getContent() {
        return content;
    }
    
    public void setContent(String content) {
        this.content = content;
    }
    
    public String getVideoUrl() {
        return videoUrl;
    }
    
    public void setVideoUrl(String videoUrl) {
        this.videoUrl = videoUrl;
    }
    
    public Duration getDuration() {
        return duration;
    }
    
    public void setDuration(Duration duration) {
        this.duration = duration;
    }
    
    public int getOrderIndex() {
        return orderIndex;
    }
    
    public void setOrderIndex(int orderIndex) {
        this.orderIndex = orderIndex;
    }
}
```

</details>

### `model/Progress.java`

<details>
<summary>Click to view model/Progress.java</summary>

```java
package com.you.lld.problems.learningplatform.model;
import java.util.*;
public
class Progress  {
    private String progressId;
    public Progress(String id)  {
        progressId=id;
    }
    public String getProgressId()  {
        return progressId;
    }
}
```

</details>

### `model/Question.java`

<details>
<summary>Click to view model/Question.java</summary>

```java
package com.you.lld.problems.learningplatform.model;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

/**
 * One multiple-choice question and its answer key.
 *
 * <p>The key lives on the question rather than in a parallel structure, so a quiz
 * cannot be constructed with answers that don't line up with its questions.
 */
public final class Question {

    private final String id;
    private final String text;
    private final List<String> options;
    private final String correctAnswer;

    public Question(String id, String text, List<String> options, String correctAnswer) {
        if (id == null || id.trim().isEmpty()) {
            throw new IllegalArgumentException("Question id required");
        }
        if (options == null || options.size() < 2) {
            throw new IllegalArgumentException("A question needs at least two options");
        }
        if (correctAnswer == null || !options.contains(correctAnswer)) {
            throw new IllegalArgumentException(
                    "Correct answer must be one of the options, got: " + correctAnswer);
        }
        this.id = id;
        this.text = text;
        this.options = Collections.unmodifiableList(new ArrayList<String>(options));
        this.correctAnswer = correctAnswer;
    }

    public boolean isCorrect(String answer) {
        return correctAnswer.equals(answer);
    }

    public String getId() {
        return id;
    }

    public String getText() {
        return text;
    }

    public List<String> getOptions() {
        return options;
    }

    /** Package-visible on purpose: the key should not leak to a student-facing caller. */
    String getCorrectAnswer() {
        return correctAnswer;
    }

    @Override
    public String toString() {
        return id + ": " + text;
    }
}
```

</details>

### `model/Quiz.java`

<details>
<summary>Click to view model/Quiz.java</summary>

```java
package com.you.lld.problems.learningplatform.model;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

/**
 * A graded assessment: ordered questions, each with its own answer key.
 *
 * <p>This was previously a stub holding only an id, with nothing referencing it —
 * which is why {@code submitAssessment} could do no better than return a random
 * score. Grading needs an answer key, so the key has to live somewhere.
 */
public final class Quiz {

    public static final int DEFAULT_PASS_PERCENT = 60;

    private final String quizId;
    private final String courseId;
    private final List<Question> questions;
    private final int passPercent;

    public Quiz(String quizId, String courseId, List<Question> questions) {
        this(quizId, courseId, questions, DEFAULT_PASS_PERCENT);
    }

    public Quiz(String quizId, String courseId, List<Question> questions, int passPercent) {
        if (quizId == null || quizId.trim().isEmpty()) {
            throw new IllegalArgumentException("Quiz id required");
        }
        if (questions == null || questions.isEmpty()) {
            throw new IllegalArgumentException("A quiz needs at least one question");
        }
        if (passPercent < 0 || passPercent > 100) {
            throw new IllegalArgumentException("passPercent must be 0-100, got " + passPercent);
        }
        this.quizId = quizId;
        this.courseId = courseId;
        this.questions = Collections.unmodifiableList(new ArrayList<Question>(questions));
        this.passPercent = passPercent;
    }

    /**
     * Grades a submission, answers positionally matched to questions.
     *
     * <p>A short submission is graded on what was answered rather than rejected —
     * an unanswered question is simply wrong. A submission with <em>more</em> answers
     * than questions is a client bug and is rejected, because silently ignoring the
     * extras would hide it.
     */
    public AssessmentResult grade(String studentId, List<String> answers) {
        List<String> given = answers == null ? Collections.<String>emptyList() : answers;
        if (given.size() > questions.size()) {
            throw new IllegalArgumentException("Submitted " + given.size()
                    + " answers for a quiz with " + questions.size() + " questions");
        }
        int correct = 0;
        for (int i = 0; i < questions.size(); i++) {
            String answer = i < given.size() ? given.get(i) : null;
            if (questions.get(i).isCorrect(answer)) {
                correct++;
            }
        }
        int score = (int) Math.round((correct * 100.0) / questions.size());
        return new AssessmentResult(studentId, quizId, score, score >= passPercent);
    }

    public String getQuizId() {
        return quizId;
    }

    public String getCourseId() {
        return courseId;
    }

    public List<Question> getQuestions() {
        return questions;
    }

    public int getPassPercent() {
        return passPercent;
    }

    public int getQuestionCount() {
        return questions.size();
    }
}
```

</details>

### `model/Student.java`

<details>
<summary>Click to view model/Student.java</summary>

```java
package com.you.lld.problems.learningplatform.model;
import java.util.*;
public
class Student  {
    private String studentId;
    public Student(String id)  {
        studentId=id;
    }
    public String getStudentId()  {
        return studentId;
    }
}
```

</details>

### `service/LearningPlatformService.java`

<details>
<summary>Click to view service/LearningPlatformService.java</summary>

```java
package com.you.lld.problems.learningplatform.service;

import com.you.lld.problems.learningplatform.model.*;

import java.util.List;

/**
 * Service interface for online learning platform.
 * Supports courses, enrollments, lessons, and progress tracking.
 */
public interface LearningPlatformService {
    
    /**
     * Creates a new course.
     * 
     * @param course Course to create
     * @return Created course ID
     */
    String createCourse(Course course);
    
    /**
     * Gets a course by ID.
     * 
     * @param courseId Course ID
     * @return Course if found
     */
    Course getCourse(String courseId);
    
    /**
     * Enrolls a student in a course.
     * 
     * @param studentId Student ID
     * @param courseId Course ID
     * @return Enrollment ID
     */
    String enrollStudent(String studentId, String courseId);
    
    /**
     * Marks a lesson as completed for a student.
     * 
     * @param studentId Student ID
     * @param lessonId Lesson ID
     * @return true if marked successfully
     */
    boolean completeLesson(String studentId, String lessonId);
    
    /**
     * Gets student's progress in a course.
     * 
     * @param studentId Student ID
     * @param courseId Course ID
     * @return Progress percentage (0-100)
     */
    double getProgress(String studentId, String courseId);
    
    /**
     * Submits an assessment.
     * 
     * @param studentId Student ID
     * @param assessmentId Assessment ID
     * @param answers Student answers
     * @return Assessment result
     */
    /** Registers a quiz so submissions against it can actually be graded. */
    void addQuiz(Quiz quiz);

    AssessmentResult submitAssessment(String studentId, String assessmentId, List<String> answers);

    /** Student withdraws; frees a capacity slot. */
    void dropEnrollment(String studentId, String courseId);

    /** Marks the enrollment COMPLETED — only legal once every lesson is done. */
    void completeCourse(String studentId, String courseId);

    EnrollmentStatus getEnrollmentStatus(String studentId, String courseId);
    
    /**
     * Gets all courses a student is enrolled in.
     * 
     * @param studentId Student ID
     * @return List of courses
     */
    List<Course> getEnrolledCourses(String studentId);
    
    /**
     * Searches for courses by keyword.
     * 
     * @param keyword Search keyword
     * @return List of matching courses
     */
    List<Course> searchCourses(String keyword);
}
```

</details>

### `service/impl/InMemoryLearningPlatformService.java`

<details>
<summary>Click to view service/impl/InMemoryLearningPlatformService.java</summary>

```java
package com.you.lld.problems.learningplatform.service.impl;

import com.you.lld.problems.learningplatform.service.LearningPlatformService;
import com.you.lld.problems.learningplatform.model.*;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicLong;
import java.util.stream.Collectors;

/**
 * In-memory implementation of learning platform service.
 */
public class InMemoryLearningPlatformService implements LearningPlatformService {
    
    private final Map<String, Course> courses;
    private final Map<String, Enrollment> enrollments; // enrollmentId -> enrollment
    private final Map<String, Set<String>> studentEnrollments; // studentId -> enrollmentIds
    private final Map<String, Map<String, Boolean>> lessonProgress; // studentId -> lessonId -> completed
    private final AtomicLong enrollmentIdGenerator;
    
    public InMemoryLearningPlatformService() {
        this.courses = new ConcurrentHashMap<>();
        this.enrollments = new ConcurrentHashMap<>();
        this.studentEnrollments = new ConcurrentHashMap<>();
        this.lessonProgress = new ConcurrentHashMap<>();
        this.enrollmentIdGenerator = new AtomicLong(0);
    }
    
    private final Map<String, Quiz> quizzes = new ConcurrentHashMap<String, Quiz>();

    @Override
    public String createCourse(Course course) {
        if (courses.putIfAbsent(course.getId(), course) != null) {
            throw new IllegalStateException("Course already exists: " + course.getId());
        }
        return course.getId();
    }

    @Override
    public void addQuiz(Quiz quiz) {
        if (quiz == null) {
            throw new IllegalArgumentException("Quiz required");
        }
        quizzes.put(quiz.getQuizId(), quiz);
    }
    
    @Override
    public Course getCourse(String courseId) {
        return courses.get(courseId);
    }
    
    @Override
    public synchronized String enrollStudent(String studentId, String courseId) {
        Course course = courses.get(courseId);
        if (course == null) {
            throw new IllegalArgumentException("Course not found: " + courseId);
        }
        
        // Duplicate enrollment check
        Set<String> existingEnrollmentIds = studentEnrollments.get(studentId);
        if (existingEnrollmentIds != null) {
            for (String eid : existingEnrollmentIds) {
                Enrollment existing = enrollments.get(eid);
                if (existing != null && existing.getCourseId().equals(courseId)
                        && existing.getStatus() == EnrollmentStatus.ACTIVE) {
                    throw new IllegalStateException("Student " + studentId
                            + " is already enrolled in course " + courseId);
                }
            }
        }
        
        // Capacity check
        if (course.getMaxCapacity() > 0) {
            long activeCount = enrollments.values().stream()
                    .filter(e -> e.getCourseId().equals(courseId)
                            && e.getStatus() == EnrollmentStatus.ACTIVE)
                    .count();
            if (activeCount >= course.getMaxCapacity()) {
                throw new IllegalStateException("Course " + courseId + " is at full capacity ("
                        + course.getMaxCapacity() + ")");
            }
        }
        
        String enrollmentId = "ENR-" + enrollmentIdGenerator.incrementAndGet();
        Enrollment enrollment = new Enrollment(enrollmentId, studentId, courseId);
        
        enrollments.put(enrollmentId, enrollment);
        studentEnrollments.computeIfAbsent(studentId, k -> ConcurrentHashMap.newKeySet())
                         .add(enrollmentId);
        
        return enrollmentId;
    }
    
    /**
     * Marks a lesson complete, but only for a student actually enrolled in the
     * course that owns it.
     *
     * <p>This used to accept any pair of strings and return {@code true}
     * unconditionally — so a student who had never enrolled could "complete"
     * lessons, and a typo'd lesson id was recorded as progress against a lesson
     * that does not exist. {@code getProgress} then counted those phantom
     * completions.
     */
    @Override
    public boolean completeLesson(String studentId, String lessonId) {
        Course course = courseOwningLesson(lessonId);
        if (course == null) {
            throw new IllegalArgumentException("Lesson not found: " + lessonId);
        }
        Enrollment enrollment = activeEnrollment(studentId, course.getId());
        if (enrollment == null) {
            throw new IllegalStateException("Student " + studentId
                    + " has no active enrollment in course " + course.getId());
        }
        lessonProgress.computeIfAbsent(studentId, k -> new ConcurrentHashMap<String, Boolean>())
                .put(lessonId, true);
        return true;
    }

    private Course courseOwningLesson(String lessonId) {
        for (Course course : courses.values()) {
            for (Lesson lesson : course.getLessons()) {
                if (lesson.getId().equals(lessonId)) {
                    return course;
                }
            }
        }
        return null;
    }

    private Enrollment activeEnrollment(String studentId, String courseId) {
        Set<String> ids = studentEnrollments.get(studentId);
        if (ids == null) {
            return null;
        }
        for (String id : ids) {
            Enrollment e = enrollments.get(id);
            if (e != null && e.getCourseId().equals(courseId)
                    && e.getStatus() == EnrollmentStatus.ACTIVE) {
                return e;
            }
        }
        return null;
    }
    
    @Override
    public double getProgress(String studentId, String courseId) {
        Course course = courses.get(courseId);
        if (course == null) {
            return 0.0;
        }
        
        List<Lesson> lessons = course.getLessons();
        if (lessons.isEmpty()) {
            return 0.0;
        }
        
        Map<String, Boolean> studentProgress = lessonProgress.get(studentId);
        if (studentProgress == null) {
            return 0.0;
        }
        
        long completedCount = lessons.stream()
            .filter(lesson -> studentProgress.getOrDefault(lesson.getId(), false))
            .count();
        
        return (completedCount * 100.0) / lessons.size();
    }
    
    /**
     * Grades a submission against the quiz's answer key.
     *
     * <p>Previously returned {@code (int)(Math.random() * 100)}, ignoring
     * {@code answers} entirely — the same student submitting the same answers twice
     * got different marks, and a blank submission could pass.
     */
    @Override
    public AssessmentResult submitAssessment(String studentId, String assessmentId, List<String> answers) {
        Quiz quiz = quizzes.get(assessmentId);
        if (quiz == null) {
            throw new IllegalArgumentException("Assessment not found: " + assessmentId);
        }
        if (quiz.getCourseId() != null && activeEnrollment(studentId, quiz.getCourseId()) == null) {
            throw new IllegalStateException("Student " + studentId
                    + " is not enrolled in course " + quiz.getCourseId());
        }
        return quiz.grade(studentId, answers);
    }

    @Override
    public synchronized void dropEnrollment(String studentId, String courseId) {
        Enrollment enrollment = activeEnrollment(studentId, courseId);
        if (enrollment == null) {
            throw new IllegalStateException("No active enrollment for " + studentId
                    + " in " + courseId);
        }
        enrollment.setStatus(EnrollmentStatus.DROPPED);
    }

    /**
     * COMPLETED is only reachable once every lesson is done — otherwise the status
     * would be a claim nobody checked.
     */
    @Override
    public synchronized void completeCourse(String studentId, String courseId) {
        Enrollment enrollment = activeEnrollment(studentId, courseId);
        if (enrollment == null) {
            throw new IllegalStateException("No active enrollment for " + studentId
                    + " in " + courseId);
        }
        double progress = getProgress(studentId, courseId);
        if (progress < 100.0) {
            throw new IllegalStateException("Course is only " + String.format("%.0f", progress)
                    + "% complete");
        }
        enrollment.setStatus(EnrollmentStatus.COMPLETED);
    }

    @Override
    public EnrollmentStatus getEnrollmentStatus(String studentId, String courseId) {
        Set<String> ids = studentEnrollments.get(studentId);
        if (ids == null) {
            return null;
        }
        EnrollmentStatus latest = null;
        for (String id : ids) {
            Enrollment e = enrollments.get(id);
            if (e != null && e.getCourseId().equals(courseId)) {
                latest = e.getStatus();
                if (latest == EnrollmentStatus.ACTIVE) {
                    return latest;
                }
            }
        }
        return latest;
    }
    
    @Override
    public List<Course> getEnrolledCourses(String studentId) {
        Set<String> enrollmentIds = studentEnrollments.get(studentId);
        if (enrollmentIds == null) {
            return new ArrayList<>();
        }
        
        return enrollmentIds.stream()
            .map(enrollments::get)
            .filter(Objects::nonNull)
            .filter(e -> e.getStatus() == EnrollmentStatus.ACTIVE)
            .map(enrollment -> courses.get(enrollment.getCourseId()))
            .filter(Objects::nonNull)
            .collect(Collectors.toList());
    }
    
    @Override
    public List<Course> searchCourses(String keyword) {
        String lowerKeyword = keyword.toLowerCase();
        return courses.values().stream()
            .filter(course -> course.getTitle().toLowerCase().contains(lowerKeyword) ||
                            course.getDescription().toLowerCase().contains(lowerKeyword))
            .collect(Collectors.toList());
    }
}
```

</details>

### `exceptions/CourseNotFoundException.java`

<details>
<summary>Click to view exceptions/CourseNotFoundException.java</summary>

```java
package com.you.lld.problems.learningplatform.exceptions;
public class CourseNotFoundException extends RuntimeException { public CourseNotFoundException(String m) { super(m); } }
```

</details>

### `exceptions/EnrollmentException.java`

<details>
<summary>Click to view exceptions/EnrollmentException.java</summary>

```java
package com.you.lld.problems.learningplatform.exceptions;
public class EnrollmentException extends RuntimeException { public EnrollmentException(String m) { super(m); } }
```

</details>

## Run Demo

```bash
mvn -q compile exec:java -Dexec.mainClass="com.you.lld.problems.learningplatform.LearningPlatformDemo"
```
