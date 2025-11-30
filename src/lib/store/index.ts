import jsonState from "@lib/store/state.json"
import { writable } from "svelte/store"
import type { OSStore } from "./types"

export const RECYCLE_BIN_INODE = "6"
export const HOME_INODE = "2"
export const ROOT_INODE = "1"

export const TOP_BAR_HEIGHT = 40
export const TASK_BAR_HEIGHT = 40
export const TASK_BAR_HEIGHT_MOBILE = 55

const osStore = writable<OSStore>(jsonState as unknown as OSStore)
osStore.subscribe((value) => {
  if (import.meta.env.DEV) {
    console.log(value)
  }

  if (value.fileSystem.iNodes[RECYCLE_BIN_INODE].blocks.length) {
    if (value.fileSystem.disk.apps["recycleBin"].icon !== "trash.png") return

    value.fileSystem.disk.apps["recycleBin"].icon = "trash-full.png"
    return
  }
  value.fileSystem.disk.apps["recycleBin"].icon = "trash.png"
})

export { osStore }
