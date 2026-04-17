package com.you.lld.problems.logging.formatter;

import com.you.lld.problems.logging.model.LogEvent;

import java.io.PrintWriter;
import java.io.StringWriter;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;

/**
 * Human-readable formatter: [timestamp] [LEVEL] [thread] logger {mdc} - message\n  stacktrace?
 */
public class SimpleFormatter implements LogFormatter {

    private static final DateTimeFormatter TS =
        DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss.SSS").withZone(ZoneId.systemDefault());

    @Override
    public String format(LogEvent event) {
        StringBuilder sb = new StringBuilder(128);
        sb.append('[').append(TS.format(event.getTimestamp())).append("] ")
          .append('[').append(event.getLevel()).append("] ")
          .append('[').append(event.getThreadName()).append("] ")
          .append(event.getLoggerName());

        if (!event.getContext().isEmpty()) {
            sb.append(' ').append(event.getContext());
        }
        sb.append(" - ").append(event.getMessage());

        if (event.getThrowable() != null) {
            StringWriter sw = new StringWriter();
            event.getThrowable().printStackTrace(new PrintWriter(sw));
            sb.append(System.lineSeparator()).append(sw);
        }
        return sb.toString();
    }
}
