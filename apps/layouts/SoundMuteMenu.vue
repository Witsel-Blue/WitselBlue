<template>
    <div id='sound-mute-menu'>
        <CursorZone :label='cursorLabel' attach-to-parent />
        <button type='button' @click='toggleMute'>
            <ClickSound attach-to-parent />
            <Lottie
                ref='soundWaves'
                :animation-data='soundWavesData'
                :autoplay='false'
                @ready='onLottieReady'
            />
        </button>
    </div>
</template>

<script>
    import Lottie from '@/components/common/Lottie.vue';
    import CursorZone from '@/components/common/CursorZone.vue';
    import ClickSound from '@/components/common/ClickSound.vue';
    import {
        setSoundMuted,
        syncSoundMutedFromStorage,
    } from '@/utils/soundMuteState';

    const MUTE_FRAME = 5;
    const LOOP_START = 35;
    const LOOP_END = 107;

    export default {
        components: {
            Lottie,
            CursorZone,
            ClickSound,
        },
        data() {
            return {
                isMuted: false,
                soundWavesData: require('@/assets/lottie/SoundWaves.json'),
            };
        },
        computed: {
            cursorLabel() {
                return this.isMuted ? 'turn on sounds' : 'mute sound';
            },
        },
        created() {
            if (!process.client) return;
            this.isMuted = syncSoundMutedFromStorage();
        },
        methods: {
            onLottieReady() {
                if (this.isMuted) {
                    this.$refs.soundWaves?.pauseAtFrame(MUTE_FRAME);
                    return;
                }

                this.playIdleLoop();
            },
            playIdleLoop() {
                this.$refs.soundWaves?.playSegmentLoop(LOOP_START, LOOP_END);
            },
            playFromStart() {
                this.$refs.soundWaves?.playIntroThenLoop(
                    LOOP_START,
                    LOOP_START,
                    LOOP_END,
                );
            },
            toggleMute() {
                this.isMuted = !this.isMuted;
                setSoundMuted(this.isMuted);

                if (this.isMuted) {
                    this.$refs.soundWaves?.pauseAtFrame(MUTE_FRAME);
                    return;
                }

                this.playFromStart();
            },
        },
    };
</script>

<style lang='scss' scoped>
    @use '@/assets/scss/base/variables.scss' as *;

    #sound-mute-menu {
        position: absolute;
        left: 2.5vw;
        bottom: 2.5vw;
        z-index: 10;
        width: 40px;
        height: 40px;

        button {
            width: 100%;
            height: 100%;
            cursor: pointer;
            border-radius: 50%;
            background: rgba($gray1, 0.2);
            -webkit-backdrop-filter: blur(8px);
            backdrop-filter: blur(8px);
        }
    }
</style>
