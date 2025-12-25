package com.you.lld.problems.whatsapp.model;

import java.util.Objects;
import java.util.regex.Pattern;

/**
 * Value object representing a phone number.
 * Validates format and ensures immutability.
 */
public final class PhoneNumber {
    private static final Pattern PHONE_PATTERN = Pattern.compile("^\\+?\\d{8,15}$");
    private final String number;

    private PhoneNumber(String number) {
        if (number == null || number.trim().isEmpty()) {
            throw new IllegalArgumentException("Phone number cannot be null or empty");
        }
        
        String normalized = number.replaceAll("[\\s-]", "");
        if (!PHONE_PATTERN.matcher(normalized).matches()) {
            throw new IllegalArgumentException("Invalid phone number format: " + number);
        }
        
        this.number = normalized;
    }

    public static PhoneNumber of(String number) {
        return new PhoneNumber(number);
    }

    public String getValue() {
        return number;
    }

    public String getFormatted() {
        // Simple formatting for display
        if (number.startsWith("+")) {
            return number;
        }
        return "+" + number;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        PhoneNumber that = (PhoneNumber) o;
        return Objects.equals(number, that.number);
    }

    @Override
    public int hashCode() {
        return Objects.hash(number);
    }

    @Override
    public String toString() {
        return "PhoneNumber{" + getFormatted() + '}';
    }
}

