# Advanced Ability

While basic abilities use `BaseAbility` for quick actions, complex traits (like passive toggles, lingering effects, or periodic tasks) require precise state management. 

**JustRaces** provides a set of modular interfaces to make state handling, automatic cleanup, and custom triggers consistent across all addons.

---

## Lifecycle Concepts: Who Calls What?

To keep the core system lightweight and flexible, **JustRaces** follows a simple design rule for advanced interfaces:

::: info Core Rule
1. **Core-driven cleanup:** The core plugin *automatically* calls `ResettableAbility.resetState()` on system events (`DEATH`, `QUIT`, `RACE_CHANGE`).
2. **Developer-driven logic:** Lifecycle triggers like `onExpire()` or `createRunnable()` are utility contracts. **You control when to run or schedule them** inside your ability logic.
:::

---

## State Cleanup & Resettable Abilities

Any ability that leaves lingering tasks, custom potion effects, or attribute modifiers **must** implement `ResettableAbility` (or inherit it via `TogglableAbility` / `DurationAbility`).

### ResettableAbility Interface

```java
public interface ResettableAbility {
    enum Reason {
        QUIT,         // Player disconnected
        DEATH,        // Player died
        RACE_CHANGE,  // Player changed race
        ABILITY_END,  // Natural lifecycle end
        CUSTOM        // Manual reset
    }

    void resetState(UUID pid, Reason reason);
}

```

When a player dies or quits, **JustRaces** triggers `resetState(UUID, Reason)` automatically. Inside this method, you should clean up all active tasks, custom attributes, or metadata.

---

## Toggleable Abilities (`TogglableAbility`)

For abilities that act as active toggles (e.g., stance switches, aura toggles, or armor-dependent modes), extend `TogglableAbility`.

`TogglableAbility` extends `BaseAbility`, implements `ValidationAbility`, and `ResettableAbility` out of the box.

1. **Check Validity with isStateValid():**
Override `isStateValid(Player)` to enforce conditions required for the state to stay active (e.g., holding a specific weapon or wearing a full Leather armor set).


2. **Listen for Inventory/State Changes:**
Add Bukkit `@EventHandler` annotations directly inside your ability class to catch state changes (like taking armor off) and trigger disable(player) immediately.


3. **Handle Visual Effects in onToggle():**
Use `onToggle(Player player, boolean newState)` to execute visual cues like playing sounds, particles, or updating BossBars.


### Example: Damage Inversion Stance

This example toggles a stance that flips incoming damage values, provided the player maintains full **Leather Armor**.

```java
public class DamageInversionAbility extends TogglableAbility implements AbilityConfigurable {

    @Override
    public NamespacedKey getKey() {
        return new NamespacedKey("example", "damage_inversion");
    }

    @Override
    protected boolean canActivate(Player player) {
        return ArmorManager.getArmorSet(player) == ArmorSet.LEATHER;
    }

    // Ensures ability automatically disables if player removes leather armor
    @Override
    public boolean isStateValid(Player player) {
        return ArmorManager.getArmorSet(player) == ArmorSet.LEATHER;
    }

    @Override
    protected boolean onActivation(Player player, AbilityContext ctx) {
        toggle(player); // Toggles state in PersistentHolder & calls onToggle
        return true;
    }

    @Override
    public void onToggle(Player player, boolean active) {
        Sound sound = active ? Sound.BLOCK_CANDLE_EXTINGUISH : Sound.BLOCK_CANDLE_AMPLIFY;
        player.getWorld().playSound(player.getLocation(), sound, SoundCategory.PLAYERS, 1f, 1f);
    }

    @EventHandler(ignoreCancelled = true)
    public void onArmorChange(EntityEquipmentChangedEvent event) {
        if (!(event.getEntity() instanceof Player player)) return;
        if (!getContainerBoolean(player, getKey())) return;

        // Auto-disable if validity check fails on armor swap
        if (!isStateValid(player)) {
            disable(player);
        }
    }
}

```

---

## Recurring Actions (`RunnableAbility`)

If your ability spawns particles, scans the area, or applies continuous effects every few ticks, implement `RunnableAbility`.

```java
public interface RunnableAbility extends ResettableAbility {
    BukkitRunnable createRunnable(Player player);
}

```

::: tip Managing Active Tasks
Store active `BukkitTask` references inside a `Map<UUID, BukkitTask>` so you can cancel them cleanly inside `resetState()`.
:::

### Example: Slime Trail

Spawns slowness clouds behind the player as they move across the floor while active:

```java
public class SlimeTrailAbility extends BaseAbility implements DurationAbility, RunnableAbility {

    private final Map<UUID, BukkitTask> activeTrails = new ConcurrentHashMap<>();

    // ...

    @Override
    public long getDurationTicks() {
        return 200L; // 10 seconds
    }

    @Override
    protected boolean onActivation(Player player, AbilityContext ctx) {
        // Start the task and keep reference for cleanup
        BukkitTask task = createRunnable(player).runTaskTimer(AddonPlugin.INSTANCE, 0L, 4L);
        activeTrails.put(player.getUniqueId(), task);
        return true;
    }

    @Override
    public BukkitRunnable createRunnable(Player player) {
        return new BukkitRunnable() {
            long durationLeft = getDurationTicks();

            @Override
            public void run() {
                if (durationLeft <= 0) {
                    onExpire(player); // Triggers resetState(player, ABILITY_END)
                    return;
                }
                durationLeft -= 4L;

                if (!player.isOnGround()) return;
                
                // Spawn trail logic...
            }
        };
    }

    @Override
    public void resetState(UUID pid, Reason reason) {
        // Safely cancel task when duration ends, player dies, or leaves
        BukkitTask task = activeTrails.remove(pid);
        if (task != null) {
            task.cancel();
        }
    }
}

```

---

## Summary of Interfaces

| Interface | Primary Purpose | Key Methods |
| --- | --- | --- |
| **`ResettableAbility`** | Universal state cleanup when events occur | `resetState(UUID, Reason)` |
| **`DurationAbility`** | Abilities with finite duration | `getDurationTicks()`, `onExpire(Player)` |
| **`RunnableAbility`** | Scheduled periodic tasks | `createRunnable(Player)` |
| **`ValidationAbility`** | Dynamic state checks (e.g., armor/location) | `isStateValid(Player)`, `onInvalidated(Player)` |
| **`TogglableAbility`** | Abstract base for persistent ON/OFF abilities | `toggle(Player)`, `enable(Player)`, `disable(Player)` |