<template>
    <div ref='p5Container' class='p5-wrapper'></div>
</template>

<script>
export default {
    name: 'P5Canvas',
    mounted() {
        if (typeof window !== 'undefined') {
            this.initP5();
        }
    },
    beforeDestroy() {
        if (this.p5Instance) {
            this.p5Instance.remove();
        }
    },
    methods: {
        async initP5() {
            const p5 = (await import('p5')).default;

            const sketch = (s) => {
                let scaleFactor = 1;

                s.updateScale = function () {
                    scaleFactor = Math.min(s.width, s.height) / 800;
                };

                s.face = function (x, y) {
                    s.push();
                    s.translate(x, y);

                    let center = s.createVector(x, y);
                    let mouse = s.createVector(s.mouseX, s.mouseY);
                    let move = s.constructor.Vector.sub(mouse, center);
                    move.mult(0.2);
                    move.limit(25 * scaleFactor);

                    let pupilMove = move.copy();
                    pupilMove.limit(20 * scaleFactor);

                    let eyeMove = move.copy();
                    eyeMove.mult(0.5);

                    let noseMove = move.copy();
                    noseMove.mult(0.5);

                    let mouthMove = move.copy();
                    mouthMove.mult(0.4);

                    let whiskersMove = move.copy();
                    whiskersMove.mult(0.7);

                    let earMove = move.copy();
                    earMove.mult(-0.2);

                    s.strokeWeight(5 * scaleFactor);

                    // ears
                    s.push();
                    s.translate(earMove.x, earMove.y);
                    s.fill('rgb(53,64,94)');
                    s.ellipse(-80 * scaleFactor, -90 * scaleFactor, 80 * scaleFactor, 140 * scaleFactor);
                    s.ellipse(80 * scaleFactor, -90 * scaleFactor, 80 * scaleFactor, 140 * scaleFactor);
                    s.fill('#442F68');
                    s.ellipse(-80 * scaleFactor, -90 * scaleFactor, 50 * scaleFactor, 110 * scaleFactor);
                    s.ellipse(80 * scaleFactor, -90 * scaleFactor, 50 * scaleFactor, 110 * scaleFactor);
                    s.pop();

                    // face
                    s.fill('rgb(53,64,94)');
                    s.ellipse(0, 20 * scaleFactor, 300 * scaleFactor, 240 * scaleFactor);

                    // eyes
                    s.push();
                    s.translate(eyeMove.x, eyeMove.y);

                    if (s.mouseIsPressed) {
                        // closedEyes
                        s.line(-30 * scaleFactor, 30 * scaleFactor, -75 * scaleFactor, 30 * scaleFactor);
                        s.line(-30 * scaleFactor, 30 * scaleFactor, -70 * scaleFactor, 50 * scaleFactor);
                        s.line(-30 * scaleFactor, 30 * scaleFactor, -70 * scaleFactor, 10 * scaleFactor);
                        s.line(30 * scaleFactor, 30 * scaleFactor, 75 * scaleFactor, 30 * scaleFactor);
                        s.line(30 * scaleFactor, 30 * scaleFactor, 70 * scaleFactor, 50 * scaleFactor);
                        s.line(30 * scaleFactor, 30 * scaleFactor, 70 * scaleFactor, 10 * scaleFactor);
                    } else {
                        // eyes
                        s.fill('white');
                        s.ellipse(-60 * scaleFactor, 20 * scaleFactor, 100 * scaleFactor, 100 * scaleFactor);
                        s.ellipse(60 * scaleFactor, 20 * scaleFactor, 100 * scaleFactor, 100 * scaleFactor);
                        // pupil
                        s.push();
                        s.translate(pupilMove.x, pupilMove.y);
                        s.fill('rgb(0,0,0)');
                        s.ellipse(60 * scaleFactor, 20 * scaleFactor, 40 * scaleFactor, 60 * scaleFactor);
                        s.ellipse(-60* scaleFactor, 20* scaleFactor, 40* scaleFactor, 60* scaleFactor);
                        s.pop();
                    }
                    s.pop();

                    // nose
                    s.push();
                    s.translate(noseMove.x, noseMove.y);
                    s.line(-3 * scaleFactor, 70 * scaleFactor, 3 * scaleFactor, 70 * scaleFactor);
                    s.line(0, 75 * scaleFactor, -5 * scaleFactor, 70 * scaleFactor);
                    s.line(0, 75 * scaleFactor, 5 * scaleFactor, 70 * scaleFactor);
                    s.line(0, 75 * scaleFactor, 0, 90 * scaleFactor);
                    s.pop();

                    // mouth
                    s.push();
                    s.translate(mouthMove.x, noseMove.y);
                    s.fill('rgb(187,75,95)');
                    s.ellipse(0, 100 * scaleFactor, 40 * scaleFactor, 30 * scaleFactor);
                    s.pop();

                    // whiskers
                    s.push();
                    s.translate(whiskersMove.x, whiskersMove.y);
                    s.strokeWeight(2);
                    s.line(-80 * scaleFactor, 80 * scaleFactor, -130 * scaleFactor, 65 * scaleFactor);
                    s.line(-80 * scaleFactor, 92.5 * scaleFactor, -150 * scaleFactor, 92.5 * scaleFactor);
                    s.line(-80 * scaleFactor, 105 * scaleFactor, -130 * scaleFactor, 115 * scaleFactor);
                    s.line(80 * scaleFactor, 80 * scaleFactor, 130 * scaleFactor, 65 * scaleFactor);
                    s.line(80 * scaleFactor, 92.5 * scaleFactor, 150 * scaleFactor, 92.5 * scaleFactor);
                    s.line(80 * scaleFactor, 105 * scaleFactor, 130 * scaleFactor, 115 * scaleFactor);
                    s.pop();

                    s.pop();
                };

                s.setup = function () {
                    const container = s.select('.p5-wrapper');
                    const { width, height } = container.elt.getBoundingClientRect();
                    s.createCanvas(width, height);
                    s.noCursor();
                    s.updateScale();
                };

                s.draw = function () {
                    s.clear();
                    s.face(s.width / 2, s.height * 2 / 5);
                };

                s.windowResized = function () {
                    const container = s.select('.p5-wrapper');
                    const { width, height } = container.elt.getBoundingClientRect();
                    s.resizeCanvas(width, height);
                    s.updateScale();
                };
            };

            this.p5Instance = new p5(sketch, this.$refs.p5Container);
        }
    }
};
</script>

<style scoped>
.p5-wrapper {
    width: 100vw;
    height: 100vh;
}
canvas {
    background: transparent !important;
}
</style>