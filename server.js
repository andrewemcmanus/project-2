require('dotenv').config();
const express = require('express');
const layouts = require('express-ejs-layouts');
const app = express();
const session = require('express-session');
const SECRET_SESSION = process.env.CLIENT_SECRET;
const passport = require('./config/ppConfig');
// const cookieSession = require('cookie-session');
const flash = require('connect-flash');
// const methodOverride = require('method-override');

// require('./utilities/spotifyApi');
//require the authorizarization middleware at the top of the page
// add the isLoggedIn middleware here:
const isLoggedIn = require('./middleware/isLoggedIn');

app.set('view engine', 'ejs');

app.use(require('morgan')('dev'));
// app.use(cookieSession({ maxAge: 2592000000, keys: [process.env.COOKIE_KEY] }))
app.use(express.urlencoded({ extended: false }));
app.use(express.static(__dirname + '/public'));
app.use(layouts);

const sessionObject = {
  // secret: what we actually will be giving the user on our site as a session cookie
  secret: SECRET_SESSION,
  // resave: save the session even if it's modified, so we make this false from the start
  resave: false,
  // saveUninitialized: if we have a new session, we save it, thus making it true
  saveUninitialized: true
}

app.use(session(sessionObject));

// initialize Passport and run through middleware
app.use(passport.initialize());
app.use(passport.session());

// FLASH
// using Flash throughout app to send temp messages to users
app.use(flash());
// messages that will be accessible to every view
app.use((req, res, next) => {
  // before every route, we will attach a user to res.local
  res.locals.alerts = req.flash();
  res.locals.currentUser = req.user;
  next();
});

app.get('/', (req, res) => {
  // console.log(res.locals.alerts);
  res.render('index', { alerts: res.locals.alerts });
});

app.get('/profile', isLoggedIn, (req, res) => {
  res.render('profile');
});

app.get('/user', isLoggedIn, (req, res) => {
  res.render('user');
})

app.use('/auth', require('./routes/auth'));
// app.use('/song', isLoggedIn, require('./routes/user'));//mounting
app.use('/user', isLoggedIn, require('./routes/user'));
// app.use('/comment', isLoggedIn, require('./routes/comment'))
app.use('/profile', isLoggedIn, require('./routes/user'))

const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
  console.log(`🎧 You're listening to the smooth sounds of port ${PORT} 🎧`);
});




module.exports = server;
