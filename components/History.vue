<template>
    <div id='history' ref='history'>
        <svg ref='svg' width='592' height='1198' viewBox='0 0 592 1198' fill='none' xmlns='http://www.w3.org/2000/svg'>
            <!-- 배경 path  -->
            <path ref='pathBg' id='history-path-bg' d='M140 1C287.5 103.5 495 106 495 202C495 298 85.0003 337 85.0003 493.5C85.0003 650 583 582.5 583 851C583 1119.5 278 1032 1.00024 1194' stroke='#EDEDED' stroke-width='2' stroke-linecap='round'/>
            
            <!-- 진행된 path -->
            <path ref='path' id='history-path' d='M140 1C287.5 103.5 495 106 495 202C495 298 85.0003 337 85.0003 493.5C85.0003 650 583 582.5 583 851C583 1119.5 278 1032 1.00024 1194' stroke='#3E3C3C' stroke-width='2' stroke-linecap='round'/>
            
            <!-- 연도 텍스트 -->
            <g v-for='year in years' :key='year.id'>
                <text 
                    :ref='`year${year.id}`'
                    class='year-text'
                    text-anchor='middle'
                    dominant-baseline='middle'
                    fill='#3E3C3C'
                    font-size='24'
                    font-weight='700'
                >
                    {{ year.label }}
                </text>
            </g>
            
            <!-- 트리거 포인트 -->
            <g v-for='trigger in triggers' :key='trigger.id'>
                <circle 
                    :ref='`trigger${trigger.id}`'
                    class='trigger-circle'
                    r='8'
                    fill='#f7f7f7'
                    stroke='#3E3C3C'
                    stroke-width='2'
                />
                <text 
                    :ref='`triggerTitle${trigger.id}`'
                    class='trigger-title'
                    :text-anchor='trigger.textAnchor'
                    dy='0'
                    fill='#3E3C3C'
                    font-weight='600'
                >
                    {{ trigger.title }}
                </text>
                <foreignObject 
                    v-if='trigger.text'
                    :ref='`triggerText${trigger.id}`'
                    width='320'
                    height='240'
                    x='0'
                    y='0'
                >
                    <div 
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
                { id: 1, progress: 0.04, anchor: 'right' },
                { id: 2, progress: 0.17, anchor: 'left' },
                { id: 3, progress: 0.33, anchor: 'right' },
                { id: 4, progress: 0.42, anchor: 'right' },
                { id: 5, progress: 0.63, anchor: 'left' },
                { id: 6, progress: 0.72, anchor: 'left' },
                { id: 7, progress: 0.93, anchor: 'right' }
            ],
            years: [
                { id: 1, progress: 0, label: '2010' },
                { id: 2, progress: 0.12, label: '2018' },
                { id: 3, progress: 0.25, label: '2020' },
                { id: 4, progress: 0.38, label: '2021' },
                { id: 5, progress: 0.54, label: '2022' },
                { id: 6, progress: 0.68, label: '2024' },
                { id: 7, progress: 0.82, label: '2025' }
            ],
            currentTrigger: null,
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
        
        this.$nextTick(() => {
            setTimeout(() => {
                this.positionYears();
                this.positionTriggers();
                this.initDotAnimation();
            }, 300);
        });
        
        window.addEventListener('resize', this.handleResize);
    },
    beforeDestroy() {
        if (!process.client) return;
        
        if (this.scrollTriggerInstance) {
            this.scrollTriggerInstance.kill();
            this.scrollTriggerInstance = null;
        }
        
        window.removeEventListener('resize', this.handleResize);
    },
    methods: {
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
                const yearEl = this.$refs[`year${year.id}`];
                
                if (yearEl && yearEl[0]) {
                    gsap.set(yearEl[0], {
                        attr: { 
                            x: point.x,
                            y: point.y
                        }
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
                        attr: { cx: point.x, cy: point.y }
                    });
                }
                
                if (triggerTitle && triggerTitle[0]) {
                    gsap.set(triggerTitle[0], {
                        attr: { x: point.x + xOffset, y: point.y }
                    });
                }
                
                if (triggerText && triggerText[0]) {
                    const foreignX = trigger.anchor === 'right' 
                        ? point.x + xOffset
                        : point.x + xOffset - 320;
                    gsap.set(triggerText[0], {
                        attr: { x: foreignX, y: point.y + 8 }
                    });
                }
            });
        },
        checkTriggerProximity(progress) {
            const threshold = 0.02;
            
            const nearTrigger = this.triggers.find(trigger => {
                return Math.abs(progress - trigger.progress) < threshold;
            });
            
            if (nearTrigger && nearTrigger.id !== this.currentTrigger) {
                this.currentTrigger = nearTrigger.id;
                gsap.to(this.$refs.dot, {
                    attr: { r: 12 },
                    duration: 0.2,
                    ease: 'back.out(1.6)'
                });
            } else if (!nearTrigger && this.currentTrigger !== null) {
                this.currentTrigger = null;
                gsap.to(this.$refs.dot, {
                    attr: { r: 4 },
                    duration: 0.2,
                    ease: 'power2.out'
                });
            }
        },
        initDotAnimation() {
            if (!process.client) return;
            
            const dot = this.$refs.dot;
            const path = this.$refs.path;
            const history = this.$refs.history;
            
            if (!dot || !path || !history) {
                console.error('[History] Elements not found');
                return;
            }
            
            const pathLength = path.getTotalLength();
            
            gsap.set(path, {
                attr: {
                    'stroke-dasharray': pathLength,
                    'stroke-dashoffset': pathLength
                }
            });
            
            const animation = gsap.to({}, {
                scrollTrigger: {
                    trigger: history,
                    start: 'top center',
                    end: 'bottom center',
                    scrub: 1,
                    markers: false,
                    invalidateOnRefresh: true,
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
                    }
                },
                ease: 'none'
            });
            
            this.scrollTriggerInstance = animation.scrollTrigger;
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
    }
    .trigger-text {
        pointer-events: none;
        user-select: none;
        font-size: 0.8rem;
        font-weight: 400;
        color: #3E3C3C;
        line-height: 1.4;
        word-wrap: break-word;
        overflow-wrap: break-word;
    }
}
</style>