# learningplatform - Complete Implementation

> Generated from `src/main/java/com/you/lld/problems/learningplatform/` on 2026-05-31. Re-run `python3 scripts/generate-code-md.py learningplatform`.

## Project Structure (18 files)

```
learningplatform/
├── LearningPlatformDemo.java
├── Course.java
├── LearningPlatform.java
├── Student.java
├── api/LearningPlatformService.java
├── model/AssessmentResult.java
├── model/Assignment.java
├── model/Course.java
├── model/Enrollment.java
├── model/EnrollmentStatus.java
├── model/Instructor.java
├── model/Lesson.java
├── model/Progress.java
├── model/Quiz.java
├── model/Student.java
├── impl/InMemoryLearningPlatformService.java
├── exceptions/CourseNotFoundException.java
├── exceptions/EnrollmentException.java
```

## Source Code

### `LearningPlatformDemo.java`

<details>
<summary>Click to view LearningPlatformDemo.java</summary>

```java
package com.you.lld.problems.learningplatform;

import com.you.lld.problems.learningplatform.impl.InMemoryLearningPlatformService;
import com.you.lld.problems.learningplatform.model.AssessmentResult;
import com.you.lld.problems.learningplatform.model.Lesson;

import java.util.Arrays;
import java.util.List;

/**
 * Demo: Learning Platform with courses, enrollment, progress tracking, assessments.
 */
public class LearningPlatformDemo {

    public static void main(String[] args) {
        System.out.println("=== Learning Platform Demo ===\n");

        InMemoryLearningPlatformService service = new InMemoryLearningPlatformService();

        // Create courses with lessons
        com.you.lld.problems.learningplatform.model.Course javaBasics = 
            new com.you.lld.problems.learningplatform.model.Course("C1", "Java Basics");
        javaBasics.setDescription("Learn Java from scratch");
        javaBasics.setInstructorId("instructor-1");
        javaBasics.addLesson(new Lesson("L1", "Variables and Types"));
        javaBasics.addLesson(new Lesson("L2", "Control Flow"));
        javaBasics.addLesson(new Lesson("L3", "OOP Concepts"));

        com.you.lld.problems.learningplatform.model.Course designPatterns = 
            new com.you.lld.problems.learningplatform.model.Course("C2", "Design Patterns");
        designPatterns.setDescription("Master Java design patterns");
        designPatterns.setInstructorId("instructor-2");
        designPatterns.addLesson(new Lesson("L4", "Singleton Pattern"));
        designPatterns.addLesson(new Lesson("L5", "Factory Pattern"));

        String c1Id = service.createCourse(javaBasics);
        String c2Id = service.createCourse(designPatterns);
        System.out.println("Created courses: " + c1Id + ", " + c2Id);

        // Enroll students
        System.out.println("\n--- Enrollment ---");
        service.enrollStudent("student-1", c1Id);
        service.enrollStudent("student-1", c2Id);
        service.enrollStudent("student-2", c1Id);
        System.out.println("Enrolled student-1 in both courses, student-2 in Java Basics");

        // Check enrolled courses
        List<com.you.lld.problems.learningplatform.model.Course> courses = 
            service.getEnrolledCourses("student-1");
        System.out.println("student-1 enrolled in " + courses.size() + " courses:");
        for (com.you.lld.problems.learningplatform.model.Course c : courses) {
            System.out.println("  " + c.getTitle());
        }

        // Complete lessons and track progress
        System.out.println("\n--- Progress ---");
        service.completeLesson("student-1", "L1");
        service.completeLesson("student-1", "L2");
        double progress = service.getProgress("student-1", c1Id);
        System.out.printf("student-1 Java Basics progress: %.1f%%%n", progress);

        service.completeLesson("student-1", "L3");
        progress = service.getProgress("student-1", c1Id);
        System.out.printf("student-1 Java Basics progress: %.1f%% (all done)%n", progress);

        // Assessment
        System.out.println("\n--- Assessment ---");
        try {
            AssessmentResult result = service.submitAssessment("student-1", "quiz-1", 
                Arrays.asList("answer1", "answer2", "answer3"));
            System.out.println("Assessment result: " + result);
        } catch (Exception e) {
            System.out.println("Assessment: " + e.getMessage());
        }

        // Search courses
        System.out.println("\n--- Search ---");
        List<com.you.lld.problems.learningplatform.model.Course> found = 
            service.searchCourses("Java");
        System.out.println("Search 'Java': " + found.size() + " courses");
        for (com.you.lld.problems.learningplatform.model.Course c : found) {
            System.out.println("  " + c.getTitle());
        }

        found = service.searchCourses("Pattern");
        System.out.println("Search 'Pattern': " + found.size() + " courses");
        for (com.you.lld.problems.learningplatform.model.Course c : found) {
            System.out.println("  " + c.getTitle());
        }

        System.out.println("\n=== Demo complete ===");
    }
}
```

</details>

### `Course.java`

<details>
<summary>Click to view Course.java</summary>

```java
package com.you.lld.problems.learningplatform;
import java.util.*;

public class Course {
    private final String courseId;
    private String title;
    private String instructorId;
    private List<String> moduleIds;
    private Set<String> enrolledStudents;
    
    public Course(String courseId, String title, String instructorId) {
        this.courseId = courseId;
        this.title = title;
        this.instructorId = instructorId;
        this.moduleIds = new ArrayList<>();
        this.enrolledStudents = new HashSet<>();
    }
    
    public String getCourseId() { return courseId; }
    public String getTitle() { return title; }
    public void enrollStudent(String studentId) { enrolledStudents.add(studentId); }
    public Set<String> getEnrolledStudents() { return new HashSet<>(enrolledStudents); }
}
```

</details>

### `LearningPlatform.java`

<details>
<summary>Click to view LearningPlatform.java</summary>

```java
package com.you.lld.problems.learningplatform;
import java.util.*;

public class LearningPlatform {
    private final Map<String, Course> courses;
    private final Map<String, Student> students;
    
    public LearningPlatform() {
        this.courses = new HashMap<>();
        this.students = new HashMap<>();
    }
    
    public void addCourse(Course course) {
        courses.put(course.getCourseId(), course);
    }
    
    public void addStudent(Student student) {
        students.put(student.getStudentId(), student);
    }
    
    public boolean enrollStudent(String studentId, String courseId) {
        Student student = students.get(studentId);
        Course course = courses.get(courseId);
        if (student != null && course != null) {
            student.enrollInCourse(courseId);
            course.enrollStudent(studentId);
            return true;
        }
        return false;
    }
}
```

</details>

### `Student.java`

<details>
<summary>Click to view Student.java</summary>

```java
package com.you.lld.problems.learningplatform;
import java.util.*;

public class Student {
    private final String studentId;
    private String name;
    private Set<String> enrolledCourses;
    
    public Student(String studentId, String name) {
        this.studentId = studentId;
        this.name = name;
        this.enrolledCourses = new HashSet<>();
    }
    
    public String getStudentId() { return studentId; }
    public String getName() { return name; }
    public void enrollInCourse(String courseId) { enrolledCourses.add(courseId); }
}
```

</details>

### `api/LearningPlatformService.java`

<details>
<summary>Click to view api/LearningPlatformService.java</summary>

```java
package com.you.lld.problems.learningplatform.api;

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
    AssessmentResult submitAssessment(String studentId, String assessmentId, List<String> answers);
    
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

### `model/Assignment.java`

<details>
<summary>Click to view model/Assignment.java</summary>

```java
package com.you.lld.problems.learningplatform.model;
import java.util.*;
public
class Assignment  {
    private String assignmentId;
    public Assignment(String id)  {
        assignmentId=id;
    }
    public String getAssignmentId()  {
        return assignmentId;
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

### `model/Quiz.java`

<details>
<summary>Click to view model/Quiz.java</summary>

```java
package com.you.lld.problems.learningplatform.model;
import java.util.*;
public class Quiz { private String quizId; public Quiz(String id) { quizId=id; } public String getQuizId() { return quizId; } }
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

### `impl/InMemoryLearningPlatformService.java`

<details>
<summary>Click to view impl/InMemoryLearningPlatformService.java</summary>

```java
package com.you.lld.problems.learningplatform.impl;

import com.you.lld.problems.learningplatform.api.LearningPlatformService;
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
    
    @Override
    public String createCourse(Course course) {
        courses.put(course.getId(), course);
        return course.getId();
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
    
    @Override
    public boolean completeLesson(String studentId, String lessonId) {
        Map<String, Boolean> studentProgress = lessonProgress.computeIfAbsent(
            studentId,
            k -> new ConcurrentHashMap<>()
        );
        studentProgress.put(lessonId, true);
        return true;
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
    
    @Override
    public AssessmentResult submitAssessment(String studentId, String assessmentId, List<String> answers) {
        // Simplified assessment logic
        int score = (int) (Math.random() * 100);
        boolean passed = score >= 60;
        return new AssessmentResult(studentId, assessmentId, score, passed);
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
