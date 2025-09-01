<template>
    <div id="archive_detail" v-if="archive">
        <CursorCustom />
        <PageTransition :title="archive.title" />

        <div class="contents">
            <section class="main">
                <div class="inner">
                    <div class="mainvisual" data-aos="fade-up">
                        <ParallaxImg :src="archive.images.mainvisual" />
                    </div>

                    <div class="title" data-aos="fade-up">
                        <p>{{ archive.tags.work }}</p>
                        <a
                            class="mouse-hover1"
                            :target="archive.link.target"
                            :href="archive.link.href"
                        >
                            <TextShifting :text="archive.title" />
                        </a>
                    </div>
                </div>
            </section>

            <section>
                <div class="inner">
                    <p
                        v-if="archive.content.about"
                        data-aos="fade-up"
                        class="txt-c" 
                        v-html="archive.content.about"
                    />
                    <ButtonRound
                        v-if="archive.link.href"
                        data-aos="fade-up"
                        class="mt-32 txt-c"
                        :link="archive.link"
                    />
                </div>
            </section>
        </div>

        <!-- <Pagination :pagination="pagination" /> -->
    </div>

    <div v-else>
        <p class="txt-c">해당 아카이브를 찾을 수 없습니다.</p>
    </div>
</template>

<script>
import archiveDevData from '@/assets/data/archive_dev.js';
import CursorCustom from '@/components/CursorCustom.vue';
import PageTransition from '@/layouts/PageTransition.vue';
import ParallaxImg from '@/components/ParallaxImg.vue';
import ButtonRound from '@/components/ButtonRound.vue';
import TextShifting from '@/components/TextShifting.vue';
import Pagination from '@/components/Pagination.vue';

export default {
    components: {
        CursorCustom,
        PageTransition,
        ParallaxImg,
        ButtonRound,
        TextShifting,
        Pagination,
    },
    async asyncData({ params, store }) {
        const archive = archiveDevData.find(item => item.slug === params.slug);

        store.commit('setDetailPage', true);

        return { 
            archive: archive || null 
        };
    },
    data() {
        return {
        }
    },
    beforeDestroy() {
        this.$store.commit('setDetailPage', false);
    },
    mounted() {

    },
}
</script>
