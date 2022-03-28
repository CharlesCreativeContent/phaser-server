let user = localStorage.getItem("user") ? loadUser() : new User(getPlayerName(),[], {
  team:[new Poke(99,99)],
  skills: [],
  skin: "hero",
  money: 1000,
  bag: [{name: "pokeball",count:5}],
  badges: [],
  picture: "https://placekitten.com/200/200",
  computer: [],
  location: "Pallet Town",
  x: 1050,
  y: 200,
})
//sets the skin of the player
if(Skins.hasOwnProperty(user.name.toLowerCase())){
  user.skin = Skins[user.name.toLowerCase()]
}

let opponent = localStorage.getItem("opponent") ? loadOpponent() : Trainer.wild(Trainer.encounters[user.location])
// localStorage.clear()
