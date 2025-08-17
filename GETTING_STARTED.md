# 🚀 Getting Started - LLD Playbook

**New to Low-Level Design?** This guide will get you started in 5 minutes!

## 📋 **Prerequisites**
- Basic Java knowledge
- Understanding of OOP concepts
- Maven installed (`mvn --version`)

## ⚡ **5-Minute Setup**

### **Step 1: Verify Setup**
```bash
# Test that everything compiles and runs
mvn -q test
```
✅ You should see tests passing for Money and Inventory systems.

### **Step 2: Start Learning**
Open the Day 1 guide:
- **File**: [`docs/foundations/DAY1_LLD_PROCESS.md`](docs/foundations/DAY1_LLD_PROCESS.md)
- **Time**: 45-60 minutes reading
- **Goal**: Understand the 5-step LLD process

### **Step 3: Visual Learning**
View the process flow diagram:
- **File**: [`docs/foundations/diagrams/lld-process-flow.png`](docs/foundations/diagrams/lld-process-flow.png)
- **Shows**: Requirements → NFRs → Domain → Diagrams → APIs

### **Step 4: Practice**
Do the exercises:
- **File**: [`docs/foundations/EXERCISES.md`](docs/foundations/EXERCISES.md)
- **Time**: 30-45 minutes
- **Focus**: Exercises 1, 2, and 6

---

## 🎯 **Learning Path Options**

### **🐣 Complete Beginner**
**Timeline: 4 weeks (2-3 hours/day)**
1. Start with [Day 1 Process](docs/foundations/DAY1_LLD_PROCESS.md)
2. Follow the [Progress Tracker](README.md#-progress-tracker) in order
3. Complete all exercises before moving to next day
4. Implement weekend projects from scratch

### **🏃 Fast Track (Have some LLD experience)**
**Timeline: 2 weeks (3-4 hours/day)**
1. Skim [Day 1 Process](docs/foundations/DAY1_LLD_PROCESS.md) 
2. Jump to specific topics using [Navigation Index](README.md#-navigation-index)
3. Focus on implementations: [Inventory](src/main/java/com/you/lld/inventory/), [Parking Lot](src/main/java/com/you/lld/parkinglot/)
4. Study the UML diagrams and test cases

### **🎯 Interview Prep (2-3 weeks before interview)**
**Timeline: 1-2 weeks (4-5 hours/day)**
1. Review [Day 1 Process](docs/foundations/DAY1_LLD_PROCESS.md) for methodology
2. Study complete implementations and their design decisions
3. Practice exercises under time pressure
4. Focus on explaining design choices and trade-offs

---

## 📚 **What Each File Contains**

### **Core Learning Materials**
| File | Purpose | Time | Prerequisites |
|------|---------|------|---------------|
| [`DAY1_LLD_PROCESS.md`](docs/foundations/DAY1_LLD_PROCESS.md) | Learn systematic LLD approach | 60 min | None |
| [`EXERCISES.md`](docs/foundations/EXERCISES.md) | Hands-on practice | 45 min | Day 1 reading |
| [`PLAN.md`](docs/PLAN.md) | Complete 4-week curriculum | 15 min | Overview |

### **Real Implementations**
| System | Guide | Code | Tests | Complexity |
|--------|-------|------|-------|------------|
| **Inventory** | [README](docs/inventory/README.md) | [Source](src/main/java/com/you/lld/inventory/) | [Tests](src/test/java/com/you/lld/inventory/) | ⭐⭐⭐⭐ |
| **Parking Lot** | [README](src/main/java/com/you/lld/parkinglot/README.md) | [Source](src/main/java/com/you/lld/parkinglot/) | [Tests](src/test/java/com/you/lld/parkinglot/) | ⭐⭐⭐ |
| **Money (Utility)** | [Code](src/main/java/com/you/lld/common/Money.java) | [Source](src/main/java/com/you/lld/common/) | [Tests](src/test/java/com/you/lld/common/) | ⭐⭐ |

---

## 🔍 **Troubleshooting**

### **Tests Failing?**
```bash
# Clean and rebuild
mvn clean compile test
```

### **Can't Open Files?**
- Use any text editor or IDE
- Recommended: VS Code, IntelliJ IDEA, or even GitHub web interface

### **Diagrams Not Showing?**
- PNG files should open in any image viewer
- If using terminal: `open filename.png` (Mac) or `xdg-open filename.png` (Linux)

### **Feeling Overwhelmed?**
- Start with just the Day 1 guide
- Take breaks between concepts
- Don't try to understand everything at once
- Focus on the **process**, not memorizing details

---

## 📈 **Success Metrics**

### **After Day 1, you should be able to:**
- [ ] Explain the 5-step LLD process
- [ ] Distinguish functional from non-functional requirements
- [ ] Identify entities vs value objects in a simple system
- [ ] Know when to use different UML diagrams
- [ ] Design a basic interface contract

### **After Week 1, you should be able to:**
- [ ] Apply SOLID principles to refactor code
- [ ] Create comprehensive UML diagrams
- [ ] Implement value objects with proper validation
- [ ] Design clean APIs with error handling

### **After 4 weeks, you should be able to:**
- [ ] Design and implement complete systems from requirements
- [ ] Apply design patterns appropriately
- [ ] Handle concurrency and performance considerations
- [ ] Explain design decisions and trade-offs confidently

---

## 🆘 **Need Help?**

### **Stuck on Concepts?**
- Re-read the relevant section slowly
- Try the exercises to reinforce understanding
- Look at the example implementations
- Draw diagrams by hand to visualize relationships

### **Code Not Working?**
- Check the test cases for expected behavior
- Compare with working implementations
- Ensure you're following the interface contracts

### **Interview Prep?**
- Practice explaining your design choices
- Time yourself on exercises
- Focus on the systematic process, not just the final solution
- Review the UML diagrams to practice visual communication

---

## 🎉 **Ready to Start?**

**Choose your path and begin:**

🐣 **Beginner**: Start with [`docs/foundations/DAY1_LLD_PROCESS.md`](docs/foundations/DAY1_LLD_PROCESS.md)

🏃 **Fast Track**: Jump to [Navigation Index](README.md#-navigation-index)

🎯 **Interview Prep**: Review [Complete Systems](README.md#-navigation-index) and practice exercises

**Good luck on your LLD journey!** 🚀
