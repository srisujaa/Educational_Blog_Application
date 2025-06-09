const Blog = require('../Models/Blog');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

// Get all published blogs with filtering and pagination
exports.getAllBlogs = catchAsync(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const query = { status: 'published' };
    if (req.query.category) {
        query.category = req.query.category;
    }

    const blogs = await Blog.find(query)
        .populate('author', 'name')
        .sort(req.query.sort || '-createdAt')
        .skip(skip)
        .limit(limit);

    const total = await Blog.countDocuments(query);

    res.status(200).json({
        status: 'success',
        results: blogs.length,
        total,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
        data: blogs
    });
});

// Get single blog by ID
exports.getBlog = catchAsync(async (req, res, next) => {
    const blog = await Blog.findById(req.params.id)
        .populate('author', 'name')
        .populate('comments.user', 'name');

    if (!blog) {
        return next(new AppError('Blog not found', 404));
    }

    // Increment views
    blog.views += 1;
    await blog.save();

    res.status(200).json({
        status: 'success',
        data: blog
    });
});

// Create new blog
exports.createBlog = catchAsync(async (req, res) => {
    const blog = await Blog.create({
        ...req.body,
        author: req.user._id
    });

    res.status(201).json({
        status: 'success',
        data: blog
    });
});

// Update blog
exports.updateBlog = catchAsync(async (req, res, next) => {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
        return next(new AppError('Blog not found', 404));
    }

    // Check if user is author or admin
    if (blog.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
        return next(new AppError('You are not authorized to update this blog', 403));
    }

    Object.assign(blog, req.body);
    await blog.save();

    res.status(200).json({
        status: 'success',
        data: blog
    });
});

// Delete blog
exports.deleteBlog = catchAsync(async (req, res, next) => {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
        return next(new AppError('Blog not found', 404));
    }

    // Check if user is author or admin
    if (blog.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
        return next(new AppError('You are not authorized to delete this blog', 403));
    }

    await blog.remove();

    res.status(204).json({
        status: 'success',
        data: null
    });
});

// Search blogs
exports.searchBlogs = catchAsync(async (req, res) => {
    const { query } = req.query;
    const blogs = await Blog.find(
        { 
            $text: { $search: query },
            status: 'published'
        },
        { score: { $meta: 'textScore' } }
    )
    .sort({ score: { $meta: 'textScore' } })
    .populate('author', 'name');

    res.status(200).json({
        status: 'success',
        results: blogs.length,
        data: blogs
    });
});

// Like/Unlike blog
exports.toggleLike = catchAsync(async (req, res, next) => {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
        return next(new AppError('Blog not found', 404));
    }

    const isLiked = blog.isLikedByUser(req.user._id);
    
    if (isLiked) {
        blog.likes = blog.likes.filter(id => id.toString() !== req.user._id.toString());
    } else {
        blog.likes.push(req.user._id);
    }

    await blog.save();

    res.status(200).json({
        status: 'success',
        data: blog
    });
});

// Add comment
exports.addComment = catchAsync(async (req, res, next) => {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
        return next(new AppError('Blog not found', 404));
    }

    blog.comments.push({
        user: req.user._id,
        text: req.body.text
    });

    await blog.save();

    res.status(201).json({
        status: 'success',
        data: blog
    });
});

// Get popular blogs
exports.getPopularBlogs = catchAsync(async (req, res) => {
    const blogs = await Blog.getPopularBlogs(5);

    res.status(200).json({
        status: 'success',
        results: blogs.length,
        data: blogs
    });
}); 