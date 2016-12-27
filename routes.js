module.exports = function (app, passport) {

    // =====================================
    // = ГЛАВНАЯ СТРАНИЦА / HOME PAGE
    // =====================================

    app.get('/', function (req, res) {
        res.render('index');
    });


    // =====================================
    // = ПРОФИЛЬ / PROFILE SECTION
    // =====================================

    app.get('/profile', isLoggedIn, function(req, res) {
        res.render('profile', {
            user : req.user
        });
    });

    // =====================================
    // = ВЫХОД / LOGOUT
    // =====================================

    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });
    

    // =====================================
    // = AUTHENTICATE
    // =====================================
    
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
        app.post('/signup', passport.authenticate('local-signup', {
            successRedirect : '/profile', // redirect to the secure profile section
            failureRedirect : '/signup', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }));
    

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
                scope: ['emails']
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

    // =====================================================================
    // = AUTHORIZE (ALREADY LOGGED IN / CONNECTING OTHER SOCIAL ACCOUNT)
    // = АВТОРИЗАЦИЯ (УЖЕ АВТОРИЗОВАННЫХ / СВЯЗАННЫХ С ДРУГИМИ СОЦ. СЕТЯМИ) 
    // =====================================================================

        // =====================================
        // = LOCALLY
        // =====================================
        app.get('/connect/local', function(req, res) {
            res.render('connect-local.ejs', { message: req.flash('loginMessage') });
        });
        app.post('/connect/local', passport.authenticate('local-signup', {
            successRedirect : '/profile', // redirect to the secure profile section
            failureRedirect : '/connect/local', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }));

        // =====================================
        // = FACEBOOK
        // =====================================

        app.get('/connect/facebook',
           passport.authorize('facebook', {
               scope : 'email'
           }));

        app.get('/connect/facebook/callback',
           passport.authorize('facebook', {
               successRedirect : '/profile',
               failureRedirect : '/'
           }));

        // =====================================
        // = VK
        // =====================================

        app.get('/connect/vk',
           passport.authorize('vkontakte', {
               scope: ['email']
           }));

        app.get('/connect/vk/callback',
           passport.authorize('vkontakte', {
               successRedirect : '/profile',
               failureRedirect : '/'
           }));

        // =====================================
        // = TWITTER
        // =====================================

        app.get('/connect/twitter',
           passport.authorize('twitter'));

        app.get('/connect/twitter/callback',
           passport.authorize('twitter', {
               successRedirect : '/profile',
               failureRedirect : '/'
           }));

        // =====================================
        // = GOOGLE PLUS
        // =====================================

        app.get('/connect/google',
           passport.authorize('google', {
               scope : ['profile', 'email']
           }));

        app.get('/connect/google/callback',
           passport.authorize('google', {
               successRedirect : '/profile',
               failureRedirect : '/'
           }));

        // =====================================
        // = ODNOKLASSNIKI
        // =====================================

        app.get('/connect/odnoklassniki',
           passport.authorize('odnoklassniki', {
               layout: 'm',
               scope: ['user_status', 'user_checkins']
           }));

        app.get('/connect/odnoklassniki/callback',
           passport.authorize('odnoklassniki', {
               successRedirect : '/profile',
               failureRedirect : '/'
           }));


    // =====================================================================
    // = УДАЛЯЕМ АККАУНТЫ / UNLINK ACCOUNTS
    // =====================================================================

        // =====================================
        // = LOCAL
        // =====================================
        app.get('/unlink/local', function(req, res) {
            var user            = req.user;
            user.local.email    = undefined;
            user.local.password = undefined;
            user.save(function(err) {
                res.redirect('/profile');
            });
        });

        // =====================================
        // = FACEBOOK
        // =====================================
        app.get('/unlink/facebook', function(req, res) {
            var user            = req.user;
            user.facebook.token = undefined;
            user.save(function(err) {
                res.redirect('/profile');
            });
        });

        // =====================================
        // = VK
        // =====================================
        app.get('/unlink/facebook', function(req, res) {
            var user            = req.user;
            user.facebook.token = undefined;
            user.save(function(err) {
                res.redirect('/profile');
            });
        });
    
        // =====================================
        // = TWITTER
        // =====================================
        app.get('/unlink/twitter', function(req, res) {
            var user           = req.user;
            user.twitter.token = undefined;
            user.save(function(err) {
                res.redirect('/profile');
            });
        });

        // =====================================
        // = GOOGLE
        // =====================================
        app.get('/unlink/google', function(req, res) {
            var user          = req.user;
            user.google.token = undefined;
            user.save(function(err) {
                res.redirect('/profile');
            });
        });

        // =====================================
        // = ODNOKLASSNIKI
        // =====================================
        app.get('/unlink/odnoklassniki', function(req, res) {
            var user          = req.user;
            user.odnoklassniki.token = undefined;
            user.save(function(err) {
                res.redirect('/profile');
            });
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