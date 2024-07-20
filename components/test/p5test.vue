<template>
    <div id="canvas"></div>
</template>
  
<script>
export default {
    name: 'App',
    async mounted() {
        const { default: P5 } = await import('p5')

        const script = p5 => {
            // These are your typical setup() and draw() methods
            p5.setup = () => {
                p5.createCanvas(window.innerWidth, window.innerHeight);
            };
            p5.draw = () => {
                p5.clear();
                p5.background("aqua");
                p5.ellipse(p5.mouseX, p5.mouseY, 40, 40);

                //when mouse button is pressed, circles turn black
                if (p5.mouseIsPressed === true) {
                    p5.fill(0);
                } else {
                    p5.fill(255);
                }
            };
        }
        // Attach the canvas to the div
        const p5canvas = new P5(script, 'canvas');
    },
}
</script>