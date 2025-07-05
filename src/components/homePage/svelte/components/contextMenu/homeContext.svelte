<script lang="ts">
  import { osStore } from "@lib/store"
  import Button from "@svtComp/Button.svelte"

  const handleBackground = () => {
    osStore.update((state) => {
      state.environment.openApps.push({
        name: "background",
        iNode: "9",
        uuid: crypto.randomUUID().toString(),
        isFocused: true,
        isMinimized: false,
        isMaximized: false,
      })

      return state
    })
  }

  const toggleCRT = () => {
    osStore.update((state) => {
      state.environment.config.crt = !state.environment.config.crt
      return state
    })
  }
</script>

<Button on:click={handleBackground}>Change background</Button>
<Button on:click={toggleCRT}>Toggle CRT effect</Button>
