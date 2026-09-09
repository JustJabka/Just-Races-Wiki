# Creating Your First Trait

Traits represent passive race capabilities, passive debuffs, or ongoing background effects.

This guide walks you through creating, registering, configuring, and customizing your first trait in **JustRaces**.

---

## Trait Types

When creating a trait, you can choose between two base classes depending on how your logic should be executed:

| Trait Type | Base Class | Best Used For |
| :--- | :--- | :--- |
| **Listener Trait** | `BaseTraitListener` | Reactive logic triggered by Bukkit/Paper events (e.g., damage modifications, elemental immunities). |
| **Runnable Trait** | `BaseTraitRunnable` | Continuous background tasks running on a set tick interval (e.g., periodic regeneration, environmental damage, ambient particles). |

---

## Creating the Trait Class

### Listener Trait (`BaseTraitListener`)

`BaseTraitListener` automatically implements Bukkit's `Listener` interface. You can declare `@EventHandler` methods directly inside your trait class.

```java
public class ExampleListenerTrait extends BaseTraitListener {

    @Override
    public NamespacedKey getKey() {
        return new NamespacedKey("example", "test_listener_trait");
    }

    @EventHandler(ignoreCancelled = true)
    public void onDamage(EntityDamageEvent event) {
        if (!(event.getEntity() instanceof Player player)) return;
        if (!isRequiredTrait(player)) return;

        double damage = event.getDamage();
        EntityDamageEvent.DamageCause cause = event.getCause();
        
        if (cause != EntityDamageEvent.DamageCause.MAGIC) return;

        event.setDamage(damage * 1.5);
    }
}
```

::: note
Use `isRequiredTrait(Player)` to exactly know that event is envolving a player with right trait
:::

### Runnable Trait (`BaseTraitRunnable`)

`BaseTraitRunnable` executes code periodically for every player who has the trait.

Приклад:
```java
public class ExampleRunnableTrait extends BaseTraitRunnable {

    @Override
    public long getTickPeriod() {
        return 4 * 20;
    }

    @Override
    public NamespacedKey getKey() {
        return new NamespacedKey("example", "test_runnable_trait");
    }

    @Override
    public void onTick(Player player) {
        player.setFireTicks(100);
    }
}
```

::: note
Use of `isRequiredTrait(Player)` in the `onTick(Player)` is reduntand because it already filters players under the hood.
:::

## Registering Trait

Register your trait during plugin initialization before loading any race resources.

```java
public class TraitsRegistry {

    public static void register() {
        registerTrait(new ExampleListenerTrait());
        registerTrait(new ExampleRunnableTrait());
    }

    private static void registerTrait(Trait trait) {
        JustRacesRegistries.TRAITS.register(trait.getKey(), trait);
    }
}
```

Then call your registry in your main plugin class:
```java
public final class ExampleAddon extends JavaPlugin {

    @Override
    public void onEnable() {
        TraitsRegistry.register();
    }
}
```

## Adding Trait Configurations

To make your trait customizable via JSON instead of hardcoding values in Java Class, implement the `TraitConfigurable` interface.

```java
public class ExampleListenerTrait extends BaseTraitListener implements TraitConfigurable {

    @Override
    public NamespacedKey getKey() {
        return new NamespacedKey("example", "test_listener_trait");
    }

    @EventHandler(ignoreCancelled = true)
    public void onDamage(EntityDamageEvent event) {
        if (!(event.getEntity() instanceof Player player)) return;
        if (!isRequiredTrait(player)) return;

        double damage = event.getDamage();
        EntityDamageEvent.DamageCause cause = event.getCause();
        
        if (cause != EntityDamageEvent.DamageCause.MAGIC) return;

        double damageMultiplier = getConfigDouble("damage_multiplier");
        event.setDamage(damage * damageMultiplier);
    }
}
```

### JSON Configuration File

Create a corresponding JSON file inside your plugin's `resources/traits/` folder matching your key namespace:

`resources/traits/test_listener_trait.json`
```json
{
    "damage_multiplier": 1.5
}
```
