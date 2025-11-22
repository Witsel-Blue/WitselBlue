<template>
    <div id='text-typing'>
        <div class='output' ref='output'>
            <h1 :class='{ cursor: true, ko: isKorean }'>{{ headerText }}</h1>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            headerText: '',
            i: 0,
            a: 0,
            isBackspacing: false,
            textArray: [],
            speedForward: 90, // 타이핑 속도
            speedWait: 780, // 타이핑 완료 후 대기시간
            speedBackspace: 20, // 백스페이스 속도
        };
    },
    computed: {
        typingText() {
            return this.$t('intro.textTyping');
        },
        isKorean() {
            return this.$i18n.locale === 'ko';
        }
    },
    watch: {
        typingText: {
            immediate: true,
            handler(newText) {
                if (newText) {
                    this.textArray = [newText];
                    this.resetAnimation();
                    this.$nextTick(() => {
                        this.startTyping();
                    });
                }
            }
        }
    },
    methods: {
        resetAnimation() {
            this.headerText = '';
            this.i = 0;
            this.a = 0;
            this.isBackspacing = false;
        },
        startTyping() {
            if (this.textArray.length > 0 && this.textArray[0]) {
                this.typeWriter();
            }
        },
        typeWriter() {
            const aString = this.textArray[this.a];
            if (!this.isBackspacing) {
                if (this.i < aString.length) {
                    this.headerText += aString.charAt(this.i);
                    this.i++;
                    setTimeout(this.typeWriter, this.speedForward);
                } else if (this.i === aString.length) {
                    this.isBackspacing = true;
                    setTimeout(this.typeWriter, this.speedWait);
                }
            } else {
                // 백스페이스 모드
                if (this.headerText.length > 0) {
                    this.headerText = this.headerText.substring(0, this.headerText.length - 1);
                    setTimeout(this.typeWriter, this.speedBackspace);
                } else {
                    this.isBackspacing = false;
                    this.$emit('typing-complete');
                }
            }
        }
    }
};
</script>

<style lang='scss' scoped>
@use '@/assets/scss/base/variables.scss' as *;

.output {
    text-align: center;
    color: $white1;
    h1 {
        font-size: 4rem;
        line-height: 1;
        font-family: 'TanPearl', 'YUniverse';
        word-break: keep-all;
        
        &.ko {
            font-size: 5rem;
        }
    }
}

.cursor::after {
    content: '';
    display: inline-block;
    margin-left: 1rem;
    background-color: rgba(255, 255, 255, 0.5);
    animation-name: blink;
    animation-duration: 0.5s;
    animation-iteration-count: infinite;
}
h1.cursor::after {
    height: 4rem;
    width: 4px;
}

@keyframes blink {
    0% {
        opacity: 1;
    }
    49% {
        opacity: 1;
    }
    50% {
        opacity: 0;
    }
    100% {
        opacity: 0;
    }
}

// mobile
@media all and (max-width: $mobile) {
    .output {
        h1 {
            font-size: 3rem;
            
            &.ko {
                font-size: 4rem;
            }
        }
    }
}
</style>