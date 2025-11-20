import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import { MotionPathPlugin } from 'gsap/dist/MotionPathPlugin';

if (process.client) {
    gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);
    
    window.gsap = gsap;
    window.ScrollTrigger = ScrollTrigger;
    window.MotionPathPlugin = MotionPathPlugin;
    
    console.log('[GSAP Plugin] GSAP loaded and registered globally', {
        gsap: typeof window.gsap !== 'undefined',
        ScrollTrigger: typeof window.ScrollTrigger !== 'undefined',
        MotionPathPlugin: typeof window.MotionPathPlugin !== 'undefined'
    });
}

export default ({ app }, inject) => {
    inject('gsap', gsap);
    inject('ScrollTrigger', ScrollTrigger);
    inject('MotionPathPlugin', MotionPathPlugin);
    
    console.log('[GSAP Plugin] GSAP injected into Vue instance');
};