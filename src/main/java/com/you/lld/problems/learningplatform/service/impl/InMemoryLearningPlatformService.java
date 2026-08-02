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

