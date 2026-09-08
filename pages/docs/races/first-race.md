# Race Definition

A **Race** in JustRaces is defined using a JSON format. You can configure attributes, bind unique abilities, apply item modifiers, and toggle visibility for player menus.

::: tip Optional Fields
Every field in the Race Definition is **optional**. Unspecified fields will simply fall back to default Minecraft behavior or remain empty, so you don't need to bloat your JSON with empty objects or arrays.
:::

## Specification Reference

| Field | Type | Description |
| --- | --- | --- |
| `name` | `Component` | Display name of the race (also supports raw text objects). |
| `description` | `List<Component>` | Multi-line lore shown in race-selection screen. |
| `attributes` | `Map<Attribute, Double>` | Vanilla or custom attribute modifiers applied while playing as this race. |
| `abilities` | `Set<AbilityBinding>` | Active abilities mapped to keys or triggers. |
| `traits` | `Set<Trait>` | Passive mechanics. |
| `item_modifiers` | `Map<BaseModifier, KeySelector>` | Special item properties that only works with this race (supports single items, item tags, or arrays). |
| `hidden` | `Boolean` | If `true`, hides the race from race-selection screen (default: `false`). |
| `config` | `Map<String, Object>` | Custom key-value store for addon-specific race configuration. |

---

## Creating Your First Race

Place your JSON file inside your server's data folder:

`plugins/JustRaces/races/<namespace>/my_race.json`

### Example Race JSON

```json
{
  "name": {
    "text": "Example Hero"
  },
  "description": [
    "A sturdy warrior built for close combat.",
    "Higher health, but naturally hits heavier."
  ],
  "attributes": {
    "minecraft:max_health": 26,
    "minecraft:attack_damage": 2.0
  },
  "abilities": [
    "example:some_ability"
  ],
  "traits": [
    "example:some_trait"
  ],
  "item_modifiers": {
    "example:some_modifier_for_item": "#minecraft:logs",
    "example:some_modifier_for_item_tag": "#minecraft:arrows",
    "example:some_modifier_for_items_list": [
      "minecraft:diamond",
      "minecraft:iron_ingot"
    ]
  },
  "hidden": false,
  "config": {
    "custom_setting": 100
  }
}

```

::: details How Item Modifiers Selectors Work
In `item_modifiers`, JustRaces accepts flexibility in material targeting:

* **Item Tag:** `"#minecraft:logs"` (targets all items under the `logs` vanilla item tag).
* **Single Item:** `"minecraft:diamond"` (targets a specific item).
* **List of Items:** `["minecraft:diamond", "minecraft:iron_ingot"]` (targets multiple explicit materials).
:::

### Manual Testing

Once your `.json` file is in place, reload the framework using the in-game or console command:

```bash
/justraces reload

```

---

## Registering Races via Java Addon

If you are developing a standalone Paper plugin/addon, you shouldn't force server administrators to manually extract and place JSON files.

JustRaces provides a built-in `ResourceManager` helper to automatically copy and synchronize bundled race files upon plugin enablement.

### Step 1: File Structure

Place your race JSON files inside your plugin's resources folder:

```text
my-addon/
└── src/
    └── main/
        └── resources/
            └── races/
                └── my_race.json

```

### Step 2: Register in Plugin Lifecycle

Call `ResourceManager.registerRacesFromPlugin()` inside your `onEnable()` method:

```java{10-12}
package com.example.addon;

import justjabka.JustRaces.Managers.ResourceManager;
import org.bukkit.plugin.java.JavaPlugin;

public final class ExampleAddon extends JavaPlugin {

    @Override
    public void onEnable() {
        // Copies bundled races from resources/races/ 
        // to plugins/JustRaces/races/<your-plugin-namespace>/
        ResourceManager.registerRacesFromPlugin(this);
    }
}

```

::: info Synchronization Logic
This method checks for new bundled races during server startup and safely extracts them into the global `JustRaces` configuration folder without overwriting existing administrator overrides.
:::