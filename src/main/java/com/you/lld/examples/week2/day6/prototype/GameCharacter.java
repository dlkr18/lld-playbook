package com.you.lld.examples.week2.day6.prototype;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;

/**
 * Game character demonstrating the Prototype pattern.
 * 
 * This example shows:
 * - Deep cloning of complex objects
 * - Prototype registry for character templates
 * - Customization after cloning
 * - Performance benefits of cloning vs. creation
 */
public abstract class GameCharacter implements Cloneable {
    
    protected String name;
    protected int level;
    protected int health;
    protected int mana;
    protected int experience;
    protected CharacterClass characterClass;
    
    // Complex nested objects that need deep cloning
    protected Stats stats;
    protected Equipment equipment;
    protected List<Skill> skills;
    protected Map<String, Object> attributes;
    
    protected GameCharacter(String name, CharacterClass characterClass) {
        this.name = name;
        this.characterClass = characterClass;
        this.level = 1;
        this.experience = 0;
        this.stats = new Stats();
        this.equipment = new Equipment();
        this.skills = new ArrayList<>();
        this.attributes = new HashMap<>();
        
        initializeDefaults();
    }
    
    /**
     * Initialize character with class-specific defaults.
     * This is called during construction and represents expensive initialization.
     */
    protected abstract void initializeDefaults();
    
    /**
     * Clone this character to create a new instance.
     * Implements deep cloning for all complex objects.
     */
    @Override
    public GameCharacter clone() {
        try {
            GameCharacter cloned = (GameCharacter) super.clone();
            
            // Deep clone complex objects
            cloned.stats = this.stats.clone();
            cloned.equipment = this.equipment.clone();
            cloned.skills = new ArrayList<>();
            for (Skill skill : this.skills) {
                cloned.skills.add(skill.clone());
            }
            cloned.attributes = new HashMap<>(this.attributes);
            
            return cloned;
        } catch (CloneNotSupportedException e) {
            throw new RuntimeException("Clone not supported", e);
        }
    }
    
    /**
     * Create a customized copy of this character.
     * This method demonstrates how prototypes can be customized after cloning.
     */
    public GameCharacter createCustomizedCopy(String newName, int targetLevel) {
        GameCharacter copy = this.clone();
        copy.setName(newName);
        copy.levelUpTo(targetLevel);
        return copy;
    }
    
    // Getters and setters
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    
    public int getLevel() { return level; }
    public int getHealth() { return health; }
    public int getMana() { return mana; }
    public int getExperience() { return experience; }
    public CharacterClass getCharacterClass() { return characterClass; }
    
    public Stats getStats() { return stats; }
    public Equipment getEquipment() { return equipment; }
    public List<Skill> getSkills() { return new ArrayList<>(skills); }
    
    public void addSkill(Skill skill) {
        if (skill != null && !skills.contains(skill)) {
            skills.add(skill);
        }
    }
    
    public void setAttribute(String key, Object value) {
        attributes.put(key, value);
    }
    
    public Object getAttribute(String key) {
        return attributes.get(key);
    }
    
    /**
     * Level up the character to the target level.
     * This demonstrates how cloned objects can be modified.
     */
    public void levelUpTo(int targetLevel) {
        if (targetLevel <= this.level) {
            return;
        }
        
        int levelsToGain = targetLevel - this.level;
        for (int i = 0; i < levelsToGain; i++) {
            levelUp();
        }
    }
    
    protected void levelUp() {
        this.level++;
        this.health += getHealthPerLevel();
        this.mana += getManaPerLevel();
        this.stats.increaseForLevelUp(characterClass);
    }
    
    protected abstract int getHealthPerLevel();
    protected abstract int getManaPerLevel();
    
    @Override
    public boolean equals(Object obj) {
        if (this == obj) return true;
        if (obj == null || getClass() != obj.getClass()) return false;
        GameCharacter that = (GameCharacter) obj;
        return level == that.level &&
               health == that.health &&
               mana == that.mana &&
               experience == that.experience &&
               Objects.equals(name, that.name) &&
               characterClass == that.characterClass &&
               Objects.equals(stats, that.stats) &&
               Objects.equals(equipment, that.equipment) &&
               Objects.equals(skills, that.skills);
    }
    
    @Override
    public int hashCode() {
        return Objects.hash(name, level, health, mana, experience, characterClass, stats, equipment, skills);
    }
    
    @Override
    public String toString() {
        return String.format("%s (Level %d %s) - HP: %d, MP: %d, XP: %d", 
                           name, level, characterClass, health, mana, experience);
    }
    
    // Enums and nested classes
    
    public enum CharacterClass {
        WARRIOR, MAGE, ARCHER, ROGUE, PALADIN, NECROMANCER
    }
    
    /**
     * Character stats that need deep cloning.
     */
    public static class Stats implements Cloneable {
        private int strength;
        private int intelligence;
        private int dexterity;
        private int constitution;
        private int wisdom;
        private int charisma;
        
        public Stats() {
            this.strength = 10;
            this.intelligence = 10;
            this.dexterity = 10;
            this.constitution = 10;
            this.wisdom = 10;
            this.charisma = 10;
        }
        
        public Stats(int str, int intel, int dex, int con, int wis, int cha) {
            this.strength = str;
            this.intelligence = intel;
            this.dexterity = dex;
            this.constitution = con;
            this.wisdom = wis;
            this.charisma = cha;
        }
        
        @Override
        public Stats clone() {
            try {
                return (Stats) super.clone();
            } catch (CloneNotSupportedException e) {
                return new Stats(strength, intelligence, dexterity, constitution, wisdom, charisma);
            }
        }
        
        public void increaseForLevelUp(CharacterClass characterClass) {
            switch (characterClass) {
                case WARRIOR:
                    strength += 2;
                    constitution += 1;
                    break;
                case MAGE:
                    intelligence += 2;
                    wisdom += 1;
                    break;
                case ARCHER:
                    dexterity += 2;
                    constitution += 1;
                    break;
                case ROGUE:
                    dexterity += 1;
                    intelligence += 1;
                    charisma += 1;
                    break;
                case PALADIN:
                    strength += 1;
                    wisdom += 1;
                    charisma += 1;
                    break;
                case NECROMANCER:
                    intelligence += 1;
                    wisdom += 2;
                    break;
            }
        }
        
        // Getters
        public int getStrength() { return strength; }
        public int getIntelligence() { return intelligence; }
        public int getDexterity() { return dexterity; }
        public int getConstitution() { return constitution; }
        public int getWisdom() { return wisdom; }
        public int getCharisma() { return charisma; }
        
        @Override
        public boolean equals(Object obj) {
            if (this == obj) return true;
            if (obj == null || getClass() != obj.getClass()) return false;
            Stats stats = (Stats) obj;
            return strength == stats.strength &&
                   intelligence == stats.intelligence &&
                   dexterity == stats.dexterity &&
                   constitution == stats.constitution &&
                   wisdom == stats.wisdom &&
                   charisma == stats.charisma;
        }
        
        @Override
        public int hashCode() {
            return Objects.hash(strength, intelligence, dexterity, constitution, wisdom, charisma);
        }
    }
    
    /**
     * Equipment that needs deep cloning.
     */
    public static class Equipment implements Cloneable {
        private String weapon;
        private String armor;
        private String helmet;
        private String boots;
        private List<String> accessories;
        
        public Equipment() {
            this.accessories = new ArrayList<>();
        }
        
        @Override
        public Equipment clone() {
            try {
                Equipment cloned = (Equipment) super.clone();
                cloned.accessories = new ArrayList<>(this.accessories);
                return cloned;
            } catch (CloneNotSupportedException e) {
                throw new RuntimeException("Clone not supported", e);
            }
        }
        
        // Getters and setters
        public String getWeapon() { return weapon; }
        public void setWeapon(String weapon) { this.weapon = weapon; }
        
        public String getArmor() { return armor; }
        public void setArmor(String armor) { this.armor = armor; }
        
        public String getHelmet() { return helmet; }
        public void setHelmet(String helmet) { this.helmet = helmet; }
        
        public String getBoots() { return boots; }
        public void setBoots(String boots) { this.boots = boots; }
        
        public List<String> getAccessories() { return new ArrayList<>(accessories); }
        public void addAccessory(String accessory) { accessories.add(accessory); }
        
        @Override
        public boolean equals(Object obj) {
            if (this == obj) return true;
            if (obj == null || getClass() != obj.getClass()) return false;
            Equipment equipment = (Equipment) obj;
            return Objects.equals(weapon, equipment.weapon) &&
                   Objects.equals(armor, equipment.armor) &&
                   Objects.equals(helmet, equipment.helmet) &&
                   Objects.equals(boots, equipment.boots) &&
                   Objects.equals(accessories, equipment.accessories);
        }
        
        @Override
        public int hashCode() {
            return Objects.hash(weapon, armor, helmet, boots, accessories);
        }
    }
    
    /**
     * Skill that needs cloning.
     */
    public static class Skill implements Cloneable {
        private final String name;
        private final String description;
        private int level;
        private int maxLevel;
        
        public Skill(String name, String description, int maxLevel) {
            this.name = name;
            this.description = description;
            this.level = 1;
            this.maxLevel = maxLevel;
        }
        
        @Override
        public Skill clone() {
            try {
                return (Skill) super.clone();
            } catch (CloneNotSupportedException e) {
                Skill cloned = new Skill(name, description, maxLevel);
                cloned.level = this.level;
                return cloned;
            }
        }
        
        public String getName() { return name; }
        public String getDescription() { return description; }
        public int getLevel() { return level; }
        public int getMaxLevel() { return maxLevel; }
        
        public void levelUp() {
            if (level < maxLevel) {
                level++;
            }
        }
        
        @Override
        public boolean equals(Object obj) {
            if (this == obj) return true;
            if (obj == null || getClass() != obj.getClass()) return false;
            Skill skill = (Skill) obj;
            return Objects.equals(name, skill.name);
        }
        
        @Override
        public int hashCode() {
            return Objects.hash(name);
        }
        
        @Override
        public String toString() {
            return String.format("%s (Level %d/%d)", name, level, maxLevel);
        }
    }
}
