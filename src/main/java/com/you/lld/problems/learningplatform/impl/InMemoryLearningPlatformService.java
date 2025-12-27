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


