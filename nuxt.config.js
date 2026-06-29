import path from 'path'
import { fileURLToPath } from 'url'
import { createRequire } from 'module'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const appRoot = path.resolve(__dirname, 'apps')
const _require = createRequire(import.meta.url)
const isDev = process.env.NODE_ENV !== 'production'

export default {
    rootDir: appRoot,
    srcDir: appRoot,

    head: {
        title: 'WitselBlue',
        meta: [
            { charset: 'utf-8' },
            { name: 'viewport', content: 'width=device-width, initial-scale=1' },
            { hid: 'description', name: 'description', content: 'WitselBlue 2026' },
            { name: 'theme-color', content: '#232221' },
        ],
        link: [
            { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
            { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
            { rel: 'icon', type: 'image/png', sizes: '96x96', href: '/favicon-96x96.png' },
            { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' },
            { rel: 'manifest', href: '/site.webmanifest' },
        ],
    },

    css: [path.resolve(appRoot, 'assets/scss/main.scss')],

    components: true,

    plugins: isDev
        ? [{ src: path.resolve(appRoot, 'plugins/dev-unregister-sw.client.js'), ssr: false }]
        : [],

    modules: ['nuxt-i18n'],

    i18n: {
        locales: [
            { code: 'en', file: 'en.js' },
            { code: 'ko', file: 'ko.js' },
        ],
        defaultLocale: 'en',
        lazy: true,
        langDir: path.resolve(appRoot, 'locales') + '/',
        strategy: 'prefix_except_default',
        detectBrowserLanguage: {
            useCookie: true,
            cookieKey: 'i18n_redirected',
            alwaysRedirect: false,
            fallbackLocale: 'en',
        },
        vueI18n: {
            fallbackLocale: 'en',
        },
    },

    build: {
        loaders: {
            scss: {
                implementation: _require('sass'),
            },
            sass: {
                implementation: _require('sass'),
            },
        },
        extend(config) {
            config.module.rules.push({
                test: /\.(glb|gltf)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: '[path][name].[contenthash:7].[ext]',
                        },
                    },
                ],
            })
        },
    },
}
