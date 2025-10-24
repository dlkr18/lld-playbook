# LLD Examples

This directory contains **executable Java code examples** that demonstrate the concepts taught in the LLD playbook.

## 📁 **Directory Structure**

```
examples/
├── day1/           # Day 1 examples (coming soon)
├── day2/           # Day 2: SOLID, GRASP, Refactoring
│   ├── solid/      # SOLID principles examples
│   ├── grasp/      # GRASP principles examples  
│   ├── coupling/   # Coupling examples
│   └── refactoring/ # God class refactoring examples
└── common/         # Shared utilities and base classes
```

## 🎯 **Purpose**

### **Why Separate Code from Markdown?**
- ✅ **Cleaner Documentation**: Markdown files focus on concepts, not implementation details
- ✅ **Executable Examples**: Code can be compiled, tested, and run
- ✅ **IDE Support**: Full syntax highlighting, refactoring, and debugging support
- ✅ **Maintainable**: Easier to update and maintain code separately
- ✅ **Testable**: Can write unit tests for examples
- ✅ **Reusable**: Code can be imported and extended

### **What Goes in Code vs Markdown?**

#### **📄 Markdown Files Should Contain:**
- Conceptual explanations
- Principles and guidelines
- Short code snippets (< 10 lines)
- References to full code examples
- Diagrams and visual aids

#### **☕ Java Files Should Contain:**
- Complete, working examples
- Full class implementations
- Complex logic and algorithms
- Detailed comments and documentation
- Realistic, production-like code

## 🔗 **How to Use**

### **1. Read the Concept**
Start with the markdown guide to understand the principle or concept.

### **2. See the Code**
Follow the links to see complete, working implementations.

### **3. Run the Examples**
```bash
# Compile and run examples
cd /path/to/lld-playbook
mvn compile
mvn test
```

### **4. Experiment**
- Modify the code to see how it affects the design
- Add new features following the principles
- Break the principles intentionally to see the problems

## 📚 **Day 2 Examples**

### **SOLID Principles**
- [`UserManagerBad.java`](day2/solid/srp/UserManagerBad.java) - SRP violation
- [`UserService.java`](day2/solid/srp/UserService.java) - SRP compliance
- [`EmailService.java`](day2/solid/srp/EmailService.java) - SRP compliance

### **God Class Refactoring**
- **Before**: [`ECommerceManagerGodClass.java`](day2/refactoring/before/ECommerceManagerGodClass.java)
- **After**: 
  - [`User.java`](day2/refactoring/after/User.java) - Domain entity
  - [`UserService.java`](day2/refactoring/after/UserService.java) - Business logic
  - [`UserRepository.java`](day2/refactoring/after/UserRepository.java) - Data access

## 🧪 **Testing Examples**

Each example should be accompanied by tests that demonstrate:
- ✅ **Functionality**: The code works as expected
- ✅ **Design Quality**: Easy to test = good design
- ✅ **Principles**: How following principles improves testability

## 🚀 **Benefits of This Approach**

### **For Learning:**
- See complete, realistic examples
- Understand how principles apply in practice
- Experiment with working code

### **For Teaching:**
- Clear separation of concepts and implementation
- Easy to reference specific examples
- Can evolve examples independently

### **For Practice:**
- Can extend examples for exercises
- Can write tests for examples
- Can refactor examples to practice principles

---

**This approach makes the LLD playbook more practical and hands-on!** 🏗️✨





