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
    // = ЛОКАЛЬНАЯ РЕГИСТРАЦИЯ / LOCAL SIGNUP
    // ========================================================

    // passport.use('local-signup', new LocalStrategy({
    //         usernameField: 'email',
    //         passwordField: 'password',
    //         passReqToCallback: true
    //     },
    //     function (req, email, password, done) {
    //         process.nextTick(function () {
    //             var newUser = new User();
    //            
    //             newUser.local.username = req.body.username;
    //             newUser.local.firstname = req.body.firstname;
    //             newUser.local.lastname = req.body.lastname;
    //             newUser.local.email = email;
    //             newUser.local.password = newUser.generateHash(password);
    //
    //             newUser.save(function(err) {
    //                if(err)
    //                     return done(null, false, err);
    //
    //                 return done(null, newUser);
    //             });
    //         });
    //     }
    // ));
    
    
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
                        return done(null, false, req.flash('loginMessage', 'Такого пользователя не существует'));
                    } 
                    
                    if(!user.validPassword(password)) {
                        return done(null, false, req.flash('loginMessage', 'Неверный пароль'));
                    }
                    return done(null, user);
                });
            });
        }
    ));

    // ========================================================
    // = FACEBOOK
    // ========================================================

    passport.use(new FacebookStrategy({
        clientID        : configAuth.facebookAuth.clientID,
        clientSecret    : configAuth.facebookAuth.clientSecret,
        callbackURL     : configAuth.facebookAuth.callbackURL,
        profileFields: ['id', 'displayName', 'name', 'photos','emails','link','gender']
    },
    function(token, refreshToken, profile, done) {
        process.nextTick(function() {
            User.findOne({ 'facebook.id' : profile.id }, function(err, user) {
                if (err)
                    return done(err);
                
                if (user) {
                    return done(null, user);
                } else {
                    
                    var newUser = new User();
                    
                    newUser.facebook.id    = profile.id;    
                    newUser.facebook.token = token;
                    newUser.facebook.name  = profile.name.givenName + ' ' + profile.name.familyName;
                    newUser.facebook.email = profile.emails[0].value;
                    
                    newUser.save(function(err) {
                        if (err)
                            throw err;
                        
                        return done(null, newUser);
                    });
                }

            });
        });

    }));    
    

    // ========================================================
    // = VK
    // ========================================================

    passport.use(new VKontakteStrategy({
        clientID        : configAuth.vkAuth.clientID,
        clientSecret    : configAuth.vkAuth.clientSecret,
        callbackURL     : configAuth.vkAuth.callbackURL
    },
    function(token, refreshToken, profile, done) {
        process.nextTick(function() {
            User.findOne({ 'vk.id' : profile.id }, function(err, user) {
                if (err)
                    return done(err);
                
                if (user) {
                    return done(null, user);
                } else {
                    
                    var newUser = new User();
                    
                    newUser.vk.id    = profile.id;    
                    newUser.vk.token = token;
                    newUser.vk.name  = profile.name.givenName + ' ' + profile.name.familyName;
                    newUser.vk.username = profile.username;
                    
                    newUser.save(function(err) {
                        if (err)
                            throw err;
                        
                        return done(null, newUser);
                    });
                }

            });
        });

    }));

    // ========================================================
    // = TWITTER
    // ========================================================

    passport.use(new TwitterStrategy({
        consumerKey     : configAuth.twitterAuth.consumerKey,
        consumerSecret  : configAuth.twitterAuth.consumerSecret,
        callbackURL     : configAuth.twitterAuth.callbackURL
    },
    function(token, tokenSecret, profile, done) {
        process.nextTick(function() {
            User.findOne({ 'twitter.id' : profile.id }, function(err, user) {
                if (err)
                    return done(err);

                if (user) {
                    return done(null, user);
                } else {

                    var newUser = new User();

                    newUser.twitter.id          = profile.id;
                    newUser.twitter.token       = token;
                    newUser.twitter.username    = profile.username;
                    newUser.twitter.displayName = profile.displayName;

                    newUser.save(function(err) {
                        if (err)
                            throw err;

                        return done(null, newUser);
                    });
                }

            });
        });

    }));

    // ========================================================
    // = GOOGLE PLUS
    // ========================================================

    passport.use(new GoogleStrategy({
        clientID        : configAuth.googleAuth.clientID,
        clientSecret    : configAuth.googleAuth.clientSecret,
        callbackURL     : configAuth.googleAuth.callbackURL
    },
    function(token, refreshToken, profile, done) {
        process.nextTick(function() {
            User.findOne({ 'google.id' : profile.id }, function(err, user) {
                if (err)
                    return done(err);

                if (user) {
                    return done(null, user);
                } else {

                    var newUser = new User();

                    newUser.google.id    = profile.id;
                    newUser.google.token = token;
                    newUser.google.name  = profile.displayName;
                    newUser.google.email = profile.emails[0].value;

                    newUser.save(function(err) {
                        if (err)
                            throw err;

                        return done(null, newUser);
                    });
                }

            });
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
        profileFields: ['id', 'displayName', 'name', 'photos','emails','link','gender']
    },
    function(accessToken, refreshToken, profile, done) {
        process.nextTick(function() {
            console.log(profile);
            User.findOne({ 'odnoklassniki.id' : profile.id }, function(err, user) {
                if (err)
                    return done(err);

                if (user) {
                    return done(null, user);
                } else {

                    var newUser = new User();

                    newUser.odnoklassniki.id    = profile.id;
                    newUser.odnoklassniki.token = accessToken;
                    newUser.odnoklassniki.name  = profile.name.givenName + ' ' + profile.name.familyName;
                    newUser.odnoklassniki.email = profile.emails[0];

                    newUser.save(function(err) {
                        if (err)
                            throw err;

                        return done(null, newUser);
                    });
                }

            });
        });
    }));
};