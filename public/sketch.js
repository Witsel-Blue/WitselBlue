function setup() {
    createCanvas(400, 400);
  }
  
  function draw() {
    // background(220);
    background("aqua");
  
    //circle in the center with a width of 100
    circle(200, 200, 100);
  
    //when mouse button is pressed, circles turn black
    if (mouseIsPressed === true) {
      fill(0);
    } else {
      fill(255);
    }
  
    //white circles drawn at mouse position
    circle(mouseX, mouseY, 100);
  }