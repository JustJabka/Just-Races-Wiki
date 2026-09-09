# Advanced Item Modifier

While `BaseModifier` is great for general item component changes, **JustRaces** provides specialized base classes for common complex item mechanics: altering food properties and modifying equipment attribute modifiers.

---

## Food & Consumable Modifier (`BaseFoodModifier`)

The `BaseFoodModifier` allows a race to modify how items function as food or consumables (e.g., making non-edible items edible, tweaking nutrition/saturation values, or adding consumption cooldowns).

It automatically handles merging and resetting `FOOD`, `CONSUMABLE`, and `USE_COOLDOWN` Data Components.

### Key Methods

| Method | Return Type | Description |
| :--- | :--- | :--- |
| `getFoodProperties()` | `@Nullable Consumer<FoodProperties.Builder>` | Configures nutrition, saturation, and eating mechanics. Return `null` to ignore. |
| `getConsumable()` | `@Nullable Consumer<Consumable.Builder>` | Configures consume animation, sounds, and potion/status effects upon eating. Return `null` to ignore. |
| `getUseCooldown()` | `@Nullable UseCooldown` | Applies an item usage cooldown after consuming. Return `null` to ignore. |

### Example: Custom Food Values

Makes any item assigned to this modifier grant 10 nutrition points and 4.5 saturation:

```java
public class ExampleFoodModifier extends BaseFoodModifier {

    @Override
    public NamespacedKey getKey() {
        return new NamespacedKey("example", "test_food_modifier");
    }

    @Override
    public @Nullable Consumer<FoodProperties.Builder> getFoodProperties() {
        return builder -> builder
                .nutrition(10)
                .saturation(4.5f);
    }

    @Override
    public @Nullable Consumer<Consumable.Builder> getConsumable() {
        return null; // Keep vanilla consume behavior
    }

    @Override
    public @Nullable UseCooldown getUseCooldown() {
        return null; // No usage cooldown
    }
}

```

---

## Armor & Equipment Attribute Modifier (`BaseArmorModifier`)

The `BaseArmorModifier` simplifies adding custom entity attributes (like bonus health, movement speed, or armor toughness) to equipment items while preserving their original vanilla attributes and slot group contexts.

It automatically resolves target equipment slot groups (helmet, chestplate, leggings, boots) from the item's `EQUIPPABLE` data component and creates dynamic keys to prevent duplicate modifier bugs.

### Key Methods

| Method | Return Type | Description |
| --- | --- | --- |
| `getAttribute()` | `Attribute` | Target Minecraft attribute (e.g., `Attribute.MOVEMENT_SPEED`, `Attribute.MAX_HEALTH`). |
| `getAttributeAmount()` | `double` | Modifier numerical value. |
| `getAttributeOperation()` | `AttributeModifier.Operation` | Operation type (`ADD_NUMBER`, `ADD_SCALED_MULTIPLICATIVE`, `MULTIPLICATIVE_SCALAR_1`). |

### Example: Speed Boosting Armor

Applies a flat movement speed boost (+0.02) to any armor piece held or equipped by players of this race:

```java
public class ExampleArmorModifier extends BaseArmorModifier {

    @Override
    public NamespacedKey getKey() {
        return new NamespacedKey("example", "test_armor_modifier");
    }

    @Override
    public Attribute getAttribute() {
        return Attribute.MOVEMENT_SPEED;
    }

    @Override
    public double getAttributeAmount() {
        return 0.02; // Adds +0.02 base movement speed
    }

    @Override
    public AttributeModifier.Operation getAttributeOperation() {
        return AttributeModifier.Operation.ADD_NUMBER;
    }
}

```

::: tip Slot Group Isolation
`BaseArmorModifier` automatically queries Paper's `EQUIPPABLE` component on the item to determine the exact `EquipmentSlotGroup`. This ensures attribute modifiers apply correctly depending on whether the item is a helmet, chestplate, leggings or boot piece.
:::