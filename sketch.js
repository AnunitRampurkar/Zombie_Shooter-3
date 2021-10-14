var bg,bgImg;
var player, shooterImg, shooter_shooting;
var zom, zomImg, zomGroup;
var bullet, bulletImg, bulletGroup, nBull = 50;
var score = 0;
var lives = 3;
var h1, h2, h3;
var l1, l2, l3;
var gameState = "play";
var resetImg;
var rs;
var aK;


function preload(){
  
  shooterImg = loadImage("assets/shooter_2.png");
  shooter_shooting = loadImage("assets/shooter_3.png");

  bgImg = loadImage("assets/bg.jpeg");

  zomImg = loadImage("assets/zombie.png");

  bulletImg = loadImage("assets/bullet1.png");

  explosion = loadSound("assets/explosion.mp3");
  win = loadSound("assets/win.mp3");
  lose = loadSound("assets/lose.mp3");

  h1 = loadImage("assets/heart_1.png");
  h2 = loadImage("assets/heart_2.png");
  h3 = loadImage("assets/heart_3.png");

  resetImg = loadImage("assets/reset.png");
}

function setup() {

  
  createCanvas(windowWidth,windowHeight);

  //adding the background image
  bg = createSprite(displayWidth/2-20,displayHeight/2-40,20,20);
  bg.addImage(bgImg);
  bg.scale = 1.1;

  aK = createSprite(windowWidth/2, windowHeight/2, 450, 200);
  aK.shapeColor = rgb(151, 247, 236);
  aK.visible = false;

//creating the player sprite
  player = createSprite(displayWidth-1500, displayHeight-300, 50, 50);
  player.addImage(shooterImg);
  player.scale = 0.3;
   //player.debug = true;
   player.setCollider("rectangle",0,0,300,7000);
   player.visible = false;

   zomGroup = new Group();

   bulletGroup = new Group();

   l1 = createSprite(windowWidth - 530, windowHeight - 800, 20, 20);
   l1.addImage("1 heart", h1);
   l1.scale = 0.3;
   l1.visible = false;

   l2 = createSprite(windowWidth - 500, windowHeight - 800, 20, 20);
   l2.addImage("2 heart", h2);
   l2.scale = 0.3;
   l2.visible = false;

   l3 = createSprite(windowWidth - 470, windowHeight - 800, 20, 20);
   l3.addImage("3 heart", h3);
   l3.scale = 0.3;
   l3.visible = false;

   rs = createSprite(windowWidth/2, windowHeight/2 + 150, 20, 20);
   rs.addImage("Image", resetImg);
   rs.scale = 0.15;
   rs.visible = false;


}

function draw() {
  background(0);

  if(gameState === "play") {

  player.visible = true;

  //moving the player up and down and making the game mobile compatible using touches
  if(keyDown("UP_ARROW")||touches.length>0){
    player.y = player.y-30;
  }
  if(keyDown("DOWN_ARROW")||touches.length>0){
    player.y = player.y+30;
  }


//release bullets and change the image of shooter to shooting position when space is pressed
if(keyWentDown("space")){
  bullet = createSprite(player.x + 50, player.y - 25, 20, 20);
  bullet.addImage("bullet", bulletImg);
  bullet.velocityX = 20;
  bullet.scale = 0.08;
  nBull -= 1;
  bulletGroup.add(bullet);
  explosion.play();

  player.addImage(shooter_shooting);
}

//player goes back to original standing image once we stop pressing the space bar
else if(keyWentUp("space")){
  player.addImage(shooterImg);
}

addZombies();

if(zomGroup.isTouching(bulletGroup)) {
  for(var i = 0; i<zomGroup.length; i++) {
    if(zomGroup[i].isTouching(bulletGroup)) {
      zomGroup[i].destroy();
      bulletGroup.destroyEach();
      score += 5;
      lose.play();
    }
  }
}

if(zomGroup.isTouching(player)) {
  for(var y = 0; y<zomGroup.length; y++) {
    if(zomGroup[y].isTouching(player)) {
      lives -= 1;
      zomGroup[y].destroy();
    }
  }
}

if(lives === 3) {
  l1.visible = false;
  l2.visible = false;
  l3.visible = true;
}

if(lives === 2) {
  l1.visible = false;
  l2.visible = true;
  l3.visible = false;
}

if(lives === 1) {
  l1.visible = true;
  l2.visible = false;
  l3.visible = false;
}

if(lives === 0) {
  l1.visible = false;
  l2.visible = false;
  l3.visible = false;

  gameState = "lost";
}


  if(score === 50) {
    gameState = "won";
  }
  }

  if(mousePressedOver(rs)) {
    reset();
  }

  drawSprites();

  if(gameState === "lost") {

    aK.visible = true;

    textSize(70);
    fill("red");
    strokeWeight(5);
    stroke("black");
    text("Game Over!!!", windowWidth/2 - 200, windowHeight/2);

    rs.visible = true;

    zomGroup.destroyEach();
    player.visible = false;
    bulletGroup.destroyEach();
  }

  if(gameState === "won") {

    aK.visible = true;

    rs.visible = true;

    textSize(70);
    fill("green");
    strokeWeight(5);
    stroke("black");
    text("You Win!!!", windowWidth/2 - 200, windowHeight/2);

    zomGroup.destroyEach();
    player.visible = false;
    bulletGroup.destroyEach();
  }

  if(nBull === 0) {
    gameState = "bullOver";
  }

  if(gameState === "bullOver") {

    aK.visible = true;

    rs.visible = true;

    textSize(70);
    fill(rgb(179, 74, 0));
    strokeWeight(5);
    stroke("black");
    text("Caught Up!!!", windowWidth/2 - 200, windowHeight/2);

    textSize(30);
    fill("yellow");
    strokeWeight(5);
    stroke("black");
    text("You have fired all the bullets.", windowWidth/2 - 190, windowHeight/2 + 50);

    bulletGroup.destroyEach();
    zomGroup.destroyEach();
    player.visible = false;
  }

  push();
  textSize(30);
  fill("red");
  strokeWeight(4);
  stroke("navy");
  text("No of bullets: " + nBull, windowWidth - 550, windowHeight - 900);
  pop();

  push();
  textSize(30);
  fill("turquoise");
  strokeWeight(4);
  stroke("black");
  text("Score: " + score, windowWidth - 550, windowHeight - 850);
  pop();

}

function addZombies() {
  if(frameCount%100 === 0) {
    zom = createSprite(windowWidth + 30, random(windowHeight - 200, windowHeight - 850), 20, 20);
    zom.addImage("zombie", zomImg);
    zom.scale = 0.2;
    zom.velocityX = -5;
    zom.lifetime = 500;

    zomGroup.add(zom);

    zom.setCollider("rectangle", 0, 0, 400, 1000);

    //zom.debug = true;
  }
}

function reset() {
  score = 0;
  gameState = "play";
  lives = 3;
  nBull = 50;
  rs.visible = false;
  aK.visible = false;
  player.visible = true;

  //player.visible = true;
}


