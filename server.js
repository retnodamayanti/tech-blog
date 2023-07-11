const express = require('express');
const session = require('express-session');
const path = require('path');
const exphbs = require('express-handlebars');
const withAuth = require('./utils/auth');
const helpers = require('./utils/helpers');

// Import routes and models
const { homeRoutes, dashboardRoutes, authRoutes } = require('./controllers');
const { User, Post, Comment } = require('./models');


// Create Express app
const app = express();
const PORT = process.env.PORT || 3001;

// Set up session middleware
app.use(
  session({
    secret: 'Super secret secret',
    resave: false,
    saveUninitialized: false,
  })
);

// Set up body parsing middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Set up static file serving
app.use(express.static(path.join(__dirname, 'public')));

// Set up view engine
app.engine(
  'handlebars',
  exphbs({
    defaultLayout: 'main',
    layoutsDir: path.join(__dirname, 'views/layouts'),
    partialsDir: path.join(__dirname, 'views/partials'),
    runtimeOptions: {
      allowProtoPropertiesByDefault: true,
    },
    helpers: {
      formatDate: helpers.formatDate, 
    },
  })
);
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

// Authentication middleware
const authenticateUser = async (req, res, next) => {
  if (req.session.userId) {
    try {
      const user = await User.findByPk(req.session.userId);
      if (user) {
        req.currentUser = user;
        res.locals.logged_in = true;
        next();
      } else {
        res.redirect('/auth/signin');
      }
    } catch (err) {
      console.error(err);
      res.redirect('/auth/signin');
    }
  } else {
    res.redirect('/auth/signin');
  }
};

// Define routes with authentication middleware
app.use('/', (req, res, next) => {
  res.locals.logged_in = req.session.userId ? true : false;
  next();
}, homeRoutes);
app.use('/dashboard', withAuth, authenticateUser, (req, res, next) => {
  res.locals.logged_in = true;
  next();
}, dashboardRoutes);
app.use('/auth', (req, res, next) => {
  res.locals.logged_in = req.session.userId ? true : false;
  next();
}, authRoutes);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
