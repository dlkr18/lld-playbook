# Amazon E-Commerce Platform

## Overview
Full-featured e-commerce platform with product catalog, shopping cart, orders, payments, and shipping.

## Key Features
- Product catalog with search/filter
- Shopping cart management
- Order processing and tracking
- Payment integration
- Inventory management
- Reviews and ratings

## Key Algorithms
```java
public List<Product> searchProducts(String query, List<Filter> filters) {
    return products.stream()
        .filter(p -> p.getName().contains(query))
        .filter(p -> matchesFilters(p, filters))
        .sorted(Comparator.comparing(Product::getRating).reversed())
        .collect(Collectors.toList());
}
```

## Source Code
📄 **[View Complete Source Code](/problems/amazon/CODE)**
