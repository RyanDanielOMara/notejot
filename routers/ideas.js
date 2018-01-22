const express = require('express');
const Idea    = require('../models/Idea').Idea;

const router = express.Router();

define_routes();

function define_routes(){
    create_home_route();
    create_add_route();
    create_edit_route();
    create_edit_endpoint();
    create_delete_endpoint();
}

/**
 * Creates GET/POST routes for the ideas index.
 * GET: Loads the existing ideas from the database and displays them in the
 *   order they were created
 * POST: Endpoint for processing video idea forms - validates input
 */
function create_home_route(){
    router.route('/')
        .get((req, res) => {
            Idea.find({})
            .sort({date: 'descending'})
            .then(ideas => {
                res.render('ideas/index', {
                    ideas: ideas
                });
            });
        })
        .post((req, res) => {
            validate_video_idea_form(req, res);
        });
}

/**
 * Creates GET route for ideas/add - renders the 'add' view.
 */
function create_add_route(){
    router.get('/add', (req, res) => {
        res.render('ideas/add');
    });
}

/**
 * Creates GET route for ideas/edit/:id where :id is an id of an idea in the DB.
 * Attempts fo find the idea with that idea in the database, then loads the
 * edit view with the information from the requested idea.
 */
function create_edit_route(){
    router.get('/edit/:id', (req, res) => {
        Idea.findOne({
            _id: req.params.id
        })
        .then(idea => {
            res.render('ideas/edit', {
                idea: idea
            });
        });
    });
}

/**
 * Creates PUT route for ideas/:id where :id is the id of an idea in the DB.
 * 
 * Locates the idea from the database with the id passed in as a parameter and
 * then updates the idea with the new title and details passed in the request
 * body.  Saves this updated idea to the database and redirects to the ideas
 * index.
 */
function create_edit_endpoint(){
    router.put('/:id', (req, res) => {
        Idea.findOne({
            _id: req.params.id
        })
        .then(idea => {
            idea.title = req.body.title;
            idea.details = req.body.details;

            idea.save()
                .then(idea => {
                    req.flash('success_msg', 'Video idea updated');
                    res.redirect('/ideas');
                })
        })
    });
}

/**
 * Creates DELETE route for ideas:/id where :id is the id of an idea in the DB.
 * 
 * Locates the idea from the database with the id passed in as a parameter and
 * then removes it from the database, then reloads the ideas view.
 */
function create_delete_endpoint(){
    router.delete('/:id', (req, res) => {
        Idea.remove({_id: req.params.id})
            .then(() => {
                req.flash('success_msg', 'Video idea removed');
                res.redirect('/ideas');
            });
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
            req.flash('success_msg', 'Video idea added');
            res.redirect('/ideas');
        });
}

module.exports = router