package com.you.lld.problems.learningplatform;

import com.you.lld.problems.learningplatform.model.Course;
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

        // 5. Assessment (graceful if quiz not registered)
        System.out.println("\n--- 5. Assessment ---");
        try {
            System.out.println("Result: " + platform.submitAssessment("student-1", "quiz-1",
                    java.util.Arrays.asList("a", "b", "c")));
        } catch (Exception e) {
            System.out.println("Assessment note: " + e.getMessage());
        }

        System.out.println("\n=== Demo complete ===");
    }
}
