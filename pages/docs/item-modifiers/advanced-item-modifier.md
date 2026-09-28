# Advanced Item Modifier

While `BaseItemModifier` is great for general item component changes, **JustRaces** provides specialized base classes for common complex item mechanics: altering food properties and modifying equipment attribute modifiers.

---

## Food & Consumable Modifier (`BaseFoodItemModifier`)

The `BaseFoodItemModifier` allows a race to modify how items function as food or consumables (e.g., making non-edible items edible, tweaking nutrition/saturation values, or adding consumption cooldowns).

It automatically handles merging and resetting `FOOD`, `CONSUMABLE`, and `USE_COOLDOWN` Data Components.

### Key Methods

| Method | Return Type | Description |
| :--- | :--- | :--- |
| `foodProperties()` | `Consumer<FoodProperties.Builder>` | Configures nutrition, saturation, and eating mechanics. Return `null` to ignore. |
| `consumable()` | `Consumer<Consumable.Builder>` | Configures consume animation, sounds, and potion/status effects upon eating. Return `null` to ignore. |
| `useCooldown()` | `UseCooldown` | Applies an item usage cooldown after consuming. Return `null` to ignore. |

### Example: Custom Food Values

Makes any item assigned to this modifier grant 10 nutrition points and 4.5 saturation:

```java
public class ExampleFoodModifier extends BaseFoodItemModifier {

    @Override
    public NamespacedKey getKey() {
        return new NamespacedKey("example", "test_food_modifier");
    }

    @Override
    public @Nullable Consumer<FoodProperties.Builder> foodProperties() {
        return builder -> builder
                .nutrition(10)
                .saturation(4.5f);
    }

    @Override
    public @Nullable Consumer<Consumable.Builder> consumable() {
        return null; // Keep vanilla consume behavior
    }

    @Override
    public @Nullable UseCooldown useCooldown() {
        return null; // No usage cooldown
    }
}
```

---

## Armor & Equipment Attribute Modifier (`BaseArmorItemModifier`)

The `BaseArmorItemModifier` simplifies adding custom entity attributes (like bonus health, movement speed, or armor toughness) to equipment items while preserving their original vanilla attributes and slot group contexts.

### Key Methods

| Method | Return Type | Description |
| --- | --- | --- |
| `attributeModifier()` | `UnkeyedAttributeModifier` | Same as `AttributeModifier`, but without a key (because it generates automatically). Return `null` to ignore. |
| `equippable()` | `Consumer<Equippable.Builder>` | Configures equipment properties. Return `null` to ignore. |
| `equippableSlotFallBack()` | `EquipmentSlot` | Fallback Equipment Slot for items that has not Equippable component. Return `null` to ignore. |

### Example: Speed Boosting Armor

Applies a flat movement speed boost (+0.02) to any armor piece equipped by players of this race:

```java
public class ExampleArmorModifier extends BaseArmorItemModifier {

    @Override
    public NamespacedKey getKey() {
        return new NamespacedKey("example", "test_armor_modifier");
    }

    @Override
    public @Nullable UnkeyedAttributeModifier attributeModifier() {
        return new UnkeyedAttributeModifier(
                Attribute.MOVEMENT_SPEED,
                0.02, // Adds +0.02 base movement speed
                AttributeModifier.Operation.ADD_NUMBER
        );
    }

    @Override
    public @Nullable Consumer<Equippable.Builder> equippable() {
        return builder -> builder.equipSound(Registry.SOUNDS.getKey(Sound.ENTITY_ITEM_BREAK));
    }

    @Override
    public @NotNull EquipmentSlot equippableSlotFallBack() {
        return EquipmentSlot.HEAD;
    }
}
```