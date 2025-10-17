package com.you.lld.examples.day2.refactoring.after;

/**
 * Business Exception for domain-specific errors
 * 
 * Used to represent business rule violations and domain-specific error conditions.
 * This separates business logic errors from technical/infrastructure errors.
 */
public class BusinessException extends RuntimeException {
    
    public BusinessException(String message) {
        super(message);
    }
    
    public BusinessException(String message, Throwable cause) {
        super(message, cause);
    }
}





