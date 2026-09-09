# Creating First Item Modifier

Item Modifiers allow you to dynamically alter item properties, based on the holding player's race.

This guide walks you through creating, registering, configuring, and customizing your first item modifier in **JustRaces**.

::: important
Don't confuse with [Vanilla Minecraft's Item Modifiers](https://minecraft.wiki/w/Item_modifier)
:::

## Lifecycle Concepts: Apply & Undo

Every item modifier operates on a strict Apply / Undo dynamic lifecycle:
- `apply(ItemStack item)`: Invoked when an item enters the player's inventory, when picking up items, or when race traits are applied/reloaded.
- `undo(ItemStack item)`: Invoked when the item leaves the player's inventory (dropping, moving to a chest, changing races, or dying).

Because `undo()` triggers the exact moment an item leaves a player's possession, race-specific item properties cannot be smuggled or transferred to other players or different races.

::: tip resetData vs unsetData
When reverting changes in `undo()`, always prefer Paper's `item.resetData(...)` over `item.unsetData(...)`:
- `resetData(...)`: Restores the component to its default baseline state for that specific item type.
- `unsetData(...)`: Completely strips the component from the item entirely, which can break default item behaviors.
:::

## Creating the Item Modifer Class

To create a custom modifier, extend `BaseModifier` and implement your `apply` and `undo` methods.

```java
public class ExampleModifier extends BaseModifier {
    
    @Override
    public NamespacedKey getKey() {
        return new NamespacedKey("example", "test_modifier");
    }

    @Override
    public void apply(ItemStack item) {
        // Makes the item unbreakable while held by a player of this race
        item.setData(DataComponentTypes.UNBREAKABLE);
    }

    @Override
    public void undo(ItemStack item) {
        // Reverts unbreakable status when the item leaves the player's inventory
        item.resetData(DataComponentTypes.UNBREAKABLE);
    }
}
```

## Registering Item Modifier

Register your item modifier during plugin initialization before loading any race resources.

```java
public class ModifiersRegistry {

    public static void register() {
        registerModifier(new ExampleModifier());
    }

    private static void registerModifier(BaseModifier modifier) {
        JustRacesRegistries.MODIFIERS.register(modifier.getKey(), modifier);
    }
}
```

Then call your registry in your main plugin class:
```java
public final class ExampleAddon extends JavaPlugin {

    @Override
    public void onEnable() {
        ModifiersRegistry.register();
    }
}
```

## Merging Data Components

Instead of completely overwriting existing Data Components, `BaseModifier` provides the `mergeComponent` helper method. This allows you to append builder-based properties (such as custom consumable effects) without wiping the item's existing data.


```java
public class ExampleModifier extends BaseModifier {

    @Override
    public NamespacedKey getKey() {
        return new NamespacedKey("example", "test_modifier");
    }

    @Override
    public void apply(ItemStack item) {
        mergeComponent(item, DataComponentTypes.CONSUMABLE, getConsumable(), Consumable.consumable());
    }

    private static @NonNull Consumer<Consumable.Builder> getConsumable() {
        return builder -> builder
                .addEffect(ConsumeEffect.clearAllStatusEffects());
    }

    @Override
    public void undo(ItemStack item) {
        item.resetData(DataComponentTypes.CONSUMABLE);
    }
}
```

## Adding Item Modifier Configurations

To make your item modifier customizable via JSON instead of hardcoding values in Java Class, implement the `ItemModifierConfigurable` interface.

```java
public class ExampleModifier extends BaseModifier implements ItemModifierConfigurable {

    @Override
    public NamespacedKey getKey() {
        return new NamespacedKey("example", "test_modifier");
    }

    @Override
    public void apply(ItemStack item) {
        int maxStackSize = Math.clamp(getConfigInt("max_stack_size"), 1, 99);
        item.setData(DataComponentTypes.MAX_STACK_SIZE, maxStackSize);
    }

    @Override
    public void undo(ItemStack item) {
        item.resetData(DataComponentTypes.MAX_STACK_SIZE);
    }
}
```

### JSON Configuration File

Create a corresponding JSON file inside your plugin's `resources/modifiers/` folder matching your key namespace:

`resources/modifiers/test_modifier.json`
```json
{
    "max_stack_size": 16
}
```