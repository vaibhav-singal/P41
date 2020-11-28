var dog, happyDog, database, foodS, foodStock, dogImage;
var feedPet, addFood, feedTime, lastFed;
var foodObj;
var readGameState, changGameState;
var bedroom, washroom, garden, deadDog;
var currentTime;

function preload()
{
  dogImage = loadImage("dogImg.png");
  happyDog = loadImage("happy dog.png");
  washroom = loadImage("Wash Room.png");
  bedroom = loadImage("Bed Room.png");
  garden = loadImage("Garden.png");
  deadDog = loadImage("deadDog.png");

}

function setup() {
  database = firebase.database();
  createCanvas(1000, 500);

  fedTime = database.ref('FeedTime');
  fedTime.on("value", function(data){
    lastFed = data.val();

    readState = database.ref('gameState');
    readState.on("value",function(data){
      gameState = data.val();
    })
    
})

  foodObj = new Food();

  feedPet = createButton("Feed the dog");
  feedPet.position(700,95);
  feedPet.mousePressed(feedDog);

  addFood = createButton("Add food");
  addFood.position(800,95);
  addFood.mousePressed(addFoodS);
  
  
  dog = createSprite(250,200);
  dog.addImage(dogImage);
  dog.scale = 0.2;

  foodStock = database.ref('Food');
  foodStock.on("value",readStock);
  
}


function draw() { 
  
  background(46, 139, 87);
  foodObj.display();

  fill(255,255,254);
  textSize(15);
  if(lastFed>=12){
    text("Last Fed : "+ lastFed%12 + "PM",350,30);
  }else if(lastFed==0){
    text("Last Feed: 12 AM",350,30);
  }else{
    text("Last Feed : "+ lastFed + "AM", 350,30);
  }

  if(gameState!= "Hungry"){
    feedPet.hide();
    addFood.hide();
    dog.remove();
  }else{
    feedPet.show();
    addFood.show();
    dog.addImage(deadDog);
  }

  currentTime.hour();
  if(currentTime==(lastFed+1)){
    update("Playing");
    foodObj.garden();
  } else if(currentTime==(lastFed+2)){
    update("Sleeping");
    foodObj.bedroom();
  }else if(currentTime>(lastFed+2)&&currentTime<=(lastFed+4)){
    update("Bathing");
    foodObj.washroom();
  }else{
    update("Hungry");
    foodObj.display();
  }


  

  drawSprites();

  fill("red");
  textSize(20);
  text("Food Remaining: "+foodS,100,100);
}

function readStock(data){
  foodS = data.val();
}

function writeStock(x){

  if(x<=0) {
    x=0;
  } else{
    x=x-1;
  }



  database.ref('/').update({
    Food:x
  })
}

function feedDog(){
  dog.addImage(happyDog);

  foodObj.updateFoodStock(foodObj.getFoodStock()-1);
  database.ref('/').update({
    Food:foodObj.getFoodStock(),
    feedTime:hour()
  })
}

function addFoodS(){
  foodS++;
  database.ref('/').update({
    Food:foodS
  })
}

function update(state){
  database.ref('/').update({
    gameState:state
  })
}