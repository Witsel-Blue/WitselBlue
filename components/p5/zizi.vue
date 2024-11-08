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
            };

            p5.draw = () => {
                p5.clear();
                face();

                function face() {
                     // ears
                    p5.push();
                        p5.translate(earMove.x, earMove.y);
                        p5.fill("rgb(53,64,94)");
                        p5.ellipse(-80, -90, 80, 140);
                        p5.ellipse(80, -90, 80, 140);
                        p5.fill("#442F68");
                        p5.ellipse(-80, -90, 50, 110);
                        p5.ellipse(80, -90, 50, 110);
                    p5.pop();
                
                    // face
                    p5.fill("rgb(53,64,94)");
                    p5.ellipse(0, 20, 300, 240);
                
                    // eyes
                    p5.push();
                        p5.translate(eyeMove.x, eyeMove.y);
                    
                        if(mouseIsPressed) {
                            // closedEyes
                            p5.line(-30, 30, -75, 30);
                            p5.line(-30, 30, -70, 50);
                            p5.line(-30, 30, -70, 10);
                            p5.line(30, 30, 75, 30);
                            p5.line(30, 30, 70, 50);
                            p5.line(30, 30, 70, 10);
                        } else {
                            //eyes
                            p5.fill("white");
                            p5.ellipse(-60, 20, 100, 100);
                            p5.ellipse(60, 20, 100, 100);
                            // pupil
                            p5.push();
                            p5.translate(pupilMove.x, pupilMove.y);
                            p5.fill("rgb(0,0,0)");
                            p5.ellipse(60, 20, 40, 60);
                            p5.ellipse(-60, 20, 40, 60);
                            p5.pop(); 
                        }
                    p5.pop();
                
                    // nose
                    p5.push();
                        p5.translate(noseMove.x, noseMove.y);
                        p5.line(-3, 70, 3, 70);
                        p5.line(0, 75, -5, 70);
                        p5.line(0, 75, 5, 70);
                        p5.ine(0, 75, 0, 90);
                    p5.pop();
                
                    // mouth
                    p5.push();
                        p5.translate(mouthMove.x, noseMove.y);
                        p5.fill("rgb(187,75,95)");
                        p5.ellipse(0, 100, 40, 30);
                    p5.pop();
                
                    // whiskers
                    p5.push();
                        p5.translate(whiskersMove.x, whiskersMove.y);
                        p5.strokeWeight(2);
                        p5.line(-80, 80, -130, 65);
                        p5.line(-80, 92.5, -150, 92.5);
                        p5.line(-80, 105, -130, 115);
                        p5.line(80, 80, 130, 65);
                        p5.line(80, 92.5, 150, 92.5);
                        p5.line(80, 105, 130, 115);
                    p5.pop();

                }
            };
        }

        const p5canvas = new P5(script, 'canvas');
    },
}
</script>