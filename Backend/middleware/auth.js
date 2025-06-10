const jwt = require('jsonwebtoken');
const User = require('../Models/User');

const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        
        if (!token) {
            // If no token, proceed without user authentication
            return next();
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret_key'); // Use secret key directly if process.env.JWT_SECRET is undefined
        const user = await User.findOne({ _id: decoded.userId }); // Ensure it's decoded.userId as per your token creation

        if (!user) {
            // If token is invalid or user not found, proceed without user authentication
            return next();
        }

        // Add user info to request object
        req.token = token;
        req.user = user;
        next();
    } catch (error) {
        // If there's an error verifying the token, just log it and proceed without user authentication
        console.error('Authentication error (token optional):', error.message);
        next();
    }
};

module.exports = auth; 