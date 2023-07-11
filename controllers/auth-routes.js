const express = require('express');
const router = express.Router();
const { User } = require('../models');
const bcrypt = require('bcrypt');

// Sign up route
router.get('/signup', (req, res) => {
  res.render('signup'); // Render the sign-up form template
});

// Create user route
router.post('/signup', async (req, res) => {
  try {
    // Retrieve user data from req.body
    const { username, password } = req.body;

    // Check if the user already exists
    const existingUser = await User.findOne({ where: { username } });
    if (existingUser) {
      // User already exists, display an error message
      return res.render('signup', { error: 'Username already taken' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user in the database
    const user = await User.create({
      username,
      password: hashedPassword,
    });

    // Log in the user by setting the user ID in the session
    req.session.userId = user.id;

    // Redirect to the dashboard or user profile page
    res.redirect('/dashboard');
  } catch (error) {
    // Handle error and display an error message
    console.error('Error creating user:', error);
    res.render('signup', { error: 'Error creating user' });
  }
});


// Sign in route
router.get('/signin', (req, res) => {
  res.render('signin'); // Render the sign-in form template
});

// Authenticate user route
router.post('/signin', async (req, res) => {
  try {
    // Retrieve user credentials from req.body
    const { username, password } = req.body;

    // Find the user in the database
    const user = await User.findOne({ where: { username } });

    if (user) {
      // Compare the provided password with the stored hashed password
      const match = await bcrypt.compare(password, user.password);

      if (match) {
        // Set the user ID in the session to indicate successful authentication
        req.session.userId = user.id;

        // Redirect to the dashboard or user profile page
        res.redirect('/dashboard');
      } else {
        // Password does not match, display an error message
        res.render('signin', { error: 'Invalid username or password' });
      }
    } else {
      // User not found, display an error message
      res.render('signin', { error: 'Invalid username or password' });
    }
  } catch (error) {
    // Handle error and display an error message
    console.error('Error authenticating user:', error);
    res.render('signin', { error: 'Error authenticating user' });
  }
});


// Logout route
router.get('/logout', (req, res) => {
  // Clear the user ID from the session to log out the user
  req.session.userId = null;

  // Redirect to the homepage or login page after logging out
  res.redirect('/');
});

module.exports = router;
