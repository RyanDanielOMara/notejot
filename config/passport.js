const LocalStrategy = require('passport-local').Strategy;
const mongoose      = require('mongoose');
const bcrypt        = require('bcryptjs');
const User          = require('../models/User').User;


// Load user model

module.exports = function(passport){
    passport.use(new LocalStrategy({
        usernameField: 'email' },(email, password, done) => {
            User.findOne({
                email: email,
            }).then(user => {
                if(!user){
                    return done(null, false, {message: "The email you entered doesn't belong to an account.  Please check your username and try again."});
                }
                bcrypt.compare(password, user.password, (err, isMatch) => {
                    if(err) throw err;
                    if(isMatch){
                        return done(null, user);
                    } else {
                        return done(null, false, {message: "Sorry, the password you've entered is incorrect.  Please double-check and try again."});
                    }
                });
            })
    }));

    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });
}