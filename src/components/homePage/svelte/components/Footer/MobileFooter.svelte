<script lang="ts">
  import { osStore, TASK_BAR_HEIGHT_MOBILE } from "@lib/store"
  import { getItemByINode } from "@lib/utils/fileSystemUtils"
  import Button from "@svtComp/Button.svelte"
  import ChevronMenu from "@svtComp/ChevronMenu.svelte"
  import Menu from "@svtComp/Menu/Menu.svelte"
  import { openApp } from "@lib/utils/environmentUtils"
  import { isMobile } from "@lib/utils/browserUtils"

  let showMenu = false
  let showChevronMenu = false
  let length = $osStore.environment.taskbar.items.length

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
  class="flex h-14 w-full bg-slate-400 border-t border-r border-slate-900 select-none"
  style={`height: ${TASK_BAR_HEIGHT_MOBILE}px`}
>
  <section
    id="start"
    class="flex w-full h-full justify-around lg:divide-x md:divide-slate-900 sm:divide-x-0"
  >
    {#if !isMobile()}
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
    {/if}
    {#if $osStore.environment.taskbar.items}
      {#each $osStore.environment.taskbar.items as item, index}
        {@const currentItem = getItemByINode(item.iNode)}
        {#if isMobile()}
          {#if Math.round(length / 2) == index}
            <Button
              on:click={() => {
                showMenu = !showMenu
              }}
              variant="secondary"
              id="menuBtn"
              customCss="text-2xl md:text-md w-[100px]"
            >
              ₪
            </Button>
          {/if}
        {/if}

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
    <Menu />
  {/if}

  {#if showChevronMenu}
    <ChevronMenu />
  {/if}
</footer>
