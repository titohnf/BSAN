import { rmSync, existsSync } from "fs"
import { join } from "path"

const nextDir = join(process.cwd(), ".next")

if (existsSync(nextDir)) {
  rmSync(nextDir, { recursive: true, force: true })
  console.log("[v0] Deleted .next cache directory successfully")
} else {
  console.log("[v0] .next directory does not exist, nothing to delete")
}
