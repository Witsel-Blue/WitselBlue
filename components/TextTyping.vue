<template>
    <div id='text-typing'>
        <div class='output' ref='output'>
            <h1 :class='{ cursor: !isParagraph }'>{{ headerText }}</h1>
            <p :class='{ cursor: isParagraph }'>{{ paragraphText }}</p>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            headerText: '',
            paragraphText: '',
            i: 0,
            a: 0,
            isBackspacing: false,
            isParagraph: false,
            textArray: [
                'Hello World',
            ],
            speedForward: 100,
            speedWait: 1500,
            speedBetweenLines: 1500,
            speedBackspace: 30,
        };
    },
    mounted() {
        this.startTyping();
    },
    methods: {
        startTyping() {
            this.typeWriter();
        },
        typeWriter() {
            const aString = this.textArray[this.a];
            if (!this.isBackspacing) {
                if (this.i < aString.length) {
                    if (aString.charAt(this.i) === '|') {
                        this.isParagraph = true;
                        this.i++;
                        setTimeout(this.typeWriter, this.speedBetweenLines);
                    } else {
                        if (!this.isParagraph) {
                            this.headerText += aString.charAt(this.i);
                        } else {
                            this.paragraphText += aString.charAt(this.i);
                        }
                        this.i++;
                        setTimeout(this.typeWriter, this.speedForward);
                    }
                } else if (this.i === aString.length) {
                    this.isBackspacing = true;
                    setTimeout(this.typeWriter, this.speedWait);
                }
            } else {
                if (this.headerText.length > 0 || this.paragraphText.length > 0) {
                    if (this.paragraphText.length > 0) {
                        this.paragraphText = this.paragraphText.substring(0, this.paragraphText.length - 1);
                    } else if (this.headerText.length > 0) {
                        this.isParagraph = false;
                        this.headerText = this.headerText.substring(0, this.headerText.length - 1);
                    }
                    setTimeout(this.typeWriter, this.speedBackspace);
                } else {
                    this.isBackspacing = false;
                    this.i = 0;
                    this.isParagraph = false;
                    this.a = (this.a + 1) % this.textArray.length;
                    setTimeout(this.typeWriter, 50);
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
p.cursor::after {
    height: 4rem;
    width: 1rem;
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
        }
    }
}
</style>