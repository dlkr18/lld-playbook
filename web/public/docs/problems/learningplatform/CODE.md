# Source Code

This page contains the complete source code for this problem.

## 📁 Directory Structure

```
├── Course.java
├── LearningPlatform.java
├── Student.java
├── api/LearningPlatformService.java
├── exceptions/CourseNotFoundException.java
├── exceptions/EnrollmentException.java
├── impl/InMemoryLearningPlatformService.java
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
```

<details>
<summary>📄 <strong>Course.java</strong> - Click to expand</summary>

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

<details>
<summary>📄 <strong>LearningPlatform.java</strong> - Click to expand</summary>

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

<details>
<summary>📄 <strong>Student.java</strong> - Click to expand</summary>

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

<details>
<summary>📄 <strong>api/LearningPlatformService.java</strong> - Click to expand</summary>

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

<details>
<summary>📄 <strong>exceptions/CourseNotFoundException.java</strong> - Click to expand</summary>

```java
package com.you.lld.problems.learningplatform.exceptions;
public class CourseNotFoundException extends RuntimeException { public CourseNotFoundException(String m) { super(m); } }```

</details>

<details>
<summary>📄 <strong>exceptions/EnrollmentException.java</strong> - Click to expand</summary>

```java
package com.you.lld.problems.learningplatform.exceptions;
public class EnrollmentException extends RuntimeException { public EnrollmentException(String m) { super(m); } }```

</details>

<details>
<summary>📄 <strong>impl/InMemoryLearningPlatformService.java</strong> - Click to expand</summary>

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
    public String enrollStudent(String studentId, String courseId) {
        Course course = courses.get(courseId);
        if (course == null) {
            return null;
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

<details>
<summary>📄 <strong>model/AssessmentResult.java</strong> - Click to expand</summary>

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

<details>
<summary>📄 <strong>model/Assignment.java</strong> - Click to expand</summary>

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

<details>
<summary>📄 <strong>model/Course.java</strong> - Click to expand</summary>

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
    
    public Course(String id, String title) {
        this.id = id;
        this.title = title;
        this.lessons = new ArrayList<>();
        this.createdAt = LocalDateTime.now();
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
}
```

</details>

<details>
<summary>📄 <strong>model/Enrollment.java</strong> - Click to expand</summary>

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

<details>
<summary>📄 <strong>model/EnrollmentStatus.java</strong> - Click to expand</summary>

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

<details>
<summary>📄 <strong>model/Instructor.java</strong> - Click to expand</summary>

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

<details>
<summary>📄 <strong>model/Lesson.java</strong> - Click to expand</summary>

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

<details>
<summary>📄 <strong>model/Progress.java</strong> - Click to expand</summary>

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

<details>
<summary>📄 <strong>model/Quiz.java</strong> - Click to expand</summary>

```java
package com.you.lld.problems.learningplatform.model;
import java.util.*;
public class Quiz { private String quizId; public Quiz(String id) { quizId=id; } public String getQuizId() { return quizId; } }```

</details>

<details>
<summary>📄 <strong>model/Student.java</strong> - Click to expand</summary>

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

