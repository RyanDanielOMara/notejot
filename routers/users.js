const bcrypt   = require('bcryptjs');
const express  = require('express');
const passport = require('passport');
const User     = require('../models/User').User;

const router = express.Router();

define_routes();

function define_routes(){
    create_login_routes();
    create_register_routes();
    create_logout_route();
}

/**
 * Creates GET route for users/login - renders the 'login' view.
 */
function create_login_routes() {
    router.route('/login')
    .get((req, res) => {
        res.render('users/login');
    })
    .post((req, res, next) => {
        passport.authenticate('local', {
            successRedirect: '/ideas',
            failureRedirect: 'login',
            failureFlash:     true
        })(req, res, next);
    });
}

/**
 * Creates GET/POST routes for the register page.
 * GET: Renders the 'register' view
 * POST: Attempts to validate, register, and save a new user to the database
 */
function create_register_routes(){
    router.route('/register')
        .get((req, res) => {
            res.render('users/register');
        })
        .post((req, res) => {
            if (validate_password(req, res)) {
                verify_unique_email(req, res)
            }
        });
}

function create_logout_route(){
    router.get('/logout', (req, res) => {
        req.logout();
        req.flash('success_msg', "You've been logged out.");
        res.redirect('login');
    });
}

/**
 * Validates the users password by ensuring that the passwords match and that
 * the password is at least 8 characters long.
 * @param {Object} req - The HTTP request made by the client. 
 * @param {Object} res - The HTTP response.
 */
function validate_password(req, res) {
    let errors = [];

    if(req.body.password != req.body.password2) {
        errors.push({ text:'Passwords do not match.' });
    }
    if(req.body.password.length < 8) {
        errors.push({ text:'Password must be at least 8 characters.' });
    }
    if(errors.length > 0) {
        res.render('users/register', {
            errors:errors,
            name:      req.body.name,
            email:     req.body.email,
            password:  req.body.password,
            password2: req.body.password2
        });
        return false;
    }
    return true;
}

/**
 * Performs a database lookup to check if the email the user is trying to
 * register with has already been registered.
 * @param {Object} req - The HTTP request made by the client. 
 * @param {Object} res - The HTTP response.
 */
function verify_unique_email(req, res) {
    User.findOne({ email: req.body.email })
        .then(user => {
            if(user) {
                req.flash('error_msg', 'Email already registered.');
                res.redirect('register');
            } else {
                create_new_user(req, res);
            }
        });
}

/**
 * Creates a new user object with the name, email, and password specified by the
 * user.  Encrypts the password and then attempts to save the user to the
 * database.
 * @param {Object} req - The HTTP request made by the client. 
 * @param {Object} res - The HTTP response.
 */
function create_new_user(req, res) {
    const newUser = new User({
        name:     req.body.name,
        email:    req.body.email,
        password: req.body.password
    });
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
            if(err) throw err;
            newUser.password = hash;
            save_user(newUser, req, res);
        });
    });
}

/**
 * Attempts to save the new user to the database.  If successful, redirects the
 * user to the login page.
 * @param {Object} newUser - A user object containing the name, email and
 * password of the user attempting to register.
 * @param {Object} req - The HTTP request made by the client. 
 * @param {Object} res - The HTTP response.
 */
function save_user(newUser, req, res) {
    newUser.save()
    .then(user => {
        req.flash('success_msg', 
            'You are now registered and can log in!');
        res.redirect('login');
    })
    .catch(err => {
        console.log(err);
        return;
    });
}

module.exports = router