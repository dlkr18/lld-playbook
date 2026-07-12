# Complete LLD Problems Master Guide
## All 44 Problems Organized by Difficulty

> **Complete reference guide for all Low-Level Design interview problems**  
> Each problem includes: Requirements, Key Classes, Design Patterns, and Implementation Approach

---

## 🟢 EASY (8 Problems)

### 1. ✅ Tic Tac Toe
**Status:** ✅ Implemented

**Key Classes:** `Board`, `Player`, `Game`, `Position`

**Design Patterns:** State Pattern (for game states)

**Core Requirements:**
- 3x3 board
- Two players (X and O)
- Validate moves
- Check win conditions (row/column/diagonal)
- Handle draw

**Complexity:** O(1) for move validation, O(1) for win check

---

### 2. ✅ Snake and Ladder
**Status:** ✅ Implemented

**Key Classes:** `Board`, `Player`, `Snake`, `Ladder`, `Dice`, `Game`

**Design Patterns:** Builder Pattern (for board), Queue (for turns)

**Core Requirements:**
- Configurable board size (default 100)
- Multiple players take turns
- Roll dice to move
- Snakes slide down, Ladders climb up
- First to reach end wins

**Complexity:** O(S+L) per move where S=snakes, L=ladders

---

### 3. ✅ LRU Cache
**Status:** ✅ Implemented

**Key Classes:** `LRUCache`, `CacheNode`, `CacheStatistics`

**Design Patterns:** HashMap + Doubly Linked List

**Core Requirements:**
- O(1) get and put operations
- Fixed capacity
- Evict least recently used on overflow
- Thread-safe variant with ReadWriteLock

**Complexity:** O(1) for all operations

---

### 4. Bloom Filter
**Status:** ✅ Complete

**Key Classes:** `BloomFilter<T>`, `BitSet`, `BloomFilterStats`

**Design Patterns:** Probabilistic Data Structure

**Core Requirements:**
- Space-efficient set membership testing
- Multiple hash functions (configurable, typically 3-7)
- Configurable false positive rate
- No false negatives (guaranteed)
- Cannot remove elements (by design)
- Optimal parameter calculation (size, hash functions)

**Implementation:** [View Code](bloomfilter/CODE)

**Key Features:**
```java
// Create with expected elements and desired false positive rate
BloomFilter<String> filter = new BloomFilter<>(1000, 0.01);

// Add elements
filter.add("example.com");

// Check membership (might return false positive, never false negative)
boolean mightContain = filter.mightContain("example.com");

// Get statistics
BloomFilterStats stats = filter.getStats();
double currentFPP = filter.getCurrentFalsePositiveProbability();
```

**Use Cases:**
- Web crawlers (avoid re-crawling URLs)
- Database query optimization
- Spam filtering
- Cache filtering
- Duplicate detection in distributed systems

**Core Operations:**
```java
void add(T element)
boolean mightContain(T element)
double expectedFPP() // False positive probability
```

**Complexity:** O(k) where k = number of hash functions

**Interview Tips:**
- Discuss trade-off between size and false positive rate
- Formula: m = -(n * ln(p)) / (ln(2)^2) where m=bits, n=elements, p=FPP
- Optimal k = (m/n) * ln(2)

---

### 5. ✅ Parking Lot
**Status:** ✅ Implemented

**Key Classes:** `ParkingLot`, `ParkingSpace`, `Vehicle`, `Ticket`, `PricingStrategy`

**Design Patterns:** Strategy Pattern (pricing), Factory Pattern (space allocation)

**Core Requirements:**
- Multiple floors
- Different space types (compact, large, handicapped)
- Entry/exit with ticket generation
- Dynamic pricing
- Real-time availability

---

### 6. Search Autocomplete System
**Status:** ✅ Complete

**Key Classes:** `TrieNode`, `AutocompleteSystem`, `SearchQuery`, `Suggestion`

**Design Patterns:** Trie Data Structure, Priority Queue (for top-k)

**Core Requirements:**
- Insert sentences with frequency/popularity
- Return top K suggestions for prefix
- Support real-time updates
- Handle case-insensitive search
- Rank by popularity/frequency

**Core Operations:**
```java
void insert(String sentence, int frequency)
List<String> search(String prefix, int k)
void updateFrequency(String sentence, int delta)
```

**Complexity:**  
- Insert: O(L) where L = sentence length
- Search: O(P + N log k) where P = prefix length, N = matching sentences

**Interview Tips:**
- Discuss Trie vs HashMap trade-offs
- How to handle millions of sentences (sharding)
- Real-time vs batch updates

---

### 7. Task Management System
**Status:** ✅ Complete

**Key Classes:** `Task`, `User`, `Project`, `Sprint`, `TaskStatus`, `Priority`

**Design Patterns:** Observer Pattern (notifications), State Pattern (task lifecycle)

**Core Requirements:**
- Create/update/delete tasks
- Assign to users
- Set priority, due dates, tags
- Task dependencies
- Comments and attachments
- Status transitions (TODO → IN_PROGRESS → DONE)
- Search and filter tasks

**Core Operations:**
```java
Task createTask(String title, String description, Priority priority)
void assignTask(TaskId id, UserId assignee)
void updateStatus(TaskId id, TaskStatus newStatus)
List<Task> getTasksByUser(UserId userId)
List<Task> getTasksByProject(ProjectId projectId)
```

**State Machine:**
```
TODO → IN_PROGRESS → IN_REVIEW → DONE
  ↓          ↓            ↓
BLOCKED   ON_HOLD     REJECTED
```

---

### 8. Notification System
**Status:** ✅ Complete

**Key Classes:** `Notification`, `NotificationService`, `NotificationChannel`, `Template`, `Recipient`

**Design Patterns:** Strategy Pattern (channels), Template Method (message formatting), Observer Pattern

**Core Requirements:**
- Multiple channels (Email, SMS, Push, In-App)
- Template-based messages with variables
- Priority levels
- Retry mechanism with exponential backoff
- Batch notifications
- User preferences (opt-in/opt-out)

**Core Operations:**
```java
void send(Notification notification)
void sendBatch(List<Notification> notifications)
void schedule(Notification notification, Instant sendTime)
NotificationStatus getStatus(NotificationId id)
```

**Key Design Considerations:**
- Queue for async processing
- Retry policy: 3 attempts with backoff
- Rate limiting per channel
- Fallback channels

---

## 🟡 MEDIUM (18 Problems)

### 9. ✅ Stack Overflow
**Status:** ✅ Implemented

**Key Classes:** `Question`, `Answer`, `Comment`, `User`, `Tag`, `Vote`, `Badge`

**Design Patterns:** Observer Pattern (notifications), Strategy Pattern (reputation calculation)

---

### 10. ATM
**Status:** ✅ Complete

**Key Classes:** `ATM`, `Card`, `Account`, `Transaction`, `CashDispenser`, `CardReader`, `Screen`

**Design Patterns:** State Pattern (ATM states), Command Pattern (transactions), Chain of Responsibility (cash dispensing)

**Core Requirements:**
- Card authentication (PIN)
- Check balance
- Withdraw cash (denominations: 20, 50, 100, 500)
- Deposit cash/check
- Transfer money
- Print receipt
- Handle insufficient funds
- Handle card retention (3 wrong PINs)

**State Machine:**
```
IDLE → CARD_INSERTED → PIN_VERIFIED → TRANSACTION_IN_PROGRESS → CASH_DISPENSED → IDLE
```

**Cash Dispensing Algorithm:**
- Greedy algorithm for denominations
- Handle "out of cash" scenario
- Maintain cash inventory per denomination

---

### 11. Logging Framework
**Status:** ✅ Complete

**Key Classes:** `Logger`, `LogLevel`, `Appender`, `Layout`, `Filter`, `LoggerConfig`

**Design Patterns:** Singleton (logger instance), Chain of Responsibility (log propagation), Strategy Pattern (appenders)

**Core Requirements:**
- Multiple log levels (TRACE, DEBUG, INFO, WARN, ERROR, FATAL)
- Multiple appenders (Console, File, Database, Remote)
- Configurable layouts/formatters
- Log rotation (size-based, time-based)
- Async logging with queue
- MDC (Mapped Diagnostic Context) for thread-local data
- Hierarchical loggers (com.you.lld.service inherits from com.you.lld)

**Core API:**
```java
logger.info("User {} logged in", userId);
logger.error("Failed to process", exception);
logger.debug("Processing request", MDC.of("requestId", id));
```

**Key Features:**
- Lazy evaluation (lambda for expensive toString())
- Async appenders with ring buffer
- Configurable via XML/JSON/Properties

---

### 12. Pub Sub System
**Status:** ✅ Complete

**Key Classes:** `Topic`, `Publisher`, `Subscriber`, `Message`, `MessageQueue`, `Broker`

**Design Patterns:** Observer Pattern, Mediator Pattern (broker)

**Core Requirements:**
- Create/delete topics
- Subscribe/unsubscribe to topics
- Publish messages to topics
- Guaranteed delivery (at-least-once)
- Message ordering per partition
- Consumer groups
- Offset management
- Dead letter queue

**Core Operations:**
```java
void createTopic(String topicName, int partitions)
void subscribe(TopicId topic, SubscriberId subscriber)
void publish(TopicId topic, Message message)
List<Message> poll(SubscriberId subscriber, int maxMessages)
void commit(SubscriberId subscriber, Offset offset)
```

**Key Considerations:**
- Push vs Pull model
- Message persistence
- Partitioning strategy
- Rebalancing when subscribers join/leave

---

### 13. ✅ Elevator System
**Status:** ✅ Partial (needs enhancement)

**Key Classes:** `Elevator`, `ElevatorController`, `Floor`, `Request`, `Direction`, `Scheduler`

**Design Patterns:** State Pattern, Strategy Pattern (scheduling algorithms)

**Scheduling Algorithms:**
- **FCFS** - First Come First Serve
- **SCAN** - Move in one direction, serve all requests
- **LOOK** - Like SCAN but reverse at last request
- **SSTF** - Shortest Seek Time First

---

### 14. Chat Application
**Status:** ✅ Implemented (WhatsApp)

**Key Classes:** `User`, `Chat`, `Message`, `Group`, `MessageStatus`

**Design Patterns:** Observer Pattern, Mediator Pattern

---

### 15. Simple Search Engine
**Status:** ✅ Complete

**Key Classes:** `Document`, `InvertedIndex`, `SearchQuery`, `Ranker`, `Tokenizer`

**Design Patterns:** Builder Pattern (query), Strategy Pattern (ranking)

**Core Requirements:**
- Index documents (TF-IDF)
- Inverted index: word → List<DocumentId>
- Boolean queries (AND, OR, NOT)
- Phrase queries
- Ranking (BM25, PageRank)
- Fuzzy search (edit distance)

**Core Operations:**
```java
void indexDocument(Document doc)
List<Document> search(String query, int limit)
List<String> suggest(String prefix)
```

**Ranking Formula (TF-IDF):**
```
score = TF(term, doc) * IDF(term)
IDF = log(N / DF(term))
```

---

### 16. ✅ Splitwise
**Status:** ✅ Implemented

**Key Classes:** `User`, `Expense`, `Group`, `Settlement`, `SplitStrategy`

**Design Patterns:** Strategy Pattern (split types), Graph algorithms (debt simplification)

---

### 17. Payment Gateway
**Status:** ✅ Complete

**Key Classes:** `Payment`, `PaymentMethod`, `Transaction`, `PaymentProcessor`, `Webhook`

**Design Patterns:** Strategy Pattern (payment methods), State Pattern (payment lifecycle), Adapter Pattern (external APIs)

**Core Requirements:**
- Multiple payment methods (Credit Card, Debit, UPI, Wallet, Net Banking)
- Payment lifecycle: INITIATED → PROCESSING → SUCCESS/FAILED
- Idempotency (duplicate request handling)
- Webhook callbacks
- Refunds (full/partial)
- 3D Secure authentication
- Retry failed payments
- Transaction reconciliation

**State Machine:**
```
INITIATED → AUTHORIZED → CAPTURED → SETTLED
              ↓            ↓
          DECLINED    REFUNDED
```

**Key Security Considerations:**
- PCI DSS compliance
- Tokenization (don't store raw card numbers)
- Rate limiting
- Fraud detection

---

### 18. ✅ URL Shortener
**Status:** ✅ Implemented

**Key Classes:** `Url`, `ShortCode`, `UrlMapping`, `ClickTracker`

**Design Patterns:** Base62 encoding, Hash functions

---

### 19. ✅ Rate Limiter
**Status:** ✅ Implemented

**Key Classes:** `RateLimiter`, `TokenBucket`, `SlidingWindow`, `LeakyBucket`

**Design Patterns:** Strategy Pattern (algorithms)

---

### 20. ✅ Inventory Management
**Status:** ✅ Implemented

**Key Classes:** `Product`, `Stock`, `Warehouse`, `Reservation`, `Order`

**Design Patterns:** ACID transactions, Optimistic locking

---

### 21. ✅ Vending Machine
**Status:** ✅ Implemented

**Key Classes:** `VendingMachine`, `Product`, `Coin`, `State`

**Design Patterns:** State Pattern

---

### 22. Library Management System
**Status:** ✅ Complete

**Key Classes:** `Book`, `Member`, `Librarian`, `Loan`, `Reservation`, `Fine`

**Design Patterns:** State Pattern (book availability), Observer Pattern (overdue notifications)

**Core Requirements:**
- Book catalog with ISBN, title, author, genre
- Multiple copies of same book
- Member management (students, faculty, staff)
- Checkout/return books
- Reservations (max 3)
- Fines for overdue (₹5/day)
- Search by title/author/ISBN/genre
- Different loan periods by member type

**Core Operations:**
```java
Book addBook(String isbn, String title, int copies)
Loan checkoutBook(MemberId member, BookId book)
void returnBook(LoanId loan)
void reserveBook(MemberId member, BookId book)
List<Book> search(SearchCriteria criteria)
```

**Business Rules:**
- Students: Max 5 books, 14 days
- Faculty: Max 10 books, 30 days
- Cannot checkout if have overdue books
- Auto-cancel reservation after 48 hours

---

### 23. Traffic Control System
**Status:** ✅ Complete

**Key Classes:** `TrafficLight`, `Intersection`, `Road`, `Vehicle`, `Signal`, `Timer`

**Design Patterns:** State Pattern (light states), Observer Pattern (signal coordination)

**Core Requirements:**
- Traffic lights with 3 states (RED, YELLOW, GREEN)
- Coordinated signals at intersections
- Emergency vehicle override
- Pedestrian crossing signals
- Adaptive timing based on traffic density
- 4-way intersection management

**State Machine:**
```
RED (30s) → GREEN (45s) → YELLOW (5s) → RED
```

**Key Considerations:**
- Prevent conflicting green signals
- Minimum green time
- All-red clearance period
- Sensor-based adaptive timing

---

### 24. Social Network
**Status:** ✅ Complete

**Key Classes:** `User`, `Post`, `Comment`, `Like`, `Follow`, `Feed`, `Notification`

**Design Patterns:** Observer Pattern (feed updates), Strategy Pattern (feed ranking)

**Core Requirements:**
- User profiles
- Friend connections / Follow system
- Create posts (text, images, videos)
- Like, comment, share
- News feed generation (ranked by relevance)
- Privacy settings (public, friends, private)
- Notifications
- Search users/posts

**Feed Algorithm:**
- Chronological vs Ranked
- Factors: recency, engagement, relationship strength
- Pagination

---

### 25. Learning Platform
**Status:** ✅ Complete

**Key Classes:** `Course`, `Lesson`, `Student`, `Instructor`, `Enrollment`, `Progress`, `Certificate`

**Design Patterns:** Composite Pattern (course structure), Observer Pattern (progress tracking)

**Core Requirements:**
- Course catalog
- Course structure: Sections → Lessons
- Video lessons, quizzes, assignments
- Student enrollment
- Progress tracking
- Certificates on completion
- Reviews and ratings
- Discussion forums

---

### 26. Minesweeper Game
**Status:** ✅ Complete

**Key Classes:** `Board`, `Cell`, `Game`, `GameState`

**Design Patterns:** Facade Pattern, State Pattern

**Core Requirements:**
- Configurable board size (beginner: 9x9, intermediate: 16x16, expert: 30x16)
- Random mine placement
- Reveal cell
- Flag/unflag cells
- Auto-reveal adjacent cells if count=0
- Win condition: all non-mine cells revealed
- Lose condition: mine revealed

**Cell States:**
- HIDDEN, REVEALED, FLAGGED

**Algorithm for adjacent reveal:**
- BFS/DFS from clicked cell
- Reveal all connected cells with 0 adjacent mines

---

## 🔴 HARD (18 Problems)

### 27. Amazon (E-commerce Platform)
**Status:** ✅ Complete

**Key Classes:** `Product`, `Catalog`, `Cart`, `Order`, `Payment`, `Inventory`, `Shipping`, `Review`

**Design Patterns:** Facade Pattern, Strategy Pattern (pricing, shipping), Observer Pattern (order tracking)

**Core Requirements:**
- Product catalog with categories, filters
- Search and recommendations
- Shopping cart
- Checkout flow
- Multiple payment methods
- Order management (placed → shipped → delivered)
- Inventory management across warehouses
- Reviews and ratings
- Seller management

**Key Subsystems:**
1. Catalog Service
2. Cart Service
3. Order Service
4. Payment Service
5. Inventory Service
6. Shipping Service
7. Recommendation Engine

---

### 28. LinkedIn
**Status:** ✅ Complete

**Key Classes:** `User`, `Profile`, `Connection`, `Post`, `Company`, `Job`, `Application`, `Message`

**Design Patterns:** Graph (connections), Observer Pattern (feed), Strategy Pattern (recommendations)

**Core Requirements:**
- User profiles (experience, education, skills)
- Connection requests (1st, 2nd, 3rd degree)
- Posts and feed
- Job postings
- Job applications
- Company pages
- Messaging
- Recommendations (people, jobs)
- Endorsements and recommendations

---

### 29. Cricinfo
**Status:** ✅ Complete

**Key Classes:** `Match`, `Team`, `Player`, `Innings`, `Over`, `Ball`, `Scorecard`, `Commentary`

**Design Patterns:** Composite Pattern (match structure), Observer Pattern (live updates)

**Core Requirements:**
- Match types (Test, ODI, T20)
- Real-time score updates
- Ball-by-ball commentary
- Scorecard generation
- Player statistics
- Team rankings
- Fixtures and results
- Live match center

---

### 30. Coffee Vending Machine
**Status:** ✅ Complete

**Key Classes:** `CoffeeMachine`, `Beverage`, `Ingredient`, `Recipe`, `Payment`

**Design Patterns:** State Pattern, Factory Pattern, Builder Pattern

**Core Requirements:**
- Multiple beverages (Espresso, Latte, Cappuccino, Mocha)
- Recipes with ingredients
- Ingredient inventory management
- Payment handling
- Refund on ingredient shortage
- Admin mode (refill, configure prices)

---

### 31. ✅ Spotify
**Status:** ✅ Implemented

**Key Classes:** `Song`, `Playlist`, `User`, `Album`, `Artist`, `Player`

**Design Patterns:** Observer Pattern, Strategy Pattern (recommendations)

---

### 32. ✅ Movie Booking System (BookMyShow)
**Status:** ✅ Partial

**Key Classes:** `Movie`, `Show`, `Theater`, `Seat`, `Booking`, `Payment`

**Design Patterns:** State Pattern, Transaction management

---

### 33. Restaurant Management System
**Status:** ✅ Complete

**Key Classes:** `Table`, `Order`, `MenuItem`, `Kitchen`, `Waiter`, `Bill`, `Reservation`

**Design Patterns:** Observer Pattern (order status), State Pattern (table status)

**Core Requirements:**
- Table management (availability, reservations)
- Menu management
- Order placement and tracking
- Kitchen display system (KDS)
- Bill generation with taxes
- Split payment
- Inventory management

---

### 34. Online Stock Exchange
**Status:** ✅ Complete

**Key Classes:** `Stock`, `Order`, `OrderBook`, `Trade`, `User`, `Portfolio`

**Design Patterns:** Observer Pattern (price updates), Strategy Pattern (order matching)

**Core Requirements:**
- Place orders (Market, Limit, Stop-Loss)
- Order matching engine (Price-Time Priority)
- Real-time price updates
- Portfolio management
- Order book (bids and asks)
- Trade execution and settlement

**Order Matching Algorithm:**
- Price-Time Priority (FIFO at same price)
- Bid-Ask spread
- Continuous auction

---

### 35. Online Auction System
**Status:** ✅ Complete

**Key Classes:** `Auction`, `Bid`, `User`, `Item`, `Timer`

**Design Patterns:** Observer Pattern, State Pattern

**Core Requirements:**
- Create auctions with start/end times
- Place bids (must be higher than current highest)
- Auto-bidding (proxy bidding)
- Bid increment rules
- Winner determination
- Payment and escrow

---

### 36. In-Memory File System
**Status:** ✅ Complete

**Key Classes:** `File`, `Directory`, `FileSystem`, `Path`, `Inode`

**Design Patterns:** Composite Pattern (files/directories), Command Pattern (operations)

**Core Requirements:**
- Create/delete files and directories
- Read/write file content
- List directory contents
- Move/rename files
- File permissions (read, write, execute)
- Path resolution (absolute, relative)
- Symbolic links

**Core Operations:**
```java
void mkdir(String path)
void touch(String path)
void write(String path, String content)
String read(String path)
void rm(String path)
void mv(String src, String dest)
List<String> ls(String path)
```

---

### 37. Version Control System
**Status:** ✅ Complete

**Key Classes:** `Repository`, `Commit`, `Branch`, `File`, `Diff`, `MergeStrategy`

**Design Patterns:** Command Pattern, Memento Pattern (snapshots)

**Core Requirements:**
- Initialize repository
- Add/commit files
- Branch and merge
- Diff between commits
- Checkout commits/branches
- Conflict resolution
- History traversal

**Core Operations:**
```java
void init()
void add(String file)
Commit commit(String message)
void branch(String name)
void checkout(String branch)
void merge(String branch)
Diff diff(Commit c1, Commit c2)
```

---

### 38. Online Food Delivery Service
**Status:** ✅ Complete

**Key Classes:** `Restaurant`, `Menu`, `Order`, `DeliveryAgent`, `User`, `Payment`

**Design Patterns:** Strategy Pattern (delivery assignment), Observer Pattern (order tracking), State Pattern

**Core Requirements:**
- Restaurant and menu management
- Search restaurants by cuisine, rating, location
- Place orders
- Delivery agent assignment (nearest available)
- Real-time order tracking
- Payment processing
- Reviews and ratings

**Delivery Assignment Strategies:**
- Nearest agent
- Load balancing
- Agent preferences

---

### 39. Ride Hailing Service (Uber/Ola)
**Status:** ✅ Complete

**Key Classes:** `Rider`, `Driver`, `Trip`, `Vehicle`, `Location`, `Pricing`, `Payment`

**Design Patterns:** Strategy Pattern (pricing, matching), Observer Pattern (location updates), State Pattern

**Core Requirements:**
- Rider requests ride
- Driver matching (nearest available)
- Real-time location tracking
- Dynamic pricing (surge pricing)
- Trip tracking (start, ongoing, completed)
- Payment processing
- Reviews and ratings
- Driver availability status

**Matching Algorithm:**
- Find drivers within radius
- Select by rating, distance, vehicle type
- Handle concurrent requests

---

### 40. Task Scheduler
**Status:** ✅ Complete

**Key Classes:** `Task`, `Scheduler`, `Executor`, `Trigger`, `JobQueue`

**Design Patterns:** Priority Queue, Command Pattern, Observer Pattern

**Core Requirements:**
- Schedule tasks with cron expressions
- One-time and recurring tasks
- Priority-based execution
- Concurrent task execution
- Task dependencies
- Retry failed tasks
- Task status monitoring

**Core Operations:**
```java
void scheduleOnce(Task task, Instant time)
void scheduleRecurring(Task task, CronExpression cron)
void cancel(TaskId id)
TaskStatus getStatus(TaskId id)
```

---

## 📊 Summary Statistics

| Difficulty | Total | Implemented | Remaining |
|------------|-------|-------------|-----------|
| Easy | 8 | 3 | 5 |
| Medium | 18 | 8 | 10 |
| Hard | 18 | 2 | 16 |
| **TOTAL** | **44** | **13** | **31** |

---

## 🎯 Interview Preparation Strategy

### Week 1: Easy Problems (8 problems)
Complete all easy problems to build foundation

### Week 2: Medium Problems (18 problems)
Focus on patterns: State, Strategy, Observer

### Week 3: Hard Problems (18 problems)
System design + LLD combined

### Week 4: Mock Interviews
Practice end-to-end problem solving

---

## 🔑 Common Patterns Across Problems

1. **State Pattern** - 15 problems use this
2. **Strategy Pattern** - 12 problems
3. **Observer Pattern** - 11 problems
4. **Builder Pattern** - 8 problems
5. **Factory Pattern** - 7 problems

---

**Last Updated:** December 25, 2024  
**Author:** LLD Playbook Team  
**Status:** Master guide for all 44 problems

