# Parking Lot System - Mermaid Diagrams

## 1. Class Diagram - Complete System

```mermaid
classDiagram
    %% Core Service Interface
    class ParkingService {
        <<interface>>
        +enterVehicle(Vehicle) ParkingTicket
        +exitVehicle(String, PaymentMethod) Payment
        +calculateParkingFee(String) Money
        +checkAvailability(VehicleType) boolean
        +getOccupancyReport() OccupancyReport
    }
    
    %% Strategy Interfaces
    class PricingStrategy {
        <<interface>>
        +calculateFee(ParkingTicket) Money
        +getDescription() String
    }
    
    class SpaceAllocationStrategy {
        <<interface>>
        +selectSpace(List~ParkingSpace~, VehicleType) Optional~ParkingSpace~
        +getDescription() String
    }
    
    class PaymentProcessor {
        <<interface>>
        +processPayment(Payment) boolean
        +refundPayment(Payment) boolean
        +supportsPaymentMethod(PaymentMethod) boolean
        +getTransactionFee(Money, PaymentMethod) Money
    }
    
    %% Core Implementation
    class InMemoryParkingService {
        -Map~String, ParkingSpace~ allSpaces
        -Map~String, ParkingTicket~ activeTickets
        -Map~String, ParkingTicket~ completedTickets
        -PricingStrategy pricingStrategy
        -SpaceAllocationStrategy allocationStrategy
        -PaymentProcessor paymentProcessor
        -AtomicLong ticketCounter
        -AtomicLong paymentCounter
        +enterVehicle(Vehicle) ParkingTicket
        +exitVehicle(String, PaymentMethod) Payment
        +calculateParkingFee(String) Money
        +checkAvailability(VehicleType) boolean
        +getOccupancyReport() OccupancyReport
        +addParkingSpace(ParkingSpace) void
        +removeParkingSpace(String) void
        -generateTicketId() String
        -generatePaymentId() String
    }
    
    %% Strategy Implementations
    class HourlyPricingStrategy {
        -Map~VehicleType, Money~ hourlyRates
        -Money minimumCharge
        -Duration gracePeriod
        -Currency currency
        +calculateFee(ParkingTicket) Money
        +getDescription() String
        +getHourlyRate(VehicleType) Money
        +getMinimumCharge() Money
        +getGracePeriod() Duration
    }
    
    class NearestSpaceAllocationStrategy {
        -Map~VehicleType, List~SpaceType~~ SPACE_PRIORITY
        +selectSpace(List~ParkingSpace~, VehicleType) Optional~ParkingSpace~
        +getDescription() String
        -findNearestSpaceOfType(List~ParkingSpace~, SpaceType) Optional~ParkingSpace~
    }
    
    class SimplePaymentProcessor {
        -Set~PaymentMethod~ supportedMethods
        -Map~PaymentMethod, BigDecimal~ transactionFeeRates
        -Map~String, Payment~ processedPayments
        +processPayment(Payment) boolean
        +refundPayment(Payment) boolean
        +supportsPaymentMethod(PaymentMethod) boolean
        +getTransactionFee(Money, PaymentMethod) Money
    }
    
    %% Model Classes
    class Vehicle {
        -String licenseNumber
        -VehicleType vehicleType
        -boolean hasDisabledPermit
        +getLicenseNumber() String
        +getVehicleType() VehicleType
        +hasDisabledPermit() boolean
    }
    
    class ParkingSpace {
        -String spaceId
        -SpaceType spaceType
        -int floorNumber
        -boolean isOccupied
        -Vehicle currentVehicle
        +occupy(Vehicle) boolean
        +vacate() Vehicle
        +canFit(VehicleType) boolean
        +canFit(Vehicle) boolean
        +isAvailable() boolean
    }
    
    class ParkingTicket {
        -String ticketId
        -Vehicle vehicle
        -ParkingSpace parkingSpace
        -LocalDateTime entryTime
        -LocalDateTime exitTime
        -boolean isActive
        +markExit(LocalDateTime) void
        +calculateDuration() Duration
        +isValid() boolean
    }
    
    class Payment {
        -String paymentId
        -ParkingTicket ticket
        -Money amount
        -PaymentMethod paymentMethod
        -PaymentStatus status
        -LocalDateTime timestamp
        -String transactionReference
        +markCompleted(String) void
        +markFailed() void
        +markRefunded(String) void
        +isSuccessful() boolean
    }
    
    class OccupancyReport {
        -LocalDateTime timestamp
        -int totalSpaces
        -int occupiedSpaces
        -Map~SpaceType, Integer~ availableByType
        -Map~SpaceType, Integer~ occupiedByType
        +getAvailableSpaces() int
        +getOccupancyRate() double
        +getAvailableSpaces(SpaceType) int
    }
    
    class Money {
        <<Value Object>>
        -long minor
        -Currency currency
        +ofMinor(long, Currency) Money
        +of(BigDecimal, Currency) Money
        +plus(Money) Money
        +minus(Money) Money
        +times(long) Money
        +percent(int) Money
        +toBigDecimal() BigDecimal
        +isNegative() boolean
        +isZero() boolean
        +isPositive() boolean
    }
    
    %% Enums
    class VehicleType {
        <<enumeration>>
        MOTORCYCLE
        CAR
        TRUCK
        BUS
        +getSizeCategory() int
    }
    
    class SpaceType {
        <<enumeration>>
        MOTORCYCLE
        COMPACT
        LARGE
        DISABLED
        +getCapacity() int
        +canAccommodate(VehicleType) boolean
        +getDescription() String
    }
    
    class PaymentMethod {
        <<enumeration>>
        CASH
        CREDIT_CARD
        DEBIT_CARD
        MOBILE_PAYMENT
        +getDisplayName() String
    }
    
    class PaymentStatus {
        <<enumeration>>
        PENDING
        COMPLETED
        FAILED
        REFUNDED
        CANCELLED
        +getDescription() String
        +isTerminal() boolean
    }
    
    %% Exceptions
    class ParkingException {
        <<exception>>
        -String errorCode
        -String message
    }
    
    class ParkingFullException {
        <<exception>>
    }
    
    class InvalidTicketException {
        <<exception>>
    }
    
    class InvalidVehicleException {
        <<exception>>
    }
    
    class PaymentFailedException {
        <<exception>>
    }
    
    %% Relationships - Implementation
    ParkingService <|.. InMemoryParkingService : implements
    PricingStrategy <|.. HourlyPricingStrategy : implements
    SpaceAllocationStrategy <|.. NearestSpaceAllocationStrategy : implements
    PaymentProcessor <|.. SimplePaymentProcessor : implements
    
    %% Relationships - Composition
    InMemoryParkingService o-- PricingStrategy : uses
    InMemoryParkingService o-- SpaceAllocationStrategy : uses
    InMemoryParkingService o-- PaymentProcessor : uses
    InMemoryParkingService *-- ParkingSpace : manages
    InMemoryParkingService *-- ParkingTicket : tracks
    
    %% Relationships - Associations
    ParkingTicket --> Vehicle : has
    ParkingTicket --> ParkingSpace : assigned to
    Payment --> ParkingTicket : for
    Payment --> PaymentMethod : uses
    Payment --> PaymentStatus : has
    Payment --> Money : amount
    Vehicle --> VehicleType : has
    ParkingSpace --> SpaceType : has
    ParkingSpace --> Vehicle : currently parks
    OccupancyReport --> SpaceType : tracks by type
    
    %% Relationships - Strategy Dependencies
    HourlyPricingStrategy ..> ParkingTicket : uses
    HourlyPricingStrategy ..> Money : calculates
    NearestSpaceAllocationStrategy ..> ParkingSpace : selects
    NearestSpaceAllocationStrategy ..> VehicleType : based on
    SimplePaymentProcessor ..> Payment : processes
    
    %% Exception Hierarchy
    ParkingException <|-- ParkingFullException
    ParkingException <|-- InvalidTicketException
    ParkingException <|-- InvalidVehicleException
    ParkingException <|-- PaymentFailedException
```

## 2. Sequence Diagram - Vehicle Entry Flow

```mermaid
sequenceDiagram
    actor Customer
    participant Service as InMemoryParkingService
    participant Allocation as SpaceAllocationStrategy
    participant Space as ParkingSpace
    participant Ticket as ParkingTicket
    
    Customer->>Service: enterVehicle(vehicle)
    
    activate Service
    Service->>Service: Validate vehicle
    
    alt Vehicle already parked
        Service-->>Customer: throw InvalidVehicleException
    end
    
    Service->>Service: Find available spaces
    
    alt No available spaces
        Service-->>Customer: throw ParkingFullException
    end
    
    Service->>Allocation: selectSpace(availableSpaces, vehicleType)
    activate Allocation
    Allocation->>Allocation: Apply priority logic
    Allocation->>Allocation: Find nearest space
    Allocation-->>Service: Optional<ParkingSpace>
    deactivate Allocation
    
    alt No suitable space found
        Service-->>Customer: throw ParkingFullException
    end
    
    Service->>Space: occupy(vehicle)
    activate Space
    Space->>Space: Check if available
    Space->>Space: Mark as occupied
    Space-->>Service: true
    deactivate Space
    
    Service->>Service: Generate ticket ID
    Service->>Ticket: new ParkingTicket(id, vehicle, space, entryTime)
    activate Ticket
    Ticket-->>Service: ticket
    deactivate Ticket
    
    Service->>Service: Store in activeTickets
    Service-->>Customer: ParkingTicket
    deactivate Service
```

## 3. Sequence Diagram - Vehicle Exit & Payment Flow

```mermaid
sequenceDiagram
    actor Customer
    participant Service as InMemoryParkingService
    participant Pricing as PricingStrategy
    participant Processor as PaymentProcessor
    participant Payment as Payment
    participant Space as ParkingSpace
    
    Customer->>Service: exitVehicle(ticketId, paymentMethod)
    
    activate Service
    Service->>Service: Validate ticket ID
    
    alt Invalid ticket
        Service-->>Customer: throw InvalidTicketException
    end
    
    Service->>Service: Retrieve active ticket
    Service->>Pricing: calculateFee(ticket)
    
    activate Pricing
    Pricing->>Pricing: Calculate duration
    Pricing->>Pricing: Apply grace period
    Pricing->>Pricing: Calculate hourly rate
    Pricing->>Pricing: Apply minimum charge
    Pricing-->>Service: Money (fee)
    deactivate Pricing
    
    Service->>Payment: new Payment(id, ticket, fee, method)
    activate Payment
    Payment-->>Service: payment
    deactivate Payment
    
    Service->>Processor: processPayment(payment)
    activate Processor
    Processor->>Processor: Validate payment method
    Processor->>Processor: Simulate gateway call
    
    alt Payment fails
        Processor-->>Service: false
        Service->>Payment: markFailed()
        Service-->>Customer: throw PaymentFailedException
    end
    
    Processor-->>Service: true
    deactivate Processor
    
    Service->>Payment: markCompleted(txnRef)
    Service->>Service: Mark ticket as exited
    
    Service->>Space: vacate()
    activate Space
    Space->>Space: Clear current vehicle
    Space->>Space: Mark as available
    Space-->>Service: vehicle
    deactivate Space
    
    Service->>Service: Move ticket to completed
    Service-->>Customer: Payment
    deactivate Service
```

## 4. Component Diagram - System Architecture

```mermaid
graph TB
    subgraph Client["Client Layer"]
        Demo[ParkingLotDemo]
        API[External API Clients]
    end
    
    subgraph Service["Service Layer"]
        PS[InMemoryParkingService]
    end
    
    subgraph Strategies["Strategy Layer"]
        Price[HourlyPricingStrategy]
        Alloc[NearestSpaceAllocationStrategy]
        Pay[SimplePaymentProcessor]
    end
    
    subgraph Model["Domain Model"]
        Vehicle[Vehicle]
        Space[ParkingSpace]
        Ticket[ParkingTicket]
        Payment[Payment]
        Report[OccupancyReport]
        Money[Money]
    end
    
    subgraph Enums["Enumerations"]
        VT[VehicleType]
        ST[SpaceType]
        PM[PaymentMethod]
        PSt[PaymentStatus]
    end
    
    subgraph Exceptions["Exception Layer"]
        PEx[ParkingException]
        PFEx[ParkingFullException]
        ITEx[InvalidTicketException]
        IVEx[InvalidVehicleException]
        PayEx[PaymentFailedException]
    end
    
    Demo --> PS
    API --> PS
    
    PS --> Price
    PS --> Alloc
    PS --> Pay
    
    PS --> Vehicle
    PS --> Space
    PS --> Ticket
    PS --> Payment
    PS --> Report
    
    Price --> Ticket
    Price --> Money
    Alloc --> Space
    Pay --> Payment
    
    Vehicle --> VT
    Space --> ST
    Payment --> PM
    Payment --> PSt
    
    PS -.throws.-> PFEx
    PS -.throws.-> ITEx
    PS -.throws.-> IVEx
    PS -.throws.-> PayEx
    
    style Client fill:#e1f5ff
    style Service fill:#b3e5fc
    style Strategies fill:#81d4fa
    style Model fill:#4fc3f7
    style Enums fill:#29b6f6
    style Exceptions fill:#ff8a80
```

## 5. State Diagram - Parking Ticket Lifecycle

```mermaid
stateDiagram-v2
    [*] --> Created: Vehicle enters
    
    Created --> Active: Ticket generated
    
    Active --> Active: Calculate fee\n(can be called multiple times)
    
    Active --> Exiting: exitVehicle() called
    
    Exiting --> PaymentPending: Fee calculated
    
    PaymentPending --> PaymentFailed: Payment fails
    PaymentPending --> PaymentCompleted: Payment succeeds
    
    PaymentFailed --> [*]: Transaction aborted
    
    PaymentCompleted --> Completed: Space vacated
    
    Completed --> [*]: Ticket archived
    
    note right of Active
        Ticket is valid
        isActive = true
        exitTime = null
    end note
    
    note right of Completed
        Ticket is inactive
        isActive = false
        exitTime set
    end note
```

## 6. State Diagram - Payment Lifecycle

```mermaid
stateDiagram-v2
    [*] --> Created: Payment object created
    
    Created --> Pending: Initial state
    
    Pending --> Processing: processPayment() called
    
    Processing --> Completed: Gateway success
    Processing --> Failed: Gateway failure
    
    Completed --> Refunded: refundPayment() called
    
    Failed --> [*]: Terminal state
    Refunded --> [*]: Terminal state
    Completed --> [*]: Terminal state (no refund)
    
    note right of Pending
        Non-terminal
        Can transition
    end note
    
    note right of Completed
        Terminal state
        status.isTerminal() = true
    end note
    
    note right of Failed
        Terminal state
        status.isTerminal() = true
    end note
```

## 7. Activity Diagram - Complete Parking Flow

```mermaid
flowchart TD
    Start([Customer arrives]) --> CheckAvail{Check\navailability?}
    
    CheckAvail -->|Optional| CallCheck[checkAvailability]
    CallCheck --> ShowAvail[Show available spaces]
    ShowAvail --> Enter
    
    CheckAvail -->|Direct| Enter[Enter vehicle]
    
    Enter --> Validate{Valid\nvehicle?}
    Validate -->|No| ErrVehicle[Throw InvalidVehicleException]
    ErrVehicle --> End1([End])
    
    Validate -->|Yes| FindSpaces[Find available spaces]
    
    FindSpaces --> HasSpaces{Spaces\navailable?}
    HasSpaces -->|No| ErrFull[Throw ParkingFullException]
    ErrFull --> End2([End])
    
    HasSpaces -->|Yes| SelectSpace[Use allocation strategy]
    SelectSpace --> OccupySpace[Occupy selected space]
    
    OccupySpace --> GenTicket[Generate parking ticket]
    GenTicket --> SaveTicket[Save to active tickets]
    SaveTicket --> ReturnTicket[Return ticket to customer]
    
    ReturnTicket --> Park[Vehicle parked]
    Park --> Wait[Time passes...]
    
    Wait --> ExitRequest[Customer requests exit]
    ExitRequest --> ValidateTicket{Valid\nticket?}
    
    ValidateTicket -->|No| ErrTicket[Throw InvalidTicketException]
    ErrTicket --> End3([End])
    
    ValidateTicket -->|Yes| CalcFee[Calculate parking fee]
    CalcFee --> ApplyGrace{Within grace\nperiod?}
    
    ApplyGrace -->|Yes| ZeroFee[Fee = $0]
    ApplyGrace -->|No| CalcHourly[Calculate hourly fee]
    
    CalcHourly --> ApplyMin{Fee < min\ncharge?}
    ApplyMin -->|Yes| MinFee[Fee = minimum charge]
    ApplyMin -->|No| UseFee[Use calculated fee]
    
    ZeroFee --> CreatePayment
    MinFee --> CreatePayment
    UseFee --> CreatePayment[Create payment object]
    
    CreatePayment --> ProcessPay[Process payment]
    ProcessPay --> PaySuccess{Payment\nsuccess?}
    
    PaySuccess -->|No| MarkFailed[Mark payment failed]
    MarkFailed --> ErrPay[Throw PaymentFailedException]
    ErrPay --> End4([End])
    
    PaySuccess -->|Yes| MarkComplete[Mark payment completed]
    MarkComplete --> MarkExit[Mark ticket exited]
    MarkExit --> VacateSpace[Vacate parking space]
    VacateSpace --> MoveTicket[Move to completed tickets]
    MoveTicket --> Receipt[Return payment receipt]
    
    Receipt --> End5([End - Vehicle exits])
    
    style Start fill:#4caf50
    style End1 fill:#f44336
    style End2 fill:#f44336
    style End3 fill:#f44336
    style End4 fill:#f44336
    style End5 fill:#4caf50
    style ErrVehicle fill:#ff5252
    style ErrFull fill:#ff5252
    style ErrTicket fill:#ff5252
    style ErrPay fill:#ff5252
```

## 8. Deployment Diagram - Deployment View

```mermaid
graph TB
    subgraph Cloud["Cloud Infrastructure"]
        subgraph LB["Load Balancer"]
            LoadBalancer[Load Balancer]
        end
        
        subgraph AppServers["Application Servers"]
            App1[App Server 1<br/>InMemoryParkingService]
            App2[App Server 2<br/>InMemoryParkingService]
            App3[App Server 3<br/>InMemoryParkingService]
        end
        
        subgraph DataLayer["Data Layer"]
            Redis[(Redis Cache<br/>Active Tickets)]
            DB[(PostgreSQL<br/>Persistent Storage)]
        end
        
        subgraph External["External Services"]
            PayGW[Payment Gateway<br/>Stripe/PayPal]
            Monitor[Monitoring<br/>Prometheus/Grafana]
        end
    end
    
    subgraph Clients["Clients"]
        Web[Web Application]
        Mobile[Mobile App]
        Kiosk[Parking Kiosk]
    end
    
    Web --> LoadBalancer
    Mobile --> LoadBalancer
    Kiosk --> LoadBalancer
    
    LoadBalancer --> App1
    LoadBalancer --> App2
    LoadBalancer --> App3
    
    App1 --> Redis
    App2 --> Redis
    App3 --> Redis
    
    App1 --> DB
    App2 --> DB
    App3 --> DB
    
    App1 --> PayGW
    App2 --> PayGW
    App3 --> PayGW
    
    App1 --> Monitor
    App2 --> Monitor
    App3 --> Monitor
    
    style Cloud fill:#e3f2fd
    style AppServers fill:#bbdefb
    style DataLayer fill:#90caf9
    style External fill:#64b5f6
    style Clients fill:#42a5f5
```

## 9. Package Diagram - Code Organization

```mermaid
graph TB
    subgraph parkinglot["com.you.lld.problems.parkinglot"]
        subgraph api["api"]
            ParkingService
            PricingStrategy
            SpaceAllocationStrategy
            PaymentProcessor
            
            subgraph exceptions["exceptions"]
                ParkingException
                ParkingFullException
                InvalidTicketException
                InvalidVehicleException
                PaymentFailedException
            end
        end
        
        subgraph model["model"]
            Vehicle
            VehicleType
            ParkingSpace
            SpaceType
            ParkingTicket
            Payment
            PaymentMethod
            PaymentStatus
            OccupancyReport
        end
        
        subgraph impl["impl"]
            InMemoryParkingService
            HourlyPricingStrategy
            NearestSpaceAllocationStrategy
            SimplePaymentProcessor
            ParkingLotDemo
        end
    end
    
    subgraph common["com.you.lld.common"]
        Money
    end
    
    impl --> api
    impl --> model
    impl --> exceptions
    impl --> common
    
    api --> model
    api --> exceptions
    api --> common
    
    model --> common
    
    style api fill:#fff3e0
    style model fill:#ffe0b2
    style impl fill:#ffcc80
    style exceptions fill:#ffab91
    style common fill:#a5d6a7
```

## 10. Use Case Diagram - System Actors & Operations

```mermaid
graph LR
    subgraph Actors
        Customer[👤 Customer]
        Attendant[👤 Parking Attendant]
        Admin[👤 Administrator]
        System[⚙️ System]
    end
    
    subgraph UseCases["Use Cases"]
        UC1[Enter Parking Lot]
        UC2[Exit Parking Lot]
        UC3[Calculate Fee]
        UC4[Process Payment]
        UC5[Check Availability]
        UC6[View Occupancy]
        UC7[Add Parking Space]
        UC8[Remove Parking Space]
        UC9[Configure Pricing]
        UC10[Process Refund]
        UC11[Generate Reports]
    end
    
    Customer --> UC1
    Customer --> UC2
    Customer --> UC3
    Customer --> UC5
    
    Attendant --> UC1
    Attendant --> UC2
    Attendant --> UC4
    Attendant --> UC6
    Attendant --> UC10
    
    Admin --> UC7
    Admin --> UC8
    Admin --> UC9
    Admin --> UC11
    Admin --> UC6
    
    System -.-> UC3
    System -.-> UC6
    
    UC2 -.includes.-> UC3
    UC2 -.includes.-> UC4
    
    style Customer fill:#4caf50
    style Attendant fill:#2196f3
    style Admin fill:#ff9800
    style System fill:#9e9e9e
```

## Usage Notes

### Viewing Diagrams
These Mermaid diagrams can be viewed in:
- GitHub (native support)
- GitLab (native support)
- VS Code with Mermaid extension
- Online editors: https://mermaid.live/

### Diagram Types Included
1. **Class Diagram** - Complete system structure with all classes and relationships
2. **Sequence Diagrams** - Vehicle entry and exit flows
3. **Component Diagram** - High-level architecture
4. **State Diagrams** - Ticket and payment lifecycles
5. **Activity Diagram** - Complete parking flow
6. **Deployment Diagram** - Production deployment architecture
7. **Package Diagram** - Code organization
8. **Use Case Diagram** - User interactions

### Key Insights from Diagrams

**From Class Diagram:**
- Strategy pattern clearly visible with 3 strategy interfaces
- Clean separation between interfaces (api) and implementations (impl)
- Rich domain model with value objects (Money)
- Proper exception hierarchy

**From Sequence Diagrams:**
- Clear validation at each step
- Proper error handling with exceptions
- Strategy pattern in action (delegation to strategies)
- Thread-safe space occupation

**From State Diagrams:**
- Ticket lifecycle: Created → Active → Exiting → Completed
- Payment lifecycle: Pending → Processing → Completed/Failed/Refunded
- Clear terminal states

**From Activity Diagram:**
- Grace period logic clearly shown
- Minimum charge application
- Multiple error paths properly handled
- End-to-end flow visibility

### Customization
To modify diagrams:
1. Copy the Mermaid code
2. Paste into https://mermaid.live/
3. Edit and preview in real-time
4. Copy back updated code

### Export Options
From mermaid.live you can export as:
- PNG
- SVG
- PDF
- Markdown
