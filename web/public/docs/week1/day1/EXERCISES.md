# Day 1 Exercises: Practice the LLD Process

## 🎯 **Exercise 1: Professional Requirements Analysis**

### **Scenario: Enterprise ATM System**
You're designing an ATM system for a major bank with 10,000+ ATMs nationwide.

**Your Task:**
1. Create 2 complete use case specifications using the professional template
2. Define quantitative NFRs for performance, security, and availability
3. Identify all actors and their authorization levels

**Advanced Requirements to Consider:**
- Multi-bank network interoperability
- Fraud detection and prevention
- Cash management and reconciliation
- Regulatory compliance (PCI-DSS, ADA)
- 24/7 operations with disaster recovery

**Deliverables:**
- Use case: "Withdraw Cash" (complete specification)
- Use case: "Check Balance" (complete specification)
- NFR matrix with specific metrics
- Actor-permission matrix

---

## ⚡ **Exercise 2: Enterprise NFRs Specification**

### **Scenario: Global Food Delivery Platform**
Define comprehensive NFRs for a food delivery platform serving 100+ cities globally (Uber Eats scale).

**Your Task:**
Create a complete NFR specification document with quantitative metrics:

**Performance Requirements:**
- Order placement: ___ ms (95th percentile)
- Restaurant search: ___ ms with geo-filtering
- Real-time tracking updates: ___ ms latency
- Peak concurrent users: ___ (lunch/dinner rush)
- Order throughput: ___ orders/second globally

**Scalability Requirements:**
- Restaurant partners: ___ active restaurants
- Daily order volume: ___ orders/day
- Geographic expansion: ___ new cities/quarter
- Driver fleet: ___ active drivers during peak
- Menu items: ___ SKUs across all restaurants

**Reliability & Availability:**
- System uptime: ___% (calculate downtime in minutes/year)
- Order completion rate: ___%
- Payment success rate: ___%
- Recovery time objective (RTO): ___ minutes
- Recovery point objective (RPO): ___ minutes

**Security & Compliance:**
- PCI-DSS compliance level
- Data encryption standards
- Authentication requirements
- Fraud detection accuracy
- GDPR/CCPA compliance measures

---

## 🏗️ **Exercise 3: Domain Modeling**

### **Scenario: Simple E-commerce System**
Identify entities, value objects, and relationships.

**Your Task:**
Categorize these concepts:
- Customer, Order, Product, Price, Email, Address, OrderItem, Payment, ShippingAddress, ProductCategory

**Categories:**
- **Entities** (have identity, mutable): ___
- **Value Objects** (immutable, defined by attributes): ___

**Relationships:**
- Customer → Orders: ___
- Order → OrderItems: ___
- Product → OrderItems: ___

---

## 📊 **Exercise 4: Diagram Selection**

### **Scenario: Different Design Situations**
Choose the right diagram type for each situation.

**Situations:**
1. Showing how classes relate to each other in a shopping cart system
2. Illustrating the flow of user login process
3. Modeling the states of an order (pending → confirmed → shipped → delivered)
4. Documenting the structure of a payment processing service

**Diagram Types:** Class, Sequence, State, Component

**Your Answers:**
1. ___
2. ___
3. ___
4. ___

---

## 🔌 **Exercise 5: API Design Thinking**

### **Scenario: Music Streaming Service**
Think about what interfaces you'd need.

**Your Task:**
For each capability, suggest an interface name and 2-3 key methods:

**User Management:**
- Interface: ___
- Methods: ___

**Music Playback:**
- Interface: ___
- Methods: ___

**Playlist Management:**
- Interface: ___
- Methods: ___

**Search:**
- Interface: ___
- Methods: ___

---

## 🎓 **Exercise 6: End-to-End Process**

### **Scenario: Simple Chat Application**
Apply the complete LLD process to a basic chat app.

**Step 1: Requirements (5 minutes)**
- List 3 functional requirements
- List 2 business rules

**Step 2: NFRs (3 minutes)**
- Define performance targets
- Define scalability goals

**Step 3: Domain (5 minutes)**
- Identify 3 entities
- Identify 2 value objects
- Define 2 key relationships

**Step 4: Diagrams (conceptual)**
- What diagrams would you create?
- What would each diagram show?

**Step 5: APIs (5 minutes)**
- Suggest 2 main interfaces
- List key methods for each

---

## ✅ **Self-Check Questions**

After completing the exercises, ask yourself:

1. **Requirements**: Can I distinguish between functional requirements and business rules?
2. **NFRs**: Do I understand the difference between performance and scalability?
3. **Domain**: Can I identify what should be an entity vs. value object?
4. **Diagrams**: Do I know when to use each type of UML diagram?
5. **APIs**: Can I think in terms of interfaces and contracts?

---

## 🔄 **Next Steps**

- Review your answers with the concepts from DAY1_LLD_PROCESS.md
- Practice this process on simple, familiar systems (library, bank, restaurant)
- Get comfortable with the terminology before moving to Day 2

**Remember**: The goal is to internalize the **systematic thinking process**, not to get perfect answers!

---

## 📚 **Solutions Available**

After attempting the exercises, review the detailed solutions in:
**[`EXERCISE_SOLUTIONS.md`](week1/day1/EXERCISE_SOLUTIONS.md)**

**Solutions include:**
- ✅ Complete use case specifications with professional templates
- ✅ Quantitative NFR matrices with business rationale  
- ✅ Domain modeling with entity/value object classifications
- ✅ API designs with comprehensive error handling
- ✅ Enterprise-scale architecture considerations

**How to use solutions:**
1. **Attempt exercises first** - Don't peek at solutions immediately
2. **Compare your approach** - See where your thinking aligns or differs
3. **Learn from gaps** - Focus on areas where solutions are more comprehensive
4. **Understand rationale** - Each solution explains the "why" behind decisions
5. **Practice iteration** - Redo exercises using insights from solutions
