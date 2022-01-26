module.exports = function(app, passport, db) {
let maps= {
  "Pallet Town": [
    [0,0,0,0,0],
    [0,0,0,0,0],
    [0,0,1,0,0],
    [0,0,0,0,0],
    [0,0,0,0,0]]
}
// normal routes ===============================================================

    // show the home page (will also have our login links)
    app.get('/', function(req, res) {
        res.render('index.ejs');
    });
    // DARATBASE USER VERIFICATION
    function checkForUserData(result, email){
      return result.filter(x=>x.name===email)[0]
    }


    app.get('/userMap', isLoggedIn, function(req, res) {
      db.collection('cryptoData').find({name: req.user.local.email}).toArray((err, result) => {
        if (err) return console.log(err)
        let town = result[0]["route"]
        let map = maps[town]
        res.status(200).send(map)
      })
    })


    app.get('/userData', isLoggedIn, function(req, res) {
      db.collection('cryptoData').find({name: req.user.local.email}).toArray((err, result) => {
        if (err) return console.log(err)
        res.status(200).send(result[0])
      })
    })


    app.get('/userData/:stat', isLoggedIn, function(req, res) {
      db.collection('cryptoData').find({name: req.user.local.email}).toArray((err, result) => {
        if (err) return console.log(err)
        let stat = result[0][req.params.stat]
        res.status(200).send({stat})
      })
    })
    // PROFILE SECTION =========================
    app.get('/profile', isLoggedIn, function(req, res) {

db.collection('cryptoData').find({name: req.user.local.email}).toArray((err, result) => {
  if (err) return console.log(err)

//if no data found, make new data
  if(! checkForUserData(result, req.user.local.email)){
    db.collection('cryptoData').insert({
      email: req.user.local.email,
      name: req.user.local.email,
      team: [],
      monsters:[],
      items: [],
      exp: 0,
      money: 500,
      route: "Pallet Town",
      position: [20,20],
    })
    setTimeout(()=>{},1500)
  }

  res.render('profile.ejs', {
    user : req.user.local.email,
  })


})
});

    // LOGOUT ==============================
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });


// =============================================================================
// AUTHENTICATE (FIRST LOGIN) ==================================================
// =============================================================================

    // locally --------------------------------
        // LOGIN ===============================

        // process the login form
        app.post('/login', passport.authenticate('local-login', {
            successRedirect : '/profile', // redirect to the secure profile section
            failureRedirect : '/', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }));

        // process the signup form
        app.post('/signup', passport.authenticate('local-signup', {
            successRedirect : '/profile', // redirect to the secure profile section
            failureRedirect : '/', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }));

// =============================================================================
// UNLINK ACCOUNTS =============================================================
// =============================================================================
// used to unlink accounts. for social accounts, just remove the token
// for local account, remove email and password
// user account will stay active in case they want to reconnect in the future

    // local -----------------------------------
    app.get('/unlink/local', isLoggedIn, function(req, res) {
        var user            = req.user;
        user.local.email    = undefined;
        user.local.password = undefined;
        user.save(function(err) {
            res.redirect('/profile');
        });
    });

};

// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();

    res.redirect('/');
}
