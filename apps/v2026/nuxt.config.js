const path = require('path');

const isDev = process.env.NODE_ENV !== 'production';

module.exports = {
    rootDir: __dirname,
    srcDir: __dirname,

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

    css: [path.resolve(__dirname, 'assets/scss/main.scss')],

    components: true,

    plugins: isDev
        ? [{ src: path.resolve(__dirname, 'plugins/dev-unregister-sw.client.js'), ssr: false }]
        : [],

    modules: isDev ? ['@nuxtjs/proxy', 'nuxt-i18n'] : ['nuxt-i18n'],

    i18n: {
        locales: [
            { code: 'en', file: 'en.js' },
            { code: 'ko', file: 'ko.js' },
        ],
        defaultLocale: 'en',
        lazy: true,
        langDir: path.resolve(__dirname, 'locales') + '/',
        strategy: 'prefix_except_default',
        vueI18n: {
            fallbackLocale: 'en',
        },
    },

    proxy: isDev
        ? {
              '/v2025': {
                  target: 'http://127.0.0.1:3001',
                  changeOrigin: true,
                  ws: true,
                  timeout: 120000,
                  proxyTimeout: 120000,
              },
          }
        : {},

    build: {
        loaders: {
            scss: {
                implementation: require('sass'),
            },
            sass: {
                implementation: require('sass'),
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
            });
        },
    },
};
