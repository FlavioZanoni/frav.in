<script lang="ts">
  import { osStore } from "@lib/store"
  import { onMount } from "svelte"

  let crt = true
  osStore.subscribe((state) => {
    crt = state.environment.config.crt
  })

  let left = "0px"
  let bottom = "0px"

  const toggleCRT = () => {
    osStore.update((state) => {
      state.environment.config.crt = !state.environment.config.crt
      return state
    })
  }

  onMount(() => {
    const chevronButton = document.getElementById("chevronButon")

    const chevronButtonRect = chevronButton.getBoundingClientRect()
    left = `${chevronButtonRect.left - 90 + chevronButtonRect.width / 2}px`
    bottom = `${window.innerHeight - chevronButtonRect.bottom + chevronButtonRect.height + 10}px`
  })
</script>

<section
  id="chevronmenu"
  style="left: {left}; bottom: {bottom}; "
  class="absolute"
>
  <div
    class="flex flex-wrap flex-row gap-3 w-[180px] h-[100px] bg-slate-400 border border-slate-900 p-2"
  >
    <a
      target="_blank"
      href="https://www.linkedin.com/in/flaviozanoni/"
      aria-label="Linkedin"
    >
      <enhanced:img
        loading="lazy"
        class="w-5"
        src="@assets/linkedin.webp"
        alt="Linkedin"
      />
    </a>
    <a
      target="_blank"
      href="https://github.com/FlavioZanoni"
      aria-label="Github"
    >
      <enhanced:img
        loading="lazy"
        class="w-5"
        src="@assets/github.webp"
        alt="Github"
      />
    </a>
    <button class="w-5 h-5" type="button" on:click={toggleCRT}>
      <img
        loading="lazy"
        class="w-5"
        src={!crt ? "/icons/crt.png" : "/icons/no-crt.png"}
        alt="show crt effect"
      />
    </button>
  </div>
</section>
