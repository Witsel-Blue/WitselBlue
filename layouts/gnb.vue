<template>
    <div id='gnb' ref='gnb'>
        <nav class='pc'>
            <ul class='nav'>
                <li v-for='nav in navigation' :key='nav.name' class='mouse-hover1' ref='menu'>
                    <a href='#' v-html='nav.name' 
                        @click.prevent='linkClick(nav.path)'
                    />
                </li>
                <li>
                    <Pager v-if='showPager' />
                </li>
                <li>
                    <ChangeLang />
                </li>
            </ul>
        </nav>

        <div ref='mb' class='mb'
            :class="[
                { 'active' : open === true },
                { 'shadow' : headerShadow === true }
            ]"
        >
            <button class='menu-button' @click='menuClick'>
                <div class='button-wrap'>
                    <svg xmlns="http://www.w3.org/2000/svg" width="102" height="102" viewBox="0 0 102 102" fill="none">
                        <path d="M49.8713 5.50822C48.8535 6.34293 47.8669 7.23509 46.9165 8.18542C31.2956 23.8064 31.2956 49.133 46.9165 64.754C56.5255 74.3629 69.8064 78.0573 82.2422 75.8446C66.5299 88.7308 43.2993 87.8397 28.6284 73.1688C13.0075 57.5478 13.0074 32.2213 28.6284 16.6003C34.6405 10.5882 42.0906 6.89256 49.8713 5.50822Z" fill="#3E3C3C"/>
                        <path d="M71 19L76.4018 33.5982L91 39L76.4018 44.4018L71 59L65.5982 44.4018L51 39L65.5982 33.5982L71 19Z" fill="#3E3C3C"/>
                    </svg>
                </div>
            </button>
            <div class='menu-cont'>
                <nav>
                    <ul class='nav'>
                        <li v-for='nav in navigation' :key='nav.name'>
                            <a :href='nav.path' @click.prevent='linkClick(nav.path)'>
                                {{ $t(`gnb.${nav.key}`) }}
                            </a>
                        </li>
                        <li>
                            <ChangeLang />
                        </li>
                    </ul>
                </nav>
            </div>
            <div class='desc'>
                <p>&copy; 2025 witselblue</p>
            </div>
            <div class='shadow'@click='shadowClick'></div>
            <Pager v-if='showPager' />
        </div>
    </div>
</template>

<script>
import Pager from '@/components/pager.vue';
import ChangeLang from '@/components/ChangeLang.vue';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/dist/ScrollToPlugin';

if (process.client) {
    gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);
}
    
export default {
    components: {
        Pager,
        ChangeLang,
    },
    data() {
        return {
            navigation: [
                {
                    key: 'home',
                    name: '<p>H<span>o</span>me</p>',
                    path: '/'
                },
                {
                    key: 'projects',
                    name: '<p>Pr<span>o</span>jects</p>',
                    path: '/projects'
                },
                {
                    key: 'archive',
                    name: '<p>Ar<span>h</span>ive</p>',
                    path: '/archive'
                },
            ],
            open: false,
            headerShadow: false,
            showPager: false,
            gnbScrollTriggers: [],
        }
    },
    computed: {
        activeTab() {
            return this.$route.path;
        }
    },
    mounted() {
        this.open = false;
        this.winScrolled();
        
        const showIntro = this.$store.state.showIntro;
        if (!showIntro) {
            this.showPager = true;
        }
        
        window.addEventListener('remount-pager', this.handleRemountPager);
        
        this.$nextTick(() => {
            setTimeout(() => {
        this.updateGnbColor(this.$route.path);
        this.updateMenuButtonColor();
                this.initFadeIn();
            }, 600);
        });
    },
    beforeDestroy() {
        window.removeEventListener('remount-pager', this.handleRemountPager);
    },
    watch: {
        '$route.path'(newPath) {
            this.$nextTick(() => {
                setTimeout(() => {
                    console.log('[GNB] Route changed to:', newPath);
            this.updateGnbColor(newPath);
            this.updateMenuButtonColor();
                }, 300);
            });
        }
    },
    methods: {
        handleRemountPager() {
            console.log('[GNB] handleRemountPager called, removing Pager');
            this.showPager = false;
            this.$nextTick(() => {
                console.log('[GNB] Re-creating Pager');
                this.showPager = true;
            });
        },
        initFadeIn() {
            console.log('[GNB] initFadeIn called');
            const normalizedPath = this.$route.path.replace(/\/$/, '');
            const isHome = normalizedPath === '' || normalizedPath === '/ko';
            console.log('[GNB] isHome:', isHome);
            
            if (isHome) {
                const showIntro = this.$store.state.showIntro;
                console.log('[GNB] showIntro from store:', showIntro);
                
                if (showIntro === true) {
                    console.log('[GNB] Setting initial opacity to 0');
                    const gnbEl = this.$refs.gnb;
                    if (gnbEl) {
                        gnbEl.style.opacity = '0';
                        console.log('[GNB] GNB opacity set to 0');
                    }
                    
                    window.addEventListener('fade-in-gnb', this.handleFadeIn, { once: true });
                }
            }
        },
        handleFadeIn() {
            console.log('[GNB] handleFadeIn called');
            const gnbEl = this.$refs.gnb;
            if (gnbEl && this.$gsap) {
                console.log('[GNB] Fading in GNB');
                this.$gsap.to(gnbEl, { opacity: 1, duration: 0.8, ease: 'power2.out' });
            } else {
                console.log('[GNB] Cannot fade in - gnbEl:', gnbEl, 'gsap:', this.$gsap);
            }
        },
        menuClick() {
            this.open = !this.open;
            this.updateMenuButtonColor();
        },
        linkClick(path) {
            console.log('[gnb] linkClick called with path:', path);
            if (!path) return;
            this.open = false;
            const currentLocale = this.$i18n.locale;
            const localizedPath = currentLocale === 'en' ? path : `/${currentLocale}${path}`;
            const isMobile = process.client && window.innerWidth <= 768;
            
            if (this.$route.path === localizedPath) {
                // 같은 경로일 때 맨 위로 스크롤
                if (!isMobile) {
                    this.scrollToTop(() => {
                        this.updateGnbColor(path);
                        this.updateMenuButtonColor();
                    });
                } else {
                    this.updateGnbColor(path);
                    this.updateMenuButtonColor();
                }
            } else {
                if (path === '/projects' || path === '/archive') {
                    const nav = this.navigation.find(n => n.path === path);
                    if (nav) {
                        const titleKey = nav.key;
                        const title = this.$t(`gnb.${titleKey}`);
                        this.$store.commit('setPageTransitionTitle', title);
                    }
                    this.$store.commit('setShowPageTransition', true);
                    setTimeout(() => {
                        this.$router.push(localizedPath);
                    }, 1500);
                } else {
                    this.$router.push(localizedPath);
                    if (path === '/') {
                        console.log('[gnb] Dispatching reset-home-bg event');
                        if (!isMobile) {
                            this.$nextTick(() => {
                                this.scrollToTop();
                            });
                        }
                        setTimeout(() => {
                            window.dispatchEvent(new Event('reset-home-bg'));
                        }, 500);
                    }
                }
            }
            this.updateMenuButtonColor();
        },
        scrollToTop(callback) {
            if (process.client) {
                gsap.to(window, {
                    scrollTo: { y: 0, autoKill: true },
                    duration: 0.8,
                    ease: 'power2.out',
                    onComplete: () => {
                        window.scrollTo({ top: 0, behavior: 'instant' });
                        if (callback) {
                            setTimeout(callback, 100);
                        }
                    }
                });
            }
        },
        shadowClick() {
            this.open = false;
            this.updateMenuButtonColor();
        },
        winScrolled() {
            window.addEventListener('scroll', () => {
                const scrollY = window.scrollY;
                this.headerShadow = scrollY > 100;
                if (!this.open) this.updateMenuButtonColor();
            });
            this.updateMenuButtonColor();
        },
        updateMenuButtonColor() {
            const menuButtonPaths = this.$refs.mb?.querySelectorAll('svg path');
            if (!menuButtonPaths || !menuButtonPaths.length) return;

            if (this.open) {
                menuButtonPaths.forEach(p => p.setAttribute('fill', '#f7f7f7'));
                return;
            }

            const normalizedPath = this.$route.path.replace(/\/$/, '');
            const isHome = normalizedPath === '' || normalizedPath === '/ko';

            if (!isHome) {
                menuButtonPaths.forEach(p => p.setAttribute('fill', '#3E3C3C'));
                return;
            }

            const bumper = document.querySelector('.bumper');
            let useWhite = true;

            if (bumper) {
                const rect = bumper.getBoundingClientRect();
                useWhite = rect.top > 0;
            } else {
                useWhite = window.scrollY === 0;
            }

            const color = useWhite ? '#f7f7f7' : '#3E3C3C';
            menuButtonPaths.forEach(p => p.setAttribute('fill', color));
        },
        updateGnbColor(path) {
            const menus = this.$refs.menu;
            if (!menus) return;

            const menuList = Array.isArray(menus) ? menus : [menus];
            
            this.gnbScrollTriggers.forEach(st => {
                if (st && st.kill) st.kill();
            });
            this.gnbScrollTriggers = [];
            
            menuList.forEach(m => {
                const a = (m.$el?.querySelector('a')) || m.querySelector?.('a') || m;
                if (a) gsap.killTweensOf(a);
            });

            const changeLangEl = document.querySelector('#change-lang');
            const langButtons = changeLangEl ? changeLangEl.querySelectorAll('button') : [];

            const normalizedPath = path.replace(/\/$/, '');
            const isHomePath = normalizedPath === '' || normalizedPath === '/ko';

            if (isHomePath) {
                this.initGnbColorScroll(menuList, langButtons);
            } else {
                menuList.forEach(m => {
                    const a = (m.$el?.querySelector('a')) || m.querySelector?.('a') || m;
                    if (a) a.style.color = '#3E3C3C';
                });

                langButtons.forEach(btn => {
                    const spans = btn.querySelectorAll('.text-shifting span');
                    spans.forEach(span => span.style.color = '#3E3C3C');
                    btn.style.setProperty('--btn-color', '#3E3C3C');
                    btn.style.setProperty('--after-color', '#3E3C3C');
                });
            }
        },
        initGnbColorScroll(menus, langButtons = [], retryCount = 0) {
            if (!menus || !menus.length) return;

            const bumper = document.querySelector('.bumper');
            const path = this.$route.path;
            const normalizedPath = path.replace(/\/$/, '');
            const isHomePath = normalizedPath === '' || normalizedPath === '/ko';

            if (!bumper && isHomePath && retryCount < 10) {
                console.log('[GNB] bumper not found, retrying...', retryCount);
                setTimeout(() => {
                    this.initGnbColorScroll(menus, langButtons, retryCount + 1);
                }, 200);
                return;
            }

            if (!bumper) {
                console.log('[GNB] bumper not found after retries, using default color');
                menus.forEach(m => {
                    const a = (m.$el?.querySelector('a')) || m.querySelector?.('a') || m;
                    if (a) a.style.color = '#3E3C3C';
                });

                langButtons.forEach(btn => {
                    const spans = btn.querySelectorAll('.text-shifting span');
                    spans.forEach(span => span.style.color = '#3E3C3C');
                    btn.style.setProperty('--after-color', '#3E3C3C');
                    btn.style.setProperty('--btn-color', '#3E3C3C');
                });

                return;
            }

            let useWhite = true;
            
            if (window.scrollY === 0) {
                useWhite = true;
            } else {
                const rect = bumper.getBoundingClientRect();
                useWhite = rect.top > 0;
            }

            console.log('[GNB] initGnbColorScroll - scrollY:', window.scrollY, 'useWhite:', useWhite, 'path:', path);

            const menuColor = useWhite ? '#f7f7f7' : '#3E3C3C';

            menus.forEach(m => {
                const a = (m.$el?.querySelector('a')) || m.querySelector?.('a') || m;
                if (a) a.style.color = menuColor;
            });

            langButtons.forEach(btn => {
                const spans = btn.querySelectorAll('.text-shifting span');
                spans.forEach(span => span.style.color = menuColor);

                btn.style.setProperty('--after-color', menuColor);
                btn.style.setProperty('--btn-color', menuColor);
            });

            if (!isHomePath) return;

            menus.forEach(m => {
                const a = (m.$el?.querySelector('a')) || m.querySelector?.('a') || m;
                if (!a) return;

                const st = gsap.to(a, {
                    color: '#3E3C3C',
                    ease: 'none',
                    scrollTrigger: {
                        trigger: bumper,
                        start: 'top 100%',
                        end: 'top top',
                        scrub: true,
                    }
                });
                if (st && st.scrollTrigger) {
                    this.gnbScrollTriggers.push(st.scrollTrigger);
                }
            });

            langButtons.forEach(btn => {
                const spans = btn.querySelectorAll('.text-shifting span');
                spans.forEach(span => {
                    const st = gsap.to(span, {
                        color: '#3E3C3C',
                        ease: 'none',
                        scrollTrigger: {
                            trigger: bumper,
                            start: 'top 100%',
                            end: 'top top',
                            scrub: true,
                        }
                    });
                    if (st && st.scrollTrigger) {
                        this.gnbScrollTriggers.push(st.scrollTrigger);
                    }
                });
                const st = gsap.to(btn, {
                    '--after-color': '#3E3C3C',
                    '--btn-color': '#3E3C3C',
                    ease: 'none',
                    scrollTrigger: {
                        trigger: bumper,
                        start: 'top 100%',
                        end: 'top top',
                        scrub: true,
                    }
                });
                if (st && st.scrollTrigger) {
                    this.gnbScrollTriggers.push(st.scrollTrigger);
                }
            });

            setTimeout(() => {
                ScrollTrigger.refresh();
            }, 100);
        },

    }
}
</script>

<style lang='scss' scoped>
    @import '/assets/scss/layout/gnb.scss';
</style>