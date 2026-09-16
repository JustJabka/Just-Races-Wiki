# Advanced Race

Although Race Definition is pretty simple, it has a few advanced tricks that are good to know.

---

## Ability Override

Instead of relying only on predefined ability defaults or config, you can override ability triggers and conditions directly inside the Race Definition.

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

::: note
Both fields (trigger and conditions) are optional, allowing you to change only one of them without needing to modify both.
:::

::: tip
Inline configuration is the primary way to **resolve trigger conflicts**. If two abilities on the same race share a default activation input (e.g., both trigger on `offhand_swap`), you can rebind one inline to `left_click` without modifying the underlying ability source code or changing global config (could've led to even bigger conflicts).
:::

## Attributes

The `attributes` field supports two different types of attribute change: Setting [Base Values](https://minecraft.wiki/w/Attribute) and Applying [Attribute Modifiers](https://minecraft.wiki/w/Attribute#Modifiers).

| Operation	| Description |
| --- | --- |
| - | Directly overrides the base value of the attribute. |
| `add_number` | Adds a fixed number directly to the base value. |
| `add_scalar` | Multiplies the base value by the specified scalar. |
| `multiply_scalar_1` |	Multiplies the value incrementally after all additive modifiers are applied. |

```json
{
  "attributes": [
    {
      "id": "minecraft:max_health",
      "amount": 26
    },
    {
      "id": "minecraft:attack_damage",
      "amount": 3,
      "operation": "add_number"
    },
    {
      "id": "minecraft:fall_damage_multiplier",
      "amount": -0.5,
      "operation": "add_scalar"
    },
    {
      "id": "minecraft:movement_speed",
      "amount": 0.1,
      "operation": "multiply_scalar_1"
    }
  ]
}
```