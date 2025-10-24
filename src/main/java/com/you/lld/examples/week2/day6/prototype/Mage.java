package com.you.lld.examples.week2.day6.prototype;

/**
 * Mage character implementation.
 * Demonstrates different initialization compared to Warrior.
 */
public class Mage extends GameCharacter {
    
    public Mage(String name) {
        super(name, CharacterClass.MAGE);
    }
    
    @Override
    protected void initializeDefaults() {
        // Mages start with high mana and intelligence
        this.health = 60;
        this.mana = 150;
        
        // Set mage-specific stats
        this.stats = new Stats(8, 16, 10, 9, 15, 12); // High INT and WIS
        
        // Default mage equipment
        this.equipment.setWeapon("Wooden Staff");
        this.equipment.setArmor("Robes");
        this.equipment.setHelmet("Wizard Hat");
        this.equipment.setBoots("Cloth Shoes");
        this.equipment.addAccessory("Spell Component Pouch");
        
        // Default mage skills
        addSkill(new Skill("Fireball", "Launches a ball of fire", 10));
        addSkill(new Skill("Ice Shard", "Shoots sharp ice projectiles", 8));
        addSkill(new Skill("Heal", "Restores health to target", 5));
        addSkill(new Skill("Mana Shield", "Absorbs damage using mana", 3));
        
        // Mage-specific attributes
        setAttribute("combatStyle", "Ranged Magic");
        setAttribute("primaryWeapon", "Staff");
        setAttribute("armorProficiency", "Light");
        setAttribute("spellSchool", "Evocation");
    }
    
    @Override
    protected int getHealthPerLevel() {
        return 3; // Mages gain less health per level
    }
    
    @Override
    protected int getManaPerLevel() {
        return 8; // Mages gain more mana per level
    }
    
    /**
     * Mage-specific method for creating an elemental specialist variant.
     */
    public Mage createElementalSpecialist(String name, String element) {
        Mage specialist = (Mage) this.clone();
        specialist.setName(name);
        
        // Customize based on element
        switch (element.toLowerCase()) {
            case "fire":
                specialist.equipment.setWeapon("Flame Staff");
                specialist.addSkill(new Skill("Meteor", "Summons a meteor", 5));
                specialist.addSkill(new Skill("Fire Wall", "Creates a wall of fire", 3));
                specialist.setAttribute("spellSchool", "Pyromancy");
                break;
                
            case "ice":
                specialist.equipment.setWeapon("Frost Staff");
                specialist.addSkill(new Skill("Blizzard", "Creates an ice storm", 5));
                specialist.addSkill(new Skill("Freeze", "Freezes target in place", 3));
                specialist.setAttribute("spellSchool", "Cryomancy");
                break;
                
            case "lightning":
                specialist.equipment.setWeapon("Storm Staff");
                specialist.addSkill(new Skill("Lightning Bolt", "Strikes with lightning", 5));
                specialist.addSkill(new Skill("Chain Lightning", "Lightning jumps between targets", 3));
                specialist.setAttribute("spellSchool", "Electromancy");
                break;
                
            default:
                specialist.setAttribute("spellSchool", "Generalist");
        }
        
        return specialist;
    }
}
