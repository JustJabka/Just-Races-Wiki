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