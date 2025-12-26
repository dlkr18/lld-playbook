package com.you.lld.problems.ridehailing.model;
public
class Payment  {
    private String paymentId, tripId;
    private double amount;
    public Payment(String id, String tid, double amt)  {
        paymentId=id;
        tripId=tid;
        amount=amt;
    }
    public double getAmount()  {
        return amount;
    }
}
