<script lang="ts">
  import { onMount } from "svelte"
  import { getConnectionInfo, getSystemInfo } from "@lib/utils/systemInfoUtils"
  import type { SystemInfo } from "@lib/utils/systemInfoUtils"

  let clock = "00:00:00"
  let sysInfo: SystemInfo

  const updateClock = () => {
    const now = new Date()
    const hours = String(now.getHours()).padStart(2, "0")
    const minutes = String(now.getMinutes()).padStart(2, "0")
    const seconds = String(now.getSeconds()).padStart(2, "0")
    clock = `${hours}:${minutes}:${seconds}`
  }
  updateClock()
  setInterval(updateClock, 1000)

  let info = getConnectionInfo()

  onMount(async () => {
    sysInfo = await getSystemInfo()
  })
</script>

<section
  class="flex justify-between w-full h-10 bg-black text-white p-2"
  id="top-bar"
>
  <div class="flex justify-center items-center gap-2">
    <p id="clock">{clock}</p>
    <p>{info.type}</p>
  </div>

  <div class="flex justify-center items-center gap-2">
    <p>{info.downlink}</p>
    <p>{info.effectiveType}</p>
    <p
      class={sysInfo?.battery?.charging
        ? "text-green-500"
        : sysInfo?.battery?.level < 0.1
          ? "text-red-500"
          : sysInfo?.battery?.level < 0.2
            ? "text-yellow-500"
            : "text-white"}
    >
      {sysInfo?.battery ? `${sysInfo.battery.level * 100}%` : "N/A"}
    </p>
  </div>
</section>
