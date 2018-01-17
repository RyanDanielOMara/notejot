/**
 * Load Express module, create an instance of express, declare port and start
 * server. 
*/

const exphbs     = require('express-handlebars');
const express    = require('express');
const mongoose   = require('mongoose');
const bodyParser = require('body-parser');

const app  = express();
const port = 5000;

connect_db();
load_models();
init_middleware();
init_routes();


app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});

/**
 * Connect to our Mongo Database using Mongoose
 */
function connect_db(){
    mongoose.Promise = global.Promise;
    mongoose.connect('mongodb://localhost/vidjot-dev', {
        useMongoClient: true
    })
        .then(() => console.log('MongoDB Connected...'))
        .catch(err => console.log(err));
    load_models();
}

/**
 * Loads all models based on pre-defined schema
 */
function load_models(){
    require('./models/Idea');
    const Idea = mongoose.model('ideas');
}

/**
 * Initialize middleware
 *   - Handlebars middleware for template rendering
 *   - Body-parser for parsing the body of HTTP requests in Node.js
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

}

/**
 * Initialize routes
 *   - Index
 *   - About
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

    // About route
    app.get('/ideas/add', (req, res) => {
        res.render('ideas/add');
    });

    //Process Form
    app.post('/ideas', (req, res) => {
        validate_video_idea_form(req, res);
    });
    
}

/**
 * Server-side validation for the video idea form.
 * @param {Object} req - The HTTP request made by the client. 
 * @param {Object} res - The HTTP response.
 */
function validate_video_idea_form(req, res) {
    let errors = [];
        
    if (!req.body.title){
        errors.push({text:'Please add a title'});
    }
    if (!req.body.details){
        errors.push({text:'Please add some details'});
    }
    if(errors.length > 0) {
        res.render('ideas/add', {
            errors: errors,
            title: req.body.title,
            details: req.body.details
        });
    } else {
        res.send('Form Validated');
    }
}