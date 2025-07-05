<script lang="ts">
  import { osStore } from "@lib/store"

  const handleColor = (color: string) => {
    osStore.update((state) => {
      let background = state.environment.background
      background.color = color
      background.base64 = null
      background.fileName = null
      return state
    })
  }

  const handleDefaultImages = (fileName: string) => {
    osStore.update((state) => {
      let background = state.environment.background
      background.color = null
      background.base64 = null
      background.fileName = fileName
      return state
    })
  }

  const handleCustomImage = (e: Event) => {
    const file = (e.target as HTMLInputElement).files[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      const base64 = e.target.result as string

      osStore.update((state) => {
        let background = state.environment.background
        background.color = null
        background.base64 = base64
        background.fileName = null
        background.userImages.push({
          base64,
          fileName: file.name,
        })
        return state
      })
    }

    reader.readAsDataURL(file)
  }

  const handleInMemoryImage = (base64: string) => {
    osStore.update((state) => {
      let background = state.environment.background
      background.color = null
      background.base64 = base64
      background.fileName = null
      return state
    })
  }

  const solidColors = [
    "#ef4444",
    "#22c55e",
    "#3b82f6",
    "#eab308",
    "#ec4899",
    "#a855f7",
    "#6366f1",
    "#06b6d4",
    "#6b7280",
    "#ffffff",
    "#000000",
  ]
</script>

<div class="flex flex-col gap-4 p-4 w-full h-full overflow-y-auto">
  <h1 class="text-2xl font-bold">Choose a background</h1>

  <div class="flex flex-col gap-4">
    <div class="flex flex-col gap-2">
      <h2 class="text-xl font-medium w-full">Solid colors:</h2>
      <div class="flex flex-wrap gap-4">
        {#each solidColors as color}
          <button
            on:click={() => handleColor(color)}
            class={`w-10 h-10 border ${$osStore.environment?.background?.color === color ? "border-4 border-blue-500" : "border-slate-200"}`}
            style={`background-color:${color}`}
            aria-label={`Select ${color} as background color`}
          ></button>
        {/each}
      </div>
    </div>

    <div class="flex flex-col gap-2">
      <h2 class="text-xl font-medium">Images:</h2>
      <div class="flex flex-wrap gap-4">
        {#each ["Bliss.webp", "Autumn.webp", "Tsumugi.webp"] as fileName}
          <button
            on:click={() => handleDefaultImages(fileName)}
            class={`w-28 ${$osStore.environment?.background?.fileName === fileName ? "border-4 border-blue-500" : "border border-slate-200"}`}
            aria-label={`Select ${fileName.split(".")[0]} as background image`}
          >
            <img
              src={`backgrounds/${fileName}`}
              class="w-28 h-auto bg-cover bg-center"
              alt={`${fileName.split(".")[0]} background`}
            />
            <p>{fileName.split(".")[0]}</p>
          </button>
        {/each}
      </div>
    </div>

    <div class="flex min-w-full items-end gap-2">
      <hr class="w-1/2 border border-slate-600" />
      <span class="text-lg leading-none">or</span>
      <hr class="w-1/2 border border-slate-600" />
    </div>

    <div class="flex flex-col gap-4">
      <h2 class="text-xl font-semibold">Upload a custom image</h2>
      <input on:change={handleCustomImage} type="file" accept="image/*" />
    </div>

    {#if $osStore.environment.background.userImages.length}
      <div class="flex flex-col gap-2">
        <h2 class="text-xl font-medium">Your images:</h2>
        <div class="flex flex-wrap gap-4">
          {#each $osStore.environment.background.userImages as image}
            <button
              on:click={() => handleInMemoryImage(image.base64)}
              class={`w-28 h-16 ${$osStore.environment?.background?.base64 === image.base64 ? "border-4 border-blue-500" : "border border-slate-200"}`}
            >
              <img
                src={image.base64}
                class="w-28 h-16 bg-cover bg-center"
                alt={image.fileName}
              />
              <p>{image.fileName.split(".")[0]}</p>
            </button>
          {/each}
        </div>
      </div>
    {/if}
  </div>
</div>
