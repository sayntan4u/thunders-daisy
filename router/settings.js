const express = require('express');
const router = express.Router();
var formidable = require('formidable');
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
    res.render('settings', { title : 'Settings' });
});


router.get("/getStatus", requireAuth, async (req, res) => {
    res.send(dbm.statusJson);
});

router.post("/getSettings", requireAuth, async (req, res) => {
    const data = await dbm.getSettings();
    res.send(data);
});

router.post("/saveSettings", requireAuth, async (req, res) => {
    const config = req.body.config;
    console.log(config);

    await dbm.saveSettings(config);

    res.send("success");
});

router.post("/updateShowProfit", requireAuth, async (req, res) => {
    const config = req.body.config;
    await dbm.updateShowProfit(config);
    res.send("success");
});

router.post("/export", requireAuth, async (req, res) => {
    const group = req.body.group;
    const field = req.body.field;

    dbm.statusJson.procName = "Export";

    const data = await dbm.getFullCollectionData(group, field);
    res.send(data);
});

router.post("/upload", requireAuth, async (req, res) => {
    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
        // console.log(files.file[0].filepath);
        var oldpath = files.file[0].filepath;
        // var newpath = './uploads/' + files.file[0].originalFilename;
        // fs.copyFileSync(oldpath, newpath);

        dbm.uploadFullCollectionData(oldpath);
    });
});



module.exports = router;