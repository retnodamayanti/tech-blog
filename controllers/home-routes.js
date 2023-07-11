const express = require('express');
const router = express.Router();
const { Post, User } = require('../models');


// Home route
router.get('/', async (req, res) => {
  try {
    // Fetch all blog posts including the associated user
    const posts = await Post.findAll({ include: User });

    // Render the homepage template with the fetched blog posts
    res.render('homepage', { posts });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});


module.exports = router;
