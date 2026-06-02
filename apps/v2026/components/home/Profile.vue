<template>
    <div id='profile'>
        <div class='inner'>
            <h2 :style='{ opacity: shardMode ? 0 : 1 }'>Profile</h2>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'Profile',
        data() {
            return {
                shardMode: true,
            };
        },
    };
</script>

<style lang='scss' scoped>
    @use '@/assets/scss/base/variables' as *;

    #profile {
        width: 100%;
        height: 100vh;
        background-color: $black;
        display: flex;
        align-items: center;
        justify-content: center;
        
        h2 {
            text-align: center;
            font-size: 4rem;
            transition: opacity 0.2s ease;
        }
    }
</style>