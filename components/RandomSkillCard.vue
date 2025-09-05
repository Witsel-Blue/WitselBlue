<template>
  <div id="RandomSkillCard">

    <!-- tabs -->
    <div class="tabs">
      <button
        v-for="cat in categories"
        :key="cat"
        :class="{ active: activeCategory === cat }"
        @click="switchCategory(cat)"
      >
        {{ cat }}
      </button>
    </div>

    <!-- card wrapper -->
    <div
      class="skill-cards-wrapper"
      ref="wrapper"
      @mousemove="handleMouseMove"
    >
      <div
        v-for="(skill, index) in filteredSkills"
        :key="skill.name"
        class="skill-card"
        @mouseenter="hoverCard(index)"
        @mouseleave="leaveCard(index)"
      >
        <div class="card-inner" :class="{ flipped: skill.flipped }">
          <div class="card-front">{{ skill.name }}</div>
          <div class="card-back">{{ skill.category }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import gsap from "gsap";

export default {
    name: "RandomSkillCard",
    data() {
        return {
        categories: ["Framework", "Library", "Tool"],
        activeCategory: "Framework",
        skills: [
            { name: "Vue.js", category: "Framework", flipped: false },
            { name: "React.js", category: "Framework", flipped: false },
            { name: "GSAP", category: "Library", flipped: false },
            { name: "p5.js", category: "Library", flipped: false },
            { name: "Three.js", category: "Library", flipped: false },
            { name: "Tailwind", category: "Tool", flipped: false },
            { name: "Figma", category: "Tool", flipped: false },
        ],
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
        window.addEventListener("resize", this.scatterCards);
    },
    beforeDestroy() {
        window.removeEventListener("resize", this.centerCards);
    },
    methods: {
        switchCategory(cat) {
            if (this.activeCategory === cat) return;
            this.activeCategory = cat;

            this.$nextTick(() => {
                const cards = this.$refs.wrapper.children;
                const wrapperRect = this.$refs.wrapper.getBoundingClientRect();
                const cardWidth = 150;
                const cardHeight = 200;

                const centerX = wrapperRect.width / 2 - cardWidth / 2;
                const centerY = wrapperRect.height / 2 - cardHeight / 2;

                // 중앙으로 모으기
                Array.from(cards).forEach((card) => {
                    gsap.set(card, { x: centerX, y: centerY, rotation: 0, scale: 1 });
                });

                // 중앙 기준 랜덤 흩뿌리기
                Array.from(cards).forEach((card, i) => {
                    const maxOffsetX = wrapperRect.width / 2 - cardWidth / 2;
                    const maxOffsetY = wrapperRect.height / 2 - cardHeight / 2;

                    const x = centerX + (Math.random() - 0.5) * maxOffsetX * 2;
                    const y = centerY + (Math.random() - 0.5) * maxOffsetY * 2;
                    const rotation = (Math.random() - 0.5) * 30;

                    // basePositions 업데이트
                    this.basePositions[i] = { x, y, rotation };

                    // 애니메이션 적용
                    gsap.to(card, {
                        x,
                        y,
                        rotation,
                        duration: 0.6,
                        ease: "power2.out",
                    });
                });
            });
        },
        scatterCards() {
            if (!this.$refs.wrapper) return;
            const cards = this.$refs.wrapper.children;
            const wrapperRect = this.$refs.wrapper.getBoundingClientRect();
            const cardWidth = 150;
            const cardHeight = 200;

            const centerX = wrapperRect.width / 2 - cardWidth / 2;
            const centerY = wrapperRect.height / 2 - cardHeight / 2;

            const minDistance = 160;
            const positions = [];

            Array.from(cards).forEach((card, i) => {
                let x, y;
                let tries = 0;
                const maxTries = 50;

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
                ease: "power2.out",
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
                ease: "power2.out",
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
                    ease: "power2.out",
                });
            });
        },
    },
};
</script>

<style lang='scss' scoped>
.tabs {
    display: flex;
    justify-content: center;
    margin-bottom: 16px;

    button {
        padding: 8px 20px;
        margin: 0 8px;
        border-radius: 8px;
        border: none;
        cursor: pointer;
        font-weight: bold;
        background-color: #374151;
        color: white;
        transition: background-color 0.3s;

        &.active {
            background-color: #4f46e5;
        }
    }
}

.skill-cards-wrapper {
    position: relative;
    width: 100%;
    height: 80vh;
    perspective: 1000px;
    background: linear-gradient(135deg, #1e293b, #111827);
    overflow: hidden;
}

.skill-card {
    position: absolute;
    width: 150px;
    height: 200px;
    transform-style: preserve-3d;
    transform-origin: center center;
    cursor: pointer;

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
            border-radius: 16px;
            display: flex;
            justify-content: center;
            align-items: center;
            backface-visibility: hidden;
            font-weight: bold;
            color: #fff;
        }
        .card-front {
            background-color: #4f46e5;
        }
        .card-back {
            background-color: #10b981;
            transform: rotateY(180deg);
        }
    }
}
</style>
