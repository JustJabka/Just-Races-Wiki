# Creating Your First Ability

This guide walks you through creating, registering, configuring, and customizing your first ability in **JustRaces**.

---

## Creating the Ability Class

To build a basic ability, extend `BaseAbility` and define its default attributes, inputs, and execution logic.

```java
package com.example.addon.ability;

import justjabka.justraces.api.abilities.generic.BaseAbility;
import justjabka.justraces.api.types.AbilityContext;
import justjabka.justraces.api.types.Trigger;
import justjabka.justraces.api.types.TriggerCondition;
import org.bukkit.Location;
import org.bukkit.NamespacedKey;
import org.bukkit.entity.Player;
import org.bukkit.util.Vector;

import java.util.Set;

public class ExampleAbility extends BaseAbility {
    private static final double DASH_STRENGTH = 1.5;

    @Override
    public NamespacedKey getKey() {
        return new NamespacedKey("example", "test_ability");
    }

    @Override
    public long getCooldownTicks() {
        return 5 * 20; // 5 seconds * 20 ticks = 100 ticks
    }

    @Override
    public Trigger getDefaultTrigger() {
        return Trigger.SNEAK_TOGGLE;
    }

    @Override
    public Set<TriggerCondition> getDefaultTriggerConditions() {
        return Set.of(TriggerCondition.EMPTY_HAND);
    }

    @Override
    protected boolean canActivate(Player player) {
        // Prevent activation if the player is in liquids
        return !player.isInWater() && !player.isInLava();
    }

    @Override
    protected boolean onActivation(Player player, AbilityContext ctx) {
        Location eyeLocation = player.getEyeLocation();
        Vector lookDirection = eyeLocation.getDirection().normalize().clone();

        Vector dashVector = lookDirection.multiply(DASH_STRENGTH);
        dashVector.setY(dashVector.getY() + 0.35); // Small vertical boost to bypass ground drag

        player.setVelocity(dashVector);
        return true;
    }
}
```

::: note Triggers vs. canActivate()
- Triggers & Conditions: Determine player intent (e.g., keybinds, physical clicks, empty hand state).
- canActivate(): Handles gameplay requirements (e.g., checking mana, health, or environmental states).
:::

::: tip
If canActivate() returns false, the execution cancels immediately without triggering a cooldown.
:::

## Registering Ability

Register your ability during plugin initialization before loading any race resources.

```java
package com.example.addon.registry;

import com.example.addon.ability.ExampleAbility;
import justjabka.justraces.api.abilities.generic.BaseAbility;
import justjabka.justraces.api.JustRacesRegistries;
import org.jetbrains.annotations.NotNull;

public class AbilitiesRegistry {

    public static void register() {
        registerAbility(new ExampleAbility());
    }

    private static void registerAbility(@NotNull BaseAbility ability) {
        JustRacesRegistries.ABILITIES.register(ability.getKey(), ability);
    }
}
```

Then call your registry in your main plugin class:
```java
public final class ExampleAddon extends JavaPlugin {

    @Override
    public void onEnable() {
        AbilitiesRegistry.register();
    }
}
```

## Adding Ability Configurations

To make your ability customizable via JSON instead of hardcoding values in Java Class, implement the `AbilityConfigurable` interface.

```java
package com.example.addon.ability;

import justjabka.justraces.api.abilities.generic.BaseAbility;
import justjabka.justraces.api.interfaces.configurable.AbilityConfigurable;
import justjabka.justraces.api.types.AbilityContext;
import org.bukkit.Location;
import org.bukkit.NamespacedKey;
import org.bukkit.entity.Player;
import org.bukkit.util.Vector;

public class ExampleAbility extends BaseAbility implements AbilityConfigurable {

    // ...

    @Override
    public long getCooldownTicks() {
        // Retrieves the "cooldown" key from the JSON configuration.
        // You can also use getConfigLong(path...) for specific paths.
        return getConfigCooldown();
    }

    @Override
    protected boolean onActivation(Player player, AbilityContext ctx) {
        Location eyeLocation = player.getEyeLocation();
        Vector lookDirection = eyeLocation.getDirection().normalize().clone();

        // Pass separate arguments for nested JSON properties instead of dot notation
        double dashStrength = getConfigDouble("dash", "strength");
        double additionalY = getConfigDouble("jump_strength");

        Vector dashVector = lookDirection.multiply(dashStrength);
        dashVector.setY(dashVector.getY() + additionalY);

        player.setVelocity(dashVector);
        return true;
    }

    // ...
}
```

### JSON Configuration File

Create a corresponding JSON file inside your plugin resources directory at abilities/:
```json
{
  "cooldown": 100,
  "dash": {
    "strength": 1.5
  },
  "jump_strength": 0.35
}
```

## Configuring the Cooldown Bar

The Cooldown Bar displays active ability cooldowns via a BossBar interface. You can distinguish abilities by customizing both their color and icon.

By default, the bar uses a `WHITE` color and a `MISSINGNO` icon (a black and pink square).

![Default Cooldown Bar](/assets/cooldown_bar.png)

Override `getCooldownBarColor(Player)` and `getCooldownBarIcon(Player)` to change them:
```java
public class ExampleAbility extends BaseAbility {
    // ...

    @Override
    public BossBar.Color getCooldownBarColor(Player player) {
        return BossBar.Color.BLUE;
    }
    
    @Override
    public Component getCooldownBarIcon(Player player) {
        return Component.text("⭐");
    }

    // ...
}
```

### Custom Icons & Font Objects

Standard emojis or characters might appear vertically misaligned inside the BossBar. Because vanilla Minecraft doesn't support vertical text offsets directly, you can route your icon through a custom font resource pack.

1. Create a custom font definition for a `9x9` sprite with `ascent: 0` and `height: 9`.
2. Reference the resource pack in your Ability Class:

[Example resourcepack that is used in showcase addon](https://github.com/JustJabka/Just-Races-Resourcepack/blob/main/assets/justracesshowcase/font/cooldown_bar.json)

```java
@Override
public Component getCooldownBarIcon(Player player) {
    return Component.text("\uE000").font(Key.key("example", "cooldown_bar"));
}
```

### Dynamic Cooldown Bars

Because both visual methods receive the `Player` instance, you can dynamically adjust the UI based on real-time gameplay state (e.g., resource availability):
``` java
@Override
public BossBar.Color getCooldownBarColor(Player player) {
    boolean hasEnoughMana = getPlayerMana(player) >= 25;
    return hasEnoughMana ? BossBar.Color.GREEN : BossBar.Color.RED;
}
```

