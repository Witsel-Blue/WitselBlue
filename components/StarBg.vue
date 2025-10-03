<template>
    <div id='star-bg'>
        <div class='star-wrap'>
            <img class='star1 y1' 
                src='@/assets/img/star1.png'
            />
            <img class='star2'
                src='@/assets/img/star1.png'
            />
            <img class='star3 y1'
                src='@/assets/img/star1.png'
            />
            <img class='star4'
                src='@/assets/img/star1.png'
            />
            <img class='star5'
                src='@/assets/img/star2.png'
            />
            <img class='star6'
                src='@/assets/img/star3.png'
            />
            <img class='star7'
                src='@/assets/img/star3.png'
            />
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

<style lang='scss' scoped>
@use '@/assets/scss/base/variables.scss' as *;
    
#star-bg {
    width: 100%;
    height: 100%;
}
.star-wrap {
    width: 100%;
    height: 100%;
    max-width: 800px;
    margin: auto;
    position: relative;

    [class*='star'] {
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

    .star2,
    .star4,
    .star5,
    .star7 {
        animation: star 1s infinite;
    }

    .star1,
    .star3,
    .star6 {
        animation: star2 1s infinite;
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

@keyframes star {
    0% {
        transform: scale(1);
    }
    50% {
        transform: scale(0.8);
    }
    100% {
        transform: scale(1);
    }
}

@keyframes star2 {
    0% {
        transform: scale(0.8);
    }
    50% {
        transform: scale(1.2);
    }
    100% {
        transform: scale(0.8);
    }
}

// mobile
@media all and (max-width: $mobile) {
    .star-wrap {
        .star1,
        .star2, 
        .star5 {
            width: 24px;
            height: 24px;
        }

        .star3,
        .star4 {
            width: 8px;
            height: 8px;
        }

        .star6,
        .star7 {
            width: 6px;
            height: 6px;
        }
    }
}
</style>