export const ziziSnippet = `
import p5 from 'p5';

const s = (p) => {
    p.setup = () => {
        p.createCanvas(window.innerWidth, window.innerHeight);
        p.noCursor();
    };

    p.windowResized = () => {
        p.resizeCanvas(window.innerWidth, window.innerHeight);
    };

    p.draw = () => {
        p.background('#ededed');
        face(p.width / 2, p.height / 2);
        butterfly();
    };

    function butterfly() {
        p.strokeWeight(3);
        p.push();
        p.translate(p.mouseX, p.mouseY);
        p.fill('rgb(243,224,118)');
        p.ellipse(-12, 10, 20, 20);
        p.ellipse(-15, -10, 28, 28);
        p.ellipse(12, 10, 20, 20);
        p.ellipse(15, -10, 28, 28);
        p.strokeWeight(10);
        p.line(0, -15, 0, 15);
        p.strokeWeight(3);
        p.noFill();
        p.arc(0, -25, 15, 15, -45, 180);
        p.pop();
    }

    function face(x, y) {
        p.push();
        p.translate(x, y);

        const center = p.createVector(x, y);
        const mouse = p.createVector(p.mouseX, p.mouseY);
        const move = p5.Vector.sub(mouse, center);
        move.mult(0.2);
        move.limit(25);

        const pupilMove = move.copy(); 
        pupilMove.limit(20);
        const eyeMove = move.copy(); 
        eyeMove.mult(0.5);
        const noseMove = move.copy(); 
        noseMove.mult(0.5);
        const mouthMove = move.copy(); 
        mouthMove.mult(0.4);
        const whiskersMove = move.copy(); 
        whiskersMove.mult(0.7);
        const earMove = move.copy(); 
        earMove.mult(-0.2);

        p.strokeWeight(5);

        // ears
        p.push();
        p.translate(earMove.x, earMove.y);
        p.fill('rgb(53,64,94)');
        p.ellipse(-80, -90, 80, 140);
        p.ellipse(80, -90, 80, 140);
        p.fill('#442F68');
        p.ellipse(-80, -90, 50, 110);
        p.ellipse(80, -90, 50, 110);
        p.pop();

        // face
        p.fill('rgb(53,64,94)');
        p.ellipse(0, 20, 300, 240);

        // eyes
        p.push();
        p.translate(eyeMove.x, eyeMove.y);
        if (p.mouseIsPressed) {
            p.line(-30, 30, -75, 30);
            p.line(-30, 30, -70, 50);
            p.line(-30, 30, -70, 10);
            p.line(30, 30, 75, 30);
            p.line(30, 30, 70, 50);
            p.line(30, 30, 70, 10);
        } else {
            p.fill('white');
            p.ellipse(-60, 20, 100, 100);
            p.ellipse(60, 20, 100, 100);
            p.push();
            p.translate(pupilMove.x, pupilMove.y);
            p.fill('rgb(0,0,0)');
            p.ellipse(60, 20, 40, 60);
            p.ellipse(-60, 20, 40, 60);
            p.pop();
        }
        p.pop();

        // nose
        p.push();
        p.translate(noseMove.x, noseMove.y);
        p.line(-3, 70, 3, 70);
        p.line(0, 75, -5, 70);
        p.line(0, 75, 5, 70);
        p.line(0, 75, 0, 90);
        p.pop();

        // mouth
        p.push();
        p.translate(mouthMove.x, noseMove.y);
        p.fill('rgb(187,75,95)');
        p.ellipse(0, 100, 40, 30);
        p.pop();

        // whiskers
        p.push();
        p.translate(whiskersMove.x, whiskersMove.y);
        p.strokeWeight(2);
        p.line(-80, 80, -130, 65);
        p.line(-80, 92.5, -150, 92.5);
        p.line(-80, 105, -130, 115);
        p.line(80, 80, 130, 65);
        p.line(80, 92.5, 150, 92.5);
        p.line(80, 105, 130, 115);
        p.pop();

        p.pop();
    }
};

new p5(s);
`;