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

const app  = express();
const port = 5000;

connect_db();
init_middleware();
init_routes();


app.listen(port, () => {
    console.log(`Server started on port ${port}...`);
});

/**
 * Connect to our Mongo Database using Mongoose
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
 * Initialize middleware
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

    // Idea page
    app.get('/ideas', (req, res) => {
        Idea.find({})
        .sort({date: 'descending'})
        .then(ideas => {
            res.render('ideas/index', {
                ideas: ideas
            });
        });
    });

    // Form to edit video ideas
    app.get('/ideas/edit/:id', (req, res) => {
        Idea.findOne({
            _id: req.params.id
        })
        .then(idea => {
            res.render('ideas/edit', {
                idea: idea
            });
        });
    });

    // Form to add video ideas
    app.get('/ideas/add', (req, res) => {
        res.render('ideas/add');
    });

    // Endpoint for processing video idea forms
    app.post('/ideas', (req, res) => {
        validate_video_idea_form(req, res);
    });

    // Edit form process
    app.put('/ideas/:id', (req, res) => {
        Idea.findOne({
            _id: req.params.id
        })
        .then(idea => {
            idea.title = req.body.title;
            idea.details = req.body.details;

            idea.save()
                .then(idea => {
                    res.redirect('/ideas');
                })
        })
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
        save_video_form(req, res);
    }
}

/**
 * Creates an object containing:
 *   - Title: title of the client's submission
 *   - Details: details of the client's submission
 * Creates and saves an Idea to the database and then redirects the user.
 * @param {Object} req - The HTTP request made by the client. 
 * @param {Object} res - The HTTP response.
 */
function save_video_form(req, res){
    const newUser = {
        title: req.body.title,
        details: req.body.details
    }
    new Idea(newUser)
        .save()
        .then(idea => {
            res.redirect('/ideas');
        });
}