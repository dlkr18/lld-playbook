package com.you.lld.problems.taskmanagement.api;

import com.you.lld.problems.taskmanagement.Task;
import com.you.lld.problems.taskmanagement.TaskStatus;
import com.you.lld.problems.taskmanagement.Priority;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

/**
 * Service interface for managing tasks in the task management system.
 * Provides CRUD operations and advanced querying capabilities.
 */
public interface TaskService {
    
    /**
     * Creates a new task with the given title and description.
     * 
     * @param title Task title
     * @param description Task description
     * @return Created task
     */
    Task createTask(String title, String description);
    
    /**
     * Retrieves a task by its ID.
     * 
     * @param taskId Task identifier
     * @return Optional containing the task if found
     */
    Optional<Task> getTask(String taskId);
    
    /**
     * Updates an existing task's properties.
     * 
     * @param taskId Task identifier
     * @param title New title
     * @param description New description
     * @return Updated task
     */
    Task updateTask(String taskId, String title, String description);
    
    /**
     * Deletes a task by its ID.
     * 
     * @param taskId Task identifier
     * @return true if deleted successfully
     */
    boolean deleteTask(String taskId);
    
    /**
     * Assigns a task to a user.
     * 
     * @param taskId Task identifier
     * @param assigneeId User identifier
     */
    void assignTask(String taskId, String assigneeId);
    
    /**
     * Changes the status of a task.
     * 
     * @param taskId Task identifier
     * @param newStatus New status to set
     */
    void updateTaskStatus(String taskId, TaskStatus newStatus);
    
    /**
     * Changes the priority of a task.
     * 
     * @param taskId Task identifier
     * @param priority New priority level
     */
    void updateTaskPriority(String taskId, Priority priority);
    
    /**
     * Sets a due date for the task.
     * 
     * @param taskId Task identifier
     * @param dueDate Due date to set
     */
    void setDueDate(String taskId, LocalDateTime dueDate);
    
    /**
     * Adds a tag to a task.
     * 
     * @param taskId Task identifier
     * @param tag Tag to add
     */
    void addTag(String taskId, String tag);
    
    /**
     * Retrieves all tasks with a specific status.
     * 
     * @param status Status to filter by
     * @return List of matching tasks
     */
    List<Task> getTasksByStatus(TaskStatus status);
    
    /**
     * Retrieves all tasks assigned to a specific user.
     * 
     * @param assigneeId User identifier
     * @return List of assigned tasks
     */
    List<Task> getTasksByAssignee(String assigneeId);
    
    /**
     * Retrieves all tasks with a specific priority.
     * 
     * @param priority Priority level to filter by
     * @return List of matching tasks
     */
    List<Task> getTasksByPriority(Priority priority);
    
    /**
     * Retrieves all tasks with a specific tag.
     * 
     * @param tag Tag to search for
     * @return List of matching tasks
     */
    List<Task> getTasksByTag(String tag);
    
    /**
     * Retrieves all overdue tasks.
     * 
     * @return List of overdue tasks
     */
    List<Task> getOverdueTasks();
    
    /**
     * Retrieves all tasks created within a date range.
     * 
     * @param start Start date
     * @param end End date
     * @return List of tasks created in range
     */
    List<Task> getTasksCreatedBetween(LocalDateTime start, LocalDateTime end);
}

