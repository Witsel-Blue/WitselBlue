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
                let trailBatches = [];
                let isMobile = false;
                let lastMouseX = 0;
                let lastMouseY = 0;
                let mouseMoveThreshold = 1.5;
                let trailLength = 60;

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
                    s.fill('#3E3C3C');
                    s.ellipse(-80 * scaleFactor, -90 * scaleFactor, 80 * scaleFactor, 140 * scaleFactor);
                    s.ellipse(80 * scaleFactor, -90 * scaleFactor, 80 * scaleFactor, 140 * scaleFactor);
                    s.fill('#A29BB9');
                    s.ellipse(-80 * scaleFactor, -90 * scaleFactor, 50 * scaleFactor, 110 * scaleFactor);
                    s.ellipse(80 * scaleFactor, -90 * scaleFactor, 50 * scaleFactor, 110 * scaleFactor);
                    s.pop();

                    // face
                    s.fill('#3E3C3C');
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
                        s.fill('black');
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
                    s.fill('rgb(182,104,118)');
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

                // 마우스 궤적
                s.addTrailCircle = function(x, y) {
                    const numCircles = Math.floor(s.random(3, 6));
                    const batch = { circles: [], createdAt: s.millis() };
                    
                    for (let i = 0; i < numCircles; i++) {
                        const offsetX = s.random(-15, 15);
                        const offsetY = s.random(-15, 15);
                        
                        batch.circles.push({
                            x: x + offsetX,
                            y: y + offsetY,
                            opacity: s.random(0.5, 1),
                            size: s.random(3, 8),
                            life: 1.0,
                            maxLife: s.random(0.2, 0.5)
                        });
                    }
                    
                    trailBatches.push(batch);
                    if (trailBatches.length > trailLength) {
                        trailBatches.shift();
                    }
                };

                s.mouseMoved = function() {
                    if (isMobile) return;
                    const distance = s.dist(s.mouseX, s.mouseY, lastMouseX, lastMouseY);
                    if (distance > mouseMoveThreshold) {
                        s.addTrailCircle(s.mouseX, s.mouseY);
                        lastMouseX = s.mouseX;
                        lastMouseY = s.mouseY;
                    }
                };

                s.updateAndDrawTrail = function() {
                    for (let b = 0; b < trailBatches.length; b++) {
                        const batch = trailBatches[b];
                        if (!batch) continue;
                        
                        const positionRatio = trailBatches.length <= 1 ? 0 : b / (trailBatches.length - 1);
                        const batchOpacityFactor = 0.3 + 0.7 * positionRatio;
                        
                        for (let i = batch.circles.length - 1; i >= 0; i--) {
                            const circle = batch.circles[i];
                            circle.life -= s.deltaTime / 1000 / circle.maxLife;
                            if (circle.life <= 0) {
                                batch.circles.splice(i, 1);
                            }
                        }
                        if (batch.circles.length === 0) {
                            continue;
                        }
                        
                        const maxRenderable = batch.circles.length;
                        const renderCount = Math.max(1, Math.round((b + 1) / trailBatches.length * maxRenderable));
                        
                        for (let i = 0; i < Math.min(renderCount, batch.circles.length); i++) {
                            const circle = batch.circles[i];
                            const currentOpacity = circle.opacity * circle.life * batchOpacityFactor;
                            s.push();
                            s.noStroke();
                            s.fill(255, 234, 150, currentOpacity * 255);
                            s.ellipse(circle.x, circle.y, circle.size, circle.size);
                            s.pop();
                        }
                    }
                };

                s.setup = function () {
                    const container = s.select('.p5-wrapper');
                    const { width, height } = container.elt.getBoundingClientRect();
                    s.createCanvas(width, height);
                    s.noCursor();
                    s.updateScale();
                    
                    if (typeof window !== 'undefined') {
                        isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
                            || ('ontouchstart' in window)
                            || (navigator.maxTouchPoints > 0);
                    }
                    
                    lastMouseX = s.mouseX;
                    lastMouseY = s.mouseY;
                };

                s.draw = function () {
                    s.clear();
                    if (!isMobile) {
                        s.updateAndDrawTrail();
                    }
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
    height: 100%;
}
canvas {
    background: transparent !important;
}
</style>