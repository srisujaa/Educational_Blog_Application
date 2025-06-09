const express = require('express');
const blogController = require('../Controllers/blogController');
const authController = require('../Controllers/authController');

const router = express.Router();

// Public routes
router.get('/', blogController.getAllBlogs);
router.get('/popular', blogController.getPopularBlogs);
router.get('/search', blogController.searchBlogs);
router.get('/:id', blogController.getBlog);

// Protected routes
router.use(authController.protect);

router.post('/', blogController.createBlog);
router.patch('/:id', blogController.updateBlog);
router.delete('/:id', blogController.deleteBlog);
router.post('/:id/like', blogController.toggleLike);
router.post('/:id/comments', blogController.addComment);

module.exports = router; 