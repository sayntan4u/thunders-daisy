const express = require('express');
const router = express.Router();

const requireAuth = (req, res, next) => {
    if (req.session.userId) {
        next(); // User is authenticated, continue to next middleware
    } else {
        res.redirect('/login'); // User is not authenticated, redirect to login page
    }
}


router.get('/', function (req, res) {
    if (req.session.userId) {
        res.redirect("/");
    } else {
        res.render('login');
    }

});

router.post('/', function (req, res) {

    if (req.body.userid == "Admin" && req.body.password == "123") {
        req.session.userid = req.body.userid; // Set session identifier
        res.send(1);
    } else {
        res.send("Wrong credentials!");
    }

});


router.get('/logout', requireAuth, function (req, res) {
    req.session.destroy(function (err) {
        res.redirect('/');
    });
});


module.exports = router;