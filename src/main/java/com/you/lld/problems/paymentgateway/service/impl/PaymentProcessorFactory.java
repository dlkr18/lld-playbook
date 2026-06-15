package com.you.lld.problems.paymentgateway.service.impl;

import com.you.lld.problems.paymentgateway.model.PaymentMethod;
import com.you.lld.problems.paymentgateway.service.PaymentProcessor;

import java.util.EnumMap;
import java.util.Map;

public final class PaymentProcessorFactory {
    private static final Map<PaymentMethod, PaymentProcessor> PROCESSORS =
            new EnumMap<PaymentMethod, PaymentProcessor>(PaymentMethod.class);

    static {
        PROCESSORS.put(PaymentMethod.CARD, new CardPaymentProcessor());
        PROCESSORS.put(PaymentMethod.UPI, new UpiPaymentProcessor());
        PROCESSORS.put(PaymentMethod.WALLET, new WalletPaymentProcessor());
        PROCESSORS.put(PaymentMethod.BANK_TRANSFER, new BankTransferPaymentProcessor());
    }

    private PaymentProcessorFactory() {
    }

    public static PaymentProcessor forMethod(PaymentMethod method) {
        PaymentProcessor processor = PROCESSORS.get(method);
        if (processor == null) {
            throw new IllegalArgumentException("Unsupported method: " + method);
        }
        return processor;
    }
}
