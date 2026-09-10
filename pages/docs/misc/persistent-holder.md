# Persistent Holder

The `PersistentHolder` interface is a core utility in **JustRaces** designed to safely store custom persistent state inside a player's **PersistentDataContainer (PDC)**.

Instead of writing custom NBT keys directly into Paper's root PDC, **JustRaces** isolates all state variables into dedicated sub-containers.

---

## Why Use PersistentHolder?

Paper's native `PersistentDataContainer` allows storing custom data on entities, but saving variables directly to the root PDC leads to cluttered structures and potential key collisions between different plugins.

### Key Benefits

* **Clean Root Structure:** Keeps the player's root entity PDC completely clean.
* **Isolated Namespaces:** Encapsulates component data into designated plugin categories.
* **Nested Containers:** Supports complex data structures (including storing nested `PersistentDataContainer` instances inside parent containers).

---

## Storage Architecture

`PersistentHolder` is directly integrated into the base classes of all major components. Each category manages its own sub-container key:

| Component Category | Base Classes / Implementations | Parent PDC Sub-Container Key |
| :--- | :--- | :--- |
| **Abilities** | `BaseAbility` | `justraces:abilities` |
| **Traits** | `BaseTraitListener`, `BaseTraitRunnable` | `justraces:traits` |
| **Races** | `BaseRaceListener`, `BaseRaceRunnable` | `justraces:races` |

---

## Working with Data

Classes inheriting from `PersistentHolder` gain direct access to shorthand helper methods for data manipulation. 

Instead of dealing with raw Paper PDC types and `PersistentDataType` objects, you can read, write, and remove data directly:

* **Primitives & Basic Types:** Shorthands for `int`, `double`, `boolean`, `long`, `String`, etc.
* **Complex Objects:** Native support for `UUID`, `ItemStack[]` (inventories/kits), and `PersistentDataContainer` (nested NBT structures)

::: tip Check the API Interface
For the full list of supported data types and helper methods, check the `PersistentHolder` interface directly in the source code or IDE autocomplete.
:::

---

## Practical Example: Usage Counter

In this example, an ability tracks how many times a player has activated it. Once the counter reaches 10, the stored data resets automatically.

```java
package com.example.addon.ability;

import justjabka.justraces.api.abilities.generic.BaseAbility;
import justjabka.justraces.api.types.AbilityContext;
import org.bukkit.NamespacedKey;
import org.bukkit.entity.Player;

public class ExamplePersistentAbility extends BaseAbility {

    @Override
    public NamespacedKey getKey() {
        return new NamespacedKey("example", "test_persistent_ability");
    }

    @Override
    public long getCooldownTicks() {
        return 20L; // 1 second cooldown
    }

    @Override
    protected boolean onActivation(Player player, AbilityContext ctx) {
        // 1. Fetch current usage count from the player's ability container
        int useAmount = getContainerInt(player, getKey());

        if (useAmount >= 10) {
            // 2. Clear container data when limit is reached
            removeContainerData(player, getKey());
            player.sendMessage("Ability usage counter has been reset!");
        } else {
            // 3. Increment and save updated value
            useAmount++;
            setContainerInt(player, getKey(), useAmount);

            player.sendMessage("You have used this ability %s time(s).".formatted(useAmount));
        }

        return true;
    }
}
```

::: info NBT Storage Path
In the example above, the key `example:test_persistent_ability` is stored inside `BukkitValues."justraces:abilities"`, keeping it isolated from other plugins and root player data.
:::