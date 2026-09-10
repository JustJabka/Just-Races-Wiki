# Advanced Race

While standard JSON definitions handle attributes and basic bindings, JustRaces provides advanced capabilities for complex mechanics. This includes inline trigger overrides, conflict resolution, and direct Java bindings for custom race logic.

---

## Code-Driven Logic (Java API)

For mechanics that go beyond JSON capabilities, such as passive tick loops or complex event handling tied exclusively to a specific race - JustRaces provides a code-first architecture via `BaseRaceRunnable` and `BaseRaceListener`.

### 1. Passive Tick Loops (`BaseRaceRunnable`)

Use `BaseRaceRunnable` to execute periodic logic specifically for online players belonging to a registered race.

```java
package com.example.addon.runnable;

import justjabka.justraces.api.runnables.generic.BaseRaceRunnable;
import org.bukkit.NamespacedKey;
import org.bukkit.entity.Player;

public class ExampleRaceRunnable extends BaseRaceRunnable {

    @Override
    public NamespacedKey getKey() {
        return new NamespacedKey("example", "test_race");
    }

    @Override
    public void onTick(Player player) {
        player.sendMessage("Tick");
    }
}
```

::: note
Use of `isRequiredRace(Player)` in the `onTick(Player)` is reduntand because it already filters players under the hood.
:::

### 2. Custom Race Events (`BaseRaceListener`)

```java{20}
package com.example.addon.listener;

import com.destroystokyo.paper.event.player.PlayerJumpEvent;
import justjabka.justraces.api.listeners.generic.BaseRaceListener;
import org.bukkit.NamespacedKey;
import org.bukkit.entity.Player;
import org.bukkit.event.EventHandler;

public class ExampleRaceListener extends BaseRaceListener {
    
    @Override
    public NamespacedKey getKey() {
        return new NamespacedKey("example", "test_race");
    }
    
    @EventHandler(ignoreCancelled = true)
    public void onJump(PlayerJumpEvent event) {
        Player player = event.getPlayer();
        
        if (isRequiredRace(player)) {
            player.sendMessage("I jumped with test race!");
        }
    }
}
```

::: note
Use `isRequiredRace(Player)` to exactly know that event is envolving a player with right race
:::

---

## Registering Custom Components

To activate your custom listeners and runnables, register them during plugin initialization:

```java
@Override
public void onEnable() {
    // Register custom race task (runs every 10 ticks)
    new ExampleRaceRunnable().runTaskTimer(this, 0L, 10L);

    // Register custom race listener
    getServer().getPluginManager().registerEvents(new ExampleRaceListener(), this);
}

```

---

## Inline Configuration & Triggers

Instead of relying only on predefined ability defaults or config, you can inline and override configuration directly inside the race JSON.

Currently, **Abilities** support inline definitions for triggers and execution conditions:

```json
{
  "abilities": [
    {
      "id": "justracesshowcase:damage_inversion",
      "trigger": "left_click",
      "conditions": [
        "empty_hand",
        "is_sneaking"
      ]
    },
    "justracesshowcase:ecdysis"
  ]
}

```

::: tip Dynamic Overrides & Conflict Resolution
Inline configuration is the primary way to **resolve trigger conflicts**. If two abilities on the same race share a default activation input (e.g., both trigger on `offhand_swap`), you can rebind one inline to `left_click` without modifying the underlying ability source code or changing global config (could've led to even bigger conflicts).
:::

::: info Future Roadmap
In upcoming updates, inline configuration will be expanded to support **all** race components (traits and item modifiers), allowing deep per-race tinkering without breaking changing configs.
:::