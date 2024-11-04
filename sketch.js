let slider, stars = [];
let i = 100;
let angle = 0.1;
let branchRandomness = [];
let seasonIndex = 0;
let seasonChangeInterval = 200; // Change season every 10 seconds (600 frames at 60 FPS)
let leafCount = 0;

// Seasons array will be defined in setup to use p5 color() function
let seasons;

function setup() {
  createCanvas(windowWidth, windowHeight);
  slider = createSlider(PI, TWO_PI, PI / 8, 0.5); // Set a more constrained slider range for angle
  slider.position(width / 2 - slider.width / 2, 20); // Centered at the top

  for (let s = 0; s < 200; s++) {
    stars.push({
      x: random(width),
      y: random(height / 2),
      size: random(1, 3),
      brightness: random(100, 255)
    });
  }

  generateBranchRandomness(10);

  // Define colors for each season using color() inside setup
  seasons = [
    { // Spring
      backgroundStart: color(135, 206, 235), // Light blue sky
      backgroundEnd: color(34, 139, 34), // Forest green
      leafColors: [color(60, 179, 113), color(34, 139, 34)], // Various greens
      leavesVisible: true
    },
    { // Summer
      backgroundStart: color(70, 130, 180), // Steel blue
      backgroundEnd: color(34, 139, 34), // Forest green
      leafColors: [color(60, 179, 113), color(34, 139, 34), color(46, 139, 87)], // Darker greens
      leavesVisible: true
    },
    { // Autumn
      backgroundStart: color(255, 228, 181), // Light orange
      backgroundEnd: color(255, 69, 0), // Orange red
      leafColors: [
        color(255, 69, 0), color(255, 140, 0), color(218, 165, 32), color(205, 92, 92) // Warm autumn colors
      ],
      leavesVisible: true
    },
    { // Winter
      backgroundStart: color(176, 224, 230), // Light sky blue
      backgroundEnd: color(0, 0, 139), // Dark blue
      leafColors: [], // No leaves in winter
      leavesVisible: false,
      quote: "Reflecting on life's cycles - 'The Tree of Life'"
    }
  ];
}

function draw() {
  // Update season every few seconds
  if (frameCount % seasonChangeInterval === 0) {
    seasonIndex = (seasonIndex + 1) % seasons.length;
    // Reset leaf count when season changes
    leafCount = 0;
  }
  
  let currentSeason = seasons[seasonIndex];

  drawBackgroundGradient(currentSeason);

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
  branch(i, 0, currentSeason); // Pass current season to branch function
  pop();

  drawTextOverlay(currentSeason);
}

function drawBackgroundGradient(season) {
  for (let y = 0; y < height; y++) {
    let inter = map(y, 0, height, 0, 1);
    let c = lerpColor(season.backgroundStart, season.backgroundEnd, inter);
    stroke(c);
    line(0, y, width, y);
  }
}

function branch(len, depth, season) {
  // Set stroke weight based on the length to make thicker trunk and thinner branches
  strokeWeight(map(len, 2, i, 3, 19)); // Trunk thickness is 10, thins down to 1
  stroke(0);
  
  // Draw the main line of the branch
  line(0, 0, 0, -len * 2);
  translate(0, -len * 2);

  // Check if we are at the "leaf" level and if leaves should be visible in this season
  if (len < 10 && season.leavesVisible) {
    if (seasonIndex === 2 && frameCount % 5 === 0) { // In autumn, reduce leaf count to simulate falling leaves
      if (leafCount < 200) leafCount++;
    }
    
    if (seasonIndex !== 2 || random(leafCount) > 10) { // Show fewer leaves in autumn
      // Choose a random color from the current season's leaf colors
      fill(random(season.leafColors));
      noStroke(1);
      ellipse(0, 0, random(10, 15), random(10, 15)); // Random leaf size for natural look
    }
  }

  // Recursively create branches
  if (len > 4 && depth < branchRandomness.length) {
    stroke(0);
    noFill();
    
    // Left branch with consistent random angle and length scaling
    push();
    let leftAngle = angle * branchRandomness[depth]; // Asymmetry with consistent randomness
    let leftScale = 0.66; // Fixed scale factor
    rotate(leftAngle);
    branch(len * leftScale, depth + 1, season); // Pass season to recursive call
    pop();

    // Right branch with different consistent random angle and length scaling
    push();
    let rightAngle = -angle * branchRandomness[depth]; // Asymmetry with consistent randomness
    let rightScale = 0.76; // Fixed scale factor
    rotate(rightAngle);
    branch(len * rightScale, depth + 1, season); // Pass season to recursive call
    pop();
  }
}

function generateBranchRandomness(depthLevels) {
  branchRandomness = [];
  for (let i = 0; i < depthLevels; i++) {
    branchRandomness.push(random(0.8, 1.2)); // Generate consistent randomness
  }
}

function drawTextOverlay(season) {
  textAlign(CENTER);
  fill(255);

  textFont('serif');

  textSize(48);
  text("THE TREE OF LIFE", width / 2, height * 0.2);

  textSize(16);
  text("NOTHING STANDS STILL", width / 2, height * 0.25);

  if (seasonIndex === 3 && season.quote) { // Display quote in winter
    textSize(12);
    fill(200);
    text(season.quote, width / 2, height * 0.35);
  }

  textSize(12);
  fill(200);
  text("Written and Directed by Terrence Malick", width / 2, height * 0.27);
}
