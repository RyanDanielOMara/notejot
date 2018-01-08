/**
 * Load Express module, create an instance of express, declare port and start
 * server. 
*/

const express = require('express');
const app     = express();
const exphbs  = require('express-handlebars');
const port    = 5000;

init_middleware()
init_routes()

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});

/**
 * Initialize middleware
 * Handlebars middleware for template rendering
 */
function init_middleware(){
    // Handlebars middleware
    app.engine('handlebars', exphbs({
        defaultLayout: 'main'
    }));
    app.set('view engine', 'handlebars');
}

/**
 * Initialize routes
 * Index
 * About
 */
function init_routes(){
    // Index route
    app.get('/', (req, res) => {
        res.render('index');
    });

    // About route
    app.get('/about', (req, res) => {
        res.render('about')
    })
}