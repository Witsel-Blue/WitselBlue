export const kikiSnippet = `
import p5 from 'p5';

const s = (p) => {
    let w = window.innerWidth;
    let h = window.innerHeight;

    p.setup = () => {
        p.createCanvas(w, h);
        p.noCursor();
    };

    p.windowResized = () => {
        w = window.innerWidth;
        h = window.innerHeight;
        p.resizeCanvas(w, h);
    };

    p.draw = () => {
        p.background('rgb(46,46,70)');
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
        const d = center.dist(mouse);

        let s = 0.8;
        let mouthW = 40;
        let pupil = 60;
        if (d < 150) {
            s = 1;
            mouthW = 60;
            pupil = 40;
        }
        p.scale(s);
        p.strokeWeight(5);
        p.push();
        p.translate(0, 25);

        // ribbon
        p.fill('#AB1A1A');
        p.ellipse(-62, -165, 90, 80);
        p.ellipse(62, -165, 90, 80);
        p.ellipse(0, -160, 45, 60);

        // hair
        p.fill('#352F28');
        p.rectMode(p.CENTER);
        p.rect(0, 50, 310, 160, 40);

        // ears
        p.fill('rgb(253,234,221)');
        p.ellipse(150, 20, 70, 70);
        p.ellipse(-150, 20, 70, 70);

        // face
        p.fill('rgb(253,234,221)');
        p.ellipse(0, 0, 300, 300);

        // hair fringe
        p.fill('#352F28');
        p.rect(0, -110, 120, 100, 40, 40, 80, 80);
        p.arc(-5, -20, 300, 280, p.PI, p.PI + p.HALF_PI);
        p.arc(5, -20, 300, 280, 300, 0);

        // eyelashes
        p.noFill();
        p.arc(89, -30, 30, -20, 0, p.HALF_PI);
        p.arc(-88, -30, 30, -20, 90, p.PI);

        // eyes
        p.fill('white');
        p.ellipse(-60, 20, 100, 100);
        p.ellipse(60, 20, 100, 100);

        // pupil
        p.fill('rgb(33,33,41)');
        p.ellipse(60, 20, pupil, pupil);
        p.ellipse(-60, 20, pupil, pupil);

        // nose
        p.line(0, 70, -5, 68);
        p.line(0, 70, 5, 68);

        // mouth
        p.fill('rgb(187,75,95)');
        p.ellipse(0, 100, mouthW, 30);

        // eyebrows
        p.noFill();
        p.strokeWeight(8);
        p.arc(-60, 0, 120, 120, 180, -45);
        p.arc(60, 0, 120, 120, 180, -45);

        p.pop();
        p.pop();
    }
};

new p5(s);
`;