<template>
    <div id='parallax-img' data-aos-disable>
        <div class='parallax-wrap'>
            <div class='parallax-cont' data-aos='fade-up'>
                <img
                    :src='currentSrc'
                    class='img'
                    loading='lazy'
                    decoding='async'
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
                
                if (this.scrollTriggerInstance) {
                    this.scrollTriggerInstance.kill();
                    this.scrollTriggerInstance = null;
                }
                
                this.$nextTick(() => {
                    const img = this.$el?.querySelector('.img');
                    
                    if (img) {
                        if (img.complete && img.naturalWidth > 0) {
                            setTimeout(() => {
                                this.parallaxImg();
                            }, 200);
                        } else {
                            const loadHandler = () => {
                                this.parallaxImg();
                                img.removeEventListener('load', loadHandler);
                            };
                            img.addEventListener('load', loadHandler);
                            
                            // Fallback
                            setTimeout(() => {
                                if (!this.scrollTriggerInstance) {
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
        
        // GSAP 로드 확인
        if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
            setTimeout(() => {
                if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
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
                
        // GSAP 로드 확인
        if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
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
                
        window.removeEventListener('resize', this.handleResize);
        
        if (this.scrollTriggerInstance) {
            this.scrollTriggerInstance.kill();
            this.scrollTriggerInstance = null;
        }
        
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
                const img = this.$el?.querySelector('.img');
                const section = this.$el?.querySelector('.parallax-wrap');
                
                if (img && section) {
                    gsap.set(img, { 
                        y: 0,
                        clearProps: 'transform'
                    });
                }
                                        
                if (img) {
                    if (img.complete && img.naturalWidth > 0) {
                        this.parallaxImg();
                    } else {
                        const loadHandler = () => {
                            this.parallaxImg();
                            img.removeEventListener('load', loadHandler);
                        };
                        img.addEventListener('load', loadHandler);
                        
                        setTimeout(() => {
                            if (!this.scrollTriggerInstance) {
                                this.parallaxImg();
                            }
                        }, 300);
                    }
                } else {
                    console.error('[ParallaxImg] Image element not found!');
                }
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
                        
            const section = this.$el?.querySelector('.parallax-wrap');
            const img = this.$el?.querySelector('.img');

            if (!section || !img) {
                console.error('[ParallaxImg] section or img not found!', { section, img });
                return;
            }

            if (this.scrollTriggerInstance) {
                this.scrollTriggerInstance.kill();
                this.scrollTriggerInstance = null;
            }

            gsap.killTweensOf(img);
            
            // 초기 위치 설정
            gsap.set(img, { 
                clearProps: 'all',
                y: 0,
                x: 0,
                rotation: 0,
                scale: 1,
                immediateRender: true
            });


            const imgHeight = img.offsetHeight;
            const sectionHeight = section.offsetHeight;
            const heightDiff = imgHeight - sectionHeight;
            
            const yDistance = heightDiff > 0 
                ? imgHeight * 0.2 // 이미지가 섹션보다 클 때
                : (sectionHeight - imgHeight) * 1; // 이미지가 섹션보다 작거나 같을 때

            try {
                const rect = section.getBoundingClientRect();
                const windowHeight = window.innerHeight;
                const isInView = rect.bottom > 0 && rect.top < windowHeight;
                
                const animation = gsap.to(img, {
                    scrollTrigger: {
                        trigger: section,
                        start: 'top bottom',
                        end: 'bottom top',
                        scrub: 1,
                        invalidateOnRefresh: true,
                        markers: false,
                        id: 'parallax-img',
                        immediateRender: false,
                    },
                    y: -yDistance,
                    ease: 'none',
                    immediateRender: false,
                });

                this.scrollTriggerInstance = animation.scrollTrigger;
                
                if (this.scrollTriggerInstance) {
                    this.scrollTriggerInstance.refresh();
                }
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
        height: 150%;
    }
}

// mobile
@media all and (max-width: $mobile) {
    #parallax-img {
        .parallax-cont {
            padding-top: 85.33%; // 375x320 비율 (320/375 = 0.8533)
        }
    }
}
</style>