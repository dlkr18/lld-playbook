package com.you.lld.problems.stackoverflow;

import com.you.lld.problems.stackoverflow.service.StackOverflowService;
import com.you.lld.problems.stackoverflow.service.impl.InMemoryStackOverflowService;

/**
 * Facade entry point for the Stack Overflow Q&amp;A system.
 */
public class StackOverflow {

    private final StackOverflowService service;

    public StackOverflow() {
        this(new InMemoryStackOverflowService());
    }

    public StackOverflow(StackOverflowService service) {
        this.service = service;
    }

    public StackOverflowService service() {
        return service;
    }
}
