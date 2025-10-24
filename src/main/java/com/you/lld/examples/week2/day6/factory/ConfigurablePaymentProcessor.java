package com.you.lld.examples.week2.day6.factory;

/**
 * Interface for payment processors that can be configured.
 * This allows the factory to pass configuration to processors that support it.
 */
public interface ConfigurablePaymentProcessor {
    
    /**
     * Configure the payment processor with the provided configuration.
     * 
     * @param config The configuration to apply
     * @throws IllegalArgumentException if configuration is invalid
     */
    void configure(PaymentProcessorConfig config);
    
    /**
     * Get the current configuration of the processor.
     * 
     * @return Current configuration, or null if not configured
     */
    PaymentProcessorConfig getConfiguration();
    
    /**
     * Check if the processor is properly configured and ready to process payments.
     * 
     * @return true if configured and ready, false otherwise
     */
    boolean isConfigured();
}
