module.exports = {
    ensureAuthenticated: function(req, res, next) {
        if(req.isAuthenticated()) {
            return next();
        }
        console.log('not authenticated');
        req.flash('error_msg', 'You are not authorized to access this page.');
        res.redirect('/users/login');
    }
}