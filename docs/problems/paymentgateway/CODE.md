# Payment Gateway - Complete Implementation

## 📂 20 Java Files

### PaymentGateway.java

<details><summary>📄 View</summary>

```java
package com.you.lld.problems.paymentgateway;
import java.util.*;

public class PaymentGateway {
    private final Map<String, PaymentResult> transactions;
    
    public PaymentGateway() {
        this.transactions = new HashMap<>();
    }
    
    public PaymentResult processPayment(PaymentMethod method, double amount, Map<String, String> details) {
        String txnId = UUID.randomUUID().toString();
        PaymentStatus status = amount > 0 ? PaymentStatus.SUCCESS : PaymentStatus.FAILED;
        PaymentResult result = new PaymentResult(txnId, status, "Payment processed");
        transactions.put(txnId, result);
        return result;
    }
    
    public PaymentResult getStatus(String transactionId) {
        return transactions.get(transactionId);
    }
}

```
</details>

### PaymentGatewayDemo.java

<details><summary>📄 View</summary>

```java
package com.you.lld.problems.paymentgateway;
import com.you.lld.problems.paymentgateway.api.*;
import com.you.lld.problems.paymentgateway.impl.*;
import com.you.lld.problems.paymentgateway.model.*;
public class PaymentGatewayDemo { public static void main(String[] args) { System.out.println("Payment Gateway Demo"); PaymentGatewayService service = new InMemoryPaymentGatewayService(); Transaction txn = service.processPayment("M1","C1",99.99,PaymentMethod.CARD); System.out.println("Transaction " + txn.getTransactionId() + ": " + txn.getStatus()); Refund refund = service.processRefund(txn.getTransactionId(), 50.0); System.out.println("Refund processed"); } }
```
</details>

### PaymentMethod.java

<details><summary>📄 View</summary>

```java
package com.you.lld.problems.paymentgateway;
public enum PaymentMethod { CREDIT_CARD, DEBIT_CARD, UPI, NET_BANKING, WALLET }

```
</details>

### PaymentResult.java

<details><summary>📄 View</summary>

```java
package com.you.lld.problems.paymentgateway;
public class PaymentResult {
    private final String transactionId;
    private final PaymentStatus status;
    private final String message;
    
    public PaymentResult(String transactionId, PaymentStatus status, String message) {
        this.transactionId = transactionId;
        this.status = status;
        this.message = message;
    }
    
    public String getTransactionId() { return transactionId; }
    public PaymentStatus getStatus() { return status; }
    public String getMessage() { return message; }
}

```
</details>

### PaymentStatus.java

<details><summary>📄 View</summary>

```java
package com.you.lld.problems.paymentgateway;
public enum PaymentStatus { PENDING, PROCESSING, SUCCESS, FAILED, REFUNDED }

```
</details>

### PaymentGatewayService.java

<details><summary>📄 View</summary>

```java
package com.you.lld.problems.paymentgateway.api;
import com.you.lld.problems.paymentgateway.model.*;
public interface PaymentGatewayService { Transaction processPayment(String merchantId, String customerId, double amount, PaymentMethod method); Transaction getTransaction(String transactionId); Refund processRefund(String transactionId, double amount); }
```
</details>

### InsufficientFundsException.java

<details><summary>📄 View</summary>

```java
package com.you.lld.problems.paymentgateway.exceptions;
public class InsufficientFundsException extends RuntimeException { public InsufficientFundsException(String m) { super(m); } }
```
</details>

### InvalidCardException.java

<details><summary>📄 View</summary>

```java
package com.you.lld.problems.paymentgateway.exceptions;
public class InvalidCardException extends RuntimeException { public InvalidCardException(String m) { super(m); } }
```
</details>

### RefundNotFoundException.java

<details><summary>📄 View</summary>

```java
package com.you.lld.problems.paymentgateway.exceptions;
public class RefundNotFoundException extends RuntimeException { public RefundNotFoundException(String m) { super(m); } }
```
</details>

### TransactionFailedException.java

<details><summary>📄 View</summary>

```java
package com.you.lld.problems.paymentgateway.exceptions;
public class TransactionFailedException extends RuntimeException { public TransactionFailedException(String m) { super(m); } }
```
</details>

### InMemoryPaymentGatewayService.java

<details><summary>📄 View</summary>

```java
package com.you.lld.problems.paymentgateway.impl;
import com.you.lld.problems.paymentgateway.api.*;
import com.you.lld.problems.paymentgateway.model.*;
import java.util.*;
public class InMemoryPaymentGatewayService implements PaymentGatewayService { private Map<String,Transaction> transactions = new HashMap<>(); public Transaction processPayment(String mid, String cid, double amt, PaymentMethod m) { String id = UUID.randomUUID().toString(); Transaction t = new Transaction(id,mid,cid,amt); t.setStatus(TransactionStatus.SUCCESS); transactions.put(id,t); return t; } public Transaction getTransaction(String id) { return transactions.get(id); } public Refund processRefund(String tid, double amt) { return new Refund("R1",tid,amt); } }
```
</details>

### BankAccount.java

<details><summary>📄 View</summary>

```java
package com.you.lld.problems.paymentgateway.model;
public class BankAccount { private String accountNumber, ifsc; public BankAccount(String acc, String i) { accountNumber=acc; ifsc=i; } public String getAccountNumber() { return accountNumber; } }
```
</details>

### Card.java

<details><summary>📄 View</summary>

```java
package com.you.lld.problems.paymentgateway.model;
public class Card { private String cardNumber, cvv, expiryDate; public Card(String num, String c, String exp) { cardNumber=num; cvv=c; expiryDate=exp; } public String getCardNumber() { return cardNumber; } public boolean isValid() { return cardNumber!=null && cvv!=null; } }
```
</details>

### Customer.java

<details><summary>📄 View</summary>

```java
package com.you.lld.problems.paymentgateway.model;
public class Customer { private String customerId, name, email; public Customer(String id, String n, String e) { customerId=id; name=n; email=e; } public String getCustomerId() { return customerId; } }
```
</details>

### Merchant.java

<details><summary>📄 View</summary>

```java
package com.you.lld.problems.paymentgateway.model;
public class Merchant { private String merchantId, name, email; public Merchant(String id, String n, String e) { merchantId=id; name=n; email=e; } public String getMerchantId() { return merchantId; } }
```
</details>

### PaymentMethod.java

<details><summary>📄 View</summary>

```java
package com.you.lld.problems.paymentgateway.model;
public enum PaymentMethod { CARD, BANK_TRANSFER, UPI, WALLET }
```
</details>

### Refund.java

<details><summary>📄 View</summary>

```java
package com.you.lld.problems.paymentgateway.model;
import java.time.*;
public class Refund { private String refundId, transactionId; private double amount; private RefundStatus status; public Refund(String id, String tid, double amt) { refundId=id; transactionId=tid; amount=amt; status=RefundStatus.PENDING; } public RefundStatus getStatus() { return status; } public void setStatus(RefundStatus s) { status=s; } }
```
</details>

### RefundStatus.java

<details><summary>📄 View</summary>

```java
package com.you.lld.problems.paymentgateway.model;
public enum RefundStatus { PENDING, PROCESSED, FAILED }
```
</details>

### Transaction.java

<details><summary>📄 View</summary>

```java
package com.you.lld.problems.paymentgateway.model;
import java.time.*;
public class Transaction { private String transactionId, merchantId, customerId; private double amount; private TransactionStatus status; private LocalDateTime createdAt; public Transaction(String id, String mid, String cid, double amt) { transactionId=id; merchantId=mid; customerId=cid; amount=amt; status=TransactionStatus.PENDING; createdAt=LocalDateTime.now(); } public String getTransactionId() { return transactionId; } public double getAmount() { return amount; } public TransactionStatus getStatus() { return status; } public void setStatus(TransactionStatus s) { status=s; } }
```
</details>

### TransactionStatus.java

<details><summary>📄 View</summary>

```java
package com.you.lld.problems.paymentgateway.model;
public enum TransactionStatus { PENDING, SUCCESS, FAILED, REFUNDED }
```
</details>

