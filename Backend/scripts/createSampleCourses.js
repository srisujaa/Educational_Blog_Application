const mongoose = require('mongoose');
const Course = require('../models/Course');
require('dotenv').config();

const sampleCourses = [
    {
        title: "Web Design BootCamp-2022 for Beginners",
        description: "Learn web design from scratch with this comprehensive bootcamp",
        instructor: "John Doe",
        price: 0,
        lessons: [
            {
                title: "Introduction to HTML",
                content: "Learn the basics of HTML",
                videoUrl: "https://example.com/video1"
            },
            {
                title: "CSS Fundamentals",
                content: "Master CSS styling",
                videoUrl: "https://example.com/video2"
            }
        ]
    },
    {
        title: "Professional Graphics Design",
        description: "Master Photoshop, Adobe XD, and Figma",
        instructor: "Jane Smith",
        price: 0,
        lessons: [
            {
                title: "Photoshop Basics",
                content: "Introduction to Photoshop tools",
                videoUrl: "https://example.com/video3"
            },
            {
                title: "UI Design Principles",
                content: "Learn essential UI design concepts",
                videoUrl: "https://example.com/video4"
            }
        ]
    }
];

async function createSampleCourses() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        // Clear existing courses
        await Course.deleteMany({});
        console.log('Cleared existing courses');

        // Create new courses
        const courses = await Course.insertMany(sampleCourses);
        console.log('Created sample courses:', courses);

        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

createSampleCourses(); 