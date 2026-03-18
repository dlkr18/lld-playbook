package com.you.lld.problems.taskmanagement;

import com.you.lld.problems.taskmanagement.impl.InMemoryTaskService;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

/**
 * Demo: Task Management with CRUD, assignment, filtering, due dates, tags.
 */
public class TaskManagementDemo {

    public static void main(String[] args) {
        System.out.println("=== Task Management Demo ===\n");

        InMemoryTaskService service = new InMemoryTaskService();

        // Create tasks
        System.out.println("--- Create tasks ---");
        Task t1 = service.createTask("Implement login", "Add JWT-based authentication");
        Task t2 = service.createTask("Fix checkout bug", "Cart total not updating");
        Task t3 = service.createTask("Write unit tests", "Cover OrderService");
        Task t4 = service.createTask("Deploy to staging", "Push v2.0 release");
        System.out.println("Created 4 tasks");

        // Assign
        System.out.println("\n--- Assign ---");
        service.assignTask(t1.getId(), "alice");
        service.assignTask(t2.getId(), "bob");
        service.assignTask(t3.getId(), "alice");

        // Priority
        System.out.println("\n--- Set priority ---");
        service.updateTaskPriority(t2.getId(), Priority.CRITICAL);
        service.updateTaskPriority(t1.getId(), Priority.HIGH);
        service.updateTaskPriority(t3.getId(), Priority.MEDIUM);

        // Tags
        service.addTag(t1.getId(), "backend");
        service.addTag(t1.getId(), "auth");
        service.addTag(t2.getId(), "bug");
        service.addTag(t3.getId(), "testing");

        // Due dates
        service.setDueDate(t1.getId(), LocalDateTime.now().plusDays(3));
        service.setDueDate(t2.getId(), LocalDateTime.now().minusDays(1)); // overdue!
        service.setDueDate(t3.getId(), LocalDateTime.now().plusDays(7));

        // Status updates
        System.out.println("\n--- Status updates ---");
        service.updateTaskStatus(t1.getId(), TaskStatus.IN_PROGRESS);
        service.updateTaskStatus(t2.getId(), TaskStatus.IN_PROGRESS);

        // Query: tasks by assignee
        System.out.println("\n--- Alice's tasks ---");
        List<Task> aliceTasks = service.getTasksByAssignee("alice");
        for (Task t : aliceTasks) {
            System.out.println("  " + t.getTitle() + " [" + t.getStatus() + "]");
        }

        // Query: tasks by priority
        System.out.println("\n--- Critical tasks ---");
        List<Task> critical = service.getTasksByPriority(Priority.CRITICAL);
        for (Task t : critical) {
            System.out.println("  " + t.getTitle());
        }

        // Query: overdue
        System.out.println("\n--- Overdue tasks ---");
        List<Task> overdue = service.getOverdueTasks();
        for (Task t : overdue) {
            System.out.println("  " + t.getTitle());
        }

        // Query: by status
        System.out.println("\n--- In-progress tasks ---");
        List<Task> inProgress = service.getTasksByStatus(TaskStatus.IN_PROGRESS);
        for (Task t : inProgress) {
            System.out.println("  " + t.getTitle());
        }

        // Query: by tag
        System.out.println("\n--- Tag: backend ---");
        List<Task> backendTasks = service.getTasksByTag("backend");
        for (Task t : backendTasks) {
            System.out.println("  " + t.getTitle());
        }

        // Complete task
        service.updateTaskStatus(t1.getId(), TaskStatus.DONE);
        System.out.println("\nCompleted: " + t1.getTitle());

        // Delete task
        boolean deleted = service.deleteTask(t4.getId());
        System.out.println("Deleted 'Deploy to staging': " + deleted);

        // Get specific task
        Optional<Task> fetched = service.getTask(t2.getId());
        fetched.ifPresent(t -> System.out.println("\nTask detail: " + t.getTitle() 
            + " priority=" + t.getPriority() + " status=" + t.getStatus()));

        System.out.println("\n=== Demo complete ===");
    }
}
