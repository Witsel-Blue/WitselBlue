<template>
  <div id='RandomSkillCard'>

    <!-- card wrapper -->
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
                <img :src='skill.logo' />
            </div>
            <div class='card-back'>
                <h3>{{ skill.title }}</h3>
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

    <!-- tabs -->
    <div class='tabs'>
        <ButtonRound
            v-for='cat in categories'
            :key='cat'
            :text='cat'
            :class='{active: activeCategory === cat}'
            @click='switchCategory(cat)'
        />
    </div>

    <div class='def'>
       <div class='inner'>
            <ul>
                <li>★★★: I can manage</li>
                <li>★★★★: I'm solid</li>
                <li>★★★★★: Mastered!</li>
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
        categories: ['Framework', 'Library', 'Language', 'UI / Design', 'Environment'],
        activeCategory: 'Framework',
        skills: SkillsData,
        basePositions: [],
        mouse: { x: 0, y: 0 },
        };
    },
    computed: {
        filteredSkills() {
            return this.skills.filter(
                (skill) => skill.category === this.activeCategory
            );
        },
    },
    mounted() {
        this.$nextTick(() => {
            this.scatterCards();
        });
        window.addEventListener('resize', this.scatterCards);
    },
    beforeDestroy() {
        window.removeEventListener('resize', this.centerCards);
    },
    methods: {
        switchCategory(cat) {
            if (this.activeCategory === cat) return;
            this.activeCategory = cat;

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

                    // basePositions 업데이트
                    this.basePositions[i] = { x, y, rotation };

                    // 애니메이션 적용
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
            const wrapperRect = this.$refs.wrapper.getBoundingClientRect();
            const cardWidth = 104;
            const cardHeight = 144;

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
        },
        hoverCard(index) {
            this.filteredSkills[index].flipped = true;
            gsap.to(this.$refs.wrapper.children[index], {
                zIndex: 100,
                scale: 1.2,
                rotation: 0,
                duration: 0.3,
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
                duration: 0.3,
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
                    duration: 0.3,
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

.tabs {
    display: flex;
    justify-content: center;
    gap: 8px;

    #button-round::v-deep {
        &.active .button {
            background-color: #3E3C3C;

            .title {
                color: #fff;
            }
        }

        .button {
            padding: 8px 12px;
            border-radius: 16px;
            
            .circle::before {
                background-color: #3E3C3C;
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
            font-family: 'Diphylleia';
        }
    }
}

.skill-cards-wrapper {
    position: relative;
    width: 100%;
    height: 40vh;
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
            box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
        }
        .card-front {
            background-color: #f3f3f3;
        }
        .card-back {
            background-color: $blue1;
            transform: rotateY(180deg);
            color: #fff;
            flex-direction: column;
            gap: 8px;

            h3 {
                font-size: 1rem;
            }

            .stars {
                display: flex;

                span {
                    color: $blue0;
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

@keyframes fillStar {
    0% {
        color: $gray0;
    }
    100% {
        color: #ffcb72;
    }
}
</style>
