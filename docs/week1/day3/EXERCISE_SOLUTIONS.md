# Day 3 Exercise Solutions 🎯

---

## ✅ **Solution 1: ATM Machine Class Diagram**

```mermaid
classDiagram
    class ATM {
        -String atmId
        -String location
        -CashDispenser cashDispenser
        -CardReader cardReader
        -Screen screen
        -Keypad keypad
        +authenticateUser(Card, String pin): boolean
        +displayMenu(): void
        +processTransaction(Transaction): TransactionResult
    }

    class Card {
        -String cardNumber
        -String expiryDate
        -Bank issuingBank
        +getCardNumber(): String
        +isExpired(): boolean
    }

    class Account {
        -String accountNumber
        -AccountType type
        -Money balance
        -List~Transaction~ transactions
        +getBalance(): Money
        +debit(Money): boolean
        +credit(Money): boolean
        +getRecentTransactions(int): List~Transaction~
    }

    class Customer {
        -String customerId
        -String name
        -String pin
        -List~Account~ accounts
        -List~Card~ cards
        +validatePin(String): boolean
        +changePin(String, String): boolean
    }

    class Transaction {
        <<abstract>>
        -String transactionId
        -Instant timestamp
        -Money amount
        -TransactionStatus status
        +execute(): TransactionResult
    }

    class WithdrawalTransaction {
        -int dailyLimit
        +execute(): TransactionResult
        +checkDailyLimit(): boolean
    }

    class DepositTransaction {
        +execute(): TransactionResult
    }

    class BalanceInquiry {
        +execute(): TransactionResult
    }

    class TransferTransaction {
        -Account targetAccount
        +execute(): TransactionResult
    }

    class CashDispenser {
        -Map~Denomination, Integer~ cashInventory
        +dispenseCash(Money): List~Bill~
        +hasSufficientCash(Money): boolean
    }

    class Bank {
        -String bankId
        -String name
        +verifyAccount(String): Account
        +processTransaction(Transaction): TransactionResult
    }

    ATM --> CardReader
    ATM --> CashDispenser
    ATM --> Screen
    ATM --> Keypad
    Card --> Bank
    Customer --> Card
    Customer --> Account
    Account --> Transaction
    Transaction <|-- WithdrawalTransaction
    Transaction <|-- DepositTransaction
    Transaction <|-- BalanceInquiry
    Transaction <|-- TransferTransaction
    ATM ..> Transaction
    Bank --> Account
```

### **Key Design Decisions**
1. **Transaction as abstract class**: Allows different transaction types with common behavior
2. **CashDispenser separate**: Single Responsibility - manages physical cash
3. **Bank association**: Centralized account verification
4. **Daily limit in Withdrawal**: Business rule encapsulation

---

## ✅ **Solution 2: Library Management Sequence Diagram**

```mermaid
sequenceDiagram
    participant M as Member
    participant UI as LibraryUI
    participant CS as CatalogService
    participant BS as BorrowingService
    participant LR as LoanRepository
    participant BR as BookRepository
    participant NS as NotificationService

    M->>UI: searchBook(title)
    UI->>CS: findBooks(searchCriteria)
    CS->>BR: queryBooks(criteria)
    BR-->>CS: List<Book>
    CS-->>UI: SearchResults
    UI-->>M: Display available books

    M->>UI: requestBorrow(bookId)
    UI->>BS: createLoan(memberId, bookId)
    
    BS->>BS: checkMemberEligibility()
    
    alt Member has overdue books
        BS-->>UI: Error: Overdue books exist
        UI-->>M: Cannot borrow - return overdue books
    else Member eligible
        BS->>BR: checkAvailability(bookId)
        
        alt Book not available
            BR-->>BS: NotAvailable
            BS-->>UI: Error: Book not available
            UI-->>M: Book currently unavailable
        else Book available
            BR-->>BS: Available
            BS->>LR: createLoan(loan)
            LR-->>BS: Loan created
            BS->>BR: updateStatus(bookId, BORROWED)
            BR-->>BS: Status updated
            BS->>NS: sendConfirmation(member, loan)
            NS-->>M: Email confirmation
            BS-->>UI: LoanDetails
            UI-->>M: Loan confirmed, due date shown
        end
    end
```

### **Key Points**
- **Alt fragments**: Handle both success and failure cases
- **Service separation**: Catalog vs Borrowing responsibilities
- **Notification**: Async confirmation to member

---

## ✅ **Solution 3: Traffic Light State Diagram**

```mermaid
stateDiagram-v2
    [*] --> Red
    
    state NormalOperation {
        Red --> Green: timer(50s)
        Green --> Yellow: timer(45s)
        Yellow --> Red: timer(5s)
        
        Red: entry / turnOnRed()
        Red: exit / turnOffRed()
        
        Green: entry / turnOnGreen()
        Green: exit / turnOffGreen()
        
        Yellow: entry / turnOnYellow()
        Yellow: exit / turnOffYellow()
    }
    
    state EmergencyMode {
        [*] --> FlashingYellow
        FlashingYellow --> FlashingYellow: timer(500ms) / toggle
    }
    
    state MalfunctionMode {
        [*] --> FlashingRed
        FlashingRed --> FlashingRed: timer(500ms) / toggle
    }
    
    NormalOperation --> EmergencyMode: emergencyVehicleDetected
    EmergencyMode --> NormalOperation: emergencyClear / resetToRed
    
    NormalOperation --> MalfunctionMode: sensorFailure
    MalfunctionMode --> NormalOperation: systemReset / diagnostic
    
    EmergencyMode --> MalfunctionMode: sensorFailure
```

### **State Actions**
- **Entry actions**: Turn on appropriate light
- **Exit actions**: Turn off light before transition
- **Timer events**: Trigger state transitions

---

## ✅ **Solution 4: E-commerce Order Flow**

### **Part A: Class Diagram**

```mermaid
classDiagram
    class Customer {
        -String customerId
        -String name
        -Email email
        -List~Address~ addresses
        -Cart cart
        +addToCart(Product, int): void
        +checkout(): Order
    }

    class Product {
        -String productId
        -String name
        -Money price
        -int stockQuantity
        -Category category
        +isInStock(): boolean
        +reserve(int): boolean
    }

    class Cart {
        -String cartId
        -List~CartItem~ items
        -Instant createdAt
        +addItem(Product, int): void
        +removeItem(String): void
        +getTotal(): Money
        +clear(): void
    }

    class CartItem {
        -Product product
        -int quantity
        +getSubtotal(): Money
    }

    class Order {
        -String orderId
        -Customer customer
        -List~OrderItem~ items
        -Money subtotal
        -Money tax
        -Money total
        -OrderStatus status
        -Address shippingAddress
        -Payment payment
        +calculateTotal(): Money
        +cancel(): boolean
    }

    class OrderItem {
        -Product product
        -int quantity
        -Money priceAtPurchase
        +getSubtotal(): Money
    }

    class Payment {
        -String paymentId
        -Money amount
        -PaymentMethod method
        -PaymentStatus status
        -Instant processedAt
        +process(): PaymentResult
        +refund(): RefundResult
    }

    class Address {
        -String street
        -String city
        -String state
        -String zipCode
        -String country
        +format(): String
    }

    class Shipping {
        -String trackingNumber
        -ShippingMethod method
        -Address origin
        -Address destination
        -ShippingStatus status
        -Instant estimatedDelivery
        +track(): ShippingUpdate
    }

    Customer --> Cart
    Customer --> Address
    Customer --> Order
    Cart --> CartItem
    CartItem --> Product
    Order --> OrderItem
    Order --> Payment
    Order --> Shipping
    Order --> Address
    OrderItem --> Product
    Shipping --> Address
```

### **Part B: Sequence Diagram**

```mermaid
sequenceDiagram
    participant C as Customer
    participant UI as WebUI
    participant CS as CartService
    participant OS as OrderService
    participant IS as InventoryService
    participant PS as PaymentService
    participant SS as ShippingService
    participant NS as NotificationService

    C->>UI: addToCart(productId, qty)
    UI->>CS: addItem(cartId, productId, qty)
    CS->>IS: checkStock(productId)
    IS-->>CS: StockInfo
    CS-->>UI: CartUpdated
    UI-->>C: Show updated cart

    C->>UI: checkout()
    UI->>OS: createOrder(cartId, shippingAddr)
    
    OS->>IS: reserveItems(items)
    
    alt Inventory insufficient
        IS-->>OS: ReservationFailed
        OS-->>UI: Error
        UI-->>C: Some items unavailable
    else Inventory reserved
        IS-->>OS: ReservationConfirmed
        
        OS->>PS: processPayment(paymentDetails)
        
        alt Payment failed
            PS-->>OS: PaymentFailed
            OS->>IS: releaseReservation(items)
            OS-->>UI: PaymentError
            UI-->>C: Payment failed
        else Payment successful
            PS-->>OS: PaymentConfirmed
            
            OS->>OS: createOrder()
            OS->>IS: commitReservation(items)
            OS->>SS: createShipment(order)
            SS-->>OS: ShipmentCreated
            
            OS->>NS: sendOrderConfirmation(order)
            NS-->>C: Email confirmation
            
            OS-->>UI: OrderConfirmed
            UI-->>C: Order success page
        end
    end
```

### **Part C: State Diagram**

```mermaid
stateDiagram-v2
    [*] --> Created
    
    Created --> PaymentPending: submitOrder
    Created --> Cancelled: customerCancel
    
    PaymentPending --> PaymentFailed: paymentDeclined
    PaymentPending --> Confirmed: paymentSuccess
    
    PaymentFailed --> PaymentPending: retryPayment
    PaymentFailed --> Cancelled: timeout(24h)
    
    Confirmed --> Processing: startProcessing
    Confirmed --> Cancelled: customerCancel / initiateRefund
    
    Processing --> Shipped: handedToCarrier
    Processing --> Cancelled: itemsUnavailable / initiateRefund
    
    Shipped --> OutForDelivery: nearDestination
    Shipped --> Returned: deliveryFailed(3attempts)
    
    OutForDelivery --> Delivered: customerReceived
    OutForDelivery --> Returned: deliveryRejected
    
    Delivered --> [*]
    Cancelled --> [*]
    Returned --> Refunded: refundProcessed
    Refunded --> [*]
    
    note right of Confirmed
        Inventory committed
        Payment captured
    end note
    
    note right of Shipped
        Tracking available
        No cancellation
    end note
```

---

## ✅ **Solution 5: Hotel Booking System**

### **Class Diagram**

```mermaid
classDiagram
    class Hotel {
        -String hotelId
        -String name
        -Address address
        -int starRating
        -List~Room~ rooms
        -List~Amenity~ amenities
        +getAvailableRooms(DateRange, RoomType): List~Room~
        +calculatePrice(Room, DateRange): Money
    }

    class Room {
        -String roomNumber
        -RoomType type
        -RoomStatus status
        -int floor
        -Money basePrice
        -List~Amenity~ amenities
        +isAvailable(DateRange): boolean
        +book(Reservation): boolean
    }

    class RoomType {
        <<enumeration>>
        SINGLE
        DOUBLE
        SUITE
        PRESIDENTIAL
    }

    class Amenity {
        -String name
        -String description
        -Money additionalCost
    }

    class Guest {
        -String guestId
        -String name
        -Email email
        -Phone phone
        -LoyaltyTier loyaltyTier
        -int loyaltyPoints
        +addPoints(int): void
        +redeemPoints(int): Money
    }

    class Reservation {
        -String reservationId
        -Guest guest
        -Room room
        -DateRange dates
        -ReservationStatus status
        -Money totalAmount
        -Money deposit
        -CancellationPolicy policy
        +confirm(): void
        +cancel(): CancellationResult
        +modifyDates(DateRange): boolean
    }

    class Payment {
        -String paymentId
        -Reservation reservation
        -Money amount
        -PaymentMethod method
        -PaymentStatus status
        +process(): PaymentResult
        +refund(Money): RefundResult
    }

    class CancellationPolicy {
        -int freeCancellationDays
        -Map~Integer, BigDecimal~ penalties
        +calculatePenalty(Reservation): Money
    }

    class Invoice {
        -String invoiceNumber
        -Reservation reservation
        -List~LineItem~ items
        -Money subtotal
        -Money tax
        -Money total
        +generate(): void
        +addService(Service, Money): void
    }

    class Service {
        -String serviceId
        -String name
        -Money price
        -ServiceCategory category
    }

    Hotel --> Room
    Hotel --> Amenity
    Room --> RoomType
    Room --> Amenity
    Guest --> Reservation
    Reservation --> Room
    Reservation --> Payment
    Reservation --> CancellationPolicy
    Reservation --> Invoice
    Invoice --> Service
```

### **Sequence Diagram: Booking Flow**

```mermaid
sequenceDiagram
    participant G as Guest
    participant UI as BookingUI
    participant RS as ReservationService
    participant AS as AvailabilityService
    participant PS as PricingService
    participant PAY as PaymentService
    participant NS as NotificationService

    G->>UI: searchRooms(hotel, dates, roomType)
    UI->>AS: getAvailability(criteria)
    AS-->>UI: List<AvailableRoom>
    UI-->>G: Display rooms with prices

    G->>UI: selectRoom(roomId)
    UI->>PS: calculateTotal(room, dates, guest)
    PS->>PS: applySeasonalPricing()
    PS->>PS: applyLoyaltyDiscount()
    PS-->>UI: PriceBreakdown
    UI-->>G: Show total with breakdown

    G->>UI: confirmBooking(guestDetails, paymentInfo)
    UI->>RS: createReservation(details)
    
    RS->>AS: lockRoom(roomId, dates)
    
    alt Room no longer available
        AS-->>RS: LockFailed
        RS-->>UI: RoomUnavailable
        UI-->>G: Sorry, room was just booked
    else Room locked
        AS-->>RS: LockSuccess
        
        RS->>PAY: chargeDeposit(paymentInfo)
        
        alt Payment failed
            PAY-->>RS: PaymentFailed
            RS->>AS: releaseLock(roomId)
            RS-->>UI: PaymentError
            UI-->>G: Payment failed, try again
        else Payment success
            PAY-->>RS: PaymentSuccess
            
            RS->>RS: createReservation()
            RS->>AS: confirmBooking(roomId, dates)
            
            RS->>NS: sendConfirmation(reservation)
            NS-->>G: Email with confirmation
            
            RS-->>UI: ReservationConfirmed
            UI-->>G: Booking confirmed page
        end
    end
```

### **State Diagram: Reservation Lifecycle**

```mermaid
stateDiagram-v2
    [*] --> Pending
    
    Pending --> Confirmed: depositPaid
    Pending --> Expired: timeout(30min)
    
    Confirmed --> CheckedIn: guestArrival
    Confirmed --> CancelledWithRefund: cancel(beforePolicy)
    Confirmed --> CancelledWithPenalty: cancel(withinPolicy)
    Confirmed --> NoShow: checkInDatePassed
    
    CheckedIn --> InProgress: roomAssigned
    
    InProgress --> CheckedOut: guestDeparts
    InProgress --> Extended: extendStay / chargeAdditional
    
    Extended --> CheckedOut: guestDeparts
    
    CheckedOut --> Invoiced: finalBillGenerated
    Invoiced --> Completed: paymentSettled
    
    CancelledWithRefund --> [*]
    CancelledWithPenalty --> [*]
    NoShow --> [*]
    Completed --> [*]
    Expired --> [*]
    
    note right of Confirmed
        Deposit held
        Room reserved
    end note
    
    note right of NoShow
        Deposit forfeited
        Room released
    end note
```

---

## 📝 **Key Takeaways**

1. **Class Diagrams**: Focus on responsibilities and relationships, not just attributes
2. **Sequence Diagrams**: Show happy path and error cases with alt/opt fragments
3. **State Diagrams**: Include entry/exit actions and guard conditions
4. **Consistency**: Use same naming conventions across all diagram types
