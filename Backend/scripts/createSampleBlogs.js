const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Blog = require('../Models/Blog');
const User = require('../Models/User');

dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/education_website', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('MongoDB Connected Successfully');
}).catch(err => {
    console.error('MongoDB Connection Error:', err);
    process.exit(1);
});

// Sample blog data
const sampleBlogs = [
    {
        title: "Introduction to Web Development",
        category: "Programming",
        content: "Web development is the process of building websites and web applications. It involves a combination of front-end and back-end technologies. Front-end development focuses on what users see and interact with, using HTML, CSS, and JavaScript. Back-end development handles the server-side logic and database interactions using languages like Node.js, Python, or PHP. This article will guide you through the basics of web development and help you get started on your journey to becoming a web developer.",
        tags: ["Web Development", "Programming", "Beginner"],
        status: "published"
    },
    {
        title: "Getting Started with React",
        category: "Programming",
        content: "React is a JavaScript library for building user interfaces, particularly single-page applications. It's maintained by Facebook and a community of individual developers and companies. React allows you to create reusable UI components and manage the state of your application efficiently. In this tutorial, we'll cover the basics of React, including components, props, state, and hooks. By the end, you'll have a solid understanding of how to build interactive user interfaces with React.",
        tags: ["Web Development", "Programming", "React", "JavaScript"],
        status: "published"
    },
    {
        title: "Understanding Machine Learning Algorithms",
        category: "Technology",
        content: "Machine learning is a subset of artificial intelligence that focuses on developing systems that can learn from and make decisions based on data. This article explores the fundamental machine learning algorithms, including supervised learning, unsupervised learning, and reinforcement learning. We'll discuss how these algorithms work, their applications, and how to choose the right algorithm for your specific problem. Whether you're a beginner or an experienced data scientist, this guide will help you understand the core concepts of machine learning.",
        tags: ["AI", "Machine Learning", "Data Science", "Advanced"],
        status: "published"
    },
    {
        title: "Cybersecurity Fundamentals",
        category: "Technology",
        content: "Cybersecurity is the practice of protecting systems, networks, and programs from digital attacks. These attacks are usually aimed at accessing, changing, or destroying sensitive information, extorting money from users, or interrupting normal business processes. This article covers the fundamental principles of cybersecurity, including threat modeling, risk assessment, and security controls. We'll also discuss common attack vectors and how to defend against them. Whether you're a security professional or just interested in protecting your digital assets, this guide will help you understand the basics of cybersecurity.",
        tags: ["Cybersecurity", "Technology", "Intermediate"],
        status: "published"
    },
    {
        title: "Data Science for Beginners",
        category: "Technology",
        content: "Data science is an interdisciplinary field that uses scientific methods, processes, algorithms, and systems to extract knowledge and insights from structured and unstructured data. This article provides an introduction to data science, covering the key concepts, tools, and techniques used in the field. We'll discuss data collection, cleaning, analysis, visualization, and machine learning. By the end of this article, you'll have a solid understanding of what data science is and how to get started in this exciting field.",
        tags: ["Data Science", "Technology", "Beginner"],
        status: "published"
    },
    {
        title: "Advanced JavaScript Concepts",
        category: "Programming",
        content: "JavaScript is a powerful programming language that is essential for web development. This article covers advanced JavaScript concepts, including closures, prototypes, promises, async/await, and functional programming. We'll explore how these concepts work and how to use them effectively in your code. Whether you're a beginner looking to expand your knowledge or an experienced developer wanting to deepen your understanding, this guide will help you master advanced JavaScript concepts.",
        tags: ["Programming", "JavaScript", "Web Development", "Advanced"],
        status: "published"
    }
];

// Function to create sample blogs
const createSampleBlogs = async () => {
    try {
        // Find a user to use as the author
        const user = await User.findOne();
        
        if (!user) {
            console.error('No user found. Please create a user first.');
            process.exit(1);
        }
        
        // Clear existing blogs
        await Blog.deleteMany({});
        console.log('Cleared existing blogs');
        
        // Create new blogs with the user as the author
        const blogs = await Blog.insertMany(
            sampleBlogs.map(blog => ({
                ...blog,
                author: user._id
            }))
        );
        
        console.log(`Created ${blogs.length} sample blogs`);
        process.exit(0);
    } catch (error) {
        console.error('Error creating sample blogs:', error);
        process.exit(1);
    }
};

// Run the function
createSampleBlogs(); 