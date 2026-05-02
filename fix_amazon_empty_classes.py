#!/usr/bin/env python3
"""Fix all empty classes in Amazon diagram."""

import re
from pathlib import Path

amazon_mmd = Path('docs/problems/amazon/diagrams/class-diagram.mmd')
content = amazon_mmd.read_text(encoding='utf-8')

# Fix PaymentStatus enum
content = re.sub(
    r'(    class PaymentStatus\s+<<enumeration>> PaymentStatus)',
    r'''    class PaymentStatus {
        <<enumeration>>
        PENDING
        PROCESSING
        COMPLETED
        FAILED
        REFUNDED
    }''',
    content
)

# Fix OrderStatus enum
content = re.sub(
    r'(    class OrderStatus\s+<<enumeration>> OrderStatus)',
    r'''    class OrderStatus {
        <<enumeration>>
        PENDING
        CONFIRMED
        SHIPPED
        DELIVERED
        CANCELLED
        RETURNED
    }''',
    content
)

# Fix PaymentMethod enum
content = re.sub(
    r'(    class PaymentMethod\s+<<enumeration>> PaymentMethod)',
    r'''    class PaymentMethod {
        <<enumeration>>
        CREDIT_CARD
        DEBIT_CARD
        UPI
        NET_BANKING
        WALLET
        CASH_ON_DELIVERY
    }''',
    content
)

# Fix ProductStatus enum
content = re.sub(
    r'(    class ProductStatus\s+<<enumeration>> ProductStatus)',
    r'''    class ProductStatus {
        <<enumeration>>
        AVAILABLE
        OUT_OF_STOCK
        DISCONTINUED
        COMING_SOON
    }''',
    content
)

# Fix ProductCategory enum
content = re.sub(
    r'(    class ProductCategory\s+<<enumeration>> ProductCategory)',
    r'''    class ProductCategory {
        <<enumeration>>
        ELECTRONICS
        BOOKS
        CLOTHING
        HOME
        SPORTS
        TOYS
    }''',
    content
)

# Fix CartService interface
content = re.sub(
    r'(    class CartService\s+<<interface>> CartService)',
    r'''    class CartService {
        <<interface>>
        +addItem(userId, productId, quantity) void
        +removeItem(userId, productId) void
        +updateQuantity(userId, productId, quantity) void
        +getCart(userId) Cart
        +clearCart(userId) void
        +checkout(userId) String
    }''',
    content
)

# Fix ProductService interface
content = re.sub(
    r'(    class ProductService\s+<<interface>> ProductService)',
    r'''    class ProductService {
        <<interface>>
        +addProduct(product) String
        +getProduct(productId) Product
        +searchProducts(query) List~Product~
        +getProductsByCategory(categoryId) List~Product~
        +updateProduct(product) void
        +deleteProduct(productId) void
        +addReview(review) String
    }''',
    content
)

amazon_mmd.write_text(content, encoding='utf-8')
print("✅ Fixed 7 empty classes in Amazon diagram:")
print("   • PaymentStatus (enum)")
print("   • OrderStatus (enum)")
print("   • PaymentMethod (enum)")
print("   • ProductStatus (enum)")
print("   • ProductCategory (enum)")
print("   • CartService (interface)")
print("   • ProductService (interface)")
