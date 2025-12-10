<template>
  <div id='RandomSkillCard'>
    
    <!-- card wrapper -->
    <div class='tray'>
        <div
            class='skill-cards-wrapper'
            ref='wrapper'
            @mousemove='handleMouseMove'
        >
            <div
                    v-for='(skill, index) in filteredSkills'
                    :key='skill.name'
                    class='skill-card mouse-hover2'
                    @mouseenter='hoverCard(index)'
                    @mouseleave='leaveCard(index)'
            >
                <div class='card-inner' :class='{ flipped: skill.flipped }'>
                    <div class='card-front'>
                        <img :src='skill.logo' loading='lazy' />
                    </div>
                    <div class='card-back'>
                        <h3>{{ skill.title[$i18n.locale] }}</h3>
                        <div class='stars'>
                            <span 
                                v-for='n in 5'
                                :key='n'
                                :class='{ filled: n <= skill.rate, animate: skill.flipped }'
                                :style='{ "--i": n}'
                            >
                                ★
                            </span>
                        </div>
                    </div>
                </div>
            </div> 
        </div>
    </div>

    <!-- tabs -->
    <div class='tabs'>
        <ButtonRound
            v-for='(cat, index) in categories'
            :key='`${cat}-${index}`'
            :text='cat'
            :class='{ active: activeCategoryIndex === index }'
            @click='switchCategory(index)'
        />
    </div>

    <div class='def'>
       <div class='inner'>
            <ul>
                <li>★★★:<br class='mb'> {{ $t('randomSkillCards.def[0]') }}</li>
                <li>★★★★:<br class='mb'> {{ $t('randomSkillCards.def[1]') }}</li>
                <li>★★★★★:<br class='mb'> {{ $t('randomSkillCards.def[2]') }}</li>
            </ul>
       </div>
    </div>

  </div>
</template>

<script>
import SkillsData from '@/assets/data/skills.js';
import ButtonRound from '@/components/ButtonRound.vue';
import gsap from 'gsap';

export default {
    name: 'RandomSkillCard',
    data() {
        return {
            activeCategoryIndex: 0,
            skills: SkillsData,
            basePositions: [],
            mouse: { x: 0, y: 0 },
            isScattered: false,
            resizeTimer: null,
            lastWrapperSize: { width: 0, height: 0 },
        };
    },
    computed: {
        categories() {
           return this.$t('randomSkillCards.categories', {}, { returnObjects: true }) || [];
        },
        filteredSkills() {
            const activeCat = this.categories[this.activeCategoryIndex];
            return this.skills.filter(skill => skill.category[this.$i18n.locale] === activeCat);
        },
    },
    mounted() {
        this.$nextTick(() => {
            this.scatterCards();
        });
        window.addEventListener('resize', this.handleResize);
    },
    beforeDestroy() {
        window.removeEventListener('resize', this.handleResize);
        if (this.resizeTimer) {
            clearTimeout(this.resizeTimer);
        }
    },
    methods: {
        handleResize() {
            if (this.resizeTimer) {
                clearTimeout(this.resizeTimer);
            }
            
            this.resizeTimer = setTimeout(() => {
                if (!this.$refs.wrapper) return;
                
                const wrapperRect = this.$refs.wrapper.getBoundingClientRect();
                const currentWidth = wrapperRect.width;
                const currentHeight = wrapperRect.height;
                
                // 재배치
                const widthChanged = Math.abs(this.lastWrapperSize.width - currentWidth) > 10;
                const heightChanged = Math.abs(this.lastWrapperSize.height - currentHeight) > 10;
                
                if (widthChanged || heightChanged) {
                    this.lastWrapperSize = { width: currentWidth, height: currentHeight };
                    this.scatterCards();
                }
            }, 300);
        },
        switchCategory(index) {
            if (this.activeCategoryIndex === index) return;
            this.activeCategoryIndex = index;

            this.$nextTick(() => {
                const cards = this.$refs.wrapper.children;
                const wrapperRect = this.$refs.wrapper.getBoundingClientRect();
                const cardWidth = 104;
                const cardHeight = 144;

                const centerX = wrapperRect.width / 2 - cardWidth / 2;
                const centerY = wrapperRect.height / 2 - cardHeight / 2;

                // 카드 겹치기 최소화
                const cardDiagonal = Math.sqrt(cardWidth * cardWidth + cardHeight * cardHeight);
                const minDistance = cardDiagonal * 1.2;
                const positions = [];

                // 중앙으로 모으기
                Array.from(cards).forEach((card) => {
                    gsap.set(card, { x: centerX, y: centerY, rotation: 0, scale: 1 });
                });

                // 중앙 기준 랜덤 흩뿌리기
                Array.from(cards).forEach((card, i) => {
                    let x, y;
                    let tries = 0;
                    const maxTries = 50;

                    do {
                        const maxOffsetX = wrapperRect.width / 2 - cardWidth / 2;
                        const maxOffsetY = wrapperRect.height / 2 - cardHeight / 2;

                        x = centerX + (Math.random() - 0.5) * maxOffsetX * 2;
                        y = centerY + (Math.random() - 0.5) * maxOffsetY * 2;

                        tries ++;
                    } while (
                        positions.some(pos => {
                            const dx = pos.x - x;
                            const dy = pos.y - y;
                            return Math.sqrt(dx * dx + dy * dy) < minDistance;
                        }) && tries < maxTries
                    );

                    positions.push({x, y});
                    const rotation = (Math.random() - 0.5) * 30;

                    this.basePositions[i] = { x, y, rotation };

                    gsap.to(card, {
                        x,
                        y,
                        rotation,
                        duration: 0.6,
                        ease: 'power2.out',
                    });
                });
            });
        },
        scatterCards() {
            if (!this.$refs.wrapper) return;
            const cards = this.$refs.wrapper.children;
            if (cards.length === 0) return;
            
            const wrapperRect = this.$refs.wrapper.getBoundingClientRect();
            
            const isMobile = window.innerWidth <= 768;
            const cardWidth = isMobile ? 72 : 104;
            const cardHeight = isMobile ? 104 : 144;

            const centerX = wrapperRect.width / 2 - cardWidth / 2;
            const centerY = wrapperRect.height / 2 - cardHeight / 2;

            const cardDiagonal = Math.sqrt(cardWidth * cardWidth + cardHeight * cardHeight);
            const minDistance = cardDiagonal * 1.2;
            const positions = [];

            Array.from(cards).forEach((card, i) => {
                let x, y;
                let tries = 0;
                const maxTries = 100;

                do {
                    const maxOffsetX = wrapperRect.width / 2 - cardWidth / 2;
                    const maxOffsetY = wrapperRect.height / 2 - cardHeight / 2;

                    x = centerX + (Math.random() - 0.5) * maxOffsetX * 2;
                    y = centerY + (Math.random() - 0.5) * maxOffsetY * 2;

                    tries++;
                } while (
                    positions.some(pos => {
                        const dx = pos.x - x;
                        const dy = pos.y - y;
                        return Math.sqrt(dx*dx + dy*dy) < minDistance;
                    }) && tries < maxTries
                );

                positions.push({ x, y });
                const rotation = (Math.random() - 0.5) * 30;
                this.basePositions[i] = { x, y, rotation };

                gsap.set(card, { x, y, rotation, scale: 1 });
            });
            
            this.lastWrapperSize = { width: wrapperRect.width, height: wrapperRect.height };
            this.isScattered = true;
        },
        hoverCard(index) {
            this.filteredSkills[index].flipped = true;
            const cards = this.$refs.wrapper.children;
            const isMobile = window.innerWidth <= 768;
            const hoverScale = isMobile ? 2 : 1.5;
            
            Array.from(cards).forEach((card, i) => {
                if (i !== index) {
                    gsap.set(card, { zIndex: 1 });
                }
            });
            
            // 호버된 카드만 맨 앞으로
            gsap.to(cards[index], {
                zIndex: 1000,
                scale: hoverScale,
                rotation: 0,
                duration: 0.2,
                ease: 'power2.out',
            });
        },
        leaveCard(index) {
            this.filteredSkills[index].flipped = false;
            const base = this.basePositions[index];
            gsap.to(this.$refs.wrapper.children[index], {
                zIndex: 1,
                scale: 1,
                rotation: base.rotation,
                x: base.x,
                y: base.y,
                duration: 0.2,
                ease: 'power2.out',
            });
        },
        handleMouseMove(e) {
            this.mouse.x = e.clientX / window.innerWidth - 0.5;
            this.mouse.y = e.clientY / window.innerHeight - 0.5;

            const cards = this.$refs.wrapper.children;
            this.basePositions.forEach((base, i) => {
                const offsetX =
                this.mouse.x * 30 * ((i + 1) / this.filteredSkills.length);
                const offsetY =
                this.mouse.y * 30 * ((i + 1) / this.filteredSkills.length);

                gsap.to(cards[i], {
                    x: base.x + offsetX,
                    y: base.y + offsetY,
                    rotation: base.rotation + this.mouse.x * 15,
                    duration: 0.2,
                    ease: 'power2.out',
                });
            });
        },
    },
};
</script>

<style lang='scss' scoped>
@use '@/assets/scss/base/variables.scss' as *;
@import '@/assets/scss/layout/page.scss';

.tray {
    background: url('@/assets/img/home/tray.png') no-repeat 50% 50%;
    background-size: contain;
    width: 100%;
    height: 60vh;
    margin: 5vh auto;
    padding: 5vh 0 0;
}
.skill-cards-wrapper {
    position: relative;
    width: 80%;
    height: 100%;
    margin: auto;
}

.skill-card {
    position: absolute;
    width: 104px;
    height: 144px;
    transform-style: preserve-3d;
    transform-origin: center center;

    .card-inner {
        width: 100%;
        height: 100%;
        transform-style: preserve-3d;
        transition: transform 0.6s;

        &.flipped {
            transform: rotateY(180deg);
        }
        .card-front,
        .card-back {
            position: absolute;
            width: 100%;
            height: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
            backface-visibility: hidden;
            font-weight: bold;
            border-radius: 8px;
            box-shadow: $shadow-card;
        }
        .card-front {
            background: $white1;
            // img {
            //     filter: grayscale(1);
            // }
        }
        .card-back {
            background: $blueblack2;
            transform: rotateY(180deg);
            color: $white1;
            flex-direction: column;
            gap: 8px;

            h3 {
                font-size: 1.2rem;
                font-family: 'BigShoulders', 'Namsan';
                font-weight: 400;
                text-align: center;
            }

            .stars {
                display: flex;

                span {
                    color: $blueblack1;
                    font-size: 0.8rem;

                    &.filled.animate {
                        animation: fillStar 0.4s forwards;
                        animation-delay: calc(var(--i) * 0.2s); 
                    }
                }
            }
        }
    }
}

.tabs {
    display: flex;
    justify-content: center;
    gap: 8px;
    z-index: 1;

    #button-round::v-deep {
        &.active .button {
            background-color: $black1;

            .title {
                color: $white1;
            }
        }

        .button {
            padding: 8px 12px;
            background-color: rgba(237, 237, 237, 0.4);
            
            .circle::before {
                background-color: $black1;
                opacity: 0.8;
            }
        }
    }
}

.def {
    margin: 16px auto 0;
    ul {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 16px;
        li {
            font-size: 0.8rem;
            color: $black1;
        }
    }
}

@keyframes fillStar {
    0% {
        color: $black0;
    }
    100% {
        color: $gray0;
    }
}

// mobile
@media all and (max-width: $mobile) {
    #RandomSkillCard {
        display: grid;
    }

    .tray {
        background: url('@/assets/img/home/tray_mb.png') no-repeat 50% 50%;
        background-size: contain;
        height: 80vh;
        padding: 0;
        // margin: 0;
    }
                
    .skill-cards-wrapper {
        .skill-card {
            width: 72px;
            height: 104px;
            .card-back {
                h3 {
                    font-size: 0.8rem;
                }
                .stars span {
                    font-size: 0.4rem;
                }
            }
        }
    }

    .tabs {
        overflow-x: scroll;
        display: grid;
        grid-template-columns: auto auto auto auto auto;
        justify-content: initial;
        padding: 0 5vw;
        &::-webkit-scrollbar {
            display: none;
        }
        #button-round::v-deep .button {
            word-break: keep-all;
        }
    }

    .def {
        display: none;
        text-align: center;
        grid-row: 1/2;
        width: 100%;
        ul {
            align-items: flex-start;
            display: grid;
            grid-template-columns: 1fr 1fr 1fr;
            li {
                font-size: 0.6rem;
            }
        }
    }

}
</style>