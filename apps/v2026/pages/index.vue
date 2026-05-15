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
.home {
    max-width: 40rem;
}

.badge {
    display: inline-block;
    margin: 0 0 1rem;
    padding: 0.25rem 0.6rem;
    border-radius: 999px;
    font-size: 0.75rem;
    letter-spacing: 0.04em;
    background: rgba(91, 140, 255, 0.15);
    color: #9db7ff;
}

h1 {
    margin: 0 0 0.75rem;
    font-size: clamp(1.75rem, 4vw, 2.25rem);
    font-weight: 650;
}

.lead {
    margin: 0 0 1.5rem;
    line-height: 1.6;
    opacity: 0.92;
}

.actions {
    margin: 0 0 1.5rem;
    padding-left: 1.1rem;
}

.link {
    font-weight: 600;
}

.hint {
    margin: 0;
    font-size: 0.85rem;
    line-height: 1.55;
    opacity: 0.72;

    code {
        font-size: 0.9em;
        padding: 0.1em 0.35em;
        border-radius: 4px;
        background: rgba(255, 255, 255, 0.06);
    }
}
</style>
