# Task Management System (Jira / Trello)

## Overview
Project management platform with tasks, boards, sprints, assignments, comments, and workflows supporting agile development methodologies.

**Difficulty:** Medium-Hard  
**Interview Frequency:** High (Atlassian, project tools)

## Key Features

### Task Workflow
```
TODO → IN_PROGRESS → IN_REVIEW → DONE

Transitions:
- Start work: TODO → IN_PROGRESS
- Submit for review: IN_PROGRESS → IN_REVIEW
- Approve: IN_REVIEW → DONE
- Reject: IN_REVIEW → IN_PROGRESS
```

### Sprint Management
```java
public class Sprint {
    private LocalDate startDate;
    private LocalDate endDate;
    private List<Task> tasks;
    
    public double getCompletionPercentage() {
        long completed = tasks.stream()
            .filter(t -> t.getStatus() == TaskStatus.DONE)
            .count();
        return (completed * 100.0) / tasks.size();
    }
    
    public int getVelocity() {
        return tasks.stream()
            .filter(t -> t.getStatus() == TaskStatus.DONE)
            .mapToInt(Task::getStoryPoints)
            .sum();
    }
}
```

### Task Priority
```java
enum Priority {
    CRITICAL(1), HIGH(2), MEDIUM(3), LOW(4);
    
    private final int value;
}
```

## Design Patterns
- **State Pattern**: Task workflow
- **Observer Pattern**: Task updates
- **Command Pattern**: Task operations

## Source Code
📄 **[View Complete Source Code](/problems/taskmanagement/CODE)**

*Agile project management with sprints and workflows.*
