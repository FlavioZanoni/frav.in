<script lang="ts">
  import PcFooter from "./PcFooter.svelte"
  import MobileFooter from "./MobileFooter.svelte"
  import { isMobile } from "@lib/utils/browserUtils"
</script>

{#if isMobile()}
  <MobileFooter />
{:else}
  <PcFooter />
{/if}
