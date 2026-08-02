package com.you.lld.problems.taskmanagement.model;

import java.util.Collections;
import java.util.EnumSet;
import java.util.Set;

/**
 * Task lifecycle, with the legal transitions declared on the enum itself.
 *
 * <p>Keeping the transition table here rather than as {@code if} checks in the
 * service means every caller — current and future — gets the same rules, and the
 * whole state machine is readable in one place.
 *
 * <pre>
 *   TODO         -> IN_PROGRESS, BLOCKED
 *   IN_PROGRESS  -> IN_REVIEW, DONE, BLOCKED, TODO
 *   IN_REVIEW    -> DONE, IN_PROGRESS (review rejected), BLOCKED
 *   BLOCKED      -> TODO, IN_PROGRESS
 *   DONE         -> TODO (reopen; clears completedAt)
 * </pre>
 *
 * Review is optional: IN_PROGRESS may go straight to DONE, as in most trackers.
 * Any status may transition to itself, so repeated updates are idempotent.
 */
public enum TaskStatus {
    TODO,
    IN_PROGRESS,
    IN_REVIEW,
    BLOCKED,
    DONE;

    private Set<TaskStatus> allowedNext;

    static {
        TODO.allowedNext = EnumSet.of(IN_PROGRESS, BLOCKED);
        // DONE directly from IN_PROGRESS: review is optional, as in most trackers.
        IN_PROGRESS.allowedNext = EnumSet.of(IN_REVIEW, DONE, BLOCKED, TODO);
        IN_REVIEW.allowedNext = EnumSet.of(DONE, IN_PROGRESS, BLOCKED);
        BLOCKED.allowedNext = EnumSet.of(TODO, IN_PROGRESS);
        // DONE is reopenable — real trackers allow it — but only back to TODO, and
        // reopening must clear completedAt (see Task.setStatus).
        DONE.allowedNext = EnumSet.of(TODO);
    }

    /** A no-op transition to the same status is always allowed (idempotent updates). */
    public boolean canTransitionTo(TaskStatus next) {
        return this == next || allowedNext.contains(next);
    }

    public Set<TaskStatus> allowedNext() {
        return Collections.unmodifiableSet(allowedNext);
    }

    public boolean isTerminalish() {
        return this == DONE;
    }
}
