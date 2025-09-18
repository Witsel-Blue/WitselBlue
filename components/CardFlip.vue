<template>
    <div id='card-flip' class='card'>
        <div class='card-inner'>
            <div class='card-front'>
                <img :src='item.images.thumb' />
            </div>
            <div class='card-back'>
                <span>
                    <p class='work'>{{ item.tags.work }}</p>
                    <Nuxt-link v-if='item'
                        class='mouse-hover2'
                        :to="item.category === 'projects' ? `/projects/${item.slug}` :
                            item.category === 'archive_dev' ? `/archive/dev/${item.slug}` :
                            item.category === 'archive_music' ? `/archive/music/${item.slug}` :
                            '/'"
                    >
                        <TextShifting :text='item.title' :key='item.slug' />
                    </Nuxt-link>
                </span>
                <div class='tags'>
                    <p v-for='(value, key) in item.tags' :key='key' v-if='key !== "work"'>
                        #{{ value }}
                    </p>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import TextShifting from '@/components/TextShifting.vue';

export default {
    components: {
        TextShifting,
    },
    props: {
        item: {
            type: Object,
            default: null,
        },
    },
};
</script>

<style lang='scss' scoped>
@use '@/assets/scss/base/variables.scss' as *;

.card {
    width: 218px;
    height: 272px;
    perspective: 1000px;

    .card-inner {
        width: 100%;
        height: 100%;
        transform-style: preserve-3d;
        transition: transform 0.6s;
    }

    &:hover .card-inner {
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
        border-radius:16px;
        box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
    }

    .card-front {
        background: #fff;
        overflow: hidden;
        img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }
    }

    .card-back {
        background: $blue1;
        color: #fff;
        transform: rotateY(180deg);
        display: flex;
        justify-content: space-around;
        align-items: center;
        flex-direction: column;
        padding: 16px;
        text-align: center;
        span > p {
            font-size: 0.8rem;
            color: $blue0;
            margin-bottom: 24px;
        }
        .text-shifting::v-deep span {
            font-weight: bold;
            font-family: 'Diphylleia';
            font-size: 2rem;
            line-height: 1;
            color: #fff;
        }
        .tags {
            p {
                display: inline-block;
                font-size: 0.8rem;
                color: $blue0;
                &:not(:first-child) {
                    margin-left: 4px;
                }
            }
        }
    }
}
</style>