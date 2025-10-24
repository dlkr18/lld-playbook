package com.you.lld.examples.week2.day6.prototype;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.BeforeEach;

import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;

/**
 * Comprehensive tests for the Character Registry Prototype pattern implementation.
 * Demonstrates testing strategies for Prototype pattern.
 */
@DisplayName("Character Registry Prototype Pattern Tests")
class CharacterRegistryTest {

    private CharacterRegistry registry;

    @BeforeEach
    void setUp() {
        registry = new CharacterRegistry();
    }

    @Nested
    @DisplayName("Basic Character Creation Tests")
    class BasicCharacterCreationTests {

        @Test
        @DisplayName("Should create warrior character from prototype")
        void shouldCreateWarriorCharacterFromPrototype() {
            GameCharacter warrior = registry.createCharacter("warrior", "Conan");
            
            assertNotNull(warrior);
            assertEquals("Conan", warrior.getName());
            assertEquals(GameCharacter.CharacterClass.WARRIOR, warrior.getCharacterClass());
            assertTrue(warrior.getLevel() >= 1);
            assertTrue(warrior.getHealth() > 0);
        }

        @Test
        @DisplayName("Should create mage character from prototype")
        void shouldCreateMageCharacterFromPrototype() {
            GameCharacter mage = registry.createCharacter("mage", "Gandalf");
            
            assertNotNull(mage);
            assertEquals("Gandalf", mage.getName());
            assertEquals(GameCharacter.CharacterClass.MAGE, mage.getCharacterClass());
            assertTrue(mage.getLevel() >= 1);
            assertTrue(mage.getMana() > 0);
        }

        @Test
        @DisplayName("Should create character with target level")
        void shouldCreateCharacterWithTargetLevel() {
            GameCharacter warrior = registry.createCharacter("warrior", "Aragorn", 10);
            
            assertEquals("Aragorn", warrior.getName());
            assertEquals(10, warrior.getLevel());
        }

        @Test
        @DisplayName("Should create multiple characters from same prototype")
        void shouldCreateMultipleCharactersFromSamePrototype() {
            String[] names = {"Guard1", "Guard2", "Guard3"};
            GameCharacter[] guards = registry.createMultipleCharacters("warrior", names);
            
            assertEquals(3, guards.length);
            for (int i = 0; i < guards.length; i++) {
                assertEquals(names[i], guards[i].getName());
                assertEquals(GameCharacter.CharacterClass.WARRIOR, guards[i].getCharacterClass());
            }
        }
    }

    @Nested
    @DisplayName("Prototype Independence Tests")
    class PrototypeIndependenceTests {

        @Test
        @DisplayName("Should create independent character instances")
        void shouldCreateIndependentCharacterInstances() {
            GameCharacter warrior1 = registry.createCharacter("warrior", "Warrior1");
            GameCharacter warrior2 = registry.createCharacter("warrior", "Warrior2");
            
            assertNotSame(warrior1, warrior2);
            assertEquals("Warrior1", warrior1.getName());
            assertEquals("Warrior2", warrior2.getName());
            
            // Modify one character
            warrior1.levelUpTo(10);
            
            // Other character should be unaffected
            assertTrue(warrior2.getLevel() < warrior1.getLevel());
        }

        @Test
        @DisplayName("Should perform deep cloning of complex objects")
        void shouldPerformDeepCloningOfComplexObjects() {
            GameCharacter mage1 = registry.createCharacter("mage", "Mage1");
            GameCharacter mage2 = registry.createCharacter("mage", "Mage2");
            
            // Modify equipment of first mage
            mage1.getEquipment().setWeapon("Staff of Power");
            mage1.addSkill(new GameCharacter.Skill("Teleport", "Instant travel", 3));
            
            // Second mage should have original equipment and skills
            assertNotEquals("Staff of Power", mage2.getEquipment().getWeapon());
            assertFalse(mage2.getSkills().stream()
                    .anyMatch(skill -> "Teleport".equals(skill.getName())));
        }

        @Test
        @DisplayName("Should clone stats independently")
        void shouldCloneStatsIndependently() {
            GameCharacter warrior1 = registry.createCharacter("warrior", "Warrior1");
            GameCharacter warrior2 = registry.createCharacter("warrior", "Warrior2");
            
            int originalStrength1 = warrior1.getStats().getStrength();
            int originalStrength2 = warrior2.getStats().getStrength();
            
            // Level up first warrior (should increase stats)
            warrior1.levelUpTo(warrior1.getLevel() + 5);
            
            // Second warrior's stats should be unchanged
            assertEquals(originalStrength2, warrior2.getStats().getStrength());
            assertTrue(warrior1.getStats().getStrength() > originalStrength1);
        }
    }

    @Nested
    @DisplayName("Registry Management Tests")
    class RegistryManagementTests {

        @Test
        @DisplayName("Should list available prototypes")
        void shouldListAvailablePrototypes() {
            Set<String> prototypes = registry.getAvailablePrototypes();
            
            assertFalse(prototypes.isEmpty());
            assertTrue(prototypes.contains("warrior"));
            assertTrue(prototypes.contains("mage"));
            assertTrue(prototypes.contains("berserker"));
            assertTrue(prototypes.contains("fire_mage"));
        }

        @Test
        @DisplayName("Should check prototype existence")
        void shouldCheckPrototypeExistence() {
            assertTrue(registry.hasPrototype("warrior"));
            assertTrue(registry.hasPrototype("mage"));
            assertFalse(registry.hasPrototype("nonexistent"));
            assertFalse(registry.hasPrototype(null));
        }

        @Test
        @DisplayName("Should get prototype count")
        void shouldGetPrototypeCount() {
            int count = registry.getPrototypeCount();
            assertTrue(count > 0);
            
            // Register a new prototype
            Warrior customWarrior = new Warrior("Custom");
            registry.registerPrototype("custom", customWarrior);
            
            assertEquals(count + 1, registry.getPrototypeCount());
        }

        @Test
        @DisplayName("Should register new prototype")
        void shouldRegisterNewPrototype() {
            Warrior paladin = new Warrior("Paladin Template");
            paladin.levelUpTo(10);
            paladin.getEquipment().setWeapon("Holy Sword");
            
            registry.registerPrototype("paladin", paladin);
            
            assertTrue(registry.hasPrototype("paladin"));
            
            GameCharacter newPaladin = registry.createCharacter("paladin", "Sir Galahad");
            assertEquals("Sir Galahad", newPaladin.getName());
            assertEquals(10, newPaladin.getLevel());
            assertEquals("Holy Sword", newPaladin.getEquipment().getWeapon());
        }

        @Test
        @DisplayName("Should remove prototype")
        void shouldRemovePrototype() {
            // Register a temporary prototype
            Warrior temp = new Warrior("Temp");
            registry.registerPrototype("temp", temp);
            assertTrue(registry.hasPrototype("temp"));
            
            // Remove it
            boolean removed = registry.removePrototype("temp");
            assertTrue(removed);
            assertFalse(registry.hasPrototype("temp"));
            
            // Try to remove non-existent prototype
            boolean notRemoved = registry.removePrototype("nonexistent");
            assertFalse(notRemoved);
        }

        @Test
        @DisplayName("Should get prototype copy for inspection")
        void shouldGetPrototypeCopyForInspection() {
            GameCharacter prototypeCopy = registry.getPrototypeCopy("warrior");
            
            assertNotNull(prototypeCopy);
            assertEquals(GameCharacter.CharacterClass.WARRIOR, prototypeCopy.getCharacterClass());
            
            // Should return null for non-existent prototype
            GameCharacter nullCopy = registry.getPrototypeCopy("nonexistent");
            assertNull(nullCopy);
        }
    }

    @Nested
    @DisplayName("Validation Tests")
    class ValidationTests {

        @Test
        @DisplayName("Should reject null prototype key")
        void shouldRejectNullPrototypeKey() {
            IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () ->
                    registry.createCharacter(null, "TestName")
            );
            
            assertTrue(exception.getMessage().contains("cannot be null"));
        }

        @Test
        @DisplayName("Should reject null character name")
        void shouldRejectNullCharacterName() {
            IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () ->
                    registry.createCharacter("warrior", null)
            );
            
            assertTrue(exception.getMessage().contains("cannot be null"));
        }

        @Test
        @DisplayName("Should reject unknown prototype key")
        void shouldRejectUnknownPrototypeKey() {
            IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () ->
                    registry.createCharacter("unknown", "TestName")
            );
            
            assertTrue(exception.getMessage().contains("Prototype not found"));
        }

        @Test
        @DisplayName("Should reject null parameters in registration")
        void shouldRejectNullParametersInRegistration() {
            Warrior warrior = new Warrior("Test");
            
            IllegalArgumentException exception1 = assertThrows(IllegalArgumentException.class, () ->
                    registry.registerPrototype(null, warrior)
            );
            
            IllegalArgumentException exception2 = assertThrows(IllegalArgumentException.class, () ->
                    registry.registerPrototype("test", null)
            );
            
            assertTrue(exception1.getMessage().contains("cannot be null"));
            assertTrue(exception2.getMessage().contains("cannot be null"));
        }
    }

    @Nested
    @DisplayName("Specialized Character Tests")
    class SpecializedCharacterTests {

        @Test
        @DisplayName("Should create berserker variant")
        void shouldCreateBerserkerVariant() {
            GameCharacter berserker = registry.createCharacter("berserker", "Bjorn");
            
            assertEquals("Bjorn", berserker.getName());
            assertEquals(GameCharacter.CharacterClass.WARRIOR, berserker.getCharacterClass());
            assertEquals("Berserker", berserker.getAttribute("combatStyle"));
        }

        @Test
        @DisplayName("Should create elemental mage variants")
        void shouldCreateElementalMageVariants() {
            GameCharacter fireMage = registry.createCharacter("fire_mage", "Pyro");
            GameCharacter iceMage = registry.createCharacter("ice_mage", "Frost");
            
            assertEquals("Pyro", fireMage.getName());
            assertEquals("Frost", iceMage.getName());
            assertEquals(GameCharacter.CharacterClass.MAGE, fireMage.getCharacterClass());
            assertEquals(GameCharacter.CharacterClass.MAGE, iceMage.getCharacterClass());
            
            assertEquals("Pyromancy", fireMage.getAttribute("spellSchool"));
            assertEquals("Cryomancy", iceMage.getAttribute("spellSchool"));
        }

        @Test
        @DisplayName("Should create elite characters")
        void shouldCreateEliteCharacters() {
            GameCharacter eliteWarrior = registry.createCharacter("elite_warrior", "Champion");
            GameCharacter archmage = registry.createCharacter("archmage", "Merlin");
            
            assertTrue(eliteWarrior.getLevel() >= 15);
            assertTrue(archmage.getLevel() >= 20);
            
            // Elite characters should have better equipment
            assertNotEquals("Iron Sword", eliteWarrior.getEquipment().getWeapon());
            assertNotEquals("Wooden Staff", archmage.getEquipment().getWeapon());
        }
    }

    @Nested
    @DisplayName("Character Customization Tests")
    class CharacterCustomizationTests {

        @Test
        @DisplayName("Should allow character customization after creation")
        void shouldAllowCharacterCustomizationAfterCreation() {
            GameCharacter mage = registry.createCharacter("mage", "Apprentice");
            int originalLevel = mage.getLevel();
            
            // Customize the character
            mage.levelUpTo(15);
            mage.addSkill(new GameCharacter.Skill("Custom Spell", "A unique spell", 5));
            mage.getEquipment().setWeapon("Custom Staff");
            mage.setAttribute("customAttribute", "customValue");
            
            // Verify customizations
            assertEquals(15, mage.getLevel());
            assertTrue(mage.getLevel() > originalLevel);
            assertTrue(mage.getSkills().stream()
                    .anyMatch(skill -> "Custom Spell".equals(skill.getName())));
            assertEquals("Custom Staff", mage.getEquipment().getWeapon());
            assertEquals("customValue", mage.getAttribute("customAttribute"));
        }

        @Test
        @DisplayName("Should maintain prototype integrity after character customization")
        void shouldMaintainPrototypeIntegrityAfterCharacterCustomization() {
            // Create and customize a character
            GameCharacter mage1 = registry.createCharacter("mage", "Mage1");
            mage1.levelUpTo(20);
            mage1.getEquipment().setWeapon("Modified Staff");
            
            // Create another character from same prototype
            GameCharacter mage2 = registry.createCharacter("mage", "Mage2");
            
            // Second character should have original prototype values
            assertTrue(mage2.getLevel() < mage1.getLevel());
            assertNotEquals("Modified Staff", mage2.getEquipment().getWeapon());
        }
    }

    @Nested
    @DisplayName("Performance Tests")
    class PerformanceTests {

        @Test
        @DisplayName("Should demonstrate cloning performance benefit")
        void shouldDemonstrateCloningPerformanceBenefit() {
            // This test verifies that the performance demo runs without errors
            assertDoesNotThrow(() -> registry.demonstratePerformance());
        }

        @Test
        @DisplayName("Should handle mass character creation efficiently")
        void shouldHandleMassCharacterCreationEfficiently() {
            String[] names = new String[100];
            for (int i = 0; i < 100; i++) {
                names[i] = "Character" + i;
            }
            
            long startTime = System.nanoTime();
            GameCharacter[] characters = registry.createMultipleCharacters("warrior", names);
            long endTime = System.nanoTime();
            
            assertEquals(100, characters.length);
            
            // Should complete in reasonable time (less than 100ms for 100 characters)
            long durationMs = (endTime - startTime) / 1_000_000;
            assertTrue(durationMs < 100, "Mass creation took too long: " + durationMs + "ms");
            
            // Verify all characters are unique instances
            for (int i = 0; i < characters.length; i++) {
                assertEquals("Character" + i, characters[i].getName());
                for (int j = i + 1; j < characters.length; j++) {
                    assertNotSame(characters[i], characters[j]);
                }
            }
        }
    }

    @Nested
    @DisplayName("Registry State Management Tests")
    class RegistryStateManagementTests {

        @Test
        @DisplayName("Should clear all prototypes")
        void shouldClearAllPrototypes() {
            assertTrue(registry.getPrototypeCount() > 0);
            
            registry.clearPrototypes();
            
            assertEquals(0, registry.getPrototypeCount());
            assertTrue(registry.getAvailablePrototypes().isEmpty());
        }

        @Test
        @DisplayName("Should handle empty registry gracefully")
        void shouldHandleEmptyRegistryGracefully() {
            registry.clearPrototypes();
            
            assertFalse(registry.hasPrototype("warrior"));
            assertEquals(0, registry.getPrototypeCount());
            
            IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () ->
                    registry.createCharacter("warrior", "TestName")
            );
            
            assertTrue(exception.getMessage().contains("Prototype not found"));
        }

        @Test
        @DisplayName("Should handle case-insensitive prototype keys")
        void shouldHandleCaseInsensitivePrototypeKeys() {
            // The registry should handle case-insensitive keys
            assertTrue(registry.hasPrototype("WARRIOR"));
            assertTrue(registry.hasPrototype("Warrior"));
            assertTrue(registry.hasPrototype("warrior"));
            
            GameCharacter warrior1 = registry.createCharacter("WARRIOR", "Test1");
            GameCharacter warrior2 = registry.createCharacter("warrior", "Test2");
            
            assertEquals(GameCharacter.CharacterClass.WARRIOR, warrior1.getCharacterClass());
            assertEquals(GameCharacter.CharacterClass.WARRIOR, warrior2.getCharacterClass());
        }
    }
}
