const express = require('express');
const router = express.Router()

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

module.exports = router