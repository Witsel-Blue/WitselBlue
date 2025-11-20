<template>
    <div id='parallax-img' data-aos-disable>
        <div class='parallax-wrap'>
            <div class='parallax-cont' data-aos='fade-up'>
                <img
                    :src='currentSrc'
                    class='img'
                    oncontextmenu='return false;'
                    ondragstart='return false;'
                >
            </div>
        </div>
    </div>
</template>

<script>
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

if (process.client) {
    gsap.registerPlugin(ScrollTrigger);
}

export default {
    props: {
        src: String,
        srcMobile: String,
    },
    data() {
        return {
            scrollTriggerInstance: null,
            isMobile: false
        }
    },
    computed: {
        currentSrc() {
            return (this.isMobile && this.srcMobile) ? this.srcMobile : this.src;
        }
    },
    watch: {
        src(newSrc, oldSrc) {
            if (newSrc !== oldSrc) {
                console.log('[ParallaxImg] src changed from', oldSrc, 'to', newSrc);
                
                if (this.scrollTriggerInstance) {
                    console.log('[ParallaxImg] watch: Killing existing ScrollTrigger');
                    this.scrollTriggerInstance.kill();
                    this.scrollTriggerInstance = null;
                }
                
                this.$nextTick(() => {
                    const img = this.$el?.querySelector('.img');
                    console.log('[ParallaxImg] watch: img element found:', !!img);
                    
                    if (img) {
                        if (img.complete && img.naturalWidth > 0) {
                            setTimeout(() => {
                                this.parallaxImg();
                            }, 200);
                        } else {
                            const loadHandler = () => {
                                console.log('[ParallaxImg] watch: Image loaded');
                                this.parallaxImg();
                                img.removeEventListener('load', loadHandler);
                            };
                            img.addEventListener('load', loadHandler);
                            
                            // Fallback
                            setTimeout(() => {
                                if (!this.scrollTriggerInstance) {
                                    console.log('[ParallaxImg] watch: Fallback initialization');
                                    this.parallaxImg();
                                }
                            }, 500);
                        }
                    }
                });
            }
        }
    },
    mounted() {
        if (!process.client) return;
        
        console.log('[ParallaxImg] mounted called', { 
            src: this.src, 
            gsap: typeof gsap !== 'undefined',
            ScrollTrigger: typeof ScrollTrigger !== 'undefined',
            $el: this.$el
        });
        
        // GSAP 로드 확인
        if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
            console.error('[ParallaxImg] GSAP or ScrollTrigger not loaded! Retrying...');
            setTimeout(() => {
                if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
                    console.log('[ParallaxImg] GSAP loaded on retry');
                    this.initParallax();
                } else {
                    console.error('[ParallaxImg] GSAP still not loaded after retry');
                }
            }, 200);
            return;
        }
        
        this.checkMobile();
        window.addEventListener('resize', this.handleResize);
        this.initParallax();
    },
    activated() {
        if (!process.client) return;
        
        console.log('[ParallaxImg] activated, reinitializing...');
        
        // GSAP 로드 확인
        if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
            console.error('[ParallaxImg] activated - GSAP not loaded! Retrying...');
            setTimeout(() => {
                this.initParallax();
            }, 200);
            return;
        }
        
        this.$nextTick(() => {
            setTimeout(() => {
                this.initParallax();
            }, 100);
        });
    },
    beforeDestroy() {
        if (!process.client) return;
        
        console.log('[ParallaxImg] beforeDestroy - cleaning up');
        
        window.removeEventListener('resize', this.handleResize);
        
        if (this.scrollTriggerInstance) {
            this.scrollTriggerInstance.kill();
            this.scrollTriggerInstance = null;
        }
        
        // 모든 GSAP 애니메이션 제거 및 transform 초기화
        const img = this.$el?.querySelector('.img');
        if (img) {
            gsap.killTweensOf(img);
            gsap.set(img, { clearProps: 'all' });
        }
    },
    methods: {
        initParallax() {
            if (!process.client) return;
            
            this.$nextTick(() => {
                setTimeout(() => {
                    const img = this.$el?.querySelector('.img');
                    
                    console.log('[ParallaxImg] initParallax - img element:', img, 'complete:', img?.complete);
                    
                    if (img) {
                        if (img.complete && img.naturalWidth > 0) {
                            console.log('[ParallaxImg] Image already loaded, waiting for DOM...');
                            setTimeout(() => {
                                console.log('[ParallaxImg] Creating parallax after DOM ready');
                                this.parallaxImg();
                            }, 500);
                        } else {
                            console.log('[ParallaxImg] Waiting for image load...');
                            const loadHandler = () => {
                                console.log('[ParallaxImg] Image loaded, waiting for DOM...');
                                setTimeout(() => {
                                    this.parallaxImg();
                                }, 500);
                                img.removeEventListener('load', loadHandler);
                            };
                            img.addEventListener('load', loadHandler);
                            
                            setTimeout(() => {
                                if (!this.scrollTriggerInstance) {
                                    console.log('[ParallaxImg] Fallback initialization...');
                                    this.parallaxImg();
                                }
                            }, 1000);
                        }
                    } else {
                        console.error('[ParallaxImg] Image element not found!');
                    }
                }, 100);
            });
        },
        checkMobile() {
            if (!process.client) return;
            this.isMobile = window.innerWidth <= 768;
        },
        handleResize() {
            if (!process.client) return;
            
            const wasMobile = this.isMobile;
            this.checkMobile();
            
            if (wasMobile !== this.isMobile) {
                this.$nextTick(() => {
                    this.parallaxImg();
                });
            }
        },
        parallaxImg() {
            if (!process.client) return;
            
            console.log('[ParallaxImg] parallaxImg() called');
            
            const section = this.$el?.querySelector('.parallax-wrap');
            const img = this.$el?.querySelector('.img');

            console.log('[ParallaxImg] Elements:', { 
                section, 
                img, 
                sectionHeight: section?.offsetHeight, 
                imgHeight: img?.offsetHeight 
            });

            if (!section || !img) {
                console.error('[ParallaxImg] section or img not found!', { section, img });
                return;
            }

            if (this.scrollTriggerInstance) {
                console.log('[ParallaxImg] Killing existing ScrollTrigger');
                this.scrollTriggerInstance.kill();
                this.scrollTriggerInstance = null;
            }

            gsap.killTweensOf(img);
            
            gsap.set(img, { 
                clearProps: 'all',
                y: 0,
                x: 0,
                rotation: 0,
                scale: 1
            });

            console.log('[ParallaxImg] Transform cleared and reset to y:0');

            const yDistance = (section.offsetHeight - img.offsetHeight) * 0.5;

            console.log('[ParallaxImg] Creating ScrollTrigger', {
                yDistance,
                sectionHeight: section.offsetHeight,
                imgHeight: img.offsetHeight,
                src: this.src
            });

            try {
                
                const animation = gsap.to(img, {
                    scrollTrigger: {
                        trigger: section,
                        start: 'top bottom',
                        end: 'bottom top',
                        scrub: 1,
                        invalidateOnRefresh: true,
                        markers: false,
                        id: 'parallax-img',
                        // onUpdate: (self) => {
                        //     console.log('[ParallaxImg] ST onUpdate:', {
                        //         progress: self.progress.toFixed(3),
                        //         scrollY: window.scrollY
                        //     });
                        // },
                    },
                    y: yDistance,
                    ease: 'none',
                    onUpdate: function() {
                        const currentY = this.targets()[0]._gsap.y;
                    }
                });

                this.scrollTriggerInstance = animation.scrollTrigger;
                
                console.log('[ParallaxImg] ScrollTrigger created:', {
                    instance: this.scrollTriggerInstance,
                    trigger: this.scrollTriggerInstance.trigger,
                    start: this.scrollTriggerInstance.start,
                    end: this.scrollTriggerInstance.end,
                    scroller: this.scrollTriggerInstance.scroller
                });
                
                this.$nextTick(() => {
                    ScrollTrigger.refresh();
                    console.log('[ParallaxImg] ScrollTrigger refreshed');
                });
            } catch (error) {
                console.error('[ParallaxImg] Error creating ScrollTrigger:', error);
            }
        }
    },
}
</script>

<style lang='scss' scoped>
@use '@/assets/scss/base/variables.scss' as *;
    
#parallax-img {
    .parallax-wrap {
        background-color: $gray1;
        position: relative;
    }

    .parallax-cont {
        position: relative;
        overflow: hidden;
        padding-top: 72%;
    }

    .img {
        position: absolute;
        object-fit: cover;
        top: 0;
        width: 100%;
        height: 110%;
    }
}
</style>