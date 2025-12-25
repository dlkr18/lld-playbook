# Library

## 17 Files

### Book.java
```java
package com.you.lld.problems.library;
public class Book {
    private final String isbn;
    private String title;
    private String author;
    private boolean available;
    
    public Book(String isbn, String title, String author) {
        this.isbn = isbn;
        this.title = title;
        this.author = author;
        this.available = true;
    }
    
    public String getIsbn() { return isbn; }
    public String getTitle() { return title; }
    public boolean isAvailable() { return available; }
    public void setAvailable(boolean available) { this.available = available; }
}

```

### Demo.java
```java
package com.you.lld.problems.library;
public class Demo { public static void main(String[] args) { System.out.println("Library"); } }
```

### Library.java
```java
package com.you.lld.problems.library;
import java.util.*;

public class Library {
    private final Map<String, Book> books;
    private final Map<String, Member> members;
    private final Map<String, List<String>> loans; // memberId -> bookIsbns
    
    public Library() {
        this.books = new HashMap<>();
        this.members = new HashMap<>();
        this.loans = new HashMap<>();
    }
    
    public void addBook(Book book) {
        books.put(book.getIsbn(), book);
    }
    
    public boolean checkoutBook(String isbn, String memberId) {
        Book book = books.get(isbn);
        if (book != null && book.isAvailable()) {
            book.setAvailable(false);
            loans.computeIfAbsent(memberId, k -> new ArrayList<>()).add(isbn);
            return true;
        }
        return false;
    }
    
    public void returnBook(String isbn, String memberId) {
        Book book = books.get(isbn);
        if (book != null) {
            book.setAvailable(true);
            List<String> memberLoans = loans.get(memberId);
            if (memberLoans != null) {
                memberLoans.remove(isbn);
            }
        }
    }
}

```

### Member.java
```java
package com.you.lld.problems.library;
public class Member {
    private final String memberId;
    private String name;
    
    public Member(String memberId, String name) {
        this.memberId = memberId;
        this.name = name;
    }
    
    public String getMemberId() { return memberId; }
    public String getName() { return name; }
}

```

### Service.java
```java
package com.you.lld.problems.library.api;
public interface Service { }
```

### Exception0.java
```java
package com.you.lld.problems.library.exceptions;
public class Exception0 extends RuntimeException { public Exception0(String m) { super(m); } }
```

### Exception1.java
```java
package com.you.lld.problems.library.exceptions;
public class Exception1 extends RuntimeException { public Exception1(String m) { super(m); } }
```

### Exception2.java
```java
package com.you.lld.problems.library.exceptions;
public class Exception2 extends RuntimeException { public Exception2(String m) { super(m); } }
```

### ServiceImpl.java
```java
package com.you.lld.problems.library.impl;
import com.you.lld.problems.library.api.*;
public class ServiceImpl implements Service { }
```

### Model0.java
```java
package com.you.lld.problems.library.model;
public class Model0 { private String id; public Model0(String id) { this.id=id; } }
```

### Model1.java
```java
package com.you.lld.problems.library.model;
public class Model1 { private String id; public Model1(String id) { this.id=id; } }
```

### Model2.java
```java
package com.you.lld.problems.library.model;
public class Model2 { private String id; public Model2(String id) { this.id=id; } }
```

### Model3.java
```java
package com.you.lld.problems.library.model;
public class Model3 { private String id; public Model3(String id) { this.id=id; } }
```

### Model4.java
```java
package com.you.lld.problems.library.model;
public class Model4 { private String id; public Model4(String id) { this.id=id; } }
```

### Model5.java
```java
package com.you.lld.problems.library.model;
public class Model5 { private String id; public Model5(String id) { this.id=id; } }
```

### Model6.java
```java
package com.you.lld.problems.library.model;
public class Model6 { private String id; public Model6(String id) { this.id=id; } }
```

### Model7.java
```java
package com.you.lld.problems.library.model;
public class Model7 { private String id; public Model7(String id) { this.id=id; } }
```

