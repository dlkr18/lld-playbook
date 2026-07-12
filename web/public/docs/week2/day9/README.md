# Day 9: Persistence Patterns 💾

**Focus**: Master Repository, Unit of Work, and Specification patterns for clean data access.

---

## 🎯 **Learning Objectives**

By the end of Day 9, you will:
- **Implement** Repository pattern for data access abstraction
- **Apply** Unit of Work for transaction management
- **Use** Specification pattern for complex queries
- **Create** DTOs for data transfer

---

## 📚 **Repository Pattern**

**Problem**: Business logic shouldn't know about data access details
**Solution**: Abstract data access behind a collection-like interface

```java
// Generic repository interface
public interface Repository<T, ID> {
    T findById(ID id);
    List<T> findAll();
    T save(T entity);
    void delete(T entity);
    void deleteById(ID id);
    boolean existsById(ID id);
    long count();
}

// Domain-specific repository
public interface OrderRepository extends Repository<Order, OrderId> {
    List<Order> findByCustomerId(UserId customerId);
    List<Order> findByStatus(OrderStatus status);
    List<Order> findByDateRange(LocalDate start, LocalDate end);
    Optional<Order> findByOrderNumber(String orderNumber);
}

// In-memory implementation
public class InMemoryOrderRepository implements OrderRepository {
    
    private final Map<OrderId, Order> orders = new ConcurrentHashMap<>();
    
    @Override
    public Order findById(OrderId id) {
        Order order = orders.get(id);
        if (order == null) {
            throw new NotFoundException("Order", id.toString());
        }
        return order;
    }
    
    @Override
    public List<Order> findAll() {
        return new ArrayList<>(orders.values());
    }
    
    @Override
    public Order save(Order order) {
        orders.put(order.getId(), order);
        return order;
    }
    
    @Override
    public void delete(Order order) {
        orders.remove(order.getId());
    }
    
    @Override
    public List<Order> findByCustomerId(UserId customerId) {
        return orders.values().stream()
            .filter(o -> o.getCustomerId().equals(customerId))
            .collect(Collectors.toList());
    }
    
    @Override
    public List<Order> findByStatus(OrderStatus status) {
        return orders.values().stream()
            .filter(o -> o.getStatus() == status)
            .collect(Collectors.toList());
    }
    
    @Override
    public List<Order> findByDateRange(LocalDate start, LocalDate end) {
        return orders.values().stream()
            .filter(o -> {
                LocalDate orderDate = o.getCreatedAt().toLocalDate();
                return !orderDate.isBefore(start) && !orderDate.isAfter(end);
            })
            .collect(Collectors.toList());
    }
}
```

---

## 📚 **Unit of Work Pattern**

**Problem**: Coordinate multiple repository operations in a transaction
**Solution**: Track changes and commit them atomically

```java
public interface UnitOfWork {
    void registerNew(Object entity);
    void registerDirty(Object entity);
    void registerDeleted(Object entity);
    void commit();
    void rollback();
}

public class UnitOfWorkImpl implements UnitOfWork {
    
    private final List<Object> newEntities = new ArrayList<>();
    private final List<Object> dirtyEntities = new ArrayList<>();
    private final List<Object> deletedEntities = new ArrayList<>();
    private final EntityPersister persister;
    
    public UnitOfWorkImpl(EntityPersister persister) {
        this.persister = persister;
    }
    
    @Override
    public void registerNew(Object entity) {
        newEntities.add(entity);
    }
    
    @Override
    public void registerDirty(Object entity) {
        if (!newEntities.contains(entity) && !dirtyEntities.contains(entity)) {
            dirtyEntities.add(entity);
        }
    }
    
    @Override
    public void registerDeleted(Object entity) {
        if (newEntities.remove(entity)) {
            return; // Was new, just remove
        }
        dirtyEntities.remove(entity);
        deletedEntities.add(entity);
    }
    
    @Override
    public void commit() {
        try {
            persister.beginTransaction();
            
            for (Object entity : newEntities) {
                persister.insert(entity);
            }
            
            for (Object entity : dirtyEntities) {
                persister.update(entity);
            }
            
            for (Object entity : deletedEntities) {
                persister.delete(entity);
            }
            
            persister.commitTransaction();
            clear();
        } catch (Exception e) {
            persister.rollbackTransaction();
            throw new PersistenceException("Commit failed", e);
        }
    }
    
    @Override
    public void rollback() {
        persister.rollbackTransaction();
        clear();
    }
    
    private void clear() {
        newEntities.clear();
        dirtyEntities.clear();
        deletedEntities.clear();
    }
}

// Usage
public class OrderService {
    private final UnitOfWork unitOfWork;
    private final OrderRepository orderRepository;
    private final InventoryRepository inventoryRepository;
    
    public void placeOrder(CreateOrderCommand command) {
        try {
            Order order = Order.create(command);
            unitOfWork.registerNew(order);
            
            for (OrderItem item : order.getItems()) {
                Inventory inventory = inventoryRepository.findByProductId(item.getProductId());
                inventory.reserve(item.getQuantity());
                unitOfWork.registerDirty(inventory);
            }
            
            unitOfWork.commit();
        } catch (Exception e) {
            unitOfWork.rollback();
            throw e;
        }
    }
}
```

---

## 📚 **Specification Pattern**

**Problem**: Complex query conditions are hard to reuse and combine
**Solution**: Encapsulate query conditions in reusable objects

```java
// Specification interface
public interface Specification<T> {
    boolean isSatisfiedBy(T entity);
    
    default Specification<T> and(Specification<T> other) {
        return entity -> this.isSatisfiedBy(entity) && other.isSatisfiedBy(entity);
    }
    
    default Specification<T> or(Specification<T> other) {
        return entity -> this.isSatisfiedBy(entity) || other.isSatisfiedBy(entity);
    }
    
    default Specification<T> not() {
        return entity -> !this.isSatisfiedBy(entity);
    }
}

// Concrete specifications
public class OrderByCustomerSpec implements Specification<Order> {
    private final UserId customerId;
    
    public OrderByCustomerSpec(UserId customerId) {
        this.customerId = customerId;
    }
    
    @Override
    public boolean isSatisfiedBy(Order order) {
        return order.getCustomerId().equals(customerId);
    }
}

public class OrderByStatusSpec implements Specification<Order> {
    private final OrderStatus status;
    
    public OrderByStatusSpec(OrderStatus status) {
        this.status = status;
    }
    
    @Override
    public boolean isSatisfiedBy(Order order) {
        return order.getStatus() == status;
    }
}

public class OrderWithMinAmountSpec implements Specification<Order> {
    private final Money minAmount;
    
    public OrderWithMinAmountSpec(Money minAmount) {
        this.minAmount = minAmount;
    }
    
    @Override
    public boolean isSatisfiedBy(Order order) {
        return order.getTotal().isGreaterThanOrEqual(minAmount);
    }
}

public class OrderInDateRangeSpec implements Specification<Order> {
    private final LocalDate start;
    private final LocalDate end;
    
    public OrderInDateRangeSpec(LocalDate start, LocalDate end) {
        this.start = start;
        this.end = end;
    }
    
    @Override
    public boolean isSatisfiedBy(Order order) {
        LocalDate orderDate = order.getCreatedAt().toLocalDate();
        return !orderDate.isBefore(start) && !orderDate.isAfter(end);
    }
}

// Repository with specification support
public interface SpecificationRepository<T, ID> extends Repository<T, ID> {
    List<T> findAll(Specification<T> spec);
    long count(Specification<T> spec);
    boolean exists(Specification<T> spec);
}

// Usage - combine specifications
Specification<Order> spec = new OrderByCustomerSpec(customerId)
    .and(new OrderByStatusSpec(OrderStatus.COMPLETED))
    .and(new OrderWithMinAmountSpec(Money.dollars(100)))
    .and(new OrderInDateRangeSpec(startDate, endDate));

List<Order> orders = orderRepository.findAll(spec);
```

---

## 📚 **DTO Pattern**

**Problem**: Domain objects have internal details not suitable for external exposure
**Solution**: Create dedicated transfer objects for each use case

```java
// Domain entity
public class Order {
    private OrderId id;
    private UserId customerId;
    private List<OrderItem> items;
    private Money total;
    private OrderStatus status;
    private Instant createdAt;
    private Instant updatedAt;
    
    // Business logic methods...
}

// DTO for order list (summary)
public class OrderSummaryDto {
    private final String orderId;
    private final String orderNumber;
    private final String status;
    private final String total;
    private final int itemCount;
    private final String createdAt;
    
    public static OrderSummaryDto from(Order order) {
        return new OrderSummaryDto(
            order.getId().toString(),
            order.getOrderNumber(),
            order.getStatus().name(),
            order.getTotal().toString(),
            order.getItems().size(),
            order.getCreatedAt().toString()
        );
    }
}

// DTO for order details
public class OrderDetailsDto {
    private final String orderId;
    private final CustomerDto customer;
    private final List<OrderItemDto> items;
    private final String subtotal;
    private final String discount;
    private final String tax;
    private final String total;
    private final String status;
    private final AddressDto shippingAddress;
    private final String estimatedDelivery;
    
    public static OrderDetailsDto from(Order order, Customer customer) {
        return new OrderDetailsDto(
            order.getId().toString(),
            CustomerDto.from(customer),
            order.getItems().stream()
                .map(OrderItemDto::from)
                .collect(Collectors.toList()),
            order.getSubtotal().toString(),
            order.getDiscount().toString(),
            order.getTax().toString(),
            order.getTotal().toString(),
            order.getStatus().name(),
            AddressDto.from(order.getShippingAddress()),
            order.getEstimatedDelivery().toString()
        );
    }
}

// Mapper class (alternative to static methods)
public class OrderMapper {
    
    public OrderSummaryDto toSummary(Order order) {
        return OrderSummaryDto.from(order);
    }
    
    public OrderDetailsDto toDetails(Order order, Customer customer) {
        return OrderDetailsDto.from(order, customer);
    }
    
    public Order fromCreateCommand(CreateOrderCommand command) {
        return Order.builder()
            .customerId(UserId.of(command.getCustomerId()))
            .items(command.getItems().stream()
                .map(this::toOrderItem)
                .collect(Collectors.toList()))
            .shippingAddress(toAddress(command.getShippingAddress()))
            .build();
    }
}
```

---

## 🎯 **Best Practices**

### **Repository:**
- One repository per aggregate root
- Keep queries domain-focused
- Return domain objects, not raw data

### **Unit of Work:**
- Scope to a single business operation
- Always handle rollback
- Don't mix with long-running operations

### **Specification:**
- Keep specifications small and focused
- Combine using and/or/not
- Consider SQL translation for performance

### **DTO:**
- Create DTOs per use case
- Keep DTOs immutable
- Use mappers for conversion

---

**Next**: [Day 10 - Caching Strategies](week2/day10/README.md) →
