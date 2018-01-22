const LocalStrategy = require('passport-local').Strategy;
const mongoose      = require('mongoose');
const bcrypt        = require('bcryptjs');
const User          = require('../models/User').User;


// Load user model

module.exports = function(passport){
    passport.use(new LocalStrategy({
        usernameField: 'email'
    },(email, password, done) => {
        console.log('strategy');
    }));
}