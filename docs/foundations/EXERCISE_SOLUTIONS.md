# Day 1 Exercise Solutions - Professional LLD Requirements

## 🎯 **Exercise 1 Solution: Enterprise ATM System**

### **Use Case 1: Withdraw Cash**

**Title:** Withdraw Cash  
**Actor(s):** Bank Customer, ATM System, Core Banking System, Cash Dispenser, Security System  
**Preconditions:** 
- ATM is operational and has sufficient cash
- Customer has valid debit/credit card
- Customer account is active and not frozen
- Network connectivity to core banking system available

**Trigger:** Customer inserts card and selects "Withdraw Cash"

**Main Flow:**
1. Read and validate card (chip/magnetic stripe)
2. Prompt for PIN entry with 3-attempt limit
3. Authenticate PIN with core banking system
4. Display account selection if multiple accounts
5. Display withdrawal amount options (₹100, ₹500, ₹1000, ₹2000, Other)
6. Validate withdrawal amount against daily limit and account balance
7. Reserve funds in customer account (temporary hold)
8. Count and dispense cash from appropriate cassettes
9. Print transaction receipt with balance
10. Release card to customer
11. Log transaction in audit trail

**Alternate/Error Flows:**
- If invalid PIN (3 attempts) → capture card, send alert to bank
- If insufficient balance → display error, offer balance inquiry
- If daily limit exceeded → display error with limit information
- If cash dispenser jam → retain card, alert maintenance, refund transaction
- If network timeout → retry 3 times, then abort with receipt
- If power failure during transaction → complete on restart, ensure no double dispensing

**Postconditions:**
- Cash dispensed to customer OR transaction failed with clear reason
- Account debited (successful) OR hold released (failed)
- Transaction logged with timestamp, location, amount
- ATM cash inventory updated

**Operation(s):**
```java
withdrawCash(cardNumber, pin, accountType, amount) -> 
  WithdrawalReceipt | 
  InsufficientFundsException | 
  DailyLimitExceededException |
  InvalidPinException |
  NetworkTimeoutException |
  ATMOutOfServiceException
```

**Acceptance Criteria:**
- Given valid card and sufficient balance, when withdrawing ₹1000, then cash dispensed and account debited within 45 seconds
- Given invalid PIN entered 3 times, when attempting withdrawal, then card captured and security alert generated
- Given network failure during transaction, when system recovers, then no duplicate charges and clear customer notification

---

### **Use Case 2: Check Balance**

**Title:** Check Account Balance  
**Actor(s):** Bank Customer, ATM System, Core Banking System  
**Preconditions:**
- ATM is operational
- Customer has valid card
- Network connectivity available

**Trigger:** Customer selects "Balance Inquiry" from main menu

**Main Flow:**
1. Authenticate customer (already done during session)
2. Display account type selection if multiple accounts
3. Query core banking system for current balance
4. Display available balance and ledger balance
5. Offer receipt printing option
6. Print receipt if requested
7. Return to main menu

**Alternate/Error Flows:**
- If network timeout → display cached balance with timestamp warning
- If account closed → display account status message
- If system maintenance → display "Service temporarily unavailable"

**Postconditions:**
- Balance information displayed to customer
- Optional receipt printed
- Transaction logged for audit

**Operation(s):**
```java
checkBalance(cardNumber, accountType) -> 
  BalanceResponse | 
  AccountClosedException |
  NetworkTimeoutException |
  SystemMaintenanceException
```

**Acceptance Criteria:**
- Given valid session, when checking balance, then current balance displayed within 10 seconds
- Given network timeout, when checking balance, then cached balance shown with "as of [timestamp]" warning
- Given account with pending transactions, when checking balance, then both available and ledger balance shown

---

### **NFR Matrix - Enterprise ATM System**

| Category | Metric | Target | Rationale |
|----------|--------|--------|-----------|
| **Performance** | Transaction completion | < 45 seconds | Customer experience |
| | PIN verification | < 3 seconds | Security vs usability |
| | Cash dispensing | < 30 seconds | Mechanical constraints |
| | Balance inquiry | < 10 seconds | Simple query operation |
| **Scalability** | Concurrent transactions | 10,000 ATMs × 1 txn/min | Peak load capacity |
| | Daily transaction volume | 50M transactions/day | National network scale |
| | Peak hour multiplier | 3x average load | Rush hour traffic |
| **Reliability** | System uptime | 99.5% (43.8 hours/year) | Acceptable for non-critical |
| | Transaction success rate | 99.9% | High reliability needed |
| | Cash availability | 95% (no out-of-cash) | Operational efficiency |
| **Security** | PIN encryption | AES-256 | Industry standard |
| | Fraud detection | < 5 second decision | Real-time protection |
| | Card capture accuracy | 99.99% | False positives costly |
| | Audit log retention | 7 years | Regulatory compliance |
| **Availability** | Recovery time (RTO) | < 2 hours | Business continuity |
| | Data loss tolerance (RPO) | < 15 minutes | Transaction integrity |
| | Planned maintenance window | 2-6 AM, 4 hours/month | Minimize customer impact |

---

### **Actor-Permission Matrix**

| Actor | Permissions | Authentication | Authorization |
|-------|-------------|----------------|---------------|
| **Bank Customer** | Withdraw, Balance, Mini-statement, PIN change | PIN + Card | Account ownership |
| **Bank Employee** | Transaction reversal, Cash replenishment, Basic maintenance | Employee ID + PIN | Role-based access |
| **ATM Technician** | Hardware diagnostics, Cash loading, Software updates | Biometric + ID | Service technician role |
| **Security Officer** | Audit logs, Incident reports, Card capture review | Multi-factor auth | Security clearance |
| **System Administrator** | Configuration, Monitoring, User management | Certificate + MFA | Admin privileges |
| **Compliance Auditor** | Read-only audit trails, Transaction reports | Audit credentials | Compliance role |

---

## ⚡ **Exercise 2 Solution: Global Food Delivery Platform**

### **Performance Requirements:**

| Metric | Target | 95th Percentile | Peak Load |
|--------|--------|-----------------|-----------|
| **Order placement** | 800ms | 1.2s | 2.0s |
| **Restaurant search** | 300ms | 500ms | 800ms |
| **Real-time tracking** | 2s latency | 3s | 5s |
| **Peak concurrent users** | 2M users | 5M users | 10M users |
| **Order throughput** | 50,000 orders/sec | 100,000/sec | 200,000/sec |

**Rationale:**
- Order placement: Critical user journey, must be fast
- Search: Frequent operation, needs to be responsive
- Tracking: Real-time but can tolerate slight delay
- Concurrent users: Global scale across time zones
- Throughput: Based on lunch/dinner rush patterns

---

### **Scalability Requirements:**

| Component | Current | 1-Year Target | 3-Year Target |
|-----------|---------|---------------|---------------|
| **Restaurant partners** | 500K active | 1M active | 2M active |
| **Daily order volume** | 100M orders/day | 300M orders/day | 1B orders/day |
| **Geographic expansion** | 100 cities | 300 cities | 1000 cities |
| **Driver fleet** | 1M active drivers | 3M active drivers | 10M active drivers |
| **Menu items** | 50M SKUs | 150M SKUs | 500M SKUs |

**Architecture Implications:**
- Microservices with independent scaling
- Multi-region deployment with data locality
- Caching layers for menu and restaurant data
- Event-driven architecture for real-time updates

---

### **Reliability & Availability:**

| Metric | Target | Calculation | Business Impact |
|--------|--------|-------------|-----------------|
| **System uptime** | 99.95% | 26.28 minutes downtime/year | $50K revenue loss/minute |
| **Order completion rate** | 99.5% | 5 failed orders per 1000 | Customer retention critical |
| **Payment success rate** | 99.8% | 2 failures per 1000 transactions | Revenue loss + trust |
| **Recovery Time (RTO)** | 5 minutes | Automated failover | Minimize revenue impact |
| **Recovery Point (RPO)** | 30 seconds | Real-time replication | Order data integrity |

**Implementation:**
- Multi-region active-active deployment
- Circuit breakers and graceful degradation
- Real-time monitoring with automated incident response
- Chaos engineering for resilience testing

---

### **Security & Compliance:**

| Requirement | Standard | Implementation | Audit Frequency |
|-------------|----------|----------------|-----------------|
| **PCI-DSS Compliance** | Level 1 | Tokenization, encrypted storage | Quarterly |
| **Data Encryption** | AES-256 at rest, TLS 1.3 in transit | Hardware security modules | Annual |
| **Authentication** | OAuth 2.0 + JWT, MFA for drivers | Identity provider integration | Continuous |
| **Fraud Detection** | 99.5% accuracy, <100ms decision | ML-based real-time scoring | Monthly |
| **GDPR/CCPA Compliance** | Data portability, right to deletion | Privacy by design, consent management | Semi-annual |

**Additional Security Measures:**
- API rate limiting and DDoS protection
- Regular penetration testing and vulnerability assessments
- Zero-trust network architecture
- Secure CI/CD pipeline with dependency scanning

---

## 🏗️ **Exercise 3 Solution: E-commerce Domain Modeling**

### **Entity Classification:**

**Entities (have identity, mutable):**
- **Customer** - Unique identity, profile changes over time
- **Order** - Unique order number, status changes through lifecycle
- **Product** - SKU identifier, inventory and pricing can change
- **Payment** - Transaction ID, status changes (pending → completed)

**Value Objects (immutable, defined by attributes):**
- **Email** - Defined by email string, immutable
- **Address** - Defined by street, city, zip; immutable once created
- **Price** - Amount + currency, immutable
- **ShippingAddress** - Same as Address but in shipping context

### **Relationship Mapping:**

| Relationship | Type | Cardinality | Business Rule |
|--------------|------|-------------|---------------|
| Customer → Orders | One-to-Many | 1:N | Customer can have multiple orders |
| Order → OrderItems | One-to-Many | 1:N | Order contains multiple line items |
| Product → OrderItems | One-to-Many | 1:N | Product can appear in multiple orders |
| Order → Payment | One-to-One | 1:1 | Each order has exactly one payment |
| Customer → Address | One-to-Many | 1:N | Customer can have multiple addresses |

### **Domain Model Diagram:**
```
Customer (1) ──→ (N) Order
    │                │
    │                ├─→ (1) Payment
    │                │
    └─→ (N) Address  └─→ (N) OrderItem ←─ (N) Product
                                │              │
                            Price (VO)    ProductCategory
```

---

## 📊 **Exercise 4 Solution: Diagram Selection**

### **Situation-Diagram Mapping:**

1. **Shopping cart class relationships** → **Class Diagram**
   - **Rationale**: Shows static structure, attributes, methods, inheritance
   - **Elements**: Cart, CartItem, Product, Customer classes with relationships

2. **User login process flow** → **Sequence Diagram**
   - **Rationale**: Shows interactions over time between user, UI, auth service
   - **Elements**: User, LoginForm, AuthService, Database with message flows

3. **Order states and transitions** → **State Diagram**
   - **Rationale**: Shows lifecycle states and valid transitions
   - **Elements**: Created → Paid → Shipped → Delivered with transition conditions

4. **Payment processing service structure** → **Component Diagram**
   - **Rationale**: Shows high-level system architecture and dependencies
   - **Elements**: PaymentService, GatewayAdapter, Database, ExternalAPI components

---

## 🔌 **Exercise 5 Solution: Music Streaming Service APIs**

### **User Management:**
```java
interface UserService {
    User createUser(String email, String password) throws UserAlreadyExistsException;
    User authenticateUser(String email, String password) throws AuthenticationException;
    void updateUserProfile(UserId userId, UserProfile profile) throws UserNotFoundException;
    void deleteUser(UserId userId) throws UserNotFoundException;
    Subscription getSubscription(UserId userId) throws UserNotFoundException;
}
```

### **Music Playback:**
```java
interface PlaybackService {
    PlaybackSession startPlayback(UserId userId, TrackId trackId) throws TrackNotFoundException, SubscriptionRequiredException;
    void pausePlayback(SessionId sessionId) throws InvalidSessionException;
    void resumePlayback(SessionId sessionId) throws InvalidSessionException;
    void seekTo(SessionId sessionId, Duration position) throws InvalidSessionException;
    PlaybackStatus getPlaybackStatus(SessionId sessionId) throws InvalidSessionException;
}
```

### **Playlist Management:**
```java
interface PlaylistService {
    Playlist createPlaylist(UserId userId, String name, boolean isPublic) throws UserNotFoundException;
    void addTrackToPlaylist(PlaylistId playlistId, TrackId trackId) throws PlaylistNotFoundException, TrackNotFoundException;
    void removeTrackFromPlaylist(PlaylistId playlistId, TrackId trackId) throws PlaylistNotFoundException;
    List<Playlist> getUserPlaylists(UserId userId) throws UserNotFoundException;
    void sharePlaylist(PlaylistId playlistId, UserId targetUserId) throws PlaylistNotFoundException, UserNotFoundException;
}
```

### **Search:**
```java
interface SearchService {
    SearchResults searchTracks(String query, SearchFilters filters, Pagination pagination);
    SearchResults searchArtists(String query, Pagination pagination);
    SearchResults searchAlbums(String query, SearchFilters filters, Pagination pagination);
    List<Track> getRecommendations(UserId userId, int limit) throws UserNotFoundException;
    List<Track> getTrendingTracks(Genre genre, int limit);
}
```

---

## 🎓 **Exercise 6 Solution: Chat Application End-to-End**

### **Step 1: Requirements**

**Functional Requirements:**
- Users can send/receive real-time messages in channels
- Users can create private and public channels
- Users can join/leave channels and invite others
- Message history is persistent and searchable
- File sharing and emoji reactions supported

**Business Rules:**
- Public channels: anyone can join
- Private channels: invite-only
- Message retention: 90 days for free, unlimited for premium
- File size limit: 25MB per file
- Rate limiting: 100 messages/minute per user

### **Step 2: NFRs**

**Performance Targets:**
- Message delivery latency: <200ms
- Channel loading: <1s for 1000 recent messages
- Search results: <500ms
- Concurrent users: 100K per server cluster

**Scalability Goals:**
- Support 10M registered users
- Handle 1M concurrent connections
- 1B messages per day
- Multi-region deployment

### **Step 3: Domain Model**

**Entities:**
- **User** (userId, username, email, status)
- **Channel** (channelId, name, type, createdBy)
- **Message** (messageId, content, timestamp, author)

**Value Objects:**
- **UserId**, **ChannelId**, **MessageId**
- **MessageContent** (text, attachments, reactions)
- **Timestamp** (createdAt, editedAt)

**Key Relationships:**
- User (N) ↔ (N) Channel (membership)
- Channel (1) → (N) Message
- User (1) → (N) Message (authorship)

### **Step 4: Diagrams**

**Diagrams to Create:**
1. **Class Diagram**: Domain model with User, Channel, Message entities
2. **Sequence Diagram**: Real-time message flow (send → broadcast → receive)
3. **State Diagram**: Message states (draft → sent → delivered → read)
4. **Component Diagram**: System architecture (API, WebSocket, Database, Cache)

### **Step 5: APIs**

**Core Interfaces:**

```java
interface ChatService {
    Channel createChannel(UserId creator, String name, ChannelType type);
    Message sendMessage(UserId sender, ChannelId channel, MessageContent content);
    List<Message> getChannelHistory(ChannelId channel, Pagination pagination);
    void joinChannel(UserId user, ChannelId channel);
    void leaveChannel(UserId user, ChannelId channel);
}

interface RealtimeService {
    void subscribeToChannel(UserId user, ChannelId channel, MessageCallback callback);
    void unsubscribeFromChannel(UserId user, ChannelId channel);
    void broadcastMessage(ChannelId channel, Message message);
    ConnectionStatus getConnectionStatus(UserId user);
}
```

---

## 💡 **Key Takeaways from Solutions**

### **Professional Standards Applied:**
1. **Comprehensive Error Handling** - Every operation defines specific exceptions
2. **Quantitative NFRs** - Specific metrics with business justification
3. **Enterprise Scale** - Real-world numbers and constraints
4. **Security by Design** - Authentication, authorization, compliance built-in
5. **Operational Excellence** - Monitoring, alerting, disaster recovery

### **Interview Readiness:**
- **Structured Thinking** - Systematic approach to each problem
- **Business Context** - Understanding why technical decisions matter
- **Scale Considerations** - From startup to enterprise requirements
- **Trade-off Analysis** - Performance vs consistency, availability vs partition tolerance

**These solutions represent senior/staff engineer level thinking - exactly what's expected in top-tier tech interviews!** 🚀
