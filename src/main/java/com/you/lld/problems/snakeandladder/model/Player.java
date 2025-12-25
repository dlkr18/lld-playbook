package com.you.lld.problems.snakeandladder.model;

import java.util.Objects;
import java.util.UUID;

/**
 * Represents a player in the Snake and Ladder game.
 */
public class Player {
    
    private final PlayerId id;
    private final String name;
    private int position;
    
    public Player(String name) {
        this.id = PlayerId.generate();
        this.name = Objects.requireNonNull(name, "Name cannot be null");
        this.position = 0; // Start position
    }
    
    public PlayerId getId() {
        return id;
    }
    
    public String getName() {
        return name;
    }
    
    public int getPosition() {
        return position;
    }
    
    public void setPosition(int position) {
        if (position < 0) {
            throw new IllegalArgumentException("Position cannot be negative");
        }
        this.position = position;
    }
    
    public void move(int steps) {
        this.position += steps;
    }
    
    @Override
    public boolean equals(Object obj) {
        if (this == obj) return true;
        if (!(obj instanceof Player)) return false;
        Player other = (Player) obj;
        return id.equals(other.id);
    }
    
    @Override
    public int hashCode() {
        return id.hashCode();
    }
    
    @Override
    public String toString() {
        return "Player{name='" + name + "', position=" + position + "}";
    }
}

/**
 * Value object for Player ID.
 */
class PlayerId {
    
    private final String value;
    
    private PlayerId(String value) {
        this.value = value;
    }
    
    public static PlayerId generate() {
        return new PlayerId(UUID.randomUUID().toString());
    }
    
    public static PlayerId of(String value) {
        if (value == null || value.trim().isEmpty()) {
            throw new IllegalArgumentException("Player ID cannot be empty");
        }
        return new PlayerId(value);
    }
    
    public String getValue() {
        return value;
    }
    
    @Override
    public boolean equals(Object obj) {
        if (this == obj) return true;
        if (!(obj instanceof PlayerId)) return false;
        return value.equals(((PlayerId) obj).value);
    }
    
    @Override
    public int hashCode() {
        return value.hashCode();
    }
    
    @Override
    public String toString() {
        return value;
    }
}

