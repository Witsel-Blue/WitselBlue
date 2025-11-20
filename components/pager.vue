<template>
    <div id='pager'>
        <div class='wrapper mouse-hover1'>
            <TextStagger
                :paragraphs="[$t('pager.paragraphs.0'), $t('pager.paragraphs.1')]"
                triggerMode='bottom'
                speedMode='fast'
                :rewindAnimation='true'
            />
            <svg
                :src="require('@/assets/img/pager.svg')"
                @click='scrollToTop'
                alt='pager'
                class='pager' 
                xmlns="http://www.w3.org/2000/svg" width="78" height="81" viewBox="0 0 78 81" fill="none">
                <path 
                    d="M39 0L43.8394 25.7875L63.0992 7.73481L51.6697 31.4072L77.9933 27.9848L54.6606 40.5L77.9933 53.0152L51.6697 49.5928L63.0992 73.2652L43.8394 55.2125L39 81L34.1606 55.2125L14.9008 73.2652L26.3303 49.5928L0.00668335 53.0152L23.3394 40.5L0.00668335 27.9848L26.3303 31.4072L14.9008 7.73481L34.1606 25.7875L39 0Z" 
                    :fill="clientPathColor"
                />
            </svg>
        </div>
    </div>
</template>

<script>
import TextStagger from '@/components/TextStagger.vue';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/dist/ScrollToPlugin';

if (process.client) {
    gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);
}
    
export default {
    name: 'Pager',
    components: {
        TextStagger,
    },
    data() {
        return {
            scrollTween: null,
            scrollTrigger: null,
            pathColorST: null,
            clientPathColor: '#3E3C3C',
        }
    },
    mounted() {
        if (process.client) {
            console.log('[pager] mounted, initializing immediately...');
            window.addEventListener('intro-end', this.handleIntroEnd, { once: true });
            
            this.initGsap();
            this.updatePathColor(this.$route.path);

            this.$watch('$route', (to) => {
                this.$nextTick(() => {
                    setTimeout(() => {
                        this.resetGsap();
                        this.initGsap();
                        this.updatePathColor(to.path);
                    }, 700);
                });
            });
        }
    },
    beforeDestroy() {
        console.log('[pager] beforeDestroy called');
        window.removeEventListener('intro-end', this.handleIntroEnd);
        
        if (this.scrollTween) {
            this.scrollTween.kill();
            this.scrollTween = null;
        }
        if (this.scrollTrigger) {
            this.scrollTrigger.kill();
            this.scrollTrigger = null;
        }
        if (this.pathColorST) {
            this.pathColorST.kill();
            this.pathColorST = null;
        }
    },
    methods: {
        async initGsap() {
            console.log('[pager] initGsap called');
            
            if (this.scrollTween) {
                console.log('[pager] Killing existing scrollTween');
                this.scrollTween.kill();
                this.scrollTween = null;
            }
            if (this.scrollTrigger) {
                console.log('[pager] Killing existing scrollTrigger');
                this.scrollTrigger.kill();
                this.scrollTrigger = null;
            }
            if (this.pathColorST) {
                console.log('[pager] Killing existing pathColorST');
                this.pathColorST.kill();
                this.pathColorST = null;
            }
            
            const gsap = (await import('gsap')).default;
            const { ScrollTrigger } = await import('gsap/dist/ScrollTrigger.js');
            const { ScrollToPlugin } = await import('gsap/dist/ScrollToPlugin.js');

            gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);
            
            gsap.set('.pager', { 
                rotation: 0,
                clearProps: 'all'
            });
            
            console.log('[pager] Creating new ScrollTrigger for rotation');

            const normalizedPath = this.$route.path.replace(/\/$/, '');
            const checkIsHome = normalizedPath === '' || normalizedPath === '/ko';
            
            this.scrollTween = gsap.to('.pager', {
                rotation: 360*2,
                ease: 'none',
                scrollTrigger: {
                    trigger: document.body,
                    start: 'top top',
                    end: 'max',
                    scrub: true,
                    invalidateOnRefresh: true,
                },
            });

            this.scrollTrigger = this.scrollTween.scrollTrigger;
            console.log('[pager] ScrollTrigger created:', !!this.scrollTrigger);

            if (checkIsHome) {
                this.initPathColor();
            }
        },
        resetGsap() {
            if (this.scrollTween) {
                this.scrollTween.kill();
                this.scrollTween = null;
            }
            if (this.scrollTrigger) {
                this.scrollTrigger.kill();
                this.scrollTrigger = null;
            }
            gsap.set('.pager', { rotation: 0 });
        },
        scrollToTop() {
            if (process.client) {
                const normalizedPath = this.$route.path.replace(/\/$/, '');
                const isHome = normalizedPath === '' || normalizedPath === '/ko';
                
                // mobile
                const isMobile = window.innerWidth <= 768;
                
                if (isMobile) {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                    document.documentElement.scrollTop = 0;
                    document.body.scrollTop = 0;
                    
                    gsap.to(window, {
                        scrollTo: { y: 0, autoKill: true },
                        duration: 0.8,
                        ease: 'power2.out',
                        onComplete: () => {
                            window.scrollTo({ top: 0, behavior: 'instant' });
                            document.documentElement.scrollTop = 0;
                            document.body.scrollTop = 0;
                            console.log('[pager] Scroll to top complete (mobile), final scrollY:', window.scrollY);
                        }
                    });
                } else {
                    // pc
                    gsap.to(window, {
                        scrollTo: { y: 0, autoKill: true },
                        duration: 0.8,
                        ease: 'power2.out',
                        onComplete: () => {
                            window.scrollTo({ top: 0, behavior: 'instant' });
                            console.log('[pager] Scroll to top complete, final scrollY:', window.scrollY);
                        }
                    });
                }
                
                if (isHome) {
                    console.log('[pager] Dispatching reset-home-bg event');
                    setTimeout(() => {
                        window.dispatchEvent(new Event('reset-home-bg'));
                    }, 900);
                }
            }
        },
        initPathColor() {
            const path = this.$el.querySelector('svg path');
            const bumper = document.querySelector('.bumper');
            if (!path || !bumper) return;

            const normalizedPath = this.$route.path.replace(/\/$/, '');
            const isHome = normalizedPath === '' || normalizedPath === '/ko';
            
            if (isHome) {
                gsap.set(path, { fill: '#f7f7f7' });
            }

            this.pathColorST = gsap.to(path, {
                fill: '#3E3C3C',
                ease: 'none',
                scrollTrigger: {
                    trigger: bumper,
                    start: 'top 100%',
                    end: 'top top',
                    scrub: true,
                    invalidateOnRefresh: true,
                    immediateRender: false,
                }
            });

            ScrollTrigger.refresh();
        },
        updatePathColor(path) {
            const pathEl = this.$el?.querySelector('svg path');

            const normalizedPath = path.replace(/\/$/, '');
            const isHome = normalizedPath === '' || normalizedPath === '/ko';

            if (isHome) {
                this.clientPathColor = '#f7f7f7';

                if (this.pathColorST) {
                    this.pathColorST.kill();
                    this.pathColorST = null;
                }
                if (this.scrollTween) {
                    this.scrollTween.kill();
                    this.scrollTween = null;
                }
                if (this.scrollTrigger) {
                    this.scrollTrigger.kill();
                    this.scrollTrigger = null;
                }

                this.$nextTick(() => {
                    setTimeout(() => {
                        this.waitForBumper();
                    }, 300);
                });
            } else {
                this.clientPathColor = '#3E3C3C';

                if (this.pathColorST) {
                    this.pathColorST.kill();
                    this.pathColorST = null;
                }
                if (this.scrollTween) {
                    this.scrollTween.kill();
                    this.scrollTween = null;
                }
                if (this.scrollTrigger) {
                    this.scrollTrigger.kill();
                    this.scrollTrigger = null;
                }

                if (pathEl) {
                    gsap.set(pathEl, { fill: this.clientPathColor });
                }
            }
        },
        resetPathColor() {
            if (this.pathColorST) {
                this.pathColorST.kill();
                this.pathColorST = null;
            }
            const path = this.$el?.querySelector('svg path');
            if (path) path.setAttribute('fill', this.clientPathColor);
        },
        handleIntroEnd() {
            console.log('[pager] handleIntroEnd - hiding TextStagger');
            const textStagger = this.$el?.querySelector('#text-stagger');
            if (textStagger) {
                const paragraphs = textStagger.querySelectorAll('li p');
                if (paragraphs.length) {
                    gsap.set(paragraphs, {
                        opacity: 0,
                        yPercent: 150,
                        rotation: (i) => (i % 2 === 0 ? -4 : 4),
                    });
                }
            }
        },
        waitForBumper(retries = 0) {
            const normalizedPath = this.$route.path.replace(/\/$/, '');
            const isHome = normalizedPath === '' || normalizedPath === '/ko';
            if (!isHome) return;

            const bumper = document.querySelector('.bumper');
            if (!bumper && retries < 10) {
                console.log('[pager] bumper not found, retrying...', retries);
                setTimeout(() => this.waitForBumper(retries + 1), 200);
                return;
            }

            if (!bumper) {
                console.log('[pager] bumper not found after retries, using default color');
                this.clientPathColor = '#3E3C3C';
                const pathEl = this.$el?.querySelector('svg path');
                if (pathEl) {
                    gsap.set(pathEl, { fill: '#3E3C3C' });
                }
                return;
            }

            const pathEl = this.$el?.querySelector('svg path');
            
            let useWhite = true;
            if (window.scrollY === 0) {
                useWhite = true;
            } else if (bumper) {
                const rect = bumper.getBoundingClientRect();
                useWhite = rect.top > 0;
            }
            
            const initialColor = useWhite ? '#f7f7f7' : '#3E3C3C';
            this.clientPathColor = initialColor;
            
            console.log('[pager] waitForBumper - scrollY:', window.scrollY, 'useWhite:', useWhite, 'color:', initialColor);
            
            if (pathEl) {
                gsap.set(pathEl, { fill: initialColor });
            }

            if (this.pathColorST) {
                this.pathColorST.kill();
                this.pathColorST = null;
            }

            if (bumper) {
                this.initPathColor();
            }
        },

    },
}
</script>

<style lang='scss' scoped>
@use '@/assets/scss/base/variables.scss' as *;
    
#pager {
    position: fixed;
    bottom: 2%;
    right: 4vw;
    z-index: 100;
    .wrapper {
        width: 10vw;
        height: 10vw;
        max-width: 120px;
        max-height: 120px;
        min-width: 80px;
        min-height: 80px;
        #text-stagger::v-deep {
            position: absolute;
            left: 50%;
            transform: translate(-50%, -100%);
            text-align: center;
            width: 100%;
            li {
                p {
                    font-size: 0.8rem;
                    line-height: 0.9;
                    font-family: 'basic_font', 'YUniverse';
                }
                &:last-child p {
                    line-height: 1.4;
                }
            }
        }
        svg {
            width: 100%;
            height: 100%;
        }
    }
}
</style>