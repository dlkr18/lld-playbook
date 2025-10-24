package com.you.lld.examples.week2.day6.factory;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.Arrays;
import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

/**
 * Credit card payment processor implementation.
 * Demonstrates concrete implementation of the PaymentProcessor interface.
 */
public class CreditCardProcessor implements PaymentProcessor, ConfigurablePaymentProcessor {
    
    private static final Set<String> SUPPORTED_CURRENCIES = new HashSet<>(
        Arrays.asList("USD", "EUR", "GBP", "CAD", "AUD", "JPY")
    );
    
    private static final BigDecimal DEFAULT_FEE_PERCENTAGE = new BigDecimal("0.029"); // 2.9%
    private static final BigDecimal DEFAULT_FIXED_FEE = new BigDecimal("0.30");
    
    private PaymentProcessorConfig config;
    
    public CreditCardProcessor() {
        // Default configuration
        this.config = new PaymentProcessorConfig();
        this.config.setProcessingFeePercentage(DEFAULT_FEE_PERCENTAGE);
        this.config.setFixedProcessingFee(DEFAULT_FIXED_FEE);
        this.config.setSandboxMode(true); // Default to sandbox for safety
    }
    
    @Override
    public PaymentResult processPayment(BigDecimal amount, String currency, PaymentDetails paymentDetails) 
            throws PaymentException {
        
        // Validate inputs
        validateAmount(amount);
        validateCurrency(currency);
        
        if (!validatePaymentDetails(paymentDetails)) {
            throw new PaymentException(
                PaymentException.ErrorCodes.INVALID_CARD_NUMBER,
                "Invalid credit card details provided",
                PaymentMethod.CREDIT_CARD
            );
        }
        
        try {
            // Simulate payment processing
            String transactionId = generateTransactionId();
            BigDecimal processingFee = getProcessingFee(amount, currency);
            
            // In a real implementation, this would make API calls to payment gateway
            if (config.isSandboxMode()) {
                return simulatePaymentProcessing(transactionId, amount, currency, processingFee, paymentDetails);
            } else {
                return processRealPayment(transactionId, amount, currency, processingFee, paymentDetails);
            }
            
        } catch (Exception e) {
            throw new PaymentException(
                PaymentException.ErrorCodes.PROCESSING_ERROR,
                "Failed to process credit card payment: " + e.getMessage(),
                PaymentMethod.CREDIT_CARD,
                e
            );
        }
    }
    
    @Override
    public boolean validatePaymentDetails(PaymentDetails paymentDetails) {
        if (paymentDetails == null) {
            return false;
        }
        
        // Validate required fields
        String cardNumber = paymentDetails.getCardNumber();
        String expiryDate = paymentDetails.getExpiryDate();
        String cvv = paymentDetails.getCvv();
        String cardHolderName = paymentDetails.getCardHolderName();
        
        return isValidCardNumber(cardNumber) &&
               isValidExpiryDate(expiryDate) &&
               isValidCvv(cvv) &&
               isValidCardHolderName(cardHolderName);
    }
    
    @Override
    public PaymentMethod getSupportedPaymentMethod() {
        return PaymentMethod.CREDIT_CARD;
    }
    
    @Override
    public boolean supportsCurrency(String currency) {
        return currency != null && SUPPORTED_CURRENCIES.contains(currency.toUpperCase());
    }
    
    @Override
    public BigDecimal getProcessingFee(BigDecimal amount, String currency) {
        if (amount == null || amount.compareTo(BigDecimal.ZERO) <= 0) {
            return BigDecimal.ZERO;
        }
        
        BigDecimal percentageFee = config.getProcessingFeePercentage() != null ?
            config.getProcessingFeePercentage() : DEFAULT_FEE_PERCENTAGE;
        BigDecimal fixedFee = config.getFixedProcessingFee() != null ?
            config.getFixedProcessingFee() : DEFAULT_FIXED_FEE;
        
        BigDecimal variableFee = amount.multiply(percentageFee);
        return variableFee.add(fixedFee).setScale(2, RoundingMode.HALF_UP);
    }
    
    @Override
    public void configure(PaymentProcessorConfig config) {
        if (config == null) {
            throw new IllegalArgumentException("Configuration cannot be null");
        }
        
        // Validate required configuration
        if (!config.isSandboxMode() && config.getApiKey() == null) {
            throw new IllegalArgumentException("API key is required for production mode");
        }
        
        this.config = config;
    }
    
    @Override
    public PaymentProcessorConfig getConfiguration() {
        return config;
    }
    
    @Override
    public boolean isConfigured() {
        return config != null && (config.isSandboxMode() || config.getApiKey() != null);
    }
    
    // Private helper methods
    
    private void validateAmount(BigDecimal amount) throws PaymentException {
        if (amount == null || amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new PaymentException(
                PaymentException.ErrorCodes.AMOUNT_TOO_SMALL,
                "Amount must be greater than zero",
                PaymentMethod.CREDIT_CARD
            );
        }
        
        // Check maximum amount (example limit)
        if (amount.compareTo(new BigDecimal("10000")) > 0) {
            throw new PaymentException(
                PaymentException.ErrorCodes.AMOUNT_TOO_LARGE,
                "Amount exceeds maximum limit of $10,000",
                PaymentMethod.CREDIT_CARD
            );
        }
    }
    
    private void validateCurrency(String currency) throws PaymentException {
        if (!supportsCurrency(currency)) {
            throw new PaymentException(
                PaymentException.ErrorCodes.UNSUPPORTED_CURRENCY,
                "Currency " + currency + " is not supported",
                PaymentMethod.CREDIT_CARD
            );
        }
    }
    
    private boolean isValidCardNumber(String cardNumber) {
        if (cardNumber == null || cardNumber.trim().isEmpty()) {
            return false;
        }
        
        // Remove spaces and dashes
        String cleanCardNumber = cardNumber.replaceAll("[\\s-]", "");
        
        // Check if all digits
        if (!cleanCardNumber.matches("\\d+")) {
            return false;
        }
        
        // Check length (13-19 digits for most cards)
        if (cleanCardNumber.length() < 13 || cleanCardNumber.length() > 19) {
            return false;
        }
        
        // Luhn algorithm check
        return isValidLuhn(cleanCardNumber);
    }
    
    private boolean isValidLuhn(String cardNumber) {
        int sum = 0;
        boolean alternate = false;
        
        for (int i = cardNumber.length() - 1; i >= 0; i--) {
            int digit = Character.getNumericValue(cardNumber.charAt(i));
            
            if (alternate) {
                digit *= 2;
                if (digit > 9) {
                    digit = (digit % 10) + 1;
                }
            }
            
            sum += digit;
            alternate = !alternate;
        }
        
        return sum % 10 == 0;
    }
    
    private boolean isValidExpiryDate(String expiryDate) {
        if (expiryDate == null || expiryDate.trim().isEmpty()) {
            return false;
        }
        
        try {
            // Support MM/YY and MM/YYYY formats
            DateTimeFormatter formatter;
            if (expiryDate.length() == 5) { // MM/YY
                formatter = DateTimeFormatter.ofPattern("MM/yy");
            } else if (expiryDate.length() == 7) { // MM/YYYY
                formatter = DateTimeFormatter.ofPattern("MM/yyyy");
            } else {
                return false;
            }
            
            LocalDate expiry = LocalDate.parse("01/" + expiryDate, 
                DateTimeFormatter.ofPattern("dd/MM/" + (expiryDate.length() == 5 ? "yy" : "yyyy")));
            
            // Check if card is not expired
            return expiry.isAfter(LocalDate.now().withDayOfMonth(1));
            
        } catch (DateTimeParseException e) {
            return false;
        }
    }
    
    private boolean isValidCvv(String cvv) {
        return cvv != null && cvv.matches("\\d{3,4}");
    }
    
    private boolean isValidCardHolderName(String cardHolderName) {
        return cardHolderName != null && 
               cardHolderName.trim().length() >= 2 && 
               cardHolderName.matches("[a-zA-Z\\s]+");
    }
    
    private String generateTransactionId() {
        return "CC_" + UUID.randomUUID().toString().replace("-", "").substring(0, 12).toUpperCase();
    }
    
    private PaymentResult simulatePaymentProcessing(String transactionId, BigDecimal amount, 
                                                   String currency, BigDecimal processingFee, 
                                                   PaymentDetails paymentDetails) {
        
        // Simulate different outcomes based on card number for testing
        String cardNumber = paymentDetails.getCardNumber();
        if (cardNumber != null) {
            String lastFourDigits = cardNumber.replaceAll("[\\s-]", "");
            lastFourDigits = lastFourDigits.substring(lastFourDigits.length() - 4);
            
            // Simulate declined card
            if ("0000".equals(lastFourDigits)) {
                return PaymentResult.failure(
                    PaymentException.ErrorCodes.CARD_DECLINED,
                    "Card was declined by the issuing bank",
                    PaymentMethod.CREDIT_CARD
                );
            }
            
            // Simulate insufficient funds
            if ("0001".equals(lastFourDigits)) {
                return PaymentResult.failure(
                    PaymentException.ErrorCodes.INSUFFICIENT_FUNDS,
                    "Insufficient funds available",
                    PaymentMethod.CREDIT_CARD
                );
            }
        }
        
        // Simulate successful payment
        return PaymentResult.success(transactionId, amount, currency, PaymentMethod.CREDIT_CARD, processingFee);
    }
    
    private PaymentResult processRealPayment(String transactionId, BigDecimal amount, 
                                           String currency, BigDecimal processingFee, 
                                           PaymentDetails paymentDetails) throws PaymentException {
        
        // In a real implementation, this would:
        // 1. Make API calls to payment gateway (Stripe, Square, etc.)
        // 2. Handle authentication and authorization
        // 3. Process webhooks and callbacks
        // 4. Handle 3D Secure authentication
        // 5. Store transaction records
        
        throw new PaymentException(
            PaymentException.ErrorCodes.PROCESSING_ERROR,
            "Real payment processing not implemented in this example",
            PaymentMethod.CREDIT_CARD
        );
    }
}
