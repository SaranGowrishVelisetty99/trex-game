var trex,Trex_running,ground,
    groundimage,invisibleground,
    cloudimage,obs1,obs2,obs3,obs4,obs5,
    obs6,score,highscore;
var obstaclesGroup;
var cloudsGroup;
var Play = 1;
var End = 0;
var gamestate = Play;
var gameOver;
var gameOverimg;
var restart,restartimg;
var trexcollideimg;
var jump,die,checkpoint;

function preload ()
{
  Trex_running =        loadAnimation("trex1.png","trex2.png","trex3.png");
  trexcollideimg = loadAnimation("trex_collided.png");
  groundimage = loadImage("ground2.png");
  cloudimage = loadImage("cloud.png");
  obs1 = loadImage("obstacle1.png");
  obs2 = loadImage("obstacle2.png");
  obs3 = loadImage("obstacle3.png");
  obs4 = loadImage("obstacle4.png");
  obs5 = loadImage("obstacle5.png");
  obs6 = loadImage("obstacle6.png");
  gameOverimg = loadImage("gameOver.png");
  restartimg = loadImage("restart.png");
  jump = loadSound("jump.mp3");
  die = loadSound("die.mp3");
  checkpoint = loadSound("checkPoint.mp3");
}

 function setup ()
{
  createCanvas(600,200);
  
  trex = createSprite(50,150,10,10);
  trex.addAnimation("running",Trex_running);
  trex.addAnimation("collide",trexcollideimg);
  trex.scale = 0.5;
  trex.setCollider("circle",0,0,40);
  
  
  ground = createSprite(300,170,600,20);
  ground.addImage("Ground",groundimage);
  ground.x = ground.width/2;
  
  invisibleground = createSprite(300,175,600,5);
  invisibleground.visible = false;
  
  obstaclesGroup = new Group ();
  cloudsGroup = new Group ();
  
  gameOver = createSprite(300,80);
  gameOver.addImage("gameover",gameOverimg);
  gameOver.scale = 0.8;
  gameOver.visible = false;
  
  restart = createSprite(300,120);
  restart.addImage("reStart",restartimg);
  restart.scale =  0.4;
  restart.visible = false;
  
  score = 0;
  highscore = 0;
}

 function draw ()
{
  background(180);
  
  textSize(18);
  text("SCORE:"+ score,440,20);
  text("HighScore"+highscore,300,20)
  
  if(gamestate == Play){
    ground.velocityX = -(6+3*score/100);
    if(keyDown("space") && trex.y >= 149)
    {
      trex.velocityY = -10;
      jump.play();
    }
    
    score= score+Math.round(getFrameRate()/60);
    
    if(ground.x<0)
    {
      ground.x = ground.width/2;
    }
    
    trex.velocityY = trex.velocityY+0.5;
    
    spawnClouds();
    spawnObstacles();
    
    if(obstaclesGroup.isTouching(trex))
    {
      gamestate = End;
      die.play();
      
    }
    
    if(score>0 && score%100 == 0)
    {
      checkpoint.play(); 
    }
    
  }
  
  else if(gamestate == End){
    ground.velocityX = 0;
    gameOver.visible = true;
    restart.visible = true;
    obstaclesGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);
    trex.changeAnimation("collide",trexcollideimg);
    obstaclesGroup.setLifetimeEach(-1);
    trex.velocityY = 0;
  }
  
  if(mousePressedOver(restart)){
    reset();
  }
  
  trex.collide(invisibleground);
  drawSprites();
  
}


function spawnClouds (){
   if(World.frameCount % 60 == 0)
   {
      var cloud = createSprite(600,120,40,10);
      cloud.velocityX = -6;
      cloud.scale = 0.6;
      cloud.addImage("clouds",cloudimage);
      cloud.y = random(70,120);
      cloud.depth = trex.depth;
      trex.depth = trex.depth+1;
      cloudsGroup.add(cloud);
   }
   
}

function spawnObstacles () {
  
  if(World.frameCount % 60 == 0){
    
    var obstacle = createSprite(600,155,10,10);
    obstacle.velocityX  = -(6+3*score/100);
    var rand = Math.round(random(1,6));
    obstacle.lifetime = 100; 
      
    switch(rand){
      case 1:
        obstacle.addImage(obs1);
        break;
        
      case 2:
        obstacle.addImage(obs2);
        break;
        
      case 3:
        obstacle.addImage(obs3);
        break;
        
      case 4:
        obstacle.addImage(obs4);
        break;
        
      case 5:
        obstacle.addImage(obs5);
        break;
        
      case 6:
        obstacle.addImage(obs6);
        break;
        
      default:
        break;
      
    }
    obstacle.scale = 0.5;
    obstaclesGroup.add(obstacle);
  }
}

function reset (){
  gamestate = Play;
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  gameOver.visible = false;
  restart.visible = false;
  trex.changeAnimation("running",Trex_running);
  if(highscore<score){
    highscore = score;
  }
  score = 0;
}