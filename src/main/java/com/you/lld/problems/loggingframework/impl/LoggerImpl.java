package com.you.lld.problems.loggingframework.impl;

import com.you.lld.problems.loggingframework.api.Logger;
import com.you.lld.problems.loggingframework.model.*;
import java.util.concurrent.*;

public class LoggerImpl implements Logger {
    private final String className;
    private final LogLevel minLevel;
    private final BlockingQueue<LogMessage> queue = new LinkedBlockingQueue<>();
    private final ExecutorService executor = Executors.newSingleThreadExecutor();
    
    public LoggerImpl(String className, LogLevel minLevel) {
        this.className = className;
        this.minLevel = minLevel;
        executor.submit(this::processLogs);
    }
    
    @Override
    public void log(LogLevel level, String message) {
        if (level.getValue() >= minLevel.getValue()) {
            queue.offer(new LogMessage(level, message, className));
        }
    }
    
    @Override
    public void debug(String message) { log(LogLevel.DEBUG, message); }
    
    @Override
    public void info(String message) { log(LogLevel.INFO, message); }
    
    @Override
    public void warn(String message) { log(LogLevel.WARN, message); }
    
    @Override
    public void error(String message) { log(LogLevel.ERROR, message); }
    
    private void processLogs() {
        while (true) {
            try {
                LogMessage msg = queue.take();
                System.out.println(msg);
            } catch (InterruptedException e) {
                return;
            }
        }
    }
    
    public void shutdown() {
        executor.shutdown();
    }
}
