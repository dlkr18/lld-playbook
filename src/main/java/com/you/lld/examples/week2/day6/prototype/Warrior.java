package com.you.lld.examples.week2.day6.prototype;

/**
 * Warrior character implementation.
 * Demonstrates concrete prototype with specific initialization.
 */
public class Warrior extends GameCharacter {
    
    public Warrior(String name) {
        super(name, CharacterClass.WARRIOR);
    }
    
    @Override
    protected void initializeDefaults() {
        // Warriors start with high health and strength
        this.health = 120;
        this.mana = 20;
        
        // Set warrior-specific stats
        this.stats = new Stats(16, 8, 12, 15, 10, 9); // High STR and CON
        
        // Default warrior equipment
        this.equipment.setWeapon("Iron Sword");
        this.equipment.setArmor("Chain Mail");
        this.equipment.setHelmet("Iron Helmet");
        this.equipment.setBoots("Leather Boots");
        
        // Default warrior skills
        addSkill(new Skill("Sword Mastery", "Increases damage with swords", 10));
        addSkill(new Skill("Shield Block", "Blocks incoming attacks", 5));
        addSkill(new Skill("Berserker Rage", "Increases attack speed and damage", 3));
        
        // Warrior-specific attributes
        setAttribute("combatStyle", "Melee");
        setAttribute("primaryWeapon", "Sword");
        setAttribute("armorProficiency", "Heavy");
    }
    
    @Override
    protected int getHealthPerLevel() {
        return 8; // Warriors gain more health per level
    }
    
    @Override
    protected int getManaPerLevel() {
        return 1; // Warriors gain little mana per level
    }
    
    /**
     * Warrior-specific method for creating a berserker variant.
     */
    public Warrior createBerserkerVariant(String name) {
        Warrior berserker = (Warrior) this.clone();
        berserker.setName(name);
        
        // Modify for berserker style
        berserker.stats = new Stats(18, 6, 14, 17, 8, 7); // Higher STR, lower INT/WIS
        berserker.equipment.setWeapon("Two-Handed Axe");
        berserker.equipment.setArmor("Studded Leather"); // Lighter armor for speed
        
        // Add berserker-specific skills
        berserker.addSkill(new Skill("Dual Wield", "Wield two weapons", 5));
        berserker.addSkill(new Skill("Bloodlust", "Gain health from kills", 3));
        
        berserker.setAttribute("combatStyle", "Berserker");
        berserker.setAttribute("primaryWeapon", "Axe");
        berserker.setAttribute("armorProficiency", "Medium");
        
        return berserker;
    }
}
