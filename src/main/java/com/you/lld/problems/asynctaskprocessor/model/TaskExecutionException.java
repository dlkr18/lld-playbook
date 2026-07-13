package com.you.lld.problems.asynctaskprocessor.model;

/** Wraps whatever a task threw, surfaced from {@code TaskHandle.get()}. */
public class TaskExecutionException extends RuntimeException {
    public TaskExecutionException(String taskId, Throwable cause) {
        super("task '" + taskId + "' failed: " + cause, cause);
    }
}
