package com.you.lld.problems.taskmanagement;

import com.you.lld.problems.taskmanagement.model.Priority;
import com.you.lld.problems.taskmanagement.model.Task;
import com.you.lld.problems.taskmanagement.model.TaskObserver;
import com.you.lld.problems.taskmanagement.model.TaskStatus;

import java.time.LocalDateTime;
import java.util.List;

/**
 * SDE3 demo: Observer on status changes, priority filtering, overdue detection, assignment.
 */
public class TaskManagementDemo {

    public static void main(String[] args) {
        System.out.println("=== Task Management (SDE3) ===\n");
        TaskManagement board = new TaskManagement();

        // 1. Observer on status transitions
        System.out.println("--- 1. Observer (status changes) ---");
        board.addObserver(new TaskObserver() {
            @Override
            public void onTaskStatusChanged(Task task, TaskStatus oldStatus, TaskStatus newStatus) {
                System.out.println("  [notify] " + task.getTitle() + ": " + oldStatus + " -> " + newStatus);
            }
        });

        Task login = board.createTask("Implement login", "JWT auth");
        Task bug = board.createTask("Fix checkout bug", "Cart total wrong");
        Task tests = board.createTask("Write unit tests", "OrderService coverage");

        // 2. Assignment + priority
        System.out.println("\n--- 2. Assignment + priority ---");
        board.assignTask(login.getId(), "alice");
        board.assignTask(bug.getId(), "bob");
        board.assignTask(tests.getId(), "alice");
        board.setPriority(bug.getId(), Priority.CRITICAL);
        board.setPriority(login.getId(), Priority.HIGH);
        System.out.println("Alice tasks: " + board.byAssignee("alice").size());
        System.out.println("Critical: " + bug.getTitle());

        // 3. Due dates + overdue query
        System.out.println("\n--- 3. Overdue detection ---");
        board.setDueDate(bug.getId(), LocalDateTime.now().minusDays(1));
        board.setDueDate(login.getId(), LocalDateTime.now().plusDays(3));
        board.updateStatus(bug.getId(), TaskStatus.IN_PROGRESS);
        for (Task t : board.overdue()) {
            System.out.println("  OVERDUE: " + t.getTitle());
        }

        // 4. Tags + status workflow
        System.out.println("\n--- 4. Tags + workflow ---");
        board.addTag(login.getId(), "backend");
        board.addTag(login.getId(), "auth");
        board.updateStatus(login.getId(), TaskStatus.IN_PROGRESS);
        board.updateStatus(login.getId(), TaskStatus.DONE);
        List<Task> inProgress = board.byStatus(TaskStatus.IN_PROGRESS);
        System.out.println("In-progress count: " + inProgress.size());

        // 5. Error handling — complete already-done task is idempotent
        System.out.println("\n--- 5. State idempotency ---");
        board.updateStatus(login.getId(), TaskStatus.DONE);
        System.out.println("Re-complete login: status=" + login.getStatus());

        System.out.println("\n=== Demo complete ===");
    }
}
