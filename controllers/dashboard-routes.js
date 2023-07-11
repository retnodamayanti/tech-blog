const express = require('express');
const router = express.Router();

const { Post, User } = require('../models');

// Dashboard route
router.get('/', async (req, res) => {
  try {
    // Fetch the user's blog posts
    const userId = req.session.userId;
    const posts = await Post.findAll({ where: { user_id: userId } });

    // Render the dashboard template with the fetched blog posts
    res.render('dashboard', { posts });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

// View single blog post route
router.get('/post/:id', async (req, res) => {
  try {
    const postId = req.params.id;

    // Find the blog post by ID, include the associated user model
    const post = await Post.findByPk(postId, { include: User });

    if (post) {
      res.render('singlePost', { post });
    } else {
      res.status(404).json({ message: 'Post not found' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

// New blog post route
router.get('/new', (req, res) => {
  res.render('newBlogPost');
});

// Create blog post route
router.post('/', async (req, res) => {
  try {
    // Create a new blog post using the form data
    const { title, content } = req.body;
    const userId = req.session.userId;
    await Post.create({ title, content, userId });

    // Redirect to the dashboard
    res.redirect('/dashboard');
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Edit blog post route
router.get('/:id/edit', async (req, res) => {
  try {
    const postId = req.params.id;

    // Fetch the blog post by ID
    const post = await Post.findByPk(postId);

    // Render the edit blog post form template with the fetched blog post
    res.render('editBlogPost', { post });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Update blog post route
router.put('/:id', async (req, res) => {
  try {
    const postId = req.params.id;

    // Update the blog post by ID with the form data
    const { title, content } = req.body;
    await Post.update({ title, content }, { where: { id: postId } });

    // Redirect to the dashboard
    res.redirect('/dashboard');
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Delete blog post route
router.delete('/:id', async (req, res) => {
  try {
    const postId = req.params.id;

    // Delete the blog post by ID
    await Post.destroy({ where: { id: postId } });

    // Redirect to the dashboard
    res.redirect('/dashboard');
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Create comment route
router.post('/post/:id/comment', async (req, res) => {
  try {
    const postId = req.params.id;
    const { content } = req.body;
    
    // Create a new comment associated with the blog post and the logged-in user
    const comment = await Comment.create({
      content,
      postId,
      userId: req.session.userId
    });
    
    // Redirect back to the single post view
    res.redirect(`/dashboard/post/${postId}`);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});


module.exports = router;
