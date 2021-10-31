module.exports = function (app, passport, db, ObjectId) {


  // normal routes ===============================================================

  // show the home page (will also have our login links)
  app.get('/', function (req, res) {
    if(req.user){
      res.render('cashier.ejs')
    

    }else{
      res.render('login.ejs',{
        message:''
      })
    }
  });

  // PROFILE SECTION =========================
  app.get('/barista', isLoggedIn, function (req, res) {
    db.collection('orders').find().toArray((err, result) => {
        if (err) return 
        console.log(err);

        const awaiting = result.filter(order => order.completed === false); 
        const completed = result.filter(({ completed }) => completed);
        console.log("orders",awaiting, completed)

        res.render('barista.ejs', {
          user: req.user,
          awaiting,
          completed,
        });
      });
  });

  // LOGOUT ==============================
  app.get('/logout', function (req, res) {
    req.logout();
    res.redirect('/');
  });

  // message board routes ===============================================================

  app.post('/barista', (req, res) => {
    const {
      customer,
      beverages,
      totalCost,
    
    } = req.body;

    db.collection('orders').save( //******* */
      {
        barista:req.user.local.email,
        customer,
        beverages,
        totalCost,
        completed: false,
      },
      (err, result) => {
        if (err) return console.log(err);
        console.log('saved to database');
        res.render('cashier.ejs',{
          success:true
        });
      },
    );
  });

  app.put('/barista', (req, res) => {
    console.log("App.putBarista",req.body,req.body.id)
    db.collection('orders')
      .findOneAndUpdate(
        {_id:ObjectId(req.body.id)
        }, {
        $set: {
          
          completed: "true"
        }
      }, {
        sort: { _id: -1 },
        // upsert: true
      }, (err, result) => {
        if (err) return res.send(err)
        res.send(result)
      })
  })

  app.delete("/barista", (req, res) => {
    if(req.body.id === 'all'){
      db.collection("orders").deleteMany(
        { completed: "true" },
        (err, result) => {
          if (err) return res.send(500, err);
          res.send("Message deleted!");
        }
      )
    }
    else{
      db.collection("orders").findOneAndDelete(
        { _id: ObjectId(req.body.id) },
        (err, result) => {
          if (err) return res.send(500, err);
          res.send("Message deleted!");
        }
      );
    }
  });

  

  // =============================================================================
  // AUTHENTICATE (FIRST LOGIN) ==================================================
  // =============================================================================

  // locally --------------------------------
  // LOGIN ===============================
  // show the login form
  app.get('/login', function (req, res) {
    res.render('login.ejs', { message: req.flash('loginMessage') });
  });

  // process the login form
  app.post(
    '/login',
    passport.authenticate('local-login', {
      successRedirect: '/', // redirect to the secure profile section
      failureRedirect: '/login', // redirect back to the signup page if there is an error
      failureFlash: true, // allow flash order
    }),
  );

  // SIGNUP =================================
  // show the signup form
  app.get('/signup', function (req, res) {
    res.render('signup.ejs', { message: req.flash('signupMessage') });
  });

  // process the signup form
  app.post(
    '/signup',
    passport.authenticate('local-signup', {
      successRedirect: '/login', // redirect to the secure profile section
      failureRedirect: '/signup', // redirect back to the signup page if there is an error
      failureFlash: true, // allow flash order
    }),
  );

  // =============================================================================
  // UNLINK ACCOUNTS =============================================================
  // =============================================================================
  // used to unlink accounts. for social accounts, just remove the token
  // for local account, remove email and password
  // user account will stay active in case they want to reconnect in the future

  // local -----------------------------------
  app.get('/unlink/local', isLoggedIn, function (req, res) {
    var user = req.user;
    user.local.email = undefined;
    user.local.password = undefined;
    user.save(function (err) {
      res.redirect('/profile');
    });
  });
};

// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) return next();

  res.redirect('/');
}
