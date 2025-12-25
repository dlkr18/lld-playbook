# Learning Platform

## 16 Files

### Course.java
```java
package com.you.lld.problems.learningplatform;
import java.util.*;

public class Course {
    private final String courseId;
    private String title;
    private String instructorId;
    private List<String> moduleIds;
    private Set<String> enrolledStudents;
    
    public Course(String courseId, String title, String instructorId) {
        this.courseId = courseId;
        this.title = title;
        this.instructorId = instructorId;
        this.moduleIds = new ArrayList<>();
        this.enrolledStudents = new HashSet<>();
    }
    
    public String getCourseId() { return courseId; }
    public String getTitle() { return title; }
    public void enrollStudent(String studentId) { enrolledStudents.add(studentId); }
    public Set<String> getEnrolledStudents() { return new HashSet<>(enrolledStudents); }
}

```

### Demo.java
```java
package com.you.lld.problems.learningplatform;
import com.you.lld.problems.learningplatform.api.*;
import com.you.lld.problems.learningplatform.impl.*;
import com.you.lld.problems.learningplatform.model.*;
public class Demo { public static void main(String[] args) { System.out.println("Learning Platform Demo"); Service s = new InMemoryService(); } }
```

### LearningPlatform.java
```java
package com.you.lld.problems.learningplatform;
import java.util.*;

public class LearningPlatform {
    private final Map<String, Course> courses;
    private final Map<String, Student> students;
    
    public LearningPlatform() {
        this.courses = new HashMap<>();
        this.students = new HashMap<>();
    }
    
    public void addCourse(Course course) {
        courses.put(course.getCourseId(), course);
    }
    
    public void addStudent(Student student) {
        students.put(student.getStudentId(), student);
    }
    
    public boolean enrollStudent(String studentId, String courseId) {
        Student student = students.get(studentId);
        Course course = courses.get(courseId);
        if (student != null && course != null) {
            student.enrollInCourse(courseId);
            course.enrollStudent(studentId);
            return true;
        }
        return false;
    }
}

```

### Student.java
```java
package com.you.lld.problems.learningplatform;
import java.util.*;

public class Student {
    private final String studentId;
    private String name;
    private Set<String> enrolledCourses;
    
    public Student(String studentId, String name) {
        this.studentId = studentId;
        this.name = name;
        this.enrolledCourses = new HashSet<>();
    }
    
    public String getStudentId() { return studentId; }
    public String getName() { return name; }
    public void enrollInCourse(String courseId) { enrolledCourses.add(courseId); }
}

```

### Service.java
```java
package com.you.lld.problems.learningplatform.api;
import com.you.lld.problems.learningplatform.model.*;
import java.util.*;
public interface Service { }
```

### CourseNotFoundException.java
```java
package com.you.lld.problems.learningplatform.exceptions;
public class CourseNotFoundException extends RuntimeException { public CourseNotFoundException(String m) { super(m); } }
```

### EnrollmentException.java
```java
package com.you.lld.problems.learningplatform.exceptions;
public class EnrollmentException extends RuntimeException { public EnrollmentException(String m) { super(m); } }
```

### InMemoryService.java
```java
package com.you.lld.problems.learningplatform.impl;
import com.you.lld.problems.learningplatform.api.*;
import com.you.lld.problems.learningplatform.model.*;
import java.util.*;
public class InMemoryService implements Service { private Map<String,Object> data = new HashMap<>(); }
```

### Assignment.java
```java
package com.you.lld.problems.learningplatform.model;
import java.util.*;
public class Assignment { private String assignmentId; public Assignment(String id) { assignmentId=id; } public String getAssignmentId() { return assignmentId; } }
```

### Course.java
```java
package com.you.lld.problems.learningplatform.model;
import java.util.*;
public class Course { private String courseId; public Course(String id) { courseId=id; } public String getCourseId() { return courseId; } }
```

### Enrollment.java
```java
package com.you.lld.problems.learningplatform.model;
import java.util.*;
public class Enrollment { private String enrollmentId; public Enrollment(String id) { enrollmentId=id; } public String getEnrollmentId() { return enrollmentId; } }
```

### Instructor.java
```java
package com.you.lld.problems.learningplatform.model;
import java.util.*;
public class Instructor { private String instructorId; public Instructor(String id) { instructorId=id; } public String getInstructorId() { return instructorId; } }
```

### Lesson.java
```java
package com.you.lld.problems.learningplatform.model;
import java.util.*;
public class Lesson { private String lessonId; public Lesson(String id) { lessonId=id; } public String getLessonId() { return lessonId; } }
```

### Progress.java
```java
package com.you.lld.problems.learningplatform.model;
import java.util.*;
public class Progress { private String progressId; public Progress(String id) { progressId=id; } public String getProgressId() { return progressId; } }
```

### Quiz.java
```java
package com.you.lld.problems.learningplatform.model;
import java.util.*;
public class Quiz { private String quizId; public Quiz(String id) { quizId=id; } public String getQuizId() { return quizId; } }
```

### Student.java
```java
package com.you.lld.problems.learningplatform.model;
import java.util.*;
public class Student { private String studentId; public Student(String id) { studentId=id; } public String getStudentId() { return studentId; } }
```

