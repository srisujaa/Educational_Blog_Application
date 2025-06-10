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
const auth = require('./middleware/auth'); // Import auth middleware
const adminAuth = require('./middleware/adminAuth'); // Import adminAuth middleware

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
        
        // Set role as admin for specific email
        const role = email === 'admin@edublog.com' ? 'admin' : 'user';
        
        const newUser = new User({ 
            name, 
            email, 
            password: hashedPassword,
            role 
        });
        
        console.log('Saving user to database...');
        await newUser.save();
        console.log('User saved successfully:', { id: newUser._id, email, role });

        // Return success with user data
        res.status(201).json({ 
            message: "User registered successfully",
            user: {
                _id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                role: newUser.role
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
                email: user.email,
                role: user.role // Include role in login response
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// Admin-only user management routes
app.get("/users", auth, adminAuth, async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
});

app.get("/users/:id", auth, adminAuth, async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        if (!user) return res.status(404).json({ message: "User not found" });
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
});

app.put("/users/:id", auth, adminAuth, async (req, res) => {
    try {
        const { name, email, role } = req.body;
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: "User not found" });

        user.name = name || user.name;
        user.email = email || user.email;
        // Only allow admin to change role
        if (req.user.role === 'admin' && role) {
            user.role = role;
        }

        await user.save();
        res.status(200).json({
            message: "User updated successfully",
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        console.error('User update error:', error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

app.delete("/users/:id", auth, adminAuth, async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) return res.status(404).json({ message: "User not found" });
        res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// Blog Routes
app.post('/blogs', auth, upload.single('image'), async (req, res) => {
    try {
        console.log('Received blog creation request:', req.body); // Debug log
        const { title, category, content, status } = req.body; // Include status in destructuring
        // Store only the relative path for the image
        const image = req.file ? path.join('uploads', path.basename(req.file.path)) : '';
        
        // Determine 'published' boolean based on 'status' field
        const isPublished = status === 'published';

        console.log('Parsed data for new blog:', { title, category, content, author: req.user._id, published: isPublished, status, image }); // Debug log

        if (!title || !category || !content) {
            console.log('Missing required fields:', { title, category, content }); // Debug log
            return res.status(400).json({ 
                message: "Missing required fields",
                details: {
                    title: !title ? "Title is required" : null,
                    category: !category ? "Category is required" : null,
                    content: !content ? "Content is required" : null,
                }
            });
        }

        const blog = new Blog({
            title,
            category,
            content,
            image,
            author: req.user._id, // Set author from authenticated user
            published: isPublished, // Set published based on status
            status: status // Use the status directly from req.body
        });

        console.log('Blog object before saving (POST):', blog); // Added debug log
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

app.get('/blogs', auth, async (req, res) => {
    try {
        console.log('GET /blogs request received.');
        console.log('Authenticated user for /blogs:', req.user ? { _id: req.user._id, role: req.user.role } : 'Not authenticated');

        let query = {};
        if (req.user && req.user.role === 'admin') {
            query = {}; // Admin can see all blogs (published and draft)
            console.log('Admin is fetching all blogs.');
        } else if (req.user) {
            // Authenticated non-admin user sees their own blogs (draft or published) AND all other published blogs
            query = {
                $or: [
                    { status: 'published' },
                    { author: req.user._id }
                ]
            };
            console.log('Authenticated user is fetching their own blogs and all published blogs.');
        } else {
            // Guest user only sees published blogs
            query = { status: 'published' };
            console.log('Guest is fetching only published blogs.');
        }

        console.log('Final query used for /blogs:', query);

        const blogs = await Blog.find(query).populate('author', 'name');
        console.log(`Blogs found (after query): ${blogs.length}`);
        console.log('First 3 blogs fetched (for inspection):', blogs.slice(0, 3).map(b => ({ title: b.title, status: b.status, published: b.published })));
        
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

app.get('/blogs/:id', auth, async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id).populate('author', 'name');
        if (!blog) return res.status(404).json({ message: "Blog not found" });
        
        // If blog is a draft, deny access unless user is admin OR author
        if (blog.status === 'draft') {
            // Check if user is authenticated and is either an admin or the author of the blog
            const isAuthorized = req.user && (
                req.user.role === 'admin' ||
                (blog.author && blog.author._id.toString() === req.user._id.toString())
            );

            if (!isAuthorized) {
                return res.status(403).json({ message: 'Access denied. Blog is a draft and you are not authorized.' });
            }
        }

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

app.put('/blogs/:id', auth, upload.single('image'), async (req, res) => {
    try {
        const { title, category, content, status } = req.body; // Include status in destructuring
        const updateData = { title, category, content, status }; // Include status
        // Store only the relative path for the image
        if (req.file) {
            updateData.image = path.join('uploads', path.basename(req.file.path));
        }

        const blog = await Blog.findById(req.params.id);
        if (!blog) return res.status(404).json({ message: "Blog not found" });

        // Check if user is admin OR author of the blog
        if (req.user.role !== 'admin' && blog.author._id.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Access denied. You are not authorized to update this blog.' });
        }

        // Update blog fields
        blog.title = title || blog.title;
        blog.category = category || blog.category;
        blog.content = content || blog.content;
        if (req.file) {
            blog.image = updateData.image;
        }
        // Update status and published based on new values
        blog.status = status || blog.status;
        blog.published = (status === 'published'); // Derive published from status

        console.log('Blog object before saving (PUT):', blog); // Added debug log
        await blog.save();
        res.status(200).json(blog);
    } catch (error) {
        console.error('Error updating blog:', error);
        res.status(500).json({ message: "Error updating blog" });
    }
});

app.delete('/blogs/:id', auth, async (req, res) => {
    try {
        console.log('DELETE /blogs/:id request received.');
        console.log('User attempting delete:', req.user ? { _id: req.user._id, role: req.user.role } : 'Not authenticated');
        
        const blog = await Blog.findById(req.params.id);
        if (!blog) {
            console.log('Blog not found for deletion:', req.params.id);
            return res.status(404).json({ message: "Blog not found" });
        }

        console.log('Blog author ID:', blog.author._id.toString()); // Log the actual ID
        console.log('Is user admin?', req.user && req.user.role === 'admin');
        console.log('Does user own blog?', req.user && blog.author._id.toString() === req.user._id.toString()); // Corrected comparison

        // Check if user is admin OR author of the blog
        if (req.user.role !== 'admin' && blog.author._id.toString() !== req.user._id.toString()) {
            console.log('Access denied for blog deletion.');
            return res.status(403).json({ message: 'Access denied. You are not authorized to delete this blog.' });
        }

        await Blog.deleteOne({ _id: req.params.id }); // Using deleteOne for Mongoose 6+
        console.log('Blog deleted successfully:', req.params.id);
        res.status(200).json({ message: "Blog deleted successfully" });
    } catch (error) {
        console.error('Error deleting blog:', error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// Course Routes
app.get("/courses", async (req, res) => {
    try {
        const courses = await Course.find().populate('enrolledStudents', 'name email');
        res.status(200).json(courses);
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
});

app.get("/courses/:id", async (req, res) => {
    try {
        const course = await Course.findById(req.params.id).populate('enrolledStudents', 'name email');
        if (!course) return res.status(404).json({ message: "Course not found" });
        res.status(200).json(course);
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
});

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

app.get("/users/:userId/courses", async (req, res) => {
    try {
        const courses = await Course.find({ enrolledStudents: req.params.userId });
        res.status(200).json(courses);
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
});

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
                        title: "Introduction to Graphic Design",
                        content: "Explore the basics of graphic design principles",
                        videoUrl: "https://example.com/video3"
                    },
                    {
                        title: "Photoshop Essentials",
                        content: "Learn fundamental Photoshop tools and techniques",
                        videoUrl: "https://example.com/video4"
                    }
                ]
            }
        ];
        await Course.insertMany(sampleCourses);
        res.status(201).json({ message: 'Sample courses created successfully' });
    } catch (error) {
        console.error('Error creating sample courses:', error);
        res.status(500).json({ message: "Error creating sample courses" });
    }
});

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

app.delete('/courses/:id', async (req, res) => {
    try {
        const course = await Course.findByIdAndDelete(req.params.id);
        if (!course) return res.status(404).json({ message: "Course not found" });
        res.status(200).json({ message: "Course deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
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
