const express = require("express");
const router = express.Router();
const dbm = require("../lib/dbmanager");

const requireAuth = (req, res, next) => {
  // if (req.session.userId) {
  //     next(); // User is authenticated, continue to next middleware
  // } else {
  //     res.redirect('/login'); // User is not authenticated, redirect to login page
  // }
  next();
};

router.get("/", requireAuth, async function (req, res) {
  res.render("dashboard", { title: "Dashboard" });
});

router.post("/getData", requireAuth, async function (req, res) {
  const week = req.body.week;
  const d = new Date();
  let year = d.getFullYear();
  const data = await dbm.getDashboardData(week, year);
//   console.log("Dashboard data:", data);
  res.json(data);
});

router.post("/getChartData", requireAuth, async function (req, res) {
  const week = req.body.week;
  const d = new Date();
  let year = d.getFullYear();
  const datas = await dbm.getDashboardChartData(week, year);
  // console.log("Dashboard data:", datas);
  res.json(datas);
});

module.exports = router;
