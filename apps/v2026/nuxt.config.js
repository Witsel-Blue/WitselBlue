const path = require('path')

const isDev = process.env.NODE_ENV !== 'production'

module.exports = {
    rootDir: __dirname,
    srcDir: __dirname,

    head: {
        title: 'WitselBlue',
        meta: [
            { charset: 'utf-8' },
            { name: 'viewport', content: 'width=device-width, initial-scale=1' },
            { hid: 'description', name: 'description', content: 'WitselBlue 2026' },
        ],
    },

    css: [path.resolve(__dirname, 'assets/scss/main.scss')],

    components: true,

    plugins: isDev
        ? [{ src: path.resolve(__dirname, 'plugins/dev-unregister-sw.client.js'), ssr: false }]
        : [],

    modules: isDev ? ['@nuxtjs/proxy'] : [],

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
    },
}
