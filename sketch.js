var bg, bgImg ;
var balloonAnimation, balloonImg02, balloon ;
var edges ;
var coin, coinImg ;
var diamond, diamondImg ;
var score = 0, coinsCollected = 0, diamondsCollected = 0
var coin_eg, diamond_eg;
var database
var position
var bird,birdimage
var gameState = "play"
var wall1,wall2

function preload(){
  bgImg = loadImage("bgImg.jpg")
  balloonAnimation = loadAnimation("Balloon01.png", "Balloon02.png", "Balloon03.png")
  coinImg = loadImage("coin.png")
  diamondImg = loadImage("diamond.png")
  birdimage = loadAnimation("bird/bird (1).png","bird/bird (2).png","bird/bird (3).png","bird/bird (4).png","bird/bird (5).png","bird/bird (6).png","bird/bird (7).png","bird/bird (8).png","bird/bird (9).png","bird/bird (10).png","bird/bird (11).png","bird/bird (12).png","bird/bird (13).png","bird/bird (14).png","bird/bird (15).png","bird/bird (16).png","bird/bird (17).png","bird/bird (18).png","bird/bird (19).png","bird/bird (20).png","bird/bird (21).png","bird/bird (22).png","bird/bird (23).png","bird/bird (24).png","bird/bird (25).png","bird/bird (26).png","bird/bird (27).png","bird/bird (28).png","bird/bird (29).png","bird/bird (30).png","bird/bird (31).png","bird/bird (32).png","bird/bird (33).png","bird/bird (34).png","bird/bird (35).png","bird/bird (36).png","bird/bird (37).png","bird/bird (38).png","bird/bird (39).png","bird/bird (40).png","bird/bird (41).png","bird/bird (42).png","bird/bird (43).png","bird/bird (44).png","bird/bird (45).png","bird/bird (46).png","bird/bird (47).png","bird/bird (48).png","bird/bird (49).png")
}


function setup() {
  createCanvas(1200,600)

  database = firebase.database()
  
  bg = createSprite(0,0,1200,600)
  bg.addImage(bgImg)
  bg.scale = 3;


  balloon = createSprite()
  balloon.addAnimation("balloon",balloonAnimation )
  balloon.scale = 0.35 ;
  var balloonposition = database.ref("balloon").on("value",readposition);

  coin_eg = createSprite(185,20,0,0)
  coin_eg.addImage(coinImg)
  coin_eg.scale = 0.09;

  diamond_eg = createSprite(620,23,0,0)
  diamond_eg.addImage(diamondImg)
  diamond_eg.scale = 0.11;

  coinGroup = createGroup();
  diamondGroup = createGroup();
  birdGroup = createGroup();
  wallgroup = createGroup();
  
  coin = createSprite(1700,Math.round(random(30,520)))
  coin.addImage(coinImg)
  coin.scale = 0.15;
  coin.velocityX = -(7 + score/100);
  coinGroup.add(coin)

  diamond = createSprite(1500,Math.round(random(30,520)))
  diamond.addImage(diamondImg)
  diamond.scale = 0.1;
  diamond.velocityX = -(7 + score/100);
  diamond.setCollider("rectangle",0,0,400,400)
  diamondGroup.add(diamond)

  bird = createSprite(random(1300,1400),Math.round(random(30,520)))
  bird.addAnimation("bird",birdimage)
  bird.scale = 0.3
  bird.velocityX = -(8 + score/100);
  bird.frameDelay = 1
  birdGroup.add(bird)
  bird.setCollider("circle",-60,+20,20)

  wall1 = createSprite(600,620,1200,10)
  wall2 = createSprite(1190,400,10,400)
  wall3 = createSprite(300,600,20,20)
  wall4 = createSprite(600,600,20,20)
  wall5 = createSprite(900,600,20,20)
  wallgroup.add(wall1)
  wallgroup.add(wall2)
  wallgroup.add(wall3)
  wallgroup.add(wall4)
  wallgroup.add(wall5)
  wall1.visible = false
  wall2.visible = false
  wall3.visible = false
  wall4.visible = false
  wall5.visible = false




}

function draw() {
  background("black"); 
  edges = createEdgeSprites();



  bg.velocityX = -(5 + score/100) ;

  if (bg.x < 300){
    bg.x = bg.width/1.2;

}
if(gameState === "play"){
 if(position !== undefined){
   if(keyDown(UP_ARROW)){
      changeposition(0,-8);
      if(balloon.scale <0.45){
        balloon.scale = balloon.scale + 0.01
  }}else if(keyDown(DOWN_ARROW)){
    changeposition(0,+8);
    if(balloon.scale> 0.35){
      balloon.scale = balloon.scale - 0.01
  }}else if(keyDown(RIGHT_ARROW)){
  changeposition(8,0);
  }else if(keyDown(LEFT_ARROW)){
  changeposition(-8,0);
    }
  }


  if (balloon.isTouching(coinGroup) || coin.x < 0){
    coinsCollected = coinsCollected + 1;
    coin.x = 1300
    coin.y = Math.round(random(30,520))
  }

  if (balloon.isTouching(diamondGroup)||diamond.x < 0){
    diamondsCollected = diamondsCollected + 1;
    diamond.x = 1500
    diamond.y = Math.round(random(30,550))
  }
}


  if (bird.x < 0){
    bird.x = random(1300,1500)
    bird.y = Math.round(random(30,520))
  }

  if(bird.isTouching(balloon)){
    gameState = "end"
  }

  if(gameState === "end"){
   
    bird.velocityX = 0
    birdGroup.destroyEach()
    coinGroup.destroyEach()
    diamondGroup.destroyEach()
    bg.velocityX = 0 
    balloon.collide(wallgroup)
    balloon.velocityX = 3
    balloon.velocityY = 3
  }

  balloon.collide(edges[3])
  balloon.collide(edges[2])
  balloon.collide(edges[1])
  balloon.collide(edges[0])

  drawSprites();

  stroke ("black")
  strokeWeight(2);
  fill("black")
  textFont("ink free")
  textSize(25);
  text("Coins collected      : " + coinsCollected,10,30)

  stroke ("black")
  strokeWeight(2);
  fill("black")
  textFont("ink free")
  textSize(25);
  text("Diamonds collected       : " + diamondsCollected,400,30)

  stroke ("black")
  strokeWeight(2);
  fill("black")
  textFont("ink free")
  textSize(25);
  text("Score : " + score ,1000,30)
  if(gameState === "play"){
  score = score + Math.round(getFrameRate()/60);
}

if(gameState === "end"){
  text("Oh no! You have been hit by a bird 🐦",370,250)

if(coinsCollected === 1 && diamondsCollected > 1){
  text("Explorer you have collected " + coinsCollected+" coin and  "+diamondsCollected +" diamonds",320,280)
}
if(coinsCollected > 1 && diamondsCollected === 1){
  text("Explorer you have collected " + coinsCollected+" coins and  "+diamondsCollected +" diamond",320,280)
}
if(coinsCollected === 1 && diamondsCollected === 1){
  text("Explorer you have collected " + coinsCollected+" coin and  "+diamondsCollected +" diamond",320,280)
}
if(coinsCollected > 1 && diamondsCollected > 1){
  text("Explorer you have collected " + coinsCollected+" coins and  "+diamondsCollected +" diamonds",320,280)
}
if(coinsCollected === 0 && diamondsCollected ===  0){
  text("Explorer you have collected " + coinsCollected+" coins and  "+diamondsCollected +" diamonds",320,280)
}
if(coinsCollected === 0 && diamondsCollected ===  1){
  text("Explorer you have collected " + coinsCollected+" coins and  "+diamondsCollected +" diamond",320,280)
}
if(coinsCollected === 1 && diamondsCollected ===  0){
  text("Explorer you have collected " + coinsCollected+" coin and  "+diamondsCollected +" diamonds",320,280)
}
}

}

function changeposition(x,y){
  database.ref("balloon").set({
      x:position.x + x,
      y:position.y + y
   })
}

function readposition(data){
  position = data.val()
  balloon.x = position.x
  balloon.y = position.y
}
