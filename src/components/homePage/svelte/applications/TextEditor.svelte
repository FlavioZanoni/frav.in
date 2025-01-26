<script lang="ts">
  import { osStore } from "@lib/store"
  import { getItemByINode } from "@lib/utils/fileSystemUtils"
  import { onMount } from "svelte"

  export let uuid: string
  export let iNode: string
  export let name: string

  let item = getItemByINode(iNode)

  onMount(() => {
    document.addEventListener("keydown", (event) => {
      if ((event.ctrlKey || event.metaKey) && event.key === "s") {
        event.preventDefault()
        osStore.update((state) => {
          const el = document.getElementById(`${uuid}`) as HTMLTextAreaElement
          // need to create a fn to modify the contents

          return state
        })
      }
    })
  })
</script>

<div class="w-full h-full bg-gray-300 p-2">
  <textarea
    class="w-full h-full apearance-none border-none outline-none resize-none bg-transparent"
    id={`${uuid}`}
  >
    {item.content}
  </textarea>
</div>
