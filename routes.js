module.exports = function (app, passport) {

    // =====================================
    // = ГЛАВНАЯ СТРАНИЦА / HOME PAGE
    // =====================================

    app.get('/', function (req, res) {
        res.render('index');
    });


    // =====================================
    // = ЛОГИН / LOGIN
    // =====================================

    app.get('/login', function (req, res) {
        res.render('login', {
            message: req.flash('loginMessage')
        });
    });

    app.post('/login', passport.authenticate('local-login', {
        successRedirect : '/profile',
        failureRedirect : '/login',
        failureFlash : true
    }));
    
    // =====================================
    // = РЕГИСТРАЦИЯ / SIGN UP
    // =====================================

    app.get('/signup', function(req, res) {  
        console.log(req.flash('signupMessage'));
        
        res.render('signup', {
          message: req.flash('signupMessage')
        });
    });
    
    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect : '/profile',
        failureRedirect : '/signup',
        failureFlash : true
    }));
    
    
    
    
    // =====================================
    // = ПРОФИЛЬ / PROFILE SECTION
    // =====================================

    app.get('/profile', isLoggedIn, function(req, res) {
        res.render('profile', {
            user : req.user
        });
        //console.log(req.user);
    });


    // =====================================
    // = ВЫХОД / LOGOUT
    // =====================================

    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });
};

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
}