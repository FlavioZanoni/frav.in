<script lang="ts">
  import { getItemByINode, saveFileToDisk } from "@lib/utils/fileSystemUtils"
  import { onMount } from "svelte"

  export let uuid: string
  export let iNode: string

  let file = getItemByINode(iNode)

  function saveFile() {
    file.content = el.value
    saveFileToDisk(file)
  }

  let el: HTMLTextAreaElement
  onMount(() => {
    el = document.getElementById(`file-${uuid}`) as HTMLTextAreaElement
    document.addEventListener("keydown", (event) => {
      if ((event.ctrlKey || event.metaKey) && event.key === "s") {
        event.preventDefault()
        saveFile()
      }
    })
  })
</script>

<div class="w-full h-full bg-gray-300 p-2">
  <textarea
    class="w-full h-full apearance-none border-none outline-none resize-none bg-transparent"
    id={`file-${uuid}`}
  >
    {file.content}
  </textarea>
</div>
