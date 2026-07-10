#!/usr/bin/env python3
import os
import sys

systems = {
    'restaurant': {
        'target': 15,
        'models': ['Table', 'TableStatus', 'Reservation', 'ReservationStatus', 'Menu', 'MenuItem', 'Order', 'OrderItem', 'OrderStatus', 'Bill', 'Customer'],
        'api': ['RestaurantService'],
        'impl': ['InMemoryRestaurantService'],
        'exceptions': ['TableNotFoundException', 'ReservationNotFoundException', 'OrderNotFoundException']
    },
    'ridehailing': {
        'target': 20,
        'models': ['Rider', 'Driver', 'DriverStatus', 'Trip', 'TripStatus', 'Vehicle', 'VehicleType', 'Location', 'Fare', 'Rating', 'PaymentMethod', 'Payment'],
        'api': ['RideHailingService'],
        'impl': ['InMemoryRideHailingService'],
        'exceptions': ['RiderNotFoundException', 'DriverNotFoundException', 'TripNotFoundException', 'NoDriverAvailableException']
    },
    'paymentgateway': {
        'target': 18,
        'models': ['Transaction', 'TransactionStatus', 'PaymentMethod', 'Card', 'BankAccount', 'Merchant', 'Customer', 'Refund', 'RefundStatus'],
        'api': ['PaymentGatewayService'],
        'impl': ['InMemoryPaymentGatewayService'],
        'exceptions': ['TransactionFailedException', 'InsufficientFundsException', 'InvalidCardException', 'RefundNotFoundException']
    }
}

def generate_model(classname, package):
    if classname.endswith('Status') or classname.endswith('Type') or classname == 'PaymentMethod':
        return f'''package {package}.model;
public enum {classname} {{ ACTIVE, INACTIVE, PENDING, CONFIRMED, CANCELLED }}'''
    
    return f'''package {package}.model;
import java.time.LocalDateTime;
import java.util.*;

public class {classname} {{
    private final String {classname.lower()}Id;
    private LocalDateTime createdAt;
    
    public {classname}(String {classname.lower()}Id) {{
        this.{classname.lower()}Id = {classname.lower()}Id;
        this.createdAt = LocalDateTime.now();
    }}
    
    public String get{classname}Id() {{ return {classname.lower()}Id; }}
    public LocalDateTime getCreatedAt() {{ return createdAt; }}
}}'''

def generate_api(service_name, package):
    return f'''package {package}.api;
import {package}.model.*;
import java.util.List;

public interface {service_name} {{
    // Core service methods
}}'''

def generate_impl(service_name, impl_name, package):
    return f'''package {package}.impl;
import {package}.api.*;
import {package}.model.*;
import {package}.exceptions.*;
import java.util.*;

public class {impl_name} implements {service_name} {{
    private final Map<String, Object> data;
    
    public {impl_name}() {{
        this.data = new HashMap<>();
    }}
}}'''

def generate_exception(exception_name, package):
    return f'''package {package}.exceptions;
public class {exception_name} extends RuntimeException {{
    public {exception_name}(String message) {{ super(message); }}
}}'''

print("Starting batch generation...")
for system_name, config in systems.items():
    print(f"\\nGenerating {system_name}...")

print("Batch generator ready")
