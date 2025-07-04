<script lang="ts">
  import pkgjson from "../../../../../../package.json"
  import { osStore } from "@lib/store"
  import { openApp } from "@lib/utils/enviromentUtils"
  import { getItemByINode } from "@lib/utils/fileSystemUtils"
  import { onMount } from "svelte"

  export let id: string

  let width = window.innerWidth
  let height = window.innerHeight
  let x = 0
  let y = 40

  // Calculate height accounting for taskbar and top bar
  onMount(() => {
    const taskbarRect = document
      .getElementById("taskbar")
      ?.getBoundingClientRect()
    const topBarRect = document
      .getElementById("top-bar")
      ?.getBoundingClientRect()
    height =
      window.innerHeight -
      (taskbarRect?.height || 40) -
      (topBarRect?.height || 40)
  })

  const version = pkgjson.version
</script>

<section
  {id}
  class="bg-slate-200/80 dark:bg-slate-700/80 w-full h-full absolute backdrop-blur-sm text-white"
  style="left: {x}px; top: {y}px; width: {width}px; height: {height}px;"
>
  <div class="flex flex-col w-full h-full">
    <div class="flex-1 overflow-y-auto p-4">
      <div class="grid grid-cols-4 gap-4">
        {#each $osStore.enviroment.menu.items as item (item.iNode)}
          {@const currentItem = getItemByINode(item.iNode)}
          <button
            class="flex flex-col items-center justify-center gap-2 bg-slate-300 dark:bg-slate-700 p-4 rounded hover:bg-slate-400 dark:hover:bg-slate-600 transition"
            on:click={() => {
              openApp(item.iNode)
            }}
          >
            <img
              src={`/icons/${currentItem?.icon ?? "directory.png"}`}
              alt={item.name}
              class="w-10 h-10"
            />
            <span class="text-sm text-center">{item.name}</span>
          </button>
        {/each}
      </div>
    </div>

    <div class="w-full flex justify-end p-2">
      <span class="text-[#a1a5b5] text-sm">Version: {version}</span>
    </div>
  </div>
</section>
