<template>
    <div ref='p5Container' class='p5-wrapper'></div>
</template>

<script>
export default {
    name: 'P5Canvas',
    mounted() {
    // SSR 방지
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
                s.face = function (x, y) {
                    s.push();
                    s.translate(x, y);

                    let center = s.createVector(x, y);
                    let mouse = s.createVector(s.mouseX, s.mouseY);
                    let move = p5.Vector.sub(mouse, center);
                    move.mult(0.2);
                    move.limit(25);

                    let pupilMove = move.copy();
                    pupilMove.limit(20);

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

                    s.strokeWeight(5);

                    // ears
                    s.push();
                    s.translate(earMove.x, earMove.y);
                    s.fill('rgb(53,64,94)');
                    s.ellipse(-80, -90, 80, 140);
                    s.ellipse(80, -90, 80, 140);
                    s.fill('#442F68');
                    s.ellipse(-80, -90, 50, 110);
                    s.ellipse(80, -90, 50, 110);
                    s.pop();

                    // face
                    s.fill('rgb(53,64,94)');
                    s.ellipse(0, 20, 300, 240);

                    // eyes
                    s.push();
                    s.translate(eyeMove.x, eyeMove.y);

                    if (s.mouseIsPressed) {
                        // closedEyes
                        s.line(-30, 30, -75, 30);
                        s.line(-30, 30, -70, 50);
                        s.line(-30, 30, -70, 10);
                        s.line(30, 30, 75, 30);
                        s.line(30, 30, 70, 50);
                        s.line(30, 30, 70, 10);
                    } else {
                        // eyes
                        s.fill('white');
                        s.ellipse(-60, 20, 100, 100);
                        s.ellipse(60, 20, 100, 100);
                        // pupil
                        s.push();
                        s.translate(pupilMove.x, pupilMove.y);
                        s.fill('rgb(0,0,0)');
                        s.ellipse(60, 20, 40, 60);
                        s.ellipse(-60, 20, 40, 60);
                        s.pop();
                    }
                    s.pop();

                    // nose
                    s.push();
                    s.translate(noseMove.x, noseMove.y);
                    s.line(-3, 70, 3, 70);
                    s.line(0, 75, -5, 70);
                    s.line(0, 75, 5, 70);
                    s.line(0, 75, 0, 90);
                    s.pop();

                    // mouth
                    s.push();
                    s.translate(mouthMove.x, noseMove.y);
                    s.fill('rgb(187,75,95)');
                    s.ellipse(0, 100, 40, 30);
                    s.pop();

                    // whiskers
                    s.push();
                    s.translate(whiskersMove.x, whiskersMove.y);
                    s.strokeWeight(2);
                    s.line(-80, 80, -130, 65);
                    s.line(-80, 92.5, -150, 92.5);
                    s.line(-80, 105, -130, 115);
                    s.line(80, 80, 130, 65);
                    s.line(80, 92.5, 150, 92.5);
                    s.line(80, 105, 130, 115);
                    s.pop();

                    s.pop();
                };

                s.setup = function () {
                    const container = s.select('.p5-wrapper');
                    const { width, height } = container.elt.getBoundingClientRect();
                    s.createCanvas(width, height);
                    s.noCursor();
                };

                s.draw = function () {
                    s.clear();
                    s.face(s.width / 2, s.height * 2 / 5);
                };

                s.windowResized = function () {
                    const container = s.select('.p5-wrapper');
                    const { width, height } = container.elt.getBoundingClientRect();
                    s.resizeCanvas(width, height);
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