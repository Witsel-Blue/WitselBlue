<template>
    <div class='intro' v-show='visible'>
        <div class='inner'>
            <TextTyping text='Hello World' />
        </div>
    </div>
</template>

<script>
import TextTyping from '@/components/TextTyping.vue';

export default {
    components: {
        TextTyping,
    },
    data() {
        return {
            visible: true,
            loadTimeout: null,
            loadHandler: null,
            mountedTime: null,
            minDisplayTime: 3000,
        }
    },
    mounted() {
        this.mountedTime = Date.now();
        
        const finishIntro = () => {
            if (!this.visible) return;
            
            const elapsed = Date.now() - this.mountedTime;
            const remaining = this.minDisplayTime - elapsed;
            
            if (remaining > 0) {
                setTimeout(finishIntro, remaining);
                return;
            }
            
            this.visible = false;
            this.$emit('end');
            if (this.loadHandler) {
                window.removeEventListener('load', this.loadHandler);
                this.loadHandler = null;
            }
            if (this.loadTimeout) {
                clearTimeout(this.loadTimeout);
                this.loadTimeout = null;
            }
        };

        // 이미 로딩이 끝났다면 최소 표시 시간 확인 후 종료
        if (document.readyState === 'complete') {
            finishIntro();
        } else {
            this.loadHandler = finishIntro;
            window.addEventListener('load', this.loadHandler);
            this.loadTimeout = setTimeout(finishIntro, 8000);
        }
    },
    beforeDestroy() {
        if (this.loadHandler) {
            window.removeEventListener('load', this.loadHandler);
            this.loadHandler = null;
        }
        if (this.loadTimeout) {
            clearTimeout(this.loadTimeout);
            this.loadTimeout = null;
        }
    }
}
</script>

<style lang='scss' scoped>
@use '@/assets/scss/base/variables.scss' as *;
@import '@/assets/scss/layout/layout.scss';

.intro {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 9999;
    transition: opacity 0.4s;
    background: $grad-blue;

    #text-typing::v-deep {
        text-align: center;
        color: $white1;
        h1 {
            font-size: 4rem;
            line-height: 1.4;
            font-family: 'TanPearl', 'YUniverse';
            word-break: keep-all;
            &.ko {
                font-size: 5rem;
            }
            &.cursor::after {
                background-color: rgba(255, 255, 255, 0.5);
            }
        }
    }
}

// mobile
@media all and (max-width: $mobile) {
    .inner-s {
        width: 60%;
    }

    #text-typing::v-deep {
        h1 {
            font-size: 3rem;    
            &.ko {
                font-size: 4rem;
            }
        }
    }
}
</style>