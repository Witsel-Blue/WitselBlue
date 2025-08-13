function setup() {
    createCanvas(windowWidth, windowHeight);
    // noCursor();
}

function draw() {
    face(width/2, height/2);
    // butterfly();
}

function butterfly() {
    strokeWeight(3);
    push();
    translate(mouseX, mouseY);
    fill("rgb(243,224,118)");
    ellipse(-12, 10, 20, 20);
    ellipse(-15, -10, 28, 28);
    ellipse(12, 10, 20, 20);
    ellipse(15, -10, 28, 28);
    strokeWeight(10);
    line(0, -15, 0, 15);
    strokeWeight(3);
    noFill();
    arc(0, -25, 15, 15, -45, 180);
    pop();
}

function face(x, y) {
    push();
  
    translate(x, y);
  
    let center = createVector(x, y);
    let mouse = createVector(mouseX, mouseY);
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
  
  
    strokeWeight(5);
    

  
    // ears
    push();
    translate(earMove.x, earMove.y);
    fill("rgb(53,64,94)");
    ellipse(-80, -90, 80, 140);
    ellipse(80, -90, 80, 140);
    fill("#442F68");
    ellipse(-80, -90, 50, 110);
    ellipse(80, -90, 50, 110);
    pop();
  
    // face
    fill("rgb(53,64,94)");
    ellipse(0, 20, 300, 240);
  
    // eyes
    push();
    translate(eyeMove.x, eyeMove.y);
  
    if(mouseIsPressed) {
        // closedEyes
        line(-30, 30, -75, 30);
        line(-30, 30, -70, 50);
        line(-30, 30, -70, 10);
        line(30, 30, 75, 30);
        line(30, 30, 70, 50);
        line(30, 30, 70, 10);
    } else {
        //eyes
        fill("white");
        ellipse(-60, 20, 100, 100);
        ellipse(60, 20, 100, 100);
        // pupil
        push();
        translate(pupilMove.x, pupilMove.y);
        fill("rgb(0,0,0)");
        ellipse(60, 20, 40, 60);
        ellipse(-60, 20, 40, 60);
        pop(); 
    }
  
    pop();
  
    // nose
    push();
    translate(noseMove.x, noseMove.y);
    line(-3, 70, 3, 70);
    line(0, 75, -5, 70);
    line(0, 75, 5, 70);
    line(0, 75, 0, 90);
    pop();
  
    // mouth
    push();
    translate(mouthMove.x, noseMove.y);
    fill("rgb(187,75,95)");
    ellipse(0, 100, 40, 30);
    pop();
  
    // whiskers
    push();
    translate(whiskersMove.x, whiskersMove.y);
    strokeWeight(2);
    line(-80, 80, -130, 65);
    line(-80, 92.5, -150, 92.5);
    line(-80, 105, -130, 115);
    line(80, 80, 130, 65);
    line(80, 92.5, 150, 92.5);
    line(80, 105, 130, 115);
    pop();
  
    pop();
  
}