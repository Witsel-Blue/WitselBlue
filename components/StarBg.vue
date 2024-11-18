<template>
    <div id="star-bg">
        <div class="star-wrap">
            <img class="star1 y1" src="@/assets/img/star1.png">
            <img class="star2" src="@/assets/img/star1.png">
            <img class="star3" src="@/assets/img/star1.png">
            <img class="star4" src="@/assets/img/star1.png">
            <img class="star5 y1" src="@/assets/img/star2.png">
            <img class="star6" src="@/assets/img/star3.png">
            <img class="star7" src="@/assets/img/star3.png">
        </div>
    </div>
</template>

<script>
    export default {
        mounted() {
            setTimeout(() => {
                this.parallaxScroll();
            }, 100);
        },
        methods: {
            parallaxScroll() {
                window.addEventListener('scroll', function() {
                    var scrolled = window.scrollY;
                    var img = document.querySelectorAll('.y1');

                    for (var i = 0; i < img.length; i++) {
                        var c = img[i];
                        c.style.transform = 'translate3d(0,' + scrolled * -0.3 + 'px, 0)';
                    }
                    // this.document.querySelector('.star-wrap').style.transform = 'translate3d(0,' + scrolled * -0.3 + 'px, 0)';
                });
            },
        }
    }
</script>

<style lang="scss" scoped>
    #star-bg {
        width: 100%;
        height: 80%;
    }
    .star-wrap {
        width: 80%;
        max-width: 600px;
        height: 80%;
        margin: auto;
        position: relative;

        [class*="star"] {
            position: absolute;
        }

        .star1,
        .star2, 
        .star5 {
            width: 36px;
            height: 36px;
        }

        .star3,
        .star4 {
            width: 16px;
            height: 16px;
        }

        .star6,
        .star7 {
            width: 8px;
            height: 8px;
        }

        .star1 {
            top: 20%;
            left: 10%;
        }
        .star2 {
            top: 10%;
            right: 15%;
        }
        .star3 {
            top: 40%;
            right: 0;
        }
        .star4 {
            bottom: 0;
            left: 40%;
        }
        .star5 {
            bottom: 20%;
            right: 25%;
        }
        .star6 {
            top: 0;
            right: 50%;
        }
        .star7 {
            left: 0;
            top: 55%;
        }
    }
</style>