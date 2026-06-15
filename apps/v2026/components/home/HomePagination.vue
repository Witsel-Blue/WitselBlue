<template>
    <div id='home-pagination' :class='{ shown }' :style='posStyle'>
        <ul>
            <li
                v-for='item in pagination'
                :key='item.id'
                :class='{ active: activeId === item.id }'
            >
                <button type='button' @click='go(item)'>
                    {{ item.id }}
                </button>
                <p><span>{{ item.title }}</span></p>
            </li>
        </ul>
    </div>
</template>

<script>
    export default {
        name: 'HomePagination',
        data() {
            return {
                shown: false,
                topPx: 0,
                activeId: null,
                centeredId: null,
                pagination: [
                    {
                        id: '01',
                        title: 'profile',
                        target: 'profile',
                    },
                    {
                        id: '02',
                        title: 'story',
                        target: 'story',
                    },
                    {
                        id: '03',
                        title: 'archive',
                        target: 'archive',
                    }
                ],
            }
        },
        computed: {
            posStyle() {
                return { top: `${this.topPx}px` };
            },
        },
        mounted() {
            this.onScroll = () => {
                const vh = window.innerHeight;
                const mid = vh / 2;
                const profile = document.getElementById('profile');
                if (profile) {
                    const rect = profile.getBoundingClientRect();
                    const center = rect.top + rect.height / 2;
                    this.shown = rect.top < vh;
                    this.topPx = Math.max(center, mid);
                }
                this.updateActiveSection(mid);
            };
            window.addEventListener('scroll', this.onScroll, { passive: true });
            window.addEventListener('resize', this.onScroll, { passive: true });
            this.onScroll();
        },
        beforeDestroy() {
            window.removeEventListener('scroll', this.onScroll);
            window.removeEventListener('resize', this.onScroll);
        },
        methods: {
            updateActiveSection(mid) {
                let best = null;
                let bestDist = Infinity;
                this.pagination.forEach((item) => {
                    const el = document.getElementById(item.target);
                    if (!el) return;
                    const r = el.getBoundingClientRect();
                    const center = r.top + r.height / 2;
                    const dist = Math.abs(center - mid);
                    if (dist < bestDist) {
                        bestDist = dist;
                        best = item;
                    }
                });
                if (best && bestDist < mid) {
                    if (this.centeredId !== best.id) {
                        this.centeredId = best.id;
                        this.activeId = best.id;
                        this.$root.$emit('section-active', best.target);
                    }
                }
            },
            go(item) {
                this.activeId = item.id;
                const element = document.getElementById(item.target);
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            },
        },
    };
</script>

<style lang='scss' scoped>
    @use '@/assets/scss/base/variables' as *;

    #home-pagination {
        position: fixed;
        top: 0;
        left: 2.5vw;
        transform: translateY(-50%);
        will-change: top;
        z-index: 10;
        opacity: 0;
        visibility: hidden;
        transition: opacity 0.5s ease;
        pointer-events: none;

        &.shown {
            opacity: 1;
            visibility: visible;
            pointer-events: auto;
        }

        ul {
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            gap: 8px;

            li {
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 8px;
                font-size: 0.75rem;
                letter-spacing: 0.2em;
                text-transform: uppercase;
                opacity: 0.4;

                button {
                    min-width: 20px;
                    cursor: pointer;
                }

                p {
                    display: flex;
                    align-items: center;
                    gap: 8px;

                    &::before {
                        content: '';
                        width: 0;
                        height: 1px;
                        display: inline-block;
                        background-color: $white;
                        transition: width 0.4s ease;
                    }

                    span {
                        opacity: 0;
                        transform: translateX(-8px);
                        transition: opacity 0.4s ease 0.4s,
                            transform 0.4s ease 0.4s;
                    }
                }

                &.active {
                    opacity: 1;

                    p {
                        &::before {
                            width: 24px;
                        }

                        span {
                            opacity: 1;
                            transform: translateX(0);
                        }
                    }
                }
            }
        }
    }
</style>