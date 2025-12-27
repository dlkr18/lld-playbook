# Online Learning Platform (Coursera / Udemy)

## Overview
E-learning platform with courses, videos, quizzes, progress tracking, and certificates.

## Key Features
- Course catalog
- Video streaming
- Quizzes and assignments
- Progress tracking
- Certificates on completion
- Discussion forums

## Key Algorithms
```java
public double calculateProgress(String userId, String courseId) {
    Course course = courses.get(courseId);
    UserProgress progress = getProgress(userId, courseId);
    
    int totalLessons = course.getLessons().size();
    int completedLessons = progress.getCompletedLessons().size();
    
    return (completedLessons * 100.0) / totalLessons;
}
```

## Source Code
📄 **[View Complete Source Code](/problems/learningplatform/CODE)**
