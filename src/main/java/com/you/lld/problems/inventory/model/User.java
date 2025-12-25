package com.you.lld.problems.inventory.model;

import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

/**
 * User profile with delivery addresses and preferences.
 */
public final class User implements Serializable {
  private static final long serialVersionUID = 1L;
  
  private final UserId userId;
  private final String email;
  private final String name;
  private final String phone;
  private final List<Address> addresses;
  private final UserStatus status;
  private final LocalDateTime createdAt;
  
  public User(UserId userId, String email, String name, String phone, 
              List<Address> addresses, UserStatus status, LocalDateTime createdAt) {
    this.userId = Objects.requireNonNull(userId);
    this.email = Objects.requireNonNull(email);
    this.name = Objects.requireNonNull(name);
    this.phone = Objects.requireNonNull(phone);
    this.addresses = new ArrayList<>(addresses);
    this.status = Objects.requireNonNull(status);
    this.createdAt = Objects.requireNonNull(createdAt);
  }
  
  public UserId userId() { return userId; }
  public String email() { return email; }
  public String name() { return name; }
  public String phone() { return phone; }
  public List<Address> addresses() { return addresses; }
  public UserStatus status() { return status; }
  public LocalDateTime createdAt() { return createdAt; }
  
  public boolean isActive() { return status == UserStatus.ACTIVE; }
  
  @Override
  public String toString() {
    return "User{" +
      "userId=" + userId +
      ", email='" + email + '\'' +
      ", name='" + name + '\'' +
      ", status=" + status +
      '}';
  }
}
