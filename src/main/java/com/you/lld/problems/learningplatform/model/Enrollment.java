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
