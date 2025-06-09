const express = require('express');
const router = express.Router();
const Blog = require('../Models/Blog');

// Generate learning path based on user preferences
router.post('/generate', async (req, res) => {
    try {
        const { selectedTopics, userLevel, timeCommitment } = req.body;
        
        // Add debug logging
        console.log('Received request:', { selectedTopics, userLevel, timeCommitment });
        
        // Get all blogs that match the selected topics
        const blogs = await Blog.find({
            $or: [
                { category: { $in: selectedTopics } },
                { tags: { $in: selectedTopics } }
            ]
        }).populate('author', 'name photo');

        console.log('Found blogs:', blogs.length);

        if (!blogs || blogs.length === 0) {
            return res.status(200).json({
                success: true,
                learningPath: [],
                message: "No blogs found matching the selected topics"
            });
        }

        // Calculate complexity scores for blogs
        const blogsWithComplexity = blogs.map(blog => {
            const technicalTerms = ['algorithm', 'function', 'variable', 'class', 'object', 'api', 'database', 'code', 'programming', 'development'];
            const content = blog.content.toLowerCase();
            const termCount = technicalTerms.reduce((count, term) => 
                count + (content.match(new RegExp(term, 'g')) || []).length, 0
            );
            const complexity = termCount + (blog.content.length / 1000);
            
            return {
                ...blog.toObject(),
                complexity
            };
        });

        console.log('Calculated complexity for blogs');

        // Sort blogs based on user level
        let sortedBlogs;
        if (userLevel === 'beginner') {
            sortedBlogs = blogsWithComplexity.sort((a, b) => a.complexity - b.complexity);
        } else if (userLevel === 'advanced') {
            sortedBlogs = blogsWithComplexity.sort((a, b) => b.complexity - a.complexity);
        } else {
            sortedBlogs = blogsWithComplexity;
        }

        // Calculate time estimates and create learning path
        const timeEstimates = {
            short: 2,
            medium: 4,
            long: 6
        };

        const targetHours = timeEstimates[timeCommitment];
        let currentHours = 0;
        const learningPath = [];

        for (const blog of sortedBlogs) {
            const wordsPerMinute = 200;
            const wordCount = blog.content.split(/\s+/).length;
            const estimatedTime = wordCount / wordsPerMinute / 60; // Convert to hours

            if (currentHours + estimatedTime <= targetHours) {
                learningPath.push({
                    ...blog,
                    estimatedTime,
                    order: learningPath.length + 1
                });
                currentHours += estimatedTime;
            }
        }

        console.log('Generated learning path with', learningPath.length, 'items');

        res.json({
            success: true,
            learningPath,
            totalTime: currentHours,
            targetTime: targetHours
        });

    } catch (error) {
        console.error('Error generating learning path:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to generate learning path',
            error: error.message
        });
    }
});

module.exports = router; 