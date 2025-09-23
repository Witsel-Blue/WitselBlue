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
            { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
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
    }
}
