package com.you.lld.problems.amazon.model;
import java.util.*;

public class Customer {
    private final String customerId;
    private String name;
    private String email;
    private String phone;
    private List<Address> addresses;
    private boolean isPrime;
    private List<String> wishlistProductIds;
    
    public Customer(String customerId, String name, String email) {
        this.customerId = customerId;
        this.name = name;
        this.email = email;
        this.addresses = new ArrayList<>();
        this.isPrime = false;
        this.wishlistProductIds = new ArrayList<>();
    }
    
    public String getCustomerId() { return customerId; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getEmail() { return email; }
    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }
    public List<Address> getAddresses() { return new ArrayList<>(addresses); }
    public void addAddress(Address address) { addresses.add(address); }
    public boolean isPrime() { return isPrime; }
    public void setPrime(boolean prime) { isPrime = prime; }
    public List<String> getWishlistProductIds() { return new ArrayList<>(wishlistProductIds); }
    public void addToWishlist(String productId) { wishlistProductIds.add(productId); }
    public void removeFromWishlist(String productId) { wishlistProductIds.remove(productId); }
}
