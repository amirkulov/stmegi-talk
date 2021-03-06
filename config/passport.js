var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var VKontakteStrategy = require('passport-vkontakte').Strategy;
var TwitterStrategy  = require('passport-twitter').Strategy;
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var OdnoklassnikiStrategy = require('passport-odnoklassniki').Strategy;

var User = require('../models/user');
var configAuth = require('./auth');

module.exports = function (passport) {

    // ========================================================
    // = УСТАНОВКА СЕССИИ PASSPORT / PASSPORT SESSION SETUP 
    // ========================================================
    
    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });

    // ========================================================
    // = ЛОКАЛЬНЫЙ ВХОД / LOCAL LOGIN
    // ========================================================

    passport.use('local-login', new LocalStrategy({
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true
        },
        function (req, email, password, done) {
            process.nextTick(function () {
                User.findOne({'local.email' : email }, function (err, user) {
                    if (err)
                        return done(err);

                    if(!user) {
                        var generalError =  {
                            'general': {
                                'msg': 'Такой учетной записи не существует'
                            }
                        };
                        
                        return done(null, false, req.flash('fields', generalError));
                    }

                    if(!user.validPassword(password)) {

                        var passwordError =  {
                            'password': {
                                'msg': 'Неверный пароль'
                            }
                        };
                        
                        return done(null, false, req.flash('fields', passwordError));
                    }
                    return done(null, user);
                });
            });
        }
    ));
    
    
    // ========================================================
    // = ЛОКАЛЬНАЯ РЕГИСТРАЦИЯ / LOCAL SIGNUP
    // ========================================================
    passport.use('local-signup', new LocalStrategy({
            usernameField : 'email',
            passwordField : 'password',
            passReqToCallback : true
        },
        function(req, email, password, done) {
            process.nextTick(function() {                
                var newUser = new User();
                
                newUser.local.firstName = req.body.firstName;
                newUser.local.lastName  = req.body.lastName;
                newUser.local.email     = email;
                newUser.local.password  = newUser.generateHash(password);

                newUser.save(function(err) {
                    if (err){
                        var emailError =  {
                            'email': {
                                'msg':   err.errors['local.email']['message'],
                                'value': err.errors['local.email']['value']
                            }
                        };
                        return done(null, false, req.flash('fields', emailError));
                    }

                    return done(null, newUser);
                });
            });
        }));
    
    
    // ========================================================
    // = FACEBOOK
    // ========================================================

    passport.use(new FacebookStrategy({
        clientID        : configAuth.facebookAuth.clientID,
        clientSecret    : configAuth.facebookAuth.clientSecret,
        callbackURL     : configAuth.facebookAuth.callbackURL,
        passReqToCallback : true,
        profileFields: ['id', 'displayName', 'name', 'photos','emails','link','gender']
    },
    function(req, token, refreshToken, profile, done) {
        process.nextTick(function() {
            if (!req.user) {
                User.findOne({'facebook.id': profile.id}, function (err, user) {
                    if (err)
                        return done(err);

                    if (user) {

                        if (!user.facebook.token) {
                            user.facebook.token = token;
                            user.facebook.name  = profile.name.givenName + ' ' + profile.name.familyName;
                            user.facebook.email = profile.emails[0].value;

                            user.save(function(err) {
                                if (err)
                                    throw err;
                                return done(null, user);
                            });
                        }
                        else
                        {
                            return done(null, user);
                        }
                    } else {

                        var newUser = new User();

                        newUser.facebook.id = profile.id;
                        newUser.facebook.token = token;
                        newUser.facebook.name = profile.name.givenName + ' ' + profile.name.familyName;
                        newUser.facebook.email = profile.emails[0].value;

                        newUser.save(function (err) {
                            if (err)
                                throw err;

                            return done(null, newUser);
                        });
                    }

                });
            } else {
                
                var user = req.user;

                user.facebook.id    = profile.id;
                user.facebook.token = token;
                user.facebook.name  = profile.name.givenName + ' ' + profile.name.familyName;
                user.facebook.email = profile.emails[0].value;

                // save the user
                user.save(function(err) {
                    if (err)
                        throw err;
                    return done(null, user);
                });
            }
        });

    }));    
    

    // ========================================================
    // = VK
    // ========================================================

    passport.use(new VKontakteStrategy({
        clientID        : configAuth.vkAuth.clientID,
        clientSecret    : configAuth.vkAuth.clientSecret,
        callbackURL     : configAuth.vkAuth.callbackURL,
        passReqToCallback : true,
    },
    function(req, token, refreshToken, profile, done) {
        process.nextTick(function() {
            if (!req.user) {
                User.findOne({'vk.id': profile.id}, function (err, user) {
                    if (err)
                        return done(err);

                    if (user) {

                        if (!user.vk.token) {
                            user.vk.token = token;
                            user.vk.name = profile.name.givenName + ' ' + profile.name.familyName;
                            user.vk.username = profile.username;

                            user.save(function(err) {
                                if (err)
                                    throw err;
                                return done(null, user);
                            });
                        }
                        else
                        {
                            return done(null, user);
                        }
                    } else {

                        var newUser = new User();

                        newUser.vk.id = profile.id;
                        newUser.vk.token = token;
                        newUser.vk.name = profile.name.givenName + ' ' + profile.name.familyName;
                        newUser.vk.username = profile.username;

                        newUser.save(function (err) {
                            if (err)
                                throw err;

                            return done(null, newUser);
                        });
                    }

                });
            } else {

                var user = req.user;

                user.vk.id    = profile.id;
                user.vk.token = token;
                user.vk.name  = profile.name.givenName + ' ' + profile.name.familyName;
                user.vk.username = profile.username;

                // save the user
                user.save(function(err) {
                    if (err)
                        throw err;
                    return done(null, user);
                });
            }
        });

    }));

    // ========================================================
    // = TWITTER
    // ========================================================

    passport.use(new TwitterStrategy({
        consumerKey     : configAuth.twitterAuth.consumerKey,
        consumerSecret  : configAuth.twitterAuth.consumerSecret,
        callbackURL     : configAuth.twitterAuth.callbackURL,
        passReqToCallback : true
    },
    function(req, token, tokenSecret, profile, done) {
        process.nextTick(function() {
            if (!req.user) {
                User.findOne({'twitter.id': profile.id}, function (err, user) {
                    if (err)
                        return done(err);

                    if (user) {
                        
                        if (!user.twitter.token) {
                            user.twitter.token = token;
                            user.twitter.name  = profile.name.givenName + ' ' + profile.name.familyName;
                            user.twitter.email = profile.emails[0].value;

                            user.save(function(err) {
                                if (err)
                                    throw err;
                                return done(null, user);
                            });
                        }
                        else
                        {
                            return done(null, user);
                        }
                    } else {

                        var newUser = new User();

                        newUser.twitter.id = profile.id;
                        newUser.twitter.token = token;
                        newUser.twitter.username = profile.username;
                        newUser.twitter.displayName = profile.displayName;

                        newUser.save(function (err) {
                            if (err)
                                throw err;

                            return done(null, newUser);
                        });
                    }

                });
            } else {

                var user = req.user;

                user.twitter.id    = profile.id;
                user.twitter.token = token;
                user.twitter.username  = profile.username;
                user.twitter.displayName = profile.displayName;

                // save the user
                user.save(function(err) {
                    if (err)
                        throw err;
                    return done(null, user);
                });
            }
        });

    }));

    // ========================================================
    // = GOOGLE PLUS
    // ========================================================

    passport.use(new GoogleStrategy({
        clientID        : configAuth.googleAuth.clientID,
        clientSecret    : configAuth.googleAuth.clientSecret,
        callbackURL     : configAuth.googleAuth.callbackURL,
        passReqToCallback : true
    },
    function(req, token, refreshToken, profile, done) {
        process.nextTick(function() {
            if (!req.user) {
                User.findOne({'google.id': profile.id}, function (err, user) {
                    if (err)
                        return done(err);

                    if (user) {

                        if (!user.google.token) {
                            user.google.token = token;
                            user.google.name  = profile.name.givenName + ' ' + profile.name.familyName;
                            user.google.email = profile.emails[0].value;

                            user.save(function(err) {
                                if (err)
                                    throw err;
                                return done(null, user);
                            });
                        }
                        else
                        {
                            return done(null, user);
                        }
                    } else {

                        var newUser = new User();

                        newUser.google.id = profile.id;
                        newUser.google.token = token;
                        newUser.google.name = profile.displayName;
                        newUser.google.email = profile.emails[0].value;

                        newUser.save(function (err) {
                            if (err)
                                throw err;

                            return done(null, newUser);
                        });
                    }

                });
            } else {

                var user = req.user;

                user.google.id    = profile.id;
                user.google.token = token;
                user.google.name  = profile.displayName;
                user.google.email = profile.emails[0].value;

                // save the user
                user.save(function(err) {
                    if (err)
                        throw err;
                    return done(null, user);
                });
            }
        });
    }));
    
    // ========================================================
    // = ODNOKLASSNIKI
    // ========================================================

    passport.use(new OdnoklassnikiStrategy({
        clientID        : configAuth.odnoklassnikiAuth.clientID,
        clientPublic    : configAuth.odnoklassnikiAuth.clientPublic,
        clientSecret    : configAuth.odnoklassnikiAuth.clientSecret,
        callbackURL     : configAuth.odnoklassnikiAuth.callbackURL,
        passReqToCallback : true
    },
    function(req, accessToken, refreshToken, profile, done) {
        process.nextTick(function() {
            if (!req.user) {
                User.findOne({'odnoklassniki.id': profile.id}, function (err, user) {
                    if (err)
                        return done(err);
                    
                    if (user) {
                        if (!user.odnoklassniki.token) {
                            user.odnoklassniki.token = accessToken;
                            user.odnoklassniki.name  = profile.name.givenName + ' ' + profile.name.familyName;
                            user.odnoklassniki.email = profile.emails[0];

                            user.save(function(err) {
                                if (err)
                                    throw err;
                                return done(null, user);
                            });
                        }
                        else
                        {
                            return done(null, user);
                        }                        
                    } else {

                        var newUser = new User();

                        newUser.odnoklassniki.id = profile.id;
                        newUser.odnoklassniki.token = accessToken;
                        newUser.odnoklassniki.name = profile.name.givenName + ' ' + profile.name.familyName;
                        newUser.odnoklassniki.email = profile.emails[0];

                        newUser.save(function (err) {
                            if (err)
                                throw err;

                            return done(null, newUser);
                        });
                    }

                });
            } else {

                var user = req.user;

                user.odnoklassniki.id    = profile.id;
                user.odnoklassniki.token = accessToken;
                user.odnoklassniki.name  = profile.name.givenName + ' ' + profile.name.familyName;
                user.odnoklassniki.email = profile.emails[0];

                // save the user
                user.save(function(err) {
                    if (err)
                        throw err;
                    return done(null, user);
                });
            }
        });
    }));
};