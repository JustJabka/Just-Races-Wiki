# Getting Started

## Requirements

Before installing JustRaces, ensure your server environment meets the following requirements:

* **Java:** Version **25** or higher.
* **Minecraft & Paper:** Version **26.2**.
* **ProtocolLib:** [Latest Dev Build](https://github.com/dmulloy2/ProtocolLib/releases/tag/dev-build).

---

## Installation

1. Download the latest **JustRaces** `.zip` artifact in the [**Github Actions** tab](https://github.com/JustJabka/Just-Races/actions)

![Github Actions Tab](/assets/installation/github_actions.png)

::: warning
Make sure it's from the `main` branch (or it has version tag e.g., `v1.1.1` or `v1.2.0`) and that build is successfull (has green checkmark)
:::

![Build Artifact](/assets/installation/build_artifact.png)

2. Unzip the `JustRaces.zip`
3. Place the `justraces-core.jar` into your server's `plugins/` directory.
4. Restart the server.

---

### Adding Server Resourcepack

::: important
JustRaces uses resourcepack to manage:
- translates (command outputs and other system messages from the plugin).
- to correctly display the cooldown bar of any abilities.
- the showcase addon assets.
:::

1. Download or link the resource pack from the [official repository](https://github.com/JustJabka/Just-Races-Resourcepack).

![Resourcepack Step 1](/assets/installation/resourcepack/step_1.png)
![Resourcepack Step 2](/assets/installation/resourcepack/step_2.png)

2. Add the pack link and hash to your `server.properties` or configure it through your resourcepack manager plugin you prefer (e.g., *ItemsAdder*, *Oraxen*, or Paper's native prompt).