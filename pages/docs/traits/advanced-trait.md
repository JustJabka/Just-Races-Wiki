# Advanced Trait

While standard traits use event listeners (`BaseTraitListener`) or tick-based runnables (`BaseTraitRunnable`), complex passive mechanics often require initial initialization and state cleanup when a race or trait is changed.

To handle state lifecycle seamlessly without relying on manual event handling, **JustRaces** provides the `ResettableTrait` interface.

---

## State Lifecycle (`ResettableTrait`)

Unlike abilities, traits are straightforward: **a player either has the trait active, or they don't**. There are no complex cooldowns, durations, or execute reasons. 

`ResettableTrait` ensures your trait logic applies **immediately** upon receiving the race (or transient trait) and cleans itself up properly when removed.

```java
public interface ResettableTrait {

    /**
     * Called immediately when the trait is applied to the player 
     * (e.g., race change, transient trait grant).
     */
    default void applyState(Player player) {}

    /**
     * Called when the trait is removed or reset from the player.
     */
    void resetState(UUID pid);

    default void resetState(Player player) {
        if (player == null) return;
        resetState(player.getUniqueId());
    }
}

```

---

## Why Use `applyState()`?

Without `applyState()`, event-driven traits would force players to wait for a specific trigger event (such as changing armor or switching slots) before their passive effect applies.

`applyState()` acts as an immediate initialization hook. It allows you to run your state logic instantly upon trait assignment, ensuring zero delay in passive attribute calculation.

::: tip Lifecycle Integration

* **`applyState(Player)`** is called by the core framework immediately when a player receives the trait.
* **`resetState(UUID)`** behaves similarly to [`ResettableAbility#resetState()`](../abilities/advanced-ability.md#state-cleanup--resettable-abilities), but without reason.
:::

---

## Example: Bound Shell Trait

The following example grants bonus `MAX_HEALTH` equal to the player's current total armor points.

Using `applyState()`, the bonus applies instantly when the race is assigned. Using `resetState()`, the attribute modifier is safely removed when the player loses the trait.

```java
public class BoundShellTrait extends BaseTraitListener implements ResettableTrait {

    @Override
    public NamespacedKey getKey() {
        return new NamespacedKey("example", "bound_shell");
    }

    // Trigger update on equipment change
    @EventHandler(ignoreCancelled = true)
    public void onArmorChange(EntityEquipmentChangedEvent event) {
        if (!(event.getEntity() instanceof Player player)) return;
        if (!isRequiredTrait(player)) return;

        applyBoundShellBonus(player);
    }

    // Immediate initial calculation on race assignment
    @Override
    public void applyState(Player player) {
        applyBoundShellBonus(player);
    }

    // Cleanup when trait is removed
    @Override
    public void resetState(UUID pid) {
        Player player = Bukkit.getPlayer(pid);
        if (player == null) return;

        AttributeInstance maxHealthInstance = player.getAttribute(Attribute.MAX_HEALTH);
        if (maxHealthInstance == null) return;

        maxHealthInstance.removeModifier(getKey());
    }

    private void applyBoundShellBonus(Player player) {
        AttributeInstance maxHealthInstance = player.getAttribute(Attribute.MAX_HEALTH);
        AttributeInstance armorInstance = player.getAttribute(Attribute.ARMOR);

        if (maxHealthInstance == null || armorInstance == null) return;

        double armorValue = armorInstance.getValue();

        // Clear existing modifier before applying updated value
        maxHealthInstance.removeModifier(getKey());

        if (armorValue <= 0) return;

        AttributeModifier modifier = new AttributeModifier(
                getKey(),
                armorValue,
                AttributeModifier.Operation.ADD_NUMBER
        );
        maxHealthInstance.addModifier(modifier);
    }
}

```