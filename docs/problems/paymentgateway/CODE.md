# paymentgateway - Complete Implementation

## 📁 Project Structure (18 files)

```
paymentgateway/
├── PaymentGatewayDemo.java
├── PaymentResult.java
├── PaymentStatus.java
├── api/PaymentGatewayService.java
├── exceptions/InsufficientFundsException.java
├── exceptions/InvalidCardException.java
├── exceptions/RefundNotFoundException.java
├── exceptions/TransactionFailedException.java
├── impl/InMemoryPaymentGatewayService.java
├── model/BankAccount.java
├── model/Card.java
├── model/Customer.java
├── model/Merchant.java
├── model/PaymentMethod.java
├── model/Refund.java
├── model/RefundStatus.java
├── model/Transaction.java
├── model/TransactionStatus.java
```

## 📝 Source Code

### 📄 `PaymentGatewayDemo.java`

```java
package com.you.lld.problems.paymentgateway;

import com.you.lld.problems.paymentgateway.api.*;
import com.you.lld.problems.paymentgateway.impl.*;
import com.you.lld.problems.paymentgateway.model.*;

public class PaymentGatewayDemo {
    public static void main(String[] args) {
        System.out.println("=== Payment Gateway System Demo ===\n");
        
        PaymentGatewayService service = new InMemoryPaymentGatewayService();
        
        // Process a payment
        Transaction txn = service.processPayment("M1", "C1", 99.99, PaymentMethod.CARD);
        System.out.println("✅ Transaction " + txn.getTransactionId() + ": " + txn.getStatus());
        
        // Process a refund
        Refund refund = service.processRefund(txn.getTransactionId(), 50.0);
        System.out.println("✅ Refund processed: $" + refund.getAmount());
        
        System.out.println("\n✅ Demo completed successfully!");
    }
}```

### 📄 `PaymentResult.java`

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

### 📄 `PaymentStatus.java`

```java
package com.you.lld.problems.paymentgateway;
public enum PaymentStatus { PENDING, PROCESSING, SUCCESS, FAILED, REFUNDED }
```

### 📄 `api/PaymentGatewayService.java`

```java
package com.you.lld.problems.paymentgateway.api;
import com.you.lld.problems.paymentgateway.model.*;
public
interface PaymentGatewayService  {
    Transaction processPayment(String merchantId, String customerId, double amount, PaymentMethod method);
    Transaction getTransaction(String transactionId);
    Refund processRefund(String transactionId, double amount);
}
```

### 📄 `exceptions/InsufficientFundsException.java`

```java
package com.you.lld.problems.paymentgateway.exceptions;
public class InsufficientFundsException extends RuntimeException { public InsufficientFundsException(String m) { super(m); } }```

### 📄 `exceptions/InvalidCardException.java`

```java
package com.you.lld.problems.paymentgateway.exceptions;
public class InvalidCardException extends RuntimeException { public InvalidCardException(String m) { super(m); } }```

### 📄 `exceptions/RefundNotFoundException.java`

```java
package com.you.lld.problems.paymentgateway.exceptions;
public class RefundNotFoundException extends RuntimeException { public RefundNotFoundException(String m) { super(m); } }```

### 📄 `exceptions/TransactionFailedException.java`

```java
package com.you.lld.problems.paymentgateway.exceptions;
public class TransactionFailedException extends RuntimeException { public TransactionFailedException(String m) { super(m); } }```

### 📄 `impl/InMemoryPaymentGatewayService.java`

```java
package com.you.lld.problems.paymentgateway.impl;
import com.you.lld.problems.paymentgateway.api.*;
import com.you.lld.problems.paymentgateway.model.*;
import java.util.*;
public class InMemoryPaymentGatewayService implements PaymentGatewayService { private Map<String,Transaction> transactions = new HashMap<>(); public Transaction processPayment(String mid, String cid, double amt, PaymentMethod m) { String id = UUID.randomUUID().toString(); Transaction t = new Transaction(id,mid,cid,amt); t.setStatus(TransactionStatus.SUCCESS); transactions.put(id,t); return t; } public Transaction getTransaction(String id) { return transactions.get(id); } public Refund processRefund(String tid, double amt) { return new Refund("R1",tid,amt); } }```

### 📄 `model/BankAccount.java`

```java
package com.you.lld.problems.paymentgateway.model;
public
class BankAccount  {
    private String accountNumber, ifsc;
    public BankAccount(String acc, String i)  {
        accountNumber=acc;
        ifsc=i;
    }
    public String getAccountNumber()  {
        return accountNumber;
    }
}
```

### 📄 `model/Card.java`

```java
package com.you.lld.problems.paymentgateway.model;
public
class Card  {
    private String cardNumber, cvv, expiryDate;
    public Card(String num, String c, String exp)  {
        cardNumber=num;
        cvv=c;
        expiryDate=exp;
    }
    public String getCardNumber()  {
        return cardNumber;
    }
    public boolean isValid()  {
        return cardNumber!=null && cvv!=null;
    }
}
```

### 📄 `model/Customer.java`

```java
package com.you.lld.problems.paymentgateway.model;
public
class Customer  {
    private String customerId, name, email;
    public Customer(String id, String n, String e)  {
        customerId=id;
        name=n;
        email=e;
    }
    public String getCustomerId()  {
        return customerId;
    }
}
```

### 📄 `model/Merchant.java`

```java
package com.you.lld.problems.paymentgateway.model;
public
class Merchant  {
    private String merchantId, name, email;
    public Merchant(String id, String n, String e)  {
        merchantId=id;
        name=n;
        email=e;
    }
    public String getMerchantId()  {
        return merchantId;
    }
}
```

### 📄 `model/PaymentMethod.java`

```java
package com.you.lld.problems.paymentgateway.model;

public enum PaymentMethod {
    CARD,
    BANK_TRANSFER,
    UPI,
    WALLET
}
```

### 📄 `model/Refund.java`

```java
package com.you.lld.problems.paymentgateway.model;

import java.time.*;

public class Refund {
    private String refundId;
    private String transactionId;
    private double amount;
    private RefundStatus status;
    
    public Refund(String id, String tid, double amt) {
        this.refundId = id;
        this.transactionId = tid;
        this.amount = amt;
        this.status = RefundStatus.PENDING;
    }
    
    public String getRefundId() {
        return refundId;
    }
    
    public String getTransactionId() {
        return transactionId;
    }
    
    public double getAmount() {
        return amount;
    }
    
    public RefundStatus getStatus() {
        return status;
    }
    
    public void setStatus(RefundStatus status) {
        this.status = status;
    }
}
```

### 📄 `model/RefundStatus.java`

```java
package com.you.lld.problems.paymentgateway.model;
public enum RefundStatus { PENDING, PROCESSED, FAILED }```

### 📄 `model/Transaction.java`

```java
package com.you.lld.problems.paymentgateway.model;
import java.time.*;
public
class Transaction  {
    private String transactionId, merchantId, customerId;
    private double amount;
    private TransactionStatus status;
    private LocalDateTime createdAt;
    public Transaction(String id, String mid, String cid, double amt)  {
        transactionId=id;
        merchantId=mid;
        customerId=cid;
        amount=amt;
        status=TransactionStatus.PENDING;
        createdAt=LocalDateTime.now();
    }
    public String getTransactionId()  {
        return transactionId;
    }
    public double getAmount()  {
        return amount;
    }
    public TransactionStatus getStatus()  {
        return status;
    }
    public void setStatus(TransactionStatus s)  {
        status=s;
    }
}
```

### 📄 `model/TransactionStatus.java`

```java
package com.you.lld.problems.paymentgateway.model;
public enum TransactionStatus { PENDING, SUCCESS, FAILED, REFUNDED }```

