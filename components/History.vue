<template>
    <div id='history' ref='history'>
        <svg ref='svg' width='592' height='1198' viewBox='0 0 592 1198' fill='none' xmlns='http://www.w3.org/2000/svg'>
            
            <!-- 배경 path  -->
            <path ref='pathBg' id='history-path-bg' d='M140 1C287.5 103.5 495 106 495 202C495 298 85.0003 337 85.0003 493.5C85.0003 650 583 582.5 583 851C583 1119.5 278 1032 1.00024 1194' stroke='#EDEDED' stroke-width='2' stroke-linecap='round'/>

            <!-- 연도 텍스트 -->
            <g v-for='year in years' :key='year.id' :ref='`yearGroup${year.id}`'>
                <text 
                    :ref='`year${year.id}`'
                    class='year-text'
                    text-anchor='middle'
                    dominant-baseline='middle'
                    fill='#3E3C3C'
                    font-size='24'
                    font-weight='700'
                    x='0'
                    y='0'
                >
                    {{ year.label }}
                </text>
            </g>
            
            <!-- 진행된 path -->
            <path ref='path' id='history-path' d='M140 1C287.5 103.5 495 106 495 202C495 298 85.0003 337 85.0003 493.5C85.0003 650 583 582.5 583 851C583 1119.5 278 1032 1.00024 1194' stroke='#3E3C3C' stroke-width='2' stroke-linecap='round'/>
            
            <!-- 트리거: Circle, Title, Text -->
            <g v-for='trigger in triggers' :key='`trigger-${trigger.id}`'>
                <circle 
                    :ref='`trigger${trigger.id}`'
                    class='trigger-circle'
                    r='5'
                    fill='#f7f7f7'
                    stroke='#3E3C3C'
                    stroke-width='2'
                />
                <foreignObject 
                    :ref='`triggerTitle${trigger.id}`'
                    width='240'
                    height='100'
                    x='0'
                    y='0'
                    overflow='visible'
                >
                    <div 
                        :ref='`triggerTitleContent${trigger.id}`'
                        class='trigger-title'
                        :style="{
                            textAlign: trigger.anchor === 'right' ? 'left' : 'right'
                        }"
                        xmlns='http://www.w3.org/1999/xhtml'
                    >
                        {{ trigger.title }}
                    </div>
                </foreignObject>
                <foreignObject 
                    v-if='trigger.text'
                    :ref='`triggerText${trigger.id}`'
                    width='280'
                    height='100'
                    x='0'
                    y='0'
                    overflow='visible'
                >
                    <div 
                        :ref='`triggerTextContent${trigger.id}`'
                        class='trigger-text'
                        :style="{
                            textAlign: trigger.anchor === 'right' ? 'left' : 'right'
                        }"
                        xmlns='http://www.w3.org/1999/xhtml'
                    >
                        {{ trigger.text }}
                    </div>
                </foreignObject>
            </g>
            
            <!-- Image -->
            <g v-for='trigger in triggers' :key='`image-${trigger.id}`'>
                <foreignObject 
                    v-if='trigger.image'
                    :ref='`triggerImage${trigger.id}`'
                    width='240'
                    height='300'
                    x='0'
                    y='0'
                    class='trigger-image-container'
                >
                    <div 
                        class='trigger-image-wrapper'
                        xmlns='http://www.w3.org/1999/xhtml'
                    >
                        <img 
                            :src='trigger.image'
                            class='trigger-image'
                            alt=''
                        />
                    </div>
                </foreignObject>
            </g>
            
            <!-- Moving Dot -->
            <circle 
                ref='dot' 
                id='moving-dot'
                r='4'
                fill='#3E3C3C'
            />
            
        </svg>
    </div>
</template>

<script>
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import { MotionPathPlugin } from 'gsap/dist/MotionPathPlugin';

if (process.client) {
    gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);
}

export default {
    name: 'History',
    data() {
        return {
            scrollTriggerInstance: null,
            triggerProgress: [
                { id: 1, progress: 0.06, anchor: 'right', image: require('@/assets/img/home/history1.png') },
                { id: 2, progress: 0.2, anchor: 'left', image: require('@/assets/img/home/history2.png') },
                { id: 3, progress: 0.38, anchor: 'right', image: require('@/assets/img/home/history3.png') },
                { id: 4, progress: 0.55, anchor: 'left', image: require('@/assets/img/home/history4.png') },
                { id: 5, progress: 0.68, anchor: 'left', image: require('@/assets/img/home/history5.png') },
                { id: 6, progress: 0.82, anchor: 'left', image: require('@/assets/img/home/history6.png') },
                { id: 7, progress: 1, anchor: 'right', image: require('@/assets/img/home/history7.png') }
            ],
            years: [
                { id: 1, progress: 0, label: '2010' },
                { id: 2, progress: 0.15, label: '2018' },
                { id: 3, progress: 0.3, label: '2020' },
                { id: 4, progress: 0.44, label: '2021' },
                { id: 5, progress: 0.62, label: '2022' },
                { id: 6, progress: 0.75, label: '2024' },
                { id: 7, progress: 0.92, label: '2025' }
            ],
            currentTrigger: null,
            activatedYears: [],
            activatedTriggers: [],
        }
    },
    computed: {
        triggers() {
            const i18nTriggers = this.$t('history.triggers');
            return this.triggerProgress.map((item, index) => ({
                ...item,
                title: i18nTriggers[index]?.title || '',
                text: i18nTriggers[index]?.text || '',
                textAnchor: item.anchor === 'right' ? 'start' : 'end'
            }));
        }
    },
    mounted() {
        if (!process.client) return;
        
        this.currentTrigger = null;
        this.activatedYears = [];
        this.activatedTriggers = [];
        
        // GSAP 로드 체크
        if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
            console.error('[History] GSAP or ScrollTrigger not loaded! Retrying...');
            setTimeout(() => {
                if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
                    this.initHistory();
                } else {
                    console.error('[History] GSAP still not loaded after retry');
                    setTimeout(() => {
                        if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
                            this.initHistory();
                        } else {
                            console.error('[History] GSAP failed to load');
                        }
                    }, 500);
                }
            }, 300);
            return;
        }
        
        window.addEventListener('resize', this.handleResize);
        
        this.$nextTick(() => {
            setTimeout(() => {
                this.initHistory();
            }, 100);
        });
    },
    activated() {
        if (!process.client) return;
                
        // 초기화
        if (this.scrollTriggerInstance) {
            try {
                this.scrollTriggerInstance.kill(true);
                this.scrollTriggerInstance = null;
            } catch (e) {
                console.error('[History] Error killing ScrollTrigger:', e);
            }
            
            this.currentTrigger = null;
            this.activatedYears = [];
            this.activatedTriggers = [];
            
            this.$nextTick(() => {
                setTimeout(() => {
                    this.initHistory();
                }, 200);
            });
        }
    },
    beforeDestroy() {
        if (!process.client) return;
                
        if (this.scrollTriggerInstance) {
            try {
                this.scrollTriggerInstance.kill();
            } catch (e) {}
            this.scrollTriggerInstance = null;
        }
        
        this.currentTrigger = null;
        this.activatedYears = [];
        this.activatedTriggers = [];
        
        window.removeEventListener('resize', this.handleResize);
    },
    methods: {
        reinitializeHistory(retryCount = 0) {
            if (!process.client) return;
                        
            if (retryCount > 5) {
                console.error('[History] Max retry count reached, aborting reinitialize');
                return;
            }
            
            if (this.scrollTriggerInstance) {
                try { this.scrollTriggerInstance.kill(); } catch (e) {}
                this.scrollTriggerInstance = null;
            }
            
            this.currentTrigger = null;
            this.activatedYears = [];
            this.activatedTriggers = [];
            
            this.$nextTick(() => {
                setTimeout(() => {
                    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
                        console.error('[History] GSAP not loaded during reinitialize, retrying...');
                        setTimeout(() => {
                            this.reinitializeHistory(retryCount + 1);
                        }, 500);
                        return;
                    }
                    
                    const path = this.$refs.path;
                    const dot = this.$refs.dot;
                    const history = this.$refs.history;
                    
                    if (!path || !dot || !history) {
                        console.warn('[History] $refs not ready, retrying...', { path: !!path, dot: !!dot, history: !!history });
                        setTimeout(() => {
                            this.reinitializeHistory(retryCount + 1);
                        }, 500);
                        return;
                    }
                    
                    this.positionYears();
                    
                    setTimeout(() => {
                        this.positionTriggers();
                        
                        setTimeout(() => {
                            this.initDotAnimation();
                            setTimeout(() => {
                                ScrollTrigger.refresh();
                            }, 500);
                        }, 300);
                    }, 300);
                }, 1000);
            });
        },
        initHistory() {
            if (!process.client) return;
                        
            this.$nextTick(() => {
                setTimeout(() => {
                    this.positionYears();
                    this.positionTriggers();
                    this.initDotAnimation();
                }, 300);
            });
        },
        handleResize() {
            if (!process.client) return;
            
            this.$nextTick(() => {
                this.positionYears();
                this.positionTriggers();
                if (this.scrollTriggerInstance) {
                    ScrollTrigger.refresh();
                }
            });
        },
        positionYears() {
            if (!process.client) return;
            
            const path = this.$refs.path;
            if (!path) return;
            
            const pathLength = path.getTotalLength();
            
            this.years.forEach(year => {
                const point = path.getPointAtLength(pathLength * year.progress);
                const yearGroup = this.$refs[`yearGroup${year.id}`];
                const yearEl = this.$refs[`year${year.id}`];
                
                if (yearGroup && yearGroup[0]) {
                    gsap.set(yearGroup[0], {
                        attr: { 
                            transform: `translate(${point.x}, ${point.y})`
                        }
                    });
                }
                
                if (yearEl && yearEl[0]) {
                    gsap.set(yearEl[0], {
                        opacity: 0,
                        scale: 0,
                        transformOrigin: 'center center'
                    });
                }
            });
        },
        positionTriggers() {
            if (!process.client) return;
            
            const path = this.$refs.path;
            if (!path) return;
            
            const pathLength = path.getTotalLength();
            
            this.triggers.forEach(trigger => {
                const point = path.getPointAtLength(pathLength * trigger.progress);
                const triggerEl = this.$refs[`trigger${trigger.id}`];
                const triggerTitle = this.$refs[`triggerTitle${trigger.id}`];
                const triggerText = this.$refs[`triggerText${trigger.id}`];
                
                const xOffset = trigger.anchor === 'right' ? 24 : -24;
                
                if (triggerEl && triggerEl[0]) {
                    gsap.set(triggerEl[0], {
                        attr: { cx: point.x, cy: point.y },
                        opacity: 0
                    });
                }
                
                // Title 초기 위치
                if (triggerTitle && triggerTitle[0]) {
                    const foreignX = trigger.anchor === 'right' 
                        ? point.x + xOffset
                        : point.x + xOffset - 240;
                    gsap.set(triggerTitle[0], {
                        attr: { x: foreignX, y: point.y - 12 },
                        opacity: 0
                    });
                }
                
                // Text 초기 위치
                if (triggerText && triggerText[0]) {
                    const foreignX = trigger.anchor === 'right' 
                        ? point.x + xOffset
                        : point.x + xOffset - 280;
                    gsap.set(triggerText[0], {
                        attr: { x: foreignX, y: point.y + 12 },
                        opacity: 0
                    });
                }
                
                // 이미지 초기 위치
                const triggerImage = this.$refs[`triggerImage${trigger.id}`];
                if (triggerImage && triggerImage[0]) {
                    const imageX = trigger.anchor === 'right' 
                        ? point.x + xOffset
                        : point.x + xOffset - 240;
                    gsap.set(triggerImage[0], {
                        attr: { 
                            x: imageX, 
                            y: point.y + 60
                        },
                        opacity: 0
                    });
                }
            });
            
            this.$nextTick(() => {
                setTimeout(() => {
                    this.triggers.forEach(trigger => {
                        const point = path.getPointAtLength(pathLength * trigger.progress);
                        const triggerTitle = this.$refs[`triggerTitle${trigger.id}`];
                        const triggerText = this.$refs[`triggerText${trigger.id}`];
                        const triggerTitleContent = this.$refs[`triggerTitleContent${trigger.id}`];
                        const triggerTextContent = this.$refs[`triggerTextContent${trigger.id}`];
                        const triggerImage = this.$refs[`triggerImage${trigger.id}`];
                        
                        const xOffset = trigger.anchor === 'right' ? 24 : -24;
                        
                        let titleHeight = 0;
                        if (triggerTitleContent && triggerTitleContent[0]) {
                            const rect = triggerTitleContent[0].getBoundingClientRect();
                            titleHeight = rect.height;
                                                        
                            if (triggerTitle && triggerTitle[0]) {
                                gsap.set(triggerTitle[0], {
                                    attr: { height: titleHeight }
                                });
                            }
                        }
                        
                        let textHeight = 0;
                        if (triggerText && triggerText[0]) {
                            const foreignX = trigger.anchor === 'right' 
                                ? point.x + xOffset
                                : point.x + xOffset - 280;
                            const textY = point.y - 16 + titleHeight + 4;
                            
                            if (triggerTextContent && triggerTextContent[0]) {
                                const rect = triggerTextContent[0].getBoundingClientRect();
                                textHeight = rect.height;                                
                            }
                            
                            gsap.set(triggerText[0], {
                                attr: { 
                                    x: foreignX, 
                                    y: textY,
                                    height: textHeight > 0 ? textHeight : 1
                                }
                            });
                        }
                        
                        if (triggerImage && triggerImage[0]) {
                            const imageX = trigger.anchor === 'right' 
                                ? point.x + xOffset
                                : point.x + xOffset - 240;
                            const imageY = point.y - 16 + titleHeight + (textHeight > 0 ? textHeight + 4 + 16 : 16);
                                                        
                            gsap.set(triggerImage[0], {
                                attr: { 
                                    x: imageX, 
                                    y: imageY
                                }
                            });
                        }
                    });
                }, 100);
            });
        },
        checkTriggerProximity(progress) {
            const thresholdEarly = 0.05; // title, circle용
            const threshold = 0.04; // text, image용
            
            this.triggers.forEach(trigger => {
                const triggerEl = this.$refs[`trigger${trigger.id}`];
                const triggerTitle = this.$refs[`triggerTitle${trigger.id}`];
                
                if (progress >= trigger.progress - thresholdEarly) {
                    if (!this.activatedTriggers.includes(trigger.id)) {
                        this.activatedTriggers.push(trigger.id);
                        
                        // Circle 활성화
                        if (triggerEl && triggerEl[0]) {
                            gsap.to(triggerEl[0], {
                                opacity: 1,
                                duration: 0.2,
                                ease: 'power2.out'
                            });
                        }
                        
                        // Title 활성화
                        if (triggerTitle && triggerTitle[0]) {
                            gsap.to(triggerTitle[0], {
                                opacity: 1,
                                duration: 0.2,
                                ease: 'power2.out'
                            });
                        }
                    }
                } else {
                    if (this.activatedTriggers.includes(trigger.id)) {
                        this.activatedTriggers = this.activatedTriggers.filter(id => id !== trigger.id);
                        
                        // Circle 비활성화
                        if (triggerEl && triggerEl[0]) {
                            gsap.to(triggerEl[0], {
                                opacity: 0,
                                duration: 0.2,
                                ease: 'power2.out'
                            });
                        }
                        
                        // Title 비활성화
                        if (triggerTitle && triggerTitle[0]) {
                            gsap.to(triggerTitle[0], {
                                opacity: 0,
                                duration: 0.2,
                                ease: 'power2.out'
                            });
                        }
                    }
                }
            });
            
            const nearTrigger = this.triggers.find(trigger => {
                return Math.abs(progress - trigger.progress) < threshold;
            });
            
            if (nearTrigger && nearTrigger.id !== this.currentTrigger) {
                if (this.currentTrigger !== null) {
                    const prevImage = this.$refs[`triggerImage${this.currentTrigger}`];
                    if (prevImage && prevImage[0]) {
                        gsap.to(prevImage[0], {
                            opacity: 0,
                            duration: 0.2,
                            ease: 'power2.out'
                        });
                    }
                    const prevText = this.$refs[`triggerText${this.currentTrigger}`];
                    if (prevText && prevText[0]) {
                        gsap.to(prevText[0], {
                            opacity: 0,
                            duration: 0.2,
                            ease: 'power2.out'
                        });
                    }
                }
                
                this.currentTrigger = nearTrigger.id;
                
                // Dot
                gsap.to(this.$refs.dot, {
                    attr: { r: 12 },
                    duration: 0.2,
                    ease: 'back.out(1.6)'
                });
                
                // image
                const currentImage = this.$refs[`triggerImage${nearTrigger.id}`];
                if (currentImage && currentImage[0]) {
                    gsap.to(currentImage[0], {
                        opacity: 1,
                        duration: 0.2,
                        ease: 'power2.in'
                    });
                }
                
                // text
                const currentText = this.$refs[`triggerText${nearTrigger.id}`];
                if (currentText && currentText[0]) {
                    gsap.to(currentText[0], {
                        opacity: 1,
                        duration: 0.2,
                        ease: 'power2.in'
                    });
                }
            } else if (!nearTrigger && this.currentTrigger !== null) {
                // image
                const prevImage = this.$refs[`triggerImage${this.currentTrigger}`];
                if (prevImage && prevImage[0]) {
                    gsap.to(prevImage[0], {
                        opacity: 0,
                        duration: 0.2,
                        ease: 'power2.out'
                    });
                }
                
                // text
                const prevText = this.$refs[`triggerText${this.currentTrigger}`];
                if (prevText && prevText[0]) {
                    gsap.to(prevText[0], {
                        opacity: 0,
                        duration: 0.2,
                        ease: 'power2.out'
                    });
                }
                
                this.currentTrigger = null;
                
                // Dot
                gsap.to(this.$refs.dot, {
                    attr: { r: 4 },
                    duration: 0.2,
                    ease: 'power2.out'
                });
            }
        },
        checkYearProximity(progress) {
            this.years.forEach(year => {
                const yearEl = this.$refs[`year${year.id}`];
                if (!yearEl || !yearEl[0]) return;
                
                if (progress > year.progress) {
                    if (!this.activatedYears.includes(year.id)) {
                        this.activatedYears.push(year.id);
                        gsap.to(yearEl[0], {
                            opacity: 1,
                            scale: 1,
                            duration: 0.3,
                            ease: 'back.out(1.7)',
                            transformOrigin: 'center center'
                        });
                    }
                } else {
                    if (this.activatedYears.includes(year.id)) {
                        this.activatedYears = this.activatedYears.filter(id => id !== year.id);
                        gsap.to(yearEl[0], {
                            opacity: 0,
                            scale: 0,
                            duration: 0.3,
                            ease: 'power2.out',
                            transformOrigin: 'center center'
                        });
                    }
                }
            });
        },
        initDotAnimation() {
            if (!process.client) return;
                        
            const dot = this.$refs.dot;
            const path = this.$refs.path;
            const history = this.$refs.history;
            
            if (!dot || !path || !history) {
                console.error('[History] Elements not found', { 
                    dot: !!dot, 
                    path: !!path, 
                    history: !!history 
                });
                return;
            }
            
            const pathLength = path.getTotalLength();            
            const startPoint = path.getPointAtLength(0);
            gsap.set(dot, {
                attr: { cx: startPoint.x, cy: startPoint.y }
            });
            
            gsap.set(path, {
                attr: {
                    'stroke-dasharray': pathLength,
                    'stroke-dashoffset': pathLength
                }
            });
                        
            // 기존 타임라인 제거
            const existingTimelines = gsap.globalTimeline.getChildren();
            existingTimelines.forEach(tl => {
                if (tl.vars && tl.vars.id === 'history-timeline') {
                    console.log('[History] Killing existing timeline');
                    tl.kill();
                }
            });
            
            const historySection = document.querySelector('section.history');
            const selectedSection = document.querySelector('section.selected');
            const triggerElement = historySection || history;
            
            if (!historySection) {
                console.warn('[History] section.history not found, using history element as fallback');
            }
            
            const tl = gsap.timeline({
                id: 'history-timeline',
                scrollTrigger: {
                    id: 'history-animation',
                    trigger: triggerElement,
                    start: () => {
                        const selectedST = ScrollTrigger.getById('selected');
                        if (selectedST && historySection) {
                            const selectedEnd = selectedST.end;
                            const historyTop = historySection.getBoundingClientRect().top + window.scrollY;
                            const viewportCenter = window.innerHeight / 2;
                            const historyCenterStart = historyTop - viewportCenter;
                            const calculatedStart = Math.max(selectedEnd, historyCenterStart);
                          
                            return calculatedStart;
                        }
                        return 'top center';
                    },
                    end: () => {
                        // SVG 끝이 화면 중앙에 올 때 끝나도록 계산
                        const historySection = document.querySelector('section.history');
                        if (historySection) {
                            const historyRect = historySection.getBoundingClientRect();
                            const historyTop = historyRect.top + window.scrollY;
                            const historyHeight = historyRect.height;
                            const viewportCenter = window.innerHeight / 2;
                            return historyTop + historyHeight - viewportCenter;
                        }
                        return 'bottom center';
                    },
                    scrub: 1,
                    markers: false,
                    invalidateOnRefresh: true,
                    refreshPriority: -1,
                    pin: false,
                    onUpdate: (self) => {
                        const progress = self.progress;
                        const point = path.getPointAtLength(pathLength * progress);
                                                
                        gsap.set(dot, {
                            attr: { cx: point.x, cy: point.y }
                        });
                        
                        gsap.set(path, {
                            attr: {
                                'stroke-dashoffset': pathLength * (1 - progress)
                            }
                        });
                        
                        this.checkTriggerProximity(progress);
                        this.checkYearProximity(progress);
                    },
                }
            });
            
            tl.to({}, { duration: 1 });
            
            this.scrollTriggerInstance = tl.scrollTrigger;
        }
    }
}
</script>

<style lang='scss' scoped>
@use '@/assets/scss/base/variables.scss' as *;
#history {
    position: relative;
    
    svg {
        width: 100%;
        height: auto;
        display: block;
        overflow: visible;
    }

    #moving-dot {
        cursor: pointer;
    }
    
    .year-text {
        pointer-events: none;
        user-select: none;
        fill: $gray2;
        font-family: 'TanPearl';
        font-size: 1.6rem;
    }
    
    .trigger-circle {
        cursor: pointer;
        transition: all 0.2s ease;
    }
    
    .trigger-title {
        pointer-events: none;
        user-select: none;
        font-size: 1.2rem;
        font-weight: 600;
        font-family: 'Diphylleia', 'Hahmlet';
        color: $black1;
        line-height: 1.2;
        word-wrap: break-word;
        overflow-wrap: break-word;
    }
    .trigger-text {
        pointer-events: none;
        user-select: none;
        font-size: 0.8rem;
        font-weight: 400;
        color: $black1;
        line-height: 1.2;
        word-wrap: break-word;
        overflow-wrap: break-word;
        padding-top: 4px;
    }
    
    .trigger-image-container {
        pointer-events: none;
        transition: opacity 0.2s ease;
    }
    
    .trigger-image-wrapper {
        width: 100%;
        height: 100%;
    }
    
    .trigger-image {
        max-width: 100%;
        max-height: 100%;
        object-fit: contain;
        border-radius: 8px;
    }
}

@media (max-width: 768px) {
    #history {
        svg {
            height: 140%;
        }
        .year-text {
            font-size: 2rem;
        }
        .trigger-title {
            font-size: 2.4rem;
            word-break: keep-all;
        }
        .trigger-text {
            display: none;
        }
    }
}
</style>