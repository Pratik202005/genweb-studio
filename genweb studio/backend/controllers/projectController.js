const User = require('../models/userModel'); 
const Project = require('../models/projectModel');

exports.addProject = async (req, res) => {
    try {
        let { userId, name, description, visibility, projectType, prompt } = req.body;

        // Resolve user ID from request body or session
        let ownerId = userId;
        if (!ownerId && req.session?.user?._id) {
            ownerId = req.session.user._id;
        } else if (!ownerId && req.user?._id) {
            ownerId = req.user._id;
        }

        if (ownerId && typeof ownerId === 'object' && ownerId._id) {
            ownerId = ownerId._id;
        }

        // If no user exists, associate with a default creator account so creation never fails
        if (!ownerId) {
            let defaultUser = await User.findOne({ email: "creator@genweb.studio" });
            if (!defaultUser) {
                defaultUser = await User.create({
                    name: "GenWeb Creator",
                    email: "creator@genweb.studio",
                    imageURL: "https://lh3.googleusercontent.com/a/default-user"
                });
            }
            ownerId = defaultUser._id;
        }

        const project = new Project({
            name: name || "Untitled Project",
            users: [],
            owner: ownerId,
            visibility: (visibility === 'public'),
            description: description || "",
            projectType: (projectType === 'react'),
            chats: []
        });

        await project.save();
        res.status(201).json({
            PID: project._id,
            prompt: prompt
        });
    } catch (error) {
        console.error("addProject Error:", error);
        res.status(500).json({ error: 'Failed to create project: ' + error.message });
    }
};

exports.editProject = async (req, res) => {
    try {
        const { pid } = req.params;
        const updates = req.body;

        const project = await Project.findByIdAndUpdate(pid, updates, { new: true });

        if (!project) {
            return res.status(404).json({ error: 'Project not found' });
        }

        res.status(200).json(project);
    } catch (error) {
        console.error("editProject Error:", error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.deleteProject = async (req, res) => {
    try {
        const { pid } = req.params;

        const project = await Project.findByIdAndDelete(pid);

        if (!project) {
            return res.status(404).json({ error: 'Project not found' });
        }

        res.status(200).json({ message: 'Project deleted successfully' });
    } catch (error) {
        console.error("deleteProject Error:", error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.getAllProjects = async (req, res) => {
    try {
        const projects = await Project.find({ visibility: true });
        res.status(200).json(projects || []);
    } catch (error) {
        console.error("getAllProjects Error:", error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.voteProject = async (req, res) => {
    try {
        const { projectId, voteType, userId } = req.body;
        
        const project = await Project.findById(projectId);
        if (!project) {
            return res.status(404).json({ error: 'Project not found' });
        }
        
        let prev_project = project.toObject();

        project.votes.upvotes = (project.votes.upvotes || []).filter(id => 
            id && id.toString() !== String(userId)
        );
        project.votes.downvotes = (project.votes.downvotes || []).filter(id => 
            id && id.toString() !== String(userId)
        );
        
        if (voteType && userId) {
            const listKey = `${voteType}votes`;
            const currentList = prev_project.votes?.[listKey] || [];
            if (!currentList.map(id => id.toString()).includes(String(userId))) {
                project.votes[listKey].push(userId);
            }
        }

        project.voteCount = (project.votes.upvotes || []).length - (project.votes.downvotes || []).length;
        await project.save();

        res.json({ success: true, votes: project.votes, voteCount: project.voteCount });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getOneProject = async (req, res) => {
    try {
        const { pid } = req.params;
        if (pid && String(pid).startsWith('dummy-')) {
            const isReact = pid.includes('react') || pid.includes('zenith');
            return res.status(200).json({
                _id: pid,
                name: "Showcase Template",
                description: "Curated community showcase template",
                projectType: isReact ? "react" : "plain",
                chats: [],
                votes: { upvotes: [], downvotes: [] }
            });
        }
        const project = await Project.findById(pid);
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }
        res.status(200).json(project);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.copyProject = async (req, res) => {
    try {
        const { user } = req.body; 
        const { pid } = req.params; 
        
        const projectToCopy = await Project.findById(pid);
        if (!projectToCopy) {
            return res.status(404).json({ error: 'Project not found' });
        }

        let ownerId = user?._id || user || req.session?.user?._id || req.user?._id;
        if (!ownerId) {
            let defaultUser = await User.findOne({ email: "creator@genweb.studio" });
            if (!defaultUser) {
                defaultUser = await User.create({
                    name: "GenWeb Creator",
                    email: "creator@genweb.studio",
                    imageURL: "https://lh3.googleusercontent.com/a/default-user"
                });
            }
            ownerId = defaultUser._id;
        }

        const copiedProject = new Project({
            name: `${projectToCopy.name} (Copy)`,
            description: projectToCopy.description,
            visibility: false,
            projectType: projectToCopy.projectType,
            owner: ownerId, 
            users: [], 
            chats: projectToCopy.chats || [], 
            votes: { upvotes: [], downvotes: [] }, 
            voteCount: 0, 
        });

        await copiedProject.save();
        res.status(201).json({ message: 'Project copied successfully', project: copiedProject });
    } catch (error) {
        console.error("copyProject Error:", error);
        res.status(500).json({ error: 'Internal server error: ' + error.message });
    }
};
