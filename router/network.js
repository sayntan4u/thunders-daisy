const express = require('express');
const router = express.Router();
const dbm = require("../lib/dbmanager");

const requireAuth = (req, res, next) => {
    // if (req.session.userId) {
    //     next(); // User is authenticated, continue to next middleware
    // } else {
    //     res.redirect('/login'); // User is not authenticated, redirect to login page
    // }
    next();
}

router.get('/', requireAuth, function (req, res) {
    res.render('network', { title : 'Network' });
});



module.exports = router;