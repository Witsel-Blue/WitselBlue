<template>
    <div id='story'>
        <section>
            <div class='inner'>
                <h2>
                    When People look for pearls, <br/>
                    I find value in the shell.
                </h2>
                <p>
                    Explore and discover my journey as a developer.
                </p>
            </div>
        </section>
        <section/>
    </div>
</template>

<script>
    export default {
        name: 'Story',
    };
</script>

<style lang='scss' scoped>
    @use '@/assets/scss/base/variables' as *;

    #story {
        width: 100%;
        height: 100vh;
    }
</style>