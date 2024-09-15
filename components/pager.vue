<template>
    <div id="pager">
        pager
    </div>
</template>

<script>
    import gsap from 'gsap';

    export default {
        mounted() {
            this.boxRotation();
        },
        methods: {
            boxRotation() {
                const gsap = this.$gsap;
                gsap.to('#pager', {
                    rotation: 27,
                    x: 100,
                    duration: 1
                });
            }
        },
    }
</script>