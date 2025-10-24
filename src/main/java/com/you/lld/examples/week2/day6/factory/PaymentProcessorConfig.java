package com.you.lld.examples.week2.day6.factory;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.Map;

/**
 * Configuration class for payment processors.
 * Contains settings that can be used to customize processor behavior.
 */
public class PaymentProcessorConfig {
    private final Map<String, Object> properties;
    
    public PaymentProcessorConfig() {
        this.properties = new HashMap<>();
    }
    
    public PaymentProcessorConfig(Map<String, Object> properties) {
        this.properties = new HashMap<>(properties);
    }
    
    // Generic property methods
    public void setProperty(String key, Object value) {
        properties.put(key, value);
    }
    
    public Object getProperty(String key) {
        return properties.get(key);
    }
    
    public <T> T getProperty(String key, Class<T> type) {
        Object value = properties.get(key);
        if (value != null && type.isInstance(value)) {
            return type.cast(value);
        }
        return null;
    }
    
    public boolean hasProperty(String key) {
        return properties.containsKey(key);
    }
    
    // Common configuration properties
    
    // API credentials
    public void setApiKey(String apiKey) {
        setProperty("apiKey", apiKey);
    }
    
    public String getApiKey() {
        return getProperty("apiKey", String.class);
    }
    
    public void setSecretKey(String secretKey) {
        setProperty("secretKey", secretKey);
    }
    
    public String getSecretKey() {
        return getProperty("secretKey", String.class);
    }
    
    // Environment settings
    public void setSandboxMode(boolean sandboxMode) {
        setProperty("sandboxMode", sandboxMode);
    }
    
    public boolean isSandboxMode() {
        Boolean value = getProperty("sandboxMode", Boolean.class);
        return value != null ? value : false;
    }
    
    // Timeout settings
    public void setConnectionTimeout(int timeoutMs) {
        setProperty("connectionTimeout", timeoutMs);
    }
    
    public int getConnectionTimeout() {
        Integer value = getProperty("connectionTimeout", Integer.class);
        return value != null ? value : 30000; // Default 30 seconds
    }
    
    public void setReadTimeout(int timeoutMs) {
        setProperty("readTimeout", timeoutMs);
    }
    
    public int getReadTimeout() {
        Integer value = getProperty("readTimeout", Integer.class);
        return value != null ? value : 60000; // Default 60 seconds
    }
    
    // Fee settings
    public void setProcessingFeePercentage(BigDecimal feePercentage) {
        setProperty("processingFeePercentage", feePercentage);
    }
    
    public BigDecimal getProcessingFeePercentage() {
        return getProperty("processingFeePercentage", BigDecimal.class);
    }
    
    public void setFixedProcessingFee(BigDecimal fixedFee) {
        setProperty("fixedProcessingFee", fixedFee);
    }
    
    public BigDecimal getFixedProcessingFee() {
        return getProperty("fixedProcessingFee", BigDecimal.class);
    }
    
    // Retry settings
    public void setMaxRetries(int maxRetries) {
        setProperty("maxRetries", maxRetries);
    }
    
    public int getMaxRetries() {
        Integer value = getProperty("maxRetries", Integer.class);
        return value != null ? value : 3;
    }
    
    public void setRetryDelayMs(int retryDelayMs) {
        setProperty("retryDelayMs", retryDelayMs);
    }
    
    public int getRetryDelayMs() {
        Integer value = getProperty("retryDelayMs", Integer.class);
        return value != null ? value : 1000; // Default 1 second
    }
    
    // Webhook settings
    public void setWebhookUrl(String webhookUrl) {
        setProperty("webhookUrl", webhookUrl);
    }
    
    public String getWebhookUrl() {
        return getProperty("webhookUrl", String.class);
    }
    
    public void setWebhookSecret(String webhookSecret) {
        setProperty("webhookSecret", webhookSecret);
    }
    
    public String getWebhookSecret() {
        return getProperty("webhookSecret", String.class);
    }
    
    @Override
    public String toString() {
        // Don't expose sensitive information
        Map<String, Object> safeProperties = new HashMap<>();
        for (Map.Entry<String, Object> entry : properties.entrySet()) {
            String key = entry.getKey();
            Object value = entry.getValue();
            
            if (key.toLowerCase().contains("secret") || key.toLowerCase().contains("key")) {
                safeProperties.put(key, "***");
            } else {
                safeProperties.put(key, value);
            }
        }
        
        return "PaymentProcessorConfig{" + "properties=" + safeProperties + '}';
    }
}
