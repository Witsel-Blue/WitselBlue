const isDev = process.env.NODE_ENV !== 'production'

export default {
    head: {
        title: 'WitselBlue',
        meta: [
            { charset: 'utf-8' },
            { name: 'viewport', content: 'width=device-width, initial-scale=1' },
            { hid: 'description', name: 'description', content: 'WitselBlue 2026 dev shell' },
        ],
    },

    css: ['@/assets/scss/main.scss'],

    components: true,

    modules: isDev ? ['@nuxtjs/proxy'] : [],

    proxy: isDev
        ? {
              '/v2025': 'http://127.0.0.1:3001',
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
