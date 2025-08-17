# Parking Lot System - UML Diagrams

## 📊 **Class Diagram**
![Class Diagram](diagrams/class-diagram.png)

**Shows**: Complete domain model with entities, value objects, interfaces, and relationships

**Key Elements**:
- **Entities**: ParkingLot, ParkingFloor, ParkingSpace, Vehicle, ParkingTicket, Payment
- **Value Objects**: VehicleType, SpaceType, PaymentMethod, PaymentStatus
- **Interfaces**: ParkingService, PricingStrategy, PaymentProcessor, SpaceAllocationStrategy
- **Relationships**: Composition, aggregation, and dependency relationships

---

## 🔄 **Sequence Diagram - Entry/Exit Flow**
![Sequence Diagram](diagrams/sequence-entry-exit.png)

**Shows**: Complete vehicle entry and exit process with payment

**Flow**:
1. **Vehicle Entry**: Find space → Occupy → Generate ticket
2. **Vehicle Exit**: Validate ticket → Calculate fee → Process payment → Free space

**Participants**: Customer, ParkingService, ParkingLot, ParkingSpace, PricingStrategy, PaymentProcessor

---

## 📁 **Diagram Files**

### **Source Files (.mmd)**
- `class-diagram.mmd` - Mermaid source for class diagram
- `sequence-entry-exit.mmd` - Mermaid source for sequence diagram

### **Image Files (.png)**
- `class-diagram.png` - Rendered class diagram
- `sequence-entry-exit.png` - Rendered sequence diagram

---

## 🛠️ **How to Update Diagrams**

1. **Edit** the `.mmd` files with your changes
2. **Convert** to PNG using Mermaid CLI:
   ```bash
   mmdc -i diagrams/class-diagram.mmd -o diagrams/class-diagram.png
   mmdc -i diagrams/sequence-entry-exit.mmd -o diagrams/sequence-entry-exit.png
   ```
3. **Commit** both source and rendered files

---

## 🎯 **Additional Diagrams to Create**

For complete documentation, consider adding:
- **State Diagram**: ParkingTicket lifecycle (active → paid → expired)
- **State Diagram**: Payment status transitions
- **Activity Diagram**: Overall parking process flow
- **Component Diagram**: System architecture and dependencies
