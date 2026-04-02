# Association, Aggregation & Composition Guide

## **Overview**

These are three fundamental **relationship types** in Object-Oriented Programming that show how classes connect to each other. They represent different **levels of dependency** and **ownership**.

---

## **1. Association**

### **Definition:**
A **loose relationship** between two classes where objects can exist independently.

### **Key Characteristics:**
- **Independent existence** - Both objects can live without each other
- **Loose coupling** - Minimal dependency
- **"Uses-a" relationship** - One class uses another
- **Bidirectional or unidirectional**

### **Java Example:**
```java
public class Student {
    private String name;
    private List<Course> courses; // Student is associated with Courses

    public void enrollInCourse(Course course) {
        courses.add(course);
    }
}

public class Course {
    private String courseName;
    private List<Student> students; // Course is associated with Students

    public void addStudent(Student student) {
        students.add(student);
    }
}
```

### **Real-World Example:**
- **Student ↔ Course**: Students can take courses, courses can have students
- **Doctor ↔ Patient**: Doctors treat patients, patients visit doctors
- **Customer ↔ Product**: Customers buy products, products are bought by customers

### **UML Notation:**
```
Student ────────── Course
        "enrolls in"
```

---

## **2. Aggregation**

### **Definition:**
A **"has-a" relationship** where one class contains another, but both can exist independently. **Weak ownership**.

### **Key Characteristics:**
- **"Has-a" relationship** - Container has components
- **Independent existence** - Parts can exist without the whole
- **Shared ownership** - Parts can belong to multiple containers
- **Weaker coupling** than composition

### **Java Example:**
```java
public class Department {
    private String name;
    private List<Employee> employees; // Department HAS employees

    public Department(String name) {
        this.name = name;
        this.employees = new ArrayList<>();
    }

    public void addEmployee(Employee employee) {
        employees.add(employee);
    }

    // If Department is deleted, Employees still exist
}

public class Employee {
    private String name;
    private String id;

    // Employee can exist without Department
    // Employee can work in multiple departments
}
```

### **Real-World Example:**
- **Department ◇ Employee**: Department has employees, but employees can exist without department
- **Team ◇ Player**: Team has players, but players can exist without team
- **Library ◇ Book**: Library has books, but books can exist without library

### **UML Notation:**
```
Department ◇────── Employee
           "has"
```

---

## **3. Composition**

### **Definition:**
A **strong "part-of" relationship** where components cannot exist without the container. **Strong ownership**.

### **Key Characteristics:**
- **"Part-of" relationship** - Components are integral parts
- **Dependent existence** - Parts cannot exist without the whole
- **Exclusive ownership** - Parts belong to only one container
- **Strongest coupling** - Lifecycle dependency

### **Java Example:**
```java
public class House {
    private List<Room> rooms; // House is COMPOSED of Rooms

    public House() {
        // Rooms are created when House is created
        this.rooms = new ArrayList<>();
        rooms.add(new Room("Living Room"));
        rooms.add(new Room("Bedroom"));
        rooms.add(new Room("Kitchen"));
    }

    // When House is destroyed, Rooms are also destroyed
}

public class Room {
    private String name;

    public Room(String name) {
        this.name = name;
    }

    // Room cannot exist without House
    // Room belongs to only one House
}
```

### **Real-World Example:**
- **House ● Room**: House is composed of rooms, rooms cannot exist without house
- **Car ● Engine**: Car is composed of engine, engine cannot exist without car
- **Book ● Page**: Book is composed of pages, pages cannot exist without book

### **UML Notation:**
```
House ●────── Room
      "composed of"
```

---

## **Comparison Table**

| Aspect | **Association** | **Aggregation** | **Composition** |
|--------|----------------|-----------------|-----------------|
| **Relationship** | "Uses-a" | "Has-a" | "Part-of" |
| **Coupling** | Loose | Medium | Strong |
| **Dependency** | Independent | Independent | Dependent |
| **Ownership** | None | Weak | Strong |
| **Lifecycle** | Independent | Independent | Dependent |
| **UML Symbol** | `────` | `◇────` | `●────` |
| **Example** | Student-Course | Department-Employee | House-Room |

---

## **Code Examples Side-by-Side**

### **Association Example:**
```java
// ASSOCIATION: Student uses Library
public class Student {
    public void borrowBook(Library library, String bookTitle) {
        library.lendBook(bookTitle); // Student USES library
    }
}

public class Library {
    public void lendBook(String title) { ... }
}
// Both can exist independently
```

### **Aggregation Example:**
```java
// AGGREGATION: University has Students
public class University {
    private List<Student> students; // University HAS students

    public void addStudent(Student student) {
        students.add(student);
    }
}

public class Student {
    // Student can exist without University
    // Student can transfer to another University
}
```

### **Composition Example:**
```java
// COMPOSITION: Order is composed of OrderItems
public class Order {
    private List<OrderItem> items; // Order is COMPOSED of items

    public Order() {
        this.items = new ArrayList<>(); // Items created with Order
    }

    public void addItem(String product, int quantity) {
        items.add(new OrderItem(product, quantity)); // Items belong to Order
    }
}

public class OrderItem {
    // OrderItem cannot exist without Order
    // OrderItem belongs to only one Order
}
```

---

## **How to Identify Each Type**

### **Ask These Questions:**

**1. Can the objects exist independently?**
- **Yes** → Association or Aggregation
- **No** → Composition

**2. Does one object own the other?**
- **Yes** → Aggregation or Composition
- **No** → Association

**3. If the container is destroyed, are the parts destroyed too?**
- **Yes** → Composition
- **No** → Aggregation

**4. Can the part belong to multiple containers?**
- **Yes** → Aggregation
- **No** → Composition

---

## **Real-World Decision Tree**

```
Is there a relationship between classes?
├── No → No relationship needed
└── Yes
    ├── Do objects just interact/use each other?
    │ └── Yes → ASSOCIATION
    └── Does one contain/own the other?
        ├── Can the contained object exist without container?
        │ ├── Yes → AGGREGATION
        │ └── No → COMPOSITION
        └── Can the contained object belong to multiple containers?
            ├── Yes → AGGREGATION
            └── No → COMPOSITION
```

---

## **Interview Examples**

### **Question:** *"Model a Car and its components"*

**Answer:**
```java
// COMPOSITION: Car is composed of Engine (strong ownership)
public class Car {
    private Engine engine; // Car ● Engine

    public Car() {
        this.engine = new Engine(); // Engine created with Car
    }
}

// AGGREGATION: Car has Passengers (weak ownership)
public class Car {
    private List<Passenger> passengers; // Car ◇ Passenger

    public void addPassenger(Passenger p) {
        passengers.add(p); // Passenger can exist without Car
    }
}

// ASSOCIATION: Car uses GasStation (just interaction)
public class Car {
    public void refuel(GasStation station) {
        station.fillTank(this); // Car ──── GasStation
    }
}
```

### **Question:** *"Design a School Management System"*

**Answer:**
```java
// COMPOSITION: School ● Classroom (classrooms are part of school)
// AGGREGATION: School ◇ Teacher (teachers can work at multiple schools)
// ASSOCIATION: Student ──── Course (students take courses)

public class School {
    private List<Classroom> classrooms; // COMPOSITION
    private List<Teacher> teachers; // AGGREGATION
}

public class Student {
    public void enroll(Course course) { // ASSOCIATION
        course.addStudent(this);
    }
}
```

---

## **Key Takeaways**

### **Remember the Hierarchy:**
```
Association (weakest) → Aggregation → Composition (strongest)
```

### **Memory Tricks:**
- **Association**: "Uses" - like using a tool
- **Aggregation**: "Has" - like having employees
- **Composition**: "Is made of" - like body made of organs

### **Design Principles:**
- **Prefer Association** for loose coupling
- **Use Aggregation** for shared resources
- **Use Composition** for integral parts
- **Avoid unnecessary strong coupling**

Understanding these relationships is crucial for **clean object-oriented design** and **system architecture**!
