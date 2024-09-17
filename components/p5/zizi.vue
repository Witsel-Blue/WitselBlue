<template>
    <div id="canvas"></div>
</template>
  
<script>
export default {
    name: 'Zizi',
    async mounted() {
        const { default: P5 } = await import('p5')

        const script = p5 => {
            p5.setup = () => {
                p5.createCanvas(window.innerWidth, window.innerHeight);
                p5.noCursor();
            };

            p5.draw = () => {
                p5.clear();
                mouse();

                function mouse() {
                    p5.ellipse(p5.mouseX, p5.mouseY, 40, 40);
                }
            };
        }

        const p5canvas = new P5(script, 'canvas');
    },
}
</script>