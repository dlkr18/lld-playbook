package com.you.lld.problems.loggingframework.model;

public enum LogLevel {
    DEBUG(1), INFO(2), WARN(3), ERROR(4), FATAL(5);
    
    private final int value;
    LogLevel(int value) { this.value = value; }
    public int getValue() { return value; }
}
