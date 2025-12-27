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

