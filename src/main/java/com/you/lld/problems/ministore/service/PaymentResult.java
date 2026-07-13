package com.you.lld.problems.ministore.service;

/** What the gateway returns. Success carries a transactionId; failure carries a reason. */
public final class PaymentResult {

    private final boolean approved;
    private final String transactionId;
    private final String declineReason;

    private PaymentResult(boolean approved, String transactionId, String declineReason) {
        this.approved = approved;
        this.transactionId = transactionId;
        this.declineReason = declineReason;
    }

    public static PaymentResult approved(String transactionId) {
        return new PaymentResult(true, transactionId, null);
    }

    public static PaymentResult declined(String reason) {
        return new PaymentResult(false, null, reason);
    }

    public boolean approved() { return approved; }
    public String transactionId() { return transactionId; }
    public String declineReason() { return declineReason; }
}
