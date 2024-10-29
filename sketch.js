let slider, stars = [];
let i = 100;
let angle = 0.1;
let ran = 0.05;
let branchRandomness = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  slider = createSlider(PI, TWO_PI, PI/2, 0.1);

  for (let s = 0; s < 200; s++) {
    stars.push({
      x: random(width),
      y: random(height / 2),
      size: random(1, 3),
      brightness: random(100, 255)
    });
  }

  generateBranchRandomness(10);
}

function draw() {
  drawBackgroundGradient();

  noStroke();
  for (let star of stars) {
    star.brightness = random(150, 255);
    fill(star.brightness);
    ellipse(star.x, star.y, star.size);
  }

  angle = slider.value();

  stroke(0);
  fill(0);
  push();
  translate(width / 2, height);
  branch(i, 0);
  pop();

  drawTextOverlay();
}

function drawBackgroundGradient() {
  for (let y = 0; y < height; y++) {
    let inter = map(y, 0, height, 0, 1);
    let c = lerpColor(color(0, 0, 139), color(70, 130, 180), inter);
    stroke(c);
    line(0, y, width, y);
  }
}

function branch(len, depth) {
  line(0, 0, 0, -len * 1.7);
  translate(0, -len * 1.7);

  if (len > 4 && depth < branchRandomness.length) {
    push();
    rotate(angle * branchRandomness[depth]);
    branch(len * 0.67, depth + 1);
    pop();

    push();
    rotate(-angle * branchRandomness[depth]);
    branch(len * 0.67, depth + 1);
    pop();
  }
}

function generateBranchRandomness(depthLevels) {
  branchRandomness = [];
  for (let i = 0; i < depthLevels; i++) {
    branchRandomness.push(random(1 - ran, 1 + ran));
  }
}

function drawTextOverlay() {
  textAlign(CENTER);
  fill(255);
  
  textFont('serif');
  
  textSize(48);
  text("THE TREE OF LIFE", width / 2, height * 0.2);

  textSize(16);
  text("NOTHING STANDS STILL", width / 2, height * 0.25);

  textSize(12);
  fill(200);
  text("Written and Directed by Terrence Malick", width / 2, height * 0.27);
}
