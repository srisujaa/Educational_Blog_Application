const mongoose = require("mongoose");
const slugify = require('slugify');

const BlogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'A blog must have a title'],
        trim: true,
        maxlength: [100, 'Title cannot be more than 100 characters']
    },
    slug: String,
    category: {
        type: String,
        required: [true, 'A blog must have a category'],
        enum: ['Technology', 'Education', 'Programming', 'Career', 'Other']
    },
    content: {
        type: String,
        required: [true, 'A blog must have content']
    },
    image: {
        type: String,
        required: false
    },
    published: {
        type: Boolean,
        default: false
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'A blog must have an author']
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
    tags: [{
        type: String,
        trim: true
    }],
    readTime: {
        type: Number,
        default: 0
    },
    status: {
        type: String,
        enum: ['draft', 'published'],
        default: 'draft'
    },
    views: {
        type: Number,
        default: 0
    },
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    comments: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        text: {
            type: String,
            required: true,
            trim: true
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
    }],
    coverImage: String,
    featured: {
        type: Boolean,
        default: false
    }
}, { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } });

// Update the updatedAt timestamp before saving
BlogSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

// Calculate read time before saving (assuming average reading speed of 200 words per minute)
BlogSchema.pre('save', function(next) {
    const wordCount = this.content.split(/\s+/).length;
    this.readTime = Math.ceil(wordCount / 200);
    next();
});

// Create text index for search functionality
BlogSchema.index({ title: 'text', content: 'text' });
BlogSchema.index({ slug: 1 });
BlogSchema.index({ tags: 1 });

// Virtual populate
BlogSchema.virtual('likesCount').get(function() {
    return this.likes.length;
});

BlogSchema.virtual('commentsCount').get(function() {
    return this.comments.length;
});

// Instance method to check if user has liked the blog
BlogSchema.methods.isLikedByUser = function(userId) {
    return this.likes.includes(userId);
};

// Static method to get popular blogs
BlogSchema.statics.getPopularBlogs = function(limit = 5) {
    return this.find({ status: 'published' })
               .sort({ views: -1, likes: -1 })
               .limit(limit)
               .populate('author', 'name');
};

// Query middleware
BlogSchema.pre(/^find/, function(next) {
    this.populate({
        path: 'author',
        select: 'name photo'
    });
    next();
});

module.exports = mongoose.model("Blog", BlogSchema); 