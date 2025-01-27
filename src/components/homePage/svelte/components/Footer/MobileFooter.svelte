<script lang="ts">
  import { osStore } from "@lib/store"
  import { getItemByINode } from "@lib/utils/fileSystemUtils"
  import Button from "@svtComp/Button.svelte"
  import ChevronMenu from "@svtComp/ChevronMenu.svelte"
  import Menu from "@svtComp/Menu.svelte"
  import { openApp } from "@lib/utils/enviromentUtils"

  let clock = "00:00:00"
  let showMenu = false
  let showChevronMenu = false

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
  class="flex h-14 md:h-10 justify-between w-full items-center bg-slate-400 border-t border-r border-slate-900 select-none"
>
  <section id="start" class="flex w-full h-full divide-x divide-slate-900">
    <Button
      on:click={() => {
        showMenu = !showMenu
      }}
      variant="secondary"
      id="menuBtn"
      customCss="text-2xl md:text-md"
    >
      ₪
    </Button>
    {#if $osStore.enviroment.taskbar.items}
      {#each $osStore.enviroment.taskbar.items as item (item.iNode)}
        {@const currentItem = getItemByINode(item.iNode)}
        <Button id={item.iNode} on:click={() => openApp(item.iNode)}>
          <img
            src={`/icons/${currentItem?.icon ?? "/directory.png"}`}
            alt={currentItem.name}
            class="w-7 md:w-5"
          />
        </Button>
      {/each}
    {/if}
  </section>

  {#if showMenu}
    <Menu id="menu" />
  {/if}

  {#if showChevronMenu}
    <ChevronMenu id="chevronMenu" />
  {/if}
</footer>
