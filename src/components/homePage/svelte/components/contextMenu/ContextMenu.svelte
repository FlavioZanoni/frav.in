<script lang="ts">
  export let x: number = 0
  export let y: number = 0

  const menuWidth = 250
  let adjustedX = x

  $: {
    const viewportWidth = window.innerWidth
    if (x + menuWidth > viewportWidth) {
      adjustedX = x - menuWidth
    } else {
      adjustedX = x
    }
    if (adjustedX < 0) {
      adjustedX = 0
    }
  }
</script>

<div
  class="bg-slate-200 border-2 border-slate-900 absolute flex flex-col w-[250px] h-fit divide-y-2 divide-slate-900"
  style={`left: ${adjustedX}px; top: ${y}px;`}
>
  <slot />
</div>
