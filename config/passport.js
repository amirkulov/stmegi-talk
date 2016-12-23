var LocalStrategy = require('passport-local').Strategy;
var User = require('../models/user');

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
    
    passport.use('local-signup', new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true
    },
        function (req, email, password, done) {
            process.nextTick(function () {
                var newUser = new User();
                
                newUser.local.username = req.body.username; 
                newUser.local.firstname = req.body.firstname;
                newUser.local.lastname = req.body.lastname;
                newUser.local.email = email;
                newUser.local.password = newUser.generateHash(password);

                newUser.save(function(err) {
                    if(err)
                        return done(null, false, req.flash('signupMessage', err));

                    return done(null, newUser);
                });
            });
        }
    ));
    
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
};