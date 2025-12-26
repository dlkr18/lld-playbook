package com.you.lld.problems.logging;

import com.you.lld.problems.logging.impl.LoggerImpl;
import com.you.lld.problems.logging.appender.ConsoleAppender;
import com.you.lld.problems.logging.model.LogLevel;

public class LoggingDemo {
    public static void main(String[] args) {
        System.out.println("📝 Logging System Demo");
        System.out.println(String.format("%70s", "").replace(" ", "="));
        System.out.println();
        
        LoggerImpl logger = new LoggerImpl("MyApp");
        logger.addAppender(new ConsoleAppender());
        logger.setLevel(LogLevel.DEBUG);
        
        logger.debug("Debug message");
        logger.info("Application started");
        logger.warn("Warning message");
        logger.error("Error occurred");
        
        System.out.println("\n✅ Demo complete!");
    }
}
