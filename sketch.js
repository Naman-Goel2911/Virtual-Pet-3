//created till instruction 7

var database;
var dog, happyDog, dogImg;
var foodS = -1, foodStock;
var fedTime, lastFed, fedTimeRef; 
var foodObj;
var feed, addFood;
var foodStockRef;
var gameState, gameStateRef;
var h;
var bedroomImg, gardenImg, washroomImg;
var currentTime;


function preload()
{
   dogImg = loadImage("images/Dog.png");
   happyDog = loadImage("images/happydog.png");

   bedroomImg = loadImage("images/VirtualPetImages/BedRoom.png");
   gardenImg = loadImage("images/VirtualPetImages/Garden.png");
   washroomImg = loadImage("images/VirtualPetImages/WashRoom.png");
}

function setup()
{
  createCanvas(1100, 500);
  
  database = firebase.database();

  dog = createSprite(850, 250, 50, 100);
  dog.addImage(dogImg);
  dog.scale = 0.3;

  foodObj = new Food();

  foodObj.getFoodStock();

  feed = createButton("Feed the Dog");
  feed.position(700, 95);
  feed.mousePressed(feedDog);

  addFood = createButton("Add Food");
  addFood.position(800, 95);
  addFood.mousePressed(addfood);

  gameStateRef = database.ref('gameState');
  gameStateRef.on("value", (data)=>{
    gameState = data.val();
  })
}


function draw()
{  
  background(100, 255, 100);

  //foodObj.display();

  fedTimeRef = database.ref('FeedTime');
  fedTimeRef.on("value", (data)=>{
    lastFed = data.val();
  })

  textSize(20);
  fill(0);
  //text("Press Up Arrow to feed the Dog", 710, 50);
  text("Milk Left : " + foodS + " Bottles", 770, 100);

  if(foodS<=0)
  {
     foodS = 0;
     dog.addImage(dogImg);
  }
  else
  {
    foodS = foodS;
  }


  if(lastFed>=12)
  {
    text("Last Feed: " + lastFed%12 + "PM", 350, 30);
  }else if(lastFed=== 0)
  {
    text("Last Feed: 12 AM", 350, 30);
  }else
  {
    text("Last Feed: " + lastFed + "AM", 350, 30);
  }

  currentTime = minute();

  if(currentTime===(lastFed+1))
  {
    update("Playing");
    //foodObj.garden();
    image(gardenImg, 0, 0, 1100, 500)
  }else if(currentTime===(lastFed+2))
  {
    update("Sleeping");
    //foodObj.bedroom();
    image(bedroomImg, 0, 0, 1100, 500)
  }else if(currentTime>(lastFed+2) && currentTime<=(lastFed+4))
  {
    update("Bathing");
    //foodObj.washroom();
    image(washroomImg, 0, 0, 1100, 500)
  }else{
    update("Hungry"); 
    foodObj.display();
  }

  if(gameState !== "Hungry")
  {
    feed.hide();
    addFood.hide();
    dog.remove();
  }else{
    feed.show();
    addFood.show();
    dog.addImage(dogImg);
  }

  drawSprites();
}

function writeStocks()
{
  if(foodS<=0)
  {
     foodS = 0;
  }
  else
  {
    foodS = foodS - 1;
  }

  database.ref('/').update({
    food: foodS,
    FeedTime: hour()
  })
}

function feedDog()
{
  h = hour();
  writeStocks();
  dog.addImage(happyDog);

  foodObj.updateFoodStock((foodObj.getFoodStock() - 1));
  database.ref('/').update({
    food: foodObj.getFoodStock(),
    FeedTime: foodObj.getFedTime(h)

  })
   
  // console.log(hour())
}

function addfood()
{
  foodS = foodObj.foodStock++;

  database.ref('/').update({
    food: foodS
  })
}

function update(state)
{
  database.ref('/').update({
    gameState: state
  })
}
