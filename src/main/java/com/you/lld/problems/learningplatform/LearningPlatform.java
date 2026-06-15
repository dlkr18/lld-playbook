package com.you.lld.problems.learningplatform;

import com.you.lld.problems.learningplatform.model.AssessmentResult;
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
