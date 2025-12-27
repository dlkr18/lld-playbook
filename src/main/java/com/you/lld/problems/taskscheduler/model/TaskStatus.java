package com.you.lld.problems.taskscheduler.model;

/**
 * Status of a task in its lifecycle.
 */
public enum TaskStatus {
    SCHEDULED,   // Task is scheduled but not yet due
    RUNNING,     // Task is currently executing
    COMPLETED,   // Task completed successfully
    FAILED,      // Task execution failed
    CANCELLED    // Task was cancelled before execution
}
