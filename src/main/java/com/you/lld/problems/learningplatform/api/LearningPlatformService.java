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

