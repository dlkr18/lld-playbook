package com.you.lld.problems.paymentgateway.impl;
import com.you.lld.problems.paymentgateway.api.*;
import com.you.lld.problems.paymentgateway.model.*;
import java.util.*;
public class InMemoryPaymentGatewayService implements PaymentGatewayService { private Map<String,Transaction> transactions = new HashMap<>(); public Transaction processPayment(String mid, String cid, double amt, PaymentMethod m) { String id = UUID.randomUUID().toString(); Transaction t = new Transaction(id,mid,cid,amt); t.setStatus(TransactionStatus.SUCCESS); transactions.put(id,t); return t; } public Transaction getTransaction(String id) { return transactions.get(id); } public Refund processRefund(String tid, double amt) { return new Refund("R1",tid,amt); } }