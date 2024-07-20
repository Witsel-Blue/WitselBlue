<template>
    <div id="pager">
        pager
    </div>
</template>

<script>
    let ScrollMagic;

    if (process.client) {
        ScrollMagic = require('scrollmagic')
        // use scrollmagic
    }
</script>