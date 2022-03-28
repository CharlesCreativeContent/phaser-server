let UI = {
  moves: document.querySelector("#moves"),
  move1: document.querySelector("#move1"),
  move2: document.querySelector("#move2"),
  move3: document.querySelector("#move3"),
  move4: document.querySelector("#move4"),
  menu: document.querySelector("#options"),
  playerImg: document.querySelector("#playerImg"),
  enemyImg: document.querySelector("#enemy"),
  modalTitle: document.querySelector(".modal-title"),
  modalBody: document.querySelector(".modal-body"),
  hp: document.querySelector("#HP"),
  opponentHP: document.querySelector("#opponentHP"),
};
let playerPokemon = user.mainPoke
let enemyPokemon = opponent.mainPoke
console.log("player: ", playerPokemon)
console.log("enemy: ",enemyPokemon)

//sets pokemon images
UI.playerImg.style.display = "block"
UI.enemyImg.style.display = "block"
UI.playerImg.src = playerPokemon.getBackImage()
UI.enemyImg.src = enemyPokemon.getFrontImage()
updateMoves(user)

function swithc(){}


function fight() {
  //* toggle *//
  toggleElementDisplay(UI.menu);
  console.log("fight");
  toggleElementDisplay(UI.moves);
}

function bag() {
  UI.modalTitle.innerHTML = "Items"
  UI.modalBody.innerHTML = ""
  console.log(user.bag);

  user.bag.forEach(item=>{
    UI.modalBody.innerHTML += `
    <h3>${item.name} <strong>x ${item.count}</strong></h3>
    <img src="https://placekitten.com/200/200"/>
    `
  })

  openMenu()
}
function run() {
  if(Poke.isCaught(enemyPokemon)){
  window.location.href = "./in.html"
  }
}

function monsters() {
  UI.modalTitle.innerHTML = "Team"
  UI.modalBody.innerHTML = ""
  console.log(user.team);

  if(user.team.length > 1){
  user.team.slice(1).forEach(pok=>{
    UI.modalBody.innerHTML += `
    <h3>${pok.name} - Lvl ${pok.lvl}</h3>
    <img src="${pok.getFrontImage()}"/>
    `
  })
}

  openMenu()
}
function setupAttackMoves() {
  UI.moves.addEventListener("click", (e) => {
    user.mainPoke.currentMove = e.target.innerHTML
    fight()
  });
}
setupAttackMoves();


function toggleElementDisplay(element) {
  element.classList.toggle("disappear");
}

function openMenu(){
  $("#popUp").modal("toggle");
}

function updateMoves(user){
  user.mainPoke.moves.forEach((move,index)=>{
    let id = `#move${index+1}`
    document.querySelector(id).innerHTML = move
  })
}
