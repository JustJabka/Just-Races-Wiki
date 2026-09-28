# Race Definition

A **Race** in JustRaces is defined using a JSON format. You can configure attributes, bind unique abilities, apply item modifiers, and toggle visibility for player menus.

::: tip Optional Fields
Every field in the Race Definition is **optional**. Unspecified fields will simply fallback to default Minecraft behavior or remain empty, so you don't need to bloat your JSON with empty objects or arrays.
:::

## Specification Reference

| Field | Type | Description |
| --- | --- | --- |
| `name` | `Component` | Display name of the race (also supports raw text objects). |
| `description` | `List<Component>` | Multi-line lore shown in race-selection screen. |
| `icon` | `Component` | Icon shown in race-selection screen. |
| `attributes` | `Set<AttributeEntry>` | Vanilla or custom attribute modifiers/base value applied while playing as this race. |
| `abilities` | `Set<AbilityEntry>` | Active abilities mapped to triggers and conditions. |
| `traits` | `Set<Trait>` | Passive mechanics. |
| `item_modifiers` | `Set<ItemModifierEntry>` | Special item properties that only works with this race (supports single items, item tags, or arrays). |
| `recipes` | `Set<CraftingRecipe>` | Recipes that only this race can craft. |
| `hidden` | `Boolean` | If `true`, hides the race from race-selection screen (default: `false`). |