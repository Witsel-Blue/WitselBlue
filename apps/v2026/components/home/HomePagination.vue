<template>
    <div id='home-pagination'>
        <ul>
            <li>
                <button>
                    01
                </button>
                <p>profile</p>
            </li>
            <li>
                <button>
                    02
                </button>
                <p>story</p>
            </li>
        </ul>
    </div>
</template>

<script>
    export default {
        name: 'HomePagination',
        data() {
            return {
                pagination: [
                    {
                        id: 1,
                        title: 'profile',
                        link: '/',
                    },
                    {
                        id: 2,
                        title: 'story',
                        link: '/story',
                    }
                ],
            }
        },
        methods: {
            scrollTo(id) {
                const element = document.getElementById(id);
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth' });
                }
            }
        }
    };
</script>

<style lang='scss' scoped>
    @use '@/assets/scss/base/variables' as *;

    #home-pagination {
        position: fixed;
        top: 50%;
        left: 2.5vw;
        transform: translateY(-50%);
        z-index: 100;

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
                }

                p {
                    display: flex;
                    align-items: center;
                    gap: 8px;

                    &::before {
                        content: '';
                        width: 24px;
                        height: 1px;
                        display: inline-block;
                        background-color: $white;
                    }
                }
            }
        }
    }
</style>