<template>
    <div id="detail_footer">
        <div class="footer-bg" ref="bg"></div>
        <div class="footer">
            <p>next project</p>
            <a :href="pagination.nextLink" class="hover-img">
                <div class="res-box-wrap">
                    <div class="res-box">
                        <img :src="pagination.nextImg">
                    </div>
                </div>
            </a>
        </div>
    </div>
</template>

<script>
    export default {
        props: {
            pagination: Object,
        },
        mounted() {
            setTimeout(() => {
                this.bgScroll();
            }, 1000);
        },
        methods: {
            bgScroll() {
                var footerBg = this.$refs.bg;
                var winH = window.innerWidth;
                var footerBgTop = footerBg.offsetTop - winH*2/3;

                window.addEventListener('scroll', function() {
                    var footerScrolled = window.scrollY;

                    if ( footerBgTop < footerScrolled ) {
                        var x = footerScrolled - footerBgTop;
                        var x2 = 630 - x;
                        footerBg.style.borderRadius = '0 0 ' + x2 + '% ' + x2 + '%';
                    }

                });
            },
        }
    }
</script>

<style lang="scss" scoped>
    @import '@/assets/scss/base/variables.scss';
    
    #detail_footer {
        width: 100vw;
        height: 100vh;
        overflow: hidden;
        background-color: $black2;
    }

    .footer-bg {
        width: 120%;
        margin-left: -10%;
        height: 20%;
        background-color: $white2;
    }

    .footer {
        color: $white1;
        width: 100%;
        height: 80%;
        padding: 15vh 10vw;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        gap: 40px;
    }

    a {
        display: block;
        width: 80%;
        max-width: 300px;
    }
</style>