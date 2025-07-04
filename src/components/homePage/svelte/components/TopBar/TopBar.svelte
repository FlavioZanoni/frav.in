<script lang="ts">
  import { isMobile } from "@lib/utils/browserUtils"
  import MobileTopBar from "./MobileTopBar.svelte"
</script>

{#if isMobile()}
  <MobileTopBar />
{/if}
