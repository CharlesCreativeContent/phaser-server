
let userData = {}

async function getUserData(stat){
  var response;
  if(stat){
    response = await fetch("/userData/"+stat);
userData[stat] = await response.json().stat;
} else {
  response = await fetch("/userData");
userData = await response.json();
}
}

getUserData().then(()=>{console.log(userData)})

class MainScene extends Phaser.Scene {
  constructor() {
    super({ key: "MainScene" });
  }

  create(){}
  update(){}
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
        gravity: { y: 200 },
        enableBody: true
      }
    },
  scene: [MainScene]
};

var game = new Phaser.Game(config);
