const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../Models/User');
const bcrypt = require('bcryptjs');

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

// Function to create a sample user
const createSampleUser = async () => {
    try {
        // Check if a user already exists
        const existingUser = await User.findOne({ email: 'admin@example.com' });
        
        if (existingUser) {
            console.log('Sample user already exists');
            process.exit(0);
        }
        
        // Create a new user
        const hashedPassword = await bcrypt.hash('password123', 10);
        const user = new User({
            name: 'Admin User',
            email: 'admin@example.com',
            password: hashedPassword,
            role: 'admin'
        });
        
        await user.save();
        console.log('Created sample user:', user.email);
        process.exit(0);
    } catch (error) {
        console.error('Error creating sample user:', error);
        process.exit(1);
    }
};

// Run the function
createSampleUser(); 