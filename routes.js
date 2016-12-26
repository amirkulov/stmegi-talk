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
        res.render('signup', {
            message: req.flash('signupMessage'),
            fields: req.flash('fieldsMessage')
        });
    });


    // process the signup form
    app.post('/signup', function(req, res) {

        // load up the user model
        var newUser = require('./models/user');

        // Сохраняем пользователя в БД
        var user = new newUser();

        var firstname = req.body.firstname;
        var lastname = req.body.lastname;
        var username = req.body.username;
        var email = req.body.email;
        var password = req.body.password;
            password = (password.length > 6) ? user.generateHash(password) : password;
        
        var arFields = {
            "firstname": firstname,
            "lastname": lastname,
            "username": username,
            "email": email
        };
        // set the user's local credentials
        user.local.firstname = firstname;
        user.local.lastname = lastname;
        user.local.username = username;
        user.local.email = email;

        user.local.password = password;
        
        user.save(function(err) {
            if(err)
            {
                req.flash('signupMessage', err.errors);
                req.flash('fieldsMessage', arFields);
                res.redirect('/signup');
            }
            else
            {
                req.logIn(user, function(err) {
                    if (err) { return next(err); }
                    return res.redirect('/');
                });
            }
        });

    });
    
    
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

    // =====================================
    // = FACEBOOK
    // =====================================

    app.get('/auth/facebook', 
        passport.authenticate('facebook', { 
            scope : 'email' 
        }));

    app.get('/auth/facebook/callback',
        passport.authenticate('facebook', {
            successRedirect : '/profile',
            failureRedirect : '/'
        }));
    
    // =====================================
    // = VK
    // =====================================

    app.get('/auth/vk', 
        passport.authenticate('vkontakte', {
            scope: ['email']
        }));

    app.get('/auth/vk/callback',
        passport.authenticate('vkontakte', {
            successRedirect : '/profile',
            failureRedirect : '/'
        }));

    // =====================================
    // = TWITTER
    // =====================================

    app.get('/auth/twitter', 
        passport.authenticate('twitter'));
    
    app.get('/auth/twitter/callback',
        passport.authenticate('twitter', {
            successRedirect : '/profile',
            failureRedirect : '/'
        }));    
    
    // =====================================
    // = GOOGLE PLUS
    // =====================================

    app.get('/auth/google', 
        passport.authenticate('google', { 
            scope : ['profile', 'email'] 
        }));

    app.get('/auth/google/callback',
        passport.authenticate('google', {
            successRedirect : '/profile',
            failureRedirect : '/'
        }));
    
    // =====================================
    // = ODNOKLASSNIKI
    // =====================================

    app.get('/auth/odnoklassniki', 
        passport.authenticate('odnoklassniki', {
            layout: 'm',
            scope: ['user_status', 'user_checkins']
        }));

    app.get('/auth/odnoklassniki/callback',
        passport.authenticate('odnoklassniki', {
            successRedirect : '/profile',
            failureRedirect : '/'
        }));
};

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
}