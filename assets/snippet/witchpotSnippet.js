export const witchpotSnippet = `
import p5 from 'p5';

const s = (p) => {
  let colors = [];
  let w = window.innerWidth;
  let h = window.innerHeight;

  p.setup = () => {
    p.createCanvas(w, h);
    p.background('#2C2A2A');

    colors.push('rgba(208, 255, 245, 0.5)');
    colors.push('rgba(100, 218, 216, 0.5)');
    colors.push('rgba(208, 255, 245, 1)');

    pod(p.width / 2, p.height / 2);
  };

  p.windowResized = () => {
    w = window.innerWidth;
    h = window.innerHeight;
    p.resizeCanvas(w, h);
  };

  p.draw = () => {
    if (p.mouseIsPressed) {
      let count = 0;
      while (count < 10) {
        brush();
        count++;
      }
    }
  };

  function pod(x, y) {
    p.push();
    p.translate(x, y);
    p.strokeWeight(5);

    p.fill('#3E3C3C');
    p.ellipse(70, 20, 60, 60);
    p.fill('#2C2A2A');
    p.ellipse(70, 20, 40, 40);

    p.fill('#3E3C3C');
    p.ellipse(-70, 20, 60, 60);
    p.fill('#2C2A2A');
    p.ellipse(-70, 20, 40, 40);

    p.fill('#3E3C3C');
    p.ellipse(0, 50, 160, 160);
    p.ellipse(0, 0, 140, 80);

    p.fill('#B3EADA');
    p.ellipse(0, 0, 120, 60);
    p.pop();
  }

  function brush() {
    const c = p.random(colors);
    const s = p.random(1, 10);
    const x = p.randomGaussian(p.mouseX, 10);
    const y = p.randomGaussian(p.mouseY, 10);

    p.noStroke();
    p.fill(c);
    p.ellipse(x, y, s, s);
  }
};

new p5(s);
`;