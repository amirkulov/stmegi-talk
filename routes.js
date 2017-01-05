module.exports = function (app, passport) {

    // =====================================
    // = ГЛАВНАЯ СТРАНИЦА / HOME PAGE
    // =====================================

    app.get('/', function (req, res) {
        res.render('index', {
            messageLogin: req.flash('fieldsLogin'),
            messageSignup: req.flash('fieldsSignup')
        });
    });

    // =========================================================
    // = ГЛАВНАЯ СТРАНИЦА ID ПОЛЬЗОВАТЕЛЯ / HOME PAGE ID USERS
    // =========================================================

    app.get('/main', function (req, res) {
        res.render('main');
    });

    // =====================================
    // = НАСТРОЙКИ / SETTINGS
    // =====================================

    app.get('/settings/', isLoggedIn, function(req, res) {

        var idAct = req.param('act');

        switch(idAct) {
            case 'accounts':
                var template = 'settings_accounts';
                break;
            default:
                var template = 'settings';
        }

        res.render(template, {
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
                messageLogin: req.flash('fieldsLogin')
            });
        });

        app.post('/login', function (req, res, next) {
            req.assert('email', 'Адрес невалиден').isEmail();
            req.assert('email', 'Поле обязательно для заполнения').notEmpty();
            req.assert('password', 'Поле обязательно для заполнения').notEmpty();

            // var errors = {};
            // errors[0]['email']['value'] = req.body.email;
            // errors[0]['password']['value'] = req.body.password;

            req.getValidationResult().then(function(result) {
                if (!result.isEmpty()) {
                    var errors = result.mapped();
                    req.flash('fieldsLogin', errors);
                    res.redirect('/login');
                }
                else
                {
                    passport.authenticate('local-login', { failureFlash : true },
                    function(err, user, info) {
                        if (err) {
                            return next(err);
                        }

                        if (!user) {return res.redirect('/login');}

                        req.logIn(user, function(err) {
                            if (err) { return next(err); }
                            return res.redirect('/id' + user.idPage);
                        });
                    })(req, res, next);
                }
            });
        });

        // =====================================
        // = РЕГИСТРАЦИЯ / SIGN UP
        // =====================================

        app.get('/signup', function(req, res) {
            res.render('signup', {
                messageSignup: req.flash('fieldsSignup')
            });
        });

        app.post('/signup', function (req, res, next) {
            req.assert('email', 'Поле обязательно для заполнения').notEmpty();
            req.assert('password', 'Поле обязательно для заполнения').notEmpty();

            req.getValidationResult().then(function(result) {
                if (!result.isEmpty()) {
                    var errors = result.mapped();
                    req.flash('fieldsSignup', errors);
                    res.redirect('/signup');
                }
                else
                {
                    passport.authenticate('local-signup', { failureFlash : true },
                    function(err, user, info) {
                        if (err) {
                            return next(err);
                        }

                        if (!user) {return res.redirect('/signup');}

                        req.logIn(user, function(err) {
                            if (err) { return next(err); }
                            return res.redirect('/id' + user.idPage);
                        });
                    })(req, res, next);
                }
            });
        });

        // =====================================
        // = FACEBOOK
        // =====================================

        app.get('/auth/facebook',
            passport.authenticate('facebook', {
                scope : 'email'
            }));

        app.get('/auth/facebook/callback',
            passport.authenticate('facebook', { failureRedirect : '/login' }),
            function(req, res) {
                res.redirect('/id' + req.user.idPage);
            });

        // =====================================
        // = VK
        // =====================================

        app.get('/auth/vk',
            passport.authenticate('vkontakte', {
                scope: ['emails']
            }));

        app.get('/auth/vk/callback',
            passport.authenticate('vkontakte', { failureRedirect : '/login' }),
            function(req, res) {
                res.redirect('/id' + req.user.idPage);
            });

        // =====================================
        // = TWITTER
        // =====================================

        app.get('/auth/twitter',
            passport.authenticate('twitter'));

        app.get('/auth/twitter/callback',
            passport.authenticate('twitter', { failureRedirect : '/login' }),
            function(req, res) {
                res.redirect('/id' + req.user.idPage);
            });

        // =====================================
        // = GOOGLE PLUS
        // =====================================

        app.get('/auth/google',
            passport.authenticate('google', {
                scope : ['profile', 'email']
            }));

        app.get('/auth/google/callback',
            passport.authenticate('google', { failureRedirect : '/login' }),
            function(req, res) {
                res.redirect('/id' + req.user.idPage);
            });

        // =====================================
        // = ODNOKLASSNIKI
        // =====================================

        app.get('/auth/odnoklassniki',
            passport.authenticate('odnoklassniki', {
                layout: 'm',
                scope: ['user_status', 'user_checkins']
            }));

        app.get('/auth/odnoklassniki/callback',
            passport.authenticate('odnoklassniki', { failureRedirect : '/login' }),
            function(req, res) {
                res.redirect('/id' + req.user.idPage);
            });

    // =====================================================================
    // = AUTHORIZE (ALREADY LOGGED IN / CONNECTING OTHER SOCIAL ACCOUNT)
    // = АВТОРИЗАЦИЯ (УЖЕ АВТОРИЗОВАННЫХ / СВЯЗАННЫХ С ДРУГИМИ СОЦ. СЕТЯМИ)
    // =====================================================================

        // =====================================
        // = LOCALLY
        // =====================================
        app.get('/connect/local', function(req, res) {
            res.render('connect-local', { message: req.flash('loginMessage') });
        });
        app.post('/connect/local', passport.authenticate('local-signup', {
            successRedirect : '/settings?act=accounts',
            failureRedirect : '/connect/local',
            failureFlash : true
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
               successRedirect : '/settings?act=accounts',
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
               successRedirect : '/settings?act=accounts',
               failureRedirect : '/'
           }));

        // =====================================
        // = TWITTER
        // =====================================

        app.get('/connect/twitter', passport.authorize('twitter', { scope : 'email' }));


        app.get('/connect/twitter/callback',
           passport.authorize('twitter', {
               successRedirect : '/settings?act=accounts',
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
               successRedirect : '/settings?act=accounts',
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
               successRedirect : '/settings?act=accounts',
               failureRedirect : '/'
           }));


    // =====================================================================
    // = УДАЛЯЕМ АККАУНТЫ / UNLINK ACCOUNTS
    // =====================================================================

        // =====================================
        // = LOCAL
        // =====================================
        app.get('/unlink/local', function(req, res) {
            var user = req.user;
            user.local.email    = undefined;
            user.local.password = undefined;
            user.save(function(err) {
                res.redirect('/settings?act=accounts');
            });
        });

        // =====================================
        // = FACEBOOK
        // =====================================
        app.get('/unlink/facebook', function(req, res) {
            var user = req.user;
            user.facebook.token = undefined;
            user.save(function(err) {
                res.redirect('/settings?act=accounts');
            });
        });

        // =====================================
        // = VK
        // =====================================
        app.get('/unlink/vk', function(req, res) {
            var user = req.user;
            user.vk.token = undefined;
            user.save(function(err) {
                res.redirect('/settings?act=accounts');
            });
        });

        // =====================================
        // = TWITTER
        // =====================================
        app.get('/unlink/twitter', function(req, res) {
            var user = req.user;
            user.twitter.token = undefined;
            user.save(function(err) {
                res.redirect('/settings?act=accounts');
            });
        });

        // =====================================
        // = GOOGLE
        // =====================================
        app.get('/unlink/google', function(req, res) {
            var user = req.user;
            user.google.token = undefined;
            user.save(function(err) {
                res.redirect('/settings?act=accounts');
            });
        });

        // =====================================
        // = ODNOKLASSNIKI
        // =====================================
        app.get('/unlink/odnoklassniki', function(req, res) {
            var user = req.user;
            user.odnoklassniki.token = undefined;
            user.save(function(err) {
                res.redirect('/settings?act=accounts');
            });
        });



    // =====================================
    // = ПРОФИЛЬ / PROFILE
    // =====================================

    app.get('/:idPage', isLoggedIn, function (req, res) {
        res.render('profile', {
            user : req.user
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
