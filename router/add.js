const express = require("express");
const router = express.Router();
const dbm = require("../lib/dbmanager");
const thunderboltm = require("../lib/thunderboltmanager");

const requireAuth = (req, res, next) => {
  // if (req.session.userId) {
  //     next(); // User is authenticated, continue to next middleware
  // } else {
  //     res.redirect('/login'); // User is not authenticated, redirect to login page
  // }
  next();
};

router.get("/", requireAuth, async function (req, res) {
  res.render("add", { title: "Team" });
});

router.post("/addUser", requireAuth, async (req, res) => {
  const name = req.body.name;
  const group = req.body.group;

  await dbm.addUser(name, group);
  res.send("success");
});

router.post("/isValidID", requireAuth, async (req, res) => {
  const id = req.body.id;
  const result = await thunderboltm.getUserDetails(id);
  res.send(result);
});

router.post("/isValidName", requireAuth, async (req, res) => {
  const { name, group } = req.body;
  const result = await dbm.isNameAlreadyExists(name, group);
  res.send(!result);
});

router.post("/getNames", requireAuth, async (req, res) => {
  const docArray = await dbm.getUserNames();

  res.send(docArray);
});

router.post("/getNamesSapphire", requireAuth, async (req, res) => {
  const docArray = await dbm.getUserNamesSapphire();
  res.send(docArray);
});

router.post("/updateNamelist", requireAuth, async (req, res) => {
  const name = req.body.name;
  const link = req.body.link;

  await dbm.updateNamelist(name, link);

  res.redirect("/add");
});

router.post("/delete", requireAuth, async (req, res) => {
  const name = req.body.name;
  const group = req.body.group;

  await dbm.delete(name, group);
});

router.post("/getNLData", requireAuth, async (req, res) => {
  const uid = req.body.uid;
  const nl = await thunderboltm.getData(uid);
  res.send(nl);
});

router.post("/getKIVData", requireAuth, async (req, res) => {
  const uid = req.body.uid;
  const nl = await thunderboltm.getData(uid, 'kiv');
  res.send(nl);
});

module.exports = router;
