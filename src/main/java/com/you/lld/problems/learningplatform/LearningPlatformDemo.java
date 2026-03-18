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
