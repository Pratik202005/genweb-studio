const User = require('../models/userModel'); 
const Project = require('../models/projectModel');

exports.getMyData = async (req, res) => {
    try {
        const userId = req.user?._id || req.user?.id || req.session?.user?._id || req.query?.userId;
        if (!userId) {
            return res.status(200).json(null);
        }

        const user = await User.findById(userId).select('-password').populate('projects', 'name visibility');
        if (!user) return res.status(404).json({ message: 'User not found' });
        
        res.status(200).json(user);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

exports.updateMyData = async (req, res) => {
    try {
        const userId = req.user?._id || req.user?.id || req.session?.user?._id || req.body?.userId;
        if (!userId) {
            return res.status(400).json({ message: 'User ID is required' });
        }
        const updates = req.body;

        const user = await User.findByIdAndUpdate(userId, updates, { new: true, runValidators: true });
        if (!user) return res.status(404).json({ message: 'User not found' });

        res.status(200).json(user);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

exports.getMyProjects = async (req, res) => {
    try {
        const userId = req.user?._id || req.user?.id || req.session?.user?._id || req.query?.userId;
        
        if (!userId) {
            return res.status(200).json([]);
        }
       
        const projects = await Project.find({
            $or: [
                { owner: userId },
                { users: userId }
            ]
        }).populate('owner', 'name email').populate('users', 'name email'); 

        res.status(200).json(projects);
    } catch (err) {
        console.error("Error in getMyProjects:", err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

exports.getUserById = async (req, res) => {
    try {
        const { userid } = req.params;
        const user = await User.findById(userid).select('-password').populate('projects', 'name visibility'); 

        if (!user) return res.status(404).json({ message: 'User not found' });

        res.status(200).json(user);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};