export default {
    head: {
        title: 'WitselBlue',
        htmlAttrs: {
            lang: 'ko'
        },
        meta: [
            { charset: 'utf-8' },
            { name: 'viewport', content: 'width=device-width, initial-scale=1' },
            { hid: 'description', name: 'description', content: 'Witsel Blue Portfolio - Frontend Developer Portfolio' },
            { name: 'format-detection', content: 'telephone=no' },
            // 색상 설정 (모바일 브라우저 상단바)
            { name: 'theme-color', content: '#f7f7f7' },
            { name: 'apple-mobile-web-app-capable', content: 'yes' },
            { name: 'apple-mobile-web-app-status-bar-style', content: 'default' },
            // Open Graph
            { property: 'og:type', content: 'website' },
            { property: 'og:title', content: 'Witsel Blue Portfolio' },
            { property: 'og:description', content: 'Frontend Developer Portfolio' },
            { property: 'og:image', content: '/web-app-manifest-512x512.png' },
            // Twitter Card
            { name: 'twitter:card', content: 'summary_large_image' },
            { name: 'twitter:title', content: 'Witsel Blue Portfolio' },
            { name: 'twitter:description', content: 'Frontend Developer Portfolio' },
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
        ],
        script: [
            // Google Analytics
            {
                src: 'https://www.googletagmanager.com/gtag/js?id=G-X8D8EMGB2L',
                async: true
            },
            {
                innerHTML: `
                    window.dataLayer = window.dataLayer || [];
                    function gtag(){dataLayer.push(arguments);}
                    gtag('js', new Date());
                    gtag('config', 'G-X8D8EMGB2L');
                `,
                type: 'text/javascript',
                charset: 'UTF-8'
            }
        ],
        __dangerouslyDisableSanitizers: ['script']
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
        },
        // 성능 최적화: prefetch 설정
        prefetchLinks: true
    },

    plugins: [
        { src: '@/plugins/gsap.client.js', ssr: false },
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
        // 번들 최적화
        optimization: {
            splitChunks: {
                layouts: true,
                pages: true,
                commons: true
            }
        },
        // 압축 설정
        terser: {
            terserOptions: {
                compress: {
                    drop_console: process.env.NODE_ENV === 'production'
                }
            }
        },
        // 분석 도구 (개발 시에만)
        analyze: process.env.ANALYZE === 'true',
        extend(config, { isServer, isClient }) {
            if (isServer) {
                global.TextEncoder = require('util').TextEncoder;
                global.TextDecoder = require('util').TextDecoder;
            }
            // 클라이언트 번들 최적화
            if (isClient) {
                config.optimization = config.optimization || {};
                config.optimization.splitChunks = {
                    chunks: 'all',
                    cacheGroups: {
                        default: false,
                        vendors: false,
                        // 큰 라이브러리 분리
                        vendor: {
                            name: 'vendor',
                            chunks: 'all',
                            test: /node_modules\/(three|gsap|p5|lottie-web|swiper)/,
                            priority: 20
                        },
                        // 공통 코드
                        common: {
                            name: 'common',
                            minChunks: 2,
                            chunks: 'all',
                            priority: 10,
                            reuseExistingChunk: true
                        }
                    }
                };
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
        },
        // Service Worker 최적화
        workbox: {
            runtimeCaching: [
                {
                    urlPattern: /^https:\/\/fonts\.(googleapis|gstatic)\.com\/.*/i,
                    handler: 'CacheFirst',
                    strategyOptions: {
                        cacheName: 'google-fonts',
                        cacheableResponse: {
                            statuses: [0, 200]
                        }
                    }
                },
                {
                    urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp)$/,
                    handler: 'CacheFirst',
                    strategyOptions: {
                        cacheName: 'images',
                        expiration: {
                            maxEntries: 100,
                            maxAgeSeconds: 60 * 60 * 24 * 30 // 30일
                        }
                    }
                },
                {
                    urlPattern: /\.(?:js|css)$/,
                    handler: 'StaleWhileRevalidate',
                    strategyOptions: {
                        cacheName: 'static-resources'
                    }
                }
            ]
        }
    },
    
    // 성능 최적화
    render: {
        // 리소스 힌트
        resourceHints: true,
        // HTTP/2 Server Push
        http2: {
            push: true
        },
        // 압축
        compressor: {
            threshold: 1024
        }
    },
    
    // 추가 최적화 설정
    loading: false, // Nuxt 기본 로딩 인디케이터 비활성화 (커스텀 사용)
    
    // 성능 모니터링
    performance: {
        hints: 'warning',
        maxEntrypointSize: 512000, // 500KB
        maxAssetSize: 512000 // 500KB
    }
}