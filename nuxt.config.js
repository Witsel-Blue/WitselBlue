import path from 'path'
import { fileURLToPath } from 'url'
import v2026 from './apps/v2026/nuxt.config.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const v2026Root = path.resolve(__dirname, 'apps', 'v2026')

/**
 * 저장소 루트에서 `nuxt` / IDE가 Nuxt를 띄울 때 cwd가 루트가 되어
 * `@/assets/...` 가 깨지는 것을 막기 위해, 기본 앱 디렉터리를 v2026으로 고정합니다.
 * `cd apps/v2025 && nuxt` 처럼 하위에서 실행하면 해당 폴더의 nuxt.config만 사용됩니다.
 */
export default {
    ...v2026,
    rootDir: v2026Root,
    srcDir: v2026Root,
}
