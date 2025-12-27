package com.you.lld.examples.week2.day6.factory;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.BeforeEach;

import java.math.BigDecimal;
import java.util.Arrays;

import static org.junit.jupiter.api.Assertions.*;

/**
 * Comprehensive tests for the Payment Processor Factory pattern implementation.
 * Demonstrates testing strategies for Factory pattern.
 */
@DisplayName("Payment Processor Factory Pattern Tests")
class PaymentProcessorFactoryTest {

    @Nested
    @DisplayName("Basic Factory Creation Tests")
    class BasicFactoryCreationTests {

        @Test
        @DisplayName("Should create credit card processor")
        void shouldCreateCreditCardProcessor() {
            PaymentProcessor processor = PaymentProcessorFactory.createProcessor(PaymentMethod.CREDIT_CARD);
            
            assertNotNull(processor);
            assertInstanceOf(CreditCardProcessor.class, processor);
            assertEquals(PaymentMethod.CREDIT_CARD, processor.getSupportedPaymentMethod());
        }

        @Test
        @DisplayName("Should create PayPal processor")
        void shouldCreatePayPalProcessor() {
            PaymentProcessor processor = PaymentProcessorFactory.createProcessor(PaymentMethod.PAYPAL);
            
            assertNotNull(processor);
            assertInstanceOf(PayPalProcessor.class, processor);
            assertEquals(PaymentMethod.PAYPAL, processor.getSupportedPaymentMethod());
        }

        @Test
        @DisplayName("Should create debit card processor")
        void shouldCreateDebitCardProcessor() {
            PaymentProcessor processor = PaymentProcessorFactory.createProcessor(PaymentMethod.DEBIT_CARD);
            
            assertNotNull(processor);
            assertInstanceOf(DebitCardProcessor.class, processor);
            assertEquals(PaymentMethod.DEBIT_CARD, processor.getSupportedPaymentMethod());
        }

        @Test
        @DisplayName("Should create bank transfer processor")
        void shouldCreateBankTransferProcessor() {
            PaymentProcessor processor = PaymentProcessorFactory.createProcessor(PaymentMethod.BANK_TRANSFER);
            
            assertNotNull(processor);
            assertInstanceOf(BankTransferProcessor.class, processor);
            assertEquals(PaymentMethod.BANK_TRANSFER, processor.getSupportedPaymentMethod());
        }

        @Test
        @DisplayName("Should create different instances for each call")
        void shouldCreateDifferentInstancesForEachCall() {
            PaymentProcessor processor1 = PaymentProcessorFactory.createProcessor(PaymentMethod.CREDIT_CARD);
            PaymentProcessor processor2 = PaymentProcessorFactory.createProcessor(PaymentMethod.CREDIT_CARD);
            
            assertNotSame(processor1, processor2);
            assertEquals(processor1.getClass(), processor2.getClass());
        }
    }

    @Nested
    @DisplayName("Factory Validation Tests")
    class FactoryValidationTests {

        @Test
        @DisplayName("Should reject null payment method")
        void shouldRejectNullPaymentMethod() {
            IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () ->
                    PaymentProcessorFactory.createProcessor(null)
            );
            
            assertTrue(exception.getMessage().contains("Payment method cannot be null"));
        }

        @Test
        @DisplayName("Should reject unsupported payment method")
        void shouldRejectUnsupportedPaymentMethod() {
            IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () ->
                    PaymentProcessorFactory.createProcessor(PaymentMethod.CRYPTOCURRENCY)
            );
            
            assertTrue(exception.getMessage().contains("Unsupported payment method"));
        }
    }

    @Nested
    @DisplayName("Supported Methods Tests")
    class SupportedMethodsTests {

        @Test
        @DisplayName("Should report correct supported payment methods")
        void shouldReportCorrectSupportedPaymentMethods() {
            PaymentMethod[] supportedMethods = PaymentProcessorFactory.getSupportedPaymentMethods();
            
            assertTrue(supportedMethods.length >= 4);
            assertTrue(Arrays.asList(supportedMethods).contains(PaymentMethod.CREDIT_CARD));
            assertTrue(Arrays.asList(supportedMethods).contains(PaymentMethod.DEBIT_CARD));
            assertTrue(Arrays.asList(supportedMethods).contains(PaymentMethod.PAYPAL));
            assertTrue(Arrays.asList(supportedMethods).contains(PaymentMethod.BANK_TRANSFER));
        }

        @Test
        @DisplayName("Should correctly identify supported methods")
        void shouldCorrectlyIdentifySupportedMethods() {
            assertTrue(PaymentProcessorFactory.isSupported(PaymentMethod.CREDIT_CARD));
            assertTrue(PaymentProcessorFactory.isSupported(PaymentMethod.PAYPAL));
            assertTrue(PaymentProcessorFactory.isSupported(PaymentMethod.DEBIT_CARD));
            assertTrue(PaymentProcessorFactory.isSupported(PaymentMethod.BANK_TRANSFER));
            
            assertFalse(PaymentProcessorFactory.isSupported(PaymentMethod.CRYPTOCURRENCY));
            assertFalse(PaymentProcessorFactory.isSupported(null));
        }
    }

    @Nested
    @DisplayName("Configuration Tests")
    class ConfigurationTests {

        @Test
        @DisplayName("Should create processor with configuration")
        void shouldCreateProcessorWithConfiguration() {
            PaymentProcessorConfig config = new PaymentProcessorConfig();
            config.setApiKey("test-api-key");
            config.setSandboxMode(false);
            config.setProcessingFeePercentage(new BigDecimal("0.025"));

            PaymentProcessor processor = PaymentProcessorFactory.createProcessor(PaymentMethod.CREDIT_CARD, config);
            
            assertNotNull(processor);
            assertInstanceOf(ConfigurablePaymentProcessor.class, processor);
            
            ConfigurablePaymentProcessor configurableProcessor = (ConfigurablePaymentProcessor) processor;
            assertTrue(configurableProcessor.isConfigured());
            assertEquals("test-api-key", configurableProcessor.getConfiguration().getApiKey());
            assertFalse(configurableProcessor.getConfiguration().isSandboxMode());
        }

        @Test
        @DisplayName("Should handle non-configurable processors gracefully")
        void shouldHandleNonConfigurableProcessorsGracefully() {
            PaymentProcessorConfig config = new PaymentProcessorConfig();
            config.setApiKey("test-api-key");

            // PayPal processor doesn't implement ConfigurablePaymentProcessor
            PaymentProcessor processor = PaymentProcessorFactory.createProcessor(PaymentMethod.PAYPAL, config);
            
            assertNotNull(processor);
            // Should not throw exception even though PayPal processor isn't configurable
        }
    }

    @Nested
    @DisplayName("Optimal Processor Selection Tests")
    class OptimalProcessorSelectionTests {

        @Test
        @DisplayName("Should select credit card for large amounts")
        void shouldSelectCreditCardForLargeAmounts() {
            PaymentMethod[] availableMethods = {
                PaymentMethod.CREDIT_CARD, 
                PaymentMethod.PAYPAL, 
                PaymentMethod.BANK_TRANSFER
            };

            PaymentProcessor processor = PaymentProcessorFactory.createOptimalProcessor(
                new BigDecimal("1500.00"), 
                "USD", 
                availableMethods
            );

            assertEquals(PaymentMethod.CREDIT_CARD, processor.getSupportedPaymentMethod());
        }

        @Test
        @DisplayName("Should select first available method for medium amounts")
        void shouldSelectFirstAvailableMethodForMediumAmounts() {
            PaymentMethod[] availableMethods = {
                PaymentMethod.PAYPAL, 
                PaymentMethod.CREDIT_CARD
            };

            PaymentProcessor processor = PaymentProcessorFactory.createOptimalProcessor(
                new BigDecimal("100.00"), 
                "USD", 
                availableMethods
            );

            assertEquals(PaymentMethod.PAYPAL, processor.getSupportedPaymentMethod());
        }

        @Test
        @DisplayName("Should reject empty available methods")
        void shouldRejectEmptyAvailableMethods() {
            IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () ->
                    PaymentProcessorFactory.createOptimalProcessor(
                        new BigDecimal("100.00"), 
                        "USD"
                    )
            );
            
            assertTrue(exception.getMessage().contains("At least one payment method must be available"));
        }

        @Test
        @DisplayName("Should reject when no supported methods available")
        void shouldRejectWhenNoSupportedMethodsAvailable() {
            PaymentMethod[] unsupportedMethods = {PaymentMethod.CRYPTOCURRENCY};

            IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () ->
                    PaymentProcessorFactory.createOptimalProcessor(
                        new BigDecimal("100.00"), 
                        "USD", 
                        unsupportedMethods
                    )
            );
            
            assertTrue(exception.getMessage().contains("No supported payment methods available"));
        }
    }

    @Nested
    @DisplayName("Dynamic Registration Tests")
    class DynamicRegistrationTests {

        @BeforeEach
        void setUp() {
            // Clean up any previous test registrations
            // Note: In a real implementation, you might want a way to reset the factory
        }

        @Test
        @DisplayName("Should register new processor type")
        void shouldRegisterNewProcessorType() {
            // Register the new processor
            PaymentProcessorFactory.registerProcessor(PaymentMethod.APPLE_PAY, TestProcessor.class);

            // Verify it's now supported
            assertTrue(PaymentProcessorFactory.isSupported(PaymentMethod.APPLE_PAY));

            // Verify we can create it
            PaymentProcessor processor = PaymentProcessorFactory.createProcessor(PaymentMethod.APPLE_PAY);
            assertNotNull(processor);
            assertInstanceOf(TestProcessor.class, processor);
        }

        @Test
        @DisplayName("Should reject null parameters in registration")
        void shouldRejectNullParametersInRegistration() {
            IllegalArgumentException exception1 = assertThrows(IllegalArgumentException.class, () ->
                    PaymentProcessorFactory.registerProcessor(null, CreditCardProcessor.class)
            );
            
            IllegalArgumentException exception2 = assertThrows(IllegalArgumentException.class, () ->
                    PaymentProcessorFactory.registerProcessor(PaymentMethod.APPLE_PAY, null)
            );
            
            assertTrue(exception1.getMessage().contains("cannot be null"));
            assertTrue(exception2.getMessage().contains("cannot be null"));
        }
    }

    // Test processor for dynamic registration testing
    public static class TestProcessor implements PaymentProcessor {
        @Override
        public PaymentResult processPayment(BigDecimal amount, String currency, PaymentDetails paymentDetails) {
            return PaymentResult.success("TEST_123", amount, currency, PaymentMethod.APPLE_PAY, BigDecimal.ZERO);
        }

        @Override
        public boolean validatePaymentDetails(PaymentDetails paymentDetails) {
            return true;
        }

        @Override
        public PaymentMethod getSupportedPaymentMethod() {
            return PaymentMethod.APPLE_PAY;
        }

        @Override
        public boolean supportsCurrency(String currency) {
            return "USD".equals(currency);
        }

        @Override
        public BigDecimal getProcessingFee(BigDecimal amount, String currency) {
            return BigDecimal.ZERO;
        }
    }

    @Nested
    @DisplayName("Integration Tests")
    class IntegrationTests {

        @Test
        @DisplayName("Should create functional payment processors")
        void shouldCreateFunctionalPaymentProcessors() throws PaymentException {
            // Test credit card processor
            PaymentProcessor ccProcessor = PaymentProcessorFactory.createProcessor(PaymentMethod.CREDIT_CARD);
            PaymentDetails ccDetails = new PaymentDetails();
            ccDetails.setCardNumber("4111111111111111");
            ccDetails.setExpiryDate("12/26");  // Changed to future date
            ccDetails.setCvv("123");
            ccDetails.setCardHolderName("John Doe");

            PaymentResult ccResult = ccProcessor.processPayment(new BigDecimal("99.99"), "USD", ccDetails);
            assertTrue(ccResult.isSuccess());
            assertNotNull(ccResult.getTransactionId());

            // Test PayPal processor
            PaymentProcessor paypalProcessor = PaymentProcessorFactory.createProcessor(PaymentMethod.PAYPAL);
            PaymentDetails paypalDetails = new PaymentDetails();
            paypalDetails.setPayPalEmail("user@example.com");

            PaymentResult paypalResult = paypalProcessor.processPayment(new BigDecimal("49.99"), "USD", paypalDetails);
            assertTrue(paypalResult.isSuccess());
            assertNotNull(paypalResult.getTransactionId());
        }

        @Test
        @DisplayName("Should handle processor-specific validation")
        void shouldHandleProcessorSpecificValidation() {
            PaymentProcessor ccProcessor = PaymentProcessorFactory.createProcessor(PaymentMethod.CREDIT_CARD);
            PaymentProcessor paypalProcessor = PaymentProcessorFactory.createProcessor(PaymentMethod.PAYPAL);

            // Credit card details
            PaymentDetails ccDetails = new PaymentDetails();
            ccDetails.setCardNumber("4111111111111111");
            ccDetails.setExpiryDate("12/26");  // Changed to future date
            ccDetails.setCvv("123");
            ccDetails.setCardHolderName("John Doe");

            // PayPal details
            PaymentDetails paypalDetails = new PaymentDetails();
            paypalDetails.setPayPalEmail("user@example.com");

            // Cross-validation should fail
            assertFalse(ccProcessor.validatePaymentDetails(paypalDetails));
            assertFalse(paypalProcessor.validatePaymentDetails(ccDetails));

            // Correct validation should pass
            assertTrue(ccProcessor.validatePaymentDetails(ccDetails));
            assertTrue(paypalProcessor.validatePaymentDetails(paypalDetails));
        }

        @Test
        @DisplayName("Should calculate different processing fees")
        void shouldCalculateDifferentProcessingFees() {
            PaymentProcessor ccProcessor = PaymentProcessorFactory.createProcessor(PaymentMethod.CREDIT_CARD);
            PaymentProcessor paypalProcessor = PaymentProcessorFactory.createProcessor(PaymentMethod.PAYPAL);
            PaymentProcessor bankProcessor = PaymentProcessorFactory.createProcessor(PaymentMethod.BANK_TRANSFER);

            BigDecimal amount = new BigDecimal("100.00");
            String currency = "USD";

            BigDecimal ccFee = ccProcessor.getProcessingFee(amount, currency);
            BigDecimal paypalFee = paypalProcessor.getProcessingFee(amount, currency);
            BigDecimal bankFee = bankProcessor.getProcessingFee(amount, currency);

            // All should be positive
            assertTrue(ccFee.compareTo(BigDecimal.ZERO) > 0);
            assertTrue(paypalFee.compareTo(BigDecimal.ZERO) > 0);
            assertTrue(bankFee.compareTo(BigDecimal.ZERO) > 0);

            // Bank transfer should have flat fee
            assertEquals(new BigDecimal("1.50"), bankFee);

            // PayPal should have higher percentage than credit card
            assertTrue(paypalFee.compareTo(ccFee) > 0);
        }
    }
}
