/////STATIC VARIBALES///////
const BLOCK_SIZE = 50; //px//
let WALK_SPEED = 5; //px//
let MONSTER_FEAR = 0.99; //Probability of seeing pokemon
save()


const gameState = {
  active: true
};
let currentDirection = null;
let userData = {};
let map = [];
let mapHeight = 0;
let mapWidth = 0;
let game;
let background;
let pointer;
let touchX;
let touchY;
//updating map info
function mobileDownButtons(button){
  let id = button.target.id.slice(-1)
  console.log(id)
  currentDirection = id
}
function mobileUpButtons(button){
console.log("up")
  currentDirection = null
}
document.querySelectorAll("button").forEach(el=>{
  el.addEventListener("touchstart",mobileDownButtons)
})
document.querySelectorAll("button").forEach(el=>{
  el.addEventListener("touchend",mobileUpButtons)
})

function mobileButtonsUp(){
  currentDirection = null;
}
function adjustMap(){
map = Routes[user.location];
mapHeight = BLOCK_SIZE * map.length;
mapWidth = BLOCK_SIZE * map[0].length;
}
adjustMap()
//given coordinates
//returns block element in map
//or 0 if nothing found
function getBlock(x, y) {
  if (x < 0 || y < 0 || x >= mapWidth || y >= mapHeight) return 0;

  let xBlock = Math.round(x / BLOCK_SIZE);
  let yBlock = Math.round(y / BLOCK_SIZE);
  return map[yBlock][xBlock];
}

let getX = () => gameState.player.x;
let getY = () => gameState.player.y;
let getPlayerLocation = () => [getX(), getY()];
let getCurrentBlock = () => getBlock(getX(), getY());

function verifyNextStep(direction) {
  if (direction === null) return 0;
  let [nextStepX, nextStepY] = getPlayerLocation();
  if (direction === 3) {
    nextStepY -= WALK_SPEED;
  } else if (direction === 2) {
    nextStepX += WALK_SPEED;
  } else if (direction === 1) {
    nextStepX -= WALK_SPEED;
  } else {
    nextStepY += WALK_SPEED;
  }
  return getBlock(nextStepX, nextStepY);
}

//function that triggers a monster attack
function checkForMonsters() {
  let dice = Math.random();
  if (dice > MONSTER_FEAR) {
    save()
    saveOpponent(Trainer.wild(Trainer.encounters[user.location]))
    window.location.href = "./wild.html"
  }
}

//Grabs User Data from server to play Game
async function getUserData(stat) {
  //fetch user data from server
  var response;
  if (stat) {
    response = await fetch("/userData/" + stat);
    userData[stat] = await response.json().stat;
  } else {
    response = await fetch("/userData");
    userData = await response.json();
  }
}

function teleport(x,y){
  gameState.player.x = x
  gameState.player.y = y
  user.teleport = {location: user.location, x, y}
  save()
}

//Grabs User Map from server to play Game
async function getMap() {
  //fetch map from server
  var response = await fetch("/userMap");
  map = await response.json();
}
let move = [
  function () {
    gameState.player.anims.play("runDown", true);
    gameState.player.y += WALK_SPEED;
    user.walkDown = WALK_SPEED
  },
  function () {
    gameState.player.anims.play("runLeft", true);
    gameState.player.x -= WALK_SPEED;
    user.walkLeft = WALK_SPEED
  },
  function () {
    gameState.player.anims.play("runRight", true);
    gameState.player.x += WALK_SPEED;
    user.walkRight = WALK_SPEED
  },
  function () {
    gameState.player.anims.play("runUp", true);
    gameState.player.y -= WALK_SPEED;
    user.walkUp = WALK_SPEED
  }
];

//handles mouse clicks
function mouseClicks() {}

//runs controls for user animation
function userAnimation() {
  if (gameState.player) {
    if (gameState.cursors.down.isDown) {
      currentDirection = 0;
    } else if (gameState.cursors.left.isDown) {
      currentDirection = 1;
    } else if (gameState.cursors.right.isDown) {
      currentDirection = 2;
    } else if (gameState.cursors.up.isDown) {
      currentDirection = 3;
    } else if (
      gameState.cursors.right.isUp ||
      gameState.cursors.left.isUp ||
      gameState.cursors.down.isUp ||
      gameState.cursors.up.isUp
    ) {
      gameState.player.setFrame(4 * currentDirection);
      currentDirection = null;
    }
  }
}

class MainScene extends Phaser.Scene {
  constructor() {
    super({ key: "MainScene" });
  }

  preload() {
    console.log(user.name)
    for(let img in Images){
      let imgInfo = Images[img]
      if(imgInfo.type==="image"){
      this.load.image(img, imgInfo.img);
      }else{
        this.load.spritesheet(img, imgInfo.img, {
          frameWidth: imgInfo.frameWidth,
          frameHeight: imgInfo.frameHeight
        });
      }
    }
  }

  create() {
    function standardBLOCK_SIZE(image,opacity=0.5) {
      image.setDisplaySize(BLOCK_SIZE, BLOCK_SIZE)
      image.setAlpha(opacity);
    }
    let addImageToMap = (x, y, imageName) =>
      this.add.image(x * BLOCK_SIZE, y * BLOCK_SIZE, imageName);
    function addStandardOpaqueImage(x, y, imageName){
      let currentImage = addImageToMap(x, y, imageName)
      standardBLOCK_SIZE(currentImage)
      return currentImage
    }
    //creates background for map


    function moveBackground(wholeGame){
      let scale = Scales[user.location]
      return wholeGame.add.image(0, 0, user.location).setOrigin(0).setScale(scale);
    }

    background = moveBackground(this)


    paintMap()

    //creates walking map for user
    function paintMap(){
    map.forEach((row, y) => {
      row.forEach((num, x) => {
        if (num === 1) addStandardOpaqueImage(x, y, "green");
        if (num == 2) addStandardOpaqueImage(x, y, "red");
        if (num == 3) addStandardOpaqueImage(x, y, "blue");
      });
    });
    }

    //Turns on key inputs
    gameState.cursors = this.input.keyboard.createCursorKeys();



    gameState.player = this.add.sprite(user.x, user.y, user.skin);
    gameState.player.setDepth(1)

    this.cameras.main.startFollow(gameState.player, true, 0.5, 0.5);


    function adjustCamera(camera){
    camera.main.setBounds(0, 0, mapWidth, mapHeight);
    }

    adjustCamera(this.cameras)

    this.anims.create({
      key: "runDown",
      frames: this.anims.generateFrameNumbers(user.skin, {
        start: 0,
        end: 3
      }),
      frameRate: 7,
      repeat: -1
    });

    this.anims.create({
      key: "runLeft",
      frames: this.anims.generateFrameNumbers(user.skin, {
        start: 4,
        end: 7
      }),
      frameRate: 7,
      repeat: -1
    });

    this.anims.create({
      key: "runRight",
      frames: this.anims.generateFrameNumbers(user.skin, {
        start: 8,
        end: 11
      }),
      frameRate: 7,
      repeat: -1
    });

    this.anims.create({
      key: "runUp",
      frames: this.anims.generateFrameNumbers(user.skin, {
        start: 12,
        end: 15
      }),
      frameRate: 7,
      repeat: -1
    });
  }
  update() {
    //Initializes movement for keyboard and mouse
    userAnimation();

    mouseClicks();

    if (move[currentDirection] && verifyNextStep(currentDirection)) {
      move[currentDirection]();
      lookAround(this.cameras,this);

      function lookAround(camera,state) {
        let curretBlock = getCurrentBlock();
        if (curretBlock === 2) checkForMonsters();
        if (typeof curretBlock === "object") openDoor(camera,state);
      }

      ///GAMESTATE FUNCTIONS

      function adjustCamera(camera){
      camera.main.setBounds(0, 0, mapWidth, mapHeight);
      }


      function changeMap(local,camera,state){
        let { location, x, y } = local
        background.destroy()
        background = moveBackground(state)
        teleport(x,y)
        adjustMap()
        adjustCamera(camera)
      }

      function openDoor(camera,state) {
      console.log("Door Open");
      let local = getBlock(getX(), getY())
      user.teleport = local
      changeMap(local,camera,state)
      }

      function moveBackground(wholeGame){
        let scale = Scales[user.location]
        return wholeGame.add.image(0, 0, user.location).setOrigin(0).setScale(scale);
      }

    }
  }
}

var config = {
  type: Phaser.AUTO,
  width: window.innerWidth,
  height: window.innerHeight,
  scale: {
    parent: "phaser-example",
    mode: Phaser.Scale.WIDTH_CONTROLS_HEIGHT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: window.innerWidth,
    height: window.innerHeight
  },
  transparent: true,
  roundPixels: false,
  audio: { noAudio: false },
  physics: {
    default: "arcade",
    arcade: {
      enableBody: true
    }
  },
  scene: [MainScene]
};

game = new Phaser.Game(config);
