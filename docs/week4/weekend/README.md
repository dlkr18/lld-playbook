# Weekend 4: Capstone Project

**Project**: Choose and complete a capstone project, write Architecture Decision Records (ADRs), and polish your work.

---

## **Capstone Goals**

1. **Demonstrate mastery** of LLD concepts
2. **Make and document** design decisions
3. **Build production-quality** code
4. **Create portfolio-ready** work

---

## **Choose Your Project**

### **Option 1: WhatsApp-like Messaging System**

**Core Features:**
- 1-on-1 and group messaging
- Message delivery status (sent, delivered, read)
- Online/offline presence
- Media sharing

**Key Challenges:**
- Message ordering and delivery guarantees
- Group member synchronization
- Offline message queuing
- Read receipt aggregation

---

### **Option 2: Uber-like Ride Sharing**

**Core Features:**
- Rider request matching
- Driver location tracking
- Fare calculation
- Ride status updates

**Key Challenges:**
- Efficient driver matching algorithm
- Real-time location updates
- Surge pricing logic
- Cancellation and refund policies

---

### **Option 3: Amazon-like E-commerce**

**Core Features:**
- Product catalog with search
- Shopping cart and checkout
- Order tracking
- Inventory management

**Key Challenges:**
- Cart to order transition
- Inventory reservation
- Payment processing
- Order state management

---

### **Option 4: Spotify-like Music Streaming**

**Core Features:**
- Music library and playlists
- Search and recommendations
- Playback queue
- User preferences

**Key Challenges:**
- Playlist operations (add, remove, reorder)
- Recently played tracking
- Shuffle and repeat modes
- Cross-device sync

---

## **Architecture Decision Records (ADRs)**

### **ADR Template**

```markdown
# ADR-001: [Title]

## Status
Proposed | Accepted | Deprecated | Superseded

## Context
What is the issue that we're seeing that is motivating this decision?

## Decision
What is the change that we're proposing and/or doing?

## Consequences
What becomes easier or more difficult to do because of this change?

## Alternatives Considered
What other options were evaluated?
```

### **Example ADRs to Write**

1. **Database Choice**: SQL vs NoSQL
2. **Caching Strategy**: When and what to cache
3. **Authentication**: Session vs Token-based
4. **API Design**: REST vs GraphQL
5. **Error Handling**: Exception strategy

---

## **Project Structure**

```
[View Problem Implementations](/problems/)
├── api/ # Service interfaces
├── model/ # Domain models
├── impl/ # Implementations
├── repository/ # Data access
├── events/ # Domain events
└── exceptions/ # Custom exceptions

docs/ADRs/[project]/
├── ADR-001-database-choice.md
├── ADR-002-caching-strategy.md
├── ADR-003-authentication.md
└── ...

src/test/java/com/you/lld/problems/[project]/
├── unit/ # Unit tests
└── integration/ # Integration tests
```

---

## **Capstone Checklist**

### **Design**
- [] Requirements documented
- [] Class diagram created
- [] Sequence diagrams for key flows
- [] State diagrams where applicable
- [] API contracts defined

### **Implementation**
- [] Core models implemented
- [] Service layer complete
- [] Repository abstractions
- [] Error handling
- [] Concurrency handled

### **Quality**
- [] Unit tests (>80% coverage)
- [] Integration tests
- [] Edge cases covered
- [] Code reviewed

### **Documentation**
- [] README with setup instructions
- [] API documentation
- [] At least 3 ADRs
- [] Usage examples

---

## **Grading Rubric**

| Criteria | Excellent (5) | Good (4) | Satisfactory (3) | Needs Work (2) |
|----------|---------------|----------|------------------|----------------|
| **Requirements** | Complete, edge cases | Most covered | Core only | Missing key features |
| **Design** | Extensible, clean | Solid patterns | Basic OO | Procedural |
| **Code Quality** | Production-ready | Clean code | Works | Has issues |
| **Testing** | Comprehensive | Good coverage | Basic tests | Minimal |
| **Documentation** | Exemplary | Complete | Adequate | Sparse |

---

## **Submission**

Your capstone should include:

1. **Source Code**: Complete, working implementation
2. **Tests**: Unit and integration tests
3. **Documentation**: README + ADRs
4. **Diagrams**: UML diagrams in docs/

---

## **Congratulations!**

You've completed the **LLD Playbook**!

You're now equipped with:
- Strong OO design fundamentals
- Pattern recognition and application
- Production-quality coding skills
- Interview-ready problem-solving
- Technical documentation skills

**Go ace those interviews!**

---

## **Continue Learning**

- **System Design**: Scale up to distributed systems
- **Domain-Driven Design**: Deep dive into DDD
- **Clean Architecture**: Robert C. Martin's principles
- **Microservices**: Service decomposition patterns

---

**Thank you for completing the LLD Playbook!**
