/**
 * Load Express module, create an instance of express, declare port and start
 * server. 
*/

const exphbs         = require('express-handlebars');
const express        = require('express');
const mongoose       = require('mongoose');
const bodyParser     = require('body-parser');
const methodOverride = require('method-override');

// Models
const Idea = require('./models/Idea').Idea;

// Routers
const ideas = require('./routers/ideas');

const app  = express();
const port = 5000;

connect_db();
init_middleware();
init_routes();


app.listen(port, () => {
    console.log(`Server started on port ${port}...`);
});

/**
 * Connect to our Mongo Database using Mongoose.
 */
function connect_db(){
    mongoose.Promise = global.Promise;
    mongoose.connect('mongodb://localhost/vidjot-dev', {
        useMongoClient: true
    })
        .then(() => console.log('MongoDB connected...'))
        .catch(err => console.log(err));
}

/**
 * Initialize middleware.
 *   - Handlebars middleware for template rendering
 *   - Body-parser for parsing the body of HTTP requests in Node.js
 *   - Method-override for using HTTP verbs such as PUT where client doesn't 
 *     support it
 */
function init_middleware(){
    // Handlebars middleware
    app.engine('handlebars', exphbs({
        defaultLayout: 'main'
    }));
    app.set('view engine', 'handlebars');

    //Body-parser middleware
    app.use(bodyParser.urlencoded({ extended: false}));
    app.use(bodyParser.json());

    // Method-override middleware
    app.use(methodOverride('_method'));

}

/**
 * Initialize routes.
 *   - Index
 *   - About
 *   - Ideas
 */
function init_routes(){
    // Index route
    app.get('/', (req, res) => {
        res.render('index');
    });

    // About route
    app.get('/about', (req, res) => {
        res.render('about');
    });

    // Ideas router
    app.use('/ideas', ideas);
}