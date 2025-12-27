package com.you.lld.problems.amazon.api;

import com.you.lld.problems.amazon.model.*;
import java.math.BigDecimal;

public interface PaymentService {
    Payment initiatePayment(String orderId, String userId, BigDecimal amount, PaymentMethod method);
    void processPayment(String paymentId, String transactionId);
    void confirmPayment(String paymentId);
    void failPayment(String paymentId);
    void refundPayment(String paymentId);
    Payment getPayment(String paymentId);
    PaymentStatus getPaymentStatus(String paymentId);
}


