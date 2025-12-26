package com.you.lld.problems.logging.api;

import com.you.lld.problems.logging.model.LogLevel;

public interface Logger {
    void trace(String message);
    void debug(String message);
    void info(String message);
    void warn(String message);
    void error(String message);
    void fatal(String message);
    void setLevel(LogLevel level);
}
