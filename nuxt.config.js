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

    plugins: [
        { src: '@/plugins/aos.client.js', ssr: false },
        { src: '@/plugins/p5.speech.js', ssr: false },
        { src: '@/plugins/lottie.js', ssr: false }
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
        loaders: {
            scss: {
                implementation: require('sass'),
            },
            sass: {
                implementation: require('sass'),
            }
        }
    }
}
