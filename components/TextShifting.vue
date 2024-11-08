<template>
    <div class="text-shifting">
        <span
            v-for="(text, idx) in textArray"
            :key="text.id"
            :style="'--i:'+idx">
            {{ text[0] }}
        </span>
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
        },
        methods: {
            splitTexts() {
                var str = this.text;
                var arr = str.split('');
                arr = arr.map((item, index) => ({ ...item, id: index + 1 }));
                this.textArray = arr;
            },
        },
    }
</script>

<style lang="scss" scoped>
    .text-shifting {
        position: relative;
        span {
            position: relative;
            display: inline-block;
            color: #3E3C3C;
            text-transform: uppercase;
        }
        &:hover span {
            animation: flip 1s;
            animation-delay: calc(.1s * var(--i));
        }
    }
    @keyframes flip {
        0%, 80% {
            transform: rotateY(360deg) 
        }
    }
</style>