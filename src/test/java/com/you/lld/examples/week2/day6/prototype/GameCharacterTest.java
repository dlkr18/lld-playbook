package com.you.lld.examples.week2.day6.prototype;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;

import static org.junit.jupiter.api.Assertions.*;

/**
 * Tests for GameCharacter cloning and prototype functionality.
 * Focuses on the core cloning behavior and deep copy verification.
 */
@DisplayName("Game Character Prototype Tests")
class GameCharacterTest {

    @Nested
    @DisplayName("Character Creation Tests")
    class CharacterCreationTests {

        @Test
        @DisplayName("Should create warrior with correct defaults")
        void shouldCreateWarriorWithCorrectDefaults() {
            Warrior warrior = new Warrior("Conan");
            
            assertEquals("Conan", warrior.getName());
            assertEquals(GameCharacter.CharacterClass.WARRIOR, warrior.getCharacterClass());
            assertEquals(1, warrior.getLevel());
            assertTrue(warrior.getHealth() > 0);
            assertTrue(warrior.getMana() >= 0);
            assertNotNull(warrior.getStats());
            assertNotNull(warrior.getEquipment());
            assertNotNull(warrior.getSkills());
            
            // Warrior should have high strength
            assertTrue(warrior.getStats().getStrength() > warrior.getStats().getIntelligence());
        }

        @Test
        @DisplayName("Should create mage with correct defaults")
        void shouldCreateMageWithCorrectDefaults() {
            Mage mage = new Mage("Gandalf");
            
            assertEquals("Gandalf", mage.getName());
            assertEquals(GameCharacter.CharacterClass.MAGE, mage.getCharacterClass());
            assertEquals(1, mage.getLevel());
            assertTrue(mage.getHealth() > 0);
            assertTrue(mage.getMana() > 0);
            
            // Mage should have high intelligence
            assertTrue(mage.getStats().getIntelligence() > mage.getStats().getStrength());
            
            // Mage should have more mana than warrior
            Warrior warrior = new Warrior("TestWarrior");
            assertTrue(mage.getMana() > warrior.getMana());
        }
    }

    @Nested
    @DisplayName("Cloning Tests")
    class CloningTests {

        @Test
        @DisplayName("Should clone warrior successfully")
        void shouldCloneWarriorSuccessfully() {
            Warrior original = new Warrior("Original");
            original.levelUpTo(5);
            original.getEquipment().setWeapon("Steel Sword");
            original.addSkill(new GameCharacter.Skill("Custom Skill", "Test skill", 3));
            
            GameCharacter cloned = original.clone();
            
            assertNotSame(original, cloned);
            assertEquals(original.getName(), cloned.getName());
            assertEquals(original.getLevel(), cloned.getLevel());
            assertEquals(original.getCharacterClass(), cloned.getCharacterClass());
            assertEquals(original.getHealth(), cloned.getHealth());
            assertEquals(original.getMana(), cloned.getMana());
        }

        @Test
        @DisplayName("Should perform deep cloning of stats")
        void shouldPerformDeepCloningOfStats() {
            Warrior original = new Warrior("Original");
            GameCharacter cloned = original.clone();
            
            assertNotSame(original.getStats(), cloned.getStats());
            assertEquals(original.getStats().getStrength(), cloned.getStats().getStrength());
            assertEquals(original.getStats().getIntelligence(), cloned.getStats().getIntelligence());
            
            // Modify original stats
            original.levelUpTo(original.getLevel() + 1);
            
            // Cloned stats should be unchanged
            assertNotEquals(original.getStats().getStrength(), cloned.getStats().getStrength());
        }

        @Test
        @DisplayName("Should perform deep cloning of equipment")
        void shouldPerformDeepCloningOfEquipment() {
            Warrior original = new Warrior("Original");
            original.getEquipment().setWeapon("Original Weapon");
            original.getEquipment().addAccessory("Original Accessory");
            
            GameCharacter cloned = original.clone();
            
            assertNotSame(original.getEquipment(), cloned.getEquipment());
            assertEquals(original.getEquipment().getWeapon(), cloned.getEquipment().getWeapon());
            
            // Modify original equipment
            original.getEquipment().setWeapon("Modified Weapon");
            original.getEquipment().addAccessory("New Accessory");
            
            // Cloned equipment should be unchanged
            assertEquals("Original Weapon", cloned.getEquipment().getWeapon());
            assertEquals(1, cloned.getEquipment().getAccessories().size());
            assertTrue(cloned.getEquipment().getAccessories().contains("Original Accessory"));
            assertFalse(cloned.getEquipment().getAccessories().contains("New Accessory"));
        }

        @Test
        @DisplayName("Should perform deep cloning of skills")
        void shouldPerformDeepCloningOfSkills() {
            Warrior original = new Warrior("Original");
            original.addSkill(new GameCharacter.Skill("Test Skill", "A test skill", 5));
            
            GameCharacter cloned = original.clone();
            
            assertEquals(original.getSkills().size(), cloned.getSkills().size());
            
            // Skills should be deep cloned
            GameCharacter.Skill originalSkill = original.getSkills().stream()
                    .filter(skill -> "Test Skill".equals(skill.getName()))
                    .findFirst()
                    .orElse(null);
            
            GameCharacter.Skill clonedSkill = cloned.getSkills().stream()
                    .filter(skill -> "Test Skill".equals(skill.getName()))
                    .findFirst()
                    .orElse(null);
            
            assertNotNull(originalSkill);
            assertNotNull(clonedSkill);
            assertNotSame(originalSkill, clonedSkill);
            assertEquals(originalSkill.getName(), clonedSkill.getName());
            assertEquals(originalSkill.getLevel(), clonedSkill.getLevel());
            
            // Modify original skill
            originalSkill.levelUp();
            
            // Cloned skill should be unchanged
            assertNotEquals(originalSkill.getLevel(), clonedSkill.getLevel());
        }

        @Test
        @DisplayName("Should perform deep cloning of attributes")
        void shouldPerformDeepCloningOfAttributes() {
            Warrior original = new Warrior("Original");
            original.setAttribute("customAttribute", "originalValue");
            
            GameCharacter cloned = original.clone();
            
            assertEquals("originalValue", cloned.getAttribute("customAttribute"));
            
            // Modify original attribute
            original.setAttribute("customAttribute", "modifiedValue");
            original.setAttribute("newAttribute", "newValue");
            
            // Cloned attributes should be unchanged
            assertEquals("originalValue", cloned.getAttribute("customAttribute"));
            assertNull(cloned.getAttribute("newAttribute"));
        }
    }

    @Nested
    @DisplayName("Customized Copy Tests")
    class CustomizedCopyTests {

        @Test
        @DisplayName("Should create customized copy with new name and level")
        void shouldCreateCustomizedCopyWithNewNameAndLevel() {
            Warrior original = new Warrior("Original");
            original.levelUpTo(5);
            
            GameCharacter customized = original.createCustomizedCopy("Customized", 10);
            
            assertNotSame(original, customized);
            assertEquals("Customized", customized.getName());
            assertEquals(10, customized.getLevel());
            
            // Original should be unchanged
            assertEquals("Original", original.getName());
            assertEquals(5, original.getLevel());
            
            // Other properties should be copied
            assertEquals(original.getCharacterClass(), customized.getCharacterClass());
        }

        @Test
        @DisplayName("Should handle level down in customized copy")
        void shouldHandleLevelDownInCustomizedCopy() {
            Warrior original = new Warrior("Original");
            original.levelUpTo(10);
            
            GameCharacter customized = original.createCustomizedCopy("Lower", 5);
            
            // Should not level down (levelUpTo should ignore lower levels)
            assertEquals(10, customized.getLevel());
        }
    }

    @Nested
    @DisplayName("Leveling Tests")
    class LevelingTests {

        @Test
        @DisplayName("Should level up warrior correctly")
        void shouldLevelUpWarriorCorrectly() {
            Warrior warrior = new Warrior("Test");
            int originalLevel = warrior.getLevel();
            int originalHealth = warrior.getHealth();
            int originalMana = warrior.getMana();
            int originalStrength = warrior.getStats().getStrength();
            
            warrior.levelUpTo(originalLevel + 3);
            
            assertEquals(originalLevel + 3, warrior.getLevel());
            assertTrue(warrior.getHealth() > originalHealth);
            assertTrue(warrior.getMana() >= originalMana); // Warriors gain little mana
            assertTrue(warrior.getStats().getStrength() > originalStrength);
        }

        @Test
        @DisplayName("Should level up mage correctly")
        void shouldLevelUpMageCorrectly() {
            Mage mage = new Mage("Test");
            int originalLevel = mage.getLevel();
            int originalHealth = mage.getHealth();
            int originalMana = mage.getMana();
            int originalIntelligence = mage.getStats().getIntelligence();
            
            mage.levelUpTo(originalLevel + 3);
            
            assertEquals(originalLevel + 3, mage.getLevel());
            assertTrue(mage.getHealth() > originalHealth);
            assertTrue(mage.getMana() > originalMana); // Mages gain more mana
            assertTrue(mage.getStats().getIntelligence() > originalIntelligence);
        }

        @Test
        @DisplayName("Should not level down")
        void shouldNotLevelDown() {
            Warrior warrior = new Warrior("Test");
            warrior.levelUpTo(10);
            
            int currentLevel = warrior.getLevel();
            warrior.levelUpTo(5); // Try to level down
            
            assertEquals(currentLevel, warrior.getLevel()); // Should remain unchanged
        }
    }

    @Nested
    @DisplayName("Specialized Character Tests")
    class SpecializedCharacterTests {

        @Test
        @DisplayName("Should create berserker variant")
        void shouldCreateBerserkerVariant() {
            Warrior original = new Warrior("Original");
            Warrior berserker = original.createBerserkerVariant("Berserker");
            
            assertNotSame(original, berserker);
            assertEquals("Berserker", berserker.getName());
            assertEquals(GameCharacter.CharacterClass.WARRIOR, berserker.getCharacterClass());
            
            // Berserker should have different attributes
            assertEquals("Berserker", berserker.getAttribute("combatStyle"));
            assertEquals("Axe", berserker.getAttribute("primaryWeapon"));
            
            // Should have different equipment
            assertNotEquals(original.getEquipment().getWeapon(), berserker.getEquipment().getWeapon());
        }

        @Test
        @DisplayName("Should create elemental mage variants")
        void shouldCreateElementalMageVariants() {
            Mage original = new Mage("Original");
            
            Mage fireMage = original.createElementalSpecialist("Fire Mage", "fire");
            Mage iceMage = original.createElementalSpecialist("Ice Mage", "ice");
            Mage lightningMage = original.createElementalSpecialist("Lightning Mage", "lightning");
            
            assertEquals("Fire Mage", fireMage.getName());
            assertEquals("Ice Mage", iceMage.getName());
            assertEquals("Lightning Mage", lightningMage.getName());
            
            assertEquals("Pyromancy", fireMage.getAttribute("spellSchool"));
            assertEquals("Cryomancy", iceMage.getAttribute("spellSchool"));
            assertEquals("Electromancy", lightningMage.getAttribute("spellSchool"));
            
            // Should have different weapons
            assertTrue(fireMage.getEquipment().getWeapon().contains("Flame"));
            assertTrue(iceMage.getEquipment().getWeapon().contains("Frost"));
            assertTrue(lightningMage.getEquipment().getWeapon().contains("Storm"));
        }

        @Test
        @DisplayName("Should handle unknown element gracefully")
        void shouldHandleUnknownElementGracefully() {
            Mage original = new Mage("Original");
            Mage unknownMage = original.createElementalSpecialist("Unknown Mage", "unknown");
            
            assertEquals("Unknown Mage", unknownMage.getName());
            assertEquals("Generalist", unknownMage.getAttribute("spellSchool"));
        }
    }

    @Nested
    @DisplayName("Equality and Hash Code Tests")
    class EqualityTests {

        @Test
        @DisplayName("Should be equal when all properties match")
        void shouldBeEqualWhenAllPropertiesMatch() {
            Warrior warrior1 = new Warrior("Test");
            warrior1.levelUpTo(5);
            warrior1.getEquipment().setWeapon("Test Weapon");
            
            Warrior warrior2 = new Warrior("Test");
            warrior2.levelUpTo(5);
            warrior2.getEquipment().setWeapon("Test Weapon");
            
            assertEquals(warrior1, warrior2);
            assertEquals(warrior1.hashCode(), warrior2.hashCode());
        }

        @Test
        @DisplayName("Should not be equal when names differ")
        void shouldNotBeEqualWhenNamesDiffer() {
            Warrior warrior1 = new Warrior("Test1");
            Warrior warrior2 = new Warrior("Test2");
            
            assertNotEquals(warrior1, warrior2);
        }

        @Test
        @DisplayName("Should not be equal when levels differ")
        void shouldNotBeEqualWhenLevelsDiffer() {
            Warrior warrior1 = new Warrior("Test");
            Warrior warrior2 = new Warrior("Test");
            warrior2.levelUpTo(5);
            
            assertNotEquals(warrior1, warrior2);
        }
    }

    @Nested
    @DisplayName("Skill Management Tests")
    class SkillManagementTests {

        @Test
        @DisplayName("Should add skills correctly")
        void shouldAddSkillsCorrectly() {
            Warrior warrior = new Warrior("Test");
            int originalSkillCount = warrior.getSkills().size();
            
            GameCharacter.Skill newSkill = new GameCharacter.Skill("New Skill", "A new skill", 5);
            warrior.addSkill(newSkill);
            
            assertEquals(originalSkillCount + 1, warrior.getSkills().size());
            assertTrue(warrior.getSkills().contains(newSkill));
        }

        @Test
        @DisplayName("Should not add duplicate skills")
        void shouldNotAddDuplicateSkills() {
            Warrior warrior = new Warrior("Test");
            GameCharacter.Skill skill = new GameCharacter.Skill("Test Skill", "A test skill", 5);
            
            warrior.addSkill(skill);
            int skillCountAfterFirst = warrior.getSkills().size();
            
            warrior.addSkill(skill); // Try to add same skill again
            
            assertEquals(skillCountAfterFirst, warrior.getSkills().size());
        }

        @Test
        @DisplayName("Should handle null skill gracefully")
        void shouldHandleNullSkillGracefully() {
            Warrior warrior = new Warrior("Test");
            int originalSkillCount = warrior.getSkills().size();
            
            warrior.addSkill(null);
            
            assertEquals(originalSkillCount, warrior.getSkills().size());
        }
    }

    @Nested
    @DisplayName("Attribute Management Tests")
    class AttributeManagementTests {

        @Test
        @DisplayName("Should set and get attributes correctly")
        void shouldSetAndGetAttributesCorrectly() {
            Warrior warrior = new Warrior("Test");
            
            warrior.setAttribute("testAttribute", "testValue");
            assertEquals("testValue", warrior.getAttribute("testAttribute"));
            
            warrior.setAttribute("numericAttribute", 42);
            assertEquals(42, warrior.getAttribute("numericAttribute"));
        }

        @Test
        @DisplayName("Should return null for non-existent attributes")
        void shouldReturnNullForNonExistentAttributes() {
            Warrior warrior = new Warrior("Test");
            assertNull(warrior.getAttribute("nonExistent"));
        }

        @Test
        @DisplayName("Should overwrite existing attributes")
        void shouldOverwriteExistingAttributes() {
            Warrior warrior = new Warrior("Test");
            
            warrior.setAttribute("testAttribute", "originalValue");
            assertEquals("originalValue", warrior.getAttribute("testAttribute"));
            
            warrior.setAttribute("testAttribute", "newValue");
            assertEquals("newValue", warrior.getAttribute("testAttribute"));
        }
    }
}
