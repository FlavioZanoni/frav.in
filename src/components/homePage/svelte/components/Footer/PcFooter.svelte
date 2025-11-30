<script lang="ts">
  import { osStore, TASK_BAR_HEIGHT } from "@lib/store"
  import { getItemByINode } from "@lib/utils/fileSystemUtils"
  import Button from "@svtComp/Button.svelte"
  import ChevronMenu from "@svtComp/ChevronMenu.svelte"
  import Menu from "@svtComp/Menu/Menu.svelte"
  import { openApp } from "@lib/utils/environmentUtils"

  let clock = "00:00:00"
  let showMenu = false
  let showChevronMenu = false

  const updateClock = () => {
    const now = new Date()
    const hours = String(now.getHours()).padStart(2, "0")
    const minutes = String(now.getMinutes()).padStart(2, "0")
    const seconds = String(now.getSeconds()).padStart(2, "0")
    clock = `${hours}:${minutes}:${seconds}`
  }
  updateClock()
  setInterval(updateClock, 1000)

  const handleClickOutsideMenu = (e) => {
    const menu = document.getElementById("menu")
    if (!menu) return

    if (showMenu && !menu.contains(e.target) && e.target.id !== "menuBtn") {
      showMenu = false
    }
  }

  const handleClickOutsideChevron = (e) => {
    const chevronMenu = document.getElementById("chevronMenu")
    if (!chevronMenu) return

    if (
      showChevronMenu &&
      !chevronMenu.contains(e.target) &&
      e.target.id !== "chevronButon"
    ) {
      showChevronMenu = false
    }
  }

  let hasMenuListener = false
  let hasChevronListener = false

  $: {
    if (showMenu) {
      hasMenuListener = true
      window.addEventListener("click", handleClickOutsideMenu)
    } else if (hasMenuListener) {
      window.removeEventListener("click", handleClickOutsideMenu)
    }

    if (showChevronMenu) {
      hasChevronListener = true
      window.addEventListener("click", handleClickOutsideChevron)
    } else if (hasChevronListener) {
      window.removeEventListener("click", handleClickOutsideChevron)
    }
  }
</script>

<footer
  id="taskbar"
  class="flex justify-between w-full items-center bg-slate-400 border-t border-r border-slate-900 select-none"
  style={`height: ${TASK_BAR_HEIGHT}px`}
>
  <section id="start" class="flex divide-x divide-slate-900">
    <Button
      on:click={() => {
        showMenu = !showMenu
      }}
      variant="secondary"
      id="menuBtn">₪ Menu</Button
    >
    {#if $osStore.environment.taskbar.items}
      {#each $osStore.environment.taskbar.items as item (item.iNode)}
        {@const currentItem = getItemByINode(item.iNode)}
        <Button id={item.iNode} on:click={() => openApp(item.iNode)}>
          <img
            src={`/icons/${currentItem?.icon ?? "/directory.png"}`}
            alt={currentItem.name}
            class="w-5 h-5"
          />
          <span>{currentItem.name}</span>
        </Button>
      {/each}
    {/if}

    {#if $osStore.environment.openApps}
      {#each $osStore.environment.openApps as item}
        {@const currentItem = getItemByINode(item.iNode)}
        <Button
          id={item.uuid}
          customCss={item.isFocused ? "bg-gray-100" : "bg-gray-300"}
          on:click={() => {
            osStore.update((state) => {
              const currentItem = state.environment.openApps.findIndex(
                (app) => app.uuid === item.uuid
              )

              state.environment.openApps[currentItem].isMinimized =
                !state.environment.openApps[currentItem].isMinimized
              return state
            })
          }}
        >
          <img
            src={`/icons/${currentItem?.icon ?? "/directory.png"}`}
            alt={item.name}
            class="w-5 h-5"
          />
          <span>{item.name}</span></Button
        >
      {/each}
    {/if}
  </section>

  <section id="end" class="flex divide-x divide-slate-900 gap-1">
    <Button
      on:click={() => {
        showChevronMenu = !showChevronMenu
      }}
      id="chevronButon"
      customCss="pt-2">^</Button
    >
    <div class="flex justify-center items-center min-w-[91px]">
      <p id="clock">{clock}</p>
    </div>
  </section>

  {#if showMenu}
    <Menu />
  {/if}

  {#if showChevronMenu}
    <ChevronMenu />
  {/if}
</footer>
