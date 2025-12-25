# Day 3 Exercises: UML Diagrams 📝

---

## 🎯 **Exercise 1: ATM Machine Class Diagram**

### **Requirements**
Design a class diagram for an ATM machine that supports:
- Card authentication with PIN
- Balance inquiry
- Cash withdrawal
- Cash deposit
- Mini statement (last 5 transactions)
- PIN change

### **Tasks**
1. Identify all entities (classes)
2. Define attributes and methods for each class
3. Establish relationships with correct multiplicity
4. Use appropriate access modifiers

### **Constraints**
- Maximum withdrawal: $500 per day
- PIN must be 4 digits
- Support multiple account types (Savings, Checking)

---

## 🎯 **Exercise 2: Library Management Sequence Diagram**

### **Scenario**
Create a sequence diagram for the book borrowing process:
1. Member searches for a book
2. System checks availability
3. Member requests to borrow
4. Librarian approves (if available)
5. System creates loan record
6. System updates book status
7. Member receives confirmation

### **Tasks**
1. Identify all participants (actors and objects)
2. Show the message flow with proper arrows
3. Include alt/opt fragments for:
   - Book not available
   - Member has overdue books
4. Show return messages

---

## 🎯 **Exercise 3: Traffic Light State Diagram**

### **Requirements**
Design a state diagram for a traffic light system at a 4-way intersection:

### **States**
- Green (45 seconds)
- Yellow (5 seconds)
- Red (50 seconds)
- Emergency Override (flashing yellow)
- Malfunction (flashing red)

### **Transitions**
- Timer-based normal transitions
- Emergency vehicle detection
- Malfunction detection
- Reset to normal operation

### **Tasks**
1. Draw all states with entry/exit actions
2. Define all transitions with triggers
3. Include guard conditions where applicable
4. Show nested states if needed

---

## 🎯 **Exercise 4: E-commerce Order Flow**

### **Part A: Class Diagram**
Design classes for:
- Customer, Product, Cart, CartItem
- Order, OrderItem, Payment
- Shipping, Address

### **Part B: Sequence Diagram**
Show the checkout flow:
1. Customer adds items to cart
2. Customer proceeds to checkout
3. System validates inventory
4. Customer selects payment method
5. System processes payment
6. System creates order
7. System initiates shipping

### **Part C: State Diagram**
Model order states:
- Created → Confirmed → Processing → Shipped → Delivered
- Allow cancellation at appropriate states
- Handle payment failures

---

## 🎯 **Exercise 5: Hotel Booking System**

### **Complete System Design**
Design a hotel booking system with:

### **Entities**
- Hotel, Room, RoomType, Amenity
- Guest, Reservation, Payment
- Staff, Service, Invoice

### **Diagrams Required**
1. **Class Diagram**: All entities with relationships
2. **Sequence Diagram**: Room booking flow
3. **State Diagram**: Reservation lifecycle

### **Special Considerations**
- Overbooking prevention
- Cancellation policies (different for different room types)
- Peak season pricing
- Loyalty program integration

---

## 🏋️ **Bonus Challenges**

### **Challenge 1: Concurrent Vending Machine**
Extend the vending machine class diagram to support:
- Multiple users at different sides
- Shared inventory management
- Thread-safe operations

### **Challenge 2: Uber Ride Matching**
Create sequence diagram showing:
- Rider request
- Driver matching algorithm
- Ride acceptance/rejection
- Multiple driver notifications

### **Challenge 3: Elevator State Machine**
Design state diagram for:
- Idle, Moving Up, Moving Down
- Door Opening, Door Open, Door Closing
- Emergency Stop
- Maintenance Mode

---

## 📊 **Grading Rubric**

| Criteria | Points |
|----------|--------|
| **Completeness** - All required elements present | 25 |
| **Correctness** - Proper UML notation | 25 |
| **Relationships** - Correct associations and multiplicities | 20 |
| **Clarity** - Easy to understand | 15 |
| **Professional** - Clean layout and naming | 15 |

---

## ⏱️ **Time Guidelines**

| Exercise | Estimated Time |
|----------|---------------|
| Exercise 1 | 30 minutes |
| Exercise 2 | 25 minutes |
| Exercise 3 | 20 minutes |
| Exercise 4 | 45 minutes |
| Exercise 5 | 60 minutes |

---

**Solutions**: [EXERCISE_SOLUTIONS.md](week1/day3/EXERCISE_SOLUTIONS.md)
