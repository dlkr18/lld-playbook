package com.you.lld.examples.week2.day6.builder;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;

import java.time.LocalDateTime;
import java.util.Arrays;

import static org.junit.jupiter.api.Assertions.*;

/**
 * Comprehensive tests for the User Builder pattern implementation.
 * Demonstrates testing strategies for Builder pattern.
 */
@DisplayName("User Builder Pattern Tests")
class UserTest {

    @Nested
    @DisplayName("Successful User Creation")
    class SuccessfulCreation {

        @Test
        @DisplayName("Should create user with required fields only")
        void shouldCreateUserWithRequiredFieldsOnly() {
            User user = User.builder()
                    .name("John Doe")
                    .email("john@example.com")
                    .build();

            assertNotNull(user);
            assertEquals("John Doe", user.getName());
            assertEquals("john@example.com", user.getEmail());
            assertNull(user.getAge());
            assertNull(user.getPhone());
            assertNull(user.getAddress());
            assertTrue(user.getPreferences().isEmpty());
            assertTrue(user.isActive()); // Default value
            assertNotNull(user.getCreatedAt()); // Auto-generated
        }

        @Test
        @DisplayName("Should create user with all optional fields")
        void shouldCreateUserWithAllOptionalFields() {
            LocalDateTime createdAt = LocalDateTime.now().minusDays(1);
            
            User user = User.builder()
                    .name("Jane Smith")
                    .email("jane@example.com")
                    .age(28)
                    .phone("555-012-3456")
                    .address("123 Main St, Anytown, USA")
                    .preferences(Arrays.asList("Dark Mode", "Email Notifications"))
                    .isActive(false)
                    .createdAt(createdAt)
                    .build();

            assertEquals("Jane Smith", user.getName());
            assertEquals("jane@example.com", user.getEmail());
            assertEquals(28, user.getAge());
            assertEquals("555-012-3456", user.getPhone());
            assertEquals("123 Main St, Anytown, USA", user.getAddress());
            assertEquals(2, user.getPreferences().size());
            assertTrue(user.getPreferences().contains("Dark Mode"));
            assertTrue(user.getPreferences().contains("Email Notifications"));
            assertFalse(user.isActive());
            assertEquals(createdAt, user.getCreatedAt());
        }

        @Test
        @DisplayName("Should add preferences individually")
        void shouldAddPreferencesIndividually() {
            User user = User.builder()
                    .name("Alice Johnson")
                    .email("alice@example.com")
                    .addPreference("Two-Factor Auth")
                    .addPreference("Push Notifications")
                    .addPreference("Weekly Digest")
                    .build();

            assertEquals(3, user.getPreferences().size());
            assertTrue(user.getPreferences().contains("Two-Factor Auth"));
            assertTrue(user.getPreferences().contains("Push Notifications"));
            assertTrue(user.getPreferences().contains("Weekly Digest"));
        }

        @Test
        @DisplayName("Should handle method chaining fluently")
        void shouldHandleMethodChainingFluently() {
            User user = User.builder()
                    .name("Bob Wilson")
                    .email("bob@example.com")
                    .age(35)
                    .phone("555-987-6543")
                    .addPreference("Dark Mode")
                    .isActive(true)
                    .build();

            assertEquals("Bob Wilson", user.getName());
            assertEquals(35, user.getAge());
            assertEquals("555-987-6543", user.getPhone());
            assertTrue(user.isActive());
            assertEquals(1, user.getPreferences().size());
        }
    }

    @Nested
    @DisplayName("Validation Tests")
    class ValidationTests {

        @Test
        @DisplayName("Should reject null name")
        void shouldRejectNullName() {
            IllegalStateException exception = assertThrows(IllegalStateException.class, () ->
                    User.builder()
                            .name(null)
                            .email("test@example.com")
                            .build()
            );
            
            assertTrue(exception.getMessage().contains("Name is required"));
        }

        @Test
        @DisplayName("Should reject empty name")
        void shouldRejectEmptyName() {
            IllegalStateException exception = assertThrows(IllegalStateException.class, () ->
                    User.builder()
                            .name("   ")
                            .email("test@example.com")
                            .build()
            );
            
            assertTrue(exception.getMessage().contains("Name is required"));
        }

        @Test
        @DisplayName("Should reject null email")
        void shouldRejectNullEmail() {
            IllegalStateException exception = assertThrows(IllegalStateException.class, () ->
                    User.builder()
                            .name("John Doe")
                            .email(null)
                            .build()
            );
            
            assertTrue(exception.getMessage().contains("Email is required"));
        }

        @Test
        @DisplayName("Should reject invalid email format")
        void shouldRejectInvalidEmailFormat() {
            IllegalStateException exception = assertThrows(IllegalStateException.class, () ->
                    User.builder()
                            .name("John Doe")
                            .email("invalid-email")
                            .build()
            );
            
            assertTrue(exception.getMessage().contains("Email must be in valid format"));
        }

        @Test
        @DisplayName("Should reject negative age")
        void shouldRejectNegativeAge() {
            IllegalStateException exception = assertThrows(IllegalStateException.class, () ->
                    User.builder()
                            .name("John Doe")
                            .email("john@example.com")
                            .age(-5)
                            .build()
            );
            
            assertTrue(exception.getMessage().contains("Age must be between 0 and 150"));
        }

        @Test
        @DisplayName("Should reject unrealistic age")
        void shouldRejectUnrealisticAge() {
            IllegalStateException exception = assertThrows(IllegalStateException.class, () ->
                    User.builder()
                            .name("John Doe")
                            .email("john@example.com")
                            .age(200)
                            .build()
            );
            
            assertTrue(exception.getMessage().contains("Age must be between 0 and 150"));
        }

        @Test
        @DisplayName("Should reject short phone number")
        void shouldRejectShortPhoneNumber() {
            IllegalStateException exception = assertThrows(IllegalStateException.class, () ->
                    User.builder()
                            .name("John Doe")
                            .email("john@example.com")
                            .phone("123")
                            .build()
            );
            
            assertTrue(exception.getMessage().contains("Phone number must be at least 10 digits"));
        }
    }

    @Nested
    @DisplayName("Immutability Tests")
    class ImmutabilityTests {

        @Test
        @DisplayName("Should create immutable user object")
        void shouldCreateImmutableUserObject() {
            User user = User.builder()
                    .name("John Doe")
                    .email("john@example.com")
                    .preferences(Arrays.asList("Pref1", "Pref2"))
                    .build();

            // Verify preferences list is defensive copy
            user.getPreferences().add("Pref3"); // This should not affect the original
            assertEquals(2, user.getPreferences().size()); // Should still be 2
        }

        @Test
        @DisplayName("Should not allow modification of preferences after creation")
        void shouldNotAllowModificationOfPreferencesAfterCreation() {
            User user = User.builder()
                    .name("John Doe")
                    .email("john@example.com")
                    .addPreference("Original Pref")
                    .build();

            // Get preferences and try to modify
            user.getPreferences().clear(); // This should not affect the original
            assertEquals(1, user.getPreferences().size()); // Should still be 1
        }
    }

    @Nested
    @DisplayName("Equality and Hash Code Tests")
    class EqualityTests {

        @Test
        @DisplayName("Should be equal when all fields match")
        void shouldBeEqualWhenAllFieldsMatch() {
            LocalDateTime now = LocalDateTime.now();
            
            User user1 = User.builder()
                    .name("John Doe")
                    .email("john@example.com")
                    .age(30)
                    .phone("555-012-3456")
                    .address("123 Main St")
                    .addPreference("Pref1")
                    .isActive(true)
                    .createdAt(now)
                    .build();

            User user2 = User.builder()
                    .name("John Doe")
                    .email("john@example.com")
                    .age(30)
                    .phone("555-012-3456")
                    .address("123 Main St")
                    .addPreference("Pref1")
                    .isActive(true)
                    .createdAt(now)
                    .build();

            assertEquals(user1, user2);
            assertEquals(user1.hashCode(), user2.hashCode());
        }

        @Test
        @DisplayName("Should not be equal when names differ")
        void shouldNotBeEqualWhenNamesDiffer() {
            User user1 = User.builder()
                    .name("John Doe")
                    .email("john@example.com")
                    .build();

            User user2 = User.builder()
                    .name("Jane Doe")
                    .email("john@example.com")
                    .build();

            assertNotEquals(user1, user2);
        }
    }

    @Nested
    @DisplayName("Builder Reuse Tests")
    class BuilderReuseTests {

        @Test
        @DisplayName("Should create independent objects from same builder pattern")
        void shouldCreateIndependentObjectsFromSameBuilderPattern() {
            // Create first user
            User user1 = User.builder()
                    .name("User One")
                    .email("user1@example.com")
                    .age(25)
                    .build();

            // Create second user with different values
            User user2 = User.builder()
                    .name("User Two")
                    .email("user2@example.com")
                    .age(30)
                    .build();

            assertNotEquals(user1, user2);
            assertEquals("User One", user1.getName());
            assertEquals("User Two", user2.getName());
            assertEquals(25, user1.getAge());
            assertEquals(30, user2.getAge());
        }
    }

    @Nested
    @DisplayName("Edge Cases")
    class EdgeCases {

        @Test
        @DisplayName("Should handle valid edge case ages")
        void shouldHandleValidEdgeCaseAges() {
            User youngUser = User.builder()
                    .name("Baby Doe")
                    .email("baby@example.com")
                    .age(0)
                    .build();

            User oldUser = User.builder()
                    .name("Elder Doe")
                    .email("elder@example.com")
                    .age(150)
                    .build();

            assertEquals(0, youngUser.getAge());
            assertEquals(150, oldUser.getAge());
        }

        @Test
        @DisplayName("Should handle minimum valid phone number")
        void shouldHandleMinimumValidPhoneNumber() {
            User user = User.builder()
                    .name("John Doe")
                    .email("john@example.com")
                    .phone("1234567890") // Exactly 10 digits
                    .build();

            assertEquals("1234567890", user.getPhone());
        }

        @Test
        @DisplayName("Should handle various valid email formats")
        void shouldHandleVariousValidEmailFormats() {
            String[] validEmails = {
                "user@domain.com",
                "user.name@domain.com",
                "user+tag@domain.co.uk",
                "123@domain.org"
            };

            for (String email : validEmails) {
                assertDoesNotThrow(() -> {
                    User user = User.builder()
                            .name("Test User")
                            .email(email)
                            .build();
                    assertEquals(email, user.getEmail());
                });
            }
        }
    }
}
