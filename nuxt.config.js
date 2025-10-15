export default {
    head: {
        title: 'WitselBlue',
        htmlAttrs: {
            lang: 'ko'
        },
        meta: [
            { charset: 'utf-8' },
            { name: 'viewport', content: 'width=device-width, initial-scale=1' },
            { hid: 'description', name: 'description', content: '' },
            { name: 'format-detection', content: 'telephone=no' },
            // 색상 설정 (모바일 브라우저 상단바)
            { name: 'theme-color', content: '#f7f7f7' },
            { name: 'apple-mobile-web-app-capable', content: 'yes' },
            { name: 'apple-mobile-web-app-status-bar-style', content: 'default' },
        ],
        link: [
            // 기본 파비콘
            { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
            { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
            { rel: 'icon', type: 'image/png', sizes: '96x96', href: '/favicon-96x96.png' },

            // 애플 터치 아이콘 (iOS 홈화면 추가 시)
            { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' },

            // 안드로이드/크롬 PWA용 아이콘
            { rel: 'manifest', href: '/manifest.json' },
        ]
    },

    css: [
        '@/assets/scss/main.scss'
    ],

    router: {
        scrollBehavior(to, from, savedPosition) {
            if (to.path === '/') {
                return { x: 0, y: 0 };
            }
            if (savedPosition) {
                return savedPosition;
            }
            if (to.hash) {
                return {
                    selector: to.hash
                }
            }
            return {
                x: 0,
                y: 0,
            }
        }
    },

    plugins: [
        { src: '@/plugins/aos.client.js', ssr: false },
        { src: '@/plugins/p5.client.js', ssr: false },
        { src: '@/plugins/p5.speech.js', ssr: false },
        { src: '@/plugins/lottie.js', ssr: false },
        { src: '@/plugins/vue-awesome-swiper.js', ssr: false },
        { src: '@/plugins/highlight.js', ssr: false },
    ],

    components: true,

    buildModules: [
        ['nuxt-gsap-module'],
    ],

    modules: [
        'nuxt-i18n',
        '@nuxtjs/pwa',
    ],

    build: {
        transpile: [
            'three',
            'gsap'
        ],
        babel: {
            plugins: ['@babel/plugin-proposal-export-namespace-from']
        },
        loaders: {
            scss: {
                implementation: require('sass'),
            },
            sass: {
                implementation: require('sass'),
            }
        },
        extend(config, { isServer }) {
            if (isServer) {
                global.TextEncoder = require('util').TextEncoder;
                global.TextDecoder = require('util').TextDecoder;
            }
        }
    },

    i18n: {
        locales: [
            { code: 'en', iso: 'en-US', name: 'English', file: 'en.js' },
            { code: 'ko', iso: 'ko-KR', name: '한글', file: 'ko.js' },
        ],
        defaultLocale: 'en',
        langDir: 'assets/locales/',
        strategy: 'prefix_except_default',
        detectBrowserLanguage: {
            useCookie: true,
            cookieKey: 'i18n_redirected',
            redirectOn: 'root',
        },
    },

    pwa: {
        icon: {
            source: 'static/app-icon.png',
            fileName: 'app-icon.png',
            sizes: [64, 120, 144, 152, 192, 256, 512]
        },
        manifest: {
            name: 'Witsel Blue',
            short_name: 'WB',
            theme_color: '#f7f7f7',
            background_color: '#f7f7f7',
        }
    }

}