import path from 'path'
import { fileURLToPath } from 'url'
import { createRequire } from 'module'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const v2026Root = path.resolve(__dirname, 'apps', 'v2026')

const _require = createRequire(import.meta.url)
const cfg = _require(path.join(v2026Root, 'nuxt.config.js'))

export default {
    ...cfg,
    rootDir: v2026Root,
    srcDir: v2026Root,
}
