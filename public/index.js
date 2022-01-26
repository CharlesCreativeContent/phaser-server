var rainbow;
var i = 0;
var title;
class MainScene extends Phaser.Scene {
  constructor() {
    super({ key: "MainScene" });
  }

  create() {
    // scale the box
    const scaleBox = (scale) => {
      let box = document.getElementById("input-box");
      if (box) {
        box.style.transform = `scale(${scale})`;
        box.style.transformOrigin = "top left";
        box.style.top = `${
          this.game.canvas.offsetTop +
          this.scale.displaySize.height / 2 -
          (250 / 2) * scale
        }px`;
        box.style.left = `${
          this.game.canvas.offsetLeft +
          this.scale.displaySize.width / 2 -
          (300 / 2) * scale
        }px`;
      }
    };

    // initial scale
    let scale =
      this.game.scale.displaySize.width / this.game.scale.gameSize.width;
    scaleBox(scale);

    // on resize listener
    this.scale.on("resize", (gameSize, baseSize, displaySize, resolution) => {
      let scale = displaySize.width / gameSize.width;
      scaleBox(scale);
    });

    // stores all created phaser texts
    let createdTexts = {};

    // creates a new phaser text
    const createText = (name, i) => {
      let text =
        createdTexts[name] ||
        this.add.text(10, 100 + 20 * i, "").setColor("black");
      createdTexts[name] = text;
      return text;
    };

    // add clickMe test
    title = this.add
      .text(
        this.cameras.main.width / 2,
        this.cameras.main.height / 2,
        "CryptoMon",
        {
      font: "50px Roboto Condensed",
      fill: "#fff"
    });
    title.setStroke("#000000", 8);
    title.setShadow(2, 2, "#00ff00", 2, true, true).setDepth(3).setOrigin(0.5)
      .setInteractive()
      .on("pointerdown", () => {
        let element = document.getElementById("input-box");
        if (element && element.style.display === "none") {
          element.style.display = "block";
          let loginButton = document.querySelector('[class="login second"]');
          let signUpButton = document.querySelector('[class="signup second"]');
          loginButton.addEventListener("click", showLogin);
          signUpButton.addEventListener("click", showSignUp);
        }
      });
  }

  update(){


        var color = `hsl(${i},100%,50%)`;
    title.setShadow(2, 2, color, 2, true, true)
    i=i+2
        if (i === 360) {
          i = 0;
        }
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
  scene: [MainScene]
};

var game = new Phaser.Game(config);

function showLogin() {
  document.getElementById("login-form").style.display = "block";
  document.getElementById("second-window").style.display = "none";
}

function showSignUp() {
  document.getElementById("signup-form").style.display = "block";
  document.getElementById("second-window").style.display = "none";
}
