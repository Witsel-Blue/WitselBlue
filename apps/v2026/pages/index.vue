<template>
    <main class='home'>
        <p class='badge'>v2026 · dev</p>
        <h1>WitselBlue 2026</h1>
        <p class='lead'>
            새 사이트 작업용 기본 페이지입니다. Vue 2 · Nuxt 2 · SCSS 로 구성되어 있습니다.
        </p>
        <ul class='actions'>
            <li>
                <a class='link' href='/v2025/' @click.prevent='openV2025'>2025 포트폴리오 열기 (/v2025)</a>
            </li>
        </ul>
        <p class='hint'>
            개발 시 <code>npm run dev</code>는 v2026(포트 3000)과 v2025(포트 3001)를 함께 띄우고,
            v2026의 <code>@nuxtjs/proxy</code>로 3000의 <code>/v2025</code> 요청을 3001로 넘깁니다.
        </p>
    </main>
</template>

<script>
export default {
    methods: {
        openV2025() {
            window.location.assign(`${window.location.origin}/v2025/`)
        },
    },
}
</script>

<style lang='scss' scoped>

</style>
