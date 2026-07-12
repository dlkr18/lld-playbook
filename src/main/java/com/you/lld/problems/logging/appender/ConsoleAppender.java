package com.you.lld.problems.logging.appender;

import com.you.lld.problems.logging.formatter.LogFormatter;

/**
 * Writes formatted events to System.out (or System.err for ERROR+).
 */
public class ConsoleAppender extends AbstractAppender {

    public ConsoleAppender() {
        super("console", null);
    }

    public ConsoleAppender(LogFormatter formatter) {
        super("console", formatter);
    }

    @Override
    protected void doAppend(String formatted) {
        System.out.println(formatted);
    }
}
