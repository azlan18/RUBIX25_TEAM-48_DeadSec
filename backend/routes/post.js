const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const authMiddleware = require('../middleware/auth');
const cloudinary = require('cloudinary').v2;
const fileUpload = require('express-fileupload');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Add fileUpload middleware
router.use(fileUpload({
  useTempFiles: true,
  tempFileDir: '/tmp/'
}));

// Get all posts
router.get('/', async (req, res) => {
  try {
    const posts = await Post.find()
      .populate('creator', 'username')
      .populate('comments.user', 'username')
      .sort('-createdAt');

    const transformedPosts = posts.map(post => ({
      id: post._id,
      title: post.title,
      content: post.content,
      image_url: post.image_url,
      created_at: post.createdAt,
      profiles: {
        username: post.creator.username
      },
      likes_count: post.likes.length,
      comments_count: post.comments.length
    }));

    res.json(transformedPosts);
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({ message: error.message });
  }
});

// Get single post
router.get('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('creator', 'username')
      .populate('comments.user', 'username');

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Transform data to match frontend expectations
    const transformedPost = {
      id: post._id,
      title: post.title,
      content: post.content,
      image_url: post.image_url,
      created_at: post.createdAt,
      profiles: {
        username: post.creator.username
      },
      comments: post.comments.map(comment => ({
        id: comment._id,
        content: comment.content,
        created_at: comment.createdAt,
        profiles: {
          username: comment.user.username
        }
      }))
    };

    res.json(transformedPost);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create post
router.post('/', authMiddleware, async (req, res) => {
  try {
    console.log('Request body:', req.body);
    console.log('Request files:', req.files);

    if (!req.files || !req.files.image) {
      return res.status(400).json({ message: 'No image file uploaded' });
    }

    const result = await cloudinary.uploader.upload(req.files.image.tempFilePath, {
      folder: 'blog-posts'
    });

    const post = new Post({
      title: req.body.title,
      content: req.body.content,
      image_url: result.secure_url,
      creator: req.user.id
    });

    await post.save();
    res.status(201).json(post);
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).json({ message: error.message });
  }
});

// Add comment
router.post('/:id/comments', authMiddleware, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const newComment = {
      user: req.user.id,
      content: req.body.content,
      createdAt: new Date()
    };

    post.comments.push(newComment);
    await post.save();
    
    // Populate the user information
    await post.populate('comments.user', 'username');
    
    const addedComment = post.comments[post.comments.length - 1];
    
    // Transform the comment to match frontend expectations
    const transformedComment = {
      id: addedComment._id,
      content: addedComment.content,
      created_at: addedComment.createdAt,
      profiles: {
        username: addedComment.user.username
      }
    };

    res.json(transformedComment);
  } catch (error) {
    console.error('Error adding comment:', error);
    res.status(500).json({ message: error.message });
  }
});

// Toggle like
router.post('/:id/like', authMiddleware, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const likeIndex = post.likes.indexOf(req.user.id);
    if (likeIndex === -1) {
      post.likes.push(req.user.id);
    } else {
      post.likes.splice(likeIndex, 1);
    }

    await post.save();
    res.json({ likes: post.likes.length });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
