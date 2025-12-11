<template>
    <div id='home' ref='home'>
        <section id='main' ref='main' 
            @mouseenter='onMouseEnterMain'
            @mouseleave='onMouseLeaveMain'
            :class="{ 'use-vh-fix': useVhFix }"
        >
            <Mainvisual ref='mainvisual' />
            <div class='inner'>
                <div class='text' ref='menuButton'>
                    <span>menu button!</span>
                </div>
                <p class='subtext' ref='subtext'>
                    {{ $t('home.mainSub') }}
                </p>
                <TextScroll :text="$t('home.mainTitle')" ref='textScroll' />
                <ButtonSccrollDown ref='scrollDown' />
            </div>
        </section>
        <div @mouseleave='onMouseLeaveMain'>
            <div class='bumper' ref='bumper'></div>
            <section class='profile' ref='profile'>
                <div class='inner'>
                    <div v-scroll-animate='{ once: false }'>
                        <ParallaxImg :src='profile.img' />
                    </div>
                    <div class='arrow' v-scroll-animate='{ start: "top 50%", once: false, x: -80, y: 0 }'>
                        <span class='pc'>{{ $t('home.arrowText.pc') }}</span>
                        <span class='mb'>{{ $t('home.arrowText.mb') }}</span>
                        <Lottie :animationData='Arrow' />
                    </div>
                    <div class='text'>
                        <TextStagger 
                            :paragraphs="$t('home.profileParagraphs')"
                            :hoverImages='profileHoverImgs'
                            triggerMode='middle'
                            speedMode='slow'
                            :key='$i18n.locale'
                            @hover-enter='(idx) => $set(activeHoverImgs, idx, true)'
                            @hover-leave='(idx) => $set(activeHoverImgs, idx, false)'
                        />
                    </div>
                    <ul class='profile-hover-img'>
                        <li v-for='(img, idx) in profileHoverImgs'
                            :key='idx'
                            :class='{ active: activeHoverImgs[idx] }'
                            :style='{ top: img.y, left: img.x }'>
                            <img :src='img.src' alt='preview' loading='lazy' />
                        </li>
                    </ul>
                </div>
                <TextMarquee text='witselblue' />
            </section>
            <section class='selected' ref='selected' id='selected'>
                <ul class='container' ref='comp'>
                    <li
                        class='panel'
                        v-for='list in selected'
                        :key='list.slug'
                    >
                        <div class='wrap'>
                            <div class='cat'>
                                {{ list.category }}
                            </div>
                            <SkewCardX :img='list.images.thumb' :path='getPath(list)' />
                            <div class='desc'>
                                <p class='work'>{{ list.tags.work[$i18n.locale] }}</p>
                                <Nuxt-link 
                                    class='title mouse-hover1'
                                    :to='getPath(list)'
                                >
                                    <TextShifting :text='list.title[$i18n.locale]' :key='list.slug'></TextShifting>
                                </Nuxt-link>
                            </div>
                        </div>
                    </li>
                </ul>
                <TextRotating text='selected' fontSize='4rem' />
            </section>
            <section class='skills' ref='skills' v-scroll-animate>
                <div class='divider'>
                    <Wave />
                </div>
                <div class='content'>
                    <TextTyping ref='skillsTyping' text='what am i good at?' :backspace='false' :autoplay='false' />
                    <p class='subtext' v-scroll-animate='{ start: "top 50%" }'>{{ $t('home.skillsText') }}</p>
                    <div v-scroll-animate='{ start: "top 50%" }'>
                        <RandomSkillCard />
                    </div>
                </div>
                <div class='divider rev'>
                    <Wave />
                </div>
            </section>
            <section class='cover' ref='cover' v-scroll-animate='{ once: false }'>
                <div class='inner'>
                    <TextTyping ref='coverTyping' text='how did I get here?' :backspace='false' :autoplay='false' />
                </div>
            </section>
            <section class='history' ref='history'>
                <div class='inner'>
                    <div class='anim'>
                        <div class='start'>{{ $t('home.historyText') }}</div>
                        <History v-if='showHistory && !isMobile' />
                        <HistoryMobile v-if='showHistory && isMobile' />
                        <div class='bumper'></div>
                        <div class='end' ref='end'>
                            <TextTyping ref='endTyping' text="what's next?" :backspace='false' :autoplay='false' />
                        </div>
                    </div>
                </div>
            </section>
        </div>
    </div>
</template>

<script>
import projectsData from '@/assets/data/projects.js';
import archiveDevData from '@/assets/data/archive_dev.js';
import archiveMusicData from '@/assets/data/archive_music.js'
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import Lottie from '@/components/Lottie.vue';
import Butterfly from '@/assets/lottie/butterfly.json';
import Arrow from '@/assets/lottie/arrow.json';
import Mainvisual from '@/layouts/Mainvisual.vue';
import TextScroll from '@/components/TextScroll.vue';
import ButtonSccrollDown from '@/components/ButtonScrollDown.vue';
import ParallaxImg from '@/components/ParallaxImg.vue';
import SkewCardX from '@/components/SkewCardX.vue';
import TextShifting from '@/components/TextShifting.vue';
import TextMarquee from '@/components/TextMarquee.vue';
import TextRotating from '@/components/TextRotating.vue';
import TextStagger from '@/components/TextStagger.vue';
import RandomSkillCard from '@/components/RandomSkillCard.vue';
import TextTyping from '@/components/TextTyping.vue';
import History from '@/components/History.vue';
import HistoryMobile from '@/components/HistoryMobile.vue';
import Wave from '@/components/Wave.vue';

if (process.client) {
    gsap.registerPlugin(ScrollTrigger);
}

export default {
    name: 'Home',
    components: {
        Lottie,
        Mainvisual,
        ButtonSccrollDown,
        TextScroll,
        ParallaxImg,
        SkewCardX,
        TextShifting,
        TextMarquee,
        TextRotating,
        TextStagger,
        RandomSkillCard,
        TextTyping,
        History,
        HistoryMobile,
        Wave,
    },
    data() {
        return {
            Arrow,
            profile : {
                img: require('@/assets/img/home/profile.png'),
            },
            activeHoverImgs: [false, false, false, false, false],
            profileHoverImgs: [
                { src: require('@/assets/img/home/profile_img4.png'), x: '110%', y: '50%' },
                { src: require('@/assets/img/home/profile_img2.png'), x: '0%', y: '42%' },
                { src: require('@/assets/img/home/profile_img1.png'), x: '102%', y: '38%' },
                { src: require('@/assets/img/home/profile_img5.png'), x: '-10%', y: '64%' },
                { src: require('@/assets/img/home/profile_img3.png'), x: '100%', y: '56%' },
            ],
            selected: [
                { ...projectsData[2], category: 'projects' },
                { ...projectsData[4], category: 'projects' },
                // { ...archiveDevData[4], category: 'development' },
                { ...archiveDevData[0], category: 'development' },
                // { ...archiveMusicData[0], category: 'music' },
                { ...archiveMusicData[2], category: 'music' },
            ],
            selectedST: null,
            gsapContext: null,
            sectionEls: [],
            observer: null,
            wheelHandler: null,
            isScrolling: false,
            currentSectionIndex: 0,
            useVhFix: false,
            homeBgSt: null,
            showHistory: true,
            isMobile: false,
            lottiePlayed: false,
            typingSTs: [],
        }
    },
    mounted() {
        // this.setVhFix();
        this.checkMobile();
        window.addEventListener('resize', this.handleResize);
        // window.addEventListener('resize', this.setVhFix);

        this.handleResetBgScroll = () => {
            this.$nextTick(() => {
                setTimeout(() => {
                    if (this.gsapContext) {
                        this.gsapContext.revert();
                        this.gsapContext = null;
                    }
                    if (this.selectedST && typeof this.selectedST.kill === 'function') {
                        try { this.selectedST.kill(true); } catch (err) {}
                        this.selectedST = null;
                    }
                    
                    this.initBgScroll();
                    this.scrollVertical();
                }, 300);
            });
        };
        window.addEventListener('reset-home-bg', this.handleResetBgScroll);

        // GSAP 로드 체크
        if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
            console.error('[Home] GSAP or ScrollTrigger not loaded! Retrying...');
            setTimeout(() => {
                if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
                    this.initHomeAnimations();
                } else {
                    console.error('[Home] GSAP still not loaded after retry');
                    setTimeout(() => {
                        if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
                            this.initHomeAnimations();
                        } else {
                            console.error('[Home] GSAP failed to load');
                        }
                    }, 500);
                }
            }, 300);
            return;
        }

        this.$nextTick(() => {
            setTimeout(() => {
                this.initHomeAnimations();
            }, 500);
        });
    },
    activated() {        
        // GSAP 로드 체크
        if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
            console.error('[Home] activated - GSAP not loaded! Retrying...');
            setTimeout(() => {
                if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
                    this.$nextTick(() => {
                        setTimeout(() => {
                            this.initBgScroll();
                        }, 300);
                    });
                }
            }, 300);
            return;
        }
        
        this.$nextTick(() => {
            setTimeout(() => {
                this.initBgScroll();
            }, 300);
        });
    },
    beforeDestroy() {        
        // window.removeEventListener('resize', this.setVhFix);
        window.removeEventListener('resize', this.handleResize);
        window.removeEventListener('reset-home-bg', this.handleResetBgScroll);
        
        if (typeof ScrollTrigger !== 'undefined') {
            ScrollTrigger.getAll().forEach(st => {
                const id = st.vars && st.vars.id;
                if (id === 'home-bg' || id === 'selected') {
                    try { st.kill(true); } catch (e) {}
                }
            });
        }
        
        if (this.gsapContext) {
            try { this.gsapContext.revert(); } catch (e) {}
            this.gsapContext = null;
        }
        if (this.homeBgST) {
            try { this.homeBgST.kill(); } catch (e) {}
            this.homeBgST = null;
        }
        if (this.selectedST) {
            try { this.selectedST.kill(true); } catch (e) {}
            this.selectedST = null;
        }
        if (this.typingSTs && this.typingSTs.length > 0) {
            this.typingSTs.forEach(st => {
                try { st.kill(true); } catch (e) {}
            });
            this.typingSTs = [];
        }
        if (this.observer) {
            try { this.observer.disconnect(); } catch (e) {}
            this.observer = null;
        }
        if (this.wheelHandler) {
            try { window.removeEventListener('wheel', this.wheelHandler, { passive: false }); } catch (e) {
                try { window.removeEventListener('wheel', this.wheelHandler); } catch (e2) {}
            }
            this.wheelHandler = null;
        }
    },
    methods: {
        reinitializeHome(retryCount = 0) {            
            if (retryCount > 5) {
                console.error('[Home] Max retry count reached, aborting reinitialize');
                return;
            }
            
            if (typeof ScrollTrigger !== 'undefined') {
                ScrollTrigger.getAll().forEach(st => {
                    const id = st.vars && st.vars.id;
                    if (id === 'home-bg' || id === 'selected') {
                        try { st.kill(true); } catch (e) {}
                    }
                });
            }
            
            if (this.gsapContext) {
                try { this.gsapContext.revert(); } catch (e) {}
                this.gsapContext = null;
            }
            if (this.selectedST) {
                this.selectedST = null;
            }
            if (this.homeBgST) {
                this.homeBgST = null;
            }
            
            this.$nextTick(() => {
                setTimeout(() => {
                    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
                        console.error('[Home] GSAP not loaded during reinitialize, retrying...');
                        setTimeout(() => {
                            this.reinitializeHome(retryCount + 1);
                        }, 500);
                        return;
                    }
                    
                    const bumper = document.querySelector('.bumper');
                    const homeEl = document.querySelector('#home');
                    
                    if (!bumper || !homeEl) {
                        console.warn('[Home] DOM elements not ready, retrying...', { bumper: !!bumper, homeEl: !!homeEl });
                        setTimeout(() => {
                            this.reinitializeHome(retryCount + 1);
                        }, 500);
                        return;
                    }
                                        
                    const scrollY = window.scrollY;                    
                    this.initBgScroll();
                    
                    setTimeout(() => {
                        this.scrollVertical();
                        
                        setTimeout(() => {
                            ScrollTrigger.refresh();
                        }, 500);
                    }, 300);
                }, 1000);
            });
        },
        initHomeAnimations() {            
            const showIntro = this.$store.state.showIntro;
            
            // Intro가 있을 때 배경색을 초기에 하늘색으로 설정
            if (showIntro) {
                const homeEl = this.$refs.home;
                if (homeEl) {
                    homeEl.style.background = '#8BA1BC';
                }
            }
            
            // Intro가 없을 때만 즉시 ScrollTrigger 생성
            if (!showIntro) {
                this.initBgScroll();
                this.$nextTick(() => {
                    this.scrollVertical();
                });
            }
            
            this.initProfileImgHover();

            const mainRect = this.$refs.main?.getBoundingClientRect();
            const centerY = window.innerHeight / 2;
            if (mainRect && mainRect.top <= centerY && mainRect.bottom > centerY) {
                this.$store.commit('cursor/setCursorClass', 'cursor-main');
                this.$store.commit('cursor/setCursorAnimation', Butterfly);
                this.$store.commit('cursor/setCursorLottie', true);
            }
            
            this.$nextTick(() => {
                setTimeout(() => {
                    this.initFadeIn();
                    this.initTypingAnimations();
                }, 100);
            });
        },
        initFadeIn() {
            const showIntro = this.$store.state.showIntro;
            
            if (showIntro === true) {
                this.$nextTick(() => {
                    if (this.$refs.mainvisual) {
                        gsap.set(this.$refs.mainvisual.$el, { 
                            opacity: 0,
                        });
                    }
                    if (this.$refs.subtext) {
                        const viewportCenter = window.innerHeight / 2;
                        const elementTop = this.$refs.subtext.getBoundingClientRect().top;
                        const offsetY = viewportCenter - elementTop - (window.innerHeight * 0.08) - 16;
                        gsap.set(this.$refs.subtext, { 
                            opacity: 0, 
                            y: offsetY
                        });
                    }
                    if (this.$refs.textScroll) {
                        const viewportCenter = window.innerHeight / 2;
                        const elementTop = this.$refs.textScroll.$el.getBoundingClientRect().top;
                        const offsetY = viewportCenter - elementTop - (window.innerHeight * 0.08);
                        gsap.set(this.$refs.textScroll.$el, { 
                            opacity: 0, 
                            y: offsetY
                        });
                    }
                    if (this.$refs.menuButton) {
                        gsap.set(this.$refs.menuButton, { opacity: 0 });
                    }
                    if (this.$refs.scrollDown) {
                        gsap.set(this.$refs.scrollDown.$el, { opacity: 0 });
                    }
                });
                
                window.addEventListener('intro-end', this.handleIntroEnd, { once: true });
            }
        },
        handleIntroEnd() {
            this.showHistory = false;
            
            // 1. Subtext - 페이드인
            setTimeout(() => {
                if (this.$refs.subtext) {
                    gsap.to(this.$refs.subtext, { 
                        opacity: 1, 
                        ease: 'power3.out' 
                    });
                }
            }, 0);

            // 2. TextScroll - 페이드인
            setTimeout(() => {
                if (this.$refs.textScroll) {
                    gsap.to(this.$refs.textScroll.$el, { 
                        opacity: 1, 
                    });
                }
            }, 500);

            // 3. Subtext - 화면 중앙에서 원래 위치로 이동
            setTimeout(() => {
                if (this.$refs.subtext) {
                    gsap.to(this.$refs.subtext, { 
                        y: 0, 
                        duration: 1.2, 
                        ease: 'power3.out' 
                    });
                }
                if (this.$refs.textScroll) {
                    gsap.to(this.$refs.textScroll.$el, { 
                        y: 0, 
                        duration: 1.2, 
                        ease: 'power3.out' 
                    });
                }
            }, 1000);

            // 3. Mainvisual - 페이드인 + 스케일 확대
            setTimeout(() => {
                if (this.$refs.mainvisual) {
                    gsap.to(this.$refs.mainvisual.$el, { 
                        opacity: 1,
                        duration: 1.2, 
                        ease: 'power3.out' 
                    });
                }
            }, 1500);
            
            // 5. GNB & MenuButton & ScrollDown - 페이드인
            setTimeout(() => {
                window.dispatchEvent(new Event('fade-in-gnb'));
                if (this.$refs.menuButton) {
                    gsap.to(this.$refs.menuButton, { 
                        opacity: 1, 
                        duration: 0.8, 
                        ease: 'power2.out' 
                    });
                }
                if (this.$refs.scrollDown) {
                    gsap.to(this.$refs.scrollDown.$el, { 
                        opacity: 1, 
                        duration: 0.8, 
                        ease: 'power2.out' 
                    });
                }
                
                // 모든 애니메이션 완료 후 스크롤
                setTimeout(() => {
                    document.body.style.overflow = '';
                    document.body.style.height = '';
                    document.documentElement.style.overflow = '';
                    document.documentElement.style.height = '';
                    
                    window.dispatchEvent(new Event('remount-pager'));
                    
                    this.$nextTick(() => {
                        this.showHistory = true;
                    });
                                        
                    this.$nextTick(() => {
                        setTimeout(() => {
                            this.initBgScroll();
                            this.scrollVertical();
                            
                            setTimeout(() => {
                                ScrollTrigger.refresh();
                            }, 300);
                        }, 200);
                    });
                }, 400);
            }, 2000);
        },
        onMouseEnterMain() {
            this.$store.commit('cursor/setCursorClass', 'cursor-main');
            this.$store.commit('cursor/setCursorAnimation', Butterfly);
            this.$store.commit('cursor/setCursorLottie', true);
        },
        onMouseLeaveMain() {
            this.$store.commit('cursor/setCursorClass', '');
            this.$store.commit('cursor/setCursorAnimation', null);
            this.$store.commit('cursor/setCursorLottie', false);
        },
        setCursorInitialState() {
            const mainRect = this.$refs.main?.getBoundingClientRect();
            if (!mainRect) return;

            const centerY = window.innerHeight / 2;
            if (mainRect.top <= centerY && mainRect.bottom > centerY) {
                this.cursorClass = 'cursor-main';
                this.showLottie = true;
            } else {
                this.cursorClass = '';
                this.showLottie = false;
            }
        },
        initBgScroll() {
            const bumper = this.$refs.bumper;
            const homeEl = this.$refs.home;
            if (!bumper || !homeEl) {
                console.log('[Home] initBgScroll - bumper or homeEl not found');
                return;
            }

            if (this.homeBgST) {
                this.homeBgST.kill();
                this.homeBgST = null;
            }

            this.$nextTick(() => {
                let useDarkBg = true;
                if (window.scrollY === 0) {
                    useDarkBg = true;
                } else {
                    const rect = bumper.getBoundingClientRect();
                    useDarkBg = rect.top > 0;
                }

                const initialBg = useDarkBg ? '#8BA1BC' : '#f7f7f7';
                homeEl.style.background = initialBg;

                this.homeBgST = gsap.to(homeEl, {
                    background: '#f7f7f7',
                    ease: 'none',
                    scrollTrigger: {
                        trigger: bumper,
                        start: 'top 100%',
                        end: 'top top',
                        scrub: true,
                        invalidateOnRefresh: true,
                        id: 'home-bg'
                    }
                });
                
                setTimeout(() => {
                    ScrollTrigger.refresh();
                }, 300);
            });
        },
        initProfileImgHover() {
            const spans = this.$el.querySelectorAll('.profile .mouse-hover1');
            spans.forEach((span, index) => {
                span.addEventListener('mouseenter', () => {
                    this.$set(this.activeHoverImgs, index, true);
                });
                span.addEventListener('mouseleave', () => {
                    this.$set(this.activeHoverImgs, index, false);
                });
            });
        },
        scrollVertical() {
            const ctx = gsap.context(() => {
                const section = this.$refs.selected;
                if (!section) {
                    return;
                }
                const container = section.querySelector('.container');
                if (!container) {
                    return;
                }
                const panels = container.querySelectorAll(':scope > .panel');
                if (!panels.length) {
                    return;
                }

                container.style.display = 'flex';
                container.style.willChange = 'transform';

                const tween = gsap.to(panels, {
                    xPercent: -100 * (panels.length - 1),
                    ease: 'none',
                    scrollTrigger: {
                        id: 'selected',
                        trigger: section,
                        start: 'top top',
                        pin: true,
                        scrub: 0.5,
                        end: () => `+=${container.scrollWidth}`,
                        invalidateOnRefresh: true
                    }
                });

                if (tween && tween.scrollTrigger) {
                    this.selectedST = tween.scrollTrigger;
                }
            }, this.$refs.selected);

            this.gsapContext = ctx;
                        
            this.$nextTick(() => {
                setTimeout(() => {
                    ScrollTrigger.refresh();
                }, 300);
            });
        },
        initTypingAnimations() {
            if (typeof ScrollTrigger === 'undefined') {
                return;
            }

            // skills 섹션의 TextTyping
            if (this.$refs.skillsTyping) {
                const skillsST = ScrollTrigger.create({
                    trigger: this.$refs.skills,
                    start: 'top center',
                    onEnter: () => {
                        if (this.$refs.skillsTyping) {
                            this.$refs.skillsTyping.startTyping();
                        }
                        skillsST.kill();
                    },
                    once: true
                });
                this.typingSTs.push(skillsST);
            }

            // cover 섹션의 TextTyping
            if (this.$refs.coverTyping && this.$refs.coverTyping.$el) {
                const coverST = ScrollTrigger.create({
                    trigger: this.$refs.coverTyping.$el,
                    start: 'center center',
                    onEnter: () => {
                        if (this.$refs.coverTyping) {
                            this.$refs.coverTyping.startTyping();
                        }
                        coverST.kill();
                    },
                    once: true
                });
                this.typingSTs.push(coverST);
            }

            // end div의 TextTyping
            if (this.$refs.endTyping && this.$refs.end) {
                const endST = ScrollTrigger.create({
                    trigger: this.$refs.end,
                    start: 'top center',
                    onEnter: () => {
                        if (this.$refs.endTyping) {
                            this.$refs.endTyping.startTyping();
                        }
                        endST.kill();
                    },
                    once: true
                });
                this.typingSTs.push(endST);
            }
        },
        smoothScrollTo(targetY, duration = 800, callback) {
            const startY = window.scrollY;
            const distance = targetY - startY;
            let startTime = null;

            const animate = (currentTime) => {
                if (!startTime) startTime = currentTime;
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                const ease = 0.5 - Math.cos(progress * Math.PI) / 2;

                window.scrollTo(0, startY + distance * ease);

                if (progress < 1) {
                    requestAnimationFrame(animate);
                } else if (callback) {
                    callback();
                }
            };

            requestAnimationFrame(animate);
        },
        getPath(item) {
            const mapping = {
                projects: 'projects',
                development: 'archive/dev',
                music: 'archive/music',
            }
            const basePath = `/${mapping[item.category]}/${item.slug}`;
            const currentLocale = this.$i18n.locale;
            return currentLocale === 'en' ? basePath : `/${currentLocale}${basePath}`;
        },
        checkMobile() {
            if (process.client) {
                this.isMobile = window.innerWidth <= 425;
            }
        },
        handleResize() {
            this.checkMobile();
        },
        setVhFix() {
            const ua = navigator.userAgent.toLowerCase();
            const isMobile = /iphone|ipad|ipod|android/.test(ua);
            const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

            this.useVhFix = isMobile || isSafari;

            if (this.useVhFix) {
                const vh = window.innerHeight * 0.01;
                document.documentElement.style.setProperty('--vh', `${vh}px`);
            } else {
                document.documentElement.style.removeProperty('--vh');
            }
        },
    }
}
</script>

<style lang='scss' scoped>
    @import '@/assets/scss/layout/home.scss';
</style>