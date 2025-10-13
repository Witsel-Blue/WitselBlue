<template>
    <div id='star-bg'>
        <div class='star-wrap'>
            <svg class='star1 y1' xmlns="http://www.w3.org/2000/svg" width="141" height="141" viewBox="0 0 141 141" fill="none">
                <path d="M70.3801 0L89.2913 51.4689L140.76 70.3801L89.2913 89.2913L70.3801 140.76L51.4689 89.2913L0 70.3801L51.4689 51.4689L70.3801 0Z" fill="#3E3C3C"/>
            </svg>
            <svg class='star2' xmlns="http://www.w3.org/2000/svg" width="141" height="141" viewBox="0 0 141 141" fill="none">
                <path d="M70.3801 0L89.2913 51.4689L140.76 70.3801L89.2913 89.2913L70.3801 140.76L51.4689 89.2913L0 70.3801L51.4689 51.4689L70.3801 0Z" fill="#3E3C3C"/>
            </svg>
            <svg class='star3 y1' xmlns="http://www.w3.org/2000/svg" width="141" height="141" viewBox="0 0 141 141" fill="none">
                <path d="M70.3801 0L89.2913 51.4689L140.76 70.3801L89.2913 89.2913L70.3801 140.76L51.4689 89.2913L0 70.3801L51.4689 51.4689L70.3801 0Z" fill="#3E3C3C"/>
            </svg>
            <svg class='star4' xmlns="http://www.w3.org/2000/svg" width="141" height="141" viewBox="0 0 141 141" fill="none">
                <path d="M70.3801 0L89.2913 51.4689L140.76 70.3801L89.2913 89.2913L70.3801 140.76L51.4689 89.2913L0 70.3801L51.4689 51.4689L70.3801 0Z" fill="#3E3C3C"/>
            </svg>
            <svg class='star5' xmlns="http://www.w3.org/2000/svg" width="141" height="141" viewBox="0 0 141 141" fill="none">
                <path d="M86.4756 52.5039L86.9541 53.8066L88.2568 54.2852L132.062 70.3799L88.2568 86.4756L86.9541 86.9541L86.4756 88.2568L70.3799 132.062L54.2852 88.2568L53.8066 86.9541L52.5039 86.4756L8.69727 70.3799L52.5039 54.2852L53.8066 53.8066L54.2852 52.5039L70.3799 8.69727L86.4756 52.5039Z" stroke="#3E3C3C" stroke-width="6"/>
            </svg>
            <svg class='star6' xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100" fill="none">
                <circle cx="50" cy="50" r="50" fill="#3E3C3C"/>
            </svg>
            <svg class='star7' xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100" fill="none">
                <circle cx="50" cy="50" r="50" fill="#3E3C3C"/>
            </svg>
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