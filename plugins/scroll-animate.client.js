import Vue from 'vue';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

if (process.client) {
    gsap.registerPlugin(ScrollTrigger);
}

export default (context, inject) => {
    Vue.directive('scroll-animate', {
            inserted(el, binding) {
                if (!process.client) return;

                // 기본 애니메이션 설정
                const defaultConfig = {
                    opacity: 0,
                    y: 80,
                    x: 0,
                    scale: 1,
                    rotation: 0,
                    duration: 0.8,
                    ease: 'power2.out',
                    start: 'top 60%', // 뷰포트 상단 60% 지점에서 시작
                    once: true, // 한 번만 실행
                    toggleActions: 'play none none none',
                    hideOnLeave: true // 뷰포트에서 벗어날 때 사라지게 할지 여부
                };

                // 바인딩 값에서 설정 가져오기
                const config = typeof binding.value === 'object' 
                    ? { ...defaultConfig, ...binding.value }
                    : { ...defaultConfig };

                // 초기 상태 설정
                const initialX = config.x !== undefined ? config.x : 0;
                const initialY = config.y !== undefined ? config.y : 80;
                const initialOpacity = config.opacity !== undefined ? config.opacity : 0;
                const initialScale = config.scale !== undefined ? config.scale : 1;
                const initialRotation = config.rotation !== undefined ? config.rotation : 0;

                gsap.set(el, {
                    opacity: initialOpacity,
                    y: initialY,
                    x: initialX,
                    scale: initialScale,
                    rotation: initialRotation
                });

                // 애니메이션 생성
                const animation = gsap.to(el, {
                    opacity: 1,
                    y: 0,
                    x: 0,
                    scale: 1,
                    rotation: 0,
                    duration: config.duration,
                    ease: config.ease,
                    paused: true
                });

                // ScrollTrigger 생성
                ScrollTrigger.create({
                    trigger: el,
                    start: config.start,
                    once: config.once,
                    toggleActions: config.toggleActions,
                    onEnter: () => {
                        // 스크롤 내릴 때: 모션 재생
                        if (!config.once) {
                            animation.restart();
                        } else {
                            animation.play();
                        }
                    },
                    onEnterBack: () => {
                        // 스크롤 올릴 때: 모션 재생
                        if (!config.once) {
                            animation.restart();
                        }
                    },
                    onLeave: () => {
                        // 스크롤 내릴 때 뷰포트를 벗어날 때만 사라지게
                        if (!config.once && config.hideOnLeave) {
                            animation.reverse();
                        }
                    },
                    onLeaveBack: () => {

                    }
                });
            },
            unbind(el) {
                if (!process.client) return;
                
                // ScrollTrigger 정리
                ScrollTrigger.getAll().forEach(trigger => {
                    if (trigger.vars && trigger.vars.trigger === el) {
                        trigger.kill();
                    }
                });
            }
        });
}