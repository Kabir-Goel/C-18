var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;
var cloud, cloudImage
var score = 60
var obstacle, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6
var obstaclesGroup,cloudsGroup
var gameState = 0
var gameOver, gameOverImage
var restart, restartImage
var checkpointSound, dieSound, jumpSound

function preload() {
    trex_running = loadAnimation("trex1.png", "trex3.png", "trex4.png");
    trex_collided = loadImage("trex_collided.png");
    groundImage = loadImage("ground2.png");
    cloudImage = loadImage("cloud.png");
    obstacle1 = loadImage("obstacle1.png");
    obstacle2 = loadImage("obstacle2.png");
    obstacle3 = loadImage("obstacle3.png");
    obstacle4 = loadImage("obstacle4.png");
    obstacle5 = loadImage("obstacle5.png");
    obstacle6 = loadImage("obstacle6.png");
    gameOverImage = loadImage("gameOver.png");
    restartImage = loadImage("restart.png");
    checkpointSound = loadSound("checkpoint.mp3");
    dieSound = loadSound("die.mp3");
    jumpSound = loadSound("jump.mp3");
}

function setup() {
    createCanvas(windowWidth, windowHeight);

//create a trex sprite
    trex = createSprite(50, height - 50,20,50);
    trex.addAnimation("running", trex_running);
    trex.addAnimation("collided", trex_collided);
    trex.scale = 0.5;

//create a ground sprite
    ground = createSprite(200, height - 30,400,20);
    ground.addImage("ground",groundImage);
    ground.x = ground.width /2;

//create gameOver
    gameOver = createSprite(width/2, height/2);
    gameOver.addImage(gameOverImage);
    gameOver.scale = 0.7
    gameOver.visible = false;

//create restart
    restart = createSprite(gameOver.x, gameOver.y + 45);
    restart.addImage(restartImage);
    restart.scale = 0.45
    restart.visible = false;

//create invisibleGround
    invisibleGround = createSprite(200, height - 20, 400, 20);
    invisibleGround.visible = false;

//create groups
    obstaclesGroup = new Group()
    cloudsGroup = new Group()

    trex.setCollider("rectangle", 0, 0, 100, trex.height);
    //trex.debug = true
}

function draw() {
    background(222);
    fill("black");
    text("Score: "+score, 500, 20);

//gameState
    if(gameState == 0){
        score = score+Math.round(frameCount/100);
        if(score > 0 && score %100 == 0) {
            checkpointSound.play()
        }

        //jump when the space button is pressed
    if (touches.length > 0 || keyDown("space") && trex.y > height - 70) {
        trex.velocityY = -10;
        jumpSound.play()
        touches = []
    }

    trex.velocityY = trex.velocityY + 0.8
    ground.velocityX = -(4 + score/100)

    if (ground.x < 0) {
        ground.x = ground.width / 2;
    }
        spawnClouds();
        spawnObstacles();
        
        if(obstaclesGroup.isTouching(trex)){
            gameState = 1
            dieSound.play()

            //AI

            //trex.velocityY = -8.56
            //jumpSound.play()
        }
        
    }
    else if(gameState == 1){
        trex.changeAnimation("collided");
        cloudsGroup.setVelocityXEach(0);
        obstaclesGroup.setVelocityXEach(0);
        ground.velocityX = 0;
        trex.velocityY = 0;

        obstaclesGroup.setLifetimeEach(-1);
        cloudsGroup.setLifetimeEach(-1);

        gameOver.visible = true
        restart.visible = true

        //restart

        if(mousePressedOver(restart)) {
            reset()
        }
    }

    trex.collide(invisibleGround);

    drawSprites();
}
function spawnClouds() {
    if(frameCount %60 == 0){
        var r = Math.round(random(height/3, height*3/4));
        cloud = createSprite(600, r, 40, 10);
        cloud.scale = 0.25
        cloud.addImage(cloudImage);
        cloud.velocityX = -4;
        trex.depth = cloud.depth + 1 
        cloud.lifetime = width
        cloudsGroup.add(cloud);
    }
}

function spawnObstacles() {
    if(frameCount %60 == 0){
        var rand = Math.round(random(1,6));
        obstacle = createSprite(width, height - 40, 40, 10);
        obstacle.scale = 0.09
        obstacle.velocityX = -(6 + score/100)
        obstacle.lifetime = width
        obstaclesGroup.add(obstacle);
        
        switch(rand){
            case 1:obstacle.addImage(obstacle1);
                    break;
            case 2:obstacle.addImage(obstacle2);
                    break;
            case 3:obstacle.addImage(obstacle3);
                    break;
            case 4:obstacle.addImage(obstacle4);
                    obstacle.scale = 0.04;
                    break;
            case 5:obstacle.addImage(obstacle5);
                    obstacle.scale = 0.04;
                    break;
            case 6:obstacle.addImage(obstacle6);
                    default:break;
        }
    }
}

//reset function

function reset() {
    gameState = 0
    gameOver.visible = false
    restart.visible = false
    
    obstaclesGroup.destroyEach()
    cloudsGroup.destroyEach()
    score = 0

    trex.changeAnimation("running")

    frameCount = 0
}