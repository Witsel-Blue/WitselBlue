<template>
    <div id='text-typing'>
        <h1 :class='{ cursor: true, ko: isKorean }'>{{ displayText }}</h1>
    </div>
</template>

<script>
export default {
    props: {
        text: {
            type: String,
            default: 'Hello World'
        },
        speedForward: {
            type: Number,
            default: 90 // 타이핑 속도
        },
        speedWait: {
            type: Number,
            default: 780 // 타이핑 완료 후 대기시간
        },
        speedBackspace: {
            type: Number,
            default: 20 // 백스페이스 속도
        },
        backspace: {
            type: Boolean,
            default: true // 백스페이스 기능 사용 여부
        },
        autoplay: {
            type: Boolean,
            default: true // 자동 재생 여부
        },
        isKorean: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            displayText: '',
            i: 0,
            a: 0,
            isBackspacing: false,
            textArray: [],
        };
    },
    computed: {
        typingText() {
            return this.text;
        }
    },
    watch: {
        typingText: {
            immediate: true,
            handler(newText) {
                if (newText) {
                    this.textArray = [newText];
                    this.resetAnimation();
                    if (this.autoplay) {
                        this.$nextTick(() => {
                            this.startTyping();
                        });
                    }
                }
            }
        }
    },
    methods: {
        resetAnimation() {
            this.displayText = '';
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
                    this.displayText += aString.charAt(this.i);
                    this.i++;
                    setTimeout(this.typeWriter, this.speedForward);
                } else if (this.i === aString.length) {
                    if (this.backspace) {
                        this.isBackspacing = true;
                        setTimeout(this.typeWriter, this.speedWait);
                    } else {
                        this.$emit('typing-complete');
                    }
                }
            } else {
                // 백스페이스 모드
                if (this.displayText.length > 0) {
                    this.displayText = this.displayText.substring(0, this.displayText.length - 1);
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

.cursor::after {
    content: '';
    display: inline-block;
    margin-left: 1rem;
    background-color: rgba(62, 60, 60, 0.5);
    animation-name: blink;
    animation-duration: 0.8s;
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
    h1 {
        font-size: 3rem;
            
        &.ko {
            font-size: 4rem;
        }
    }
}
</style>