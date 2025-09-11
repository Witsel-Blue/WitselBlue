<template>
    <div id='home'>
        <CursorCustom 
            :extra-class='cursorClass' 
            :showLottie='showLottie' 
            :animationData='animationData'
        />
        <section id='main' ref='main' @mouseenter='onMouseEnterMain' @mouseleave='onMouseLeaveMain'>
            <Mainvisual />
            <div class='inner'>
                <p class='subtext'>
                    frontend developer
                </p>
                <TextScroll :text="'WitselBlue'" />
            </div>
        </section>
        <div @mouseleave='onMouseLeaveMain'>
            <section class='profile' ref='profile'>
                <div class='inner'>
                    <div data-aos='fade-up'>
                        <ParallaxImg :src='profile.img' />
                    </div>
                    <div class='text'>
                        <TextStagger 
                            :paragraphs="[
                                'Hi,<br class=&quot;mb&quot;> this is <span class=&quot;mouse-hover1&quot;>WitselBlue</span> from Seoul.',
                                'I try to make <span class=&quot;mouse-hover1&quot;>interactive</span> websites',
                                'and <span class=&quot;mouse-hover1&quot;>scalable</span> clean codes.',
                                'My aim is to be <br class=&quot;mb&quot;>a <span class=&quot;mouse-hover1&quot;>frontend developer</span>',
                                'who can <span class=&quot;mouse-hover1&quot;>create</span> new experiences',
                                'beyond just obtaining information.'
                            ]"
                            triggerMode='middle'
                            speedMode='slow'
                        />
                        <div class='arrow' data-aos='fade-up'>
                            <span>hover texts!</span>
                            <Lottie :animationData='Arrow' />
                        </div>
                    </div>
                    <ul class='profile-hover-img'>
                        <li v-for='(img, idx) in profileHoverImgs'
                            :key='idx'
                            :class='{ active: activeHoverImgs[idx] }'
                            :style='{ top: img.y, left: img.x }'>
                            <img :src='img.src' alt='preview' />
                        </li>
                    </ul>
                </div>
                <TextMarquee text='witselblue' />
            </section>
            <section class='skills' ref='skills'>
                <div class='inner'>
                    <h1 class='subtitle ft-bagel txt-c'>
                        Skills
                    </h1>
                    <img src='@/assets/img/tablecloth.jpg' class='tablecloth' />
                    <img src='@/assets/img/candle.png' class='candle' />
                    <RandomSkillCard />
                </div>
            </section>
            <section class='selected' ref='selected' id='selected'>
                <ul class='container' ref='comp'>
                    <li
                        class='panel'
                        v-for='list in selected'
                        :key='list.slug'>
                        <div class='wrap'>
                            <SkewCardX :img='list.images.thumb' :path='`/projects/${list.slug}`' />
                            <div class='desc'>
                                <p class='work'>{{ list.tags.work }}</p>
                                <Nuxt-link 
                                    class='title mouse-hover1'
                                    :to='`/projects/${list.slug}`'
                                >
                                    <TextShifting :text='list.title' :key='list.slug'></TextShifting>
                                </Nuxt-link>
                            </div>
                        </div>
                    </li>
                </ul>
                <TextRotating text='selected' fontSize='4rem' />
            </section>
            <section class='about' ref='about'>
                <div class='inner'>
                    <h1 class='subtitle ft-bagel txt-c'>
                        About
                    </h1>
                    <ul class='txt-c' data-aos='fade-up'>
                        <li>
                            <h4>Skills & Strengths</h4>
                            <ul class='dot'>
                                <li>
                                    Vue, React, Drupal, pure HTML
                                </li>
                                <li>
                                    모션·애니메이션 기반 인터렉션 구현
                                </li>
                                <li>
                                    반응형 & 웹접근성 고려        
                                </li>
                            </ul>
                        </li>
                        <li>
                            <h4>Values</h4>
                            <ul class='dot'>
                                <li>
                                    확장성과 유지보수성을 고려한 코드
                                </li>
                                <li>
                                    기획, 디자인, 백엔드 기초 지식 보유
                                </li>
                                <li>
                                    1인 개발 경험, 여러 팀과 협력 경험 모두 보유
                                </li>
                            </ul>
                        </li>
                        <li>
                            <h4>Beyond Code</h4>
                            <ul class='dot'>
                                <li>
                                    키아누 리브스를 좋아합니다
                                </li>
                                <li>
                                    테크노 음악을 좋아합니다 (SebastiAn을 꼭 들어주세요)
                                </li>
                                <li>
                                    진과 싱글몰트 위스키를 좋아합니다
                                </li>
                            </ul>
                        </li>
                    </ul>
                </div>
            </section>
        </div>
    </div>
</template>

<script>
import projectsData from '@/assets/data/projects.js';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import CursorCustom from '@/components/CursorCustom.vue';
import Lottie from '@/components/Lottie.vue';
import Butterfly from '@/assets/lottie/butterfly.json';
import Arrow from '@/assets/lottie/arrow.json';
import Mainvisual from '@/layouts/Mainvisual.vue';
import TextScroll from '@/components/TextScroll.vue';
import ParallaxImg from '@/components/ParallaxImg.vue';
import SkewCardX from '@/components/SkewCardX.vue';
import TextShifting from '@/components/TextShifting.vue';
import TextMarquee from '@/components/TextMarquee.vue';
import TextRotating from '@/components/TextRotating.vue';
import TextStagger from '@/components/TextStagger.vue';
import RandomSkillCard from '@/components/RandomSkillCard.vue';

if (process.client) {
    gsap.registerPlugin(ScrollTrigger);
}

export default {
    name: 'Home',
    components: {
        CursorCustom,
        Lottie,
        Mainvisual,
        TextScroll,
        ParallaxImg,
        SkewCardX,
        TextShifting,
        TextMarquee,
        TextRotating,
        TextStagger,
        RandomSkillCard,
    },
    data() {
        return {
            cursorClass: 'cursor-main',
            showLottie: true,
            animationData: Butterfly,
            Arrow,
            profile : {
                img: require('@/assets/img/profile.png'),
            },
            activeHoverImgs: [false, false, false, false, false],
            profileHoverImgs: [
                { src: require('@/assets/img/profile_img4.png'), x: '110%', y: '50%' },
                { src: require('@/assets/img/profile_img2.png'), x: '0%', y: '42%' },
                { src: require('@/assets/img/profile_img1.png'), x: '102%', y: '38%' },
                { src: require('@/assets/img/profile_img5.png'), x: '-10%', y: '64%' },
                { src: require('@/assets/img/profile_img3.png'), x: '100%', y: '56%' },
            ],
            selected: [
                projectsData[2],
                projectsData[3],
                projectsData[4],
            ],
            selectedST: null,
            gsapContext: null,
            sectionEls: [],
            observer: null,
            wheelHandler: null,
            isScrolling: false,
            currentSectionIndex: 0, 
        }
    },
    mounted() {
        window.scrollTo({ top: 0 });
        this.initProfileImgHover();
        this.initSectionObserver();
        this.$nextTick(() => {
            this.scrollVertical();
            this.initSectionScroll();
        });
    },
    beforeDestroy() {
        if (this.gsapContext) this.gsapContext.revert();
        if (this.selectedST && typeof this.selectedST.kill === 'function') {
            try { this.selectedST.kill(true); } catch (err) {}
            this.selectedST = null;
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
        onMouseEnterMain() {
            this.cursorClass = 'cursor-main';
            this.showLottie = true;
        },
        onMouseLeaveMain() {
            this.cursorClass = '';
            this.showLottie = false;
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
        initSectionObserver() {
            // refs 모음
            const secs = [
                this.$refs.main,
                this.$refs.profile,
                this.$refs.skills,
                this.$refs.selected,
                this.$refs.about
            ].filter(Boolean);

            this.sectionEls = secs;

            // 여러 threshold로 더 정확한 ratio 측정
            const options = { root: null, rootMargin: '0px', threshold: [0.25, 0.5, 0.75] };

            this.observer = new IntersectionObserver((entries) => {
            // intersect 중인 것들 중 가장 큰 intersectionRatio를 가진 걸 현재 섹션으로 삼음
            const visible = entries.filter(en => en.isIntersecting);
            if (visible.length === 0) return;

            visible.sort((a, b) => b.intersectionRatio - a.intersectionRatio);
            const topEntry = visible[0];
            const idx = this.sectionEls.indexOf(topEntry.target);
            if (idx !== -1) {
                this.currentSectionIndex = idx;
                // console.log('[observer] currentSectionIndex', idx); // 디버그용
            }
            }, options);

            secs.forEach(sec => {
                try { this.observer.observe(sec); } catch (e) { /* ignore */ }
            });
        },
        scrollVertical() {
            if (window.innerWidth <= 425) return;

            const ctx = gsap.context(() => {
                const section = this.$refs.selected;
                if (!section) return;
                const container = section.querySelector('.container');
                if (!container) return;
                const panels = container.querySelectorAll(':scope > .panel');
                if (!panels.length) return;

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
                    }
                });

                if (tween && tween.scrollTrigger) {
                    this.selectedST = tween.scrollTrigger;
                }
            }, this.$refs.selected);

            this.gsapContext = ctx;
        },
        initSectionScroll() {
            const sections = this.sectionEls;
            if (!sections || sections.length === 0) return;

            const getTop = (el) => (el.getBoundingClientRect().top + window.scrollY);

            this.wheelHandler = (e) => {
                if (this.isScrolling) return;

                const delta = e.deltaY;
                if (!delta) return;
                // 트랙패드/마우스 노이즈 방지용 임계값 (환경에 따라 조정)
                if (Math.abs(delta) < 6) return;

                let currentIndex = (typeof this.currentSectionIndex === 'number') ? this.currentSectionIndex : -1;

                if (currentIndex === -1) {
                    const centerY = window.innerHeight / 2;
                    currentIndex = sections.findIndex(sec => {
                    if (!sec) return false;
                    const r = sec.getBoundingClientRect();
                    return r.top <= centerY && r.bottom > centerY;
                    });
                }

                if (currentIndex === -1) return;

                const currentSection = sections[currentIndex];

                // skills -> selected
                if (currentSection === this.$refs.skills && delta > 0) {
                    e.preventDefault();
                    this.isScrolling = true;
                    const targetY = getTop(this.$refs.selected);
                    this.smoothScrollTo(targetY, 700, () => { this.isScrolling = false; });
                    return;
                }

                // selected 내부
                if (currentSection === this.$refs.selected) {
                    let progress = 0;
                    const st = this.selectedST || (ScrollTrigger.getById ? ScrollTrigger.getById('selected') : null);

                    if (st && typeof st.progress === 'number') {
                    progress = st.progress;
                    } else {
                    const container = this.$refs.selected.querySelector('.container');
                    const rect = this.$refs.selected.getBoundingClientRect();
                    const startScrollY = window.scrollY - rect.top;
                    const containerWidth = container ? container.scrollWidth : window.innerWidth;
                    progress = containerWidth ? Math.min(Math.max((window.scrollY - startScrollY) / containerWidth, 0), 1) : 0;
                    }

                    if (delta > 0 && progress >= 0.95) {
                        e.preventDefault();
                        this.isScrolling = true;
                        const targetY = getTop(this.$refs.about);
                        this.smoothScrollTo(targetY, 700, () => { this.isScrolling = false; });
                    } else if (delta < 0 && progress <= 0.05) {
                        e.preventDefault();
                        this.isScrolling = true;
                        const targetY = getTop(this.$refs.skills);
                        this.smoothScrollTo(targetY, 700, () => { this.isScrolling = false; });
                    }
                    return;
                }

                // 일반 섹션 스냅
                let targetIndex = currentIndex;
                if (delta > 0 && currentIndex < sections.length - 1) targetIndex++;
                else if (delta < 0 && currentIndex > 0) targetIndex--;
                else return;

                e.preventDefault();
                this.isScrolling = true;
                const targetY = getTop(sections[targetIndex]);
                this.smoothScrollTo(targetY, 700, () => { this.isScrolling = false; });
            };

            window.addEventListener('wheel', this.wheelHandler, { passive: false });
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
    
    }
}
</script>

<style lang='scss' scoped>
    @import '@/assets/scss/layout/home.scss';
</style>