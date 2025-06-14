const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const session = require('express-session');

const app = express();
const port = process.env.PORT || 12000;



app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views')); 
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(session({
  secret: 'Sapphire2025',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

const requireAuth = (req, res, next) => {
  if (req.session.userId) {
    next(); // User is authenticated, continue to next middleware
  } else {
    res.redirect('/login'); // User is not authenticated, redirect to login page
  }
}


// Routes will go here

app.get('/', requireAuth, function (req, res) {
  // res.render('dashboard', {userName : req.session.userId, page : 'dash'});
  res.redirect("/dashboard");
});

//getUserName
const userNameRoute = require('./router/username');
app.use('/getUserName', userNameRoute);

//Roster
const rosterRoute = require('./router/roster');
app.use('/roster', rosterRoute);

//Login page
const loginRoute = require('./router/login');
app.use('/login', loginRoute);

//Dashboard page

const dashRoute = require('./router/dashboard');
app.use('/dashboard', dashRoute);

//Activity page 
const viewRoute = require('./router/view');
app.use('/view', viewRoute);

//Analyze page
const analyzeRoute = require('./router/analyze'); 
app.use('/analyze', analyzeRoute);

//Closings Page
const closingRoute = require('./router/network');
app.use('/network', closingRoute);

//Utilities page 
const utilitiesRoute = require('./router/util');
app.use('/util', utilitiesRoute);

//Documents page 
const docRoute = require('./router/docs');
app.use('/docs', docRoute);

//Team page 
const addRoute = require('./router/add');
app.use('/add', addRoute);

//Settings Page
const settingsRoute = require('./router/settings');
app.use('/settings', settingsRoute);

// //The 404 Route (ALWAYS Keep this as the last route)
// app.get('*', requireAuth, function (req, res) {
//   res.render('404', { userName: req.session.userId, page: '404' });
// });

// app.post('*', requireAuth, function (req, res) {
//   res.render('404', { userName: req.session.userId, page: '404' });
// });

app.listen(port, '0.0.0.0');
console.log('Server started at http://localhost:' + port);