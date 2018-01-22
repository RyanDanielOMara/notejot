const bcrypt  = require('bcryptjs');
const express = require('express');
const User    = require('../models/User').User;

const router  = express.Router();



// define_routes();

// function define_routes(){
//     create_login_route();
//     create_register_route();
// }

// /**
//  * Creates GET route for users/login - renders the 'login' view.
//  */
// function create_add_route(){
//     router.get('/login', (req, res) => {
//         res.render('users/login');
//     });
// }

router.get('/login', (req, res) => {
    res.render('users/login');
});

router.get('/register', (req, res) => {
    res.render('users/register');
});

router.post('/register', (req, res) => {
    let errors = [];

    if(req.body.password != req.body.password2) {
        errors.push({ text:'Passwords do not match' });
    }
    if(req.body.password.length < 8) {
        errors.push({ text:'Password must be at least 8 characters' });
    }
    if(errors.length > 0) {
        res.render('users/register', {
            errors:errors,
            name:      req.body.name,
            email:     req.body.email,
            password:  req.body.password,
            password2: req.body.password2
        });
    } else {
        User.findOne({ email: req.body.email })
            .then(user => {
                if(user) {
                    req.flash('error_msg', 'Email already registered.');
                    res.redirect('/users/register');
                } else {
                    const newUser = new User({
                        name:     req.body.name,
                        email:    req.body.email,
                        password: req.body.password
                    });
                    bcrypt.genSalt(10, (err, salt) => {
                        bcrypt.hash(newUser.password, salt, (err, hash) => {
                            if(err) throw err;
                            newUser.password = hash;
                            newUser.save()
                                .then(user => {
                                    req.flash('success_msg', 
                                        'You are now registered and can log in!');
                                    res.redirect('login');
                                })
                                .catch(err => {
                                    console.log(err);
                                    return;
                                })
                        })
                    });
                }
            });
    }
})

module.exports = router