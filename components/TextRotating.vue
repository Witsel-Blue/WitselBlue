<template>
    <div id='text_rotating'>
        <svg :width='size' :height='size' :viewBox='`0 0 ${size} ${size}`'>
            <defs>
                <path :id='pathId' :d='circlePath' />
            </defs>

            <g
                class='rotating-group'
                :style="{
                    animationDuration: duration + 's',
                    animationDirection: direction
                }"
            >
                <text
                    fill='currentColor'
                    :font-size='fontSize'
                    text-anchor='middle'
                >
                    <textPath :xlink:href='`#${pathId}`' startOffset='50%'>
                        {{ repeatedText }}
                    </textPath>
                </text>
            </g>
        </svg>
    </div>
</template>

<script>
export default {
    name: 'TextRotating',
    props: {
        text: { type: String, required: true },
        size: { type: Number, default: 300 },
        fontSize: { type: String, default: '1rem' },
        duration: { type: Number, default: 12 },
        direction: { type: String, default: 'normal' }
    },
    computed: {
        pathId() {
            return 'circlePath-' + this._uid;
        },
        fontPx() {
            if (process.client) {
                if (this.fontSize.endsWith('rem')) {
                    const rem = parseFloat(this.fontSize);
                    const rootFont = parseFloat(getComputedStyle(document.documentElement).fontSize);
                    return rem * rootFont;
                }
                return parseFloat(this.fontSize);
            }
            return 16;
        },
        circlePath() {
            const r = this.size / 2 - this.fontPx;
            const c = this.size / 2;
            return `M ${c},${c} m -${r},0 a ${r},${r} 0 1,1 ${r * 2},0 a ${r},${r} 0 1,1 -${r * 2},0`;
        },
        repeatedText() {
            const r = this.size / 2 - this.fontPx;
            const circumference = 2 * Math.PI * r;
            const approxCharWidth = this.fontPx * 0.6;
            const charsNeeded = Math.ceil(circumference / approxCharWidth);
            const repeatTimes = Math.ceil(charsNeeded / this.text.length);
            return (this.text + ' ').repeat(repeatTimes);
        }
    }
};
</script>

<style lang='scss' scoped>
@use '@/assets/scss/base/variables.scss' as *;

svg {
    transform: rotate(-90deg);
    overflow: visible;
}

.rotating-group {
    transform-origin: 50% 50%;
    animation-name: rotate-circle;
    animation-timing-function: linear;
    animation-iteration-count: infinite;
}

@keyframes rotate-circle {
    from { transform: rotate(0deg); }
    to   { transform: rotate(360deg); }
}
</style>
