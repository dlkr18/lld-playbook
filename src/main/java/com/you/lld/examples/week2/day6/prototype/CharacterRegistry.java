package com.you.lld.examples.week2.day6.prototype;

import java.util.HashMap;
import java.util.Map;
import java.util.Set;

/**
 * Character registry implementing the Prototype pattern.
 * 
 * This class demonstrates:
 * - Prototype registry for managing templates
 * - Cloning performance benefits
 * - Template management and customization
 * - Factory-like interface using prototypes
 */
public class CharacterRegistry {
    
    private final Map<String, GameCharacter> prototypes;
    
    public CharacterRegistry() {
        this.prototypes = new HashMap<>();
        initializeDefaultPrototypes();
    }
    
    /**
     * Initialize the registry with default character prototypes.
     * This simulates expensive character creation that we want to avoid repeating.
     */
    private void initializeDefaultPrototypes() {
        // Create base prototypes - this is expensive initialization
        Warrior basicWarrior = new Warrior("Template Warrior");
        basicWarrior.levelUpTo(5); // Pre-level for better starting point
        basicWarrior.getEquipment().setWeapon("Steel Sword");
        basicWarrior.getEquipment().setArmor("Plate Mail");
        
        Mage basicMage = new Mage("Template Mage");
        basicMage.levelUpTo(5);
        basicMage.getEquipment().setWeapon("Crystal Staff");
        basicMage.getEquipment().addAccessory("Mana Crystal");
        
        // Register prototypes
        registerPrototype("warrior", basicWarrior);
        registerPrototype("mage", basicMage);
        
        // Create specialized variants
        Warrior berserker = basicWarrior.createBerserkerVariant("Template Berserker");
        berserker.levelUpTo(7);
        registerPrototype("berserker", berserker);
        
        Mage fireMage = basicMage.createElementalSpecialist("Template Fire Mage", "fire");
        fireMage.levelUpTo(6);
        registerPrototype("fire_mage", fireMage);
        
        Mage iceMage = basicMage.createElementalSpecialist("Template Ice Mage", "ice");
        iceMage.levelUpTo(6);
        registerPrototype("ice_mage", iceMage);
        
        // Create high-level templates for advanced players
        Warrior eliteWarrior = (Warrior) basicWarrior.clone();
        eliteWarrior.setName("Elite Warrior Template");
        eliteWarrior.levelUpTo(20);
        eliteWarrior.getEquipment().setWeapon("Legendary Sword");
        eliteWarrior.getEquipment().setArmor("Dragon Scale Mail");
        eliteWarrior.addSkill(new GameCharacter.Skill("Dragon Slayer", "Bonus damage vs dragons", 1));
        registerPrototype("elite_warrior", eliteWarrior);
        
        Mage archmage = (Mage) basicMage.clone();
        archmage.setName("Archmage Template");
        archmage.levelUpTo(25);
        archmage.getEquipment().setWeapon("Staff of Power");
        archmage.addSkill(new GameCharacter.Skill("Time Stop", "Freezes time briefly", 1));
        archmage.addSkill(new GameCharacter.Skill("Teleport", "Instantly move to location", 3));
        registerPrototype("archmage", archmage);
    }
    
    /**
     * Register a new prototype in the registry.
     * 
     * @param key The key to identify the prototype
     * @param prototype The prototype character to register
     */
    public void registerPrototype(String key, GameCharacter prototype) {
        if (key == null || prototype == null) {
            throw new IllegalArgumentException("Key and prototype cannot be null");
        }
        prototypes.put(key.toLowerCase(), prototype);
    }
    
    /**
     * Create a new character by cloning a registered prototype.
     * 
     * @param prototypeKey The key of the prototype to clone
     * @param characterName The name for the new character
     * @return Cloned and customized character
     * @throws IllegalArgumentException if prototype key is not found
     */
    public GameCharacter createCharacter(String prototypeKey, String characterName) {
        if (prototypeKey == null || characterName == null) {
            throw new IllegalArgumentException("Prototype key and character name cannot be null");
        }
        
        GameCharacter prototype = prototypes.get(prototypeKey.toLowerCase());
        if (prototype == null) {
            throw new IllegalArgumentException("Prototype not found: " + prototypeKey);
        }
        
        GameCharacter newCharacter = prototype.clone();
        newCharacter.setName(characterName);
        return newCharacter;
    }
    
    /**
     * Create a character with additional customization.
     * 
     * @param prototypeKey The key of the prototype to clone
     * @param characterName The name for the new character
     * @param targetLevel The level to set the character to
     * @return Cloned and customized character
     */
    public GameCharacter createCharacter(String prototypeKey, String characterName, int targetLevel) {
        GameCharacter character = createCharacter(prototypeKey, characterName);
        character.levelUpTo(targetLevel);
        return character;
    }
    
    /**
     * Create multiple characters from the same prototype.
     * Demonstrates the performance benefit of cloning vs. creating from scratch.
     * 
     * @param prototypeKey The prototype to use
     * @param names Array of names for the characters
     * @return Array of cloned characters
     */
    public GameCharacter[] createMultipleCharacters(String prototypeKey, String... names) {
        if (names == null || names.length == 0) {
            return new GameCharacter[0];
        }
        
        GameCharacter[] characters = new GameCharacter[names.length];
        for (int i = 0; i < names.length; i++) {
            characters[i] = createCharacter(prototypeKey, names[i]);
        }
        
        return characters;
    }
    
    /**
     * Get a list of all available prototype keys.
     * 
     * @return Set of prototype keys
     */
    public Set<String> getAvailablePrototypes() {
        return prototypes.keySet();
    }
    
    /**
     * Check if a prototype exists in the registry.
     * 
     * @param prototypeKey The key to check
     * @return true if prototype exists, false otherwise
     */
    public boolean hasPrototype(String prototypeKey) {
        return prototypeKey != null && prototypes.containsKey(prototypeKey.toLowerCase());
    }
    
    /**
     * Get a copy of a prototype for inspection (without creating a character).
     * 
     * @param prototypeKey The prototype key
     * @return Copy of the prototype, or null if not found
     */
    public GameCharacter getPrototypeCopy(String prototypeKey) {
        if (!hasPrototype(prototypeKey)) {
            return null;
        }
        
        return prototypes.get(prototypeKey.toLowerCase()).clone();
    }
    
    /**
     * Remove a prototype from the registry.
     * 
     * @param prototypeKey The key of the prototype to remove
     * @return true if removed, false if not found
     */
    public boolean removePrototype(String prototypeKey) {
        if (prototypeKey == null) {
            return false;
        }
        
        return prototypes.remove(prototypeKey.toLowerCase()) != null;
    }
    
    /**
     * Clear all prototypes from the registry.
     */
    public void clearPrototypes() {
        prototypes.clear();
    }
    
    /**
     * Get the number of registered prototypes.
     * 
     * @return Number of prototypes
     */
    public int getPrototypeCount() {
        return prototypes.size();
    }
    
    /**
     * Demonstrate performance comparison between cloning and creating from scratch.
     * This method shows why the Prototype pattern is useful for expensive object creation.
     */
    public void demonstratePerformance() {
        System.out.println("=== Prototype Pattern Performance Demo ===");
        
        int iterations = 1000;
        
        // Measure cloning performance
        long startTime = System.nanoTime();
        for (int i = 0; i < iterations; i++) {
            createCharacter("elite_warrior", "Clone" + i);
        }
        long cloneTime = System.nanoTime() - startTime;
        
        // Measure creation from scratch performance
        startTime = System.nanoTime();
        for (int i = 0; i < iterations; i++) {
            Warrior warrior = new Warrior("Fresh" + i);
            warrior.levelUpTo(20);
            warrior.getEquipment().setWeapon("Legendary Sword");
            warrior.getEquipment().setArmor("Dragon Scale Mail");
            warrior.addSkill(new GameCharacter.Skill("Dragon Slayer", "Bonus damage vs dragons", 1));
        }
        long createTime = System.nanoTime() - startTime;
        
        System.out.printf("Cloning %d characters: %.2f ms%n", iterations, cloneTime / 1_000_000.0);
        System.out.printf("Creating %d characters from scratch: %.2f ms%n", iterations, createTime / 1_000_000.0);
        System.out.printf("Cloning is %.1fx faster%n", (double) createTime / cloneTime);
    }
}
