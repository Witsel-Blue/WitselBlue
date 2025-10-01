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
            { name: 'format-detection', content: 'telephone=no' }
        ],
        link: [
            { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
            { rel: 'apple-touch-icon', href: '/app-icon.png' },
            { rel: 'icon', type: 'image/png', href: '/app-icon.png' },
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