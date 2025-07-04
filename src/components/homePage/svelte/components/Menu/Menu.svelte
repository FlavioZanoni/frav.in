<script lang="ts">
  import MobileMenu from "./MobileMenu.svelte"
  import PcMenu from "./PcMenu.svelte"

  import { isMobile } from "@lib/utils/browserUtils"
</script>

{#if isMobile()}
  <MobileMenu />
{:else}
  <PcMenu />
{/if}
