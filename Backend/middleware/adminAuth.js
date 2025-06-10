const jwt = require('jsonwebtoken');
const User = require('../Models/User');

const adminAuth = async (req, res, next) => {
    try {
        // Get token from auth middleware (assuming it ran before this)
        if (!req.user || !req.user._id) {
            return res.status(401).json({ message: 'Not authenticated.' });
        }

        const user = await User.findById(req.user._id);

        if (!user || user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied. Admin rights required.' });
        }

        req.admin = user; // Attach admin user to request
        next();
    } catch (error) {
        console.error('Admin authentication error:', error);
        res.status(500).json({ message: 'Internal server error during admin authentication.' });
    }
};

module.exports = adminAuth; 