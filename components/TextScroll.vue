<template>
    <div id="text-scroll">
        <div class="text-wrapper">
            <span
                class="text"
                v-for="(text, idx) in textArray"
                :key="text.id"
                :style="'--i:'+idx">
                {{ text[0] }}
            </span>
        </div>
    </div>
</template>

<script>
    export default {
        props: {
            text: String,
        },
        data() {
            return {
                textArray: [],
            }
        },
        mounted() {
            this.splitTexts();
            setTimeout(() => {
                this.parallaxScroll();
            }, 100);
        },
        methods: {
            splitTexts() {
                var str = this.text;
                var arr = str.split('');
                arr = arr.map((item, index) => ({ ...item, id: index + 1 }));
                this.textArray = arr;
            },
            parallaxScroll() {
                window.addEventListener('scroll', function() {
                    var scrolled = window.scrollY;
                    var texts = this.document.getElementsByClassName('text');

                    texts[0].style.transform = 'translate3d(0,' + scrolled * -0.4 + 'px, 0)';
                    texts[1].style.transform = 'translate3d(0,' + scrolled * -0.6 + 'px, 0)';
                    texts[2].style.transform = 'translate3d(0,' + scrolled * -0.5 + 'px, 0)';
                    texts[3].style.transform = 'translate3d(0,' + scrolled * -0.7 + 'px, 0)';
                    texts[4].style.transform = 'translate3d(0,' + scrolled * -0.4 + 'px, 0)';
                    texts[5].style.transform = 'translate3d(0,' + scrolled * -0.6 + 'px, 0)';
                    texts[6].style.transform = 'translate3d(0,' + scrolled * -0.5 + 'px, 0)';
                    texts[7].style.transform = 'translate3d(0,' + scrolled * -0.7 + 'px, 0)';
                    texts[8].style.transform = 'translate3d(0,' + scrolled * -0.4 + 'px, 0)';
                    texts[9].style.transform = 'translate3d(0,' + scrolled * -0.6 + 'px, 0)';
                    texts[10].style.transform = 'translate3d(0,' + scrolled * -0.5 + 'px, 0)';
                });
            },
        }
    }
</script>

<style lang="scss" scoped>
    #text-scroll {
        position: fixed;
        .text-wrapper {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            font-size: 0;
            font-family: sans-serif;
            white-space: nowrap;
            span {
                position: relative;
                display: inline-block;
                font-size: 5rem;
                animation: flip 0.8s;
                animation-delay: calc(0.08s * var(--i));
            }
        }
    }
    @keyframes flip {
        0%, 50% {
            transform: rotateY(360deg) 
        }
    }
</style>