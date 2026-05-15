<template>
    <div class='text-shifting'>
        <span
            v-for='(text, idx) in textArray'
            :key='text.id'
            :style="'--i:'+idx"
            :class='{ space: text.isSpace }'
        >
            {{ text.char }}
        </span>
    </div>
</template>

<script>
export default {
    props: {
        text: {
            type: String,
            required: true
        }
    },
    data() {
        return {
            textArray: []
        }
    },
    watch: {
        text: {
            immediate: true,
            handler() {
                this.splitTexts();
            }
        }
    },
    mounted() {
        this.splitTexts();
    },
    methods: {
        splitTexts() {
            const str = String(this.text || '');
            this.textArray = str.split('').map((ch, index) => ({
                char: ch === ' ' ? '\u00A0' : ch,
                id: index + 1,
                isSpace: ch === ' '
            }));
        }
    }
}
</script>


<style lang='scss' scoped>
@use '@/assets/scss/base/variables.scss' as *;

.text-shifting {
    position: relative;
    span {
        position: relative;
        display: inline-block;
        color: $black1;
        line-height: 1;
    }
    &:hover span {
        animation: flip 0.8s;
        animation-delay: calc(0.04s * var(--i));
    }
    .space {
        height: 0;
        display: block;
    }
}

@keyframes flip {
    0%, 50% {
        transform: rotateY(360deg) 
    }
}
</style>