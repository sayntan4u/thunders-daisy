const express = require('express');
const router = express.Router();
const dbm = require("../lib/dbmanager");

const requireAuth = (req, res, next) => {
  // if (req.session.userId) {
  //   next(); // User is authenticated, continue to next middleware
  // } else {
  //   res.redirect('/login'); // User is not authenticated, redirect to login page
  // }
  next();
}


router.get('/', requireAuth, function (req, res) {
  res.render('docs', {title: 'Documents' });
});

router.post('/getDocs', requireAuth,  async function (req, res) {
    const docArray = await dbm.getDocuments();
    res.send(docArray);
});

router.post('/addDoc', requireAuth,  async function (req, res) {
    const {doc} = req.body;
    const result = await dbm.addDocument(doc.id, doc.name, doc.content);
    res.send({result : result});
});

router.post('/updateDoc', requireAuth,  async function (req, res) {
    const {doc} = req.body;
    // console.log(doc);
    const result = await dbm.updateDocument(doc.id, doc.name, doc.content);
    res.send({result : result});
});

router.post('/deleteDoc', requireAuth,  async function (req, res) {
    const {id} = req.body;
    const result = await dbm.deleteDocument(id);
    res.send({result : result});
});



module.exports = router;