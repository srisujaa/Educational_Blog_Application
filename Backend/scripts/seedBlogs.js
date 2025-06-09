const mongoose = require('mongoose');
const Blog = require('../Models/Blog');

const sampleBlogs = [
    {
        title: "Introduction to Programming",
        category: "Programming",
        content: `Programming is the process of creating a set of instructions that tell a computer how to perform a task. Programming can be done using many programming languages. Here are some key concepts:

        Variables: A variable is a container for storing data values.
        Functions: A function is a block of organized, reusable code that performs a specific task.
        Objects: An object is a container for properties and methods.
        
        This article will help beginners understand the basics of programming and get started with coding.`,
        author: "System",
        published: true
    },
    {
        title: "Web Development Fundamentals",
        category: "Web Development",
        content: `Web development involves building and maintaining websites. It includes aspects such as web design, web publishing, web programming, and database management. Here are the core technologies:

        HTML: The standard markup language for creating web pages.
        CSS: The language for styling web pages.
        JavaScript: The programming language for making web pages interactive.
        
        Understanding these fundamentals is crucial for becoming a web developer.`,
        author: "System",
        published: true
    },
    {
        title: "Introduction to Machine Learning",
        category: "Machine Learning",
        content: `Machine Learning is a subset of artificial intelligence that focuses on building applications that learn from data and improve their accuracy over time without being explicitly programmed to do so.

        Key concepts include:
        - Algorithms: Mathematical formulas that process data
        - Training Data: Data used to teach the model
        - Model: The output of the machine learning algorithm
        
        This field combines computer science and statistics to create predictive models.`,
        author: "System",
        published: true
    },
    {
        title: "Data Science Basics",
        category: "Data Science",
        content: `Data Science combines multiple fields, including statistics, scientific methods, and data analysis, to extract value from data.

        The data science process includes:
        1. Data collection and storage
        2. Data cleaning and processing
        3. Data analysis and visualization
        4. Building predictive models
        
        This field is essential for making data-driven decisions in business.`,
        author: "System",
        published: true
    }
];

const seedBlogs = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect('mongodb://localhost:27017/educational-website', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('Connected to MongoDB');

        // Clear existing blogs
        await Blog.deleteMany({});
        console.log('Cleared existing blogs');

        // Insert sample blogs
        const createdBlogs = await Blog.insertMany(sampleBlogs);
        console.log('Created sample blogs:', createdBlogs);

        console.log('Database seeded successfully');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
};

seedBlogs(); 