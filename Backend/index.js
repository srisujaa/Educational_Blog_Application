const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const User = require("./Models/User");
const Blog = require("./Models/Blog");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Course = require("./Models/Course");
const learningPathRoutes = require("./routes/learningPath");

const app = express();
const PORT = process.env.PORT || 5003;

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadsDir);
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

app.use(express.json());
app.use(cors());
app.use('/uploads', express.static(uploadsDir));

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/education_website', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("MongoDB Connected Successfully");
}).catch(err => {
    console.error("MongoDB Connection Error:", err);
    process.exit(1);
});

// Add error handler for MongoDB connection
mongoose.connection.on('error', (err) => {
    console.error('MongoDB connection error:', err);
});

mongoose.connection.on('disconnected', () => {
    console.log('MongoDB disconnected');
});

// Ensure all MongoDB models are loaded before starting the server
const models = { User, Blog, Course };
console.log('Loaded models:', Object.keys(models));

app.post("/signup", async (req, res) => {
    try {
        console.log('Received signup request body:', req.body);
        const { name, email, password } = req.body;

        // Validate input
        if (!name || !email || !password) {
            console.log('Missing required fields:', { 
                hasName: !!name, 
                hasEmail: !!email, 
                hasPassword: !!password 
            });
            return res.status(400).json({ 
                message: "All fields are required",
                details: {
                    name: !name ? "Name is required" : null,
                    email: !email ? "Email is required" : null,
                    password: !password ? "Password is required" : null
                }
            });
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: "Invalid email format" });
        }

        // Validate password length
        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters long" });
        }

        // Check if user already exists
        console.log('Checking if user exists:', email);
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            console.log('User already exists:', email);
            return res.status(400).json({ message: "User already exists" });
        }

        // Hash password and create user
        console.log('Creating new user:', { name, email });
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ name, email, password: hashedPassword });
        
        console.log('Saving user to database...');
        await newUser.save();
        console.log('User saved successfully:', { id: newUser._id, email });

        // Return success with user data
        res.status(201).json({ 
            message: "User registered successfully",
            user: {
                _id: newUser._id,
                name: newUser.name,
                email: newUser.email
            }
        });
    } catch (error) {
        console.error('Signup error:', error);
        if (error.name === 'ValidationError') {
            return res.status(400).json({ 
                message: "Validation error",
                details: Object.values(error.errors).map(err => err.message)
            });
        }
        res.status(500).json({ 
            message: "Internal Server Error",
            error: error.message 
        });
    }
});

app.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        
        if (!user) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET || 'your_jwt_secret_key',
            { expiresIn: '24h' }
        );

        res.status(200).json({
            message: "Login successful",
            token,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// Get all users
app.get("/users", async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// Get a specific user
app.get("/users/:id", async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        if (!user) return res.status(404).json({ message: "User not found" });
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// Update a user
app.put("/users/:id", async (req, res) => {
    try {
        const { name, email } = req.body;
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: "User not found" });

        // Update user fields
        if (name) user.name = name;
        if (email) user.email = email;

        await user.save();
        res.status(200).json({ message: "User updated successfully" });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// Delete a user
app.delete("/users/:id", async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) return res.status(404).json({ message: "User not found" });
        res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// Blog Routes
app.post('/blogs', upload.single('image'), async (req, res) => {
    try {
        console.log('Received blog creation request:', req.body); // Debug log
        const { title, category, content, author, published } = req.body;
        // Store only the relative path for the image
        const image = req.file ? path.join('uploads', path.basename(req.file.path)) : '';
        
        console.log('Parsed data:', { title, category, content, author, published, image }); // Debug log

        if (!title || !category || !content || !author) {
            console.log('Missing required fields:', { title, category, content, author }); // Debug log
            return res.status(400).json({ 
                message: "Missing required fields",
                details: {
                    title: !title ? "Title is required" : null,
                    category: !category ? "Category is required" : null,
                    content: !content ? "Content is required" : null,
                    author: !author ? "Author is required" : null
                }
            });
        }

        const blog = new Blog({
            title,
            category,
            content,
            image,
            author,
            published: published === 'true' || published === true
        });

        console.log('Creating blog with data:', blog); // Debug log
        await blog.save();
        console.log('Blog created successfully:', blog); // Debug log
        res.status(201).json(blog);
    } catch (error) {
        console.error('Error creating blog:', error);
        res.status(500).json({ 
            message: "Error creating blog",
            error: error.message,
            stack: error.stack
        });
    }
});

app.get('/blogs', async (req, res) => {
    try {
        console.log('Fetching all blogs');
        const blogs = await Blog.find().populate('author', 'name');
        console.log('Blogs found:', blogs);
        
        if (!blogs || !Array.isArray(blogs)) {
            console.error('Invalid blogs data:', blogs);
            return res.status(500).json({ message: "Invalid blogs data format" });
        }
        
        // Process image paths for consistency (more robust - prevent double uploads/)
        const processedBlogs = blogs.map(blog => {
            const blogObj = blog.toObject();
            console.log('Original blog image path (Backend/GET /blogs):', blogObj.image); // DEBUG
            if (blogObj.image) {
                // Extract filename using regex to handle various path separators
                const filename = blogObj.image.split(/[\\/]/).pop();
                // Only prepend 'uploads/' if it's not already there
                blogObj.image = filename.startsWith('uploads/') ? filename : `uploads/${filename}`;
            }
            console.log('Processed blog image path (Backend/GET /blogs):', blogObj.image); // DEBUG
            return blogObj;
        });

        res.status(200).json(processedBlogs);
    } catch (error) {
        console.error('Error fetching blogs:', error);
        res.status(500).json({ 
            message: "Error fetching blogs",
            error: error.message,
            stack: error.stack
        });
    }
});

app.get('/blogs/:id', async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id).populate('author', 'name');
        if (!blog) return res.status(404).json({ message: "Blog not found" });
        
        // Process image path for consistency (more robust - prevent double uploads/)
        const blogObj = blog.toObject();
        console.log('Original blog image path (Backend/GET /blogs/:id):', blogObj.image); // DEBUG
        if (blogObj.image) {
            // Extract filename using regex to handle various path separators
            const filename = blogObj.image.split(/[\\/]/).pop();
            // Only prepend 'uploads/' if it's not already there
            blogObj.image = filename.startsWith('uploads/') ? filename : `uploads/${filename}`;
        }
        console.log('Processed blog image path (Backend/GET /blogs/:id):', blogObj.image); // DEBUG
        res.status(200).json(blogObj);
    } catch (error) {
        res.status(500).json({ message: "Error fetching blog" });
    }
});

app.put('/blogs/:id', upload.single('image'), async (req, res) => {
    try {
        const { title, category, content, published } = req.body;
        const updateData = { title, category, content, published };
        // Store only the relative path for the image
        if (req.file) {
            updateData.image = path.join('uploads', path.basename(req.file.path));
        }

        const blog = await Blog.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true }
        );

        if (!blog) return res.status(404).json({ message: "Blog not found" });
        res.status(200).json(blog);
    } catch (error) {
        res.status(500).json({ message: "Error updating blog" });
    }
});

app.delete('/blogs/:id', async (req, res) => {
    try {
        const blog = await Blog.findByIdAndDelete(req.params.id);
        if (!blog) return res.status(404).json({ message: "Blog not found" });
        res.status(200).json({ message: "Blog deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting blog" });
    }
});

// Course Routes
// Get all courses
app.get("/courses", async (req, res) => {
    try {
        const courses = await Course.find().populate('enrolledStudents', 'name email');
        res.status(200).json(courses);
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// Get a specific course
app.get("/courses/:id", async (req, res) => {
    try {
        const course = await Course.findById(req.params.id).populate('enrolledStudents', 'name email');
        if (!course) return res.status(404).json({ message: "Course not found" });
        res.status(200).json(course);
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// Enroll in a course
app.post("/courses/:courseId/enroll", async (req, res) => {
    try {
        const { userId } = req.body;
        const course = await Course.findById(req.params.courseId);
        
        if (!course) {
            return res.status(404).json({ message: "Course not found" });
        }

        // Check if user is already enrolled
        if (course.enrolledStudents.includes(userId)) {
            return res.status(400).json({ message: "User is already enrolled in this course" });
        }

        // Add user to enrolled students
        course.enrolledStudents.push(userId);
        await course.save();

        res.status(200).json({ 
            message: "Successfully enrolled in course",
            course: course
        });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// Get user's enrolled courses
app.get("/users/:userId/courses", async (req, res) => {
    try {
        const courses = await Course.find({ enrolledStudents: req.params.userId });
        res.status(200).json(courses);
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// Create sample courses
app.post("/courses/sample", async (req, res) => {
    try {
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

        // Clear existing courses
        await Course.deleteMany({});
        
        // Create new courses
        const courses = await Course.insertMany(sampleCourses);
        res.status(201).json(courses);
    } catch (error) {
        console.error('Error creating sample courses:', error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// Create a new course with image
app.post("/courses", upload.single('image'), async (req, res) => {
    try {
        const { title, description, instructor, price, lessons } = req.body;
        const image = req.file ? req.file.path : '';

        const course = new Course({
            title,
            description,
            instructor,
            price,
            image,
            lessons: JSON.parse(lessons || '[]')
        });

        await course.save();
        res.status(201).json(course);
    } catch (error) {
        res.status(500).json({ message: "Error creating course" });
    }
});

// Update a course with image
app.put("/courses/:id", upload.single('image'), async (req, res) => {
    try {
        const { title, description, instructor, price, lessons } = req.body;
        const updateData = { title, description, instructor, price };

        if (req.file) {
            updateData.image = req.file.path;
        }

        if (lessons) {
            updateData.lessons = JSON.parse(lessons);
        }

        const course = await Course.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true }
        );

        if (!course) return res.status(404).json({ message: "Course not found" });
        res.status(200).json(course);
    } catch (error) {
        res.status(500).json({ message: "Error updating course" });
    }
});

// Routes
app.use('/api/learning-path', learningPathRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: "Something broke!" });
});

// Start the server with error handling
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`MongoDB URI: ${process.env.MONGO_URI || 'mongodb://localhost:27017/education_website'}`);
}).on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.error(`Port ${PORT} is already in use. Trying port ${PORT + 1}`);
        app.listen(PORT + 1, () => {
            console.log(`Server running on port ${PORT + 1}`);
        });
    } else {
        console.error('Server error:', err);
    }
});
