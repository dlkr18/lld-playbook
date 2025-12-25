# Learning Platform

## Problem: Design an Online Learning Platform (like Coursera/Udemy)

**Difficulty**: Medium  
**Pattern**: Composite, Observer, Strategy  
**Time**: 60-75 min

---

## Key Classes

```java
class LearningPlatform {
    private Map<String, Course> courses;
    private Map<String, Student> students;
    private Map<String, Instructor> instructors;
    
    void enrollStudent(String studentId, String courseId);
    void trackProgress(String studentId, String courseId);
}

class Course {
    String id;
    String title;
    List<Module> modules;
    Instructor instructor;
    List<Student> enrolledStudents;
}

class Module {
    String id;
    String title;
    List<Lesson> lessons;
    Quiz quiz;
}

class Progress {
    Student student;
    Course course;
    Map<String, Boolean> completedLessons;
    double completionPercentage;
}
```

---

**Status**: ✅ Documented
