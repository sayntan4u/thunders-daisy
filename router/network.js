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

router.post('/getNetwork', requireAuth, async function (req, res) {
    const data = await dbm.getNetwork();
    res.send(data);
});

router.post('/saveNetwork', requireAuth, async function (req, res) {
    const network = req.body.network;
    const data = await dbm.saveNetwork(network);
    res.send(data);
});





module.exports = router;