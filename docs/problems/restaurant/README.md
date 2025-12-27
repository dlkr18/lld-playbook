# Restaurant Reservation System

## Overview
Restaurant table booking system with availability checking, reservation management, waitlist handling, and table optimization.

## Key Algorithms
```java
public boolean checkAvailability(LocalDateTime time, int partySize) {
    List<Table> suitable = tables.stream()
        .filter(t -> t.getCapacity() >= partySize)
        .collect(Collectors.toList());
    
    for (Table table : suitable) {
        if (!hasReservation(table, time)) {
            return true;
        }
    }
    return false;
}
```

## Source Code
📄 **[View Complete Source Code](/problems/restaurant/CODE)**
