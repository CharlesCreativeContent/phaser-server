const gameState = {
  active: true
};
let currentDirection = 0
let userData = {};
let map = [];
let game;

let getImage = (number)=>{
   return `https://img.pokemondb.net/sprites/black-white/anim/shiny/${ pokemon }.gif`
 }
let routes= {
  "Pallet Town": [
    [0,0,0,0,0],
    [0,0,0,0,0],
    [0,0,1,0,0],
    [0,0,0,0,0],
    [0,0,0,0,0]],
    "Route 1": [
      [0,0,1,0,0],
      [0,0,1,0,0],
      [0,0,1,0,0],
      [0,0,1,0,0],
      [0,0,1,0,0]]
}

//Grabs User Data from server to play Game
async function getUserData(stat){
  //fetch user data from server
  var response;
  if(stat){
    response = await fetch("/userData/"+stat);
userData[stat] = await response.json().stat;
} else {
  response = await fetch("/userData");
userData = await response.json();
}
}

//Grabs User Map from server to play Game
async function getMap(){
  //fetch map from server
  var response = await fetch("/userMap");
map = await response.json();
}

//runs controls for user animation
function userAnimation (){

  if(gameState.player){
    if (gameState.cursors.down.isDown ) {
      currentDirection = 0
      gameState.player.anims.play("runDown", true);
      gameState.player.y+=5
    } else if (gameState.cursors.left.isDown) {
        currentDirection = 1
        gameState.player.anims.play("runLeft", true);
        gameState.player.x-=5
      } else if (gameState.cursors.right.isDown ) {
        currentDirection = 2
        gameState.player.anims.play("runRight", true);
        gameState.player.x+=5
      }  else if (gameState.cursors.up.isDown ) {
        currentDirection = 3
        gameState.player.anims.play("runUp", true);
        gameState.player.y-=5
      }  else {
        gameState.player.setFrame(4 * currentDirection);
      }
    }

}



class MainScene extends Phaser.Scene {
  constructor() {
    super({ key: "MainScene" });
  }

    preload() {
      this.load.spritesheet(
        "hero", "/img/hero.jpeg",
        {
          frameWidth: 48,
          frameHeight: 72
        }
      );
    }

    create() {

      //Turns on key inputs
    gameState.cursors = this.input.keyboard.createCursorKeys();

    gameState.player = this.add.sprite(300, 300, "hero");

      this.anims.create({
          key: "runDown",
          frames: this.anims.generateFrameNumbers("hero", {
            start: 0,
            end: 3
          }),
          frameRate: 7,
          repeat: -1
        });

        this.anims.create({
            key: "runLeft",
            frames: this.anims.generateFrameNumbers("hero", {
              start: 4,
              end: 7
            }),
            frameRate: 7,
            repeat: -1
          });

          this.anims.create({
              key: "runRight",
              frames: this.anims.generateFrameNumbers("hero", {
                start: 8,
                end: 11
              }),
              frameRate: 7,
              repeat: -1
            });

            this.anims.create({
                key: "runUp",
                frames: this.anims.generateFrameNumbers("hero", {
                  start: 12,
                  end: 15
                }),
                frameRate: 7,
                repeat: -1
              });

    }
    update() {

      //Initializes movement for keyboard and mouse
      userAnimation()
    }
  }

  var config = {
    type: Phaser.AUTO,
    mode: Phaser.Scale.WIDTH_CONTROLS_HEIGHT,
    autoCenter: Phaser.Scale.CENTER_HORIZONTALLY,
    scale: {
      parent: "phaser-example",
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.AUTO,
      width: 1000,
      height: 500
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
